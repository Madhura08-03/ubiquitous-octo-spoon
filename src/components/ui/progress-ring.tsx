import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  variant?: "default" | "lime" | "teal"
}

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  showValue = true,
  variant = "default",
  className,
  ...props
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference

  const strokeColorClass =
    variant === "lime"
      ? "text-lime-500"
      : variant === "teal"
      ? "text-teal-500"
      : "text-primary"

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        className="rotate-[-90deg] transition-all"
        width={size}
        height={size}
      >
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("stroke-current transition-all duration-500 ease-out", strokeColorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showValue && (
        <span className="absolute font-sans text-xs font-bold text-foreground">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  )
}