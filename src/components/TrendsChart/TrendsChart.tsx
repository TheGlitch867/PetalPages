import { readingTooltip, type TrendsDataPoint } from "../../utils/trendsUtils";
import { CRYING_SCALE } from "../../constants/crying";
import { FITNESS_SCALE } from "../../constants/fitness";
import { STRESS_SCALE } from "../../constants/stress";
import "./TrendsChart.css";

interface TrendsChartProps {
  points: TrendsDataPoint[];
  avgMood: number | null;
  avgAnxiety: number | null;
  avgStress: number | null;
  avgCrying: number | null;
  avgFitness: number | null;
  avgReading: number | null;
  avgSleep: number | null;
}

const WIDTH = 720;
const HEIGHT = 300;
const PAD = { top: 20, right: 56, bottom: 36, left: 36 };
const Y_MIN = 1;
const Y_MAX = 5;

type SeriesKey =
  | "mood"
  | "anxiety"
  | "stress"
  | "crying"
  | "fitness"
  | "reading"
  | "sleep";

function xPos(index: number, count: number): number {
  const innerW = WIDTH - PAD.left - PAD.right;
  if (count <= 1) return PAD.left + innerW / 2;
  return PAD.left + (index / (count - 1)) * innerW;
}

function yPos(value: number): number {
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const t = (value - Y_MIN) / (Y_MAX - Y_MIN);
  return PAD.top + innerH * (1 - t);
}

function buildPath(points: TrendsDataPoint[], key: SeriesKey): string {
  const segments: string[] = [];
  let started = false;

  points.forEach((point, index) => {
    const value = point[key];
    if (value == null) {
      started = false;
      return;
    }
    const cmd = started ? "L" : "M";
    segments.push(`${cmd}${xPos(index, points.length)},${yPos(value)}`);
    started = true;
  });

  return segments.join(" ");
}

function fitnessTooltip(point: TrendsDataPoint): string {
  if (point.fitnessActivity == null) return "";
  return FITNESS_SCALE.labels[point.fitnessActivity];
}

export function TrendsChart({
  points,
  avgMood,
  avgAnxiety,
  avgStress,
  avgCrying,
  avgFitness,
  avgReading,
  avgSleep,
}: TrendsChartProps) {
  const moodPath = buildPath(points, "mood");
  const anxietyPath = buildPath(points, "anxiety");
  const stressPath = buildPath(points, "stress");
  const cryingPath = buildPath(points, "crying");
  const fitnessPath = buildPath(points, "fitness");
  const readingPath = buildPath(points, "reading");
  const sleepPath = buildPath(points, "sleep");
  const gridLines = [1, 2, 3, 4, 5];

  const avgLines: { value: number | null; className: string }[] = [
    { value: avgMood, className: "trends-chart__avg--mood" },
    { value: avgAnxiety, className: "trends-chart__avg--anxiety" },
    { value: avgStress, className: "trends-chart__avg--stress" },
    { value: avgCrying, className: "trends-chart__avg--crying" },
    { value: avgFitness, className: "trends-chart__avg--fitness" },
    { value: avgReading, className: "trends-chart__avg--reading" },
    { value: avgSleep, className: "trends-chart__avg--sleep" },
  ];

  return (
    <div className="trends-chart">
      <div className="trends-chart__legend">
        <span className="trends-chart__legend-item">
          <span className="trends-chart__dot trends-chart__dot--mood" />
          Rate my day (1–5 stars)
        </span>
        <span className="trends-chart__legend-item">
          <span className="trends-chart__dot trends-chart__dot--stress" />
          Stress (1–5)
        </span>
        <span className="trends-chart__legend-item">
          <span className="trends-chart__dot trends-chart__dot--crying" />
          Crying (1–5)
        </span>
        <span className="trends-chart__legend-item">
          <span className="trends-chart__dot trends-chart__dot--sleep" />
          Sleep quality (1–5 stars)
        </span>
        <span className="trends-chart__legend-item">
          <span className="trends-chart__dot trends-chart__dot--anxiety" />
          Anxiety (1–5)
        </span>
        <span className="trends-chart__legend-item">
          <span className="trends-chart__dot trends-chart__dot--fitness" />
          Fitness intensity (1–5)
        </span>
        <span className="trends-chart__legend-item">
          <span className="trends-chart__dot trends-chart__dot--reading" />
          Reading level (1–5)
        </span>
      </div>

      <svg
        className="trends-chart__svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Wellness trends over time including rate my day, stress, crying, sleep, anxiety, fitness, and reading"
      >
        {gridLines.map((level) => (
          <g key={level}>
            <line
              x1={PAD.left}
              y1={yPos(level)}
              x2={WIDTH - PAD.right}
              y2={yPos(level)}
              className="trends-chart__grid"
            />
            <text
              x={PAD.left - 8}
              y={yPos(level) + 4}
              className="trends-chart__ylabel"
              textAnchor="end"
            >
              {level}
            </text>
          </g>
        ))}

        {avgLines.map(
          (line) =>
            line.value != null && (
              <line
                key={line.className}
                x1={PAD.left}
                y1={yPos(line.value)}
                x2={WIDTH - PAD.right}
                y2={yPos(line.value)}
                className={`trends-chart__avg ${line.className}`}
              />
            ),
        )}

        {sleepPath && (
          <path d={sleepPath} className="trends-chart__line trends-chart__line--sleep" />
        )}
        {readingPath && (
          <path
            d={readingPath}
            className="trends-chart__line trends-chart__line--reading"
          />
        )}
        {fitnessPath && (
          <path
            d={fitnessPath}
            className="trends-chart__line trends-chart__line--fitness"
          />
        )}
        {cryingPath && (
          <path d={cryingPath} className="trends-chart__line trends-chart__line--crying" />
        )}
        {stressPath && (
          <path d={stressPath} className="trends-chart__line trends-chart__line--stress" />
        )}
        {moodPath && (
          <path d={moodPath} className="trends-chart__line trends-chart__line--mood" />
        )}
        {anxietyPath && (
          <path
            d={anxietyPath}
            className="trends-chart__line trends-chart__line--anxiety"
          />
        )}

        {points.map((point, index) => (
          <g key={point.dateKey}>
            {point.mood != null && (
              <circle
                cx={xPos(index, points.length)}
                cy={yPos(point.mood)}
                r={4}
                className="trends-chart__point trends-chart__point--mood"
              >
                <title>
                  {point.label}: {point.mood} stars
                </title>
              </circle>
            )}
            {point.stress != null && (
              <circle
                cx={xPos(index, points.length)}
                cy={yPos(point.stress)}
                r={4}
                className="trends-chart__point trends-chart__point--stress"
              >
                <title>
                  {point.label}: {STRESS_SCALE.labels[point.stress]}
                </title>
              </circle>
            )}
            {point.crying != null && (
              <circle
                cx={xPos(index, points.length)}
                cy={yPos(point.crying)}
                r={4}
                className="trends-chart__point trends-chart__point--crying"
              >
                <title>
                  {point.label}: {CRYING_SCALE.labels[point.crying]}
                </title>
              </circle>
            )}
            {point.anxiety != null && (
              <circle
                cx={xPos(index, points.length)}
                cy={yPos(point.anxiety)}
                r={4}
                className="trends-chart__point trends-chart__point--anxiety"
              >
                <title>
                  {point.label}: anxiety {point.anxiety}
                </title>
              </circle>
            )}
            {point.fitness != null && (
              <circle
                cx={xPos(index, points.length)}
                cy={yPos(point.fitness)}
                r={4}
                className="trends-chart__point trends-chart__point--fitness"
              >
                <title>
                  {point.label}: {fitnessTooltip(point)}
                </title>
              </circle>
            )}
            {point.reading != null && point.readingTier != null && (
              <circle
                cx={xPos(index, points.length)}
                cy={yPos(point.reading)}
                r={4}
                className="trends-chart__point trends-chart__point--reading"
              >
                <title>
                  {point.label}: {readingTooltip(point.readingTier)}
                </title>
              </circle>
            )}
            {point.sleep != null && (
              <circle
                cx={xPos(index, points.length)}
                cy={yPos(point.sleep)}
                r={4}
                className="trends-chart__point trends-chart__point--sleep"
              >
                <title>
                  {point.label}: {point.sleep} stars
                  {point.sleepHours != null ? ` · ${point.sleepHours} hrs` : ""}
                </title>
              </circle>
            )}
            {(index === 0 ||
              index === points.length - 1 ||
              points.length <= 7 ||
              index % Math.ceil(points.length / 7) === 0) && (
              <text
                x={xPos(index, points.length)}
                y={HEIGHT - 10}
                className="trends-chart__xlabel"
                textAnchor="middle"
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
