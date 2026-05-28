import AnalyticsShell from './components/AnalyticsShell';
import {
  ranked,
  optimizerStats,
  pct,
  finalEpochAverage,
  epochAverages,
  trainEpochAverages,
} from '@/lib/analytics';
import { classScores, datasetStats, modelRuns } from '@/lib/flowersData';

export default function Home() {
  const best = ranked[0];
  const adam = optimizerStats.find((o) => o.opt === 'Adam')!;
  const sgd = optimizerStats.find((o) => o.opt === 'SGD')!;
  const topClasses = [...classScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  const timeMax = Math.max(...modelRuns.map((run) => run.trainingSeconds));
  const avgTrainTime =
    modelRuns.reduce((sum, run) => sum + run.trainingSeconds, 0) / modelRuns.length;

  return (
    <AnalyticsShell
      title={`${datasetStats.name} Results`}
      subtitle="Metadata-only summary of ANN, CNN, and MobileNetV2 baselines across optimizers"
    >
      <section className="grid gap-4 md:grid-cols-4">
        <Card title="Top Model" value={`${best.id} (${pct(best.valAcc)})`} />
        <Card title="Accuracy Lift" value={pct(best.gain)} />
        <Card title="Adam vs SGD" value={pct(adam.avgAcc - sgd.avgAcc)} />
        <Card title="Final Epoch Mean" value={pct(finalEpochAverage)} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Run Summary</h2>
        <p className="mt-2 text-sm text-slate-600">
          {ranked.length} runs across {datasetStats.classCount} IVD levels. Best validation
          accuracy is {pct(best.valAcc)} with a {pct(best.gap)} generalization gap and
          {best.trainingSeconds}s training time. Average training time is {avgTrainTime.toFixed(1)}s.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Dataset Snapshot</h2>
          <p className="mt-2 text-sm text-slate-600">
            Source: {datasetStats.source} · DOI: {datasetStats.doi}
          </p>
          <p className="text-xs text-slate-500">Published: {datasetStats.published}</p>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><span>Patients</span><span className="font-semibold">{datasetStats.patients.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Total slices</span><span className="font-semibold">{datasetStats.totalSlices.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Views</span><span className="font-semibold">{datasetStats.views.join(', ')}</span></div>
            <div className="flex justify-between"><span>Slice resolution</span><span className="font-semibold">{datasetStats.sliceResolution}</span></div>
            <div className="flex justify-between"><span>Bit depth</span><span className="font-semibold">{datasetStats.bitDepth}</span></div>
            <div className="flex justify-between"><span>Axial thickness</span><span className="font-semibold">{datasetStats.axialSliceThicknessMm} mm</span></div>
            <div className="flex justify-between"><span>Axial spacing</span><span className="font-semibold">{datasetStats.axialSpacingMm} mm</span></div>
            <div className="flex justify-between"><span>Pixel spacing</span><span className="font-semibold">{datasetStats.pixelSpacingMm} mm</span></div>
            <p className="text-xs text-slate-500">IVD levels: {datasetStats.classes.join(', ')}</p>
            <p className="text-xs text-slate-500">Metadata-only summary; no images were downloaded or processed.</p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Strongest Levels</h2>
          <div className="mt-4 space-y-3">
            {topClasses.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-xs"><span>{c.label}</span><span>{pct(c.score)}</span></div>
                <div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${c.score * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Quick Ranking</h2>
          <div className="mt-4 space-y-2">
            {ranked.map((r) => (
              <div key={r.id}>
                <div className="flex justify-between text-xs"><span>{r.id}</span><span>{pct(r.valAcc)}</span></div>
                <div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${r.valAcc * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Average Accuracy by Epoch</h2>
          <p className="mt-2 text-sm text-slate-600">
            Aggregated training vs validation accuracy trends.
          </p>
          <div className="mt-4 space-y-3">
            {epochAverages.map((valAcc, idx) => (
              <div key={`epoch-${idx}`} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Epoch {idx + 1}</span>
                  <span>Train {pct(trainEpochAverages[idx])} · Val {pct(valAcc)}</span>
                </div>
                <div className="h-3 rounded bg-slate-100">
                  <div
                    className="h-3 rounded bg-slate-300"
                    style={{ width: `${trainEpochAverages[idx] * 100}%` }}
                  />
                </div>
                <div className="h-2 rounded bg-slate-100">
                  <div
                    className="h-2 rounded bg-gradient-to-r from-indigo-500 to-blue-500"
                    style={{ width: `${valAcc * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Training Time Spread</h2>
          <p className="mt-2 text-sm text-slate-600">
            Relative training time per model run.
          </p>
          <div className="mt-4 space-y-2">
            {ranked.map((run) => (
              <div key={`time-${run.id}`}>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{run.id}</span>
                  <span>{run.trainingSeconds}s</span>
                </div>
                <div className="h-2 rounded bg-slate-100">
                  <div
                    className="h-2 rounded bg-amber-500"
                    style={{ width: `${(run.trainingSeconds / timeMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AnalyticsShell>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{title}</p><p className="mt-2 text-xl font-semibold">{value}</p></article>;
}
