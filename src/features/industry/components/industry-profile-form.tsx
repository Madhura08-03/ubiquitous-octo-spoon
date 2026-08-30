"use client"

import * as React from "react"
import {
  Save,
  ShieldCheck,
  Plus,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IndustryProfile, ProjectScale } from "@/services/industry/industry-types"
import { industryService } from "@/services/industry/industry-service"

interface IndustryProfileFormProps {
  profile: IndustryProfile
  onSaved?: (updated: IndustryProfile) => void
}

export function IndustryProfileForm({ profile, onSaved }: IndustryProfileFormProps) {
  const [organizationName, setOrganizationName] = React.useState(profile.organizationName)
  const [industrySector, setIndustrySector] = React.useState(profile.industrySector)
  const [headquarters, setHeadquarters] = React.useState(profile.headquarters)
  const [annualCSRRange, setAnnualCSRRange] = React.useState(profile.annualCSRRange)
  const [preferredProjectScale, setPreferredProjectScale] = React.useState(profile.preferredProjectScale)
  const [contactPerson, setContactPerson] = React.useState(profile.contactPerson)
  const [contactEmail, setContactEmail] = React.useState(profile.contactEmail)
  const [contactPhone, setContactPhone] = React.useState(profile.contactPhone)
  const [website, setWebsite] = React.useState(profile.website)

  const [csrFocusAreas, setCsrFocusAreas] = React.useState<string[]>(profile.csrFocusAreas || [])
  const [newFocus, setNewFocus] = React.useState("")

  const [isSaving, setIsSaving] = React.useState(false)

  const handleAddFocus = () => {
    if (newFocus.trim() && !csrFocusAreas.includes(newFocus.trim())) {
      setCsrFocusAreas([...csrFocusAreas, newFocus.trim()])
      setNewFocus("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const updated = await industryService.updateIndustryProfile(profile.id, {
        organizationName,
        industrySector,
        headquarters,
        annualCSRRange,
        preferredProjectScale,
        contactPerson,
        contactEmail,
        contactPhone,
        website,
        csrFocusAreas,
      })

      toast.success("Industry Profile Updated Successfully", {
        description: "Your CSR preferences and institutional credentials have been saved.",
      })
      if (onSaved) onSaved(updated)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-6 text-left shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <Badge variant="outline" className="border-primary text-primary font-mono text-[9px]">
            CORPORATE CSR CREDENTIALS
          </Badge>
          <h3 className="text-base font-extrabold text-foreground">
            Organization Profile & CSR Preferences
          </h3>
        </div>

        <Badge variant="outline" className="border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold bg-emerald-500/10 gap-1">
          <ShieldCheck className="size-3 text-emerald-500" />
          <span>VERIFIED CSR PARTNER</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Organization / Trust Name *</label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
            className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Industry Sector *</label>
          <input
            type="text"
            value={industrySector}
            onChange={(e) => setIndustrySector(e.target.value)}
            required
            className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Headquarters Location</label>
          <input
            type="text"
            value={headquarters}
            onChange={(e) => setHeadquarters(e.target.value)}
            className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Annual CSR Allocation Range</label>
          <input
            type="text"
            value={annualCSRRange}
            onChange={(e) => setAnnualCSRRange(e.target.value)}
            className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Contact Person / CSR Lead *</label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            required
            className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Official CSR Email *</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Contact Phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Official Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Preferred Project Scale</label>
          <select
            value={preferredProjectScale}
            onChange={(e) => setPreferredProjectScale(e.target.value as ProjectScale)}
            className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium"
          >
            <option value="Small (<₹5L)">Small (&lt;₹5L)</option>
            <option value="Medium (₹5L-₹25L)">Medium (₹5L-₹25L)</option>
            <option value="Large (>₹25L)">Large (&gt;₹25L)</option>
          </select>
        </div>
      </div>

      {/* CSR Focus Areas */}
      <div className="space-y-2 text-xs border-t border-border pt-4">
        <label className="font-bold text-foreground">CSR Statutory Focus Areas</label>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={newFocus}
            onChange={(e) => setNewFocus(e.target.value)}
            placeholder="Add thematic area (e.g. Drinking Water, Tribal STEM, Rural Nutrition)..."
            className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddFocus()
              }
            }}
          />
          <Button type="button" size="sm" onClick={handleAddFocus} className="h-8 px-2.5">
            <Plus className="size-3" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {csrFocusAreas.map((area, idx) => (
            <span key={idx} className="p-1.5 px-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5">
              <span>{area}</span>
              <button type="button" onClick={() => setCsrFocusAreas(csrFocusAreas.filter((_, i) => i !== idx))} className="hover:text-destructive">
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-end">
        <Button
          type="submit"
          isLoading={isSaving}
          className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
        >
          <Save className="size-3.5" />
          <span>Save Profile & Preferences</span>
        </Button>
      </div>
    </form>
  )
}
