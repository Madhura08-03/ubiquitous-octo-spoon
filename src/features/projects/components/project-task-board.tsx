"use client"

import * as React from "react"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Calendar,
  User,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { StudentProject, TaskPriority, TaskStatus } from "@/services/projects/project-types"
import { projectService } from "@/services/projects/project-service"

interface ProjectTaskBoardProps {
  project: StudentProject
  onProjectUpdated?: () => void
  currentUserName?: string
}

export function ProjectTaskBoard({
  project,
  onProjectUpdated,
  currentUserName = "Priya Sharma",
}: ProjectTaskBoardProps) {
  const tasks = project.tasks || []
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form State
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [assignedStudentId, setAssignedStudentId] = React.useState(
    project.studentParticipants[0]?.studentId || "stu_001"
  )
  const [priority, setPriority] = React.useState<TaskPriority>("medium")
  const [dueDate, setDueDate] = React.useState("")

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await projectService.updateTaskStatus(project.id, taskId, newStatus)
      toast.success("Task status updated", {
        description: `Task moved to ${newStatus.replace("_", " ").toUpperCase()}`,
      })
      if (onProjectUpdated) onProjectUpdated()
    } catch {
      toast.error("Failed to update task status")
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter a task title")
      return
    }

    const assignedStudent = project.studentParticipants.find((s) => s.studentId === assignedStudentId)

    setIsSubmitting(true)
    try {
      await projectService.addProjectTask(project.id, {
        title: title.trim(),
        description: description.trim(),
        assignedStudentId,
        assignedStudentName: assignedStudent?.name || currentUserName,
        priority,
        dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      })

      toast.success("Task Created", {
        description: `Assigned "${title}" to ${assignedStudent?.name || currentUserName}`,
      })

      setTitle("")
      setDescription("")
      setDueDate("")
      setIsAddModalOpen(false)
      if (onProjectUpdated) onProjectUpdated()
    } catch {
      toast.error("Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress")
  const blockedTasks = tasks.filter((t) => t.status === "blocked")
  const completedTasks = tasks.filter((t) => t.status === "completed")

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case "critical":
        return <Badge variant="outline" className="border-rose-500/40 text-rose-800 dark:text-rose-300 text-[10px] font-bold">CRITICAL</Badge>
      case "high":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold">HIGH</Badge>
      case "medium":
        return <Badge variant="outline" className="border-blue-500/40 text-blue-800 dark:text-blue-300 text-[10px] font-bold">MEDIUM</Badge>
      default:
        return <Badge variant="outline" className="text-muted-foreground text-[10px]">LOW</Badge>
    }
  }

  return (
    <div className="space-y-6 text-left">
      {/* Board Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <span>Project Tasks & Action Items</span>
            <Badge variant="secondary" className="text-xs font-mono">
              {tasks.length} Total
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground">
            Coordinate team deliverables, hardware assembly, coding milestones, and field tests.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          size="sm"
          className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-xs shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Add Task</span>
        </Button>
      </div>

      {/* Kanban Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. To Do Column */}
        <div className="flex flex-col rounded-2xl border border-border bg-muted/20 p-3.5 space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="size-3.5 text-slate-500" />
              <span>To Do ({todoTasks.length})</span>
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {todoTasks.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No to-do tasks
              </div>
            ) : (
              todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border border-border bg-card shadow-xs space-y-2.5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-foreground line-clamp-2">{task.title}</h4>
                    {getPriorityBadge(task.priority)}
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{task.description}</p>
                  )}

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="size-3 text-primary" />
                      <span className="truncate max-w-[90px]">{task.assignedStudentName}</span>
                    </span>

                    {task.dueDate && (
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="size-3" />
                        <span>{task.dueDate}</span>
                      </span>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(task.id, "in_progress")}
                      className="text-[10px] h-6 px-2 text-primary hover:bg-primary/10 gap-1 font-semibold"
                    >
                      <span>Start Task</span>
                      <ArrowRight className="size-2.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. In Progress Column */}
        <div className="flex flex-col rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3.5 space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-blue-500 animate-spin" />
              <span>In Progress ({inProgressTasks.length})</span>
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {inProgressTasks.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No active tasks
              </div>
            ) : (
              inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border border-blue-500/30 bg-card shadow-xs space-y-2.5 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-foreground line-clamp-2">{task.title}</h4>
                    {getPriorityBadge(task.priority)}
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{task.description}</p>
                  )}

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="size-3 text-blue-500" />
                      <span className="truncate max-w-[90px]">{task.assignedStudentName}</span>
                    </span>

                    {task.dueDate && (
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="size-3" />
                        <span>{task.dueDate}</span>
                      </span>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(task.id, "blocked")}
                      className="text-[10px] h-6 px-1.5 text-amber-600 hover:bg-amber-500/10 font-semibold"
                    >
                      Mark Blocked
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusChange(task.id, "completed")}
                      className="text-[10px] h-6 px-2 bg-emerald-600 hover:bg-emerald-500 text-white gap-1 font-semibold"
                    >
                      <Check className="size-2.5" />
                      <span>Complete</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Blocked Column */}
        <div className="flex flex-col rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="size-3.5 text-amber-500" />
              <span>Blocked ({blockedTasks.length})</span>
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {blockedTasks.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No blocked tasks
              </div>
            ) : (
              blockedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border border-amber-500/30 bg-card shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-foreground line-clamp-2">{task.title}</h4>
                    {getPriorityBadge(task.priority)}
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{task.description}</p>
                  )}

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="size-3 text-amber-500" />
                      <span className="truncate max-w-[90px]">{task.assignedStudentName}</span>
                    </span>

                    {task.dueDate && (
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="size-3" />
                        <span>{task.dueDate}</span>
                      </span>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(task.id, "in_progress")}
                      className="text-[10px] h-6 px-2 text-primary border-primary/30 hover:bg-primary/10 gap-1 font-semibold"
                    >
                      <RotateCcw className="size-2.5" />
                      <span>Unblock & Resume</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Completed Column */}
        <div className="flex flex-col rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Completed ({completedTasks.length})</span>
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {completedTasks.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No completed tasks yet
              </div>
            ) : (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border border-emerald-500/20 bg-card shadow-xs space-y-2 opacity-85 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-foreground line-through line-clamp-2">{task.title}</h4>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 text-[9px]">DONE</Badge>
                  </div>

                  <div className="pt-1.5 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="truncate max-w-[100px]">{task.assignedStudentName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusChange(task.id, "todo")}
                      className="text-[9px] h-5 px-1.5 text-muted-foreground hover:text-foreground"
                    >
                      Reopen
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md text-left">
          <form onSubmit={handleAddTask}>
            <DialogHeader className="border-b border-border pb-3">
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                Add New Project Task
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Assign a deliverable or action item to a student team member.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Task Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fabricate telemetry circuit shield PCB"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical specifications, lab requirements, or acceptance criteria..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Assignee *
                  </label>
                  <select
                    value={assignedStudentId}
                    onChange={(e) => setAssignedStudentId(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {project.studentParticipants.map((s) => (
                      <option key={s.studentId} value={s.studentId}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Priority *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Target Due Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                isLoading={isSubmitting}
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
