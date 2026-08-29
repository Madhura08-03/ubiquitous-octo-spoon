"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

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
import { authService } from "@/services/auth/auth-service"

export default function LandingPage() {
  const router = useRouter()
  const [selectedChallenge, setSelectedChallenge] = React.useState<CivicChallenge | null>(null)

  const handleReportProblem = () => {
    const user = authService.getCurrentUser()
    if (user) {
      router.push("/report")
    } else {
      router.push("/register")
    }
  }

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleSearchClick = () => {
    router.push("/feed")
  }

  const handleUniversityClick = () => {
    const user = authService.getCurrentUser()
    if (user) {
      router.push("/feed")
    } else {
      router.push("/register")
    }
  }

  const handleIndustryClick = () => {
    const user = authService.getCurrentUser()
    if (user) {
      router.push("/feed")
    } else {
      router.push("/register")
    }
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

      {/* Interactive Demonstration Modal for Challenge View */}
      {selectedChallenge && (
        <ConfirmationDialog
          open={Boolean(selectedChallenge)}
          onOpenChange={(open) => !open && setSelectedChallenge(null)}
          title={selectedChallenge.title}
          description={`Location: ${selectedChallenge.district} • Severity: ${selectedChallenge.severity} • Reports: ${selectedChallenge.reportsCount} citizen upvotes. Browse the Challenges Feed to view full problem details.`}
          confirmLabel="View in Challenges Feed"
          cancelLabel="Close"
          variant="info"
          onConfirm={() => {
            setSelectedChallenge(null)
            router.push("/feed")
          }}
        />
      )}
    </div>
  )
}