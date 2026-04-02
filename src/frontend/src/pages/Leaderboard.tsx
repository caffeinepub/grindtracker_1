import { Flame, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { getRankBg, getRankIcon } from "../hooks/useGrindStore";
import type { GrindStore, LeaderboardUser } from "../hooks/useGrindStore";

interface LeaderboardProps {
  store: GrindStore;
}

function UserRow({
  user,
  position,
  i,
}: { user: LeaderboardUser; position: number; i: number }) {
  const medal =
    position === 1
      ? "🥇"
      : position === 2
        ? "🥈"
        : position === 3
          ? "🥉"
          : null;
  const rowClass =
    position <= 3
      ? position === 1
        ? "bg-gold/10 border border-gold/20"
        : position === 2
          ? "bg-muted/20 border border-border"
          : "bg-bronze/10 border border-border"
      : user.isCurrentUser
        ? "bg-blue/5 border border-blue/20"
        : "border border-border/50";

  return (
    <motion.div
      data-ocid={`leaderboard.row.item.${i + 1}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
      className={`flex items-center gap-3 p-3 rounded-xl ${rowClass}`}
    >
      <div className="w-8 text-center">
        {medal ? (
          <span className="text-xl">{medal}</span>
        ) : (
          <span
            className={`text-sm font-bold ${
              user.isCurrentUser ? "text-blue" : "text-muted-foreground"
            }`}
          >
            {position}
          </span>
        )}
      </div>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
          user.isCurrentUser
            ? "bg-blue/30 text-blue border border-blue/50"
            : "bg-blue/15 text-blue"
        }`}
      >
        {user.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold truncate ${
            user.isCurrentUser ? "text-blue" : "text-foreground"
          }`}
        >
          {user.name} {user.isCurrentUser && "(You)"}
        </p>
        <p className="text-xs text-muted-foreground">
          {user.tasksCompleted} tasks done
        </p>
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase hidden sm:inline-flex items-center gap-1 ${getRankBg(user.rank)}`}
      >
        {getRankIcon(user.rank)} {user.rank}
      </span>
      <div className="flex items-center gap-1 bg-muted/40 px-2.5 py-1 rounded-full">
        <Flame className="w-3 h-3 text-blue" />
        <span className="text-xs font-bold text-blue">{user.weeklyScore}</span>
      </div>
      <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-full">
        <span className="text-xs">🔥</span>
        <span className="text-xs text-muted-foreground">{user.streak}d</span>
      </div>
    </motion.div>
  );
}

export function Leaderboard({ store }: LeaderboardProps) {
  const sorted = [...store.leaderboard].sort(
    (a, b) => b.weeklyScore - a.weeklyScore,
  );
  const friendLeaderboard = sorted.filter((u) => u.isCurrentUser || u.isFriend);

  return (
    <div className="space-y-5 pb-20 md:pb-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-gold" />
          Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Friends rankings — weekly reset every Monday
        </p>
      </div>

      <div className="space-y-2">
        {friendLeaderboard.length === 0 ? (
          <div
            className="card-surface rounded-xl p-10 text-center"
            data-ocid="leaderboard.friends.empty_state"
          >
            <div className="text-4xl mb-3">👥</div>
            <p className="text-muted-foreground">
              No friends yet. Invite some!
            </p>
          </div>
        ) : (
          friendLeaderboard.map((user, i) => (
            <UserRow
              key={user.id}
              user={user}
              position={sorted.findIndex((u) => u.id === user.id) + 1}
              i={i}
            />
          ))
        )}
      </div>
    </div>
  );
}
