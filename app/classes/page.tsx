import AnalyticsShell from '../components/AnalyticsShell';
import { classScores, datasetStats, confusionMatrix } from '@/lib/flowersData';
import { pct } from '@/lib/analytics';

export default function ClassesPage() {
  const classes = datasetStats.classes;
  const classConfusions = classes.map((label, rowIdx) => {
    const row = confusionMatrix[rowIdx] || [];
    let topIdx = 0;
    let topVal = -1;
    row.forEach((value, idx) => {
      if (idx !== rowIdx && value > topVal) {
        topVal = value;
        topIdx = idx;
      }
    });
    return {
      label,
      recall: row[rowIdx] ?? 0,
      confusedWith: classes[topIdx] ?? 'n/a',
      confusionRate: topVal,
    };
  });

  return (
    <AnalyticsShell title="Class-wise Analytics" subtitle="Per-class validation accuracy from the best-performing run">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">Classes: {datasetStats.classes.join(', ')}</p>
        <div className="mt-4 space-y-3">
          {classScores.map((c) => (
            <div key={c.label}>
              <div className="mb-1 flex justify-between text-xs"><span>{c.label}</span><span>{pct(c.score)}</span></div>
              <div className="h-3 rounded bg-slate-100"><div className="h-3 rounded bg-gradient-to-r from-amber-500 to-rose-500" style={{ width: `${c.score * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Confusion Matrix (Normalized)</h2>
        <p className="mt-2 text-sm text-slate-600">
          Rows represent true labels, columns represent predicted labels. Values are row-normalized.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-[11px]">
            <thead>
              <tr>
                <th className="p-2 text-left text-slate-500">True \\ Pred</th>
                {classes.map((cls) => (
                  <th key={`pred-${cls}`} className="p-2 text-center text-slate-500">
                    {cls.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confusionMatrix.map((row, rowIdx) => (
                <tr key={`row-${classes[rowIdx]}`} className="border-t border-slate-100">
                  <td className="p-2 text-xs font-semibold text-slate-600">{classes[rowIdx]}</td>
                  {row.map((value, colIdx) => (
                    <td
                      key={`cell-${rowIdx}-${colIdx}`}
                      className="p-2 text-center font-medium"
                      style={{
                        backgroundColor: `rgba(30, 64, 175, ${Math.min(value * 0.9 + 0.05, 0.95)})`,
                        color: value > 0.5 ? '#fff' : '#1f2937',
                      }}
                    >
                      {(value * 100).toFixed(0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Top Confusions</h2>
        <p className="mt-2 text-sm text-slate-600">
          The most frequent misclassification for each class based on the confusion matrix.
        </p>
        <div className="mt-4 space-y-2">
          {classConfusions.map((row) => (
            <div key={`conf-${row.label}`}>
              <div className="flex justify-between text-xs text-slate-600">
                <span>{row.label}</span>
                <span>Recall {pct(row.recall)} · Confused with {row.confusedWith} ({pct(row.confusionRate)})</span>
              </div>
              <div className="h-2 rounded bg-slate-100">
                <div
                  className="h-2 rounded bg-indigo-500"
                  style={{ width: `${Math.min(row.confusionRate * 100 * 2, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </AnalyticsShell>
  );
}
