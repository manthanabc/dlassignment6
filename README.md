# CIFAR-10 Model Comparison Dashboard

A modern Next.js dashboard for comparing ANN, CNN, and MobileNetV2 models trained on the CIFAR-10 dataset. The UI emphasizes verbose analytics, per-model optimizer breakdowns, and chart-heavy summaries.

## Features

- **Results overview** with top model, optimizer lift, epoch trends, and training time spread
- **Model leaderboard** with accuracy distribution and generalization gap charts
- **Training dynamics** for epoch-wise accuracy and loss
- **Optimizer analytics** showing averages plus per-model performance
- **Architecture tradeoffs** with per-architecture detail and trend charts
- **Class-wise analytics** with confusion matrix and top confusions

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
