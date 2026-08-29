"use client"

import * as React from "react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { OnboardingWizard } from "@/features/profile/components/onboarding-wizard"
import { UserProfile } from "@/services/profile/profile-types"
import { profileService } from "@/services/profile/profile-service"

export default function OnboardingPage() {
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    profileService.getProfile().then((p) => {
      if (isMounted) {
        setProfile(p)
        setIsLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isLoading || !profile ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading onboarding profile...</span>
            </div>
          </div>
        ) : (
          <OnboardingWizard initialProfile={profile} />
        )}
      </main>

      <PublicFooter />
    </div>
  )
}