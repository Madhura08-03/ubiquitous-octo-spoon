"use client"

import * as React from "react"
import Link from "next/link"
import {
  GraduationCap,
  FolderGit2,
  Trophy,
  Award,
  Rocket,
  Hammer,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Edit,
  LogOut,
  Tag,
  Clock,
  CheckCircle,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StudentUserProfile } from "@/services/profile/profile-types"
import {
  MOCK_STUDENT_ACHIEVEMENTS,
} from "@/data/profile-data"
import { LogoutDialog } from "@/features/auth/components/logout-dialog"
import { solutionService } from "@/services/solutions/solution-service"
import { SolutionProposal } from "@/services/solutions/solution-types"

export interface StudentProfileViewProps {
  profile: StudentUserProfile
}

export function StudentProfileView({ profile }: StudentProfileViewProps) {
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"all" | "proposed" | "active" | "completed">("all")
  const [proposals, setProposals] = React.useState<SolutionProposal[]>([])

    const achievements = MOCK_STUDENT_ACHIEVEMENTS

  const loadProposals = React.useCallback(() => {
    solutionService.getAllProposals().then((all) => {
      // Find proposals where current student is participant or author
      const email = profile.email?.toLowerCase().trim() || "priya.sharma@student.bitmesra.ac.in"
      const matched = all.filter(
        (p) =>
          p.studentParticipants?.some(
            (sp) =>
              sp.studentEmail.toLowerCase().trim() === email ||
              sp.studentId === profile.id
          ) ||
          // Fallback demo matching for BIT Mesra student
          (email.includes("bitmesra") && (p.id === "prop_001" || p.id === "prop_004" || p.id === "prop_006"))
      )
      setProposals(matched)
    })
  }, [profile.email, profile.id])

  React.useEffect(() => {
    loadProposals()
    const unsub = solutionService.subscribe(() => {
      loadProposals()
    })
    return () => unsub()
  }, [loadProposals])

  // Split into Three Categories
  const proposedSolutions = proposals.filter((p) => p.status !== "sponsored")
  const activeSolutions = proposals.filter(
    (p) => p.status === "sponsored" && p.currentImplementationStage !== "Impact Verified"
  )
  const completedSolutions = proposals.filter(
    (p) => p.currentImplementationStage === "Impact Verified"
  )

  const renderAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "Rocket":
        return <Rocket className="size-5 text-purple-500" />
      case "Award":
        return <Award className="size-5 text-amber-500" />
      case "Trophy":
        return <Trophy className="size-5 text-yellow-500" />
      case "Hammer":
        return <Hammer className="size-5 text-blue-500" />
      default:
        return <Sparkles className="size-5 text-primary" />
    }
  }

  return (
    <div className="space-y-6 text-left">
      {/* Student Academic & Skills Pill Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-primary" />
              <span>University Affiliation</span>
            </span>
            <p className="text-sm sm:text-base font-bold text-foreground">
              {profile.university || "Birla Institute of Technology, Mesra"}
            </p>
            <p className="text-xs text-muted-foreground">
              Dept. of Electronics & Communication Engineering &bull; Reg:{" "}
              <span className="font-mono">{profile.registrationNumber || "BE/10842/2023"}</span>
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="size-3.5 text-primary" />
              <span>Verified Technical Skills</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(profile.skills && profile.skills.length > 0
                ? profile.skills
                : ["IoT & Telemetry", "Embedded Firmware (C/C++)", "Solar Microgrids", "Python", "Next.js"]
              ).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PART 9: Summary Section: My Innovation Contributions (3 Stats) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <FolderGit2 className="size-5 text-purple-500" />
            <span>My Innovation Contributions</span>
          </h2>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            {proposals.length} Total Solutions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Stat 1: Proposed */}
          <div
            onClick={() => setActiveTab("proposed")}
            className={`rounded-2xl border p-4 sm:p-5 space-y-1 shadow-2xs cursor-pointer transition-all hover:scale-[1.01] ${
              activeTab === "proposed"
                ? "border-amber-500 bg-amber-500/10"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Proposed Solutions
              </span>
              <Clock className="size-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black font-mono text-foreground">
              {proposedSolutions.length}
            </p>
            <span className="text-[10px] text-muted-foreground">
              Under Government / Nodal Review
            </span>
          </div>

          {/* Stat 2: Active */}
          <div
            onClick={() => setActiveTab("active")}
            className={`rounded-2xl border p-4 sm:p-5 space-y-1 shadow-2xs cursor-pointer transition-all hover:scale-[1.01] ${
              activeTab === "active"
                ? "border-blue-500 bg-blue-500/10"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Active Solutions
              </span>
              <Sparkles className="size-4 text-blue-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
              {activeSolutions.length}
            </p>
            <span className="text-[10px] text-muted-foreground">
              Selected / Sponsored &bull; In R&D
            </span>
          </div>

          {/* Stat 3: Completed */}
          <div
            onClick={() => setActiveTab("completed")}
            className={`rounded-2xl border p-4 sm:p-5 space-y-1 shadow-2xs cursor-pointer transition-all hover:scale-[1.01] ${
              activeTab === "completed"
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Completed Solutions
              </span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {completedSolutions.length}
            </p>
            <span className="text-[10px] text-muted-foreground">
              Impact Verified &bull; Deployed
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card shadow-2xs">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={activeTab === "all" ? "default" : "ghost"}
            onClick={() => setActiveTab("all")}
            className="text-xs font-bold h-8"
          >
            All Solutions ({proposals.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "proposed" ? "default" : "ghost"}
            onClick={() => setActiveTab("proposed")}
            className="text-xs font-bold h-8"
          >
            Proposed ({proposedSolutions.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "active" ? "default" : "ghost"}
            onClick={() => setActiveTab("active")}
            className="text-xs font-bold h-8"
          >
            Active ({activeSolutions.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "completed" ? "default" : "ghost"}
            onClick={() => setActiveTab("completed")}
            className="text-xs font-bold h-8"
          >
            Completed ({completedSolutions.length})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/profile/edit"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground",
            })}
          >
            <Edit className="size-3.5" />
            <span>Edit Profile</span>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLogoutModalOpen(true)}
            className="text-xs font-semibold gap-1 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut className="size-3.5" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>

      {/* PART 8: Three Categories Solution Cards Display */}

      {/* 1. CATEGORY 1: PROPOSED SOLUTIONS */}
      {(activeTab === "all" || activeTab === "proposed") && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock className="size-4 text-amber-500" />
                <span>Category 1: Solutions Proposed</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Proposals submitted by university teams undergoing governmental technical evaluation.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold border-amber-500/30 text-amber-700 dark:text-amber-300">
              {proposedSolutions.length} Proposed
            </Badge>
          </div>

          {proposedSolutions.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
              You are not currently participating in any proposed solutions.
            </div>
          ) : (
            <div className="space-y-3">
              {proposedSolutions.map((proj) => {
                const myParticipant = proj.studentParticipants?.find(
                  (sp) => sp.studentEmail.toLowerCase() === profile.email.toLowerCase()
                )
                const role = myParticipant?.role || "IoT & Firmware Developer"

                return (
                  <div
                    key={proj.id}
                    className="rounded-xl border border-border bg-muted/20 p-5 space-y-4 hover:border-amber-500/40 transition-all text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                            {proj.domain}
                          </Badge>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                            Under Government Review
                          </span>
                          <span className="text-xs font-bold text-foreground font-mono">
                            Role: {role}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-foreground">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Problem: <strong className="text-foreground">{proj.problemTitle}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono font-bold text-muted-foreground">
                          State: <strong className="text-amber-600 dark:text-amber-400">Proposed</strong>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {proj.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/70 text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                        <span>University: <strong>{proj.universityName}</strong></span>
                        <span>&bull;</span>
                        <span>Faculty Lead: <strong>{proj.teamFacultyLead || "Dr. Ananya Sharma"}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/problems/${proj.problemId}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                            className: "text-xs h-8 gap-1",
                          })}
                        >
                          <span>View Problem</span>
                          <ExternalLink className="size-3" />
                        </Link>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.alert("Solution Title: " + proj.title + "\nStatus: " + proj.status + "\nStage: " + (proj.currentImplementationStage || "Proposed"))}
                          className="text-xs h-8 text-primary font-bold hover:bg-primary/10"
                        >
                          <span>View Proposal</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. CATEGORY 2: ACTIVE / SELECTED SOLUTIONS */}
      {(activeTab === "all" || activeTab === "active") && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-blue-500" />
                <span>Category 2: Active Solutions</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Selected and sponsored innovation projects actively developing hardware/software prototypes.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold border-blue-500/30 text-blue-700 dark:text-blue-300">
              {activeSolutions.length} Active
            </Badge>
          </div>

          {activeSolutions.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
              You have no active solution projects.
            </div>
          ) : (
            <div className="space-y-3">
              {activeSolutions.map((proj) => {
                const myParticipant = proj.studentParticipants?.find(
                  (sp) => sp.studentEmail.toLowerCase() === profile.email.toLowerCase()
                )
                const role = myParticipant?.role || "Embedded Systems Developer"
                const stage = proj.currentImplementationStage || "Prototype"
                const progress = stage === "Prototype" ? 68 : stage === "Design" ? 35 : 85

                return (
                  <div
                    key={proj.id}
                    className="rounded-xl border border-border bg-muted/20 p-5 space-y-4 hover:border-blue-500/40 transition-all text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                            {proj.domain}
                          </Badge>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-[10px] font-bold">
                            Selected / Sponsored &bull; {proj.sponsorName || "CCL CSR Grant"}
                          </span>
                          <span className="text-xs font-bold text-foreground font-mono">
                            Role: {role}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-foreground">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Problem: <strong className="text-foreground">{proj.problemTitle}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                          {progress}% Progress
                        </span>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          Stage: <strong className="text-foreground">{stage}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>Milestone Progress</span>
                        <span>{progress}% Completed</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/70 text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                        <span>Faculty Mentor: <strong>{proj.teamFacultyLead || "Dr. Rahul Verma"}</strong></span>
                        <span>&bull;</span>
                        <span>Team: <strong>{proj.studentTeamSize || 5} Students</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/problems/${proj.problemId}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                            className: "text-xs h-8 gap-1",
                          })}
                        >
                          <span>View Problem</span>
                          <ExternalLink className="size-3" />
                        </Link>

                        <Button
                          size="sm"
                          onClick={() => window.alert("Solution: " + proj.title + "\nStatus: " + proj.status)}
                          className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                          <span>Track Project</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. CATEGORY 3: COMPLETED SOLUTIONS */}
      {(activeTab === "all" || activeTab === "completed") && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="size-4 text-emerald-500" />
                <span>Category 3: Completed Solutions</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Deployed innovation solutions that reached full lifecycle closure and Impact Verified status.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
              {completedSolutions.length} Completed
            </Badge>
          </div>

          {completedSolutions.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
              You have no completed solutions yet.
            </div>
          ) : (
            <div className="space-y-3">
              {completedSolutions.map((proj) => {
                const myParticipant = proj.studentParticipants?.find(
                  (sp) => sp.studentEmail.toLowerCase() === profile.email.toLowerCase()
                )
                const role = myParticipant?.role || "Embedded Systems Developer"
                const citizensBenefited = proj.citizensBenefitedCount || 4200

                return (
                  <div
                    key={proj.id}
                    className="rounded-xl border border-border bg-muted/20 p-5 space-y-4 hover:border-emerald-500/40 transition-all text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                            {proj.domain}
                          </Badge>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                            ✓ Completed &bull; Impact Verified
                          </span>
                          <span className="text-xs font-bold text-foreground font-mono">
                            Role: {role}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-foreground">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Problem: <strong className="text-foreground">{proj.problemTitle}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {citizensBenefited.toLocaleString()} Citizens Benefited
                        </span>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          Stage: <strong className="text-foreground">Impact Verified</strong>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {proj.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/70 text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                        <span>University: <strong>{proj.universityName}</strong></span>
                        <span>&bull;</span>
                        <span>Faculty Mentor: <strong>{proj.teamFacultyLead || "Dr. Ananya Sharma"}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/problems/${proj.problemId}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                            className: "text-xs h-8 gap-1",
                          })}
                        >
                          <span>View Problem</span>
                          <ExternalLink className="size-3" />
                        </Link>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.alert("Solution: " + proj.title + "\nStatus: " + proj.status)}
                          className="text-xs h-8 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 font-bold"
                        >
                          <span>View Solution Summary</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* State Innovation Achievements */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Trophy className="size-4 text-amber-500" />
              <span>State Innovation Badges & Accreditations</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Official recognitions by Department of Higher & Technical Education, Government of Jharkhand.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold">
            {achievements.length} Badges Earned
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-center flex flex-col items-center justify-center hover:border-primary/40 transition-all shadow-2xs"
            >
              <div className="size-10 rounded-full bg-card border border-border flex items-center justify-center shadow-xs">
                {renderAchievementIcon(ach.icon)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">{ach.title}</h4>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                  {ach.description}
                </p>
              </div>
              <span className="text-[9px] font-mono font-bold text-primary pt-1">
                Earned {ach.dateEarned}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        open={logoutModalOpen}
        onOpenChange={setLogoutModalOpen}
      />
    </div>
  )
}
