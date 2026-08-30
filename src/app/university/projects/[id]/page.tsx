"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  FolderGit2,
  Users,
  Layers,
  FileText,
  Activity,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  DollarSign,
  Award,
} from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StudentProject } from "@/services/projects/project-types"
import { ImplementationStage } from "@/services/implementation/implementation-types"
import { projectService } from "@/services/projects/project-service"
import { authService } from "@/services/auth/auth-service"

import { SelectedSolutionSection } from "@/features/projects/components/selected-solution-section"
import { ProjectTeamSection } from "@/features/projects/components/project-team-section"
import { ProjectMentorSection } from "@/features/projects/components/project-mentor-section"
import { ProjectMilestoneSection } from "@/features/projects/components/project-milestone-section"
import { ProjectEvidenceSection } from "@/features/projects/components/project-evidence-section"
import { ProjectBudgetSection } from "@/features/projects/components/project-budget-section"
import { ProjectRiskSection } from "@/features/projects/components/project-risk-section"
import { GovernmentReviewStatus } from "@/features/projects/components/government-review-status"
import { ProjectActivityTimeline } from "@/features/projects/components/project-activity-timeline"
import { ImplementationLifecycle } from "@/features/government/components/implementation-lifecycle"

export default function UniversityProjectWorkspaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  
  const [project, setProject] = React.useState<StudentProject | null>(null)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = React.useCallback(async () => {
    if (!rawId) return
    try {
      const proj = await projectService.getProjectById(rawId)
      setProject(proj)
    } finally {
      setIsLoading(false)
    }
  }, [rawId])

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    loadData()

    const unsubscribe = projectService.subscribe(() => {
      loadData()
    })
    return () => unsubscribe()
  }, [router, loadData])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-xs text-muted-foreground">
        Loading Institutional Project Workspace...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Project Not Found</h2>
        <Link
          href="/university/projects"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold px-4 py-2 hover:bg-primary/90"
        >
          Return to University Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "University Projects", href: "/university/projects" },
            { label: project.title },
          ]}
        />

        {/* Top Header Banner Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/university/projects"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to University Projects</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono">
                {project.domain}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {project.district} District
              </Badge>
              <Badge className="bg-primary text-primary-foreground text-[10px] uppercase font-mono font-bold">
                Stage: {project.projectStage.replace("_", " ")}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-bold block">
              Problem Reference: {project.problemTitle}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              {project.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/40 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Faculty Mentor</span>
              <p className="font-bold text-foreground truncate flex items-center gap-1">
                <GraduationCap className="size-3.5 text-primary shrink-0" />
                <span>{project.facultyMentor.name}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Student Team</span>
              <p className="font-bold text-foreground flex items-center gap-1">
                <Users className="size-3.5 text-primary shrink-0" />
                <span>{project.teamMembers?.length || project.studentParticipants.length} Students</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Sponsor</span>
              <p className="font-bold text-emerald-800 dark:text-emerald-300 truncate flex items-center gap-1">
                <Award className="size-3.5 text-emerald-600 shrink-0" />
                <span>{project.sponsorName || "State Innovation Grant"}</span>
              </p>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Implementation Progress</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-foreground">{project.progressPercentage}%</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${project.progressPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task 22 Lifecycle Visualizer Integration */}
        <ImplementationLifecycle currentStage={project.projectStage as ImplementationStage} />

        {/* Tabbed Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="border-b border-border pb-1 overflow-x-auto">
            <TabsList className="flex w-max sm:w-auto h-auto p-1 bg-muted/50 rounded-2xl gap-1">
              <TabsTrigger value="overview" className="text-xs font-bold py-2.5 px-4 gap-1.5">
                <FolderGit2 className="size-3.5" />
                <span>Overview</span>
              </TabsTrigger>

              <TabsTrigger value="solution" className="text-xs font-bold py-2.5 px-4 gap-1.5">
                <Award className="size-3.5" />
                <span>Selected Solution</span>
              </TabsTrigger>

              <TabsTrigger value="team" className="text-xs font-bold py-2.5 px-4 gap-1.5">
                <Users className="size-3.5" />
                <span>Team & Mentor</span>
              </TabsTrigger>

              <TabsTrigger value="milestones" className="text-xs font-bold py-2.5 px-4 gap-1.5">
                <Layers className="size-3.5" />
                <span>Milestones ({project.milestones.length})</span>
              </TabsTrigger>

              <TabsTrigger value="evidence" className="text-xs font-bold py-2.5 px-4 gap-1.5">
                <FileText className="size-3.5" />
                <span>Evidence ({project.evidence?.length || 0})</span>
              </TabsTrigger>

              <TabsTrigger value="budget" className="text-xs font-bold py-2.5 px-4 gap-1.5">
                <DollarSign className="size-3.5" />
                <span>Budget & Risks</span>
              </TabsTrigger>

              <TabsTrigger value="government" className="text-xs font-bold py-2.5 px-4 gap-1.5">
                <ShieldCheck className="size-3.5" />
                <span>Government Reviews</span>
              </TabsTrigger>

              <TabsTrigger value="activity" className="text-xs font-bold py-2.5 px-4 gap-1.5">
                <Activity className="size-3.5" />
                <span>Activity</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4">
                <h3 className="text-base font-bold text-foreground">Project Objectives</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {project.objectives?.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold">&bull;</span>
                      <span className="text-foreground">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4">
                <h3 className="text-base font-bold text-foreground">Key Technologies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies?.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <ProjectBudgetSection project={project} />
          </TabsContent>

          <TabsContent value="solution" className="mt-0">
            <SelectedSolutionSection project={project} />
          </TabsContent>

          <TabsContent value="team" className="mt-0 space-y-6">
            <ProjectMentorSection project={project} />
            <ProjectTeamSection project={project} />
          </TabsContent>

          <TabsContent value="milestones" className="mt-0">
            <ProjectMilestoneSection project={project} onReload={loadData} />
          </TabsContent>

          <TabsContent value="evidence" className="mt-0">
            <ProjectEvidenceSection project={project} onReload={loadData} />
          </TabsContent>

          <TabsContent value="budget" className="mt-0 space-y-6">
            <ProjectBudgetSection project={project} />
            <ProjectRiskSection project={project} onReload={loadData} />
          </TabsContent>

          <TabsContent value="government" className="mt-0">
            <GovernmentReviewStatus project={project} />
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <ProjectActivityTimeline project={project} />
          </TabsContent>
        </Tabs>
      </main>

      <PublicFooter />
    </div>
  )
}
