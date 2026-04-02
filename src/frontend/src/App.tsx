import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BottomNav } from "./components/BottomNav";
import { Header } from "./components/Header";
import { useActor } from "./hooks/useActor";
import { useGrindStore } from "./hooks/useGrindStore";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import { Landing } from "./pages/Landing";
import { Leaderboard } from "./pages/Leaderboard";
import { Onboarding } from "./pages/Onboarding";
import { Profile } from "./pages/Profile";
import { Social } from "./pages/Social";
import { Tasks } from "./pages/Tasks";

type Page =
  | "landing"
  | "dashboard"
  | "tasks"
  | "leaderboard"
  | "social"
  | "profile"
  | "history";

export default function App() {
  const { identity, login, clear, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const userId = isAuthenticated
    ? identity.getPrincipal().toText().slice(0, 16)
    : "";
  const [page, setPage] = useState<Page>("landing");
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const {
    store,
    today,
    todayTasks,
    dailyScore,
    weeklyScore,
    currentRank,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    updateProfileName,
    updateProfileAvatar,
    addPresetTask,
    deletePresetTask,
  } = useGrindStore(userId);
  const { actor } = useActor();

  const handleLogin = useCallback(async () => {
    try {
      await login();
    } catch {
      toast.error("Login failed. Please try again.");
    }
  }, [login]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get("invite");
    if (inviteCode) {
      toast.info("You've been invited to GRINDTRACKER! 🎉", {
        description: "Sign in to join and compete with friends.",
        action: { label: "Sign In", onClick: handleLogin },
        duration: 10000,
      });
      if (actor) {
        actor.submitRSVP("Guest", true, inviteCode).catch(() => {});
      }
    }
  }, [actor, handleLogin]);

  useEffect(() => {
    if (isAuthenticated && page === "landing") {
      setPage("dashboard");
    } else if (!isAuthenticated && page !== "landing") {
      setPage("landing");
    }
  }, [isAuthenticated, page]);

  useEffect(() => {
    if (isAuthenticated && store.profile.name === "") {
      setNeedsOnboarding(true);
    } else if (store.profile.name !== "") {
      setNeedsOnboarding(false);
    }
  }, [isAuthenticated, store.profile.name]);

  const handleOnboardingComplete = (name: string) => {
    updateProfileName(name);
    setNeedsOnboarding(false);
  };

  const handleLogout = () => {
    clear();
    setPage("landing");
    setNeedsOnboarding(false);
  };

  const navigate = (p: string) => {
    if (!isAuthenticated && p !== "landing") {
      handleLogin();
      return;
    }
    setPage(p as Page);
  };

  if (isInitializing) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="app.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-blue/20 flex items-center justify-center animate-pulse">
            <span className="text-xl">⚡</span>
          </div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && needsOnboarding) {
    return (
      <>
        <Onboarding onComplete={handleOnboardingComplete} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentPage={page}
        onNavigate={navigate}
        userName={store.profile.name}
        currentStreak={store.currentStreak}
        rank={currentRank}
      />

      <main className="max-w-3xl mx-auto px-4 py-5">
        {!isAuthenticated ? (
          <Landing onLogin={handleLogin} />
        ) : (
          <>
            {page === "dashboard" && (
              <Dashboard
                store={store}
                todayTasks={todayTasks}
                dailyScore={dailyScore}
                weeklyScore={weeklyScore}
                currentRank={currentRank}
                onNavigate={navigate}
                onToggleTask={toggleTask}
              />
            )}
            {page === "tasks" && (
              <Tasks
                store={store}
                today={today}
                todayTasks={todayTasks}
                dailyScore={dailyScore}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onToggleTask={toggleTask}
              />
            )}
            {page === "leaderboard" && <Leaderboard store={store} />}
            {page === "social" && <Social store={store} />}
            {page === "profile" && (
              <Profile
                store={store}
                weeklyScore={weeklyScore}
                currentRank={currentRank}
                onLogout={handleLogout}
                onUpdateName={updateProfileName}
                onUpdateAvatar={updateProfileAvatar}
              />
            )}
            {page === "history" && (
              <History
                store={store}
                today={today}
                onAddTask={addTask}
                onAddPresetTask={addPresetTask}
                onDeletePresetTask={deletePresetTask}
              />
            )}
          </>
        )}
      </main>

      {isAuthenticated && (
        <BottomNav currentPage={page} onNavigate={navigate} />
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
}
