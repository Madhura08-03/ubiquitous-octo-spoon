"use client"

import * as React from "react"
import Image from "next/image"
import { Camera, Image as ImageIcon, Video } from "lucide-react"

import { ProblemMedia } from "@/services/problems/problem-types"

export interface ProblemMediaGalleryProps {
  media: ProblemMedia[]
  problemTitle: string
}

export function ProblemMediaGallery({ media, problemTitle }: ProblemMediaGalleryProps) {
  if (!media || media.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs text-left">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
          <Camera className="size-5 text-primary" />
          <span>Evidence & Observational Media</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Photographic and field documentation submitted by reporting community members.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {media.map((item, idx) => (
          <div
            key={idx}
            className="group overflow-hidden rounded-xl border border-border bg-muted/40 transition-all hover:border-primary/40 hover:shadow-xs"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <Image
                src={item.url}
                alt={item.alt || `${problemTitle} evidence photo ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-medium">
                {item.type === "video" ? (
                  <>
                    <Video className="size-3 text-rose-400" />
                    <span>Video Clip</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="size-3 text-lime-400" />
                    <span>Photo Evidence</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3.5 space-y-1 text-xs">
              <p className="font-semibold text-foreground">{item.caption || "Community Observational Image"}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.alt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}