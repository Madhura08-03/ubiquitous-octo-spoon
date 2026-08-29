import * as React from "react"
import { cn } from "@/lib/utils"

export interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: boolean
  className?: string
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  error = false,
  className,
}: OTPInputProps) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

  const digits = React.useMemo(() => {
    return Array.from({ length }, (_, i) => value[i] || "")
  }, [value, length])

  const handleChange = (index: number, val: string) => {
    const char = val.slice(-1)
    if (!/^\d*$/.test(char)) return

    const newDigits = [...digits]
    newDigits[index] = char
    onChange?.(newDigits.join(""))

    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!pastedData) return

    onChange?.(pastedData)
    const nextEmptyIndex = pastedData.length < length ? pastedData.length : length - 1
    inputsRef.current[nextEmptyIndex]?.focus()
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          disabled={disabled}
          value={digits[idx] || ""}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className={cn(
            "flex size-11 items-center justify-center text-center font-mono text-lg font-bold rounded-lg border bg-background text-foreground transition-all outline-none",
            "focus:border-ring focus:ring-2 focus:ring-ring/40",
            error && "border-destructive text-destructive focus:ring-destructive/30",
            disabled && "opacity-50 cursor-not-allowed bg-muted"
          )}
          aria-label={`Digit ${idx + 1}`}
        />
      ))}
    </div>
  )
}