export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5 animate-pulse ${className}`}>
      <div className="h-3 w-24 bg-emerald-800/40 rounded mb-3" />
      <div className="h-8 w-20 bg-emerald-800/40 rounded mb-2" />
      <div className="h-3 w-16 bg-emerald-800/30 rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden animate-pulse">
      <div className="bg-emerald-800/20 p-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-3 bg-emerald-800/40 rounded flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-3 border-t border-emerald-800/20">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-3 bg-emerald-800/20 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5 animate-pulse">
      <div className="h-4 w-40 bg-emerald-800/40 rounded mb-6" />
      <div className="h-40 flex items-end gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-emerald-800/30 rounded-t"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}
