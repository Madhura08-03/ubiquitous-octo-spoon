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

    if (credentials.password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters." }
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

    if (!payload.fullName.trim()) {
      return { success: false, message: "Full Name is required." }
    }

    if (!payload.mobile.trim() || !/^\d{10}$/.test(payload.mobile.trim())) {
      return { success: false, message: "A valid 10-digit mobile number is required." }
    }

    if (!payload.password || payload.password.length < 6) {
      return { success: false, message: "Password is required and must be at least 6 characters." }
    }

    if (payload.password !== payload.confirmPassword) {
      return { success: false, message: "Password and Confirm Password do not match." }
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
   * Student registration with College ID upload validation.
   */
  async registerStudent(payload: StudentRegisterPayload): Promise<AuthResponse> {
    await this.simulateDelay(700)

    if (!payload.fullName.trim()) {
      return { success: false, message: "Full Name is required." }
    }

    if (!payload.email.trim() || !payload.email.includes("@")) {
      return { success: false, message: "A valid college or personal email address is required." }
    }

    if (!payload.university) {
      return { success: false, message: "Please select your accredited university." }
    }

    if (!payload.registrationNumber.trim()) {
      return { success: false, message: "Student Registration / Roll Number is required." }
    }

    if (!payload.idCardFileName) {
      return { success: false, message: "Student ID Card is required." }
    }

    if (!payload.password || payload.password.length < 6) {
      return { success: false, message: "Password is required and must be at least 6 characters." }
    }

    if (payload.password !== payload.confirmPassword) {
      return { success: false, message: "Password and Confirm Password do not match." }
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
      message: "Student verification submitted.",
    }
  }

  /**
   * University Institutional Registration with mandatory AISHE proof.
   */
  async registerUniversity(payload: UniversityRegisterPayload): Promise<AuthResponse> {
    await this.simulateDelay(700)

    if (!payload.universityName.trim()) {
      return { success: false, message: "University Name is required." }
    }

    if (!payload.institutionCode.trim()) {
      return { success: false, message: "Government AISHE / Institution Code is required." }
    }

    if (!payload.officialEmail.trim() || !payload.officialEmail.includes("@")) {
      return { success: false, message: "Official institution email is required." }
    }

    if (!payload.contactPerson.trim()) {
      return { success: false, message: "Nodal Officer / Registrar contact name is required." }
    }

    if (!payload.documentFileName) {
      return { success: false, message: "Institutional Authorization Letter / AISHE Proof is required." }
    }

    if (!payload.password || payload.password.length < 6) {
      return { success: false, message: "Password is required and must be at least 6 characters." }
    }

    if (payload.password !== payload.confirmPassword) {
      return { success: false, message: "Password and Confirm Password do not match." }
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
      message: "Institution verification pending.",
    }
  }

  /**
   * Industry / CSR Organization Registration with mandatory proof.
   */
  async registerIndustry(payload: IndustryRegisterPayload): Promise<AuthResponse> {
    await this.simulateDelay(700)

    if (!payload.organizationName.trim()) {
      return { success: false, message: "Organization Name is required." }
    }

    if (!payload.organizationType) {
      return { success: false, message: "Entity classification is required." }
    }

    if (!payload.officialEmail.trim() || !payload.officialEmail.includes("@")) {
      return { success: false, message: "Official corporate email is required." }
    }

    if (!payload.registrationNumber.trim()) {
      return { success: false, message: "Corporate Registration Number (CIN / GSTIN) is required." }
    }

    if (!payload.contactPerson.trim()) {
      return { success: false, message: "Authorized CSR Representative name is required." }
    }

    if (!payload.proofFileName) {
      return { success: false, message: "Organization verification proof is required." }
    }

    if (!payload.password || payload.password.length < 6) {
      return { success: false, message: "Password is required and must be at least 6 characters." }
    }

    if (payload.password !== payload.confirmPassword) {
      return { success: false, message: "Password and Confirm Password do not match." }
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
      message: "Organization verification pending.",
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