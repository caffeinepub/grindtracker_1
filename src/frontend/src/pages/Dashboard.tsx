import { ChevronRight, Flame, Target, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { ScoreRing } from "../components/ScoreRing";
import { WeeklyChart } from "../components/WeeklyChart";
import {
  getCategoryColor,
  getPriorityColor,
  getRankBg,
  getRankIcon,
} from "../hooks/useGrindStore";
import type { GrindStore, RankTier } from "../hooks/useGrindStore";

interface DashboardProps {
  store: GrindStore;
  todayTasks: GrindStore["tasks"];
  dailyScore: number;
  weeklyScore: number;
  currentRank: RankTier;
  onNavigate: (page: string) => void;
  onToggleTask: (id: string) => void;
}

const RANK_THRESHOLDS: Record<
  RankTier,
  { min: number; max: number; next: RankTier | null }
> = {
  Rookie: { min: 0, max: 10, next: "Apprentice" },
  Apprentice: { min: 11, max: 20, next: "Grinder" },
  Grinder: { min: 21, max: 30, next: "Hustler" },
  Hustler: { min: 31, max: 40, next: "Consistent" },
  Consistent: { min: 41, max: 50, next: "Disciplined" },
  Disciplined: { min: 51, max: 60, next: "Warrior" },
  Warrior: { min: 61, max: 70, next: "Champion" },
  Champion: { min: 71, max: 80, next: "Legend" },
  Legend: { min: 81, max: 90, next: "Elite" },
  Elite: { min: 91, max: 100, next: null },
};

export function Dashboard({
  store,
  todayTasks,
  dailyScore,
  weeklyScore,
  currentRank,
  onNavigate,
  onToggleTask,
}: DashboardProps) {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const top3 = [...store.leaderboard]
    .sort((a, b) => b.weeklyScore - a.weeklyScore)
    .slice(0, 3);
  const previewTasks = todayTasks.slice(0, 5);

  const rp = RANK_THRESHOLDS[currentRank];
  const rankPct = rp.next
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(((weeklyScore - rp.min) / (rp.max - rp.min)) * 100),
        ),
      )
    : 100;

  return (
    <div className="space-y-5 pb-20 md:pb-6 animate-fade-in">
      <div>
        <p className="text-muted-foreground text-sm">{today}</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {greeting()},{" "}
          <span className="text-blue">{store.profile.name.split(" ")[0]}</span>{" "}
          👋
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-surface rounded-xl p-5 shadow-card flex flex-col items-center gap-4 md:col-span-1">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-semibold text-foreground">
              Daily Score Progress
            </span>
          </div>
          <ScoreRing score={dailyScore} />
          <div className="w-full flex justify-between text-xs text-muted-foreground">
            <span>
              {todayTasks.filter((t) => t.isCompleted).length} /{" "}
              {todayTasks.length} tasks
            </span>
            <span>
              {dailyScore >= 70
                ? "✅ Streak day"
                : `Need ${70 - dailyScore}% more`}
            </span>
          </div>
        </div>

        <div className="card-surface rounded-xl p-5 shadow-card md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">
              Weekly Trend
            </span>
            <span className="text-xs text-blue font-semibold">
              avg {weeklyScore}%
            </span>
          </div>
          <WeeklyChart dayScores={store.dayScores} height={120} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div
          className="card-surface rounded-xl p-4 shadow-card flex flex-col items-center gap-1"
          data-ocid="dashboard.panel"
        >
          <Flame className="w-5 h-5 text-blue mb-0.5" />
          <span className="text-2xl font-display font-extrabold text-blue">
            {store.currentStreak}
          </span>
          <span className="text-xs text-muted-foreground">Current Streak</span>
        </div>
        <div
          className="card-surface rounded-xl p-4 shadow-card flex flex-col items-center gap-1"
          data-ocid="dashboard.panel"
        >
          <Trophy className="w-5 h-5 text-gold mb-0.5" />
          <span
            className={`text-xs font-display font-bold ${getRankBg(currentRank)} px-2 py-0.5 rounded-full`}
          >
            {getRankIcon(currentRank)} {currentRank}
          </span>
          <span className="text-xs text-muted-foreground mt-1">Rank</span>
        </div>
        <div
          className="card-surface rounded-xl p-4 shadow-card flex flex-col items-center gap-1"
          data-ocid="dashboard.panel"
        >
          <Target className="w-5 h-5 text-teal mb-0.5" />
          <span className="text-2xl font-display font-extrabold text-foreground">
            {weeklyScore}
          </span>
          <span className="text-xs text-muted-foreground">Weekly Avg</span>
        </div>
      </div>

      <div className="card-surface rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">
            {getRankIcon(currentRank)} {currentRank}
          </span>
          {rp.next && (
            <span className="text-xs text-muted-foreground">→ {rp.next}</span>
          )}
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${rankPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{rp.min}</span>
          <span>{rp.max}</span>
        </div>
      </div>

      <div className="card-surface rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">
            My Tasks
          </span>
          <button
            type="button"
            data-ocid="dashboard.tasks.link"
            onClick={() => onNavigate("tasks")}
            className="text-xs text-blue hover:text-blue/80 flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {previewTasks.length === 0 ? (
          <div
            className="text-center py-6"
            data-ocid="dashboard.tasks.empty_state"
          >
            <p className="text-muted-foreground text-sm">
              No tasks today. Add some!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {previewTasks.map((task, i) => (
              <div
                key={task.id}
                data-ocid={`dashboard.task.item.${i + 1}`}
                className="flex items-center gap-3 py-2"
              >
                <button
                  type="button"
                  data-ocid={`dashboard.task.checkbox.${i + 1}`}
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
                <span
                  className={`text-sm flex-1 ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {task.title}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${getCategoryColor(task.category)}`}
                >
                  {task.category}
                </span>
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(task.priority).replace("text-", "bg-")}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card-surface rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-foreground">
              LEADERBOARD – THIS WEEK
            </span>
          </div>
          <button
            type="button"
            data-ocid="dashboard.leaderboard.link"
            onClick={() => onNavigate("leaderboard")}
            className="text-xs text-blue hover:text-blue/80 flex items-center gap-0.5"
          >
            Full board <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {top3.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No rankings yet. Start completing tasks!
          </p>
        ) : (
          <div className="space-y-2">
            {top3.map((user, i) => {
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
              return (
                <div
                  key={user.id}
                  data-ocid={`dashboard.leaderboard.item.${i + 1}`}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    i === 0
                      ? "bg-gold/10 border border-gold/20"
                      : i === 1
                        ? "bg-muted/20 border border-border"
                        : "bg-bronze/10 border border-border"
                  }`}
                >
                  <span className="text-lg w-7 text-center">{medal}</span>
                  <div className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center text-xs font-bold text-blue">
                    {user.avatar}
                  </div>
                  <span className="flex-1 text-sm font-medium">
                    {user.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${getRankBg(user.rank)}`}
                  >
                    {user.rank}
                  </span>
                  <div className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 text-blue" />
                    <span className="text-xs font-semibold text-blue">
                      {user.weeklyScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
