import * as React from "react"
import {
  FileQuestion,
  Lightbulb,
  GraduationCap,
  UserCheck,
  Award,
  Building2,
} from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"
import { UniversityDashboardStats } from "@/services/university/university-types"

export interface UniversityStatsGridProps {
  stats: UniversityDashboardStats
}

export function UniversityStatsGrid({ stats }: UniversityStatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-left">
      <StatCard
        title="Assigned Problems"
        value={stats.assignedProblems}
        description="Nodal matched challenges"
        icon={FileQuestion}
        variant="default"
      />

      <StatCard
        title="Active Projects"
        value={stats.activeProjects}
        description="Ongoing R&D solutions"
        icon={Lightbulb}
        variant="lime"
      />

      <StatCard
        title="Students"
        value={stats.totalStudents}
        description={stats.activeStudents + " active in capstones"}
        icon={GraduationCap}
        variant="teal"
      />

      <StatCard
        title="Faculty Mentors"
        value={stats.mentorsCount}
        description="Guiding research teams"
        icon={UserCheck}
        variant="default"
      />

      <StatCard
        title="Completed"
        value={stats.completedProjects}
        description="Deployed prototypes"
        icon={Award}
        variant="default"
      />

      <StatCard
        title="Industry CSR"
        value={stats.industryCollaborations}
        description="Active partnerships"
        icon={Building2}
        variant="charcoal"
      />
    </div>
  )
}
