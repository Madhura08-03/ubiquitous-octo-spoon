"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, ChevronRight, Search, Lock, Users, GraduationCap } from "lucide-react"
import { PublicNavbar } from "@/components/navigation/public-navbar"
import { PublicFooter } from "@/components/navigation/public-footer"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth/auth-service"
import { industryCollaborationService } from "@/services/industry/industry-collaboration-service"
import { industryMatchingService } from "@/services/industry/industry-matching-service"
import { IndustryProfile } from "@/services/industry/industry-collaboration-types"

export default function IndustrySolutionsDiscoveryPage() {
  const router = useRouter()
  const [profile, setProfile] = React.useState<IndustryProfile | null>(null)
  const [search, setSearch] = React.useState("")
  const [domainFilter, setDomainFilter] = React.useState("all")

  React.useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }
    industryCollaborationService.getIndustryProfile("ind_tata_steel").then(setProfile)
  }, [router])

  const solutions = [
    {
      id: "prop_001",
      title: "IoT Hydrochemical Fluoride & Arsenic Adsorption Network",
      problemTitle: "Groundwater Fluoride & Arsenic Contamination in Rural Borewells",
      problemId: "prob_001",
      universityName: "Birla Institute of Technology (BIT), Mesra",
      universityId: "univ_bit_mesra",
      domain: "Water Management",
      district: "Ranchi",
      executiveSummary: "Decentralized automated water filtration network utilizing activated bauxite columns and solar ESP32 LoRaWAN sensors for real-time ion monitoring.",
      technologies: ["IoT / Sensors", "Water Chemistry", "LoRaWAN"],
      estimatedBudget: "₹18,50,000",
      budgetNum: 1850000,
      timeline: "6 Months",
      mentor: "Dr. Ananya Sharma (Professor, Environmental Chemistry)",
      studentTeamSize: 4,
      supportNeeded: ["CSR Funding", "Field Deployment Logistics", "Laboratory AAS Reagents"],
      stage: "Prototype",
      isSponsored: true,
      sponsorName: "Tata Steel CSR Foundation",
    },
    {
      id: "prop_004",
      title: "DSP-Controlled Adaptive Microgrid Inverter & Energy Buffer",
      problemTitle: "Off-Grid Solar Microgrid Inverter Frequency Drift in Heavy Monsoon",
      problemId: "prob_002",
      universityName: "Birla Institute of Technology (BIT), Mesra",
      universityId: "univ_bit_mesra",
      domain: "Energy",
      district: "East Singhbhum",
      executiveSummary: "Digital Signal Processor inverter architecture with fast supercapacitor energy storage to prevent grid frequency collapse during monsoon cloud cover.",
      technologies: ["DSP Controllers", "Supercapacitors", "Power Electronics"],
      estimatedBudget: "₹22,00,000",
      budgetNum: 2200000,
      timeline: "7 Months",
      mentor: "Dr. K. N. Chatterjee (Dept. of Electrical Engineering)",
      studentTeamSize: 5,
      supportNeeded: ["CSR Funding", "Pilot Deployment", "High-Voltage Bench Equipment"],
      stage: "Pilot",
      isSponsored: true,
      sponsorName: "Central Coalfields Limited (CCL) CSR",
    },
    {
      id: "prop_007",
      title: "Phase-Change Material (PCM) Thermal Battery for Cold Rooms",
      problemTitle: "Solar Cold Storage Thermal Loss for Tribal Vegetable & Milk Farmers",
      problemId: "prob_003",
      universityName: "Birla Agricultural University (BAU), Ranchi",
      universityId: "univ_bau_ranchi",
      domain: "Agriculture",
      district: "Khunti",
      executiveSummary: "Bio-based latent heat phase change materials maintaining 4°C vegetable cooling for up to 36 hours without solar sunlight.",
      technologies: ["Phase-Change Materials", "Thermal Modeling", "Agri-Storage"],
      estimatedBudget: "₹14,50,000",
      budgetNum: 1450000,
      timeline: "6 Months",
      mentor: "Dr. Rameshwar Mahto (Head of Post-Harvest Tech)",
      studentTeamSize: 4,
      supportNeeded: ["CSR Funding", "Thermal Simulation Support", "Farmer Field Testing"],
      stage: "Design",
      isSponsored: false,
    },
    {
      id: "prop_022",
      title: "Vehicle-Mounted LiDAR & Accelerometer Pothole AI Mapping Node",
      problemTitle: "Monsoon Pothole & Road Quality Degradation on Rural Tribal Arterials",
      problemId: "prob_006",
      universityName: "National Institute of Technology (NIT), Jamshedpur",
      universityId: "univ_nit_jsr",
      domain: "Infrastructure",
      district: "West Singhbhum",
      executiveSummary: "Low-cost Edge AI camera and inertial accelerometer unit mounted on state buses to auto-map and triage rural pothole hazards.",
      technologies: ["Computer Vision", "Edge AI", "Geospatial GIS"],
      estimatedBudget: "₹8,00,000",
      budgetNum: 800000,
      timeline: "4 Months",
      mentor: "Dr. S. K. Mahapatra (Dept. of Civil Engineering)",
      studentTeamSize: 3,
      supportNeeded: ["CSR Funding", "Field Vehicle Mounting Clearance"],
      stage: "Design",
      isSponsored: false,
    },
  ]

  const filtered = solutions.filter((s) => {
    if (domainFilter !== "all" && s.domain !== domainFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        s.title.toLowerCase().includes(q) ||
        s.problemTitle.toLowerCase().includes(q) ||
        s.universityName.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry Portal", href: "/industry/dashboard" },
            { label: "University Solutions" },
          ]}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30">
                COMMERCIAL PREVIEW & SPONSORSHIP DISCOVERY
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Sparkles className="size-7 text-primary" />
              <span>University Solution Proposals</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Explore university innovations across Jharkhand and identify CSR sponsorship and technical partnership opportunities.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl border border-border bg-card flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search solutions, universities, problems..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground font-semibold"
            >
              <option value="all">All Domains</option>
              <option value="Water Management">Water Management</option>
              <option value="Energy">Energy</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((sol) => {
            const fit = profile
              ? industryMatchingService.calculateMatch(profile, sol.domain, sol.district, sol.budgetNum)
              : null

            return (
              <div
                key={sol.id}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4 text-left"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] text-primary border-primary/30 font-semibold">
                        {sol.domain}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {sol.district} District
                      </Badge>
                    </div>

                    {fit && (
                      <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] font-mono font-bold">
                        {fit.overallScore}% Match &bull; Advisory
                      </Badge>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block line-clamp-1">
                      Problem: {sol.problemTitle}
                    </span>
                    <h3 className="text-base font-bold text-foreground line-clamp-1">
                      {sol.title}
                    </h3>
                    <span className="text-xs text-primary font-semibold block">{sol.universityName}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {sol.executiveSummary}
                  </p>

                  <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="size-3.5 text-primary shrink-0" />
                      <span className="line-clamp-1">Mentor: {sol.mentor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-muted-foreground shrink-0" />
                      <span>{sol.studentTeamSize} Student Researchers</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/60 text-[11px] font-mono">
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase block font-sans">Estimated Budget</span>
                      <strong>{sol.estimatedBudget}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase block font-sans">Target Timeline</span>
                      <strong className="text-primary">{sol.timeline}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Lock className="size-3 text-muted-foreground shrink-0" />
                    <span>Technical Report Restricted</span>
                  </div>

                  <Link
                    href={`/industry/solutions/${sol.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 hover:bg-primary/90 gap-1"
                  >
                    <span>View Solution</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
