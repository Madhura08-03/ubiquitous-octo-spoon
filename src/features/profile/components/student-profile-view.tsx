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
  Code,
  ExternalLink,
  Sparkles,
  Edit,
  LogOut,
  Tag,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StudentUserProfile } from "@/services/profile/profile-types"
import { StudentProject } from "@/services/problems/problem-types"
import {
  MOCK_STUDENT_PROJECTS,
  MOCK_STUDENT_CONTRIBUTIONS,
  MOCK_STUDENT_ACHIEVEMENTS,
} from "@/data/profile-data"
import { LogoutDialog } from "@/features/auth/components/logout-dialog"

export interface StudentProfileViewProps {
  profile: StudentUserProfile
}

export function StudentProfileView({ profile }: StudentProfileViewProps) {
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false)

  const projects = MOCK_STUDENT_PROJECTS
  const contributions = MOCK_STUDENT_CONTRIBUTIONS
  const achievements = MOCK_STUDENT_ACHIEVEMENTS

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
              Dept. of Electrical & Electronics Engineering &bull; Reg: <span className="font-mono">{profile.registrationNumber || "BE/10452/2023"}</span>
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="size-3.5 text-primary" />
              <span>Verified Technical Skills</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(profile.skills && profile.skills.length > 0 ? profile.skills : ["IoT & Telemetry", "Embedded Firmware (C/C++)", "Renewable Solar Grids", "Python", "Next.js"]).map((skill) => (
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

      {/* 4-Item Student Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Projects
            </span>
            <FolderGit2 className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-foreground">
            {projects.length || 3}
          </p>
          <span className="text-[10px] text-muted-foreground">Active university R&D solutions</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Contributions
            </span>
            <Code className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-foreground">
            {contributions.length + 10 || 14}
          </p>
          <span className="text-[10px] text-muted-foreground">Milestones & technical commits</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Problems Contributed
            </span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            5
          </p>
          <span className="text-[10px] text-muted-foreground">Societal challenges addressed</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Achievements
            </span>
            <Trophy className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
            {achievements.length || 4}
          </p>
          <span className="text-[10px] text-muted-foreground">State innovation badges</span>
        </div>
      </div>

      {/* Navigation Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card shadow-2xs">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/30 text-primary font-bold text-xs">
            Student Innovator Dashboard
          </Badge>
          <Link
            href="/feed"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-2"
          >
            Explore Open Challenges &rarr;
          </Link>
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

      {/* 1. Student Projects Tracking Section */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FolderGit2 className="size-4 text-purple-500" />
              <span>My University Innovation Projects</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Active multidisciplinary capstones formulated around grassroots Jharkhand challenges.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold">
            {projects.length} Active R&D Projects
          </Badge>
        </div>

        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-xl border border-border bg-muted/20 p-5 space-y-4 hover:border-primary/40 transition-all text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                      {proj.domain}
                    </Badge>
                    <span className="text-xs font-bold text-foreground font-mono">
                      Role: {proj.role}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-foreground">{proj.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    Addressing: <strong className="text-foreground">{proj.problemTitle}</strong>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-primary">
                    {proj.progress}% Progress
                  </span>
                </div>
              </div>

              {/* Stages Bar */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Solution Development Stages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.stages.map((st: StudentProject["stages"][number]) => (
                    <span
                      key={st.name}
                      className={
                        "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border " +
                        (st.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                          : st.status === "current"
                          ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                          : "bg-muted text-muted-foreground border-border opacity-70")
                      }
                    >
                      <span>{st.name}</span>
                      {st.status === "completed" && <span>✓</span>}
                      {st.status === "current" && <span>●</span>}
                      {st.status === "pending" && <span>○</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <span>Team: {proj.teamSize} researchers &bull; {proj.university}</span>
                <Link
                  href={"/problems/" + proj.problemId}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "text-[11px] h-7 px-2.5 font-bold text-primary border-primary/30 hover:bg-primary/10 gap-1",
                  })}
                >
                  <span>Open Challenge</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Recent Contributions Section */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Code className="size-4 text-blue-500" />
            <span>Recent Technical Contributions</span>
          </h3>
          <Badge variant="outline" className="text-xs font-semibold">
            Verified Milestones
          </Badge>
        </div>

        <div className="space-y-3">
          {contributions.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>{c.title}</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{c.date}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[11px]">{c.description}</p>
              <div className="text-[10px] text-primary font-medium">{c.projectTitle}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Achievements Badges Section */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Trophy className="size-4 text-amber-500" />
            <span>Innovation Achievements & Badges</span>
          </h3>
          <Badge variant="outline" className="text-xs font-semibold">
            State Honors
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-4 rounded-xl border border-border bg-muted/20 flex items-start gap-3 text-left"
            >
              <div className="p-2 rounded-xl bg-background border border-border shrink-0">
                {renderAchievementIcon(ach.icon)}
              </div>
              <div className="space-y-0.5 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{ach.title}</span>
                  <span className="text-[10px] text-muted-foreground">{ach.dateEarned}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen} />
    </div>
  )
}