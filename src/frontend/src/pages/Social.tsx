import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Flame,
  MessageCircle,
  Send,
  Trophy,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { getRankBg } from "../hooks/useGrindStore";
import type { Friend, GrindStore } from "../hooks/useGrindStore";

interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: string;
}

const AUTO_REPLIES = [
  "Nice work! 💪",
  "Keep grinding! 🔥",
  "You're on fire! ⚡",
  "Let's go! 🚀",
  "Crushing it! 👊",
  "Respect! 🤝",
  "Goals! 🎯",
  "Beast mode! 🦁",
];

function getStorageKey(friendId: string) {
  return `grindchat_${friendId}`;
}

function loadMessages(friendId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(getStorageKey(friendId));
    if (raw) return JSON.parse(raw) as ChatMessage[];
  } catch {
    // ignore
  }
  return [];
}

function saveMessages(friendId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(getStorageKey(friendId), JSON.stringify(messages));
  } catch {
    // ignore
  }
}

interface ChatPanelProps {
  friend: Friend;
  onClose: () => void;
}

function ChatPanel({ friend, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadMessages(friend.id),
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      text,
      fromMe: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(friend.id, updated);
    setInput("");

    // Simulate auto-reply
    setIsTyping(true);
    setTimeout(() => {
      const reply: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        fromMe: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      const withReply = [...updated, reply];
      setMessages(withReply);
      saveMessages(friend.id, withReply);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      data-ocid="social.chat.panel"
      className="overflow-hidden"
    >
      <div className="border border-border/50 rounded-xl mt-2 bg-background/40 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange/20 flex items-center justify-center text-xs font-bold text-orange">
              {friend.avatar}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {friend.name}
            </span>
          </div>
          <button
            type="button"
            data-ocid="social.chat.close_button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/40 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-48 overflow-y-auto px-3 py-2 space-y-2">
          {messages.length === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8">
              Say hi to {friend.name}! 👋
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-1.5 rounded-2xl text-sm ${
                  msg.fromMe
                    ? "bg-blue text-white rounded-br-sm"
                    : "bg-muted/60 text-foreground rounded-bl-sm"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-[10px] mt-0.5 ${msg.fromMe ? "text-white/60" : "text-muted-foreground"}`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted/60 px-3 py-2 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 p-2 border-t border-border/30">
          <Input
            data-ocid="social.chat.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            className="bg-muted/30 text-sm h-8 border-border/40"
          />
          <Button
            data-ocid="social.chat.submit_button"
            size="icon"
            onClick={sendMessage}
            disabled={!input.trim()}
            className="h-8 w-8 bg-blue hover:bg-blue/80 text-white shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface SocialProps {
  store: GrindStore;
}

export function Social({ store }: SocialProps) {
  const { actor } = useActor();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [openChatId, setOpenChatId] = useState<string | null>(null);

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

  const toggleChat = (friendId: string) => {
    setOpenChatId((prev) => (prev === friendId ? null : friendId));
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
          Share your invite link to add friends to GRINDTRACKER. They’ll appear
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
            >
              <div className="card-surface rounded-xl p-4 shadow-card flex items-center gap-3">
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
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="flex items-center gap-1 bg-orange/10 px-2.5 py-1 rounded-full">
                      <Trophy className="w-3 h-3 text-orange" />
                      <span className="text-sm font-bold text-orange">
                        {friend.weeklyScore}
                      </span>
                    </div>
                  </div>
                  <Button
                    data-ocid={`social.friends.chat.button.${i + 1}`}
                    size="sm"
                    variant={openChatId === friend.id ? "default" : "outline"}
                    onClick={() => toggleChat(friend.id)}
                    className={`h-8 px-2.5 gap-1.5 text-xs ${
                      openChatId === friend.id
                        ? "bg-blue hover:bg-blue/80 text-white border-blue"
                        : "border-blue/30 text-blue hover:bg-blue/10"
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat
                  </Button>
                </div>
              </div>
              <AnimatePresence>
                {openChatId === friend.id && (
                  <ChatPanel
                    friend={friend}
                    onClose={() => setOpenChatId(null)}
                  />
                )}
              </AnimatePresence>
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
