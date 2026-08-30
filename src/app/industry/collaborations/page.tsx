"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Handshake, ChevronRight } from "lucide-react"
import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import { IndustryCollaboration } from "@/services/industry/industry-collaboration-types"

export default function IndustryCollaborationsDashboardPage() {
  const router = useRouter()
  const [collaborations, setCollaborations] = React.useState<IndustryCollaboration[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }
    industryCollaborationService.getCollaborations("ind_tata_steel").then((list) => {
      setCollaborations(list)
      setIsLoading(false)
    })
  }, [router])

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry Portal", href: "/industry/dashboard" },
            { label: "Active Collaborations" },
          ]}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Handshake className="size-7 text-primary" />
              <span>Institutional CSR Partnerships</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Track real-time implementation milestones, field deployments, and societal outcomes across sponsored university pilots.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">Loading collaborations...</div>
        ) : collaborations.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-3">
            <p className="font-bold text-foreground text-sm">No active collaborations found.</p>
            <Link
              href="/industry/solutions"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold px-4 py-2 hover:bg-primary/90"
            >
              Explore Solutions to Sponsor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {collaborations.map((col) => (
              <div
                key={col.id}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4 text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-mono capitalize text-primary border-primary/30">
                      Stage: {col.currentStage}
                    </Badge>
                    <span className="font-mono font-bold text-foreground text-sm">
                      ₹{(col.fundingAmount / 100000).toFixed(1)}L Grant
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block line-clamp-1">
                      Problem: {col.problemTitle}
                    </span>
                    <h3 className="text-base font-bold text-foreground">{col.title}</h3>
                    <span className="text-xs text-primary font-semibold block">University: {col.universityName}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {col.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-mono">Progress</span>
                      <span className="font-mono font-bold text-foreground">{col.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${col.progressPercentage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Target: {new Date(col.targetEndDate).toLocaleDateString()}
                  </span>

                  <Link
                    href={`/industry/collaborations/${col.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 hover:bg-primary/90 gap-1"
                  >
                    <span>View Workspace</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
