## Cluck AI — Student Productivity App (Static UI)

A clean, modern multi-page app for students. Mock data only, no backend, no external services — fully portable to GitHub.

### Pages (separate routes)

- **/** — Home: hero with Drumstick-style brand mark + chicken mascot, tagline, feature highlights (Assignments, AI suggestions, Reminders, Progress), quick links to other pages.
- **/calendar** — Monthly calendar grid with mock assignments/tests rendered on day cells, plus an upcoming list on the side.
- **/cluck** — AI chat UI shell: message thread, input bar ("Ready when you are"), suggested prompt chips. Local echo/canned reply only — real AI wired in a later step.
- **/grades** — Class list with letter grades, weighted breakdown table, and a simple GPA summary card.

### Shared layout

- Sticky top nav (Home, Calendar, Cluck, Grades) in `__root.tsx` with active-link styling.
- Footer with brand mark.
- Per-route `head()` metadata (title + description + og tags).

### Visual design (modernized)

- Light, airy base; navy + warm cream accents pulled from the draft.
- Brand accent: red/coral (Drumstick poster vibe) used sparingly on CTAs and highlights.
- Modern sans-serif (system stack), generous spacing, rounded cards, soft shadows.
- Mascot illustration optional placeholder; no external image dependencies required for build.
- Dark-mode-ready tokens already in `styles.css` will be tuned to match.

### Mock data

- `src/data/mockAssignments.ts` — assignments/tests with date, class, title.
- `src/data/mockGrades.ts` — classes, categories, scores.
- `src/data/mockChat.ts` — starter messages + suggested prompts.

### Portability

- Pure React + Tailwind + TanStack Router (already in stack).
- No new npm dependencies, no Lovable Cloud, no API keys, no env vars.
- Repo can be connected to GitHub and cloned/run anywhere with `bun install && bun dev`.

### Technical notes

- Routes: `src/routes/index.tsx`, `calendar.tsx`, `cluck.tsx`, `grades.tsx`.
- Shared `Header` component rendered in `__root.tsx` above `<Outlet />`.
- Calendar built from a small date helper (no date-fns) using native `Date`.
- Replace placeholder index content; keep router shell intact.

### Out of scope (can be added later)

- Real AI responses on /cluck (Lovable AI Gateway).
- Persistent storage / accounts (Lovable Cloud).
- Editing assignments and grades.
