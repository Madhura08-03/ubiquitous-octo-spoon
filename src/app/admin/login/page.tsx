import { Metadata } from "next"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { AdminLoginForm } from "@/features/auth/components/admin-login-form"

export const metadata: Metadata = {
  title: "Government Admin Login | Societal Innovation Collaboration Portal",
  description: "Secure administrative access for Government of Jharkhand nodal officers and district evaluators.",
}

export default function AdminLoginPage() {
  return (
    <AuthLayout
      variant="admin"
      title="Government Administration"
      subtitle="Authorized access for Government of Jharkhand administration and district nodal officers."
      backHref="/login"
      backLabel="Back to Portal Login"
    >
      <AdminLoginForm />
    </AuthLayout>
  )
}