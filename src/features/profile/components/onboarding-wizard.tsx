"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Check,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "@/components/ui/progress-ring"
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

export interface OnboardingWizardProps {
  initialProfile: UserProfile
}

export function OnboardingWizard({ initialProfile }: OnboardingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const totalSteps = 4

  const citizen = initialProfile.role === "citizen" ? (initialProfile as CitizenUserProfile) : null
  const student = initialProfile.role === "student" ? (initialProfile as StudentUserProfile) : null
  const university = initialProfile.role === "university" ? (initialProfile as UniversityUserProfile) : null
  const industry = initialProfile.role === "industry" ? (initialProfile as IndustryUserProfile) : null

  // Form State
  const [name, setName] = React.useState(initialProfile.name)
  const [bio, setBio] = React.useState(initialProfile.bio || "")
  const [district, setDistrict] = React.useState(initialProfile.district || "Ranchi")
  const [locality, setLocality] = React.useState(citizen?.locality || "")
  const [skills, setSkills] = React.useState<string[]>(student?.skills || [])
  const [interests, setInterests] = React.useState<string[]>(
    student?.interests || industry?.fundingInterests || []
  )
  const [avatarUrl, setAvatarUrl] = React.useState(initialProfile.avatarUrl || "")
  const [isSaving, setIsSaving] = React.useState(false)

  const completion = profileService.calculateProfileCompletion({
    ...initialProfile,
    name,
    bio,
    district,
    avatarUrl,
    skills,
    interests,
  } as UserProfile)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSkip = async () => {
    toast.info("Onboarding Skipped", {
      description: "You can update your profile anytime from your profile dashboard.",
    })
    router.push("/profile")
  }

  const handleFinish = async () => {
    setIsSaving(true)
    try {
      const payload: UpdateProfilePayload = {
        name,
        bio,
        district,
        locality: locality || undefined,
        skills,
        interests,
        fundingInterests: interests,
        avatarUrl,
        onboardingCompleted: true,
      }
      await profileService.updateProfile(payload)
      toast.success("Profile Setup Completed!", {
        description: "Welcome to the Jharkhand Societal Innovation Ecosystem.",
      })
      router.push("/profile")
    } catch {
      toast.error("Failed to complete onboarding.")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill))
    } else {
      setSkills([...skills, skill])
    }
  }

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest))
    } else {
      setInterests([...interests, interest])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      {/* Wizard Header Bar */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-3.5" />
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Welcome to the Innovation Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Complete your profile to match with grassroots directives and academic researchers.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <ProgressRing value={completion.percentage} size={54} strokeWidth={5} variant="lime" />
          <div className="text-left">
            <span className="text-[11px] font-semibold text-muted-foreground block">Completion</span>
            <span className="text-sm font-bold text-foreground font-mono">{completion.percentage}%</span>
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {["Basic Info", "Role Details", "Interests", "Photo & Finish"].map((stepTitle, idx) => {
          const stepNum = idx + 1
          const isActive = currentStep === stepNum
          const isDone = currentStep > stepNum
          return (
            <div
              key={stepTitle}
              className={`p-2.5 rounded-xl border transition-all ${
                isActive
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                  : isDone
                  ? "border-border bg-card text-foreground font-semibold"
                  : "border-border/60 bg-muted/20 text-muted-foreground opacity-60"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                {isDone ? <Check className="size-3 text-emerald-500 stroke-[3]" /> : <span>{stepNum}.</span>}
                <span className="hidden sm:inline">{stepTitle}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Step Contents */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">General Information</h2>
              <p className="text-xs text-muted-foreground">Confirm your name and geographic district in Jharkhand.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Full Name / Organization Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Chandra Murmu"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Professional Bio / Summary
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the ecosystem about your research experience, civic focus, or lab capabilities..."
                className="text-xs min-h-[90px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Jharkhand District
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
                  Panchayat / Block / Campus
                </label>
                <Input
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Ormanjhi Block, Ward 4"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Role Details Confirmation */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">Role Confirmation ({initialProfile.role.toUpperCase()})</h2>
              <p className="text-xs text-muted-foreground">Review your verified institutional credentials from registration.</p>
            </div>

            {citizen && (
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Mobile Verification</span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3 mr-1" /> Verified
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Registered Phone</span>
                  <span className="font-mono font-bold text-foreground">{citizen.mobile}</span>
                </div>
              </div>
            )}

            {student && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Institution</span>
                    <span className="font-bold text-foreground">{student.university}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Student Reg No.</span>
                    <span className="font-mono font-bold text-foreground">{student.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ID Card Status</span>
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold">
                      Submitted for Nodal Review
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {university && (
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Institution</span>
                  <span className="font-bold text-foreground">{university.institutionName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">AISHE Code</span>
                  <span className="font-mono font-bold text-foreground">{university.institutionCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Authorization Letter</span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Submitted to Dept of Higher Ed
                  </Badge>
                </div>
              </div>
            )}

            {industry && (
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Organization</span>
                  <span className="font-bold text-foreground">{industry.organizationName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Corporate CIN/GSTIN</span>
                  <span className="font-mono font-bold text-foreground">{industry.registrationNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">CSR Verification</span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Under Review by State Committee
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Skills & Innovation Interests */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">
                {initialProfile.role === "industry" ? "CSR Focus Areas" : "Skills & Innovation Interests"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Select applicable tags to automatically receive notifications when relevant challenges are posted.
              </p>
            </div>

            {initialProfile.role !== "citizen" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Select Technical Skills & Capabilities:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SKILLS.map((skill) => {
                    const isSelected = skills.includes(skill)
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground font-bold"
                            : "border-border bg-muted/30 hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-foreground">
                Select Thematic Directives & Interests:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_INTERESTS.map((item) => {
                  const isSelected = interests.includes(item)
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        isSelected
                          ? "border-lime-500 bg-lime-500/20 text-lime-900 dark:text-lime-200 font-bold"
                          : "border-border bg-muted/30 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {isSelected ? `✓ ${item}` : `+ ${item}`}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Photo Upload & Finish */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">Profile Photo & Final Review</h2>
              <p className="text-xs text-muted-foreground">Upload an avatar or logo to complete your profile setup.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-border bg-muted/20">
              <div className="relative group">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="size-24 rounded-2xl object-cover border-2 border-primary shadow-sm"
                  />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-2xl bg-muted border-2 border-dashed border-border text-muted-foreground">
                    <Camera className="size-8 text-muted-foreground/60" />
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <p className="text-xs font-bold text-foreground">Upload Profile Photo / Organization Emblem</p>
                <p className="text-[11px] text-muted-foreground">PNG or JPG up to 3MB</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border hover:bg-muted text-xs font-semibold cursor-pointer shadow-xs">
                  <Camera className="size-3.5" />
                  <span>{avatarUrl ? "Change Photo" : "Select Photo from Device"}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <span>You have completed all necessary milestones for initial onboarding!</span>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={isSaving}
              className="text-xs gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span>Continue</span>
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleFinish}
              isLoading={isSaving}
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Finish & View Profile</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}