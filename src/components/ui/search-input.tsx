import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  shortcutHint?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, shortcutHint, placeholder = "Search challenges, projects, initiatives...", ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0)

    return (
      <div className={cn("relative flex items-center w-full", className)}>
        <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-9 pr-14 h-9 bg-background focus-visible:ring-1"
          {...props}
        />
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-0.5 text-muted-foreground hover:text-foreground rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
          {shortcutHint && !hasValue && (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-mono font-medium text-muted-foreground select-none pointer-events-none">
              {shortcutHint}
            </kbd>
          )}
        </div>
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"