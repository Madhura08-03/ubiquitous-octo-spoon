"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { OnboardingWizard } from "@/features/profile/components/onboarding-wizard"
import { UserProfile } from "@/services/profile/profile-types"
import { profileService } from "@/services/profile/profile-service"
import { authService } from "@/services/auth/auth-service"

export default function OnboardingPage() {
  const router = useRouter()
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const authUser = authService.getCurrentUser()
    if (!authUser) {
      router.replace("/login")
      return
    }

    let isMounted = true
    profileService.getProfile().then((p) => {
      if (isMounted) {
        if (!p) {
          router.replace("/login")
          return
        }
        setProfile(p)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [router])

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