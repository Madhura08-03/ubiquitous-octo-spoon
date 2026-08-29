/**
 * Mock data for the Public Landing Page.
 * Separated cleanly from presentation components so backend API integration can replace it later.
 */

import { StatusType } from "@/components/ui/status-badge"

export interface FloatingMetric {
  label: string
  value: string
  detail: string
}

export interface EcosystemStakeholder {
  id: string
  role: string
  title: string
  description: string
  badge: string
}

export interface PlatformPillar {
  step: string
  title: string
  description: string
  detail: string
}

export interface WorkflowStage {
  step: string
  title: string
  actor: string
  description: string
  badge: string
}

export interface CivicChallenge {
  id: string
  domain: string
  title: string
  description: string
  district: string
  severity: "Critical" | "High" | "Medium" | "Low"
  reportsCount: number
  reportedTimeAgo: string
  status: StatusType
  fundingPledged?: string
}

export interface ImpactStatistic {
  value: string
  label: string
  subtext: string
}

export interface ImpactStory {
  title: string
  subtitle: string
  location: string
  challenge: string
  response: string
  partner: string
  impact: string
  disclaimer: string
}

export const HERO_METRICS: FloatingMetric[] = [
  {
    value: "2,481+",
    label: "Challenges Reported",
    detail: "Direct from grassroots citizens",
  },
  {
    value: "24 / 24",
    label: "Districts Represented",
    detail: "Statewide Jharkhand coverage",
  },
  {
    value: "118",
    label: "Prototypes Underway",
    detail: "University student & faculty labs",
  },
]

export const ECOSYSTEM_STAKEHOLDERS: EcosystemStakeholder[] = [
  {
    id: "citizens",
    role: "Citizens",
    title: "Ground-Level Problem Identification",
    description: "Submit geotagged civic challenges with photographic evidence and track development milestones.",
    badge: "Reporting Voice",
  },
  {
    id: "students",
    role: "Students",
    title: "Youth Technical Innovation",
    description: "Form multidisciplinary student teams to engineer prototypes, CAD models, and mobile software.",
    badge: "Problem Solvers",
  },
  {
    id: "universities",
    role: "Universities",
    title: "Academic Research & Incubation",
    description: "Faculty mentors guide rigorous engineering and validate laboratory feasibility.",
    badge: "Mentorship Core",
  },
  {
    id: "industry",
    role: "Industry Partners",
    title: "CSR Grants & Technical Resources",
    description: "Provide seed capital, hardware testing facilities, and corporate mentorship.",
    badge: "Catalyst Capital",
  },
  {
    id: "government",
    role: "Government / Admin",
    title: "Policy Directives & Deployment",
    description: "District collectors validate priorities, fast-track approvals, and deploy solutions.",
    badge: "Scale & Authority",
  },
]

export const PILLAR_ITEMS: PlatformPillar[] = [
  {
    step: "01",
    title: "Identify",
    description: "Citizens and local communities report real problems with district geolocation and verifiable field evidence.",
    detail: "Eliminates disconnect between governance priorities and grassroots reality.",
  },
  {
    step: "02",
    title: "Connect",
    description: "AI classification and administrative vetting routes validated challenges to universities with relevant departmental expertise.",
    detail: "Direct pipeline connecting societal challenges with academic researchers.",
  },
  {
    step: "03",
    title: "Build",
    description: "Students, faculty researchers, and corporate engineers collaborate on practical, deployable hardware and software solutions.",
    detail: "Supported by CSR seed grants and college incubation centres.",
  },
  {
    step: "04",
    title: "Impact",
    description: "District administration and line departments validate field trials and commission statewide public deployment.",
    detail: "Continuous monitoring measures community outcomes and return on civic investment.",
  },
]

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    step: "01",
    title: "Report",
    actor: "Citizen / Community",
    description: "Citizen logs problem statement with geolocation, photos, and severity context.",
    badge: "Submission",
  },
  {
    step: "02",
    title: "Validate",
    actor: "AI Engine & District Nodal",
    description: "System deduplicates, checks authenticity, and categorizes domain requirements.",
    badge: "Vetting",
  },
  {
    step: "03",
    title: "Match",
    actor: "University Portal",
    description: "Challenge is routed to accredited higher education institutions across Jharkhand.",
    badge: "Assignment",
  },
  {
    step: "04",
    title: "Solve",
    actor: "Students & Faculty Mentors",
    description: "Teams build working prototypes, submit schematics, and refine pilot feasibility.",
    badge: "Incubation",
  },
  {
    step: "05",
    title: "Partner",
    actor: "Industry CSR & Co-Sponsors",
    description: "Corporate partners pledge grant funding, manufacturing, and domain mentorship.",
    badge: "Funding",
  },
  {
    step: "06",
    title: "Deploy",
    actor: "Government Line Department",
    description: "District administration approves pilot deployment in target panchayats.",
    badge: "Commissioning",
  },
  {
    step: "07",
    title: "Measure",
    actor: "Community & Portal Analytics",
    description: "Verified community outcomes, water flow, or service uptime tracked publicly.",
    badge: "Sustained Impact",
  },
]

export const FEATURED_CHALLENGES: CivicChallenge[] = [
  {
    id: "PRB-8901",
    domain: "Water Supply & Irrigation",
    title: "Smart Solar Irrigation Telemetry for Drought-Prone Palamu",
    description: "Groundwater depletion requires automated low-cost IoT soil moisture probes and automated drip scheduling for smallholder farmers.",
    district: "Palamu District",
    severity: "Critical",
    reportsCount: 34,
    reportedTimeAgo: "2 hours ago",
    status: "verified",
    fundingPledged: "₹2.5L CSR Sponsored",
  },
  {
    id: "PRB-8902",
    domain: "Rural Healthcare",
    title: "Solar-Powered Cold Chain for Tribal Vaccine Depots",
    description: "Intermittent rural grid power causes vaccine wastage during monsoon months in remote block health centres.",
    district: "Dumka District",
    severity: "High",
    reportsCount: 19,
    reportedTimeAgo: "1 day ago",
    status: "in_progress",
    fundingPledged: "₹4.0L Seed Grant",
  },
  {
    id: "PRB-8903",
    domain: "Smart Agriculture",
    title: "IoT Soil Telemetry & Crop Pest Early Warning Network",
    description: "Vegetable growers require distributed micro-weather stations to predict blight infestations before yield loss occurs.",
    district: "Hazaribagh District",
    severity: "Medium",
    reportsCount: 28,
    reportedTimeAgo: "2 days ago",
    status: "active",
    fundingPledged: "Open for Sponsor",
  },
  {
    id: "PRB-8904",
    domain: "Road Infrastructure",
    title: "AI Computer Vision Rover for National Highway Pothole Audit",
    description: "High-speed road quality assessment and automated geo-tagging along the Ranchi-Jamshedpur industrial transit corridor.",
    district: "East Singhbhum (Jamshedpur)",
    severity: "High",
    reportsCount: 45,
    reportedTimeAgo: "3 days ago",
    status: "government_approved",
    fundingPledged: "Govt Sanctioned",
  },
  {
    id: "PRB-8905",
    domain: "Digital Education",
    title: "Offline Digital Study Hubs for Rural Secondary Schools",
    description: "Local mesh Wi-Fi servers delivering NCERT and state curriculum video lessons without requiring active cellular internet.",
    district: "Ranchi District",
    severity: "Medium",
    reportsCount: 12,
    reportedTimeAgo: "4 days ago",
    status: "under_review",
    fundingPledged: "Open for Sponsor",
  },
  {
    id: "PRB-8906",
    domain: "Mining & Environment",
    title: "Low-Cost Particulate Dust Suppressor for Mining Transit Routes",
    description: "Suspended coal particulate mitigation using electrostatic water-mist misting arrays along heavy dumper haul roads.",
    district: "Dhanbad District",
    severity: "Critical",
    reportsCount: 52,
    reportedTimeAgo: "5 days ago",
    status: "industry_sponsored",
    fundingPledged: "₹6.5L Tata CSR",
  },
]

export const IMPACT_METRICS: ImpactStatistic[] = [
  {
    value: "2,481+",
    label: "Challenges Reported",
    subtext: "From citizens & panchayat bodies",
  },
  {
    value: "1,240+",
    label: "Citizens Engaged",
    subtext: "Active problem contributors",
  },
  {
    value: "48",
    label: "Universities Connected",
    subtext: "Technical & research institutions",
  },
  {
    value: "126",
    label: "Industry Partners",
    subtext: "CSR foundations & enterprise donors",
  },
  {
    value: "312",
    label: "Solutions in Development",
    subtext: "Hardware & digital prototypes",
  },
  {
    value: "74",
    label: "Projects Deployed",
    subtext: "Validated in field communities",
  },
]

export const IMPACT_STORY: ImpactStory = {
  title: "Technology Means More When It Reaches People.",
  subtitle: "How collaborative engineering brought uninterrupted clean water to 1,400 villagers in Ormanjhi.",
  location: "Ormanjhi Block, Ranchi District",
  challenge: "A cluster of 3 villages faced recurring borewell pump failures and severe water-table depletion every summer, leaving women with a 3 km daily trek for drinking water.",
  response: "An interdisciplinary team of 5 engineering students and 2 faculty mentors from BIT Mesra designed an automated solar pump controller with ultrasonic aquifer depth telemetry.",
  partner: "Tata Steel CSR funded the hardware prototyping, testing enclosures, and GSM cellular telemetry gateways.",
  impact: "Successfully commissioned across 8 community borewells. Water delivery downtime dropped by 92%, and real-time groundwater monitoring is now visible directly to the District Collectorate.",
  disclaimer: "Illustrative prototype demonstration journey",
}