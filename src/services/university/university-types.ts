import { ProblemDomain, ProblemPriority, ProblemLifecycleStage } from "@/services/problems/problem-types"
import { TimelineItem } from "@/components/ui/timeline"

export interface UniversityDashboardStats {
  assignedProblems: number
  activeProjects: number
  totalStudents: number
  activeStudents: number
  availableStudents: number
  mentorsCount: number
  completedProjects: number
  industryCollaborations: number
}

export interface UniversityAssignedProblem {
  id: string
  problemId: string
  title: string
  domain: ProblemDomain
  district: string
  location: string
  priority: ProblemPriority
  communityReports: number
  aiMatchScore: number
  status: ProblemLifecycleStage | "verified" | "in_progress" | "resolved"
  assignedDate: string
  assignedDepartment: string
  assignedMentor?: string
  activeTeamSize?: number
  deadline?: string
}

export interface UniversityRecommendedProblem {
  id: string
  problemId: string
  title: string
  domain: ProblemDomain
  district: string
  matchPercentage: number
  matchCriteria: string[]
  description: string
  priority: ProblemPriority
  reportsCount: number
  urgencyLevel: string
}

export interface UniversityProject {
  id: string
  title: string
  problemId: string
  problemTitle: string
  domain: ProblemDomain
  progress: number
  currentStage: "Research" | "Design" | "Prototype" | "Testing" | "Pilot" | "Deployed"
  mentor: string
  mentorDepartment: string
  studentTeamSize: number
  students: {
    id: string
    name: string
    role: string
    department: string
  }[]
  lastUpdated: string
  stages: {
    name: string
    status: "completed" | "current" | "pending"
  }[]
  budgetGrant?: string
  industryPartner?: string
}

export interface UniversityStudent {
  id: string
  name: string
  department: string
  year: string
  skills: string[]
  currentProject?: string
  status: "active_project" | "available"
  contributionsCount: number
  badgesCount: number
}

export interface UniversityMentor {
  id: string
  name: string
  designation: string
  department: string
  domainSpecialization: string
  currentTeams: number
  maxTeams: number
  status: "available" | "at_capacity"
  activeProjects: string[]
  email?: string
}

export interface UniversityCollaboration {
  id: string
  industryPartner: string
  partnerType: string
  projectTitle: string
  contributionType: string
  status: "active" | "pending" | "completed"
  amountOrScope: string
  startDate: string
}

export interface UniversityImpactSummary {
  problemsAddressed: number
  studentsEngaged: number
  solutionsDeveloped: number
  solutionsDeployed: number
  citizensBenefited: number
}

export interface UniversityDashboardData {
  institutionName: string
  institutionCode: string
  verificationStatus: "verified" | "under_review"
  district: string
  stats: UniversityDashboardStats
  assignedProblems: UniversityAssignedProblem[]
  recommendedProblems: UniversityRecommendedProblem[]
  activeProjects: UniversityProject[]
  students: UniversityStudent[]
  mentors: UniversityMentor[]
  collaborations: UniversityCollaboration[]
  collaborationMetrics: {
    active: number
    pending: number
    completed: number
  }
  recentActivity: TimelineItem[]
  impact: UniversityImpactSummary
}
