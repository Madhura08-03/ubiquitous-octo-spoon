"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, UserCheck } from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { ProfileEditForm } from "@/features/profile/components/profile-edit-form"
import { UserProfile } from "@/services/profile/profile-types"
import { profileService } from "@/services/profile/profile-service"
import { authService } from "@/services/auth/auth-service"

export default function ProfileEditPage() {
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

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4 text-primary" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Edit Ecosystem Profile
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Update your public bio, skills, thematic directives, and directory visibility.
            </p>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 px-2.5 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Profile</span>
          </Link>
        </div>

        {/* Form */}
        {isLoading || !profile ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading profile editor...</span>
            </div>
          </div>
        ) : (
          <ProfileEditForm initialProfile={profile} />
        )}
      </main>

      <PublicFooter />
    </div>
  )
}