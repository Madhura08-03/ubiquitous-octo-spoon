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
import { IndustryProfile } from "@/services/industry/industry-types"
import { IndustryProfileForm } from "@/features/industry/components/industry-profile-form"

export default function IndustryProfilePage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [profile, setProfile] = React.useState<IndustryProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const prof = await industryService.getIndustryProfile()
      setProfile(prof)
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-xs text-muted-foreground">
        Loading Industry CSR Profile...
      </div>
    )
  }

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
            CSR Profile & Mandate
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto">
        <div className="space-y-1 border-b border-border pb-4">
          <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
            ORGANIZATION SETTINGS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            CSR Partner Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your statutory CSR focus areas, preferred domains, operating districts, and contact designations.
          </p>
        </div>

        {profile && <IndustryProfileForm profile={profile} onSaved={setProfile} />}
      </main>
    </div>
  )
}
