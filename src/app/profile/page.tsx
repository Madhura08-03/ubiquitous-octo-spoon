"use client"

import * as React from "react"
import { toast } from "sonner"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { ProfileHeader } from "@/features/profile/components/profile-header"
import { ProfileCompletionBar } from "@/features/profile/components/profile-completion-bar"
import { ProfileDetails } from "@/features/profile/components/profile-details"
import { UserProfile, ProfileCompletionResult } from "@/services/profile/profile-types"
import { profileService } from "@/services/profile/profile-service"

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [completion, setCompletion] = React.useState<ProfileCompletionResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    profileService
      .getProfile()
      .then((p) => {
        if (isMounted) {
          setProfile(p)
          setCompletion(profileService.calculateProfileCompletion(p))
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error("Failed to load user profile.")
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleUpdateAvatar = async (avatarUrl: string) => {
    try {
      const updated = await profileService.updateProfile({ avatarUrl })
      setProfile(updated)
      setCompletion(profileService.calculateProfileCompletion(updated))
    } catch {
      toast.error("Failed to update photo.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {isLoading || !profile || !completion ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading ecosystem profile...</span>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Profile Header with Avatar, Role Badge, Points */}
            <ProfileHeader profile={profile} onUpdateAvatar={handleUpdateAvatar} />

            {/* 2. Profile Strength / Completion Progress */}
            <ProfileCompletionBar completion={completion} />

            {/* 3. Detailed Profile Sections (Public & Private) */}
            <ProfileDetails profile={profile} />
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}