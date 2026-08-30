"use client"

import * as React from "react"
import { toast } from "sonner"
import { Check } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mentor, CreateMentorPayload, UpdateMentorPayload } from "@/services/mentors/mentor-types"
import { mentorService } from "@/services/mentors/mentor-service"

const DEPARTMENTS = [
  "Civil & Environmental Engineering",
  "Electronics & Communication Engineering",
  "Computer Science & Engineering",
  "Electrical & Electronics Engineering",
  "Chemical & Environmental Engineering",
  "Civil & Infrastructure Engineering",
  "Bio-Engineering & Food Technology",
  "Mechanical Engineering",
]

const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Head of Department (HOD)",
  "Dean (R&D / Academic)",
]

export interface MentorFormProps {
  mentor?: Mentor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

function MentorFormFields({
  mentor,
  onClose,
  onSuccess,
}: {
  mentor?: Mentor | null
  onClose: () => void
  onSuccess: () => void
}) {
  const isEdit = Boolean(mentor)

  const [name, setName] = React.useState(() => mentor?.name || "")
  const [designation, setDesignation] = React.useState(() => mentor?.designation || "Associate Professor")
  const [department, setDepartment] = React.useState(() => mentor?.department || DEPARTMENTS[0])
  const [email, setEmail] = React.useState(() => mentor?.email || "")
  const [phone, setPhone] = React.useState(() => mentor?.phone || "+91 94311 00000")
  const [yearsOfExperience, setYearsOfExperience] = React.useState(() => (mentor?.yearsOfExperience ?? 10).toString())
  const [maximumTeams, setMaximumTeams] = React.useState(() => (mentor?.maximumTeams ?? 3).toString())
  const [expertise, setExpertise] = React.useState(() => mentor?.expertise.join(", ") || "")
  const [researchDomains, setResearchDomains] = React.useState(() => mentor?.researchDomains.join(", ") || "Water Management, Environmental Engineering")
  const [qualifications, setQualifications] = React.useState(() => mentor?.qualifications.join(", ") || "Ph.D. in Engineering, M.Tech")
  const [bio, setBio] = React.useState(() => mentor?.bio || "")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Mentor full name is required.")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please provide a valid institutional email address.")
      return
    }

    const expNum = parseInt(yearsOfExperience, 10)
    if (isNaN(expNum) || expNum < 0) {
      toast.error("Years of experience must be a non-negative number.")
      return
    }

    const maxTeamsNum = parseInt(maximumTeams, 10)
    if (isNaN(maxTeamsNum) || maxTeamsNum < 1) {
      toast.error("Maximum team capacity must be at least 1.")
      return
    }

    setIsSubmitting(true)

    try {
      const expertiseList = expertise
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const domainList = researchDomains
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const qualList = qualifications
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      if (isEdit && mentor) {
        const updatePayload: UpdateMentorPayload = {
          designation,
          department,
          email: email.trim(),
          phone: phone.trim(),
          expertise: expertiseList.length > 0 ? expertiseList : mentor.expertise,
          researchDomains: domainList.length > 0 ? domainList : mentor.researchDomains,
          yearsOfExperience: expNum,
          qualifications: qualList.length > 0 ? qualList : mentor.qualifications,
          maximumTeams: maxTeamsNum,
          bio: bio.trim() || mentor.bio,
        }
        await mentorService.updateMentor(mentor.id, updatePayload)
        toast.success(`Updated profile for ${mentor.name}`)
      } else {
        const createPayload: CreateMentorPayload = {
          name: name.trim(),
          designation,
          department,
          email: email.trim(),
          phone: phone.trim(),
          expertise: expertiseList.length > 0 ? expertiseList : ["Institutional Research", "Societal Capstone"],
          researchDomains: domainList.length > 0 ? domainList : ["Water Management", "Energy"],
          skills: ["Project Mentorship", "Technical Review"],
          yearsOfExperience: expNum,
          qualifications: qualList.length > 0 ? qualList : ["Ph.D. in Engineering"],
          maximumTeams: maxTeamsNum,
          bio: bio.trim() || "Faculty mentor at Birla Institute of Technology, Mesra guiding societal innovation teams.",
        }
        await mentorService.createMentor(createPayload)
        toast.success(`Added ${name} to faculty mentor roster`)
      }

      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save mentor.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-base sm:text-lg font-bold">
          {isEdit ? `Edit Mentor: ${mentor?.name}` : "Add Faculty Mentor"}
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          {isEdit
            ? "Update faculty designation, capacity, and specializations."
            : "Register a verified faculty advisor to guide student capstone innovation projects."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Full Name */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="mentor-name" className="text-xs font-semibold">
            Full Name with Title <span className="text-rose-500">*</span>
          </label>
          <Input
            id="mentor-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dr. Rajesh K. Mishra"
            disabled={isEdit}
            required
            className="text-xs h-9"
          />
        </div>

        {/* Designation */}
        <div className="space-y-1">
          <label className="text-xs font-semibold">Designation</label>
          <Select value={designation} onValueChange={(val) => val && setDesignation(val)}>
            <SelectTrigger size="sm" className="text-xs w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DESIGNATIONS.map((desig) => (
                <SelectItem key={desig} value={desig}>
                  {desig}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Department */}
        <div className="space-y-1">
          <label className="text-xs font-semibold">Department</label>
          <Select value={department} onValueChange={(val) => val && setDepartment(val)}>
            <SelectTrigger size="sm" className="text-xs w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Institutional Email */}
        <div className="space-y-1">
          <label htmlFor="mentor-email" className="text-xs font-semibold">
            Institutional Email <span className="text-rose-500">*</span>
          </label>
          <Input
            id="mentor-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="faculty@bitmesra.ac.in"
            required
            className="text-xs h-9"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="mentor-phone" className="text-xs font-semibold">
            Phone / Extension
          </label>
          <Input
            id="mentor-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 94311 00000"
            className="text-xs h-9"
          />
        </div>

        {/* Years of Experience */}
        <div className="space-y-1">
          <label htmlFor="mentor-exp" className="text-xs font-semibold">
            Years of Experience
          </label>
          <Input
            id="mentor-exp"
            type="number"
            min="0"
            max="50"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            className="text-xs h-9 font-mono"
          />
        </div>

        {/* Maximum Teams */}
        <div className="space-y-1">
          <label htmlFor="mentor-max-teams" className="text-xs font-semibold">
            Max Student Teams Capacity
          </label>
          <Input
            id="mentor-max-teams"
            type="number"
            min="1"
            max="10"
            value={maximumTeams}
            onChange={(e) => setMaximumTeams(e.target.value)}
            className="text-xs h-9 font-mono"
          />
        </div>

        {/* Key Expertise (comma separated) */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="mentor-expertise" className="text-xs font-semibold">
            Key Specializations (comma separated)
          </label>
          <Input
            id="mentor-expertise"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder="e.g. Water Quality, IoT Telemetry, Embedded Systems"
            className="text-xs h-9"
          />
        </div>

        {/* Research Domains */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="mentor-domains" className="text-xs font-semibold">
            Research Domains (comma separated)
          </label>
          <Input
            id="mentor-domains"
            value={researchDomains}
            onChange={(e) => setResearchDomains(e.target.value)}
            placeholder="e.g. Water Management, Renewable Energy, Sanitation"
            className="text-xs h-9"
          />
        </div>

        {/* Qualifications */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="mentor-qual" className="text-xs font-semibold">
            Academic Qualifications (comma separated)
          </label>
          <Input
            id="mentor-qual"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            placeholder="e.g. Ph.D. in Environmental Eng (IIT Kharagpur), M.Tech"
            className="text-xs h-9"
          />
        </div>

        {/* Academic Bio */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="mentor-bio" className="text-xs font-semibold">
            Faculty Bio / Research Summary
          </label>
          <textarea
            id="mentor-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Brief summary of research experience and lab focus..."
            className="w-full p-2.5 rounded-xl border border-border bg-card text-xs font-sans text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <DialogFooter className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
          className="text-xs"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
        >
          {isSubmitting ? (
            <span>Saving...</span>
          ) : (
            <>
              <Check className="size-3.5" />
              <span>{isEdit ? "Save Changes" : "Add Mentor"}</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function MentorFormDialog({
  mentor,
  open,
  onOpenChange,
  onSuccess,
}: MentorFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl text-left max-h-[90vh] overflow-y-auto">
        {open && (
          <MentorFormFields
            key={mentor?.id || "new"}
            mentor={mentor}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
