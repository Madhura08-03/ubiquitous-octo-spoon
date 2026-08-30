"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Clock, Handshake } from "lucide-react"
import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth/auth-service"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import { IndustrySolutionInterest } from "@/services/industry/industry-collaboration-types"
import { CreateCollaborationDialog } from "@/features/industry/components/create-collaboration-dialog"

export default function IndustryInterestsInboxPage() {
  const router = useRouter()
  const [interests, setInterests] = React.useState<IndustrySolutionInterest[]>([])
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [selectedInterestForCollab, setSelectedInterestForCollab] = React.useState<IndustrySolutionInterest | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    try {
      const list = await industryCollaborationService.getIndustryInterests("ind_tata_steel")
      setInterests(list)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }
    loadData()
  }, [router, loadData])

  const filtered = interests.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "discussions") return item.status === "DISCUSSION" || item.status === "NEGOTIATION"
    if (activeTab === "active") return item.status === "ACTIVE" || item.status === "APPROVED"
    if (activeTab === "pending") return item.status === "INTEREST_EXPRESSED" || item.status === "UNIVERSITY_CONTACTED"
    return true
  })

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry Portal", href: "/industry/dashboard" },
            { label: "Sponsorship Inquiries" },
          ]}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Clock className="size-7 text-primary" />
              <span>Sponsorship Interests & Discussions</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Manage your organization&apos;s sponsorship expressions, university discussions, and MoU activations.
            </p>
          </div>

          <Link
            href="/industry/solutions"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold hover:bg-primary/90 gap-1"
          >
            <span>Explore More Solutions</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border pb-2 text-xs">
          {[
            { id: "all", label: `All (${interests.length})` },
            { id: "pending", label: "Pending Response" },
            { id: "discussions", label: "Active Discussions" },
            { id: "active", label: "MoU / Approved" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                "px-3 py-1.5 rounded-lg font-bold transition-all " +
                (activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground")
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">Loading inquiry inbox...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-2">
            <p className="font-bold text-foreground text-sm">No sponsorship inquiries in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-border bg-card space-y-3 hover:border-primary/40 transition-all text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Target Proposal
                    </span>
                    <h3 className="text-base font-bold text-foreground">{item.solutionTitle}</h3>
                    <span className="text-primary font-semibold text-xs block">{item.universityName}</span>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      item.status === "ACTIVE" || item.status === "APPROVED"
                        ? "bg-emerald-600 text-white text-[10px] font-bold"
                        : item.status === "DISCUSSION"
                        ? "bg-primary/10 text-primary border-primary/30 text-[10px] font-bold"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] font-bold"
                    }
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-foreground leading-relaxed">
                  {item.message}
                </div>

                {item.universityResponse && (
                  <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-primary text-[11px]">
                    <strong>University Feedback:</strong> {item.universityResponse}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground font-mono">
                  <span>Proposed: ₹{(item.proposedFunding / 100000).toFixed(1)}L</span>
                  <span>Timeline: {item.expectedDuration || "6 Months"}</span>
                  <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>

                  {item.status === "DISCUSSION" && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedInterestForCollab(item)}
                      className="text-xs font-bold bg-primary text-primary-foreground gap-1"
                    >
                      <Handshake className="size-3.5" />
                      <span>Formalize Collaboration</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedInterestForCollab && (
        <CreateCollaborationDialog
          isOpen={true}
          onClose={() => setSelectedInterestForCollab(null)}
          onSuccess={() => {
            loadData()
            setSelectedInterestForCollab(null)
          }}
          interest={selectedInterestForCollab}
        />
      )}

      <PublicFooter />
    </div>
  )
}
