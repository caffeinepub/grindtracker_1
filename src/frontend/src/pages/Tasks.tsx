import { Button } from "@/components/ui/button";
import { Edit2, Flame, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { TaskModal } from "../components/TaskModal";
import { getCategoryColor, getPriorityColor } from "../hooks/useGrindStore";
import type { GrindStore, Task } from "../hooks/useGrindStore";

interface TasksProps {
  store: GrindStore;
  today: string;
  todayTasks: Task[];
  dailyScore: number;
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

type Filter = "today" | "all";

export function Tasks({
  store,
  today,
  todayTasks,
  dailyScore,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
}: TasksProps) {
  const [filter, setFilter] = useState<Filter>("today");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();

  const tasks = filter === "today" ? todayTasks : store.tasks;
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Task, "id" | "createdAt">) => {
    if (editTask) {
      onUpdateTask(editTask.id, data);
    } else {
      onAddTask(data);
    }
    setEditTask(undefined);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground">
            {completedCount} / {tasks.length} completed
          </p>
        </div>
        <Button
          data-ocid="tasks.add_button"
          onClick={() => {
            setEditTask(undefined);
            setModalOpen(true);
          }}
          className="bg-blue text-primary-foreground hover:bg-blue/90 rounded-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Task
        </Button>
      </div>

      {/* Score bar */}
      <div className="card-surface rounded-xl p-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-blue" />
          <span className="text-sm font-semibold text-blue">{dailyScore}%</span>
          <span className="text-xs text-muted-foreground">today</span>
        </div>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${dailyScore}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {dailyScore >= 70 ? "Streak ✓" : `${70 - dailyScore}% to streak`}
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["today", "all"] as Filter[]).map((f) => (
          <button
            type="button"
            key={f}
            data-ocid="tasks.filter.tab"
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-blue text-primary-foreground"
                : "bg-muted/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "today" ? "Today" : "All Tasks"}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div
          className="card-surface rounded-xl p-10 text-center"
          data-ocid="tasks.empty_state"
        >
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-display font-semibold text-foreground mb-2">
            No tasks yet
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Add your first task to start tracking your day.
          </p>
          <Button
            data-ocid="tasks.empty_state.add_button"
            onClick={() => setModalOpen(true)}
            className="bg-blue text-primary-foreground hover:bg-blue/90"
          >
            <Plus className="w-4 h-4 mr-1" /> Add First Task
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                data-ocid={`tasks.item.${i + 1}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="card-surface rounded-xl p-4 shadow-card flex items-center gap-3 group"
              >
                <button
                  type="button"
                  data-ocid={`tasks.checkbox.${i + 1}`}
                  onClick={() => onToggleTask(task.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                    task.isCompleted
                      ? "bg-blue border-blue"
                      : "border-border hover:border-blue/50"
                  }`}
                >
                  {task.isCompleted && (
                    <span className="text-primary-foreground text-xs">✓</span>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      task.isCompleted
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${getCategoryColor(task.category)}`}
                    >
                      {task.category}
                    </span>
                    <span
                      className={`text-xs font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {task.estimatedMinutes}m
                    </span>
                    {task.repeatType !== "none" && (
                      <span className="text-xs text-teal">
                        ↻ {task.repeatType}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    data-ocid={`tasks.edit_button.${i + 1}`}
                    onClick={() => handleEdit(task)}
                    className="w-7 h-7 rounded-md bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`tasks.delete_button.${i + 1}`}
                    onClick={() => onDeleteTask(task.id)}
                    className="w-7 h-7 rounded-md bg-red/10 flex items-center justify-center text-red hover:bg-red/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTask(undefined);
        }}
        onSave={handleSave}
        task={editTask}
        defaultDate={today}
      />
    </div>
  );
}
