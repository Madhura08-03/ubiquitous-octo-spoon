export interface RegisteredStudent {
  id: string
  name: string
  email: string
  universityId: string
  universityName: string
  department: string
  registrationNumber: string
  skills: string[]
  researchInterests: string[]
  bio: string
  district: string
  avatarUrl?: string
  joinedDate: string
  socialLinks?: {
    linkedin?: string
    github?: string
    instagram?: string
    portfolio?: string
  }
  privacySettings?: {
    showLinkedin: boolean
    showGithub: boolean
    showInstagram: boolean
    showSkills: boolean
    showProjects: boolean
    showDistrict: boolean
  }
}

export interface StudentVerificationResult {
  status: "verified" | "not_found" | "different_university"
  student?: RegisteredStudent
  errorMessage?: string
}

export interface StudentSolutionContribution {
  id: string
  category: "proposed" | "active" | "completed"
  problemId: string
  problemTitle: string
  proposalId: string
  solutionTitle: string
  universityName: string
  studentRole: string
  statusLabel: string
  currentStage?: "Design" | "Prototype" | "Pilot" | "Deployed" | "Impact Verified"
  progress?: number
  facultyMentor?: string
  teamSize?: number
  citizensBenefited?: number
  joinedDate: string
}
