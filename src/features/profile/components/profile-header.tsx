"use client"

import * as React from "react"
import Link from "next/link"
import {
  Shield,
  User,
  GraduationCap,
  Landmark,
  Building2,
  CheckCircle2,
  Clock,
  Edit,
  Sparkles,
  MapPin,
  Camera,
  LogOut,
  Bookmark,
  FileCheck2,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  UserProfile,
  StudentUserProfile,
  UniversityUserProfile,
  IndustryUserProfile,
} from "@/services/profile/profile-types"
import { AvatarUploadModal } from "./avatar-upload-modal"
import { LogoutDialog } from "@/features/auth/components/logout-dialog"

export interface ProfileHeaderProps {
  profile: UserProfile
  onUpdateAvatar: (avatarUrl: string) => void
  isOwner?: boolean
}

export function ProfileHeader({ profile, onUpdateAvatar, isOwner = true }: ProfileHeaderProps) {
  const [avatarModalOpen, setAvatarModalOpen] = React.useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false)

  const roleLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
    citizen: { label: "Citizen Contributor", icon: User },
    student: { label: "Student Innovator", icon: GraduationCap },
    university: { label: "University Institution", icon: Landmark },
    industry: { label: "Industry & CSR Partner", icon: Building2 },
  }

  const roleMeta = roleLabels[profile.role] || { label: profile.role, icon: Shield }
  const RoleIcon = roleMeta.icon

  // Verification indicators
  const isGovVerified =
    profile.role === "citizen"
      ? profile.isMobileVerified
      : profile.role === "student"
      ? (profile as StudentUserProfile).idCardStatus === "verified"
      : profile.role === "university"
      ? (profile as UniversityUserProfile).institutionVerificationStatus === "verified"
      : (profile as IndustryUserProfile).organizationVerificationStatus === "verified"

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JH"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
      {/* Background Accent Gradient */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none rounded-full blur-3xl -mr-20 -mt-20"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with Upload Hover Action */}
          <div className="relative group shrink-0">
            {profile.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="size-20 sm:size-24 rounded-2xl object-cover border-2 border-primary/40 shadow-sm"
              />
            ) : (
              <div className="flex size-20 sm:size-24 items-center justify-center rounded-2xl bg-primary/10 text-primary border-2 border-primary/20 text-xl sm:text-2xl font-black font-mono shadow-xs">
                {initials}
              </div>
            )}

            {isOwner && (
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs hover:scale-105 transition-transform"
                aria-label="Upload avatar"
              >
                <Camera className="size-3.5" />
              </button>
            )}
          </div>

          {/* Profile Name & Metadata */}
          <div className="space-y-1.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {profile.name}
              </h1>

              {/* Role Pill */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <RoleIcon className="size-3.5" />
                <span>{roleMeta.label}</span>
              </div>
            </div>

            {/* General District Location & Joined Date */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {profile.district && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" />
                  <span>{profile.district} District, Jharkhand</span>
                </div>
              )}
              <span>Joined {profile.joinedDate}</span>
            </div>

            {/* Verification Status Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge
                variant="outline"
                className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] gap-1 font-semibold"
              >
                <CheckCircle2 className="size-3" />
                <span>{profile.role === "citizen" ? "Mobile Verified" : "Email Verified"}</span>
              </Badge>

              {isGovVerified ? (
                <StatusBadge status="verified" size="sm" customLabel="Institutional Verified" />
              ) : (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[10px] gap-1 font-semibold"
                >
                  <Clock className="size-3 text-amber-500" />
                  <span>Verification Pending (Nodal SLA)</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Points & Actions */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-border">
          {/* Points Card */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-lime-500/30 bg-lime-500/10 text-left">
            <div className="flex size-7 items-center justify-center rounded-lg bg-lime-500 text-slate-950">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {profile.role === "citizen"
                  ? "Civic Upvotes"
                  : profile.role === "student"
                  ? "Innovation Points"
                  : profile.role === "university"
                  ? "Research Impact"
                  : "CSR Seed Credits"}
              </p>
              <p className="text-base font-black text-foreground font-mono">
                {profile.points.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons (Reports, Saved, Edit Profile & Logout) */}
          {isOwner && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/profile/reports"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "text-xs font-semibold gap-1.5",
                })}
              >
                <FileCheck2 className="size-3.5 text-primary" />
                <span>My Reports</span>
              </Link>

              <Link
                href="/profile/saved"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "text-xs font-semibold gap-1.5",
                })}
              >
                <Bookmark className="size-3.5 text-primary" />
                <span>Saved</span>
              </Link>

              <Link
                href="/profile/edit"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "text-xs font-semibold gap-1.5",
                })}
              >
                <Edit className="size-3.5" />
                <span>Edit</span>
              </Link>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setLogoutModalOpen(true)}
                className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
                title="Log out of account"
              >
                <LogOut className="size-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Modal */}
      {isOwner && (
        <AvatarUploadModal
          open={avatarModalOpen}
          onOpenChange={setAvatarModalOpen}
          currentAvatarUrl={profile.avatarUrl}
          onSaveAvatar={onUpdateAvatar}
        />
      )}

      {/* Logout Confirmation Dialog */}
      {isOwner && (
        <LogoutDialog
          open={logoutModalOpen}
          onOpenChange={setLogoutModalOpen}
        />
      )}
    </div>
  )
}