# CIFAR-10 Model Comparison Dashboard

A modern Next.js dashboard for comparing ANN, CNN, and MobileNetV2 models trained on the CIFAR-10 dataset. The UI focuses on clean summaries of validation accuracy, optimizer impact, and training dynamics.

## Features

- **Results overview** with top model, optimizer lift, and final epoch averages
- **Model leaderboard** showing validation accuracy, gap, and training time
- **Training dynamics** view for epoch-wise validation progress
- **Optimizer analytics** comparing Adam vs SGD
- **Architecture tradeoffs** across ANN, CNN, and transfer learning
- **Class-wise accuracy** for the strongest classes

## Dataset

CIFAR-10 object recognition (10 classes): airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Training Script

The dashboard reads data from `lib/cifar10Results.json`. Generate a fresh export by running the training script:

```bash
python scripts/train_cifar10.py --epochs 3 --output lib/cifar10Results.json
```

Dependencies for the training script:

```bash
pip install tensorflow numpy
```

Use `--limit` and `--val-limit` to run quicker experiments on smaller subsets.

## Project Structure

```
app/
├── page.tsx                 # Results overview
├── models/                  # Model leaderboard
├── training/                # Training dynamics
├── optimizers/              # Optimizer analytics
├── architecture/            # Architecture tradeoffs
├── classes/                 # Class-wise accuracy
lib/
├── cifar10Results.json      # Generated metrics used by the UI
├── cifar10Data.ts           # Typed exports for the dashboard
├── analytics.ts             # Aggregations and summaries
scripts/
└── train_cifar10.py         # Training + export pipeline
```

## Building for Production

```bash
npm run build
npm start
```
