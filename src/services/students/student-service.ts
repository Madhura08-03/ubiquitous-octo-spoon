import { RegisteredStudent, StudentVerificationResult } from "./student-types"

export const MOCK_REGISTERED_STUDENTS: RegisteredStudent[] = [
  {
    id: "stu_001",
    name: "Priya Sharma",
    email: "priya.sharma@student.bitmesra.ac.in",
    universityId: "univ_bit_mesra",
    universityName: "Birla Institute of Technology, Mesra",
    department: "Electronics & Communication Engineering",
    registrationNumber: "BE/10842/2023",
    skills: ["IoT Telemetry", "Embedded Systems", "ESP32 Firmware", "Python", "Next.js"],
    researchInterests: ["Smart Water Telemetry", "Low-Power Sensor Networks", "Rural Telemetry"],
    bio: "Final-year Electronics & Communication undergraduate leading smart water quality sensor firmware development.",
    district: "Ranchi",
    joinedDate: "August 2025",
    socialLinks: {
      linkedin: "https://linkedin.com/in/priya-sharma-iot",
      github: "https://github.com/priya-sharma-bit",
      instagram: "https://instagram.com/priya_sharma_tech",
    },
    privacySettings: {
      showLinkedin: true,
      showGithub: true,
      showInstagram: true,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    },
  },
  {
    id: "stu_002",
    name: "Rahul Kumar",
    email: "rahul.kumar@student.bitmesra.ac.in",
    universityId: "univ_bit_mesra",
    universityName: "Birla Institute of Technology, Mesra",
    department: "Computer Science & Engineering",
    registrationNumber: "BE/10620/2023",
    skills: ["Data & Analytics", "Python", "AI/ML", "Predictive Dispersion", "PostgreSQL"],
    researchInterests: ["Water Contaminant Modeling", "Edge Machine Learning", "Geospatial Analytics"],
    bio: "CSE undergraduate passionate about predictive hydrochemical modeling and grassroots open-data civic platforms.",
    district: "Ranchi",
    joinedDate: "September 2025",
    socialLinks: {
      linkedin: "https://linkedin.com/in/rahul-kumar-ml",
      github: "https://github.com/rahulkumar-cse",
    },
    privacySettings: {
      showLinkedin: true,
      showGithub: true,
      showInstagram: false,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    },
  },
  {
    id: "stu_003",
    name: "Aakash Soren",
    email: "aakash.soren@bitmesra.ac.in",
    universityId: "univ_bit_mesra",
    universityName: "Birla Institute of Technology, Mesra",
    department: "Electrical & Electronics Engineering",
    registrationNumber: "BE/10452/2023",
    skills: ["Solar Microgrids", "Inverter DSP", "Battery BMS", "C/C++", "KiCad"],
    researchInterests: ["Rural Clean Energy", "Off-Grid Solar Stability", "Battery Energy Storage"],
    bio: "3rd-year EEE student researching adaptive MPPT inverter frequency stabilization for rural primary healthcare centres.",
    district: "Ranchi",
    joinedDate: "February 2026",
    socialLinks: {
      linkedin: "https://linkedin.com/in/aakash-soren",
      github: "https://github.com/aakash-soren",
    },
    privacySettings: {
      showLinkedin: true,
      showGithub: true,
      showInstagram: true,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    },
  },
  {
    id: "stu_004",
    name: "Sunita Besra",
    email: "sunita.besra@student.bitmesra.ac.in",
    universityId: "univ_bit_mesra",
    universityName: "Birla Institute of Technology, Mesra",
    department: "Civil & Environmental Engineering",
    registrationNumber: "BE/10290/2023",
    skills: ["Water Quality Chemistry", "Spectrophotometry", "Biochar Filtration", "Field Sampling"],
    researchInterests: ["Aquifer Remediation", "Bio-adsorbents", "Community Slow Sand Filters"],
    bio: "Environmental engineering researcher focusing on low-cost biochar adsorption columns for groundwater fluoride.",
    district: "Ranchi",
    joinedDate: "July 2025",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sunita-besra",
    },
    privacySettings: {
      showLinkedin: true,
      showGithub: false,
      showInstagram: false,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    },
  },
  {
    id: "stu_005",
    name: "Vikram Singh",
    email: "vikram.singh@student.bitmesra.ac.in",
    universityId: "univ_bit_mesra",
    universityName: "Birla Institute of Technology, Mesra",
    department: "Electrical Engineering",
    registrationNumber: "BE/10771/2023",
    skills: ["Power Electronics", "Matlab Simulink", "DSP Firmware", "Supercapacitors"],
    researchInterests: ["Renewable Energy Hardware", "Microgrid Interfacing"],
    bio: "Student researcher designing DSP phase-locked loop controls for rural microgrids.",
    district: "East Singhbhum",
    joinedDate: "August 2025",
    socialLinks: {
      linkedin: "https://linkedin.com/in/vikram-singh-power",
    },
    privacySettings: {
      showLinkedin: true,
      showGithub: true,
      showInstagram: false,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    },
  },
  {
    id: "stu_006",
    name: "Meera Soren",
    email: "meera.soren@student.bitmesra.ac.in",
    universityId: "univ_bit_mesra",
    universityName: "Birla Institute of Technology, Mesra",
    department: "Computer Science & Engineering",
    registrationNumber: "BE/10915/2023",
    skills: ["Edge-AI", "TensorFlow Lite", "Biomedical Telemetry", "Raspberry Pi CM4"],
    researchInterests: ["Offline Triage Algorithms", "Rural Telemedicine Diagnostics"],
    bio: "Building quantized deep learning algorithms for offline maternal and ECG screening in remote clinics.",
    district: "Gumla",
    joinedDate: "October 2025",
    socialLinks: {
      github: "https://github.com/meera-soren-ai",
    },
    privacySettings: {
      showLinkedin: true,
      showGithub: true,
      showInstagram: true,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    },
  },
  {
    id: "stu_007",
    name: "Deepak Oraon",
    email: "deepak.oraon@student.bitmesra.ac.in",
    universityId: "univ_bit_mesra",
    universityName: "Birla Institute of Technology, Mesra",
    department: "Chemical & Environmental Engineering",
    registrationNumber: "BE/10332/2023",
    skills: ["Adsorption Columns", "Pyrolysis Reactor Control", "Biochar Sorbents"],
    researchInterests: ["Agro-waste valorization for fluoride capture"],
    bio: "Chemical engineering student evaluating rice husk activated carbon for drinking water filters.",
    district: "Ranchi",
    joinedDate: "November 2025",
    privacySettings: {
      showLinkedin: false,
      showGithub: false,
      showInstagram: false,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    },
  },
  {
    id: "stu_008",
    name: "Ankit Mahato",
    email: "ankit.mahato@student.bitmesra.ac.in",
    universityId: "univ_bit_mesra",
    universityName: "Birla Institute of Technology, Mesra",
    department: "Civil & Infrastructure Engineering",
    registrationNumber: "BE/10540/2023",
    skills: ["Drone LiDAR", "Geotechnical Engineering", "ArcGIS", "Pavement Roughness"],
    researchInterests: ["Automated Road Distress Classification", "Mining Transport Corridors"],
    bio: "Civil engineering undergraduate deploying drone photogrammetry and vibration telemetry on mining highways.",
    district: "Hazaribagh",
    joinedDate: "January 2026",
    socialLinks: {
      linkedin: "https://linkedin.com/in/ankit-mahato-civil",
    },
    privacySettings: {
      showLinkedin: true,
      showGithub: true,
      showInstagram: false,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    },
  },
  // NIT Jamshedpur student (to demonstrate cross-university rejection)
  {
    id: "stu_009",
    name: "Rohan Das",
    email: "rohan.das@student.nitjsr.ac.in",
    universityId: "univ_nit_jsr",
    universityName: "National Institute of Technology (NIT), Jamshedpur",
    department: "Mechanical Engineering",
    registrationNumber: "2023UGME042",
    skills: ["CAD/CAM", "Thermal Modeling"],
    researchInterests: ["Gravity Adsorption Columns"],
    bio: "Mechanical engineering student at NIT Jamshedpur.",
    district: "East Singhbhum",
    joinedDate: "September 2025",
    privacySettings: {
      showLinkedin: true,
      showGithub: true,
      showInstagram: false,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    },
  },
]

export class MockStudentService {
  private students: RegisteredStudent[] = [...MOCK_REGISTERED_STUDENTS]

  async getAllStudents(): Promise<RegisteredStudent[]> {
    return [...this.students]
  }

  async getStudentById(id: string): Promise<RegisteredStudent | null> {
    return this.students.find((s) => s.id === id) || null
  }

  async getStudentByEmail(email: string): Promise<RegisteredStudent | null> {
    const clean = email.toLowerCase().trim()
    return this.students.find((s) => s.email.toLowerCase().trim() === clean) || null
  }

  verifyStudentForUniversity(
    email: string,
    currentUniversityName: string
  ): StudentVerificationResult {
    const clean = email.toLowerCase().trim()
    const student = this.students.find((s) => s.email.toLowerCase().trim() === clean)

    if (!student) {
      return {
        status: "not_found",
        errorMessage: "Student not found. This student must register on the portal before being added to a solution team.",
      }
    }

    // Check university match (loose match for BIT Mesra variants)
    const isBit =
      (currentUniversityName.includes("BIT Mesra") || currentUniversityName.includes("Birla Institute")) &&
      (student.universityName.includes("BIT Mesra") || student.universityName.includes("Birla Institute"))

    const isNit =
      currentUniversityName.includes("NIT") && student.universityName.includes("NIT")

    const isMatch = isBit || isNit || student.universityName.toLowerCase() === currentUniversityName.toLowerCase()

    if (!isMatch) {
      return {
        status: "different_university",
        student,
        errorMessage: `This student is registered with ${student.universityName} and cannot be added to your project team.`,
      }
    }

    return {
      status: "verified",
      student,
    }
  }

  async updateStudentPrivacy(
    studentId: string,
    settings: Partial<NonNullable<RegisteredStudent["privacySettings"]>>
  ): Promise<boolean> {
    const student = this.students.find((s) => s.id === studentId)
    if (!student) return false
    const current = student.privacySettings || {
      showLinkedin: true,
      showGithub: true,
      showInstagram: true,
      showSkills: true,
      showProjects: true,
      showDistrict: true,
    }
    student.privacySettings = { ...current, ...settings }
    return true
  }
}

export const studentService = new MockStudentService()
