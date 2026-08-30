"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { UserCheck } from "lucide-react"

import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { EmptyState } from "@/components/ui/empty-state"
import { PublicProfileView } from "@/features/profile/components/public-profile-view"
import { studentService } from "@/services/students/student-service"
import { mentorService } from "@/services/mentors/mentor-service"
import { solutionService } from "@/services/solutions/solution-service"
import { RegisteredStudent } from "@/services/students/student-types"
import { Mentor } from "@/services/mentors/mentor-types"
import { SolutionProposal } from "@/services/solutions/solution-types"

export default function PublicUserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params?.id === "string" ? params.id : ""

  const [student, setStudent] = React.useState<RegisteredStudent | null>(null)
  const [mentor, setMentor] = React.useState<Mentor | null>(null)
  const [proposals, setProposals] = React.useState<SolutionProposal[]>([])
  const [isLoading, setIsLoading] = React.useState(Boolean(id))

  React.useEffect(() => {
    if (!id) {
      return
    }

    Promise.all([
      studentService.getStudentById(id),
      mentorService.getMentorById(id),
      solutionService.getAllProposals(),
    ])
      .then(([studentRes, mentorRes, allProposals]) => {
        setStudent(studentRes)
        setMentor(mentorRes)

        if (studentRes) {
          const matched = allProposals.filter((p) =>
            p.studentParticipants?.some(
              (sp) =>
                sp.studentId.toLowerCase() === studentRes.id.toLowerCase() ||
                sp.studentEmail.toLowerCase() === studentRes.email.toLowerCase()
            )
          )
          setProposals(matched)
        } else if (mentorRes) {
          const matched = allProposals.filter(
            (p) =>
              p.teamFacultyLead?.toLowerCase().includes(mentorRes.name.toLowerCase()) ||
              mentorRes.name.toLowerCase().includes(p.teamFacultyLead?.toLowerCase() || "")
          )
          setProposals(matched)
        }

        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [id])

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
            <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground">Loading public ecosystem profile...</p>
          </div>
        ) : !student && !mentor ? (
          <div className="space-y-4 max-w-md mx-auto text-center pt-12">
            <EmptyState
              icon={UserCheck}
              title="Profile Not Found"
              description="This user profile does not exist or has set their directory visibility to private."
              actionLabel="Return to Feed"
              onAction={() => router.push("/feed")}
            />
          </div>
        ) : (
          <PublicProfileView
            student={student}
            mentor={mentor}
            userProposals={proposals}
          />
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
