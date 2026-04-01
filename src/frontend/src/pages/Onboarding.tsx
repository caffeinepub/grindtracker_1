import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useState } from "react";

interface OnboardingProps {
  onComplete: (name: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length >= 2) {
      onComplete(trimmed);
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center px-4"
      data-ocid="onboarding.panel"
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="card-surface rounded-2xl p-8 shadow-card w-full max-w-sm text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.15,
            duration: 0.4,
            type: "spring",
            bounce: 0.4,
          }}
          className="w-20 h-20 rounded-2xl bg-blue/20 border-2 border-blue/40 flex items-center justify-center text-4xl mx-auto"
        >
          🔥
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome to GRINDTRACKER
          </h1>
          <p className="text-muted-foreground text-sm">
            What should we call you?
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            data-ocid="onboarding.input"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            className="text-center text-lg font-semibold bg-background/60 border-border focus:border-blue"
            autoFocus
          />
          <Button
            data-ocid="onboarding.submit_button"
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full bg-blue hover:bg-blue/90 text-white font-bold text-base py-5 rounded-xl transition-all disabled:opacity-40"
          >
            Let&apos;s Grind 🔥
          </Button>
        </motion.form>
      </motion.div>
    </div>
  );
}
