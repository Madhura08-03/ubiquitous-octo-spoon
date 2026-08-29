import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Activity,
  Award,
  Building2,
  Landmark,
  CircleDot,
  MinusCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type StatusType =
  | "verified"
  | "pending"
  | "rejected"
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "active"
  | "completed"
  | "in_progress"
  | "under_review"
  | "industry_sponsored"
  | "government_approved"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors border select-none",
  {
    variants: {
      status: {
        verified:
          "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/40",
        government_approved:
          "bg-emerald-500/15 text-emerald-800 border-emerald-600/40 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/50",
        completed:
          "bg-teal-500/10 text-teal-700 border-teal-500/30 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/40",
        active:
          "bg-lime-500/15 text-lime-800 border-lime-500/40 dark:bg-lime-500/20 dark:text-lime-300 dark:border-lime-500/50",
        in_progress:
          "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/40",
        under_review:
          "bg-amber-500/10 text-amber-800 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/40",
        pending:
          "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/40",
        industry_sponsored:
          "bg-indigo-500/10 text-indigo-700 border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/40",
        critical:
          "bg-rose-500/15 text-rose-800 border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/50",
        high:
          "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/40",
        medium:
          "bg-orange-500/10 text-orange-700 border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/40",
        low:
          "bg-slate-500/10 text-slate-700 border-slate-500/30 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/40",
        rejected:
          "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/40",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] [&_svg]:size-3",
        default: "px-2.5 py-0.5 text-xs [&_svg]:size-3.5",
        lg: "px-3 py-1 text-sm [&_svg]:size-4",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "default",
    },
  }
)

const STATUS_ICONS: Record<StatusType, React.ComponentType<{ className?: string }>> = {
  verified: CheckCircle2,
  government_approved: Landmark,
  completed: Award,
  active: Activity,
  in_progress: Clock,
  under_review: AlertCircle,
  pending: CircleDot,
  industry_sponsored: Building2,
  critical: AlertTriangle,
  high: AlertTriangle,
  medium: AlertCircle,
  low: MinusCircle,
  rejected: XCircle,
}

const STATUS_LABELS: Record<StatusType, string> = {
  verified: "Verified",
  government_approved: "Government Approved",
  completed: "Completed",
  active: "Active",
  in_progress: "In Progress",
  under_review: "Under Review",
  pending: "Pending",
  industry_sponsored: "Industry Sponsored",
  critical: "Critical Priority",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
  rejected: "Rejected",
}

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: StatusType
  showIcon?: boolean
  customLabel?: string
}

export function StatusBadge({
  status,
  size,
  showIcon = true,
  customLabel,
  className,
  ...props
}: StatusBadgeProps) {
  const Icon = STATUS_ICONS[status]
  const label = customLabel || STATUS_LABELS[status]

  return (
    <span
      className={cn(statusBadgeVariants({ status, size, className }))}
      {...props}
    >
      {showIcon && Icon && <Icon className="shrink-0" aria-hidden="true" />}
      <span>{label}</span>
    </span>
  )
}