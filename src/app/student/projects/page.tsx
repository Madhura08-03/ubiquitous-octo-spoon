"use client"

import * as React from "react"
import Link from "next/link"
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

    projectService.getStudentProjects(studentId)
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
      projectService.getStudentProjects(studentId).then((p) => {
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

    if (filterTab === "active") {
      return matchesSearch && (p.status === "active" || p.status === "awaiting_mentor_review" || p.status === "awaiting_review")
    }
    if (filterTab === "awaiting_review") {
      return matchesSearch && (p.status === "awaiting_mentor_review" || p.status === "awaiting_review" || p.status === "changes_requested")
    }
    if (filterTab === "completed") {
      return matchesSearch && (p.status === "completed" || p.projectStage === "impact_verified")
    }
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
              <span>My Projects</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Track your university solution projects, milestones, team progress, and mentor reviews.
            </p>
          </div>

          <Link href="/feed">
            <Button
              size="sm"
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-xs shrink-0"
            >
              <Sparkles className="size-3.5" />
              <span>Explore Open Challenges</span>
            </Button>
          </Link>
        </div>

        {/* Top 5 Statistics Cards */}
        <StudentContributionSummary projects={projects} studentId={currentUser?.id} />

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl w-max border border-border">
            {[
              { id: "all", label: `All (${projects.length})` },
              { id: "active", label: "Active" },
              { id: "awaiting_review", label: "Awaiting Review" },
              { id: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id as typeof filterTab)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  filterTab === tab.id
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, problems, mentors..."
              className="pl-8 text-xs h-9"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl border border-border bg-card/40 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No projects found"
            description={
              searchQuery
                ? "No innovation projects match your current search criteria."
                : "You have not been assigned to any university solution project teams yet. Discover open societal challenges and collaborate with your university faculty."
            }
            actionLabel="Explore Open Challenges"
            onAction={() => router.push("/feed")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <StudentProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
