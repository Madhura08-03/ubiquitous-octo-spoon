import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  showHomeIcon?: boolean
}

export function Breadcrumbs({
  items,
  showHomeIcon = true,
  className,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn("flex items-center text-xs text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {showHomeIcon && (
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="size-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1 || item.current

          return (
            <li key={idx} className="inline-flex items-center gap-1.5">
              <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className="font-medium text-foreground truncate max-w-[200px]"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}