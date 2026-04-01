import { Button } from "@/components/ui/button";
import { Bell, Flame, Trophy } from "lucide-react";
import type { RankTier } from "../hooks/useGrindStore";
import { getRankBg, getRankIcon } from "../hooks/useGrindStore";

interface HeaderProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  userName?: string;
  currentStreak?: number;
  rank?: RankTier;
}

const NAV_LINKS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tasks", label: "Tasks" },
  { id: "history", label: "History" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "social", label: "Social" },
  { id: "profile", label: "Profile" },
];

export function Header({
  isAuthenticated,
  onLogin,
  onLogout,
  currentPage,
  onNavigate,
  userName,
  currentStreak,
  rank,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          type="button"
          data-ocid="header.link"
          onClick={() => onNavigate(isAuthenticated ? "dashboard" : "landing")}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-7 h-7 rounded-md bg-blue flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sm tracking-wide text-foreground">
            GRIND<span className="text-blue">TRACKER</span>
          </span>
        </button>

        {/* Desktop nav */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                data-ocid={`nav.${link.id}.link`}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  currentPage === link.id
                    ? "bg-blue/10 text-blue font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              {rank && (
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getRankBg(rank)}`}
                >
                  {getRankIcon(rank)} {rank}
                </span>
              )}
              {currentStreak !== undefined && (
                <div className="hidden sm:flex items-center gap-1 text-blue text-sm font-semibold">
                  <Flame className="w-4 h-4" />
                  <span>{currentStreak}</span>
                </div>
              )}
              <button
                type="button"
                data-ocid="header.link"
                className="w-8 h-8 rounded-full bg-blue/10 border border-blue/30 flex items-center justify-center text-xs font-bold text-blue cursor-default"
              >
                {userName?.slice(0, 2).toUpperCase() ?? "AC"}
              </button>
              <button
                type="button"
                data-ocid="header.link"
                className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bell className="w-4 h-4" />
              </button>
              <Button
                data-ocid="header.secondary_button"
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <button
                type="button"
                data-ocid="header.link"
                className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button
                type="button"
                data-ocid="header.link"
                className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground"
              >
                <Trophy className="w-4 h-4" />
              </button>
              <Button
                data-ocid="header.primary_button"
                size="sm"
                onClick={onLogin}
                className="bg-blue text-primary-foreground hover:bg-blue/90 font-semibold"
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
