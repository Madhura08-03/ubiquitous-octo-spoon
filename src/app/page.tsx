"use client"

import * as React from "react"
import { toast } from "sonner"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { HeroSection } from "@/features/landing/components/hero-section"
import { EcosystemStrip } from "@/features/landing/components/ecosystem-strip"
import { WhyPlatformSection } from "@/features/landing/components/why-platform-section"
import { WorkflowSection } from "@/features/landing/components/workflow-section"
import { FeaturedChallenges } from "@/features/landing/components/featured-challenges"
import { ImpactStats } from "@/features/landing/components/impact-stats"
import { CollaborationSection } from "@/features/landing/components/collaboration-section"
import { ImpactStory } from "@/features/landing/components/impact-story"
import { FinalCta } from "@/features/landing/components/final-cta"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { CivicChallenge } from "@/data/landing-data"

export default function LandingPage() {
  const [reportModalOpen, setReportModalOpen] = React.useState(false)
  const [selectedChallenge, setSelectedChallenge] = React.useState<CivicChallenge | null>(null)

  const handleReportProblem = () => {
    setReportModalOpen(true)
  }

  const handleLoginClick = () => {
    toast.info("Authentication Portal", {
      description: "Role-based authentication gateway (Citizen, Student, University, Industry, Government) will be connected in upcoming tasks.",
    })
  }

  const handleSearchClick = () => {
    toast.info("Search Directives", {
      description: "Full-text search & GIS mapping filter will activate in the Challenge Discovery phase.",
    })
  }

  const handleUniversityClick = () => {
    toast.info("University Research Gateway", {
      description: "University faculty mentorship and student team registration module.",
    })
  }

  const handleIndustryClick = () => {
    toast.info("Industry CSR Co-Sponsorship", {
      description: "Corporate CSR grant portal and hardware prototyping sponsorship gateway.",
    })
  }

  const handleViewChallenge = (challenge: CivicChallenge) => {
    setSelectedChallenge(challenge)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-lime-500/30">
      {/* 1. Public Navbar */}
      <PublicNavbar
        onSearchClick={handleSearchClick}
        onLoginClick={handleLoginClick}
        onReportProblemClick={handleReportProblem}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection onReportProblem={handleReportProblem} />

        {/* 3. Trust / Ecosystem Stakeholders Strip */}
        <EcosystemStrip />

        {/* 4. Why This Platform Pillars */}
        <WhyPlatformSection />

        {/* 5. How It Works - 7-Stage Innovation Lifecycle */}
        <WorkflowSection />

        {/* 6. Featured Civic Challenges */}
        <FeaturedChallenges onViewChallenge={handleViewChallenge} />

        {/* 7. Impact Statistics (Dark Charcoal) */}
        <ImpactStats />

        {/* 8. University + Industry Collaboration Split */}
        <CollaborationSection
          onUniversityClick={handleUniversityClick}
          onIndustryClick={handleIndustryClick}
        />

        {/* 9. Community Case Story */}
        <ImpactStory />

        {/* 10. Final Call to Action */}
        <FinalCta onReportProblem={handleReportProblem} />
      </main>

      {/* 11. Institutional Footer */}
      <PublicFooter />

      {/* Interactive Demonstration Modal for "Report a Problem" */}
      <ConfirmationDialog
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        title="Citizen Problem Reporting Gateway"
        description="This will launch the structured multi-step civic reporting wizard with geotagging, category classification, and photo evidence upload in Task 5."
        confirmLabel="Proceed to Reporting Flow"
        cancelLabel="Close"
        variant="info"
        onConfirm={() => {
          setReportModalOpen(false)
          toast.success("Problem submission wizard initialized for Task 5 development.")
        }}
      />

      {/* Interactive Demonstration Modal for Challenge View */}
      {selectedChallenge && (
        <ConfirmationDialog
          open={Boolean(selectedChallenge)}
          onOpenChange={(open) => !open && setSelectedChallenge(null)}
          title={selectedChallenge.title}
          description={`Location: ${selectedChallenge.district} • Severity: ${selectedChallenge.severity} • Reports: ${selectedChallenge.reportsCount} citizen upvotes. Detailed project brief & student submissions will open in Task 7.`}
          confirmLabel="Got it"
          cancelLabel="Close"
          variant="info"
          onConfirm={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  )
}
