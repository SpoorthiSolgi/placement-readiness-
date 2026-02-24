import { useMemo } from 'react';

function CircularProgress({ score, size = 200, strokeWidth = 12 }) {
  // Clamp score between 0 and 100
  const clampedScore = useMemo(() => {
    return Math.max(0, Math.min(100, score));
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Calculate color based on score
  const getColor = (value) => {
    if (value >= 80) return '#22c55e'; // green-500
    if (value >= 60) return '#3b82f6'; // blue-500
    if (value >= 40) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const progressColor = getColor(clampedScore);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">{clampedScore}</span>
        </div>
      </div>
      <p className="mt-4 text-lg font-medium text-gray-600">Readiness Score</p>
    </div>
  );
}

export default CircularProgress;
