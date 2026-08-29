"use client"

import * as React from "react"
import { Building2, Hash, Mail, User, ArrowRight, AlertCircle, Phone, Lock, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { ORGANIZATION_TYPES, INDUSTRY_DOMAINS } from "@/data/auth-data"
import { authService } from "@/services/auth/auth-service"
import { AuthUser } from "@/services/auth/auth-types"

export interface IndustryRegistrationProps {
  onSuccess: (user: AuthUser) => void
  onBack: () => void
}

export function IndustryRegistration({
  onSuccess,
  onBack,
}: IndustryRegistrationProps) {
  const [organizationName, setOrganizationName] = React.useState("")
  const [organizationType, setOrganizationType] = React.useState("industry")
  const [officialEmail, setOfficialEmail] = React.useState("")
  const [mobile, setMobile] = React.useState("")
  const [contactPerson, setContactPerson] = React.useState("")
  const [domain, setDomain] = React.useState("clean_energy")
  const [registrationNumber, setRegistrationNumber] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [uploadedFile, setUploadedFile] = React.useState<{ name: string; size: number } | null>(null)
  const [about, setAbout] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!organizationName.trim()) {
      setErrorMessage("Please enter your Company / Organization Name.")
      return
    }

    if (!organizationType) {
      setErrorMessage("Please select your Organization Type.")
      return
    }

    if (!officialEmail.trim() || !officialEmail.includes("@")) {
      setErrorMessage("Please provide a valid corporate or official organization email.")
      return
    }

    if (!registrationNumber.trim()) {
      setErrorMessage("Corporate Registration Number (CIN, GSTIN, or DPIIT) is required.")
      return
    }

    if (!contactPerson.trim()) {
      setErrorMessage("Designated CSR Lead or Authorized Representative name is required.")
      return
    }

    if (!uploadedFile) {
      setErrorMessage("Organization verification proof is required.")
      return
    }

    if (!password) {
      setErrorMessage("Password is required.")
      return
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.")
      return
    }

    if (!confirmPassword) {
      setErrorMessage("Please confirm your password.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.")
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.registerIndustry({
        organizationName: organizationName.trim(),
        organizationType,
        officialEmail: officialEmail.trim(),
        mobile: mobile.trim() || "9835011111",
        contactPerson: contactPerson.trim(),
        domain,
        registrationNumber: registrationNumber.trim(),
        proofFileName: uploadedFile.name,
        password,
        confirmPassword,
        about: about.trim() || undefined,
      })

      if (response.success && response.user) {
        onSuccess(response.user)
      } else {
        setErrorMessage(response.message || "Organization registration failed.")
      }
    } catch {
      setErrorMessage("Service unavailable. Please retry.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">
          Industry & CSR Co-Sponsor Registration
        </h2>
        <p className="text-xs text-muted-foreground">
          Channel CSR seed grants into verified student prototypes, sponsor lab equipment, and access emerging talent.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Org Name & Entity Type (2-Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Organization / Company Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              value={organizationName}
              onChange={(e) => {
                setOrganizationName(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="e.g. Tata Steel CSR Foundation"
              className="pl-9 text-xs"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Building2 className="size-4" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Entity Classification <span className="text-destructive">*</span>
          </label>
          <Select
            value={organizationType}
            onValueChange={(val) => {
              setOrganizationType(val || "industry")
              setErrorMessage(null)
            }}
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Select Organization Type" />
            </SelectTrigger>
            <SelectContent>
              {ORGANIZATION_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reg Number (CIN/GSTIN) & Industry Focus (2-Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Registration No. (CIN / GSTIN) <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              value={registrationNumber}
              onChange={(e) => {
                setRegistrationNumber(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="e.g. L27100MH1907PLC000260"
              className="pl-9 text-xs font-mono"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Hash className="size-4" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Primary CSR / Innovation Domain <span className="text-destructive">*</span>
          </label>
          <Select
            value={domain}
            onValueChange={(val) => {
              setDomain(val || "clean_energy")
              setErrorMessage(null)
            }}
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Select Domain" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_DOMAINS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Official Email & Contact Person (2-Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Official Corporate Email <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type="email"
              value={officialEmail}
              onChange={(e) => {
                setOfficialEmail(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="e.g. csr.jharkhand@tatasteel.com"
              className="pl-9 text-xs"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Mail className="size-4" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Authorized CSR Representative <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              value={contactPerson}
              onChange={(e) => {
                setContactPerson(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="e.g. Vikramaditya Tata (Head CSR)"
              className="pl-9 text-xs"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <User className="size-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Password & Confirm Password (2-Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Create Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="Min 6 characters"
              className="pl-9 pr-9 text-xs"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Lock className="size-4" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Confirm Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="Re-enter password"
              className="pl-9 pr-9 text-xs"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Lock className="size-4" />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Contact */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Contact Phone Number <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <Input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="e.g. 9835011111"
            className="pl-9 text-xs font-mono"
            disabled={isLoading}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Phone className="size-4" />
          </div>
        </div>
      </div>

      {/* Proof of Organization Upload */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-semibold text-foreground">
          Proof of Registration / Incorporation Certificate <span className="text-destructive">*</span>
        </label>
        <FileUpload
          label="Upload Incorporation Certificate / CSR-1 Form"
          description="PDF format (Max: 10MB)"
          accept=".pdf"
          maxSizeMB={10}
          required
          onFilesSelected={(files) => {
            if (files && files.length > 0) {
              setUploadedFile({ name: files[0].name, size: files[0].size })
              setErrorMessage(null)
            } else {
              setUploadedFile(null)
            }
          }}
        />
      </div>

      {/* About */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          CSR Allocation & Sponsorship Focus <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
        </label>
        <Textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="e.g. Dedicated funding corpus for rural solar irrigation and tribal primary healthcare devices."
          className="text-xs min-h-[55px]"
          disabled={isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="text-xs"
        >
          Change Role
        </Button>

        <Button
          type="submit"
          isLoading={isLoading}
          className="flex-1 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <span>Submit for CSR Partnership</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </form>
  )
}