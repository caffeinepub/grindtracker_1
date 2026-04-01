import { Input } from "@/components/ui/input";
import { Check, Flame, Pencil, Star, Target, Trophy, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { WeeklyChart } from "../components/WeeklyChart";
import { getRankBg, getRankIcon } from "../hooks/useGrindStore";
import type { GrindStore, RankTier } from "../hooks/useGrindStore";

interface ProfileProps {
  store: GrindStore;
  weeklyScore: number;
  currentRank: RankTier;
  onLogout: () => void;
  onUpdateName: (name: string) => void;
}

export function Profile({
  store,
  weeklyScore,
  currentRank,
  onLogout,
  onUpdateName,
}: ProfileProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

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

  return (
    <div className="space-y-5 pb-20 md:pb-6 animate-fade-in">
      {/* Profile header */}
      <div className="card-surface rounded-xl p-6 shadow-card text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-blue/20 border-2 border-blue/40 flex items-center justify-center text-2xl font-bold text-blue mx-auto">
          {store.profile.avatar}
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

      {/* Weekly Chart */}
      <div className="card-surface rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-blue" />
          <span className="font-semibold text-foreground">
            Weekly Performance
          </span>
        </div>
        <WeeklyChart dayScores={store.dayScores} height={120} />
      </div>

      {/* Badges */}
      <div className="card-surface rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-gold" />
          <span className="font-semibold text-foreground">Badges</span>
          <span className="text-xs text-muted-foreground ml-1">
            ({earnedBadges.length}/{store.badges.length})
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {store.badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              data-ocid={`profile.badge.item.${i + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl p-3 text-center ${
                badge.earned
                  ? "card-surface border-blue/20 shadow-card"
                  : "bg-muted/20 border border-border opacity-50"
              }`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <p className="text-xs font-semibold text-foreground truncate">
                {badge.name}
              </p>
              {badge.earned && badge.earnedAt && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(badge.earnedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
              {!badge.earned && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Locked
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <button
        type="button"
        data-ocid="profile.secondary_button"
        onClick={onLogout}
        className="w-full card-surface rounded-xl p-4 text-red hover:bg-red/10 transition-colors text-sm font-medium"
      >
        Sign Out
      </button>

      {/* Footer */}
      <p className="text-center text-muted-foreground text-xs pb-4">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue hover:underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
