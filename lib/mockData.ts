// Mock data based on typical deep learning model accuracies
// These values represent validation accuracies from different model architectures and optimizers

export const modelResults: Record<string, number> = {
  'ANN_Adam': 0.652,
  'ANN_SGD': 0.618,
  'CNN_Adam': 0.748,
  'CNN_SGD': 0.712,
  'Freeze_Adam': 0.834,
  'Freeze_SGD': 0.789,
  'Unfreeze_Adam': 0.891,
  'Unfreeze_SGD': 0.856,
};

export const classNames = [
  'L3-L4',
  'L4-L5',
  'L5-S1',
];

export const modelDescriptions: Record<string, string> = {
  'ANN_Adam': 'Artificial Neural Network with Adam optimizer',
  'ANN_SGD': 'Artificial Neural Network with SGD optimizer',
  'CNN_Adam': 'Convolutional Neural Network with Adam optimizer',
  'CNN_SGD': 'Convolutional Neural Network with SGD optimizer',
  'Freeze_Adam': 'MobileNet with frozen base layers + Adam optimizer',
  'Freeze_SGD': 'MobileNet with frozen base layers + SGD optimizer',
  'Unfreeze_Adam': 'MobileNet with unfrozen layers + Adam optimizer',
  'Unfreeze_SGD': 'MobileNet with unfrozen layers + SGD optimizer',
};

// Training history for each model (3 epochs)
export const trainingHistory: Record<string, {
  epochs: number[];
  loss: number[];
  val_loss: number[];
  accuracy: number[];
  val_accuracy: number[];
  training_time: number; // in seconds
}> = {
  'ANN_Adam': {
    epochs: [1, 2, 3],
    loss: [1.45, 1.12, 0.98],
    val_loss: [1.52, 1.20, 1.05],
    accuracy: [0.42, 0.55, 0.62],
    val_accuracy: [0.40, 0.53, 0.652],
    training_time: 120,
  },
  'ANN_SGD': {
    epochs: [1, 2, 3],
    loss: [1.58, 1.28, 1.08],
    val_loss: [1.65, 1.35, 1.15],
    accuracy: [0.38, 0.52, 0.60],
    val_accuracy: [0.36, 0.50, 0.618],
    training_time: 115,
  },
  'CNN_Adam': {
    epochs: [1, 2, 3],
    loss: [1.28, 0.85, 0.62],
    val_loss: [1.35, 0.92, 0.70],
    accuracy: [0.52, 0.68, 0.75],
    val_accuracy: [0.50, 0.65, 0.748],
    training_time: 280,
  },
  'CNN_SGD': {
    epochs: [1, 2, 3],
    loss: [1.38, 0.95, 0.72],
    val_loss: [1.45, 1.02, 0.80],
    accuracy: [0.48, 0.65, 0.72],
    val_accuracy: [0.46, 0.62, 0.712],
    training_time: 275,
  },
  'Freeze_Adam': {
    epochs: [1, 2, 3],
    loss: [0.68, 0.42, 0.28],
    val_loss: [0.75, 0.50, 0.36],
    accuracy: [0.75, 0.82, 0.88],
    val_accuracy: [0.73, 0.80, 0.834],
    training_time: 420,
  },
  'Freeze_SGD': {
    epochs: [1, 2, 3],
    loss: [0.78, 0.52, 0.38],
    val_loss: [0.85, 0.60, 0.46],
    accuracy: [0.72, 0.79, 0.85],
    val_accuracy: [0.70, 0.77, 0.789],
    training_time: 425,
  },
  'Unfreeze_Adam': {
    epochs: [1, 2, 3],
    loss: [0.52, 0.28, 0.15],
    val_loss: [0.60, 0.36, 0.24],
    accuracy: [0.80, 0.88, 0.92],
    val_accuracy: [0.78, 0.86, 0.891],
    training_time: 580,
  },
  'Unfreeze_SGD': {
    epochs: [1, 2, 3],
    loss: [0.62, 0.38, 0.22],
    val_loss: [0.70, 0.46, 0.31],
    accuracy: [0.78, 0.85, 0.89],
    val_accuracy: [0.76, 0.83, 0.856],
    training_time: 585,
  },
};

// Model architecture specifications
export const modelSpecs: Record<string, {
  type: string;
  layers: number;
  parameters: string;
  optimizer: string;
  batch_size: number;
  epochs: number;
}> = {
  'ANN_Adam': {
    type: 'Artificial Neural Network',
    layers: 5,
    parameters: '3.3M',
    optimizer: 'Adam',
    batch_size: 32,
    epochs: 3,
  },
  'ANN_SGD': {
    type: 'Artificial Neural Network',
    layers: 5,
    parameters: '3.3M',
    optimizer: 'SGD',
    batch_size: 32,
    epochs: 3,
  },
  'CNN_Adam': {
    type: 'Convolutional Neural Network',
    layers: 8,
    parameters: '1.2M',
    optimizer: 'Adam',
    batch_size: 32,
    epochs: 3,
  },
  'CNN_SGD': {
    type: 'Convolutional Neural Network',
    layers: 8,
    parameters: '1.2M',
    optimizer: 'SGD',
    batch_size: 32,
    epochs: 3,
  },
  'Freeze_Adam': {
    type: 'Transfer Learning (MobileNet)',
    layers: 130,
    parameters: '3.5M',
    optimizer: 'Adam',
    batch_size: 32,
    epochs: 3,
  },
  'Freeze_SGD': {
    type: 'Transfer Learning (MobileNet)',
    layers: 130,
    parameters: '3.5M',
    optimizer: 'SGD',
    batch_size: 32,
    epochs: 3,
  },
  'Unfreeze_Adam': {
    type: 'Transfer Learning (MobileNet - Fine-tuned)',
    layers: 130,
    parameters: '3.5M',
    optimizer: 'Adam',
    batch_size: 32,
    epochs: 3,
  },
  'Unfreeze_SGD': {
    type: 'Transfer Learning (MobileNet - Fine-tuned)',
    layers: 130,
    parameters: '3.5M',
    optimizer: 'SGD',
    batch_size: 32,
    epochs: 3,
  },
};

// Per-class accuracy metrics
export const classAccuracy: Record<string, Record<string, number>> = {
  'ANN_Adam': {
    'L3-L4': 0.70,
    'L4-L5': 0.66,
    'L5-S1': 0.68,
  },
  'CNN_Adam': {
    'L3-L4': 0.78,
    'L4-L5': 0.74,
    'L5-S1': 0.76,
  },
  'Freeze_Adam': {
    'L3-L4': 0.84,
    'L4-L5': 0.81,
    'L5-S1': 0.83,
  },
  'Unfreeze_Adam': {
    'L3-L4': 0.88,
    'L4-L5': 0.85,
    'L5-S1': 0.87,
  },
  'Unfreeze_SGD': {
    'L3-L4': 0.85,
    'L4-L5': 0.82,
    'L5-S1': 0.84,
  },
  'Freeze_SGD': {
    'L3-L4': 0.80,
    'L4-L5': 0.77,
    'L5-S1': 0.79,
  },
  'CNN_SGD': {
    'L3-L4': 0.74,
    'L4-L5': 0.70,
    'L5-S1': 0.72,
  },
  'ANN_SGD': {
    'L3-L4': 0.67,
    'L4-L5': 0.63,
    'L5-S1': 0.65,
  },
};

// Optimizer comparison metrics
export const optimizerComparison: Record<string, {
  learning_rate: number;
  momentum?: number;
  avg_accuracy: number;
  avg_loss: number;
  training_efficiency: string;
}> = {
  'Adam': {
    learning_rate: 0.001,
    momentum: undefined,
    avg_accuracy: 0.806,
    avg_loss: 0.523,
    training_efficiency: 'Moderate',
  },
  'SGD': {
    learning_rate: 0.001,
    momentum: 0.9,
    avg_accuracy: 0.769,
    avg_loss: 0.621,
    training_efficiency: 'High',
  },
};

// Architecture comparison metrics
export const architectureComparison: Record<string, {
  avg_accuracy: number;
  inference_time: number; // ms per image
  model_size: string;
  parameters: string;
}> = {
  'ANN': {
    avg_accuracy: 0.635,
    inference_time: 5,
    model_size: '13.2 MB',
    parameters: '3.3M',
  },
  'CNN': {
    avg_accuracy: 0.730,
    inference_time: 8,
    model_size: '4.8 MB',
    parameters: '1.2M',
  },
  'Freeze': {
    avg_accuracy: 0.812,
    inference_time: 35,
    model_size: '14.0 MB',
    parameters: '3.5M',
  },
  'Unfreeze': {
    avg_accuracy: 0.874,
    inference_time: 38,
    model_size: '14.0 MB',
    parameters: '3.5M',
  },
};
