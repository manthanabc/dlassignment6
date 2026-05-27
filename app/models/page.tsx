import AnalyticsShell from '../components/AnalyticsShell';
import { ranked, pct } from '@/lib/analytics';

export default function ModelsPage() {
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  const avgAcc = ranked.reduce((sum, row) => sum + row.valAcc, 0) / ranked.length;
  const maxGap = Math.max(...ranked.map((row) => row.gap));
  return (
    <AnalyticsShell title="Model Leaderboard" subtitle="Final validation metrics and generalization gap on Flowers Recognition">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Verbose Summary</h2>
        <p className="mt-2 text-sm text-slate-600">
          Best run is {best.id} at {pct(best.valAcc)} validation accuracy, while the
          least accurate run is {worst.id} at {pct(worst.valAcc)}. Average validation
          accuracy across all runs is {pct(avgAcc)}.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Validation Accuracy Distribution</h3>
          <div className="mt-4 space-y-2">
            {ranked.map((row) => (
              <div key={`acc-${row.id}`}>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{row.id}</span>
                  <span>{pct(row.valAcc)}</span>
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
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Generalization Gap</h3>
          <p className="mt-2 text-sm text-slate-600">
            Gap is computed as train accuracy minus validation accuracy.
          </p>
          <div className="mt-4 space-y-2">
            {ranked.map((row) => (
              <div key={`gap-${row.id}`}>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{row.id}</span>
                  <span>{pct(row.gap)}</span>
                </div>
                <div className="h-2 rounded bg-slate-100">
                  <div
                    className="h-2 rounded bg-rose-500"
                    style={{ width: `${(row.gap / maxGap) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500"><tr><th>Model</th><th>Val Acc</th><th>Train Acc</th><th>Gap</th><th>Val Loss</th><th>Train Time</th></tr></thead>
          <tbody>
            {ranked.map((m) => (
              <tr key={m.id} className="border-t border-slate-100">
                <td className="py-2 font-medium">{m.id}</td><td>{pct(m.valAcc)}</td><td>{pct(m.trainAcc)}</td><td>{pct(m.gap)}</td><td>{m.valLoss.toFixed(4)}</td><td>{m.trainingSeconds}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AnalyticsShell>
  );
}
