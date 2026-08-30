"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileQuestion,
  Search,
  ExternalLink,
  Building,
  MapPin,
} from "lucide-react"

import { GovernmentProblemSummary, GovernmentPipelineStageKey } from "@/services/admin/admin-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"

interface GovernmentProblemRegistryProps {
  problems: GovernmentProblemSummary[]
  onOpenLifecycleModal: (problem: GovernmentProblemSummary) => void
  onViewSolutionsForProblem: (problemId: string) => void
  selectedStageFilter?: GovernmentPipelineStageKey | "all"
}

export function GovernmentProblemRegistry({
  problems,
  onOpenLifecycleModal,
  onViewSolutionsForProblem,
  selectedStageFilter = "all",
}: GovernmentProblemRegistryProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("all")
  const [selectedDomain, setSelectedDomain] = React.useState<string>("all")
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all")

  const districts = React.useMemo(() => {
    const list = Array.from(new Set(problems.map((p) => p.district))).sort()
    return ["all", ...list]
  }, [problems])

  const domains = React.useMemo(() => {
    const list = Array.from(new Set(problems.map((p) => p.domain))).sort()
    return ["all", ...list]
  }, [problems])

  const filteredProblems = React.useMemo(() => {
    return problems.filter((p) => {
      if (selectedStageFilter !== "all" && p.stage !== selectedStageFilter) return false
      if (selectedDistrict !== "all" && p.district !== selectedDistrict) return false
      if (selectedDomain !== "all" && p.domain !== selectedDomain) return false
      if (selectedPriority !== "all" && p.priority !== selectedPriority) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchId = p.id.toLowerCase().includes(q)
        const matchDistrict = p.district.toLowerCase().includes(q)
        const matchUniv = p.selectedUniversity?.toLowerCase().includes(q)
        return matchTitle || matchId || matchDistrict || matchUniv
      }
      return true
    })
  }, [problems, selectedStageFilter, selectedDistrict, selectedDomain, selectedPriority, searchQuery])

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileQuestion className="size-4 text-primary" />
            <span>Statewide Societal Problem Registry</span>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
              {filteredProblems.length} Records
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Complete database of civic challenges under evaluation, multi-university bidding, or active development.
          </p>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by ID, keywords, district..."
            className="pl-8 text-xs h-9"
          />
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Districts (24)</option>
          {districts.filter(d => d !== "all").map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Domains</option>
          {domains.filter(d => d !== "all").map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical Urgency</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Problems Registry Table */}
      {filteredProblems.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={FileQuestion}
            title="No Problems Match Selected Filters"
            description="Adjust your search criteria, domain, or pipeline stage to inspect problems."
          />
        </div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground text-[11px]">
                <th className="py-3 px-3">Challenge ID & Title</th>
                <th className="py-3 px-3">District / Domain</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Pipeline Stage</th>
                <th className="py-3 px-3 text-center">Reports / Proposals</th>
                <th className="py-3 px-3">Implementation Partner</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProblems.map((prob) => (
                <tr key={prob.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-mono text-[10px] text-muted-foreground font-semibold">
                      {prob.id}
                    </div>
                    <Link
                      href={`/problems/${prob.id}`}
                      className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {prob.title}
                    </Link>
                    <div className="text-[11px] text-muted-foreground line-clamp-1">
                      {prob.description}
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-foreground font-semibold">
                      <MapPin className="size-3 text-primary" />
                      <span>{prob.district}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {prob.domain}
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        prob.priority === "critical"
                          ? "border-rose-500/40 text-rose-700 dark:text-rose-400 bg-rose-500/10"
                          : prob.priority === "high"
                          ? "border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/10"
                          : "border-blue-500/40 text-blue-700 dark:text-blue-400 bg-blue-500/10"
                      }`}
                    >
                      {prob.priority}
                    </Badge>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold capitalize border-primary/30 bg-primary/5 text-primary"
                    >
                      {prob.stage.replace(/_/g, " ")}
                    </Badge>
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="font-bold text-foreground">
                      {prob.communityReportsCount} <span className="text-muted-foreground font-normal text-[10px]">reports</span>
                    </div>
                    <div className="text-[11px] text-primary font-semibold">
                      {prob.solutionProposalsCount} proposals
                    </div>
                  </td>

                  <td className="py-3 px-3 max-w-[180px]">
                    {prob.selectedUniversity ? (
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground truncate flex items-center gap-1">
                          <Building className="size-3 text-blue-500 shrink-0" />
                          <span className="truncate">{prob.selectedUniversity}</span>
                        </div>
                        {prob.sponsorName && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">
                            Sponsor: {prob.sponsorName}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">
                        {prob.solutionProposalsCount > 0 ? "Under Evaluation" : "Open for Proposals"}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="w-20 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span>{prob.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${prob.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/problems/${prob.id}`}
                        className="text-xs h-7 px-2 py-1 rounded-md border border-border bg-card hover:bg-muted text-foreground inline-flex items-center gap-1 font-semibold"
                        title="View Public Problem Details"
                      >
                        <span>Problem</span>
                        <ExternalLink className="size-2.5" />
                      </Link>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onViewSolutionsForProblem(prob.id)}
                        className="text-xs h-7 px-2 font-bold text-primary hover:bg-primary/10 border-primary/30"
                      >
                        Solutions ({prob.solutionProposalsCount})
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onOpenLifecycleModal(prob)}
                        className="text-xs h-7 px-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                      >
                        Lifecycle
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
