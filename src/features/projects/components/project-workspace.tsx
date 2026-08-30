"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  FolderGit2,
  Users,
  Layers,
  FileText,
  Activity,
  MessageSquareQuote,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StudentProject } from "@/services/projects/project-types"
import { ProjectOverview } from "./project-overview"
import { ProjectTeam } from "./project-team"
import { ProjectMilestones } from "./project-milestones"
import { ProjectDocuments } from "./project-documents"
import { ProjectActivityTimeline } from "./project-activity-timeline"
import { MentorFeedback } from "./mentor-feedback"

export interface ProjectWorkspaceProps {
  project: StudentProject
  isMentorOrUniversity?: boolean
  onProjectUpdated?: () => void
  currentUserName?: string
}

export function ProjectWorkspace({
  project,
  isMentorOrUniversity = false,
  onProjectUpdated,
  currentUserName = "Priya Sharma",
}: ProjectWorkspaceProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState("overview")

  const pendingMilestonesCount = project.milestones.filter(
    (m) => m.status === "under_review" || m.status === "submitted"
  ).length

  const changesRequestedCount = project.milestones.filter(
    (m) => m.status === "changes_requested"
  ).length

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto w-full">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(isMentorOrUniversity ? "/university/mentors" : "/student/projects")}
            className="text-xs font-semibold gap-1.5 h-8"
          >
            <ArrowLeft className="size-3.5" />
            <span>{isMentorOrUniversity ? "Back to Mentors" : "Back to Projects"}</span>
          </Button>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-bold border-primary/30 text-primary">
              {project.domain}
            </Badge>
            <Badge variant="secondary" className="text-xs uppercase font-bold tracking-wider">
              {project.projectStage} Stage
            </Badge>
            {project.sponsorshipStatus === "sponsored" && (
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-xs font-bold gap-1">
                <ShieldCheck className="size-3" />
                <span>Sponsored</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 max-w-3xl">
            {project.summary}
          </p>
        </div>

        {/* Quick Meta Strip */}
        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span>Faculty Mentor: <strong className="text-foreground">{project.facultyMentor.name}</strong></span>
            <span>&bull;</span>
            <span>Team: <strong className="text-foreground">{project.studentParticipants.length} Researchers</strong></span>
            <span>&bull;</span>
            <span>District: <strong className="text-foreground">{project.district}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">Progress:</span>
            <span className="font-mono font-bold text-primary text-sm">{project.progressPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="border-b border-border pb-1 overflow-x-auto">
          <TabsList className="flex w-max sm:w-auto h-auto p-1 bg-muted/50 rounded-2xl gap-1">
            <TabsTrigger value="overview" className="text-xs font-bold py-2.5 px-4 gap-1.5">
              <FolderGit2 className="size-3.5" />
              <span>Overview</span>
            </TabsTrigger>

            <TabsTrigger value="milestones" className="text-xs font-bold py-2.5 px-4 gap-1.5 relative">
              <Layers className="size-3.5" />
              <span>Milestones ({project.milestones.length})</span>
              {(pendingMilestonesCount > 0 || changesRequestedCount > 0) && (
                <span className="size-2 rounded-full bg-amber-500 animate-pulse ml-0.5" />
              )}
            </TabsTrigger>

            <TabsTrigger value="team" className="text-xs font-bold py-2.5 px-4 gap-1.5">
              <Users className="size-3.5" />
              <span>Team & Mentor</span>
            </TabsTrigger>

            <TabsTrigger value="documents" className="text-xs font-bold py-2.5 px-4 gap-1.5">
              <FileText className="size-3.5" />
              <span>Documents ({project.documents.length})</span>
            </TabsTrigger>

            <TabsTrigger value="activity" className="text-xs font-bold py-2.5 px-4 gap-1.5">
              <Activity className="size-3.5" />
              <span>Activity</span>
            </TabsTrigger>

            <TabsTrigger value="feedback" className="text-xs font-bold py-2.5 px-4 gap-1.5">
              <MessageSquareQuote className="size-3.5" />
              <span>Mentor Feedback ({project.mentorFeedback.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <ProjectOverview project={project} />
        </TabsContent>

        <TabsContent value="milestones" className="mt-0">
          <ProjectMilestones
            project={project}
            isMentorOrUniversity={isMentorOrUniversity}
            onProjectUpdated={onProjectUpdated}
            currentUserName={currentUserName}
          />
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <ProjectTeam project={project} />
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <ProjectDocuments
            project={project}
            onProjectUpdated={onProjectUpdated}
            currentUserName={currentUserName}
          />
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <ProjectActivityTimeline project={project} />
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          <MentorFeedback project={project} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
