# GRINDTRACKER

## Current State
- Full-stack PWA with Dashboard, Tasks, Leaderboard, Social, Profile pages
- 5-tier rank system: Rookie, Grinder, Consistent, Disciplined, Elite
- Leaderboard has 14 seeded fake example users plus the current user
- Theme: dark blue-black background with orange accent color
- No History page exists
- Ranks have no icons, just text badges
- Orange is the primary accent color across the entire UI

## Requested Changes (Diff)

### Add
- History page (new route `history`) accessible from BottomNav:
  - "Preset Tasks" tab: save task templates (title, category, priority, estimatedMinutes, repeatType). Tapping a preset instantly adds it as today's task.
  - "Completed" tab: chronological list of all completed tasks across all dates, grouped by date
- 10-tier rank system with icons:
  1. Rookie 🌱 (0–10)
  2. Apprentice 📚 (11–20)
  3. Grinder ⚡ (21–30)
  4. Hustler 💼 (31–40)
  5. Consistent 🎯 (41–50)
  6. Disciplined 🛡️ (51–60)
  7. Warrior ⚔️ (61–70)
  8. Champion 🏆 (71–80)
  9. Legend 🦅 (81–90)
  10. Elite 👑 (91–100)
- Rank icons displayed on leaderboard rows, profile rank badge, dashboard rank badge
- PresetTask type and presetTasks array in GrindStore with addPresetTask / deletePresetTask actions

### Modify
- Remove all 14 seeded fake users from leaderboard in `buildEmptyStore`. Leaderboard starts with only the current user. Friends added via invite show up there.
- Theme: change primary accent from orange (hue ~55) to electric blue (oklch ~0.65 0.22 250). Update all orange/--orange CSS variables and utility classes to blue. Keep purple as secondary rank color. Background stays very dark (near black with slight blue tint).
- Update `getRank` thresholds to map weeklyScore to the 10-tier system
- Update `getRankColor` and `getRankBg` for all 10 ranks
- Update Profile page rank progression section to show all 10 tiers with icons
- Update BottomNav to add History tab (replace or add alongside existing tabs)
- Update App.tsx to include `history` page type and render `<History>` component
- Replace all `text-orange`, `bg-orange`, `border-orange` with `text-blue`/`bg-blue`/`border-blue` equivalents throughout the codebase

### Remove
- All seeded leaderboard entries (l1–l14 fake users)

## Implementation Plan
1. Update `index.css`: replace orange OKLCH variables with blue, update all orange utility classes to blue equivalents
2. Update `tailwind.config.js`: rename orange glow to blue glow box-shadow
3. Update `useGrindStore.ts`:
   - Expand RankTier to 10 values
   - Update getRank, getRankColor, getRankBg
   - Remove fake leaderboard seed data
   - Add PresetTask interface and presetTasks to GrindStore
   - Add addPresetTask/deletePresetTask to hook
4. Create `src/frontend/src/pages/History.tsx` with Preset Tasks and Completed tabs
5. Update `App.tsx`: add `history` to Page type, render History page
6. Update `BottomNav.tsx`: add History nav item (use Clock or History icon from lucide)
7. Update `Profile.tsx`: show all 10 rank tiers with icons in progression section
8. Update `Leaderboard.tsx` and `Dashboard.tsx`: show rank icon alongside rank text
