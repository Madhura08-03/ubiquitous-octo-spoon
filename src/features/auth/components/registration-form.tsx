"use client"

import * as React from "react"
import Link from "next/link"

import { UserRole, AuthUser } from "@/services/auth/auth-types"
import { RoleSelection } from "./role-selection"
import { CitizenRegistration } from "./citizen-registration"
import { StudentRegistration } from "./student-registration"
import { UniversityRegistration } from "./university-registration"
import { IndustryRegistration } from "./industry-registration"
import { OtpVerificationStep } from "./otp-verification-step"
import { RegistrationSuccess } from "./registration-success"

export function RegistrationForm() {
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null)
  const [step, setStep] = React.useState<"role_select" | "form" | "otp_verify" | "complete">("role_select")
  const [citizenMobile, setCitizenMobile] = React.useState<string>("")
  const [registeredUser, setRegisteredUser] = React.useState<AuthUser | null>(null)

  const handleRoleContinue = () => {
    if (selectedRole) {
      setStep("form")
    }
  }

  const handleCitizenSuccess = (mobile: string) => {
    setCitizenMobile(mobile)
    setStep("otp_verify")
  }

  const handleRegistrationComplete = (user: AuthUser) => {
    setRegisteredUser(user)
    setStep("complete")
  }

  const handleBackToRoles = () => {
    setStep("role_select")
  }

  if (step === "complete" && registeredUser) {
    return <RegistrationSuccess user={registeredUser} />
  }

  if (step === "otp_verify" && citizenMobile) {
    return (
      <OtpVerificationStep
        mobileNumber={citizenMobile}
        onVerified={handleRegistrationComplete}
        onBack={() => setStep("form")}
      />
    )
  }

  if (step === "form" && selectedRole) {
    return (
      <div className="space-y-4">
        {selectedRole === "citizen" && (
          <CitizenRegistration
            onSuccess={handleCitizenSuccess}
            onBack={handleBackToRoles}
          />
        )}
        {selectedRole === "student" && (
          <StudentRegistration
            onSuccess={handleRegistrationComplete}
            onBack={handleBackToRoles}
          />
        )}
        {selectedRole === "university" && (
          <UniversityRegistration
            onSuccess={handleRegistrationComplete}
            onBack={handleBackToRoles}
          />
        )}
        {selectedRole === "industry" && (
          <IndustryRegistration
            onSuccess={handleRegistrationComplete}
            onBack={handleBackToRoles}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <RoleSelection
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
        onContinue={handleRoleContinue}
      />

      <div className="text-center pt-2 text-xs text-muted-foreground border-t border-border/80">
        <span>Already have an account? </span>
        <Link
          href="/login"
          className="font-bold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}