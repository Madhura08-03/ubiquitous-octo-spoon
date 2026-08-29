import * as React from "react"
import { UploadCloud, FileText, X } from "lucide-react"

import { cn } from "@/lib/utils"

export interface FileUploadProps {
  label?: string
  description?: string
  accept?: string
  maxSizeMB?: number
  multiple?: boolean
  disabled?: boolean
  error?: string
  required?: boolean
  onFilesSelected?: (files: File[]) => void
  className?: string
}

export function FileUpload({
  label,
  description,
  accept,
  maxSizeMB = 10,
  multiple = false,
  disabled = false,
  error,
  required = false,
  onFilesSelected,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const defaultDescription = description || `PDF, DOCX, PNG, or JPG up to ${maxSizeMB}MB`

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const newFiles = Array.from(files)
    setSelectedFiles(multiple ? (prev) => [...prev, ...newFiles] : newFiles)
    if (onFilesSelected) {
      onFilesSelected(newFiles)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && (
        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          if (!disabled) handleFiles(e.dataTransfer.files)
        }}
        onClick={() => {
          if (!disabled) inputRef.current?.click()
        }}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground/50 bg-muted/20",
          disabled && "opacity-50 pointer-events-none cursor-not-allowed",
          error && "border-destructive/60 bg-destructive/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />
        <div className="flex size-10 items-center justify-center rounded-full bg-background border border-border shadow-xs text-muted-foreground mb-3">
          <UploadCloud className="size-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">
          <span className="text-primary font-semibold underline underline-offset-2">
            Click to upload
          </span>{" "}
          or drag and drop
        </p>
        <p className="text-xs text-muted-foreground mt-1">{defaultDescription}</p>
      </div>

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}

      {selectedFiles.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {selectedFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between rounded-md border border-border bg-background p-2 text-xs"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <FileText className="size-4 text-primary shrink-0" />
                <span className="truncate font-medium text-foreground">{file.name}</span>
                <span className="text-muted-foreground shrink-0">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(idx)
                }}
                className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}