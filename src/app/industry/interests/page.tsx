"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryService } from "@/services/industry/industry-service"
import { SponsorshipInterest } from "@/services/industry/industry-types"

export default function IndustryInterestsPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const [interests, setInterests] = React.useState<SponsorshipInterest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const list = await industryService.getSponsorshipInterests()
      setInterests(list)
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

  const handleWithdraw = async (id: string) => {
    await industryService.withdrawSponsorshipInterest(id)
    toast.success("Sponsorship Interest Withdrawn")
    loadData()
  }

  const getStatusBadge = (status: SponsorshipInterest["status"]) => {
    switch (status) {
      case "converted_to_sponsorship":
      case "accepted":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold bg-emerald-500/10">ACCEPTED / SPONSORED</Badge>
      case "under_review":
        return <Badge variant="outline" className="border-indigo-500/40 text-indigo-800 dark:text-indigo-300 font-mono text-[9px] font-bold bg-indigo-500/10">UNDER REVIEW</Badge>
      case "declined":
        return <Badge variant="outline" className="border-rose-500/40 text-rose-800 dark:text-rose-300 font-mono text-[9px] font-bold bg-rose-500/10">DECLINED</Badge>
      case "withdrawn":
        return <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[9px]">WITHDRAWN</Badge>
      default:
        return <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono text-[9px] font-bold bg-amber-500/10">PENDING REVIEW</Badge>
    }
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
            Sponsorship Interests
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="space-y-1 border-b border-border pb-4">
          <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
            CSR GRANT PROPOSALS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Sponsorship Expressions & Status
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track corporate grant intents, university acknowledgments, and Government sanction orders.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading sponsorship records...
          </div>
        ) : interests.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
            You have not submitted any sponsorship interests yet.
          </div>
        ) : (
          <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            {interests.map((int) => (
              <div key={int.id} className="p-5 space-y-3 hover:bg-muted/10 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{int.id}</span>
                    {getStatusBadge(int.status)}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {new Date(int.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-xs text-primary flex items-center gap-1">
                    <Building className="size-3" />
                    <span>{int.universityName}</span>
                  </p>
                  <h4 className="font-bold text-sm text-foreground">{int.solutionTitle}</h4>
                  <p className="text-xs text-muted-foreground">Challenge: {int.problemTitle}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-xl border border-border bg-muted/20 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Grant Amount</span>
                    <p className="font-bold text-foreground font-mono">{int.fundingAmount}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Grant Type</span>
                    <p className="font-bold text-foreground capitalize">{int.supportType.replace("_", " ")}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Timeline</span>
                    <p className="font-bold text-foreground">{int.timeline}</p>
                  </div>
                </div>

                {int.universityResponse && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-xs">
                    <strong>University Note:</strong> {int.universityResponse}
                  </div>
                )}

                {int.status === "submitted" && (
                  <div className="pt-1 flex items-center justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleWithdraw(int.id)}
                      className="text-xs h-7 text-destructive hover:bg-destructive/10 gap-1 font-semibold"
                    >
                      <Trash2 className="size-3" />
                      <span>Withdraw Interest</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
