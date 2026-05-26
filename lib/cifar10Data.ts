import results from './cifar10Results.json';

export type TrainingPoint = {
  epoch: number;
  accuracy: number;
  valAccuracy: number;
  loss: number;
  valLoss: number;
};

export type ModelRun = {
  id: string;
  architecture: 'ANN' | 'CNN' | 'Freeze' | 'Unfreeze';
  optimizer: 'Adam' | 'SGD';
  trainingSeconds: number;
  points: TrainingPoint[];
};

export type DatasetStats = {
  name: string;
  source: string;
  trainImages: number;
  valImages: number;
  classCount: number;
  classes: string[];
};

export type ClassScore = {
  label: string;
  score: number;
};

export const datasetStats = results.dataset as DatasetStats;
export const modelRuns = results.modelRuns as ModelRun[];
export const classScores = results.classScores as ClassScore[];
