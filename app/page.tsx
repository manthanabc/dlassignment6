import AnalyticsShell from './components/AnalyticsShell';
import { ranked, optimizerStats, pct, finalEpochAverage } from '@/lib/analytics';
import { classScores, datasetStats } from '@/lib/cifar10Data';

export default function Home() {
  const best = ranked[0];
  const adam = optimizerStats.find((o) => o.opt === 'Adam')!;
  const sgd = optimizerStats.find((o) => o.opt === 'SGD')!;
  const topClasses = [...classScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <AnalyticsShell
      title={`${datasetStats.name} Results`}
      subtitle="Clean summary of ANN, CNN, and MobileNetV2 performance across optimizers"
    >
      <section className="grid gap-4 md:grid-cols-4">
        <Card title="Top Model" value={`${best.id} (${pct(best.valAcc)})`} />
        <Card title="Accuracy Lift" value={pct(best.gain)} />
        <Card title="Adam vs SGD" value={pct(adam.avgAcc - sgd.avgAcc)} />
        <Card title="Final Epoch Mean" value={pct(finalEpochAverage)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Dataset Snapshot</h2>
          <p className="mt-2 text-sm text-slate-600">Source: {datasetStats.source}</p>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><span>Train images</span><span className="font-semibold">{datasetStats.trainImages.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Validation images</span><span className="font-semibold">{datasetStats.valImages.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Classes</span><span className="font-semibold">{datasetStats.classCount}</span></div>
            <p className="text-xs text-slate-500">{datasetStats.classes.join(', ')}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Strongest Classes</h2>
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
    </AnalyticsShell>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{title}</p><p className="mt-2 text-xl font-semibold">{value}</p></article>;
}
