import {
  CheckSquare,
  Clock,
  LayoutDashboard,
  Trophy,
  User,
  Users,
} from "lucide-react";

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Home" },
  { id: "tasks", icon: CheckSquare, label: "Tasks" },
  { id: "history", icon: Clock, label: "History" },
  { id: "leaderboard", icon: Trophy, label: "Ranks" },
  { id: "social", icon: Users, label: "Social" },
  { id: "profile", icon: User, label: "Profile" },
];

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/90 backdrop-blur-md border-t border-border">
      <div className="flex">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            type="button"
            key={id}
            data-ocid={`bottom_nav.${id}.link`}
            onClick={() => onNavigate(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
              currentPage === id
                ? "text-blue"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
            {currentPage === id && (
              <span className="absolute bottom-0 w-1 h-1 rounded-full bg-blue" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
