"use client"

import * as React from "react"
import {
  Shield,
  Sparkles,
  Building2,
  Landmark,
  FileQuestion,
  Lightbulb,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Bell,
  Code2,
  Award,
  Filter,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Custom Design System Components
import { StatusBadge, StatusType } from "@/components/ui/status-badge"
import { StatCard } from "@/components/ui/stat-card"
import { SearchInput } from "@/components/ui/search-input"
import { FileUpload } from "@/components/ui/file-upload"
import { OTPInput } from "@/components/ui/otp-input"
import { ProgressRing } from "@/components/ui/progress-ring"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Timeline, TimelineItem } from "@/components/ui/timeline"
import { MapPlaceholder } from "@/components/ui/map-placeholder"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { PublicNavbar } from "@/components/navigation/public-navbar"
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar"

export default function DesignSystemPage() {
  const [searchValue, setSearchValue] = React.useState("")
  const [otpValue, setOtpValue] = React.useState("834001")
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const sampleTimeline: TimelineItem[] = [
    {
      id: "1",
      title: "Problem Verified by District Collectorate",
      description: "Field verification completed for solar water pump micro-grid requirement.",
      timestamp: "Today, 10:30 AM",
      status: "completed",
      badge: "Govt Admin",
    },
    {
      id: "2",
      title: "BIT Mesra Research Team Assigned",
      description: "Department of Electrical Engineering initiated prototype feasibility study.",
      timestamp: "Yesterday, 3:45 PM",
      status: "completed",
      badge: "University",
    },
    {
      id: "3",
      title: "Tata Steel CSR Grant Under Review",
      description: "Grant proposal for INR 4.5 Lakhs submitted for hardware procurement.",
      timestamp: "24 Aug 2026",
      status: "current",
      badge: "Industry",
    },
    {
      id: "4",
      title: "Community Pilot Deployment",
      description: "Planned field trial in Ormanjhi block.",
      timestamp: "15 Sep 2026",
      status: "upcoming",
    },
  ]

  const allStatuses: StatusType[] = [
    "verified",
    "government_approved",
    "completed",
    "active",
    "in_progress",
    "under_review",
    "pending",
    "industry_sponsored",
    "critical",
    "high",
    "medium",
    "low",
    "rejected",
  ]

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Shield className="size-5 text-lime-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight">Design System & UI Library</h1>
                <Badge variant="secondary" className="text-[10px] font-mono uppercase bg-lime-500/20 text-lime-800 dark:text-lime-400 border-lime-500/30">
                  Internal Preview
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Government of Jharkhand &bull; Societal Innovation Collaboration Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("Design System Toast", {
                  description: "Sonner notification system is active and functioning.",
                })
              }}
            >
              <Bell className="size-3.5" />
              Test Toast
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              Open Dialog
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Navigation Breadcrumb Example */}
        <section className="space-y-2">
          <Breadcrumbs
            items={[
              { label: "Engineering", href: "#" },
              { label: "Design System Showcase", current: true },
            ]}
          />
        </section>

        {/* SECTION 1: Color Palette Tokens */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h2 className="text-lg font-bold tracking-tight">1. Brand & Semantic Color Tokens</h2>
              <p className="text-xs text-muted-foreground">
                Sophisticated dark charcoal, warm off-white, lime/olive green, and muted teal.
              </p>
            </div>
            <Code2 className="size-4 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {/* Charcoal */}
            <div className="rounded-xl border border-border p-3 bg-card space-y-2">
              <div className="h-16 w-full rounded-lg bg-[oklch(0.18_0.015_240)] shadow-inner" />
              <div>
                <p className="text-xs font-bold">Deep Charcoal</p>
                <p className="text-[10px] font-mono text-muted-foreground">--brand-charcoal</p>
              </div>
            </div>

            {/* Lime */}
            <div className="rounded-xl border border-border p-3 bg-card space-y-2">
              <div className="h-16 w-full rounded-lg bg-[oklch(0.68_0.16_130)] shadow-inner" />
              <div>
                <p className="text-xs font-bold text-lime-800 dark:text-lime-400">Lime / Olive</p>
                <p className="text-[10px] font-mono text-muted-foreground">--brand-lime</p>
              </div>
            </div>

            {/* Teal */}
            <div className="rounded-xl border border-border p-3 bg-card space-y-2">
              <div className="h-16 w-full rounded-lg bg-[oklch(0.62_0.11_200)] shadow-inner" />
              <div>
                <p className="text-xs font-bold text-teal-800 dark:text-teal-400">Muted Teal</p>
                <p className="text-[10px] font-mono text-muted-foreground">--brand-teal</p>
              </div>
            </div>

            {/* Warm Offwhite */}
            <div className="rounded-xl border border-border p-3 bg-card space-y-2">
              <div className="h-16 w-full rounded-lg bg-[oklch(0.985_0.003_90)] border border-border" />
              <div>
                <p className="text-xs font-bold">Warm Off-White</p>
                <p className="text-[10px] font-mono text-muted-foreground">--brand-offwhite</p>
              </div>
            </div>

            {/* Success */}
            <div className="rounded-xl border border-border p-3 bg-card space-y-2">
              <div className="h-16 w-full rounded-lg bg-[oklch(0.62_0.16_142)] shadow-inner" />
              <div>
                <p className="text-xs font-bold text-emerald-600">Success</p>
                <p className="text-[10px] font-mono text-muted-foreground">--success</p>
              </div>
            </div>

            {/* Danger */}
            <div className="rounded-xl border border-border p-3 bg-card space-y-2">
              <div className="h-16 w-full rounded-lg bg-[oklch(0.58_0.20_25)] shadow-inner" />
              <div>
                <p className="text-xs font-bold text-rose-600">Danger / Alert</p>
                <p className="text-[10px] font-mono text-muted-foreground">--destructive</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Typography Scale */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight">2. Typography Hierarchy</h2>
            <p className="text-xs text-muted-foreground">
              Modern sans-serif type optimized for portal clarity, governance credibility, and responsive layouts.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Display (3rem / 48px)</p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                Jharkhand Societal Innovation Portal
              </h1>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Heading 1 (2.25rem / 36px)</p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Multi-Stakeholder Innovation Framework
              </h1>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Heading 2 (1.875rem / 30px)</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Community Challenges & District Directives
              </h2>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Heading 3 (1.5rem / 24px)</p>
              <h3 className="text-xl font-semibold text-foreground">
                University Mentorship & Research Incubation
              </h3>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Heading 4 (1.25rem / 20px)</p>
              <h4 className="text-base sm:text-lg font-semibold text-foreground">
                Industry CSR Co-Sponsorship & Technology Grants
              </h4>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Body & Body Small</p>
              <p className="text-sm text-foreground leading-relaxed">
                Citizens submit verified grassroot challenges. University faculties mentor interdisciplinary student teams to prototype sustainable solutions, backed by corporate CSR funds and institutional approval.
              </p>
              <p className="text-xs text-muted-foreground">
                Caption text for metadata: Verified by Department of Higher & Technical Education &bull; Ref: JH-2026-8902
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Buttons & Interactive Elements */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight">3. Button System</h2>
            <p className="text-xs text-muted-foreground">
              Primary, Secondary, Outline, Ghost, Destructive, Success, and Link variants across all sizes and states.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success Action</Button>
                <Button variant="link">Link Style</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Sizes & Icons</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">Large (40px)</Button>
                <Button size="default">Default (36px)</Button>
                <Button size="sm">Small (32px)</Button>
                <Button size="xs">Extra Small (24px)</Button>
                <Button size="icon" aria-label="Icon only">
                  <Sparkles className="size-4" />
                </Button>
                <Button variant="default" className="gap-2">
                  <Lightbulb className="size-4 text-lime-400" />
                  <span>With Icon</span>
                </Button>
                <Button variant="default" isLoading>
                  Submitting
                </Button>
                <Button variant="default" disabled>
                  Disabled State
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Status Badges */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight">4. Status & Domain Badges</h2>
            <p className="text-xs text-muted-foreground">
              Semantic badges with distinct visual icons for accessibility and instant status recognition.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap gap-2.5">
              {allStatuses.map((status) => (
                <StatusBadge key={status} status={status} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: Form Controls System */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight">5. Form Controls & Primitives</h2>
            <p className="text-xs text-muted-foreground">
              Input, Search, Textarea, Select, Checkbox, Radio, Switch, File Upload, and OTP inputs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Inputs & Search */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold">Standard & Search Inputs</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Search Input (with Shortcut & Clear)</label>
                <SearchInput
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClear={() => setSearchValue("")}
                  shortcutHint="Ctrl+K"
                  placeholder="Search problem statements or projects..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Standard Text Input</label>
                <Input placeholder="e.g. Ranchi Smart Waste Management" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Select Dropdown</label>
                <Select defaultValue="ranchi">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ranchi">Ranchi District</SelectItem>
                    <SelectItem value="dhanbad">Dhanbad District</SelectItem>
                    <SelectItem value="jamshedpur">East Singhbhum (Jamshedpur)</SelectItem>
                    <SelectItem value="bokaro">Bokaro Steel City</SelectItem>
                    <SelectItem value="hazaribagh">Hazaribagh District</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Textarea</label>
                <Textarea placeholder="Provide detailed technical requirements and societal impact summary..." />
              </div>
            </div>

            {/* Checkbox, Radio, Switch, OTP & Upload */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold">Toggles, OTP & Upload</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="c1" defaultChecked />
                  <label htmlFor="c1" className="text-xs font-medium cursor-pointer">
                    Enable Government Nodal Notification
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-xs font-bold">Allow University Collaboration</p>
                    <p className="text-[11px] text-muted-foreground">Open solution submissions to registered universities</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Priority Level</label>
                  <RadioGroup defaultValue="high" className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="high" id="r1" />
                      <label htmlFor="r1" className="text-xs cursor-pointer">High</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="medium" id="r2" />
                      <label htmlFor="r2" className="text-xs cursor-pointer">Medium</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="low" id="r3" />
                      <label htmlFor="r3" className="text-xs cursor-pointer">Low</label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold">Citizen PIN / OTP Verification</label>
                  <OTPInput value={otpValue} onChange={setOtpValue} />
                </div>
              </div>

              <div className="pt-2">
                <FileUpload
                  label="Proposal Attachment"
                  description="Upload project proposal PDF, CAD models, or field photographs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Tabs & Filterable Views */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight">6. Tabs & Categorized Views</h2>
            <p className="text-xs text-muted-foreground">
              Tabbed navigation for switching between domains, proposals, and verified challenges.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="grid grid-cols-4 w-full sm:w-[420px]">
                  <TabsTrigger value="all">All Directives</TabsTrigger>
                  <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
                  <TabsTrigger value="energy">Clean Energy</TabsTrigger>
                  <TabsTrigger value="health">Healthcare</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5 text-xs">
                  <Filter className="size-3.5" />
                  <span>Filter</span>
                </Button>
              </div>

              <TabsContent value="all" className="mt-4 text-xs text-muted-foreground">
                Showing all 1,248 active societal directives across Jharkhand districts.
              </TabsContent>
              <TabsContent value="agriculture" className="mt-4 text-xs text-muted-foreground">
                Showing 412 agricultural IoT & irrigation challenges.
              </TabsContent>
              <TabsContent value="energy" className="mt-4 text-xs text-muted-foreground">
                Showing 280 rural electrification & solar mini-grid initiatives.
              </TabsContent>
              <TabsContent value="health" className="mt-4 text-xs text-muted-foreground">
                Showing 198 tribal healthcare access & telemedicine proposals.
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* SECTION 7: Cards & Metric Displays */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight">7. Card & Metric System</h2>
            <p className="text-xs text-muted-foreground">
              Standard cards, stat cards with trend metrics, and specialized domain cards.
            </p>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Reported Problems"
              value="1,248"
              trend={{ value: "+14.2%", direction: "up", label: "vs last month" }}
              icon={FileQuestion}
              variant="default"
            />
            <StatCard
              title="Active Prototypes"
              value="342"
              trend={{ value: "+8.5%", direction: "up", label: "solutions underway" }}
              icon={Lightbulb}
              variant="lime"
            />
            <StatCard
              title="CSR Capital Pledged"
              value="₹4.8 Cr"
              trend={{ value: "+22.0%", direction: "up", label: "industry grants" }}
              icon={Building2}
              variant="teal"
            />
            <StatCard
              title="Govt Directives"
              value="89"
              trend={{ value: "100%", direction: "neutral", label: "district coverage" }}
              icon={Landmark}
              variant="charcoal"
            />
          </div>

          {/* Specialized Domain Card Examples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Problem Card Example */}
            <Card className="hover:shadow-md transition-shadow border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <StatusBadge status="verified" size="sm" />
                  <span className="text-[10px] font-mono text-muted-foreground">ID: PRB-8902</span>
                </div>
                <CardTitle className="text-base font-bold mt-2 leading-snug">
                  Smart Solar Irrigation for Drought-Prone Palamu
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  Groundwater depletion in Daltonganj requires IoT-based telemetry and automated drip scheduling for smallholder farmers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-lime-600" />
                    Palamu District
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    4 Student Teams
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">Agriculture</Badge>
                  <Badge variant="secondary" className="text-[10px]">IoT</Badge>
                  <Badge variant="secondary" className="text-[10px]">Solar</Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-border mt-3 py-3 flex justify-between items-center">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  ₹2.5L CSR Sponsored
                </span>
                <Button size="xs" variant="outline">
                  View Brief
                </Button>
              </CardFooter>
            </Card>

            {/* University Innovation Project Card */}
            <Card className="hover:shadow-md transition-shadow border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <StatusBadge status="in_progress" size="sm" />
                  <span className="text-[10px] font-mono text-muted-foreground">BIT Mesra</span>
                </div>
                <CardTitle className="text-base font-bold mt-2 leading-snug">
                  AI Road Quality Assessment Rover
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  Computer vision rover mapping potholes and structural wear along Ranchi-Jamshedpur national highway corridors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Development Milestone</span>
                    <span className="font-bold">68%</span>
                  </div>
                  <Progress value={68} className="h-1.5" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Avatar className="size-6 border">
                    <AvatarFallback className="text-[10px]">DR</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-muted-foreground">
                    Prof. D. Roy (Lead Mentor)
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-border mt-3 py-3 flex justify-between items-center">
                <StatusBadge status="government_approved" size="sm" showIcon={false} />
                <Button size="xs" variant="default">
                  Inspect Rover
                </Button>
              </CardFooter>
            </Card>

            {/* Feature / Announcement Card */}
            <Card className="bg-slate-950 text-white border-slate-800 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-lime-500/10 blur-2xl pointer-events-none" />
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit text-[10px] border-lime-400/40 text-lime-400">
                  Govt Hackathon 2026
                </Badge>
                <CardTitle className="text-base font-bold mt-2 text-white">
                  Statewide Innovation Grant Cycle Open
                </CardTitle>
                <CardDescription className="text-xs text-slate-300">
                  Applications accepted from student teams across all 24 districts for high-impact civic prototypes.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-slate-300">
                <p className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-lime-400" />
                  Grant Deadline: 30 September 2026
                </p>
                <p className="flex items-center gap-2">
                  <Award className="size-3.5 text-teal-400" />
                  ₹50 Lakhs Total Seed Corpus
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button size="sm" variant="default" className="w-full bg-lime-500 text-slate-950 hover:bg-lime-400 font-bold">
                  <span>Download Guidelines</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* SECTION 8: Navigation System Showcase */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight">8. Navigation System (Public & Dashboard)</h2>
            <p className="text-xs text-muted-foreground">
              Responsive Public Navbar and Collapsible Institutional Dashboard Sidebar.
            </p>
          </div>

          {/* Public Navbar Preview Box */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Public Navbar Preview</p>
            <div className="rounded-xl border border-border overflow-hidden bg-background shadow-xs">
              <PublicNavbar
                onSearchClick={() => toast.info("Search modal triggered")}
                onLoginClick={() => toast.info("Login flow triggered")}
                onRegisterClick={() => toast.info("Register flow triggered")}
              />
            </div>
          </div>

          {/* Dashboard Sidebar Preview Box */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-muted-foreground">Dashboard Sidebar Preview</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-[400px] rounded-xl border border-border overflow-hidden shadow-xs">
                <DashboardSidebar
                  className="h-full w-full"
                  onLogout={() => toast.info("Logout triggered")}
                />
              </div>

              {/* Data Table & Progress Rings */}
              <div className="md:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">Stakeholder Activity Matrix</h3>
                  <div className="flex items-center gap-2">
                    <ProgressRing value={84} size={42} strokeWidth={4} variant="lime" />
                    <div className="text-[11px]">
                      <p className="font-bold leading-none">84% Verification</p>
                      <p className="text-muted-foreground text-[10px]">District Nodal SLA</p>
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Stakeholder</TableHead>
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Proposals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-xs">BIT Mesra</TableCell>
                      <TableCell className="text-xs text-muted-foreground">University</TableCell>
                      <TableCell><StatusBadge status="verified" size="sm" /></TableCell>
                      <TableCell className="text-xs text-right font-mono font-bold">18</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-xs">Tata Steel CSR</TableCell>
                      <TableCell className="text-xs text-muted-foreground">Industry</TableCell>
                      <TableCell><StatusBadge status="industry_sponsored" size="sm" /></TableCell>
                      <TableCell className="text-xs text-right font-mono font-bold">12</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-xs">Ranchi Municipal Corp</TableCell>
                      <TableCell className="text-xs text-muted-foreground">Government</TableCell>
                      <TableCell><StatusBadge status="government_approved" size="sm" /></TableCell>
                      <TableCell className="text-xs text-right font-mono font-bold">24</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: Activity Timeline & Map Placeholder */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight">9. Timeline & Map Integration Container</h2>
            <p className="text-xs text-muted-foreground">
              Audit trails, project workflow histories, and GIS mapping container placeholders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>Innovation Lifecycle History</span>
                <Badge variant="outline" className="text-[10px]">Palamu Pilot</Badge>
              </h3>
              <Timeline items={sampleTimeline} />
            </div>

            {/* Map Placeholder */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Geographic Problem Mapping</h3>
                <span className="text-[11px] text-muted-foreground font-mono">GeoJSON Ready</span>
              </div>
              <MapPlaceholder
                height="320px"
                locationName="Ranchi Collectorate"
                district="Ranchi • 23.3441° N, 85.3096° E"
              />
            </div>
          </div>
        </section>

        {/* SECTION 10: Feedback & State Fallbacks */}
        <section className="space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-lg font-bold tracking-tight">10. Empty, Loading & Error States</h2>
            <p className="text-xs text-muted-foreground">
              Consistent state feedback primitives for graceful data lifecycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loading Skeletons */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase text-muted-foreground">Loading Skeleton</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-20 rounded-md" />
                  <Skeleton className="h-7 w-24 rounded-md" />
                </div>
              </div>
            </div>

            {/* Empty State */}
            <EmptyState
              title="No Solutions Submitted Yet"
              description="Be the first student or university faculty to propose a solution for this challenge."
              actionLabel="Submit Proposal"
              onAction={() => toast.info("Action triggered")}
            />

            {/* Error State */}
            <ErrorState
              title="Failed to Load Directives"
              message="Could not connect to the state problem directory. Check your connection or retry."
              onRetry={() => toast.success("Refreshed successfully")}
            />
          </div>
        </section>
      </main>

      {/* Confirmation Dialog Component Test */}
      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Approve Problem for Statewide Hackathon?"
        description="This action will validate the problem statement and publish it to all 24 district university portals for student proposals."
        confirmLabel="Approve & Publish"
        cancelLabel="Keep in Review"
        variant="info"
        onConfirm={() => {
          setDialogOpen(false)
          toast.success("Problem approved and published statewide!")
        }}
      />
    </div>
  )
}
