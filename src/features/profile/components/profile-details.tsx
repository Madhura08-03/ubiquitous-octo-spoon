"use client"

import * as React from "react"
import {
  User,
  Shield,
  GraduationCap,
  Landmark,
  Building2,
  Lock,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  FileText,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  UserProfile,
  CitizenUserProfile,
  StudentUserProfile,
  UniversityUserProfile,
  IndustryUserProfile,
} from "@/services/profile/profile-types"

export interface ProfileDetailsProps {
  profile: UserProfile
}

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  const citizen = profile.role === "citizen" ? (profile as CitizenUserProfile) : null
  const student = profile.role === "student" ? (profile as StudentUserProfile) : null
  const university = profile.role === "university" ? (profile as UniversityUserProfile) : null
  const industry = profile.role === "industry" ? (profile as IndustryUserProfile) : null

  return (
    <div className="space-y-6 text-left">
      <Tabs defaultValue="public" className="w-full">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <TabsList className="bg-muted/70 p-1 rounded-xl">
            <TabsTrigger value="public" className="text-xs font-semibold gap-1.5 px-3 py-1.5 rounded-lg">
              <Globe className="size-3.5" />
              <span>Public Profile</span>
            </TabsTrigger>
            <TabsTrigger value="private" className="text-xs font-semibold gap-1.5 px-3 py-1.5 rounded-lg">
              <Lock className="size-3.5" />
              <span>Private Account & Compliance</span>
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            {profile.profileVisibility === "public" ? (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                <Eye className="size-3.5" />
                <span>Visible to Jharkhand Ecosystem</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <EyeOff className="size-3.5" />
                <span>Hidden from Public Directory</span>
              </span>
            )}
          </div>
        </div>

        {/* 1. PUBLIC PROFILE TAB */}
        <TabsContent value="public" className="space-y-6 pt-4">
          {/* About / Bio Card */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-2.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <User className="size-4 text-primary" />
              <span>About / Organization Profile</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {profile.bio || "No summary provided yet. Click 'Edit Profile' to add a description."}
            </p>
          </div>

          {/* Role-Specific Sections */}
          {citizen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Panchayat / Locality
                </h4>
                <p className="text-sm font-semibold text-foreground">
                  {citizen.locality || `${citizen.district || "Ranchi"} District Panchayat`}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Civic Contributions
                </h4>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-xl font-black text-foreground font-mono">
                      {citizen.problemsReportedCount}
                    </span>
                    <p className="text-[11px] text-muted-foreground">Directives Logged</p>
                  </div>
                  <div>
                    <span className="text-xl font-black text-foreground font-mono">
                      {citizen.upvotesGivenCount}
                    </span>
                    <p className="text-[11px] text-muted-foreground">Community Upvotes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {student && (
            <div className="space-y-6">
              {/* Institution Details */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="size-4 text-primary" />
                  <span>Academic Affiliation</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">University</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{student.university}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Student Registration No.</span>
                    <p className="font-mono font-bold text-foreground text-sm mt-0.5">{student.registrationNumber}</p>
                  </div>
                </div>
              </div>

              {/* Skills & Interests Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Award className="size-3.5 text-primary" />
                    <span>Technical Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills?.length > 0 ? (
                      student.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No skills added yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Tag className="size-3.5 text-primary" />
                    <span>Innovation Interests</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {student.interests?.length > 0 ? (
                      student.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs border-primary/30">
                          {interest}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No areas of interest selected.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {university && (
            <div className="space-y-6">
              {/* Institution Accreditation */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Landmark className="size-4 text-primary" />
                  <span>Institutional Overview</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Institution Name</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{university.institutionName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">AISHE / Govt Code</span>
                    <p className="font-mono font-bold text-foreground text-sm mt-0.5">{university.institutionCode}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nodal Officer</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{university.contactPerson}</p>
                  </div>
                </div>
              </div>

              {/* Research Labs & Academic Domains */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-primary" />
                    <span>Academic Departments</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {university.academicDomains?.map((domain) => (
                      <Badge key={domain} variant="secondary" className="text-xs">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="size-3.5 text-primary" />
                    <span>Research Facilities & Labs</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {university.researchLabs?.map((lab) => (
                      <Badge key={lab} variant="outline" className="text-xs border-primary/30">
                        {lab}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {industry && (
            <div className="space-y-6">
              {/* Organization Overview */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <span>Corporate Organization</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Company Name</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{industry.organizationName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Classification</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{industry.organizationType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CIN / GSTIN</span>
                    <p className="font-mono font-bold text-foreground text-sm mt-0.5">{industry.registrationNumber}</p>
                  </div>
                </div>
              </div>

              {/* Mentoring & CSR Funding Focus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Award className="size-3.5 text-primary" />
                    <span>CSR Grant Focus Domains</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {industry.fundingInterests?.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="size-3.5 text-primary" />
                    <span>Mentorship Programs</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {industry.mentoringInterests?.map((item) => (
                      <Badge key={item} variant="outline" className="text-xs border-primary/30">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* 2. PRIVATE ACCOUNT & COMPLIANCE TAB */}
        <TabsContent value="private" className="space-y-6 pt-4">
          <div className="rounded-2xl border border-border bg-muted/20 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Confidential Account Credentials
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                OWNER VISIBILITY ONLY
              </Badge>
            </div>

            {/* Private Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                <span className="text-muted-foreground">Internal Portal Identifier</span>
                <p className="font-mono font-bold text-foreground">{profile.id}</p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                <span className="text-muted-foreground">Verified Email Address</span>
                <p className="font-semibold text-foreground">{profile.email}</p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                <span className="text-muted-foreground">Registered Phone Number</span>
                <p className="font-mono font-semibold text-foreground">{profile.mobile || "Not specified"}</p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                <span className="text-muted-foreground">Directory Visibility</span>
                <p className="font-semibold text-foreground capitalize">{profile.profileVisibility}</p>
              </div>
            </div>

            {/* Compliance Document Notice */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <FileText className="size-4 text-primary" />
                <span>Verification Document Vault</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                All identity documents (Student ID, AISHE Certification, or Corporate CIN Certificate) uploaded during registration are held securely by the state nodal evaluation committee. Raw document attachments are never displayed publicly on portal directories.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  <span>State Compliance Audit Token: JH-2026-VAL-OK</span>
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}