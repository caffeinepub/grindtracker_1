import { useCallback, useEffect, useState } from "react";

export type Category = "Work" | "Health" | "Personal" | "Learning" | "Fitness";
export type Priority = "low" | "medium" | "high";
export type RepeatType = "none" | "daily" | "weekly";

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  estimatedMinutes: number;
  isCompleted: boolean;
  repeatType: RepeatType;
  date: string;
  createdAt: string;
}

export interface PresetTask {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  estimatedMinutes: number;
  repeatType: RepeatType;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  weeklyScore: number;
  streak: number;
  rank: RankTier;
  isOnline: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  weeklyScore: number;
  streak: number;
  rank: RankTier;
  tasksCompleted: number;
  isCurrentUser?: boolean;
  isFriend?: boolean;
}

export type RankTier =
  | "Rookie"
  | "Apprentice"
  | "Grinder"
  | "Hustler"
  | "Consistent"
  | "Disciplined"
  | "Warrior"
  | "Champion"
  | "Legend"
  | "Elite";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface DayScore {
  date: string;
  score: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  joinedAt: string;
  totalTasksCompleted: number;
  longestStreak: number;
}

export interface GrindStore {
  profile: UserProfile;
  tasks: Task[];
  presetTasks: PresetTask[];
  friends: Friend[];
  leaderboard: LeaderboardUser[];
  dayScores: DayScore[];
  badges: Badge[];
  currentStreak: number;
  longestStreak: number;
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getPastDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

export function getRank(weeklyScore: number): RankTier {
  if (weeklyScore >= 91) return "Elite";
  if (weeklyScore >= 81) return "Legend";
  if (weeklyScore >= 71) return "Champion";
  if (weeklyScore >= 61) return "Warrior";
  if (weeklyScore >= 51) return "Disciplined";
  if (weeklyScore >= 41) return "Consistent";
  if (weeklyScore >= 31) return "Hustler";
  if (weeklyScore >= 21) return "Grinder";
  if (weeklyScore >= 11) return "Apprentice";
  return "Rookie";
}

export function getRankIcon(rank: RankTier): string {
  const icons: Record<RankTier, string> = {
    Rookie: "🌱",
    Apprentice: "📚",
    Grinder: "⚡",
    Hustler: "💼",
    Consistent: "🎯",
    Disciplined: "🛡️",
    Warrior: "⚔️",
    Champion: "🏆",
    Legend: "🦅",
    Elite: "👑",
  };
  return icons[rank];
}

export function getRankColor(rank: RankTier): string {
  switch (rank) {
    case "Elite":
      return "text-gold";
    case "Legend":
      return "text-gold";
    case "Champion":
      return "text-purple";
    case "Warrior":
      return "text-purple";
    case "Disciplined":
      return "text-teal";
    case "Consistent":
      return "text-teal";
    case "Hustler":
      return "text-blue";
    case "Grinder":
      return "text-blue";
    case "Apprentice":
      return "text-bronze";
    default:
      return "text-muted-foreground";
  }
}

export function getRankBg(rank: RankTier): string {
  switch (rank) {
    case "Elite":
      return "bg-gold/20 text-gold border border-gold/30";
    case "Legend":
      return "bg-gold/15 text-gold border border-gold/25";
    case "Champion":
      return "bg-purple/20 text-purple border border-purple/30";
    case "Warrior":
      return "bg-purple/15 text-purple border border-purple/25";
    case "Disciplined":
      return "bg-teal/20 text-teal border border-teal/30";
    case "Consistent":
      return "bg-teal/15 text-teal border border-teal/20";
    case "Hustler":
      return "bg-blue/20 text-blue border border-blue/30";
    case "Grinder":
      return "bg-blue/15 text-blue border border-blue/25";
    case "Apprentice":
      return "bg-bronze/15 text-bronze border border-bronze/25";
    default:
      return "bg-muted/40 text-muted-foreground border border-border";
  }
}

export function getCategoryColor(cat: Category): string {
  switch (cat) {
    case "Work":
      return "bg-teal/20 text-teal";
    case "Health":
      return "bg-green/20 text-green";
    case "Personal":
      return "bg-purple/20 text-purple";
    case "Learning":
      return "bg-blue/15 text-blue";
    case "Fitness":
      return "bg-red/20 text-red";
  }
}

export function getPriorityColor(p: Priority): string {
  switch (p) {
    case "high":
      return "text-red";
    case "medium":
      return "text-blue";
    case "low":
      return "text-green";
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function buildEmptyStore(userId: string): GrindStore {
  const today = getTodayStr();

  const dayScores: DayScore[] = Array.from({ length: 7 }, (_, i) => ({
    date: getPastDateStr(6 - i),
    score: 0,
  }));

  const leaderboard: LeaderboardUser[] = [
    {
      id: "current",
      name: "",
      avatar: "?",
      weeklyScore: 0,
      streak: 0,
      rank: "Rookie",
      tasksCompleted: 0,
      isCurrentUser: true,
    },
  ];

  const badges: Badge[] = [
    {
      id: "first_task",
      name: "First Task",
      description: "Completed your first task",
      icon: "🏁",
      earned: false,
    },
    {
      id: "week_warrior",
      name: "Week Warrior",
      description: "7-day streak",
      icon: "🔥",
      earned: false,
    },
    {
      id: "month_strong",
      name: "Month Strong",
      description: "30-day streak",
      icon: "💪",
      earned: false,
    },
    {
      id: "elite",
      name: "Elite",
      description: "Reached Elite rank",
      icon: "👑",
      earned: false,
    },
    {
      id: "century",
      name: "Century",
      description: "Completed 100 tasks",
      icon: "💯",
      earned: false,
    },
    {
      id: "consistent_badge",
      name: "Consistent",
      description: "14-day streak",
      icon: "⚡",
      earned: false,
    },
    {
      id: "three_day",
      name: "On a Roll",
      description: "3-day streak",
      icon: "🎯",
      earned: false,
    },
    {
      id: "five_day",
      name: "High Five",
      description: "5-day streak",
      icon: "✋",
      earned: false,
    },
    {
      id: "ten_tasks",
      name: "Getting Started",
      description: "Completed 10 tasks",
      icon: "🚀",
      earned: false,
    },
    {
      id: "fifty_tasks",
      name: "Task Machine",
      description: "Completed 50 tasks",
      icon: "⚙️",
      earned: false,
    },
    {
      id: "two_hundred_tasks",
      name: "Unstoppable",
      description: "Completed 200 tasks",
      icon: "🌊",
      earned: false,
    },
    {
      id: "five_hundred_tasks",
      name: "Legend",
      description: "Completed 500 tasks",
      icon: "🦁",
      earned: false,
    },
    {
      id: "perfect_day",
      name: "Perfect Day",
      description: "Score 100 in a day",
      icon: "✨",
      earned: false,
    },
    {
      id: "social_butterfly",
      name: "Social",
      description: "Added your first friend",
      icon: "🤝",
      earned: false,
    },
    {
      id: "invite_sent",
      name: "Recruiter",
      description: "Shared your invite link",
      icon: "📨",
      earned: false,
    },
  ];

  return {
    profile: {
      id: userId || "me",
      name: "",
      avatar: "?",
      joinedAt: today,
      totalTasksCompleted: 0,
      longestStreak: 0,
    },
    tasks: [],
    presetTasks: [],
    friends: [],
    leaderboard,
    dayScores,
    badges,
    currentStreak: 0,
    longestStreak: 0,
  };
}

function getStorageKey(userId: string): string {
  return `grindtracker_${userId || "default"}`;
}

function loadStore(userId: string): GrindStore {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as GrindStore;
      // Ensure new fields exist for existing users
      if (!parsed.presetTasks) parsed.presetTasks = [];
      return parsed;
    }
  } catch {
    // ignore
  }
  return buildEmptyStore(userId);
}

function saveStore(store: GrindStore, userId: string): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function useGrindStore(userId?: string) {
  const resolvedUserId = userId || "default";
  const [store, setStore] = useState<GrindStore>(() =>
    loadStore(resolvedUserId),
  );

  useEffect(() => {
    setStore(loadStore(resolvedUserId));
  }, [resolvedUserId]);

  useEffect(() => {
    saveStore(store, resolvedUserId);
  }, [store, resolvedUserId]);

  const updateStore = useCallback(
    (updater: (prev: GrindStore) => GrindStore) => {
      setStore((prev) => updater(prev));
    },
    [],
  );

  const updateProfileName = useCallback(
    (name: string) => {
      const avatar = getInitials(name) || "?";
      updateStore((prev) => ({
        ...prev,
        profile: { ...prev.profile, name, avatar },
        leaderboard: prev.leaderboard.map((u) =>
          u.id === "current" ? { ...u, name, avatar } : u,
        ),
      }));
    },
    [updateStore],
  );

  const today = getTodayStr();
  const todayTasks = store.tasks.filter((t) => t.date === today);
  const completedToday = todayTasks.filter((t) => t.isCompleted).length;
  const dailyScore =
    todayTasks.length > 0
      ? Math.round((completedToday / todayTasks.length) * 100)
      : 0;
  const weeklyScore =
    store.dayScores.length > 0
      ? Math.round(
          store.dayScores.reduce((sum, d) => sum + d.score, 0) /
            store.dayScores.length,
        )
      : 0;
  const currentRank = getRank(weeklyScore);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt">) => {
      updateStore((prev) => ({
        ...prev,
        tasks: [
          ...prev.tasks,
          { ...task, id: generateId(), createdAt: getTodayStr() },
        ],
      }));
    },
    [updateStore],
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      updateStore((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
    },
    [updateStore],
  );

  const deleteTask = useCallback(
    (id: string) => {
      updateStore((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== id),
      }));
    },
    [updateStore],
  );

  const toggleTask = useCallback(
    (id: string) => {
      updateStore((prev) => {
        const newTasks = prev.tasks.map((t) =>
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
        );
        const todayT = newTasks.filter((t) => t.date === today);
        const completedT = todayT.filter((t) => t.isCompleted).length;
        const score =
          todayT.length > 0
            ? Math.round((completedT / todayT.length) * 100)
            : 0;
        const newDayScores = prev.dayScores.map((ds) =>
          ds.date === today ? { ...ds, score } : ds,
        );
        const hasTodayScore = prev.dayScores.some((ds) => ds.date === today);
        const dayScores = hasTodayScore
          ? newDayScores
          : [...prev.dayScores, { date: today, score }];
        return { ...prev, tasks: newTasks, dayScores };
      });
    },
    [updateStore, today],
  );

  const addPresetTask = useCallback(
    (preset: Omit<PresetTask, "id">) => {
      updateStore((prev) => ({
        ...prev,
        presetTasks: [
          ...(prev.presetTasks || []),
          { ...preset, id: generateId() },
        ],
      }));
    },
    [updateStore],
  );

  const deletePresetTask = useCallback(
    (id: string) => {
      updateStore((prev) => ({
        ...prev,
        presetTasks: (prev.presetTasks || []).filter((p) => p.id !== id),
      }));
    },
    [updateStore],
  );

  return {
    store,
    updateStore,
    updateProfileName,
    today,
    todayTasks,
    completedToday,
    dailyScore,
    weeklyScore,
    currentRank,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addPresetTask,
    deletePresetTask,
  };
}
