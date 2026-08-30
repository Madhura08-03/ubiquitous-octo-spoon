"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryService } from "@/services/industry/industry-service"
import { CSRCollaboration } from "@/services/industry/industry-types"
import { IndustryCollaborationCard } from "@/features/industry/components/industry-collaboration-card"

export default function IndustryCollaborationsPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [collaborations, setCollaborations] = React.useState<CSRCollaboration[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const list = await industryService.getCollaborations()
      setCollaborations(list)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "industry") {
      router.replace("/login")
      return
    }

    loadData()
  }, [router, loadData])

  if (!currentUser || currentUser.role !== "industry") return null

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col text-left">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/industry/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>CSR Dashboard</span>
          </Link>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs font-bold text-primary font-mono">
            Active CSR Collaborations
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="space-y-1 border-b border-border pb-4">
          <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
            PROJECT PORTFOLIO
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Active CSR Sponsored Projects
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor ground execution, milestone sign-offs, and beneficiary reach for corporate funded initiatives.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading CSR collaborations...
          </div>
        ) : collaborations.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
            No active CSR collaborations found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborations.map((collab) => (
              <IndustryCollaborationCard key={collab.id} collaboration={collab} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
