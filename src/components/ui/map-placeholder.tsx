import * as React from "react"
import { MapPin, Plus, Minus, Navigation, Compass } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface MapPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  latitude?: number
  longitude?: number
  locationName?: string
  district?: string
  zoom?: number
  height?: string | number
  showControls?: boolean
}

export function MapPlaceholder({
  latitude = 23.3441,
  longitude = 85.3096,
  locationName = "Ranchi, Jharkhand",
  district = "Ranchi District",
  zoom = 12,
  height = "320px",
  showControls = true,
  className,
  ...props
}: MapPlaceholderProps) {
  const [currentZoom, setCurrentZoom] = React.useState(zoom)
  const [mapType, setMapType] = React.useState<"vector" | "satellite">("vector")

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border bg-slate-950 text-white select-none shadow-inner",
        className
      )}
      style={{ height }}
      {...props}
    >
      {/* Visual Map Pattern Background */}
      <div
        className={cn(
          "absolute inset-0 opacity-40 transition-opacity duration-300",
          mapType === "satellite" ? "opacity-25" : "opacity-40"
        )}
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(132, 204, 22, 0.15) 0%, transparent 60%),
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 32px 32px, 32px 32px",
        }}
      />

      {/* Simulated Topographic / Regional Grid Contours */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,100 Q150,50 300,120 T600,100 T900,180 T1200,80"
          fill="none"
          stroke="oklch(0.68 0.16 130)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M0,220 Q200,280 450,200 T800,260 T1200,210"
          fill="none"
          stroke="oklch(0.62 0.11 200)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Center Marker */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-lime-500/20 border border-lime-400/60 shadow-lg shadow-lime-500/30 text-lime-400">
            <MapPin className="size-6 drop-shadow" />
          </div>
          <div className="mt-1.5 rounded-md bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-center border border-slate-700 shadow-md">
            <p className="text-[11px] font-bold text-white leading-none">{locationName}</p>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">{district}</p>
          </div>
        </div>
      </div>

      {/* Header Info Pill */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-lg bg-slate-900/85 backdrop-blur-md px-3 py-1.5 border border-slate-700 text-xs shadow-md">
        <Compass className="size-3.5 text-lime-400" />
        <span className="font-mono text-[11px] text-slate-200">
          {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
        </span>
        <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2">
          Zoom: {currentZoom}x
        </span>
      </div>

      {/* Layer Toggle */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-lg bg-slate-900/85 backdrop-blur-md p-1 border border-slate-700 shadow-md">
        <button
          type="button"
          onClick={() => setMapType("vector")}
          className={cn(
            "px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer",
            mapType === "vector" ? "bg-lime-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
          )}
        >
          Terrain
        </button>
        <button
          type="button"
          onClick={() => setMapType("satellite")}
          className={cn(
            "px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer",
            mapType === "satellite" ? "bg-lime-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
          )}
        >
          Satellite
        </button>
      </div>

      {/* Zoom Controls */}
      {showControls && (
        <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-1 rounded-lg bg-slate-900/85 backdrop-blur-md p-1 border border-slate-700 shadow-md">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setCurrentZoom((z) => Math.min(18, z + 1))}
            className="size-6 text-slate-200 hover:bg-slate-800 hover:text-white"
            aria-label="Zoom in"
          >
            <Plus className="size-3.5" />
          </Button>
          <div className="h-px bg-slate-700 w-full" />
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setCurrentZoom((z) => Math.max(1, z - 1))}
            className="size-6 text-slate-200 hover:bg-slate-800 hover:text-white"
            aria-label="Zoom out"
          >
            <Minus className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Footer Banner */}
      <div className="absolute left-3 bottom-3 z-10 flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950/60 backdrop-blur-xs px-2 py-0.5 rounded">
        <Navigation className="size-3 text-teal-400" />
        <span>Mapbox GIS Integration &bull; Ready for GeoJSON feeds</span>
      </div>
    </div>
  )
}