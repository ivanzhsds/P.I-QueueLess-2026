function displayDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function MetricChart({ records, valueKey, label, unit }) {
  const points = [...records]
    .filter((record) => Number.isFinite(Number(record[valueKey])))
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .slice(-7);

  if (points.length === 0) return null;

  const values = points.map((record) => Number(record[valueKey]));
  const range = Math.max(...values) - Math.min(...values) || 1;
  const width = 320;
  const height = 132;
  const xPadding = points.length === 1 ? width / 2 : 14;
  const coords = values.map((value, index) => ({
    x: points.length === 1
      ? width / 2
      : xPadding + (index * (width - xPadding * 2)) / (points.length - 1),
    y: 14 + ((Math.max(...values) - value) / range) * 78,
  }));
  const line = coords.map(({ x, y }) => `${x},${y}`).join(' ');

  return (
    <section className="metric-chart card" aria-label={`Gráfico de ${label}`}>
      <div className="chart-heading">
        <div>
          <span className="eyebrow">REGISTROS DO PERÍODO</span>
          <h2>{label}</h2>
        </div>
        <span className="chart-unit">{unit}</span>
      </div>
      <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}, ${points.length} registros`}>
        {[0, 1, 2].map((index) => {
          const y = 14 + index * 39;
          return <line key={index} x1="8" y1={y} x2={width - 8} y2={y} className="chart-grid" />;
        })}
        {coords.length > 1 && <polyline points={line} className="chart-line" />}
        {coords.map(({ x, y }, index) => (
          <circle key={points[index].id || `${points[index].data}-${index}`} cx={x} cy={y} r="3.5" className="chart-point" />
        ))}
      </svg>
      <div className="chart-dates">
        {points.map((record, index) => (
          <span key={record.id || `${record.data}-${index}`}>{displayDate(record.data)}</span>
        ))}
      </div>
    </section>
  );
}
