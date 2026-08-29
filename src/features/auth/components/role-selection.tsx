"use client"

import * as React from "react"
import { Users, GraduationCap, Building2, Landmark, Check, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserRole } from "@/services/auth/auth-types"
import { ROLE_CARD_DEFINITIONS } from "@/data/auth-data"

export interface RoleSelectionProps {
  selectedRole: UserRole | null
  onSelectRole: (role: UserRole) => void
  onContinue: () => void
}

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  citizen: Users,
  student: GraduationCap,
  university: Landmark,
  industry: Building2,
}

export function RoleSelection({
  selectedRole,
  onSelectRole,
  onContinue,
}: RoleSelectionProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">
          How will you participate?
        </h2>
        <p className="text-xs text-muted-foreground">
          Select the category that best describes your involvement in the innovation portal.
        </p>
      </div>

      {/* 4 Role Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {ROLE_CARD_DEFINITIONS.map((card) => {
          const Icon = ROLE_ICONS[card.role] || Users
          const isSelected = selectedRole === card.role

          return (
            <div
              key={card.role}
              onClick={() => onSelectRole(card.role)}
              className={cn(
                "group relative flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer select-none",
                isSelected
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    )}
                  >
                    <Icon className="size-4.5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-[9px] font-mono px-1.5 py-0 border-border text-muted-foreground"
                    >
                      {card.verificationType}
                    </Badge>
                    {isSelected && (
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </p>
                  <p className="text-[11px] font-semibold text-lime-700 dark:text-lime-400">
                    {card.tagline}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Continue Action */}
      <Button
        size="lg"
        onClick={onContinue}
        disabled={!selectedRole}
        className="w-full text-xs font-bold gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <span>Continue to Registration</span>
        <ArrowRight className="size-3.5" />
      </Button>
    </div>
  )
}