# Flowers Model Comparison Dashboard

A modern Next.js dashboard for comparing ANN, CNN, and MobileNet models trained on the Kaggle Flowers Recognition dataset. The UI emphasizes verbose analytics, per-model optimizer breakdowns, and chart-heavy summaries.

## Features

- **Results overview** with top model, optimizer lift, epoch trends, and training time spread
- **Model leaderboard** with accuracy distribution and generalization gap charts
- **Training dynamics** for epoch-wise accuracy and loss
- **Optimizer analytics** showing averages plus per-model performance
- **Architecture tradeoffs** with per-architecture detail and trend charts
- **Class-wise analytics** with confusion matrix and top confusions

## Dataset

Flowers Recognition (Kaggle `alxmamaev/flowers-recognition`) with 5 classes: daisy, dandelion, rose, sunflower, tulip.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Training Script

The dashboard reads data from `lib/flowersResults.json`. Generate a fresh export by running the training script:

```bash
python scripts/train_flowers.py --epochs 3 --output lib/flowersResults.json
```

Dependencies for the training script:

```bash
pip install tensorflow numpy kagglehub
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
├── flowersResults.json      # Generated metrics used by the UI
├── flowersData.ts           # Typed exports for the dashboard
├── analytics.ts             # Aggregations and summaries
scripts/
└── train_flowers.py         # Training + export pipeline
```

## Building for Production

```bash
npm run build
npm start
```
