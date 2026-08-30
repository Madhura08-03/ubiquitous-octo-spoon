"use client"

import * as React from "react"
import Link from "next/link"
import {
  GraduationCap,
  Building2,
  FolderGit2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Tag,
  MapPin,
  CheckCircle2,
  Globe,
  ArrowLeft,
  Lock,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { RegisteredStudent } from "@/services/students/student-types"
import { Mentor } from "@/services/mentors/mentor-types"
import { SolutionProposal } from "@/services/solutions/solution-types"

export interface PublicProfileViewProps {
  student?: RegisteredStudent | null
  mentor?: Mentor | null
  userProposals?: SolutionProposal[]
}

export function PublicProfileView({
  student,
  mentor,
  userProposals = [],
}: PublicProfileViewProps) {
  const isStudent = Boolean(student)
  const isMentor = Boolean(mentor)

  const name = student?.name || mentor?.name || "Ecosystem Contributor"
  const roleTitle = isStudent
    ? "Student Researcher & Innovator"
    : isMentor
    ? `${mentor?.designation} & Faculty Mentor`
    : "Verified Portal Contributor"
  const institution =
    student?.universityName ||
    "Birla Institute of Technology (BIT), Mesra"
  const department =
    student?.department || mentor?.department || "Engineering & Technology"
  const district = student?.district || "Ranchi, Jharkhand"
  const bio =
    student?.bio ||
    mentor?.bio ||
    "Active contributor to societal innovation projects in Jharkhand."
  const skills = student?.skills || mentor?.expertise || []
  const researchInterests =
    student?.researchInterests || mentor?.researchDomains || []

  // Categorize public proposals
  const proposedSolutions = userProposals.filter(
    (p) => p.status !== "sponsored"
  )
  const activeSolutions = userProposals.filter(
    (p) => p.status === "sponsored" && p.currentImplementationStage !== "Impact Verified"
  )
  const completedSolutions = userProposals.filter(
    (p) => p.currentImplementationStage === "Impact Verified"
  )

  const privacy = student?.privacySettings || {
    showLinkedin: true,
    showGithub: true,
    showInstagram: true,
    showSkills: true,
    showProjects: true,
    showDistrict: true,
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Top Back Nav & Privacy Notice Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card shadow-2xs">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Challenges Feed</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Verified Public Profile &bull; Private account details are strictly shielded</span>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar Initials */}
          <div className="size-20 sm:size-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-2xl sm:text-3xl text-primary shadow-xs shrink-0">
            {name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                <CheckCircle2 className="size-3" />
                <span>Verified {isStudent ? "Student" : isMentor ? "Faculty" : "Member"}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-primary">
              {roleTitle}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                {isStudent ? (
                  <GraduationCap className="size-3.5 text-primary" />
                ) : (
                  <Building2 className="size-3.5 text-primary" />
                )}
                <span>{institution}</span>
              </span>
              <span>&bull;</span>
              <span>{department}</span>
              {privacy.showDistrict && (
                <>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-lime-600 dark:text-lime-400" />
                    <span>{district}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/70">
          {bio}
        </p>

        {/* Social / External Links (Respects privacy settings) */}
        {student?.socialLinks && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {privacy.showLinkedin && student.socialLinks.linkedin && (
              <a
                href={student.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <ExternalLink className="size-3 text-blue-500" />
                <span>LinkedIn</span>
              </a>
            )}

            {privacy.showGithub && student.socialLinks.github && (
              <a
                href={student.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <ExternalLink className="size-3 text-slate-500" />
                <span>GitHub</span>
              </a>
            )}

            {privacy.showInstagram && student.socialLinks.instagram && (
              <a
                href={student.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <ExternalLink className="size-3 text-pink-500" />
                <span>Instagram</span>
              </a>
            )}

            {student.socialLinks.portfolio && (
              <a
                href={student.socialLinks.portfolio}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <Globe className="size-3 text-emerald-500" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Skills & Research Interests */}
      {privacy.showSkills && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="size-3.5 text-primary" />
              <span>Technical Skills & Tools</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <span>Research Domains & Interests</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {researchInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-lg bg-muted border border-border text-xs font-semibold text-foreground"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Innovation Contributions Overview (Proposed, Active, Completed) */}
      {privacy.showProjects && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="space-y-0.5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <FolderGit2 className="size-5 text-purple-500" />
                <span>Innovation Contributions Portfolio</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Publicly verified societal innovation solutions and capstone research initiatives.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                {userProposals.length} Total Solutions
              </span>
            </div>
          </div>

          {/* Three Summary Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-card p-4 space-y-1 text-center shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Proposed
              </span>
              <p className="text-xl sm:text-2xl font-black font-mono text-foreground">
                {proposedSolutions.length}
              </p>
              <span className="text-[10px] text-muted-foreground">Under Review</span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 space-y-1 text-center shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Active
              </span>
              <p className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {activeSolutions.length}
              </p>
              <span className="text-[10px] text-muted-foreground">R&D / Prototyping</span>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 space-y-1 text-center shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                Completed
              </span>
              <p className="text-xl sm:text-2xl font-black font-mono text-primary">
                {completedSolutions.length}
              </p>
              <span className="text-[10px] text-muted-foreground">Impact Verified</span>
            </div>
          </div>

          {/* Solution Cards Grid */}
          {userProposals.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
              This contributor is preparing upcoming societal solution proposals.
            </div>
          ) : (
            <div className="space-y-3">
              {userProposals.map((prop) => {
                const isCompleted = prop.currentImplementationStage === "Impact Verified"
                const isActive = prop.status === "sponsored" && !isCompleted
                
                return (
                  <div
                    key={prop.id}
                    className="p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                            {prop.domain}
                          </Badge>

                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                              ✓ Completed &bull; Impact Verified
                            </span>
                          ) : isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-[10px] font-bold">
                              ● Active &bull; {prop.currentImplementationStage || "Prototype"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                              Under Government Review
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-foreground">
                          {prop.title}
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          Addressing Problem: <strong className="text-foreground">{prop.problemTitle}</strong>
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <Link
                          href={`/problems/${prop.problemId}`}
                          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <span>View Problem</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {prop.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">
                        University: {prop.universityName}
                      </span>
                      {prop.teamFacultyLead && (
                        <span>Faculty Mentor: {prop.teamFacultyLead}</span>
                      )}
                      {prop.citizensBenefitedCount && (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {prop.citizensBenefitedCount.toLocaleString()} Citizens Benefited
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Shielded Private Information Box */}
      <div className="p-4 rounded-2xl border border-border bg-muted/20 flex items-start gap-3 text-xs text-muted-foreground">
        <Lock className="size-4 shrink-0 text-muted-foreground mt-0.5" />
        <div>
          <p className="font-bold text-foreground">Privacy & Security Protection</p>
          <p className="text-[11px]">
            Personal phone numbers, private login email, Aadhaar / institutional registration IDs, and private technical project reports are shielded from public view in accordance with Jharkhand State Data Protection Guidelines.
          </p>
        </div>
      </div>
    </div>
  )
}
