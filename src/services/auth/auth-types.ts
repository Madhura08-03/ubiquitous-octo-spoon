export type UserRole =
  | "citizen"
  | "student"
  | "university"
  | "industry"
  | "government_admin"

export type VerificationStatus = "active" | "pending_verification" | "rejected"

export interface AuthUser {
  id: string
  name: string
  email?: string
  mobile?: string
  role: UserRole
  organization?: string
  status: VerificationStatus
  avatarUrl?: string
  createdAt: string
}

export interface LoginCredentials {
  identifier: string // Email or Mobile Number
  password: string
  role?: UserRole
}

export interface CitizenRegisterPayload {
  fullName: string
  mobile: string
  email?: string
  password?: string
  confirmPassword?: string
  about?: string
}

export interface StudentRegisterPayload {
  fullName: string
  mobile: string
  email: string
  university: string
  registrationNumber: string
  idCardFileName?: string
  idCardFileSize?: number
  password?: string
  confirmPassword?: string
  about?: string
}

export interface UniversityRegisterPayload {
  universityName: string
  institutionCode: string // AISHE / Govt Code
  officialEmail: string
  contactPerson: string
  mobile: string
  documentFileName?: string
  password?: string
  confirmPassword?: string
  about?: string
}

export interface IndustryRegisterPayload {
  organizationName: string
  organizationType: string
  officialEmail: string
  mobile: string
  contactPerson: string
  domain: string
  registrationNumber: string // CIN / GSTIN
  proofFileName?: string
  password?: string
  confirmPassword?: string
  about?: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  message?: string
  requiresOtp?: boolean
}

export interface OtpVerificationPayload {
  identifier: string
  otp: string
}