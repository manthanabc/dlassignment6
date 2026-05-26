import AnalyticsShell from '../components/AnalyticsShell';
import { classScores, datasetStats } from '@/lib/cifar10Data';
import { pct } from '@/lib/analytics';

export default function ClassesPage() {
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
    </AnalyticsShell>
  );
}
