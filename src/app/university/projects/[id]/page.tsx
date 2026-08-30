"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ShieldAlert } from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { EmptyState } from "@/components/ui/empty-state"
import { ProjectWorkspace } from "@/features/projects/components/project-workspace"
import { StudentProject } from "@/services/projects/project-types"
import { projectService } from "@/services/projects/project-service"
import { authService } from "@/services/auth/auth-service"

export default function UniversityProjectWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = typeof params?.id === "string" ? params.id : ""

  const [project, setProject] = React.useState<StudentProject | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const currentUser = authService.getCurrentUser()
  const [isAccessDenied, setIsAccessDenied] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true
    const user = authService.getCurrentUser()

    if (!user) {
      router.replace("/login")
      return
    }

    if (!projectId) {
      return
    }

    projectService.getProjectById(projectId)
      .then((proj) => {
        if (isMounted) {
          if (!proj) {
            setIsAccessDenied(true)
            setProject(null)
          } else {
            setIsAccessDenied(false)
            setProject(proj)
          }
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAccessDenied(true)
          setProject(null)
          setIsLoading(false)
        }
      })

    const unsubscribe = projectService.subscribe(() => {
      projectService.getProjectById(projectId).then((p) => {
        if (isMounted && p) setProject(p)
      })
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [projectId, router])

  const handleReload = React.useCallback(() => {
    if (!projectId) return
    projectService.getProjectById(projectId).then((p) => {
      if (p) setProject(p)
    })
  }, [projectId])

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "University Mentors", href: "/university/mentors" },
            { label: project ? project.title : "Project Workspace" },
          ]}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
            <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground">Loading institutional project workspace...</p>
          </div>
        ) : isAccessDenied || !project ? (
          <div className="max-w-md mx-auto pt-12 text-center space-y-4">
            <EmptyState
              icon={ShieldAlert}
              title="Project Not Found"
              description="This project workspace does not exist or does not belong to your university jurisdiction."
              actionLabel="Return to Mentors"
              onAction={() => router.push("/university/mentors")}
            />
          </div>
        ) : (
          <ProjectWorkspace
            project={project}
            isMentorOrUniversity={true}
            onProjectUpdated={handleReload}
            currentUserName={currentUser?.name || "Dr. Ananya Sharma"}
          />
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
