import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            className={`text-sm font-bold ${user.isCurrentUser ? "text-blue" : "text-muted-foreground"}`}
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
          className={`text-sm font-semibold truncate ${user.isCurrentUser ? "text-blue" : "text-foreground"}`}
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
  const medals = ["🥇", "🥈", "🥉"];
  const podiumOrder = [1, 0, 2];

  return (
    <div className="space-y-5 pb-20 md:pb-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-gold" />
          Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Weekly rankings reset every Monday
        </p>
      </div>

      {/* Top 3 podium - only show if there are enough users */}
      {sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {podiumOrder.map((displayIdx) => {
            const u = sorted[displayIdx];
            if (!u) return null;
            return (
              <div
                key={u.id}
                data-ocid={`leaderboard.podium.item.${displayIdx + 1}`}
                className={`card-surface rounded-xl p-3 flex flex-col items-center gap-2 shadow-card ${
                  displayIdx === 0 ? "border-gold/30 glow-blue" : ""
                }`}
              >
                <span className="text-2xl">{medals[displayIdx]}</span>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                    displayIdx === 0
                      ? "bg-gold/20 text-gold border border-gold/40"
                      : displayIdx === 1
                        ? "bg-muted/20 text-foreground border border-border"
                        : "bg-bronze/20 text-bronze border border-border"
                  }`}
                >
                  {u.avatar}
                </div>
                <p className="text-xs font-semibold text-center truncate w-full">
                  {u.name.split(" ")[0]}
                </p>
                <span className="text-lg font-display font-extrabold text-blue">
                  {u.weeklyScore}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <Tabs defaultValue="global" data-ocid="leaderboard.tab">
        <TabsList className="bg-muted/40 w-full">
          <TabsTrigger
            value="global"
            data-ocid="leaderboard.global.tab"
            className="flex-1"
          >
            🌍 Global
          </TabsTrigger>
          <TabsTrigger
            value="friends"
            data-ocid="leaderboard.friends.tab"
            className="flex-1"
          >
            👥 Friends
          </TabsTrigger>
        </TabsList>
        <TabsContent value="global" className="mt-4 space-y-2">
          {sorted.length === 0 ? (
            <div
              data-ocid="leaderboard.empty_state"
              className="text-center py-10"
            >
              <p className="text-muted-foreground">
                Complete tasks to appear on the leaderboard!
              </p>
            </div>
          ) : (
            sorted.map((user, i) => (
              <UserRow key={user.id} user={user} position={i + 1} i={i} />
            ))
          )}
        </TabsContent>
        <TabsContent value="friends" className="mt-4 space-y-2">
          {friendLeaderboard.length === 0 ? (
            <div
              className="text-center py-10"
              data-ocid="leaderboard.friends.empty_state"
            >
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
