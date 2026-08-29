import { Metadata } from "next"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { RegistrationForm } from "@/features/auth/components/registration-form"

export const metadata: Metadata = {
  title: "Register Account | Societal Innovation Collaboration Portal",
  description: "Join the innovation ecosystem as a Citizen, Student Innovator, University Faculty, or Industry CSR Partner.",
}

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Join the Ecosystem"
      subtitle="Register as a Citizen, Student, University, or Industry Partner."
      backHref="/"
      backLabel="Back to Portal Home"
    >
      <RegistrationForm />
    </AuthLayout>
  )
}