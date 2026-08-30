"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Sparkles,
  ArrowLeft,
  Lock,
  Award,
  Users,
  GraduationCap,
  Send,
  CheckCircle2,
} from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth/auth-service"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import { industryMatchingService } from "@/services/industry/industry-matching-service"
import { IndustryProfile, IndustryMatchRecommendation } from "@/services/industry/industry-collaboration-types"

import { SponsorshipInterestDialog } from "@/features/industry/components/sponsorship-interest-dialog"
import { ContactUniversityDialog } from "@/features/industry/components/contact-university-dialog"
import { CollaborationFitModal } from "@/features/industry/components/collaboration-fit-modal"

export default function IndustrySolutionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [profile, setProfile] = React.useState<IndustryProfile | null>(null)
  const [isSponsorModalOpen, setIsSponsorModalOpen] = React.useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false)
  const [isFitModalOpen, setIsFitModalOpen] = React.useState(false)
  const [hasInterestSubmitted, setHasInterestSubmitted] = React.useState(false)

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }
    industryCollaborationService.getIndustryProfile("ind_tata_steel").then(setProfile)
  }, [router])

  // Mock solution data
  const sol = {
    id: rawId || "prop_001",
    title: "IoT Hydrochemical Fluoride & Arsenic Adsorption Network",
    problemTitle: "Groundwater Fluoride & Arsenic Contamination in Rural Borewells",
    problemId: "prob_001",
    universityName: "Birla Institute of Technology (BIT), Mesra",
    universityId: "univ_bit_mesra",
    domain: "Water Management",
    district: "Ranchi",
    executiveSummary: "Decentralized automated water filtration network utilizing activated bauxite and modified biochar columns, coupled with low-power solar ESP32 LoRaWAN sensors for real-time ion monitoring.",
    societalImpact: "Provides continuous WHO-compliant drinking water (<1.0 ppm fluoride) for 12,000+ residents across Ormanjhi and Angara tribal panchayats, eliminating endemic fluorosis.",
    technologies: ["IoT / Sensors", "Water Chemistry", "LoRaWAN", "Activated Bauxite Adsorption"],
    estimatedBudget: "₹18,50,000",
    budgetNum: 1850000,
    timeline: "6 Months",
    mentor: "Dr. Ananya Sharma (Professor, Environmental Chemistry)",
    studentTeamSize: 4,
    supportNeeded: [
      "CSR Grant Funding (₹18.5L)",
      "Field Deployment Vehicle Logistics",
      "Laboratory AAS Reagents & Calibration Standards",
      "Panchayat Jal Sahiya Community Mobilization",
    ],
    stage: "Prototype",
    governmentStatus: "SELECTED & SPONSORED",
    isSponsored: true,
    sponsorName: "Tata Steel CSR Foundation",
  }

  const fit: IndustryMatchRecommendation | null = profile
    ? industryMatchingService.calculateMatch(profile, sol.domain, sol.district, sol.budgetNum)
    : null

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry Portal", href: "/industry/dashboard" },
            { label: "Solutions", href: "/industry/solutions" },
            { label: sol.title },
          ]}
        />

        {/* Top Header Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/industry/solutions"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Solution Discovery</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
                {sol.domain}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {sol.district} District
              </Badge>
              <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                ✓ {sol.governmentStatus}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-bold block">
              Problem Reference: {sol.problemTitle}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              {sol.title}
            </h1>
            <p className="text-sm font-semibold text-primary">{sol.universityName}</p>
          </div>

          {/* Action CTAs & Fit Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
            {fit && (
              <button
                type="button"
                onClick={() => setIsFitModalOpen(true)}
                className="inline-flex items-center gap-2 p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-bold hover:bg-primary/20 transition-all"
              >
                <Sparkles className="size-4" />
                <span>{fit.overallScore}% Collaboration Fit — Advisory (Click to view breakdown)</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsContactModalOpen(true)}
                className="text-xs font-bold gap-1.5"
              >
                <Send className="size-3.5" />
                <span>Contact University</span>
              </Button>

              <Button
                onClick={() => setIsSponsorModalOpen(true)}
                className="text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-md"
              >
                <Award className="size-3.5" />
                <span>Express Sponsorship Interest</span>
              </Button>
            </div>
          </div>

          {hasInterestSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Sponsorship interest submitted successfully. You can track communication in your Interests Inbox.</span>
            </div>
          )}
        </div>

        {/* Confidential Technical Report Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
          <Lock className="size-5 shrink-0 text-amber-600 mt-0.5 sm:mt-0" />
          <div className="space-y-0.5">
            <strong className="font-bold block">Technical Report Restricted</strong>
            <p>
              Detailed CAD blueprints, chemistry formulations, and proprietary firmware are access-controlled. Industry partners can contact the university or express interest to initiate an authorized collaboration MoU.
            </p>
          </div>
        </div>

        {/* Content Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Executive Summary & Impact */}
            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Executive Summary</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{sol.executiveSummary}</p>
              </div>

              <div className="pt-3 border-t border-border/40">
                <h3 className="text-base font-bold text-foreground mb-1">Target Societal Impact</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{sol.societalImpact}</p>
              </div>
            </div>

            {/* Support Required */}
            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-3">
              <h3 className="text-base font-bold text-foreground">Industry Support & Partnership Needs</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {sol.supportNeeded.map((need, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold">&bull;</span>
                    <span className="text-foreground">{need}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Metrics */}
          <div className="space-y-5">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-4 text-xs">
              <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] border-b border-border pb-2">
                Implementation Specs
              </h3>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase">Faculty Mentor</span>
                <p className="font-bold text-foreground flex items-center gap-1">
                  <GraduationCap className="size-3.5 text-primary" />
                  <span>{sol.mentor}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase">Student Roster</span>
                <p className="font-bold text-foreground flex items-center gap-1">
                  <Users className="size-3.5 text-primary" />
                  <span>{sol.studentTeamSize} Student Researchers</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase">Estimated CSR Budget</span>
                <p className="font-bold text-foreground font-mono text-sm">{sol.estimatedBudget}</p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase">Sanctioned Schedule</span>
                <p className="font-bold text-primary font-mono">{sol.timeline}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {profile && (
        <>
          <SponsorshipInterestDialog
            isOpen={isSponsorModalOpen}
            onClose={() => setIsSponsorModalOpen(false)}
            onSuccess={() => setHasInterestSubmitted(true)}
            solution={sol}
            profile={profile}
          />
          <ContactUniversityDialog
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            onSuccess={() => alert("Message sent to University Dean of Research.")}
            solution={sol}
            profile={profile}
          />
          {fit && (
            <CollaborationFitModal
              isOpen={isFitModalOpen}
              onClose={() => setIsFitModalOpen(false)}
              fit={fit}
              solutionTitle={sol.title}
              companyName={profile.companyName}
            />
          )}
        </>
      )}

      <PublicFooter />
    </div>
  )
}
