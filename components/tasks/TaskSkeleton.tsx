export default function TaskSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/40 p-4 animate-pulse">
      <div className="h-4 w-4 rounded bg-slate-700" />

      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-slate-700" />
        <div className="h-3 w-1/5 rounded bg-slate-800" />
      </div>

      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-slate-700" />
        <div className="h-8 w-8 rounded-lg bg-slate-700" />
        <div className="h-8 w-8 rounded-lg bg-slate-700" />
      </div>
    </div>
  );
}
