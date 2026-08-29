import { UserRole } from "../auth/auth-types"

export type DistrictJharkhand =
  | "Ranchi"
  | "Dhanbad"
  | "East Singhbhum"
  | "Bokaro"
  | "Hazaribagh"
  | "Deoghar"
  | "Giridih"
  | "Ramgarh"
  | "Palamu"
  | "Dumka"
  | "West Singhbhum"
  | "Saraikela Kharsawan"
  | "Other"

export interface BaseUserProfile {
  id: string
  role: UserRole
  name: string
  email: string
  mobile?: string
  bio?: string
  district?: DistrictJharkhand | string
  avatarUrl?: string
  joinedDate: string
  isEmailVerified: boolean
  isMobileVerified?: boolean
  points: number
  profileVisibility: "public" | "private"
  onboardingCompleted: boolean
}

export interface CitizenUserProfile extends BaseUserProfile {
  role: "citizen"
  locality?: string
  problemsReportedCount: number
  upvotesGivenCount: number
}

export interface StudentUserProfile extends BaseUserProfile {
  role: "student"
  university: string
  registrationNumber: string
  idCardStatus: "submitted" | "verified" | "rejected"
  skills: string[]
  interests: string[]
  portfolioUrl?: string
  projectsContributedCount: number
}

export interface UniversityUserProfile extends BaseUserProfile {
  role: "university"
  institutionName: string
  institutionCode: string // AISHE Code
  contactPerson: string
  institutionVerificationStatus: "pending" | "verified" | "rejected"
  academicDomains: string[]
  researchLabs: string[]
  websiteUrl?: string
  sponsoredProjectsCount: number
  industryCollaborationsCount: number
}

export interface IndustryUserProfile extends BaseUserProfile {
  role: "industry"
  organizationName: string
  organizationType: string
  registrationNumber: string // CIN / GSTIN
  contactPerson: string
  domain: string
  organizationVerificationStatus: "pending" | "verified" | "rejected"
  areasOfExpertise: string[]
  mentoringInterests: string[]
  fundingInterests: string[]
  websiteUrl?: string
  sponsoredProjectsCount: number
}

export type UserProfile =
  | CitizenUserProfile
  | StudentUserProfile
  | UniversityUserProfile
  | IndustryUserProfile

export interface ProfileCompletionResult {
  percentage: number
  completedFields: string[]
  missingFields: string[]
}

export interface UpdateProfilePayload {
  name?: string
  bio?: string
  district?: string
  avatarUrl?: string
  locality?: string
  university?: string
  skills?: string[]
  interests?: string[]
  portfolioUrl?: string
  academicDomains?: string[]
  researchLabs?: string[]
  websiteUrl?: string
  areasOfExpertise?: string[]
  mentoringInterests?: string[]
  fundingInterests?: string[]
  profileVisibility?: "public" | "private"
  onboardingCompleted?: boolean
}