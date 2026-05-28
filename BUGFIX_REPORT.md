# withink.me Bugfix Report

Date: 2026-05-27

## Summary

Fixed the journal date boundary, autosave, word-count, and duplicate email issues found during the codebase audit. The app now treats journal dates as local calendar days instead of UTC-derived timestamps, correctly saves empty editor states, and avoids overwriting entries while the editor is still hydrating.

## Changes Made

- Added shared local-date helpers in `src/lib/utils/date.ts` for validating `YYYY-MM-DD` strings and adding days without UTC drift.
- Added `src/lib/utils/text.ts` with a shared word counter.
- Fixed `/api/entries` so clearing an entry saves empty `contentHtml`, `contentText`, and `contentJson`, resetting `wordCount` to `0`.
- Validated entry dates in create, fetch, and delete routes, and clamped pagination limits to avoid invalid or oversized archive requests.
- Fixed the grace-period logic to use local calendar math instead of `new Date("YYYY-MM-DD")`, which can shift days by timezone.
- Fixed streak calculation to compare stored date strings directly and accept the user's local today value.
- Added a `withink-local-date` cookie sync from the dashboard so server-rendered `/home` and `/journal/[date]` can respect the user's browser date after hydration.
- Updated dashboard yesterday/grace-period logic to use local date helpers, keeping the current session, yesterday prompt, heatmap, and preview controls aligned.
- Gated autosave until the TipTap editor is ready, preventing blank pre-hydration editor state from overwriting an existing entry.
- Made the editor publish an initial normalized snapshot once ready, so title-only or mood-only changes do not accidentally send stale blank content.
- Removed the auth update hook that could resend the welcome email on ordinary profile updates.
- Removed unused landing-page icon imports so lint is clean.

## Verification

- `pnpm lint` passes.
- `pnpm build` passes with Next.js 16.2.6 after allowing the build to fetch Google Fonts.

## Notes

- `src/app/page.tsx` already had uncommitted landing-page changes before this audit. I only adjusted unused imports there for lint cleanliness.
