export function SkeletonLine({ width = "100%", height = 14, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

export function SkeletonCard({ height = 160 }) {
  return (
    <div className="glass-card" style={{ padding: 20, height }}>
      <SkeletonLine width="40%" height={12} style={{ marginBottom: 14 }} />
      <SkeletonLine width="70%" height={22} style={{ marginBottom: 10 }} />
      <SkeletonLine width="90%" height={12} style={{ marginBottom: 8 }} />
      <SkeletonLine width="60%" height={12} />
    </div>
  );
}

export function SkeletonGrid({ count = 4, height = 160 }) {
  return (
    <div className="row g-3">
      {Array.from({ length: count }).map((_, i) => (
        <div className="col-6 col-md-3" key={i}>
          <SkeletonCard height={height} />
        </div>
      ))}
    </div>
  );
}
