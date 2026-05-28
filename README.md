# Lumbar Spine MRI Model Comparison Dashboard

A modern Next.js dashboard for comparing ANN, CNN, and MobileNet model baselines using metadata from the Lumbar Spine MRI Dataset. The UI emphasizes verbose analytics, per-model optimizer breakdowns, and chart-heavy summaries.

## Features

- **Results overview** with top model, optimizer lift, epoch trends, and training time spread
- **Model leaderboard** with accuracy distribution and generalization gap charts
- **Training dynamics** for epoch-wise accuracy and loss
- **Optimizer analytics** showing averages plus per-model performance
- **Architecture tradeoffs** with per-architecture detail and trend charts
- **Class-wise analytics** with confusion matrix and top confusions

## Dataset

Lumbar Spine MRI Dataset (Mendeley Data, Version 2). DOI: `10.17632/k57fr854j2.2`.

Key metadata highlights:
- 515 patients
- 48,345 MRI slices (axial and sagittal views)
- Mostly 320x320 resolution (some 320x310), 12-bit depth
- Axial slices: 4 mm thickness, 4.4 mm spacing, 0.6875 mm pixel spacing

This project uses **metadata only**. No MRI slices are downloaded or processed.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Results Data

The dashboard reads metadata and illustrative metrics from `lib/flowersResults.json`. Update this file directly if you need to change the dataset metadata or class labels.

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
├── flowersResults.json      # Metadata + illustrative metrics used by the UI
├── flowersData.ts           # Typed exports for the dashboard
├── analytics.ts             # Aggregations and summaries
scripts/
└── train_flowers.py         # Legacy training script (not used for metadata-only flow)
```

## Citation

If you use the dataset in your research, please cite the original papers listed in the dataset record.

## Building for Production

```bash
npm run build
npm start
```
