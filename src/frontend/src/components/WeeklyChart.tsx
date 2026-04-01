import type { DayScore } from "../hooks/useGrindStore";

interface WeeklyChartProps {
  dayScores: DayScore[];
  height?: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeeklyChart({ dayScores, height = 120 }: WeeklyChartProps) {
  const width = 400;
  const paddingX = 30;
  const paddingY = 16;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const scores = dayScores.slice(-7);
  const maxScore = 100;

  if (scores.length === 0) return null;

  const points = scores.map((ds, i) => {
    const x = paddingX + (i / (scores.length - 1 || 1)) * chartW;
    const y = paddingY + chartH - (ds.score / maxScore) * chartH;
    return { x, y, score: ds.score, date: ds.date };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `M ${points[0].x},${paddingY + chartH} ${points.map((p) => `L ${p.x},${p.y}`).join(" ")} L ${points[points.length - 1].x},${paddingY + chartH} Z`;

  const getDayLabel = (dateStr: string, index: number) => {
    const d = new Date(dateStr);
    return DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1] || DAYS[index % 7];
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
      aria-label="Weekly score trend chart"
    >
      <title>Weekly score trend</title>
      {[25, 50, 75, 100].map((v) => {
        const y = paddingY + chartH - (v / maxScore) * chartH;
        return (
          <line
            key={v}
            x1={paddingX}
            y1={y}
            x2={width - paddingX}
            y2={y}
            stroke="oklch(0.28 0.015 250)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        );
      })}
      <path d={areaPath} fill="oklch(0.65 0.22 250 / 0.08)" />
      <polyline
        points={polylinePoints}
        fill="none"
        stroke="oklch(0.65 0.22 250)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p) => (
        <circle
          key={p.date}
          cx={p.x}
          cy={p.y}
          r={5}
          fill="oklch(0.10 0.015 250)"
          stroke="oklch(0.65 0.22 250)"
          strokeWidth={2}
        />
      ))}
      {points.map((p, i) => (
        <text
          key={p.date}
          x={p.x}
          y={height - 2}
          textAnchor="middle"
          fontSize={10}
          fill="oklch(0.62 0.01 220)"
        >
          {getDayLabel(p.date, i)}
        </text>
      ))}
    </svg>
  );
}
