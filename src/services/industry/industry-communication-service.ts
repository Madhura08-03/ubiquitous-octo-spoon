"use client"

export interface UniversityMessageThread {
  id: string
  industryId: string
  industryName: string
  universityId: string
  universityName: string
  solutionId: string
  solutionTitle: string
  subject: string
  purpose: "Sponsorship discussion" | "Technical clarification" | "Deployment partnership" | "Equipment support" | "Field deployment" | "Other"
  messages: {
    senderId: string
    senderName: string
    senderRole: "industry" | "university"
    content: string
    timestamp: string
  }[]
  lastUpdated: string
}

const COMM_STORAGE_KEY = "jh_industry_comm_threads_v1"

function isClient(): boolean {
  return typeof window !== "undefined"
}

const INITIAL_THREADS: UniversityMessageThread[] = [
  {
    id: "thread_001",
    industryId: "ind_001",
    industryName: "Tata Steel Foundation (CSR)",
    universityId: "univ_bit_mesra",
    universityName: "Birla Institute of Technology (BIT), Mesra",
    solutionId: "prop_004",
    solutionTitle: "Solar-Powered Multi-Stage Activated Alumina Adsorption Filtration",
    subject: "Field Deployment & CSR Grant Modalities for Ormanjhi Block",
    purpose: "Sponsorship discussion",
    messages: [
      {
        senderId: "ind_001",
        senderName: "Dr. Arvind Pathak (Tata Steel CSR)",
        senderRole: "industry",
        content: "We reviewed your solution summary on fluoride telemetry. We would like to allocate ₹18.5L CSR grant and request a meeting regarding Ormanjhi block pilot setup.",
        timestamp: "2026-08-15T11:00:00Z",
      },
      {
        senderId: "univ_bit_mesra",
        senderName: "Dr. Ananya Sharma (Faculty Lead, BIT Mesra)",
        senderRole: "university",
        content: "Thank you Dr. Pathak. Our student team and departmental lab welcome the collaboration. We have submitted the baseline data to PHED and look forward to the project kick-off.",
        timestamp: "2026-08-16T14:20:00Z",
      },
    ],
    lastUpdated: "2026-08-16T14:20:00Z",
  },
]

export class IndustryCommunicationService {
  private getStored(): UniversityMessageThread[] {
    if (!isClient()) return INITIAL_THREADS
    try {
      const item = localStorage.getItem(COMM_STORAGE_KEY)
      return item ? JSON.parse(item) : INITIAL_THREADS
    } catch {
      return INITIAL_THREADS
    }
  }

  private save(list: UniversityMessageThread[]) {
    if (isClient()) {
      localStorage.setItem(COMM_STORAGE_KEY, JSON.stringify(list))
    }
  }

  async sendUniversityMessage(payload: {
    industryId: string
    industryName: string
    universityId: string
    universityName: string
    solutionId: string
    solutionTitle: string
    purpose: UniversityMessageThread["purpose"]
    message: string
  }): Promise<UniversityMessageThread> {
    const list = this.getStored()
    const newThread: UniversityMessageThread = {
      id: `thread_${Math.random().toString(36).substring(2, 9)}`,
      industryId: payload.industryId,
      industryName: payload.industryName,
      universityId: payload.universityId,
      universityName: payload.universityName,
      solutionId: payload.solutionId,
      solutionTitle: payload.solutionTitle,
      subject: `${payload.purpose} &bull; ${payload.solutionTitle}`,
      purpose: payload.purpose,
      messages: [
        {
          senderId: payload.industryId,
          senderName: payload.industryName,
          senderRole: "industry",
          content: payload.message,
          timestamp: new Date().toISOString(),
        },
      ],
      lastUpdated: new Date().toISOString(),
    }

    list.unshift(newThread)
    this.save(list)
    return newThread
  }

  async getConversations(industryId?: string): Promise<UniversityMessageThread[]> {
    const list = this.getStored()
    if (!industryId) return list
    return list.filter((t) => t.industryId === industryId)
  }
}

export const industryCommunicationService = new IndustryCommunicationService()
