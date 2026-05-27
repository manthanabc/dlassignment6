import AnalyticsShell from '../components/AnalyticsShell';
import { optimizerStats, pct, summaries } from '@/lib/analytics';

export default function OptimizersPage() {
  const maxAcc = Math.max(...optimizerStats.map((s) => s.avgAcc));
  const maxRunAcc = Math.max(...summaries.map((s) => s.valAcc));
  const optimizerGroups = ['Adam', 'SGD'].map((opt) => ({
    opt,
    runs: summaries.filter((s) => s.optimizer === opt),
  }));
  const architectureDelta = ['ANN', 'CNN', 'Freeze', 'Unfreeze'].map((arch) => {
    const adam = summaries.find((s) => s.architecture === arch && s.optimizer === 'Adam');
    const sgd = summaries.find((s) => s.architecture === arch && s.optimizer === 'SGD');
    const delta = (adam?.valAcc ?? 0) - (sgd?.valAcc ?? 0);
    return { arch, delta };
  });
  return (
    <AnalyticsShell title="Optimizer Analytics" subtitle="Aggregate comparison between Adam and SGD on Flowers Recognition">
      <section className="grid gap-4 md:grid-cols-2">
        {optimizerStats.map((row) => (
          <article key={row.opt} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">{row.opt}</h3>
            <p className="text-sm text-slate-600">Avg Accuracy: {pct(row.avgAcc)}</p>
            <p className="text-sm text-slate-600">Avg Gap: {pct(row.avgGap)}</p>
            <p className="text-sm text-slate-600">Avg Time: {row.avgTime.toFixed(1)}s</p>
            <div className="mt-3 h-3 rounded bg-slate-100"><div className="h-3 rounded bg-indigo-500" style={{ width: `${(row.avgAcc / maxAcc) * 100}%` }} /></div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Optimizer Lift by Architecture</h2>
        <p className="mt-2 text-sm text-slate-600">
          Positive values indicate Adam outperforms SGD on the same architecture.
        </p>
        <div className="mt-4 space-y-3">
          {architectureDelta.map((row) => (
            <div key={row.arch}>
              <div className="flex justify-between text-xs text-slate-600">
                <span>{row.arch}</span>
                <span>{pct(row.delta)}</span>
              </div>
              <div className="h-2 rounded bg-slate-100">
                <div
                  className="h-2 rounded bg-emerald-500"
                  style={{ width: `${Math.min(Math.abs(row.delta) * 100 * 2, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {optimizerGroups.map((group) => (
          <article key={group.opt} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">{group.opt} per-model breakdown</h3>
            <div className="mt-4 space-y-2">
              {group.runs.map((run) => (
                <div key={`${group.opt}-${run.id}`}>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{run.id}</span>
                    <span>{pct(run.valAcc)} · Gap {pct(run.gap)} · {run.trainingSeconds}s</span>
                  </div>
                  <div className="h-2 rounded bg-slate-100">
                    <div
                      className="h-2 rounded bg-gradient-to-r from-purple-500 to-indigo-500"
                      style={{ width: `${(run.valAcc / maxRunAcc) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-left text-slate-500">
                  <tr>
                    <th>Model</th>
                    <th>Val Acc</th>
                    <th>Train Acc</th>
                    <th>Gap</th>
                    <th>Train Time</th>
                  </tr>
                </thead>
                <tbody>
                  {group.runs.map((run) => (
                    <tr key={`table-${run.id}`} className="border-t border-slate-100">
                      <td className="py-2 font-medium">{run.id}</td>
                      <td>{pct(run.valAcc)}</td>
                      <td>{pct(run.trainAcc)}</td>
                      <td>{pct(run.gap)}</td>
                      <td>{run.trainingSeconds}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>
    </AnalyticsShell>
  );
}
