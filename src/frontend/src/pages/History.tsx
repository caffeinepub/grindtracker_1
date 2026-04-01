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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { getCategoryColor, getPriorityColor } from "../hooks/useGrindStore";
import type {
  Category,
  GrindStore,
  PresetTask,
  Priority,
  RepeatType,
  Task,
} from "../hooks/useGrindStore";

interface HistoryProps {
  store: GrindStore;
  today: string;
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onAddPresetTask: (preset: Omit<PresetTask, "id">) => void;
  onDeletePresetTask: (id: string) => void;
}

function formatDateLabel(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function PresetForm({
  onSave,
  onClose,
}: {
  onSave: (preset: Omit<PresetTask, "id">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Work");
  const [priority, setPriority] = useState<Priority>("medium");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [repeatType, setRepeatType] = useState<RepeatType>("none");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      category,
      priority,
      estimatedMinutes,
      repeatType,
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        data-ocid="history.preset.modal"
        className="bg-card border-border max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display">New Preset Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="preset-title">Title</Label>
            <Input
              id="preset-title"
              data-ocid="history.preset.input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning workout, Read 30 mins..."
              className="bg-muted/40"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as Category)}
              >
                <SelectTrigger
                  data-ocid="history.preset.select"
                  className="bg-muted/40"
                >
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
                <SelectTrigger
                  data-ocid="history.preset.select"
                  className="bg-muted/40"
                >
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
              <Label htmlFor="preset-mins">Est. Minutes</Label>
              <Input
                id="preset-mins"
                data-ocid="history.preset.input"
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
                <SelectTrigger
                  data-ocid="history.preset.select"
                  className="bg-muted/40"
                >
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
            data-ocid="history.preset.cancel_button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            data-ocid="history.preset.submit_button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-blue text-primary-foreground hover:bg-blue/90"
          >
            Save Preset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function History({
  store,
  today,
  onAddTask,
  onAddPresetTask,
  onDeletePresetTask,
}: HistoryProps) {
  const [showPresetForm, setShowPresetForm] = useState(false);

  const presets = store.presetTasks || [];
  const completedTasks = [...store.tasks]
    .filter((t) => t.isCompleted)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Group by date
  const grouped: Record<string, Task[]> = {};
  for (const t of completedTasks) {
    if (!grouped[t.date]) grouped[t.date] = [];
    grouped[t.date].push(t);
  }
  const groupDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const handleAddToToday = (preset: PresetTask) => {
    onAddTask({
      title: preset.title,
      category: preset.category,
      priority: preset.priority,
      estimatedMinutes: preset.estimatedMinutes,
      isCompleted: false,
      repeatType: preset.repeatType,
      date: today,
    });
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue" />
          History
        </h1>
        <p className="text-sm text-muted-foreground">
          Preset templates and completed task log
        </p>
      </div>

      <Tabs defaultValue="presets">
        <TabsList data-ocid="history.tab" className="w-full">
          <TabsTrigger value="presets" className="flex-1">
            Presets
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completed History
          </TabsTrigger>
        </TabsList>

        {/* PRESETS TAB */}
        <TabsContent value="presets" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button
              data-ocid="history.preset.open_modal_button"
              size="sm"
              onClick={() => setShowPresetForm(true)}
              className="bg-blue text-primary-foreground hover:bg-blue/90 rounded-full"
            >
              <Plus className="w-4 h-4 mr-1" /> New Preset
            </Button>
          </div>

          {presets.length === 0 ? (
            <motion.div
              data-ocid="history.presets.empty_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-surface rounded-xl p-10 text-center"
            >
              <div className="text-4xl mb-3">📋</div>
              <p className="font-semibold text-foreground">No presets yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Save task templates to quickly add them to your day.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {presets.map((preset, i) => (
                <motion.div
                  key={preset.id}
                  data-ocid={`history.preset.item.${i + 1}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className="card-surface rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {preset.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(preset.category)}`}
                      >
                        {preset.category}
                      </span>
                      <span
                        className={`text-xs font-semibold ${getPriorityColor(preset.priority)}`}
                      >
                        {preset.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {preset.estimatedMinutes}m
                      </span>
                      {preset.repeatType !== "none" && (
                        <span className="text-xs text-muted-foreground capitalize">
                          {preset.repeatType}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    data-ocid={`history.preset.secondary_button.${i + 1}`}
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddToToday(preset)}
                    className="shrink-0 text-blue border-blue/30 hover:bg-blue/10 text-xs"
                  >
                    ▶ Today
                  </Button>
                  <button
                    type="button"
                    data-ocid={`history.preset.delete_button.${i + 1}`}
                    onClick={() => onDeletePresetTask(preset.id)}
                    className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-red hover:bg-red/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </TabsContent>

        {/* COMPLETED HISTORY TAB */}
        <TabsContent value="completed" className="mt-4 space-y-4">
          {completedTasks.length === 0 ? (
            <motion.div
              data-ocid="history.completed.empty_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-surface rounded-xl p-10 text-center"
            >
              <div className="text-4xl mb-3">✅</div>
              <p className="font-semibold text-foreground">
                No completed tasks yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete tasks and they'll appear here.
              </p>
            </motion.div>
          ) : (
            groupDates.map((date) => (
              <div key={date}>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                  {formatDateLabel(date)}
                </h3>
                <div className="space-y-2">
                  {grouped[date].map((task, i) => (
                    <motion.div
                      key={task.id}
                      data-ocid={`history.completed.item.${i + 1}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="card-surface rounded-xl p-3 flex items-center gap-3"
                    >
                      <span className="text-green text-lg">✓</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate line-through opacity-70">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(task.category)}`}
                          >
                            {task.category}
                          </span>
                          <span
                            className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {task.estimatedMinutes}m
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {showPresetForm && (
        <PresetForm
          onSave={onAddPresetTask}
          onClose={() => setShowPresetForm(false)}
        />
      )}
    </div>
  );
}
