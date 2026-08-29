import {
  AuthUser,
  AuthResponse,
  LoginCredentials,
  CitizenRegisterPayload,
  StudentRegisterPayload,
  UniversityRegisterPayload,
  IndustryRegisterPayload,
  OtpVerificationPayload,
} from "./auth-types"

const AUTH_STORAGE_KEY = "jh_innovation_auth_session"

function isClient(): boolean {
  return typeof window !== "undefined"
}

export class MockAuthService {
  /**
   * Retrieves the currently authenticated mock session from client storage.
   */
  getCurrentUser(): AuthUser | null {
    if (!isClient()) return null
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY)
      if (!stored) return null
      return JSON.parse(stored) as AuthUser
    } catch {
      return null
    }
  }

  /**
   * Checks if there is an active authenticated session.
   */
  isAuthenticated(): boolean {
    return Boolean(this.getCurrentUser())
  }

  /**
   * Simulates user login across standard portal roles.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.simulateDelay(600)

    const id = credentials.identifier.trim().toLowerCase()

    if (!id || !credentials.password) {
      return { success: false, message: "Please enter your registered mobile/email and password." }
    }

    // Role-tailored mock user response
    const assignedRole = credentials.role || (id.includes("@bitmesra") ? "student" : "citizen")

    const user: AuthUser = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: this.formatMockName(id, assignedRole),
      email: id.includes("@") ? id : `${id}@citizen.jharkhand.in`,
      mobile: id.includes("@") ? "9835012345" : id,
      role: assignedRole,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    this.saveSession(user)
    return {
      success: true,
      user,
      message: `Welcome back, ${user.name}!`,
    }
  }

  /**
   * Dedicated Government Administration secure login.
   */
  async loginAdmin(officialId: string, password: string): Promise<AuthResponse> {
    await this.simulateDelay(800)

    const cleanId = officialId.trim().toLowerCase()

    if (!cleanId || !password) {
      return { success: false, message: "Please provide valid Government Official Credentials." }
    }

    // Strict validation for admin demo
    if (password.length < 4) {
      return { success: false, message: "Invalid Government credentials or expired authorization key." }
    }

    const adminUser: AuthUser = {
      id: "gov_nodal_8902",
      name: "Dr. Sunita Murmu (IAS)",
      email: cleanId.includes("@") ? cleanId : "sunita.murmu@jharkhand.gov.in",
      role: "government_admin",
      organization: "Dept. of Higher & Technical Education, Ranchi",
      status: "active",
      createdAt: new Date().toISOString(),
    }

    this.saveSession(adminUser)
    return {
      success: true,
      user: adminUser,
      message: "Government administrative security credentials verified.",
    }
  }

  /**
   * Citizen registration (Initiates OTP verification step).
   */
  async registerCitizen(payload: CitizenRegisterPayload): Promise<AuthResponse> {
    await this.simulateDelay(500)

    if (!payload.fullName.trim() || !payload.mobile.trim()) {
      return { success: false, message: "Full Name and Mobile Number are required." }
    }

    if (!/^\d{10}$/.test(payload.mobile.trim())) {
      return { success: false, message: "Please enter a valid 10-digit mobile number." }
    }

    return {
      success: true,
      requiresOtp: true,
      message: "One-Time Password (OTP) dispatched to your mobile number.",
    }
  }

  /**
   * Verifies Citizen OTP.
   */
  async verifyOtp(payload: OtpVerificationPayload): Promise<AuthResponse> {
    await this.simulateDelay(600)

    // Demo OTP validation: accepts 834001 or any 6-digit code for testing
    if (payload.otp.length !== 6) {
      return { success: false, message: "Please enter the full 6-digit OTP code." }
    }

    if (payload.otp === "000000") {
      return { success: false, message: "Invalid OTP entered. Please try again or request resend." }
    }

    const citizenUser: AuthUser = {
      id: `cit_${Math.random().toString(36).substring(2, 9)}`,
      name: "Citizen Contributor",
      mobile: payload.identifier,
      role: "citizen",
      status: "active",
      createdAt: new Date().toISOString(),
    }

    this.saveSession(citizenUser)
    return {
      success: true,
      user: citizenUser,
      message: "Mobile verified successfully. Account created!",
    }
  }

  /**
   * Student registration with College ID upload simulation.
   */
  async registerStudent(payload: StudentRegisterPayload): Promise<AuthResponse> {
    await this.simulateDelay(700)

    if (!payload.fullName || !payload.email || !payload.university || !payload.registrationNumber) {
      return { success: false, message: "Please fill out all required student identification fields." }
    }

    const studentUser: AuthUser = {
      id: `stu_${Math.random().toString(36).substring(2, 9)}`,
      name: payload.fullName,
      email: payload.email,
      mobile: payload.mobile,
      role: "student",
      organization: payload.university,
      status: "pending_verification",
      createdAt: new Date().toISOString(),
    }

    this.saveSession(studentUser)
    return {
      success: true,
      user: studentUser,
      message: "Student registration submitted. Verification pending with institution nodal officer.",
    }
  }

  /**
   * University Institutional Registration.
   */
  async registerUniversity(payload: UniversityRegisterPayload): Promise<AuthResponse> {
    await this.simulateDelay(700)

    if (!payload.universityName || !payload.institutionCode || !payload.officialEmail || !payload.contactPerson) {
      return { success: false, message: "University Name, Government Code (AISHE), and Official Email are required." }
    }

    const univUser: AuthUser = {
      id: `univ_${Math.random().toString(36).substring(2, 9)}`,
      name: payload.contactPerson,
      email: payload.officialEmail,
      mobile: payload.mobile,
      role: "university",
      organization: payload.universityName,
      status: "pending_verification",
      createdAt: new Date().toISOString(),
    }

    this.saveSession(univUser)
    return {
      success: true,
      user: univUser,
      message: "Institution verification request submitted to Dept. of Higher & Technical Education.",
    }
  }

  /**
   * Industry / CSR Organization Registration.
   */
  async registerIndustry(payload: IndustryRegisterPayload): Promise<AuthResponse> {
    await this.simulateDelay(700)

    if (!payload.organizationName || !payload.organizationType || !payload.officialEmail || !payload.registrationNumber) {
      return { success: false, message: "Organization Name, Entity Type, and Corporate Registration Number (CIN/GST) are required." }
    }

    const industryUser: AuthUser = {
      id: `ind_${Math.random().toString(36).substring(2, 9)}`,
      name: payload.contactPerson || payload.organizationName,
      email: payload.officialEmail,
      mobile: payload.mobile,
      role: "industry",
      organization: payload.organizationName,
      status: "pending_verification",
      createdAt: new Date().toISOString(),
    }

    this.saveSession(industryUser)
    return {
      success: true,
      user: industryUser,
      message: "Organization registration submitted for corporate CSR co-sponsorship approval.",
    }
  }

  /**
   * Clears the active session.
   */
  logout(): void {
    if (isClient()) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  private saveSession(user: AuthUser): void {
    if (isClient()) {
      // Strictly store non-sensitive display details
      const safeUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        organization: user.organization,
        status: user.status,
        createdAt: user.createdAt,
      }
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser))
    }
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private formatMockName(id: string, role: string): string {
    if (role === "student") return "Aakash Soren"
    if (role === "university") return "Dr. R. K. Mishra"
    if (role === "industry") return "Vikramaditya Tata"
    if (id.includes("@")) {
      const part = id.split("@")[0].replace(/[._]/g, " ")
      return part.charAt(0).toUpperCase() + part.slice(1)
    }
    return "Verified Citizen"
  }
}

export const authService = new MockAuthService()