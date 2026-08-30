import {
  UniversityCapabilityProfile,
  UniversityProblemMatch,
} from "@/services/matching/matching-types"

export const MOCK_UNIVERSITY_CAPABILITY_PROFILE: UniversityCapabilityProfile = {
  institutionName: "Birla Institute of Technology (BIT), Mesra",
  institutionCode: "U-0270",
  district: "Ranchi, Jharkhand",
  verificationStatus: "verified",
  researchDomains: [
    "Environmental Engineering",
    "Water Management",
    "IoT Telemetry",
    "Renewable Energy",
    "Civil Engineering",
    "AI / Machine Learning",
  ],
  facilities: [
    "IoT Laboratory",
    "Environmental Research Lab",
    "Solar Energy Lab",
    "Embedded Systems Lab",
    "Drone / Remote Sensing Facility",
  ],
  facultyExpertise: [
    "Water & Environmental Engineering",
    "IoT & Embedded Systems",
    "Renewable Energy",
    "AI / Computer Vision",
  ],
  studentSkills: [
    "IoT & Microcontrollers",
    "Embedded Systems (ESP32/ARM)",
    "Python & Data Science",
    "AI/ML Computer Vision",
    "Electronics & PCB Design",
    "Civil & Environmental Testing",
  ],
  facultyMentorsTotal: 10,
  facultyMentorsAvailable: 6,
  studentsTotal: 24,
  studentsEngaged: 18,
  studentsAvailable: 6,
  activeLabsCount: 8,
}

export const MOCK_UNIVERSITY_MATCHES: UniversityProblemMatch[] = [
  // 1. Groundwater Fluoride (94% Match)
  {
    id: "match_001",
    problemId: "prob_001",
    title: "Groundwater Fluoride & Arsenic Contamination in Rural Borewells",
    description:
      "Severely elevated fluoride (up to 5.2 mg/L) and trace arsenic in drinking water across 14 village handpumps, causing dental fluorosis and health complications.",
    district: "Ranchi",
    location: "Ormanjhi & Mandar Blocks",
    domain: "Water Management",
    priority: "critical",
    communityReports: 147,
    duration: "8 Months",
    overallMatchScore: 94,
    domainExpertiseScore: 95,
    researchCapabilityScore: 92,
    laboratoryResourcesScore: 90,
    facultyAvailabilityScore: 96,
    studentSkillsScore: 93,
    recommendationReason:
      "This challenge aligns strongly with BIT Mesra's Environmental Engineering Department and IoT testbeds. Your institution possesses full spectrophotometric testing apparatus and active student bandwidth to field-test low-cost adsorption filters.",
    matchingStrengths: [
      "Environmental Engineering analytical water testing laboratory available",
      "Dedicated spectrophotometry & adsorption research cell on-campus",
      "Available faculty mentor in hydrochemical remediation (Dr. R. K. Mishra)",
      "4 student researchers skilled in ESP32 IoT telemetry and biochar synthesis",
      "Previous institutional pilot experience with decentralized filtration",
    ],
    proposedSolutionsCount: 3,
    hasUniversityProposed: true,
  },

  // 2. Solar Microgrid Reliability (91% Match - Sponsored)
  {
    id: "match_002",
    problemId: "prob_002",
    title: "Off-Grid Solar Microgrid Inverter Frequency Drift in Heavy Monsoon",
    description:
      "Severe power fluctuations and inverter trips during monsoon overcast spells in remote tribal health sub-centres, disrupting vaccine refrigeration cold chains.",
    district: "East Singhbhum",
    location: "Dumaria & Potka Health Blocks",
    domain: "Energy",
    priority: "high",
    communityReports: 89,
    duration: "6 Months",
    overallMatchScore: 91,
    domainExpertiseScore: 92,
    researchCapabilityScore: 90,
    laboratoryResourcesScore: 94,
    facultyAvailabilityScore: 88,
    studentSkillsScore: 92,
    recommendationReason:
      "Matches BIT Mesra's Power Electronics Lab and Solar Simulator facilities. Your university has already submitted a solution and secured industry prototyping sponsorship from Central Coalfields Limited CSR.",
    matchingStrengths: [
      "Centre of Excellence in Renewable Energy & Solar simulator testbed",
      "Power electronics DSP inverter firmware design capacity",
      "Faculty expertise in adaptive MPPT algorithms (Dr. Ananya Sen)",
      "Student capability in real-time grid telemetry and battery management",
    ],
    proposedSolutionsCount: 1,
    hasUniversityProposed: true,
    isSponsored: true,
    sponsorName: "Central Coalfields Limited (CCL) CSR",
    currentImplementationStage: "Prototype",
  },

  // 3. Smart Rural Healthcare Hub (89% Match)
  {
    id: "match_003",
    problemId: "prob_004",
    title: "Smart Rural Healthcare Telemedicine Hub for Remote Sub-Centres",
    description:
      "Critical shortage of on-site diagnostic doctors in remote forest health outposts leading to delayed maternal and chronic illness detection.",
    district: "Gumla",
    location: "Chainpur & Bishunpur Blocks",
    domain: "Healthcare",
    priority: "high",
    communityReports: 98,
    duration: "4 Months",
    overallMatchScore: 89,
    domainExpertiseScore: 88,
    researchCapabilityScore: 90,
    laboratoryResourcesScore: 86,
    facultyAvailabilityScore: 92,
    studentSkillsScore: 90,
    recommendationReason:
      "Combines BIT Mesra's embedded systems engineering with clinical telemedicine triage models. Your biomedical and computer science cells can deliver ruggedized diagnostic kiosks.",
    matchingStrengths: [
      "Edge-AI embedded hardware prototyping lab",
      "Cross-institutional clinical mentorship collaboration with RIMS Ranchi",
      "Student proficiency in Raspberry Pi CM4 and offline ML inference",
      "Available faculty advisor in biomedical instrumentation (Dr. Priya Roy)",
    ],
    proposedSolutionsCount: 1,
    hasUniversityProposed: true,
  },

  // 4. Rural Road Surface Monitoring (87% Match)
  {
    id: "match_004",
    problemId: "prob_003",
    title: "Rural Road Surface Quality & Pothole Monitoring on Mining Corridors",
    description:
      "Severe structural rutting and deep potholes on coal transport routes causing heavy vehicle breakdowns, traffic snarls, and emergency ambulance delays.",
    district: "Hazaribagh",
    location: "NH-33 & Barkagaon Coal Transit Corridor",
    domain: "Urban Development",
    priority: "high",
    communityReports: 112,
    duration: "7 Months",
    overallMatchScore: 87,
    domainExpertiseScore: 85,
    researchCapabilityScore: 88,
    laboratoryResourcesScore: 88,
    facultyAvailabilityScore: 86,
    studentSkillsScore: 88,
    recommendationReason:
      "Utilizes your Drone Remote Sensing testbed and AI computer vision cell to deploy vibration and photogrammetric surface mapping for heavy-haulage transport routes.",
    matchingStrengths: [
      "Drone / Remote Sensing UAV flight testing facility",
      "Computer vision & road surface anomaly detection algorithms",
      "Geotechnical civil engineering structural analysis cell",
      "Available faculty mentor in GIS mapping and transportation engineering",
    ],
    proposedSolutionsCount: 0,
    hasUniversityProposed: false,
  },

  // 5. Agricultural Cold Storage Monitoring (84% Match - Capability Gap Demo)
  {
    id: "match_005",
    problemId: "prob_005",
    title: "Micro Cold-Storage Monitoring for Mahua & Lac Forest Produce",
    description:
      "High post-harvest thermal decay (over 40%) of non-timber forest produce due to absence of humidity-controlled decentralized storage in tribal belts.",
    district: "Ramgarh",
    location: "Torpa & Murhu Forest Clusters",
    domain: "Agriculture",
    priority: "high",
    communityReports: 76,
    duration: "9 Months",
    overallMatchScore: 84,
    domainExpertiseScore: 82,
    researchCapabilityScore: 80,
    laboratoryResourcesScore: 76,
    facultyAvailabilityScore: 86,
    studentSkillsScore: 84,
    recommendationReason:
      "Strong alignment on IoT environmental sensors and biomass thermal energy. Your university has submitted a proposal; partnering with industry will bridge industrial refrigeration testing.",
    matchingStrengths: [
      "IoT temperature/humidity wireless sensor network testbed",
      "Biomass thermal gasification research cell",
      "Renewable energy micro-controller expertise",
    ],
    capabilityGaps: [
      "Limited commercial-scale refrigeration compressor test apparatus",
      "No cold-chain phase-change material (PCM) industrial testing bench",
    ],
    industrySupportSuggestion:
      "This project may benefit from industry support in industrial refrigeration hardware and commercial field deployment. Consider partnering with Tata Steel CSR or agricultural cold-chain suppliers.",
    proposedSolutionsCount: 1,
    hasUniversityProposed: true,
    isSponsored: true,
    sponsorName: "Tata Steel CSR Foundation",
    currentImplementationStage: "Design",
  },

  // 6. Village Plastic Waste Pyrolysis (78% Match - Capability Gap Demo)
  {
    id: "match_006",
    problemId: "prob_007",
    title: "Village Plastic Waste Pyrolysis & Decentralized Segregation Unit",
    description:
      "Accumulation of agricultural mulch films and single-use packaging in rural drainage channels causing soil degradation and canal blockages.",
    district: "East Singhbhum",
    location: "Ghatshila Peri-Urban Blocks",
    domain: "Sanitation",
    priority: "medium",
    communityReports: 64,
    duration: "5 Months",
    overallMatchScore: 78,
    domainExpertiseScore: 75,
    researchCapabilityScore: 78,
    laboratoryResourcesScore: 72,
    facultyAvailabilityScore: 80,
    studentSkillsScore: 76,
    recommendationReason:
      "Feasible thermal engineering project with strong electronic control systems, but requires external chemical processing partnership for continuous catalyst scrubbing.",
    matchingStrengths: [
      "Chemical reaction engineering bench available",
      "Embedded thermal telemetry controller capacity",
      "Student interest in circular economy and waste recycling",
    ],
    capabilityGaps: [
      "Polymer chemical synthesis lab currently operating at high utilization",
      "Exhaust gas scrubbing catalyst validation bench not available on-site",
    ],
    industrySupportSuggestion:
      "Consider industry collaboration with chemical processing plants in the Jamshedpur industrial corridor for emission scrubbers.",
    proposedSolutionsCount: 0,
    hasUniversityProposed: false,
  },
]
