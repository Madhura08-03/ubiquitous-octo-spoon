"use client"

import * as React from "react"
import { Landmark, Hash, Mail, User, Phone, ArrowRight, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { authService } from "@/services/auth/auth-service"
import { AuthUser } from "@/services/auth/auth-types"

export interface UniversityRegistrationProps {
  onSuccess: (user: AuthUser) => void
  onBack: () => void
}

export function UniversityRegistration({
  onSuccess,
  onBack,
}: UniversityRegistrationProps) {
  const [universityName, setUniversityName] = React.useState("")
  const [institutionCode, setInstitutionCode] = React.useState("")
  const [officialEmail, setOfficialEmail] = React.useState("")
  const [contactPerson, setContactPerson] = React.useState("")
  const [mobile, setMobile] = React.useState("")
  const [about, setAbout] = React.useState("")
  const [uploadedFile, setUploadedFile] = React.useState<{ name: string; size: number } | null>({
    name: "UGC_AISHE_Institutional_Certificate.pdf",
    size: 512000,
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!universityName.trim()) {
      setErrorMessage("Please enter the official University / College Name.")
      return
    }

    if (!institutionCode.trim()) {
      setErrorMessage("Government-issued Institution Code (AISHE Code) is required.")
      return
    }

    if (!officialEmail.trim() || !officialEmail.includes("@")) {
      setErrorMessage("Please provide a valid official institution email address.")
      return
    }

    if (!contactPerson.trim()) {
      setErrorMessage("Designated Nodal Officer / Registrar contact name is required.")
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.registerUniversity({
        universityName: universityName.trim(),
        institutionCode: institutionCode.trim(),
        officialEmail: officialEmail.trim(),
        contactPerson: contactPerson.trim(),
        mobile: mobile.trim() || "9835099999",
        documentFileName: uploadedFile?.name,
        about: about.trim() || undefined,
      })

      if (response.success && response.user) {
        onSuccess(response.user)
      } else {
        setErrorMessage(response.message || "Institutional registration failed.")
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
          University & Faculty Registration
        </h2>
        <p className="text-xs text-muted-foreground">
          Connect your institution’s laboratories and faculty to state innovation grants and student capstone challenges.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* University Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          University / Institution Name <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Input
            value={universityName}
            onChange={(e) => {
              setUniversityName(e.target.value)
              setErrorMessage(null)
            }}
            placeholder="e.g. Birla Institute of Technology, Mesra"
            className="pl-9 text-xs"
            disabled={isLoading}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Landmark className="size-4" />
          </div>
        </div>
      </div>

      {/* Institution AISHE Code & Official Email (2-Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Govt AISHE / Institution Code <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              value={institutionCode}
              onChange={(e) => setInstitutionCode(e.target.value)}
              placeholder="e.g. U-0270"
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
            Official Institution Email <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type="email"
              value={officialEmail}
              onChange={(e) => setOfficialEmail(e.target.value)}
              placeholder="e.g. registrar@bitmesra.ac.in"
              className="pl-9 text-xs"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Mail className="size-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Person & Phone (2-Column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Nodal Officer / Dean Contact <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. Prof. Dr. R. K. Mishra"
              className="pl-9 text-xs"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <User className="size-4" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Office Phone Number <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 0651-2275444"
              className="pl-9 text-xs font-mono"
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Phone className="size-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Document Upload */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-semibold text-foreground">
          Institutional Authorization Letter / AISHE Proof
        </label>
        <FileUpload
          label="Upload Institutional Authorization Document"
          description="PDF format with official letterhead (Max: 10MB)"
          accept=".pdf"
          maxSizeMB={10}
          onFilesSelected={(files) => {
            if (files.length > 0) {
              setUploadedFile({ name: files[0].name, size: files[0].size })
            }
          }}
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Key Research Domains & Labs <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
        </label>
        <Textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="e.g. Centre of Excellence in Renewable Energy & Water Engineering."
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
          <span>Submit for Verification</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </form>
  )
}