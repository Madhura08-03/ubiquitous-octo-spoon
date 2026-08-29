export interface UniversityOption {
  id: string
  name: string
  district: string
  code: string
}

export interface OrgTypeOption {
  id: string
  label: string
  description: string
}

export interface DomainOption {
  id: string
  label: string
}

export const JHARKHAND_UNIVERSITIES: UniversityOption[] = [
  { id: "bit-mesra", name: "Birla Institute of Technology (BIT) Mesra", district: "Ranchi", code: "U-0270" },
  { id: "nit-jsr", name: "National Institute of Technology (NIT) Jamshedpur", district: "East Singhbhum", code: "U-0275" },
  { id: "iit-ism", name: "Indian Institute of Technology (IIT / ISM) Dhanbad", district: "Dhanbad", code: "U-0271" },
  { id: "ranchi-univ", name: "Ranchi University", district: "Ranchi", code: "U-0278" },
  { id: "cuj", name: "Central University of Jharkhand (CUJ)", district: "Ranchi", code: "U-0268" },
  { id: "kolhan-univ", name: "Kolhan University", district: "Chaibasa / West Singhbhum", code: "U-0273" },
  { id: "vbu", name: "Vinoba Bhave University (VBU)", district: "Hazaribagh", code: "U-0280" },
  { id: "skmu", name: "Sido Kanhu Murmu University (SKMU)", district: "Dumka", code: "U-0279" },
  { id: "dspmu", name: "Dr. Shyama Prasad Mukherjee University", district: "Ranchi", code: "U-0965" },
  { id: "jut", name: "Jharkhand University of Technology (JUT)", district: "Ranchi", code: "U-0897" },
  { id: "aiims-deoghar", name: "All India Institute of Medical Sciences (AIIMS)", district: "Deoghar", code: "U-1120" },
  { id: "xiss", name: "Xavier Institute of Social Service (XISS)", district: "Ranchi", code: "U-0282" },
]

export const ORGANIZATION_TYPES: OrgTypeOption[] = [
  { id: "industry", label: "Corporate Enterprise / Industry", description: "Large corporate entity with active CSR programs" },
  { id: "startup", label: "Startup (DPIIT Registered)", description: "Early or growth stage innovative technology venture" },
  { id: "msme", label: "Micro, Small & Medium Enterprise (MSME)", description: "Local manufacturer or tech service supplier" },
  { id: "csr", label: "Corporate Social Responsibility (CSR) Foundation", description: "Dedicated charitable or community development wing" },
  { id: "research", label: "Research & Development Organization", description: "Autonomous or scientific research institute" },
  { id: "incubator", label: "Incubator / Technology Hub", description: "Startup accelerator or regional innovation lab" },
]

export const INDUSTRY_DOMAINS: DomainOption[] = [
  { id: "clean_energy", label: "Clean Energy, Solar & Micro-Grids" },
  { id: "water_resources", label: "Water Conservation & IoT Telemetry" },
  { id: "smart_agri", label: "Smart Agriculture & Pest Warning" },
  { id: "rural_health", label: "Rural Healthcare & Telemedicine" },
  { id: "mining_env", label: "Mining Safety & Particulate Control" },
  { id: "infrastructure", label: "Civic Infrastructure & Smart Transit" },
  { id: "digital_edu", label: "Digital Education & Mesh Systems" },
]

export const ROLE_CARD_DEFINITIONS = [
  {
    role: "citizen" as const,
    title: "Citizen",
    tagline: "Voice of the Grassroots",
    description: "Report local community challenges with geotags and photos. Track resolution progress in real time.",
    verificationType: "Instant OTP Verification",
    badgeColor: "emerald",
  },
  {
    role: "student" as const,
    title: "Student Innovator",
    tagline: "Next-Gen Problem Solver",
    description: "Join multidisciplinary university teams, develop working prototypes, and compete for grants.",
    verificationType: "College ID Verification",
    badgeColor: "lime",
  },
  {
    role: "university" as const,
    title: "University / Faculty",
    tagline: "Academic Incubation Core",
    description: "Mentor student innovation cohorts, manage campus R&D projects, and certify solution prototypes.",
    verificationType: "Institutional Review (AISHE)",
    badgeColor: "teal",
  },
  {
    role: "industry" as const,
    title: "Industry / CSR Partner",
    tagline: "Funding & Scale Catalyst",
    description: "Sponsor high-impact student prototypes, provide engineering mentorship, and track CSR returns.",
    verificationType: "Corporate Registration (CIN)",
    badgeColor: "indigo",
  },
]