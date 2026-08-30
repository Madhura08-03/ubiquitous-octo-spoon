"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FolderGit2, Search, Sparkles } from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"
import { StudentProjectCard } from "@/features/projects/components/student-project-card"
import { StudentContributionSummary } from "@/features/projects/components/student-contribution-summary"
import { StudentProject } from "@/services/projects/project-types"
import { projectService } from "@/services/projects/project-service"
import { authService } from "@/services/auth/auth-service"

export default function StudentProjectsPage() {
  const router = useRouter()
  const currentUser = authService.getCurrentUser()
  const [projects, setProjects] = React.useState<StudentProject[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterTab, setFilterTab] = React.useState<"all" | "active" | "awaiting_review" | "completed">("all")

  React.useEffect(() => {
    let isMounted = true
    const user = authService.getCurrentUser()

    if (!user) {
      router.replace("/login")
      return
    }

    const studentId = user.id || "stu_001"
    const studentEmail = user.email || "priya.sharma@student.bitmesra.ac.in"

    projectService.getStudentProjects(studentId, studentEmail)
      .then((userProjects) => {
        if (isMounted) {
          setProjects(userProjects)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setProjects([])
          setIsLoading(false)
        }
      })

    const unsubscribe = projectService.subscribe(() => {
      projectService.getStudentProjects(studentId, studentEmail).then((p) => {
        if (isMounted) setProjects(p)
      })
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [router])

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.facultyMentor.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterTab === "active") return matchesSearch && (p.status === "active" || p.status === "awaiting_review")
    if (filterTab === "awaiting_review") return matchesSearch && (p.status === "awaiting_review" || p.status === "changes_requested")
    if (filterTab === "completed") return matchesSearch && (p.status === "completed" || p.projectStage === "impact_verified")
    return matchesSearch
  })

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Student Hub", href: "/profile" },
            { label: "My Projects" },
          ]}
        />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <FolderGit2 className="size-7 text-primary" />
              <span>My Innovation Projects</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Track your active capstone research, milestone deliverables, faculty guidance, and CSR sponsorships.
            </p>
          </div>

          <Button
            onClick={() => router.push("/feed")}
            className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 self-start sm:self-auto shadow-xs"
          >
            <Sparkles className="size-3.5" />
            <span>Discover Open Challenges</span>
          </Button>
        </div>

        {/* Top Summary Statistics */}
        <StudentContributionSummary projects={projects} studentId={currentUser?.id || "stu_001"} />

        {/* Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, challenge, or faculty mentor..."
              className="pl-8 text-xs h-9"
            />
          </div>

          <div className="flex flex-wrap gap-1 p-1 bg-muted/40 rounded-xl border border-border">
            {[
              { id: "all", label: `All (${projects.length})` },
              { id: "active", label: "Active" },
              { id: "awaiting_review", label: "Under Review" },
              { id: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id as typeof filterTab)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filterTab === tab.id
                    ? "bg-card text-foreground font-bold shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
            <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground">Loading your project workspaces...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="pt-6 max-w-md mx-auto">
            <EmptyState
              icon={FolderGit2}
              title="No Innovation Projects Found"
              description={
                searchQuery
                  ? "No projects match your current search keywords."
                  : "You are not currently participating in any active innovation projects. Explore public challenges to propose solutions with your university."
              }
              actionLabel="Explore Open Challenges"
              onAction={() => router.push("/feed")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <StudentProjectCard
                key={project.id}
                project={project}
                currentStudentId={currentUser?.id || "stu_001"}
              />
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
