export default function TableSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <div className="mb-4 grid grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 rounded-full bg-slate-800" />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-3"
          >
            <div className="h-9 w-9 rounded-full bg-slate-800" />
            <div className="h-4 rounded bg-slate-800" />
            <div className="h-4 rounded bg-slate-800" />
            <div className="h-4 rounded bg-slate-800" />
            <div className="h-4 rounded bg-slate-800" />
            <div className="h-8 rounded bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
