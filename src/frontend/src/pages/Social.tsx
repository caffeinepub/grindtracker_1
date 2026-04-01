import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Flame, Trophy, UserPlus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { getRankBg } from "../hooks/useGrindStore";
import type { GrindStore } from "../hooks/useGrindStore";

interface SocialProps {
  store: GrindStore;
}

export function Social({ store }: SocialProps) {
  const { actor } = useActor();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generateInvite = async () => {
    setGenerating(true);
    try {
      let code: string;
      if (actor) {
        try {
          code = await actor.generateInviteCode();
        } catch {
          code = crypto
            .randomUUID()
            .replace(/-/g, "")
            .slice(0, 12)
            .toUpperCase();
        }
      } else {
        code = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
      }
      setInviteCode(code);
    } finally {
      setGenerating(false);
    }
  };

  const inviteUrl = inviteCode
    ? `${window.location.origin}?invite=${inviteCode}`
    : null;

  const copyInvite = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      toast.success("Invite link copied!");
    });
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-6 h-6 text-teal" />
          Social
        </h1>
        <p className="text-sm text-muted-foreground">
          Challenge friends and grow your network
        </p>
      </div>

      {/* Invite link section */}
      <div className="card-surface rounded-xl p-5 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-orange" />
          <span className="font-semibold text-foreground">Invite Friends</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Share your invite link to add friends to GRINDTRACKER. They'll appear
          on your leaderboard.
        </p>
        {!inviteCode ? (
          <Button
            data-ocid="social.invite.primary_button"
            onClick={generateInvite}
            disabled={generating}
            className="bg-orange text-primary-foreground hover:bg-orange/90 w-full"
          >
            {generating ? "Generating..." : "Generate Invite Link"}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                data-ocid="social.invite.input"
                value={inviteUrl ?? ""}
                readOnly
                className="bg-muted/40 text-sm font-mono text-muted-foreground"
              />
              <Button
                data-ocid="social.invite.copy.primary_button"
                onClick={copyInvite}
                className="bg-orange text-primary-foreground hover:bg-orange/90 shrink-0"
                size="icon"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button
              data-ocid="social.invite.secondary_button"
              variant="ghost"
              size="sm"
              onClick={generateInvite}
              className="text-muted-foreground w-full"
            >
              Generate new link
            </Button>
          </div>
        )}
      </div>

      {/* Friends list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-foreground">
            Friends ({store.friends.length})
          </h2>
        </div>
        {store.friends.length === 0 ? (
          <div
            className="card-surface rounded-xl p-10 text-center"
            data-ocid="social.friends.empty_state"
          >
            <div className="text-4xl mb-3">👥</div>
            <p className="text-muted-foreground text-sm">
              No friends yet. Generate an invite link to get started.
            </p>
          </div>
        ) : (
          store.friends.map((friend, i) => (
            <motion.div
              key={friend.id}
              data-ocid={`social.friends.item.${i + 1}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-surface rounded-xl p-4 shadow-card flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center text-sm font-bold text-orange">
                  {friend.avatar}
                </div>
                {friend.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {friend.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold uppercase ${getRankBg(friend.rank)}`}
                  >
                    {friend.rank}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-orange" />
                    {friend.streak}d
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 bg-orange/10 px-2.5 py-1 rounded-full">
                  <Trophy className="w-3 h-3 text-orange" />
                  <span className="text-sm font-bold text-orange">
                    {friend.weeklyScore}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">this week</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Stats comparison */}
      <div className="card-surface rounded-xl p-5 shadow-card">
        <h3 className="font-display font-semibold text-foreground mb-4">
          Your Stats vs Friends
        </h3>
        <div className="space-y-3">
          {[
            {
              label: "Weekly Score",
              you: 72,
              top: Math.max(...store.friends.map((f) => f.weeklyScore)),
            },
            {
              label: "Streak",
              you: 15,
              top: Math.max(...store.friends.map((f) => f.streak)),
            },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{stat.label}</span>
                <span>
                  You:{" "}
                  <span className="text-orange font-semibold">{stat.you}</span>{" "}
                  | Top: <span className="text-foreground">{stat.top}</span>
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full">
                <div
                  className="absolute h-full bg-orange/30 rounded-full"
                  style={{ width: `${(stat.top / 100) * 100}%` }}
                />
                <div
                  className="absolute h-full bg-orange rounded-full"
                  style={{ width: `${(stat.you / 100) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
