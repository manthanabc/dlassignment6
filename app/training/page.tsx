import AnalyticsShell from '../components/AnalyticsShell';
import { modelRuns } from '@/lib/flowersData';
import { pct, epochAverages, trainEpochAverages, lossEpochAverages } from '@/lib/analytics';

export default function TrainingPage() {
  const maxLoss = Math.max(...lossEpochAverages);
  return (
    <AnalyticsShell title="Training Dynamics" subtitle="Epoch-wise validation progress on Flowers Recognition">
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Average Accuracy Trend</h2>
          <p className="mt-2 text-sm text-slate-600">Average training vs validation accuracy across all runs.</p>
          <div className="mt-4 space-y-3">
            {epochAverages.map((valAcc, idx) => (
              <div key={`avg-acc-${idx}`} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Epoch {idx + 1}</span>
                  <span>Train {pct(trainEpochAverages[idx])} · Val {pct(valAcc)}</span>
                </div>
                <div className="h-2 rounded bg-slate-100">
                  <div
                    className="h-2 rounded bg-slate-300"
                    style={{ width: `${trainEpochAverages[idx] * 100}%` }}
                  />
                </div>
                <div className="h-2 rounded bg-slate-100">
                  <div
                    className="h-2 rounded bg-emerald-500"
                    style={{ width: `${valAcc * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Average Validation Loss</h2>
          <p className="mt-2 text-sm text-slate-600">Lower loss indicates better calibration.</p>
          <div className="mt-4 space-y-3">
            {lossEpochAverages.map((valLoss, idx) => (
              <div key={`avg-loss-${idx}`}>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Epoch {idx + 1}</span>
                  <span>{valLoss.toFixed(3)}</span>
                </div>
                <div className="h-2 rounded bg-slate-100">
                  <div
                    className="h-2 rounded bg-rose-500"
                    style={{ width: `${Math.min(valLoss / maxLoss, 1) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modelRuns.map((run) => (
          <article key={run.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold">{run.id}</h3>
            <p className="mt-1 text-xs text-slate-600">
              Final Val {pct(run.points[run.points.length - 1].valAccuracy)} · Train {pct(run.points[run.points.length - 1].accuracy)} · Loss {run.points[run.points.length - 1].valLoss.toFixed(3)}
            </p>
            <div className="mt-3 space-y-2">
              {run.points.map((p) => (
                <div key={p.epoch} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Epoch {p.epoch}</span>
                    <span>Val {pct(p.valAccuracy)} · Loss {p.valLoss.toFixed(3)}</span>
                  </div>
                  <div className="h-2 rounded bg-slate-100">
                    <div className="h-2 rounded bg-emerald-500" style={{ width: `${p.valAccuracy * 100}%` }} />
                  </div>
                  <div className="h-2 rounded bg-slate-100">
                    <div className="h-2 rounded bg-rose-400" style={{ width: `${Math.min(p.valLoss / 2, 1) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </AnalyticsShell>
  );
}
