import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type {
  Category,
  Priority,
  RepeatType,
  Task,
} from "../hooks/useGrindStore";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "createdAt">) => void;
  task?: Task;
  defaultDate: string;
}

export function TaskModal({
  open,
  onClose,
  onSave,
  task,
  defaultDate,
}: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [category, setCategory] = useState<Category>(task?.category ?? "Work");
  const [priority, setPriority] = useState<Priority>(
    task?.priority ?? "medium",
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    task?.estimatedMinutes ?? 30,
  );
  const [repeatType, setRepeatType] = useState<RepeatType>(
    task?.repeatType ?? "none",
  );

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      category,
      priority,
      estimatedMinutes,
      isCompleted: task?.isCompleted ?? false,
      repeatType,
      date: task?.date ?? defaultDate,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        data-ocid="task.modal"
        className="bg-card border-border max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            {task ? "Edit Task" : "Add Task"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              data-ocid="task.input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to get done?"
              className="bg-muted/40"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as Category)}
              >
                <SelectTrigger data-ocid="task.select" className="bg-muted/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "Work",
                      "Health",
                      "Personal",
                      "Learning",
                      "Fitness",
                    ] as Category[]
                  ).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as Priority)}
              >
                <SelectTrigger data-ocid="task.select" className="bg-muted/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="est-min">Est. Minutes</Label>
              <Input
                id="est-min"
                data-ocid="task.input"
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                min={5}
                max={480}
                className="bg-muted/40"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Repeat</Label>
              <Select
                value={repeatType}
                onValueChange={(v) => setRepeatType(v as RepeatType)}
              >
                <SelectTrigger data-ocid="task.select" className="bg-muted/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            data-ocid="task.cancel_button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            data-ocid="task.submit_button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-blue text-primary-foreground hover:bg-blue/90"
          >
            {task ? "Save Changes" : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
