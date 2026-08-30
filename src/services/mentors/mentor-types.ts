export type MentorAvailabilityStatus = "available" | "limited" | "at_capacity" | "unavailable"
export type MentorVerificationStatus = "verified" | "pending"

export interface MilestoneReview {
  id: string
  milestoneTitle: string
  description: string
  submittedDate: string
  studentComments: string
  attachmentsCount: number
  status: "pending" | "approved" | "changes_requested"
  mentorFeedback?: string
  reviewedAt?: string
}

export interface MentorTeamAssignment {
  id: string
  teamId: string
  teamName: string
  problemId: string
  problemTitle: string
  solutionTitle: string
  teamLead: string
  studentCount: number
  projectStage: "Research" | "Design" | "Prototype" | "Testing" | "Pilot" | "Deployed"
  progress: number
  assignedAt: string
  lastMilestone: string
  pendingReview?: MilestoneReview
}

export interface Mentor {
  id: string
  universityId: string
  universityName: string
  name: string
  designation: string
  department: string
  email: string
  phone: string
  avatar?: string
  expertise: string[]
  researchDomains: string[]
  skills: string[]
  yearsOfExperience: number
  qualifications: string[]
  maximumTeams: number
  availabilityStatus: MentorAvailabilityStatus
  assignedTeams: MentorTeamAssignment[]
  bio: string
  researchInterests?: string
  verificationStatus: MentorVerificationStatus
  createdAt: string
  updatedAt: string
}

export interface CreateMentorPayload {
  name: string
  designation: string
  department: string
  email: string
  phone?: string
  expertise: string[]
  researchDomains: string[]
  skills?: string[]
  yearsOfExperience: number
  qualifications: string[]
  maximumTeams: number
  bio: string
  researchInterests?: string
}

export interface UpdateMentorPayload {
  designation?: string
  department?: string
  email?: string
  phone?: string
  expertise?: string[]
  researchDomains?: string[]
  skills?: string[]
  yearsOfExperience?: number
  qualifications?: string[]
  maximumTeams?: number
  availabilityStatus?: MentorAvailabilityStatus
  bio?: string
  researchInterests?: string
}

export interface AssignMentorPayload {
  teamId: string
  teamName: string
  problemId: string
  problemTitle: string
  solutionTitle: string
  teamLead: string
  studentCount: number
  projectStage: "Research" | "Design" | "Prototype" | "Testing" | "Pilot" | "Deployed"
  progress?: number
  lastMilestone?: string
}

export interface MentorFilters {
  search: string
  department: string
  domain: string
  availability: string
  verification: string
  sortBy: "name" | "capacity" | "experience" | "teams"
}

export interface MentorStats {
  totalMentors: number
  availableMentors: number
  limitedMentors: number
  atCapacityMentors: number
  activeTeamsCount: number
  availableCapacitySlots: number
  pendingReviewsCount: number
}
