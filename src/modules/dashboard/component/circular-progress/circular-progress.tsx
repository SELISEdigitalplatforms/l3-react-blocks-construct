/**
 * CircularProgress component displays a circular progress bar that visually represents a percentage.
 * The component allows customization of the progress bar's stroke color.
 * @example
 * return (
 *   <CircularProgress percentage={75} strokeColor="#4CAF50" />
 * )
 *
 */

interface CircularProgressBarProps {
  percentage: number;
  strokeColor?: string;
}

export const CircularProgress = (props: CircularProgressBarProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (props.percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" strokeWidth="8" fill="transparent" stroke="#F3F5F9" />
        <circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="8"
          fill="transparent"
          stroke={props.strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-medium-emphasis">
        {props.percentage}%
      </p>
    </div>
  );
};
