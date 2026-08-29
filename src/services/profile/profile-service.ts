import {
  UserProfile,
  UpdateProfilePayload,
  ProfileCompletionResult,
} from "./profile-types"
import { UserRole } from "../auth/auth-types"
import { authService } from "../auth/auth-service"
import { MOCK_PROFILES_BY_ROLE } from "@/data/profile-data"

const PROFILE_STORAGE_KEY = "jh_innovation_user_profile"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export class MockProfileService {
  /**
   * Retrieves the current user profile, reading from session storage or matching the active auth session.
   */
  async getProfile(): Promise<UserProfile> {
    await this.simulateDelay(200)

    if (isClient()) {
      const stored = sessionStorage.getItem(PROFILE_STORAGE_KEY)
      if (stored) {
        try {
          return JSON.parse(stored) as UserProfile
        } catch {
          // fallback to base mock
        }
      }
    }

    const authUser = authService.getCurrentUser()
    const role: UserRole = (authUser?.role as UserRole) || "citizen"
    const baseMock = MOCK_PROFILES_BY_ROLE[role] || MOCK_PROFILES_BY_ROLE.citizen

    // Merge active auth user credentials if present
    const profile: UserProfile = {
      ...baseMock,
      id: authUser?.id || baseMock.id,
      name: authUser?.name || baseMock.name,
      email: authUser?.email || baseMock.email,
      mobile: authUser?.mobile || baseMock.mobile,
      role: (authUser?.role as UserRole) || baseMock.role,
    } as UserProfile

    this.saveProfile(profile)
    return profile
  }

  /**
   * Updates fields on the user profile.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    await this.simulateDelay(400)
    const current = await this.getProfile()

    const updated: UserProfile = {
      ...current,
      ...payload,
    } as UserProfile

    this.saveProfile(updated)
    return updated
  }

  /**
   * Computes a deterministic profile completion result.
   */
  calculateProfileCompletion(profile: UserProfile): ProfileCompletionResult {
    const completedFields: string[] = []
    const missingFields: string[] = []

    let totalWeight = 0
    let earnedWeight = 0

    const checkField = (_name: string, label: string, weight: number, isPresent: boolean) => {
      totalWeight += weight
      if (isPresent) {
        earnedWeight += weight
        completedFields.push(label)
      } else {
        missingFields.push(label)
      }
    }

    // Common Profile Fields
    checkField("name", "Full Name", 15, Boolean(profile.name && profile.name.trim()))
    checkField("bio", "Professional / Community Bio", 15, Boolean(profile.bio && profile.bio.trim().length > 10))
    checkField("district", "Jharkhand District", 10, Boolean(profile.district))
    checkField("avatar", "Profile Photo / Logo", 10, Boolean(profile.avatarUrl))
    checkField("emailVerified", "Verified Email", 15, Boolean(profile.isEmailVerified))

    // Role-specific Fields
    if (profile.role === "citizen") {
      checkField("locality", "Panchayat / Locality", 20, Boolean(profile.locality))
      checkField("mobileVerified", "Verified Mobile", 15, Boolean(profile.isMobileVerified))
    } else if (profile.role === "student") {
      checkField("university", "University Affiliation", 10, Boolean(profile.university))
      checkField("regNo", "Registration / Roll No", 10, Boolean(profile.registrationNumber))
      checkField("skills", "Technical Skills", 10, Boolean(profile.skills && profile.skills.length > 0))
      checkField("interests", "Innovation Interests", 10, Boolean(profile.interests && profile.interests.length > 0))
    } else if (profile.role === "university") {
      checkField("institutionCode", "AISHE / Govt Code", 10, Boolean(profile.institutionCode))
      checkField("contactPerson", "Nodal Officer / Dean Contact", 10, Boolean(profile.contactPerson))
      checkField("domains", "Academic Domains", 10, Boolean(profile.academicDomains && profile.academicDomains.length > 0))
      checkField("labs", "Research Facilities / Labs", 10, Boolean(profile.researchLabs && profile.researchLabs.length > 0))
    } else if (profile.role === "industry") {
      checkField("regNo", "Corporate Registration (CIN/GSTIN)", 10, Boolean(profile.registrationNumber))
      checkField("contactPerson", "Authorized CSR Lead", 10, Boolean(profile.contactPerson))
      checkField("expertise", "Areas of Expertise", 10, Boolean(profile.areasOfExpertise && profile.areasOfExpertise.length > 0))
      checkField("interests", "Funding & Mentoring Focus", 10, Boolean(profile.fundingInterests && profile.fundingInterests.length > 0))
    }

    const percentage = Math.min(100, Math.round((earnedWeight / totalWeight) * 100))

    return {
      percentage,
      completedFields,
      missingFields,
    }
  }

  private saveProfile(profile: UserProfile): void {
    if (isClient()) {
      sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    }
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const profileService = new MockProfileService()