import { Button } from "@/components/ui/button";
import { Flame, Star, Target, Trophy, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: Target,
    title: "Smart Task System",
    desc: "Create, track, and complete tasks with categories, priorities, and repeat routines.",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    desc: "Maintain daily streaks with 70%+ completion. Watch your consistency compound.",
  },
  {
    icon: Trophy,
    title: "Rank & Compete",
    desc: "From Rookie to Elite — climb through 5 tiers based on your weekly performance.",
  },
  {
    icon: Users,
    title: "Social Competition",
    desc: "Invite friends, challenge leaderboards, and compare weekly stats in real time.",
  },
  {
    icon: Zap,
    title: "Productivity Score",
    desc: "Dynamic daily score with weekly trends and visual charts to track progress.",
  },
  {
    icon: Star,
    title: "Earn Badges",
    desc: "Unlock achievements for streaks, milestones, and consistency over time.",
  },
];

const LEADERBOARD_PREVIEW = [
  { pos: 1, name: "Sarah Kim", score: 95, streak: 32, avatar: "SK" },
  { pos: 2, name: "Jordan Blake", score: 91, streak: 28, avatar: "JB" },
  { pos: 3, name: "Yuki Tanaka", score: 88, streak: 21, avatar: "YT" },
];

interface LandingProps {
  onLogin: () => void;
}

export function Landing({ onLogin }: LandingProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden pt-16 pb-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-blue/10 border border-blue/20 rounded-full px-4 py-1.5 text-sm text-blue font-semibold">
              <Flame className="w-4 h-4" />
              Track. Compete. Dominate.
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-tight text-foreground">
              Build habits.
              <br />
              <span className="text-blue">Crush goals.</span>
              <br />
              Stay elite.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              GRINDTRACKER is a productivity + social competition platform that
              turns your daily tasks into a competitive game. Track streaks,
              climb ranks, and challenge friends.
            </p>
            <Button
              data-ocid="landing.primary_button"
              onClick={onLogin}
              className="bg-blue text-primary-foreground hover:bg-blue/90 font-bold text-base px-8 py-3 h-auto rounded-full shadow-glow"
            >
              <Flame className="w-5 h-5 mr-2" />
              Start Your Streak
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="space-y-3">
              <div className="card-surface rounded-xl p-4 shadow-card transform rotate-[-1deg]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">
                    Daily Score
                  </span>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-display font-extrabold text-blue">
                    78
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div className="w-[78%] h-2 bg-blue rounded-full" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      7 / 9 tasks done
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-surface rounded-xl p-4 shadow-card transform rotate-[1.5deg]">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-gold" />
                  <span className="text-sm font-semibold text-foreground">
                    Leaderboard
                  </span>
                </div>
                {LEADERBOARD_PREVIEW.map((u) => (
                  <div key={u.name} className="flex items-center gap-3 py-1.5">
                    <span
                      className={`text-xs font-bold w-5 ${
                        u.pos === 1
                          ? "text-gold"
                          : u.pos === 2
                            ? "text-silver"
                            : "text-bronze"
                      }`}
                    >
                      {u.pos}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-blue/20 flex items-center justify-center text-xs font-bold text-blue">
                      {u.avatar}
                    </div>
                    <span className="text-sm flex-1">{u.name}</span>
                    <span className="text-xs text-blue font-semibold">
                      {u.score}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Flame className="w-3 h-3" />
                      {u.streak}
                    </span>
                  </div>
                ))}
              </div>
              <div className="card-surface rounded-xl p-4 shadow-card transform rotate-[-0.5deg]">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <div className="text-2xl font-display font-extrabold text-blue">
                      15 days
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Current streak
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-purple/20 text-purple border border-purple/30 text-xs font-bold uppercase px-2 py-0.5 rounded-full">
                      Disciplined
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Everything you need to stay elite
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for high-performers who want more than a to-do list.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-surface rounded-xl p-5 shadow-card group hover:border-blue/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center mb-4 group-hover:bg-blue/20 transition-colors">
                  <Icon className="w-5 h-5 text-blue" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1.5">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center card-surface rounded-2xl p-10 shadow-card">
          <div className="text-4xl mb-4">🏆</div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Ready to start grinding?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of high-performers tracking their way to the top.
          </p>
          <Button
            data-ocid="landing.cta.primary_button"
            onClick={onLogin}
            className="bg-blue text-primary-foreground hover:bg-blue/90 font-bold px-10 py-3 h-auto rounded-full text-base shadow-glow"
          >
            <Flame className="w-5 h-5 mr-2" />
            Start Your Streak
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-blue" />
            <span className="font-display font-bold text-sm">
              GRIND<span className="text-blue">TRACKER</span>
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
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
      </footer>
    </div>
  );
}
