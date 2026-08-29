"use client"

import * as React from "react"
import Link from "next/link"
import {
  LucideIcon,
  LayoutDashboard,
  FileQuestion,
  Lightbulb,
  GraduationCap,
  Building,
  Landmark,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface SidebarNavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
  active?: boolean
}

export interface SidebarSection {
  title?: string
  items: SidebarNavItem[]
}

export interface DashboardSidebarProps {
  sections?: SidebarSection[]
  currentPath?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
  user?: {
    name: string
    role: string
    avatarUrl?: string
    email?: string
  }
  onLogout?: () => void
  className?: string
}

const DEFAULT_SECTIONS: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { id: "dash", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
      { id: "problems", label: "Societal Problems", href: "/dashboard/problems", icon: FileQuestion, badge: "12" },
      { id: "solutions", label: "Innovations & Projects", href: "/dashboard/projects", icon: Lightbulb, badge: "4" },
    ],
  },
  {
    title: "Stakeholders",
    items: [
      { id: "univ", label: "Universities", href: "/dashboard/universities", icon: GraduationCap },
      { id: "industry", label: "Industry CSR", href: "/dashboard/industry", icon: Building },
      { id: "govt", label: "Govt Directives", href: "/dashboard/government", icon: Landmark },
    ],
  },
  {
    title: "Administration",
    items: [
      { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
]

export function DashboardSidebar({
  sections = DEFAULT_SECTIONS,
  currentPath = "/dashboard",
  collapsed = false,
  onToggleCollapse,
  user = {
    name: "Dr. Sunita Murmu",
    role: "Govt Nodal Officer",
    email: "sunita.murmu@jharkhand.gov.in",
  },
  onLogout,
  className,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed)

  const toggle = () => {
    setIsCollapsed(!isCollapsed)
    onToggleCollapse?.()
  }

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 select-none",
        isCollapsed ? "w-18" : "w-64",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-xs">
            <Shield className="size-5 text-lime-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold tracking-tight text-white truncate">
                Govt of Jharkhand
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate">
                Innovation Portal
              </span>
            </div>
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={toggle}
          className="text-slate-400 hover:text-white hover:bg-sidebar-accent"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && !isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {section.title}
              </p>
            )}

            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = item.active || currentPath === item.href

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all group",
                    isActive
                      ? "bg-sidebar-accent text-white font-semibold shadow-xs"
                      : "text-slate-300 hover:bg-sidebar-accent/60 hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4.5 shrink-0 transition-colors",
                      isActive ? "text-lime-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold",
                        isActive
                          ? "bg-lime-400/20 text-lime-300"
                          : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger render={linkContent} />
                    <TooltipContent side="right" className="bg-slate-900 text-white border-slate-800 text-xs">
                      {item.label}
                      {item.badge && ` (${item.badge})`}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={item.id}>{linkContent}</div>
            })}
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-sidebar-border bg-sidebar/50">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent/50",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Avatar className="size-8 border border-slate-700 shrink-0">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-slate-800 text-lime-400 font-bold text-xs">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex flex-col truncate flex-1 min-w-0">
              <span className="text-xs font-semibold text-white truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 truncate">{user.role}</span>
            </div>
          )}

          {!isCollapsed && onLogout && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onLogout}
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 shrink-0"
              aria-label="Log out"
            >
              <LogOut className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}