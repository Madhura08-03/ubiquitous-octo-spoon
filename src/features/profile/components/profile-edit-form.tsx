"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft, Plus, X, AlertCircle, MapPin } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  UserProfile,
  CitizenUserProfile,
  StudentUserProfile,
  UniversityUserProfile,
  IndustryUserProfile,
  UpdateProfilePayload,
} from "@/services/profile/profile-types"
import { JHARKHAND_DISTRICTS, COMMON_SKILLS, COMMON_INTERESTS } from "@/data/profile-data"
import { profileService } from "@/services/profile/profile-service"

export interface ProfileEditFormProps {
  initialProfile: UserProfile
}

export function ProfileEditForm({ initialProfile }: ProfileEditFormProps) {
  const router = useRouter()
  const [name, setName] = React.useState(initialProfile.name)
  const [bio, setBio] = React.useState(initialProfile.bio || "")
  const [district, setDistrict] = React.useState(initialProfile.district || "Ranchi")
  
  const citizen = initialProfile.role === "citizen" ? (initialProfile as CitizenUserProfile) : null
  const student = initialProfile.role === "student" ? (initialProfile as StudentUserProfile) : null
  const university = initialProfile.role === "university" ? (initialProfile as UniversityUserProfile) : null
  const industry = initialProfile.role === "industry" ? (initialProfile as IndustryUserProfile) : null

  const [locality, setLocality] = React.useState(citizen?.locality || "")
  const [websiteUrl, setWebsiteUrl] = React.useState(university?.websiteUrl || industry?.websiteUrl || student?.portfolioUrl || "")
  const [skills, setSkills] = React.useState<string[]>(student?.skills || [])
  const [interests, setInterests] = React.useState<string[]>(
    student?.interests || industry?.fundingInterests || []
  )
  const [newSkill, setNewSkill] = React.useState("")
  const [newInterest, setNewInterest] = React.useState("")
  const [visibility, setVisibility] = React.useState<"public" | "private">(initialProfile.profileVisibility || "public")
  
  const [isSaving, setIsSaving] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleAddSkill = (skill: string) => {
    if (!skill.trim() || skills.includes(skill.trim())) return
    setSkills([...skills, skill.trim()])
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  const handleAddInterest = (item: string) => {
    if (!item.trim() || interests.includes(item.trim())) return
    setInterests([...interests, item.trim()])
    setNewInterest("")
  }

  const handleRemoveInterest = (itemToRemove: string) => {
    setInterests(interests.filter((i) => i !== itemToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage("Full Name / Organization Name cannot be blank.")
      return
    }

    setIsSaving(true)
    try {
      const payload: UpdateProfilePayload = {
        name: name.trim(),
        bio: bio.trim(),
        district,
        locality: locality.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        skills,
        interests,
        fundingInterests: interests,
        profileVisibility: visibility,
      }

      await profileService.updateProfile(payload)
      toast.success("Profile updated successfully.", {
        description: "Your modifications are now active in the portal.",
      })
      router.push("/profile")
    } catch {
      setErrorMessage("Failed to save profile changes. Please retry.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-2xl mx-auto">
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          General Information
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Full Name / Organization Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setErrorMessage(null)
            }}
            placeholder="e.g. Ramesh Chandra Murmu"
            className="text-xs"
            disabled={isSaving}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Professional / Institutional Bio
          </label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Brief summary of your civic focus, engineering specializations, or institutional labs..."
            className="text-xs min-h-[90px]"
            disabled={isSaving}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Jharkhand District (Broad Jurisdiction)
            </label>
            <Select value={district} onValueChange={(val) => setDistrict(val || "Ranchi")}>
              <SelectTrigger className="w-full text-xs">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {JHARKHAND_DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Locality / Block / Campus
            </label>
            <Input
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Ormanjhi Block or Mesra Campus"
              className="text-xs"
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Location Privacy Callout */}
        <div className="flex items-start gap-2 p-3 rounded-xl border border-border bg-muted/20 text-[11px] text-muted-foreground leading-relaxed">
          <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
          <span>
            <strong>Location Privacy Protected:</strong> Only your broad district is publicly visible in innovator directories. Precise GPS points belong exclusively to problem reports.
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Website / Portfolio URL
          </label>
          <Input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://..."
            className="text-xs"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* 2. Skills & Expertise Tags (for Student, University, Industry) */}
      {initialProfile.role !== "citizen" && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground">
            {initialProfile.role === "student"
              ? "Skills & Technical Capabilities"
              : "Institutional Capabilities & Expertise"}
          </h3>

          {/* Active Skills Pills */}
          <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-muted/40 border border-border">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs gap-1 py-1">
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-destructive transition-colors ml-0.5"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            {skills.length === 0 && (
              <span className="text-xs text-muted-foreground self-center">No skills added yet.</span>
            )}
          </div>

          {/* Add Custom Skill */}
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddSkill(newSkill)
                }
              }}
              placeholder="Type a skill (e.g. Machine Learning, IoT telemetry)..."
              className="text-xs flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddSkill(newSkill)}
              disabled={!newSkill.trim()}
              className="text-xs gap-1 font-semibold"
            >
              <Plus className="size-3.5" />
              <span>Add</span>
            </Button>
          </div>

          {/* Suggested Skills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-muted-foreground">Quick suggestions:</span>
            <div className="flex flex-wrap gap-1">
              {COMMON_SKILLS.filter((s) => !skills.includes(s)).slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddSkill(suggestion)}
                  className="text-[11px] bg-muted hover:bg-primary/10 hover:text-primary px-2 py-0.5 rounded-md border border-border transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Innovation Interests & Directives */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          {initialProfile.role === "industry"
            ? "CSR Grant Priority Directives"
            : "Focus Themes & Challenge Interests"}
        </h3>

        {/* Active Interests Pills */}
        <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-muted/40 border border-border">
          {interests.map((item) => (
            <Badge key={item} variant="outline" className="text-xs border-primary/40 gap-1 py-1">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(item)}
                className="hover:text-destructive transition-colors ml-0.5"
                aria-label={`Remove ${item}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {interests.length === 0 && (
            <span className="text-xs text-muted-foreground self-center">No focus areas selected.</span>
          )}
        </div>

        {/* Add Custom Interest */}
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddInterest(newInterest)
              }
            }}
            placeholder="Type a thematic interest (e.g. Rural Solar, Drinking Water)..."
            className="text-xs flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddInterest(newInterest)}
            disabled={!newInterest.trim()}
            className="text-xs gap-1 font-semibold"
          >
            <Plus className="size-3.5" />
            <span>Add</span>
          </Button>
        </div>

        {/* Suggested Themes */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-muted-foreground">State priorities:</span>
          <div className="flex flex-wrap gap-1">
            {COMMON_INTERESTS.filter((i) => !interests.includes(i)).slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddInterest(suggestion)}
                className="text-[11px] bg-muted hover:bg-primary/10 hover:text-primary px-2 py-0.5 rounded-md border border-border transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Directory Privacy Settings */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
        <h3 className="text-sm font-bold text-foreground">
          Directory Visibility
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Control whether your public profile is indexable by other students, academic researchers, and CSR sponsors.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setVisibility("public")}
            className={`p-3 rounded-xl border text-left transition-all ${
              visibility === "public"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-muted/20 hover:bg-muted/40"
            }`}
          >
            <p className="text-xs font-bold text-foreground">Public in Directory</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Visible to all registered stakeholders</p>
          </button>

          <button
            type="button"
            onClick={() => setVisibility("private")}
            className={`p-3 rounded-xl border text-left transition-all ${
              visibility === "private"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-muted/20 hover:bg-muted/40"
            }`}
          >
            <p className="text-xs font-bold text-foreground">Private Profile</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Hidden from search directories</p>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/profile")}
          disabled={isSaving}
          className="text-xs gap-1.5"
        >
          <ArrowLeft className="size-3.5" />
          <span>Cancel</span>
        </Button>

        <Button
          type="submit"
          isLoading={isSaving}
          className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="size-3.5" />
          <span>Save Profile Changes</span>
        </Button>
      </div>
    </form>
  )
}