"use client"

import * as React from "react"
import Link from "next/link"
import {
  User,
  Shield,
  Landmark,
  Building2,
  Lock,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  Clock,
  FileCheck,
  Eye,
  EyeOff,
  MapPin,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  UserProfile,
  CitizenUserProfile,
  StudentUserProfile,
  UniversityUserProfile,
  IndustryUserProfile,
} from "@/services/profile/profile-types"
import { CitizenProfileView } from "./citizen-profile-view"
import { StudentProfileView } from "./student-profile-view"

export interface ProfileDetailsProps {
  profile: UserProfile
  isOwner?: boolean
}

export function ProfileDetails({ profile, isOwner = true }: ProfileDetailsProps) {
  const citizen = profile.role === "citizen" ? (profile as CitizenUserProfile) : null
  const student = profile.role === "student" ? (profile as StudentUserProfile) : null
  const university = profile.role === "university" ? (profile as UniversityUserProfile) : null
  const industry = profile.role === "industry" ? (profile as IndustryUserProfile) : null

  return (
    <div className="space-y-6 text-left">
      <Tabs defaultValue="public" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-3">
          <TabsList className="bg-muted/70 p-1 rounded-xl w-fit">
            <TabsTrigger value="public" className="text-xs font-semibold gap-1.5 px-3 py-1.5 rounded-lg">
              <Globe className="size-3.5" />
              <span>Public Profile</span>
            </TabsTrigger>

            {isOwner && (
              <>
                <TabsTrigger value="private" className="text-xs font-semibold gap-1.5 px-3 py-1.5 rounded-lg">
                  <Lock className="size-3.5" />
                  <span>Private Account Information</span>
                </TabsTrigger>
                <TabsTrigger value="verification" className="text-xs font-semibold gap-1.5 px-3 py-1.5 rounded-lg">
                  <FileCheck className="size-3.5" />
                  <span>Restricted Verification</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {profile.profileVisibility === "public" ? (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                <Eye className="size-3.5" />
                <span>Public Directory Mode</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <EyeOff className="size-3.5" />
                <span>Hidden from Public Directory</span>
              </span>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. PUBLIC PROFILE INFORMATION (Visible to any portal participant)        */}
        {/* ========================================================================= */}
        <TabsContent value="public" className="space-y-6 pt-4">
          {/* About / Summary */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-2.5 shadow-xs">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <User className="size-4 text-primary" />
              <span>About / Profile Summary</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {profile.bio || "No public summary provided yet."}
            </p>
          </div>

          {/* Location Privacy Card */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                <span>General Jurisdiction / District</span>
              </h4>
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                LOCATION PRIVACY PROTECTED
              </Badge>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {profile.district ? `${profile.district} District, Jharkhand` : "Jharkhand State"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              * Exact residential addresses and GPS coordinates are strictly isolated from personal profiles and only attached to verified problem reports.
            </p>
          </div>

          {/* CITIZEN PROFILE */}
          {citizen && <CitizenProfileView profile={citizen} />}

          {/* STUDENT PROFILE */}
          {student && <StudentProfileView profile={student} />}

          {/* UNIVERSITY PUBLIC PROFILE */}
          {university && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Landmark className="size-4 text-primary" />
                    <span>Academic Overview</span>
                  </h3>

                  <Link
                    href="/university/dashboard"
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className: "text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
                    })}
                  >
                    <LayoutDashboard className="size-3.5" />
                    <span>Launch University Dashboard &rarr;</span>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Institution Name</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{university.institutionName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Research Collaborations</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{university.sponsoredProjectsCount} Sponsored Projects</p>
                  </div>
                </div>
              </div>

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

          {/* INDUSTRY PUBLIC PROFILE */}
          {industry && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <span>Corporate Entity</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Organization</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{industry.organizationName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Entity Type</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{industry.organizationType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sponsored Initiatives</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">{industry.sponsoredProjectsCount} Grants Seeded</p>
                  </div>
                </div>
              </div>

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
                    <span>Mentorship & Acceleration</span>
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

        {/* ========================================================================= */}
        {/* 2. PRIVATE ACCOUNT INFORMATION (Visible ONLY to Account Owner)            */}
        {/* ========================================================================= */}
        {isOwner && (
          <TabsContent value="private" className="space-y-6 pt-4">
            <div className="rounded-2xl border border-border bg-muted/20 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    Private Account Credentials
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                  ACCOUNT OWNER ONLY
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <span className="text-muted-foreground">Internal Account Identifier</span>
                  <p className="font-mono font-bold text-foreground">{profile.id}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <span className="text-muted-foreground">Private Registered Email</span>
                  <p className="font-semibold text-foreground">{profile.email}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <span className="text-muted-foreground">Private Registered Phone</span>
                  <p className="font-mono font-semibold text-foreground">{profile.mobile || "Not provided"}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <span className="text-muted-foreground">Directory Visibility Preference</span>
                  <p className="font-semibold text-foreground capitalize">{profile.profileVisibility}</p>
                </div>

                {student && (
                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-1 sm:col-span-2">
                    <span className="text-muted-foreground">Student Registration / Roll Number</span>
                    <p className="font-mono font-bold text-foreground">{student.registrationNumber}</p>
                  </div>
                )}

                {university && (
                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-1 sm:col-span-2">
                    <span className="text-muted-foreground">Nodal Officer Direct Line</span>
                    <p className="font-bold text-foreground">{university.contactPerson}</p>
                  </div>
                )}

                {industry && (
                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-1 sm:col-span-2">
                    <span className="text-muted-foreground">Authorized Corporate Representative</span>
                    <p className="font-bold text-foreground">{industry.contactPerson}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        )}

        {/* ========================================================================= */}
        {/* 3. RESTRICTED VERIFICATION INFORMATION (Status Only, Zero Raw Documents)   */}
        {/* ========================================================================= */}
        {isOwner && (
          <TabsContent value="verification" className="space-y-6 pt-4">
            <div className="rounded-2xl border border-border bg-muted/20 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="size-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    Restricted Verification Status
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  NODAL AUDIT COMPLIANT
                </Badge>
              </div>

              {/* Strict Notice that documents are never publicly shown */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <HelpCircle className="size-3.5 text-primary" />
                  <span>State Verification Privacy Policy</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  To safeguard student identity and institutional security, uploaded documentation (Student ID cards, AISHE authorization letters, Corporate CIN/GSTIN certificates) is held exclusively in encrypted government custody. Peer participants and external users can ONLY view the verified status badge.
                </p>
              </div>

              {/* Role-Specific Document Verification Status */}
              <div className="space-y-3">
                {citizen && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card text-xs">
                    <div>
                      <p className="font-bold text-foreground">Mobile & OTP Authentication</p>
                      <p className="text-[11px] text-muted-foreground">Two-Factor Authentication via state SMS gateway</p>
                    </div>
                    <StatusBadge status="verified" size="sm" customLabel="Verified" />
                  </div>
                )}

                {student && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card text-xs">
                    <div>
                      <p className="font-bold text-foreground">Institutional Student ID Document</p>
                      <p className="text-[11px] text-muted-foreground">Submitted for verification to university nodal committee</p>
                    </div>
                    {student.idCardStatus === "verified" ? (
                      <StatusBadge status="verified" size="sm" customLabel="Verified" />
                    ) : (
                      <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 gap-1 text-[11px]">
                        <Clock className="size-3" />
                        <span>Pending Verification</span>
                      </Badge>
                    )}
                  </div>
                )}

                {university && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card text-xs">
                    <div>
                      <p className="font-bold text-foreground">AISHE Accreditation & Dean Authorization Letter</p>
                      <p className="text-[11px] text-muted-foreground">State Dept. of Higher & Technical Education validation registry</p>
                    </div>
                    {university.institutionVerificationStatus === "verified" ? (
                      <StatusBadge status="verified" size="sm" customLabel="Verified" />
                    ) : (
                      <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 gap-1 text-[11px]">
                        <Clock className="size-3" />
                        <span>Pending Verification</span>
                      </Badge>
                    )}
                  </div>
                )}

                {industry && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card text-xs">
                    <div>
                      <p className="font-bold text-foreground">Corporate Registration Certificate / CSR-1 Registry</p>
                      <p className="text-[11px] text-muted-foreground">Corporate Social Responsibility validation under Ministry of Corporate Affairs</p>
                    </div>
                    {industry.organizationVerificationStatus === "verified" ? (
                      <StatusBadge status="verified" size="sm" customLabel="Verified" />
                    ) : (
                      <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 gap-1 text-[11px]">
                        <Clock className="size-3" />
                        <span>Pending Verification</span>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}