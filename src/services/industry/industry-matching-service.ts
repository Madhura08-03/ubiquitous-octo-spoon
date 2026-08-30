import { IndustryProfile, IndustryMatchRecommendation } from "./industry-collaboration-types"
import { ProblemDomain } from "@/services/problems/problem-types"

export class IndustryMatchingService {
  calculateMatch(profile: IndustryProfile, domain: string, district: string, estimatedBudget: number): IndustryMatchRecommendation {
    // 1. CSR Focus Alignment (0-100)
    let csrAlignment = 75
    if (profile.preferredDomains.includes(domain as ProblemDomain)) {
      csrAlignment = 95
    }

    // 2. Geographic Alignment (0-100)
    let geographicAlignment = 70
    if (profile.preferredDistricts.some((d) => district.toLowerCase().includes(d.toLowerCase()))) {
      geographicAlignment = 95
    }

    // 3. Domain Alignment (0-100)
    let domainAlignment = 80
    if (profile.CSRFocusAreas.some((c) => domain.toLowerCase().includes(c.toLowerCase()))) {
      domainAlignment = 92
    }

    // 4. Funding Compatibility
    let fundingCompatibility = 85
    if (estimatedBudget > 0 && estimatedBudget <= 2500000) {
      fundingCompatibility = 90
    }

    // 5. Support Compatibility
    const supportCompatibility = 88

    const overallScore = Math.round(
      csrAlignment * 0.3 +
      geographicAlignment * 0.25 +
      domainAlignment * 0.2 +
      fundingCompatibility * 0.15 +
      supportCompatibility * 0.1
    )

    const strengths: string[] = []
    const potentialGaps: string[] = []

    if (csrAlignment >= 90) {
      strengths.push(`Strong thematic alignment with ${profile.companyName} CSR priorities in ${domain}.`)
    }
    if (geographicAlignment >= 90) {
      strengths.push(`Target problem is located in preferred CSR district (${district}).`)
    }
    if (fundingCompatibility >= 85) {
      strengths.push("Estimated budget is well within sanctioned corporate grant thresholds.")
    }

    if (geographicAlignment < 80) {
      potentialGaps.push(`Problem district (${district}) is outside core operating CSR zone.`)
    }

    return {
      overallScore,
      csrAlignment,
      domainAlignment,
      geographicAlignment,
      supportCompatibility,
      fundingCompatibility,
      strengths,
      potentialGaps,
      recommendedSupportType: "CSR Funding + Field Deployment Partnership",
    }
  }
}

export const industryMatchingService = new IndustryMatchingService()
