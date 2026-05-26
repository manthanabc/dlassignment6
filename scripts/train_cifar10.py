#!/usr/bin/env python3
import argparse
import json
import time
from pathlib import Path

import numpy as np
import tensorflow as tf

CLASS_NAMES = [
    "airplane",
    "automobile",
    "bird",
    "cat",
    "deer",
    "dog",
    "frog",
    "horse",
    "ship",
    "truck",
]

RUNS = [
    {"id": "ANN_Adam", "architecture": "ANN", "optimizer": "Adam"},
    {"id": "ANN_SGD", "architecture": "ANN", "optimizer": "SGD"},
    {"id": "CNN_Adam", "architecture": "CNN", "optimizer": "Adam"},
    {"id": "CNN_SGD", "architecture": "CNN", "optimizer": "SGD"},
    {"id": "Freeze_Adam", "architecture": "Freeze", "optimizer": "Adam"},
    {"id": "Freeze_SGD", "architecture": "Freeze", "optimizer": "SGD"},
    {"id": "Unfreeze_Adam", "architecture": "Unfreeze", "optimizer": "Adam"},
    {"id": "Unfreeze_SGD", "architecture": "Unfreeze", "optimizer": "SGD"},
]


def build_ann(input_shape: tuple[int, int, int], num_classes: int) -> tf.keras.Model:
    inputs = tf.keras.Input(shape=input_shape)
    x = tf.keras.layers.Rescaling(1.0 / 255.0)(inputs)
    x = tf.keras.layers.Flatten()(x)
    x = tf.keras.layers.Dense(512, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    x = tf.keras.layers.Dense(256, activation="relu")(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax")(x)
    return tf.keras.Model(inputs, outputs)


def build_cnn(input_shape: tuple[int, int, int], num_classes: int) -> tf.keras.Model:
    inputs = tf.keras.Input(shape=input_shape)
    x = tf.keras.layers.Rescaling(1.0 / 255.0)(inputs)
    x = tf.keras.layers.Conv2D(32, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.Conv2D(32, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    x = tf.keras.layers.Conv2D(64, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.Conv2D(64, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    x = tf.keras.layers.Conv2D(128, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    x = tf.keras.layers.Flatten()(x)
    x = tf.keras.layers.Dense(256, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax")(x)
    return tf.keras.Model(inputs, outputs)


def build_mobilenet(
    input_shape: tuple[int, int, int],
    num_classes: int,
    trainable_layers: int,
) -> tf.keras.Model:
    inputs = tf.keras.Input(shape=input_shape)
    x = tf.keras.layers.Resizing(96, 96)(inputs)
    x = tf.keras.layers.Rescaling(1.0 / 127.5, offset=-1)(x)

    base = tf.keras.applications.MobileNetV2(
        include_top=False,
        input_shape=(96, 96, 3),
        weights="imagenet",
    )
    if trainable_layers == 0:
        base.trainable = False
    else:
        base.trainable = True
        for layer in base.layers[:-trainable_layers]:
            layer.trainable = False

    x = base(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax")(x)
    return tf.keras.Model(inputs, outputs)


def optimizer_for(name: str) -> tf.keras.optimizers.Optimizer:
    if name == "Adam":
        return tf.keras.optimizers.Adam(learning_rate=1e-3)
    return tf.keras.optimizers.SGD(learning_rate=1e-2, momentum=0.9)


def load_data(limit: int | None, val_limit: int | None, seed: int):
    (x_train, y_train), (x_val, y_val) = tf.keras.datasets.cifar10.load_data()
    y_train = y_train.squeeze()
    y_val = y_val.squeeze()

    if limit:
        x_train = x_train[:limit]
        y_train = y_train[:limit]
    if val_limit:
        x_val = x_val[:val_limit]
        y_val = y_val[:val_limit]

    rng = np.random.default_rng(seed)
    indices = rng.permutation(len(x_train))
    x_train = x_train[indices]
    y_train = y_train[indices]

    return (x_train, y_train), (x_val, y_val)


def make_dataset(x: np.ndarray, y: np.ndarray, batch_size: int, shuffle: bool) -> tf.data.Dataset:
    ds = tf.data.Dataset.from_tensor_slices((x, y))
    if shuffle:
        ds = ds.shuffle(len(x), reshuffle_each_iteration=True)
    return ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)


def per_class_accuracy(model: tf.keras.Model, x: np.ndarray, y: np.ndarray, batch_size: int):
    preds = model.predict(x, batch_size=batch_size, verbose=0)
    y_pred = np.argmax(preds, axis=1)
    scores = []
    for idx in range(len(CLASS_NAMES)):
        mask = y == idx
        if mask.sum() == 0:
            scores.append(0.0)
            continue
        scores.append(float((y_pred[mask] == idx).mean()))
    return scores


def main() -> None:
    parser = argparse.ArgumentParser(description="Train CIFAR-10 models and export dashboard metrics.")
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--batch-size", type=int, default=64)
    parser.add_argument("--limit", type=int, default=None, help="Limit training samples for quick runs.")
    parser.add_argument("--val-limit", type=int, default=None, help="Limit validation samples for quick runs.")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "lib" / "cifar10Results.json",
    )
    args = parser.parse_args()

    tf.keras.utils.set_random_seed(args.seed)

    (x_train, y_train), (x_val, y_val) = load_data(args.limit, args.val_limit, args.seed)
    train_ds = make_dataset(x_train, y_train, args.batch_size, shuffle=True)
    val_ds = make_dataset(x_val, y_val, args.batch_size, shuffle=False)

    model_runs = []
    best_model = None
    best_val = -1.0

    for run in RUNS:
        if run["architecture"] == "ANN":
            model = build_ann(x_train.shape[1:], len(CLASS_NAMES))
        elif run["architecture"] == "CNN":
            model = build_cnn(x_train.shape[1:], len(CLASS_NAMES))
        elif run["architecture"] == "Freeze":
            model = build_mobilenet(x_train.shape[1:], len(CLASS_NAMES), trainable_layers=0)
        else:
            model = build_mobilenet(x_train.shape[1:], len(CLASS_NAMES), trainable_layers=20)

        model.compile(
            optimizer=optimizer_for(run["optimizer"]),
            loss=tf.keras.losses.SparseCategoricalCrossentropy(),
            metrics=["accuracy"],
        )

        start = time.perf_counter()
        history = model.fit(
            train_ds,
            validation_data=val_ds,
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
                "id": run["id"],
                "architecture": run["architecture"],
                "optimizer": run["optimizer"],
                "trainingSeconds": round(training_seconds),
                "points": points,
            }
        )

    class_scores = []
    if best_model is not None:
        scores = per_class_accuracy(best_model, x_val, y_val, args.batch_size)
        class_scores = [
            {"label": CLASS_NAMES[idx], "score": float(score)}
            for idx, score in enumerate(scores)
        ]

    results = {
        "dataset": {
            "name": "CIFAR-10 Object Recognition",
            "source": "TensorFlow Datasets",
            "trainImages": int(len(x_train)),
            "valImages": int(len(x_val)),
            "classCount": len(CLASS_NAMES),
            "classes": CLASS_NAMES,
        },
        "classScores": class_scores,
        "modelRuns": model_runs,
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(results, indent=2))
    print(f"Wrote results to {args.output}")


if __name__ == "__main__":
    main()
