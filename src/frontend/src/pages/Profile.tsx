import { Input } from "@/components/ui/input";
import {
  Camera,
  Check,
  Flame,
  Pencil,
  Star,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { WeeklyChart } from "../components/WeeklyChart";
import { getRankBg, getRankIcon } from "../hooks/useGrindStore";
import type { GrindStore, RankTier } from "../hooks/useGrindStore";

const AVATAR_EMOJIS = [
  "😎",
  "🔥",
  "⚡",
  "🚀",
  "💪",
  "🏆",
  "🎯",
  "👑",
  "🦥",
  "🐉",
  "🌟",
  "📎",
  "🦁",
  "🐺",
  "🏋️",
  "🤺",
  "🧠",
  "👊",
  "🎮",
  "🌊",
  "🦊",
  "🐯",
  "🌙",
  "⭐",
];

interface ProfileProps {
  store: GrindStore;
  weeklyScore: number;
  currentRank: RankTier;
  onLogout: () => void;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (emoji: string) => void;
}

export function Profile({
  store,
  weeklyScore,
  currentRank,
  onLogout,
  onUpdateName,
  onUpdateAvatar,
}: ProfileProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const earnedBadges = store.badges.filter((b) => b.earned);

  const rankTiers: { name: RankTier; min: number; max: number }[] = [
    { name: "Rookie", min: 0, max: 10 },
    { name: "Apprentice", min: 11, max: 20 },
    { name: "Grinder", min: 21, max: 30 },
    { name: "Hustler", min: 31, max: 40 },
    { name: "Consistent", min: 41, max: 50 },
    { name: "Disciplined", min: 51, max: 60 },
    { name: "Warrior", min: 61, max: 70 },
    { name: "Champion", min: 71, max: 80 },
    { name: "Legend", min: 81, max: 90 },
    { name: "Elite", min: 91, max: 100 },
  ];

  const currentTierIdx = rankTiers.findIndex((r) => r.name === currentRank);
  const currentTier = rankTiers[currentTierIdx];
  const rankProgress = currentTier
    ? Math.round(
        ((weeklyScore - currentTier.min) /
          (currentTier.max - currentTier.min)) *
          100,
      )
    : 100;

  const joinDate = new Date(store.profile.joinedAt).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  const startEditing = () => {
    setNameInput(store.profile.name);
    setEditingName(true);
  };

  const cancelEditing = () => {
    setEditingName(false);
    setNameInput("");
  };

  const saveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length >= 2) {
      onUpdateName(trimmed);
      setEditingName(false);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveName();
    if (e.key === "Escape") cancelEditing();
  };

  const handleAvatarSelect = (emoji: string) => {
    onUpdateAvatar(emoji);
    setShowAvatarPicker(false);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6 animate-fade-in">
      {/* Profile header */}
      <div className="card-surface rounded-xl p-6 shadow-card text-center space-y-3">
        <div className="relative inline-block mx-auto" ref={avatarRef}>
          <button
            type="button"
            data-ocid="profile.avatar.button"
            onClick={() => setShowAvatarPicker((v) => !v)}
            className="w-20 h-20 rounded-full bg-blue/20 border-2 border-blue/40 flex items-center justify-center text-2xl font-bold text-blue relative group"
          >
            {store.profile.avatar}
            <span className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </span>
          </button>
          <AnimatePresence>
            {showAvatarPicker && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                data-ocid="profile.avatar.popover"
                className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-2xl p-3 shadow-2xl w-64"
              >
                <p className="text-xs text-muted-foreground text-center mb-2 font-semibold uppercase tracking-wider">
                  Pick your avatar
                </p>
                <div className="grid grid-cols-8 gap-1">
                  {AVATAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleAvatarSelect(emoji)}
                      className={`w-7 h-7 text-lg flex items-center justify-center rounded-lg hover:bg-blue/20 transition-colors ${
                        store.profile.avatar === emoji
                          ? "bg-blue/30 ring-1 ring-blue"
                          : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  data-ocid="profile.avatar.close_button"
                  onClick={() => setShowAvatarPicker(false)}
                  className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground py-1 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-1">
          {editingName ? (
            <div className="flex items-center justify-center gap-2">
              <Input
                data-ocid="profile.input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={handleNameKeyDown}
                maxLength={30}
                className="text-center font-bold text-lg max-w-[180px] bg-background/60"
                autoFocus
              />
              <button
                type="button"
                data-ocid="profile.save_button"
                onClick={saveName}
                disabled={nameInput.trim().length < 2}
                className="p-1.5 rounded-lg bg-blue/20 text-blue hover:bg-blue/30 transition-colors disabled:opacity-40"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                data-ocid="profile.cancel_button"
                onClick={cancelEditing}
                className="p-1.5 rounded-lg bg-muted/40 text-muted-foreground hover:bg-muted/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {store.profile.name}
              </h1>
              <button
                type="button"
                data-ocid="profile.edit_button"
                onClick={startEditing}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Member since {joinDate}
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${getRankBg(currentRank)}`}
          >
            {getRankIcon(currentRank)} {currentRank}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-surface rounded-xl p-4 text-center shadow-card">
          <Flame className="w-5 h-5 text-blue mx-auto mb-1" />
          <div className="text-2xl font-display font-extrabold text-blue">
            {store.currentStreak}
          </div>
          <div className="text-xs text-muted-foreground">Streak</div>
        </div>
        <div className="card-surface rounded-xl p-4 text-center shadow-card">
          <Trophy className="w-5 h-5 text-gold mx-auto mb-1" />
          <div className="text-2xl font-display font-extrabold text-foreground">
            {store.longestStreak}
          </div>
          <div className="text-xs text-muted-foreground">Best Streak</div>
        </div>
        <div className="card-surface rounded-xl p-4 text-center shadow-card">
          <Target className="w-5 h-5 text-teal mx-auto mb-1" />
          <div className="text-2xl font-display font-extrabold text-foreground">
            {store.profile.totalTasksCompleted}
          </div>
          <div className="text-xs text-muted-foreground">Tasks Done</div>
        </div>
      </div>

      {/* Rank progression */}
      <div className="card-surface rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-gold" />
          <span className="font-semibold text-foreground">
            Rank Progression
          </span>
        </div>
        <div className="space-y-2.5">
          {rankTiers.map((tier, i) => {
            const isActive = tier.name === currentRank;
            const isPast = i < currentTierIdx;
            return (
              <div key={tier.name} className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold w-24 uppercase ${getRankBg(tier.name)} px-2 py-0.5 rounded-full text-center truncate`}
                >
                  {getRankIcon(tier.name)} {tier.name}
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      isPast || isActive ? "bg-blue" : "bg-muted"
                    }`}
                    initial={{ width: 0 }}
                    animate={{
                      width: isPast
                        ? "100%"
                        : isActive
                          ? `${rankProgress}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-14 text-right">
                  {tier.min}–{tier.max}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card-surface rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-blue" />
          <span className="font-semibold text-foreground">Weekly Activity</span>
        </div>
        <WeeklyChart dayScores={store.dayScores} height={130} />
      </div>

      {/* Badges */}
      <div className="card-surface rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🏅</span>
          <span className="font-semibold text-foreground">
            Badges ({earnedBadges.length}/{store.badges.length})
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {store.badges.map((badge) => (
            <div
              key={badge.id}
              data-ocid={`profile.badge.item.${badge.id}`}
              className={`rounded-xl p-3 text-center transition-all ${
                badge.earned
                  ? "bg-blue/10 border border-blue/20"
                  : "bg-muted/20 border border-border/30 opacity-50"
              }`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <p
                className={`text-xs font-semibold truncate ${
                  badge.earned ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {badge.name}
              </p>
              <p className="text-xs text-muted-foreground/70 truncate">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        data-ocid="profile.logout.button"
        onClick={onLogout}
        className="w-full py-3 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors text-sm font-medium"
      >
        Sign Out
      </button>
    </div>
  );
}
