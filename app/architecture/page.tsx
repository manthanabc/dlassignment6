import AnalyticsShell from '../components/AnalyticsShell';
import { architectureStats, pct, summaries } from '@/lib/analytics';

export default function ArchitecturePage() {
  const maxAcc = Math.max(...architectureStats.map((a) => a.avgAcc));
  return (
    <AnalyticsShell title="Architecture Tradeoffs" subtitle="Accuracy, time, and generalization profile by model family (Lumbar Spine MRI)">
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Average Validation Accuracy</h2>
          <div className="mt-4 space-y-2">
            {architectureStats.map((row) => (
              <div key={`acc-${row.arch}`}>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{row.arch}</span>
                  <span>{pct(row.avgAcc)}</span>
                </div>
                <div className="h-2 rounded bg-slate-100">
                  <div
                    className="h-2 rounded bg-sky-500"
                    style={{ width: `${(row.avgAcc / maxAcc) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Architecture Notes</h2>
          <p className="mt-2 text-sm text-slate-600">
            CNN and MobileNet variants improve validation accuracy at the cost of longer
            training time. Generalization gap indicates how close training and validation
            performance remain by the final epoch.
          </p>
          <div className="mt-4 space-y-3">
            {architectureStats.map((row) => (
              <div key={`gap-${row.arch}`} className="rounded-xl bg-slate-50 p-3">
                <div className="text-sm font-semibold">{row.arch}</div>
                <div className="text-xs text-slate-600">
                  Avg gap {pct(row.avgGap)} · Avg time {row.avgTime.toFixed(1)}s
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm overflow-x-auto">
        <h2 className="text-lg font-semibold">Per-model Breakdown</h2>
        <p className="mt-2 text-sm text-slate-600">
          Each architecture lists both optimizers with validation accuracy and training time.
        </p>
        <div className="mt-4 space-y-4">
          {['ANN', 'CNN', 'Freeze', 'Unfreeze'].map((arch) => {
            const rows = summaries.filter((s) => s.architecture === arch);
            return (
              <div key={`arch-${arch}`} className="rounded-xl border border-slate-100 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-700">{arch}</div>
                <div className="space-y-2">
                  {rows.map((row) => (
                    <div key={`arch-row-${row.id}`}>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>{row.id}</span>
                        <span>{pct(row.valAcc)} · Gap {pct(row.gap)} · {row.trainingSeconds}s</span>
                      </div>
                      <div className="h-2 rounded bg-slate-100">
                        <div
                          className="h-2 rounded bg-emerald-500"
                          style={{ width: `${row.valAcc * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500"><tr><th>Architecture</th><th>Avg Val Acc</th><th>Avg Gap</th><th>Avg Time</th></tr></thead>
          <tbody>
            {architectureStats.map((a) => (
              <tr key={a.arch} className="border-t border-slate-100"><td className="py-2 font-medium">{a.arch}</td><td>{pct(a.avgAcc)}</td><td>{pct(a.avgGap)}</td><td>{a.avgTime.toFixed(1)}s</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </AnalyticsShell>
  );
}
