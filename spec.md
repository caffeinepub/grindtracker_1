# GRINDTRACKER

## Current State
- Leaderboard page has two tabs: Global and Friends
- Dashboard shows today's date but weekly chart only shows day abbreviations (Mon, Tue...) without actual dates
- Profile has editable name but no way to change profile picture (avatar is auto-generated initials)
- Social page shows friends list and invite links but no messaging/chat feature
- useGrindStore stores profile with avatar (initials string) and friends list

## Requested Changes (Diff)

### Add
- Dates (MM/DD) under day labels in the WeeklyChart on Dashboard
- Profile picture editing: click avatar to open an emoji/icon picker to set a custom avatar emoji
- Chat with friends: in Social page, add a "Message" button on each friend card that opens an inline chat panel showing conversation history and a text input; messages stored in localStorage per friend pair
- updateProfileAvatar function in useGrindStore to persist custom avatar

### Modify
- Leaderboard page: remove the Global tab entirely; show only Friends leaderboard (rename heading to "Friends Leaderboard"). Remove the podium section (only relevant with many users).
- Dashboard: remove the "LEADERBOARD – THIS WEEK" preview section at the bottom
- BottomNav: keep "Ranks" nav item pointing to leaderboard (friends-only view is fine)
- WeeklyChart: show actual date (M/D format) below day abbreviation label
- Profile avatar: make it clickable, show an emoji picker overlay with ~20 emoji options to pick from

### Remove
- Global leaderboard tab from Leaderboard.tsx
- Leaderboard preview card from Dashboard.tsx
- Top 3 podium from Leaderboard.tsx (since it only makes sense with global users)

## Implementation Plan
1. Update `WeeklyChart.tsx` to show date (M/D) below day abbreviation — increase chart height slightly or show date as second line in SVG text
2. Update `Dashboard.tsx` to remove the leaderboard preview section
3. Update `Leaderboard.tsx` to remove Global tab and podium; show friends-only view directly
4. Update `useGrindStore.ts` to add `updateProfileAvatar` function and a `chatMessages` map in store (keyed by friendId)
5. Update `Profile.tsx` to make avatar clickable with an emoji picker overlay
6. Update `Social.tsx` to add a chat panel per friend with message history and input
7. Update `App.tsx` to pass `updateProfileAvatar` to Profile
