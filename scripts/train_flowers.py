#!/usr/bin/env python3
import argparse
import json
import math
import os
import time
from pathlib import Path

import kagglehub
import numpy as np
import tensorflow as tf


def download_dataset() -> str:
    path = kagglehub.dataset_download("alxmamaev/flowers-recognition")
    subdir = os.listdir(path)[0]
    return os.path.join(path, subdir)


def build_ann(num_classes: int) -> tf.keras.Model:
    return tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(128, 128, 3)),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dense(num_classes, activation="softmax"),
        ]
    )


def build_cnn(num_classes: int) -> tf.keras.Model:
    return tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(128, 128, 3)),
            tf.keras.layers.Conv2D(32, (3, 3), activation="relu"),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dense(num_classes, activation="softmax"),
        ]
    )


def build_freeze(num_classes: int) -> tf.keras.Model:
    base = tf.keras.applications.MobileNet(
        weights="imagenet",
        include_top=False,
        input_shape=(128, 128, 3),
    )
    for layer in base.layers:
        layer.trainable = False

    x = tf.keras.layers.GlobalAveragePooling2D()(base.output)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    out = tf.keras.layers.Dense(num_classes, activation="softmax")(x)
    return tf.keras.Model(base.input, out)


def build_unfreeze(num_classes: int) -> tf.keras.Model:
    base = tf.keras.applications.MobileNet(
        weights="imagenet",
        include_top=False,
        input_shape=(128, 128, 3),
    )
    for layer in base.layers[:-20]:
        layer.trainable = False
    for layer in base.layers[-20:]:
        layer.trainable = True

    x = tf.keras.layers.GlobalAveragePooling2D()(base.output)
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    out = tf.keras.layers.Dense(num_classes, activation="softmax")(x)
    return tf.keras.Model(base.input, out)


def load_data(dataset_path: str, batch_size: int, seed: int):
    train_gen = tf.keras.preprocessing.image.ImageDataGenerator(
        rescale=1.0 / 255.0,
        validation_split=0.2,
        rotation_range=20,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.15,
        shear_range=0.1,
        horizontal_flip=True,
    )
    val_gen = tf.keras.preprocessing.image.ImageDataGenerator(
        rescale=1.0 / 255.0,
        validation_split=0.2,
    )

    train = train_gen.flow_from_directory(
        dataset_path,
        target_size=(128, 128),
        batch_size=batch_size,
        subset="training",
        seed=seed,
        class_mode="categorical",
        shuffle=True,
    )
    val = val_gen.flow_from_directory(
        dataset_path,
        target_size=(128, 128),
        batch_size=batch_size,
        subset="validation",
        seed=seed,
        class_mode="categorical",
        shuffle=False,
    )
    return train, val


def compute_confusion_matrix(model: tf.keras.Model, val, class_count: int):
    val.reset()
    steps = math.ceil(val.samples / val.batch_size)
    preds = model.predict(val, steps=steps, verbose=0)
    y_pred = np.argmax(preds, axis=1)[: val.samples]
    y_true = val.classes[: val.samples]
    matrix = np.zeros((class_count, class_count), dtype=np.int64)
    for true_label, pred_label in zip(y_true, y_pred):
        matrix[true_label, pred_label] += 1
    row_sums = matrix.sum(axis=1, keepdims=True)
    normalized = matrix / np.maximum(row_sums, 1)
    return normalized.round(4).tolist()


def per_class_accuracy(model: tf.keras.Model, val, class_count: int):
    val.reset()
    steps = math.ceil(val.samples / val.batch_size)
    preds = model.predict(val, steps=steps, verbose=0)
    y_pred = np.argmax(preds, axis=1)[: val.samples]
    y_true = val.classes[: val.samples]
    scores = []
    for idx in range(class_count):
        mask = y_true == idx
        if mask.sum() == 0:
            scores.append(0.0)
        else:
            scores.append(float((y_pred[mask] == idx).mean()))
    return scores


def main() -> None:
    parser = argparse.ArgumentParser(description="Train flowers models and export dashboard metrics.")
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "lib" / "flowersResults.json",
    )
    args = parser.parse_args()

    tf.keras.utils.set_random_seed(args.seed)
    dataset_path = download_dataset()
    train, val = load_data(dataset_path, args.batch_size, args.seed)

    class_names = list(train.class_indices.keys())
    num_classes = len(class_names)

    model_builders = {
        "ANN": build_ann,
        "CNN": build_cnn,
        "Freeze": build_freeze,
        "Unfreeze": build_unfreeze,
    }
    optimizers = {
        "Adam": tf.keras.optimizers.Adam,
        "SGD": tf.keras.optimizers.SGD,
    }

    model_runs = []
    best_model = None
    best_val = -1.0

    for model_name, builder in model_builders.items():
        for opt_name, opt_class in optimizers.items():
            print(f"\nTraining: {model_name} + {opt_name}")
            model = builder(num_classes)
            optimizer = opt_class(learning_rate=0.001)
            model.compile(
                optimizer=optimizer,
                loss="categorical_crossentropy",
                metrics=["accuracy"],
            )

            start = time.perf_counter()
            history = model.fit(
                train,
                validation_data=val,
                epochs=args.epochs,
                verbose=2,
            )
            training_seconds = time.perf_counter() - start

            points = []
            for i in range(args.epochs):
                points.append(
                    {
                        "epoch": i + 1,
                        "accuracy": float(history.history["accuracy"][i]),
                        "valAccuracy": float(history.history["val_accuracy"][i]),
                        "loss": float(history.history["loss"][i]),
                        "valLoss": float(history.history["val_loss"][i]),
                    }
                )

            last_val = points[-1]["valAccuracy"]
            if last_val > best_val:
                best_val = last_val
                best_model = model

            model_runs.append(
                {
                    "id": f"{model_name}_{opt_name}",
                    "architecture": model_name,
                    "optimizer": opt_name,
                    "trainingSeconds": round(training_seconds),
                    "points": points,
                }
            )

    class_scores = []
    confusion_matrix = []
    if best_model is not None:
        scores = per_class_accuracy(best_model, val, num_classes)
        class_scores = [
            {"label": class_names[idx], "score": float(score)}
            for idx, score in enumerate(scores)
        ]
        confusion_matrix = compute_confusion_matrix(best_model, val, num_classes)

    results = {
        "dataset": {
            "name": "Flowers Recognition",
            "source": "Kaggle (alxmamaev/flowers-recognition)",
            "trainImages": int(train.samples),
            "valImages": int(val.samples),
            "classCount": num_classes,
            "classes": class_names,
        },
        "classScores": class_scores,
        "confusionMatrix": confusion_matrix,
        "modelRuns": model_runs,
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(results, indent=2))
    print(f"Wrote results to {args.output}")


if __name__ == "__main__":
    main()
