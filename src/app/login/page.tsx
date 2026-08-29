import { Metadata } from "next"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = {
  title: "Portal Login | Societal Innovation Collaboration Portal",
  description: "Sign in to your citizen, student, university, or industry account on the Jharkhand Innovation Portal.",
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Continue your journey in the Societal Innovation Collaboration Portal."
      backHref="/"
      backLabel="Back to Portal Home"
    >
      <LoginForm />
    </AuthLayout>
  )
}