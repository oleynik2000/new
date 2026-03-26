# Testing AnonBoard Platform

## Local Dev Setup

```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev

# Seed database with test data (8 entities with comments, votes, tags)
npx tsx prisma/seed.ts

# Start dev server
npm run dev
# App runs on http://localhost:3000
```

## Key Pages to Test

| Page | URL | What to verify |
|------|-----|----------------|
| Home | `/` | Entity grid, search input, sort dropdown (Нові/Популярні/Обговорювані), category filter |
| Add Entity | `/add` | Form with title (required), description, category, image URL/upload, tags |
| Entity Detail | `/entity/[id]` | Image, description, tags, 👍/👎 voting, threaded comments, report button |
| Admin | `/admin` | Stats grid (entities, comments, reports, hidden counts), recent reports with Hide/Show/Delete |

## Testing Checklist

1. **Home page**: Verify seed data loads, search filters results, category dropdown filters by type, sort changes order
2. **Add entity**: Fill form with title + description + category + tags, submit → should redirect to new entity detail page
3. **Entity detail**: Click 👍 → rating should increment. Click 👎 → rating should change. Add comment → comment count updates. Click "Відповісти" on comment → reply form appears, submit reply → nested comment with left border indent
4. **Reporting**: Click "🚩 Поскаржитися" → text changes to "Скаргу надіслано". Same for comment report (🚩 flag icon)
5. **Admin dashboard**: Navigate to `/admin` → verify stats reflect current data, recent reports list shows submitted reports with action buttons

## Cyrillic Text Input

The UI is entirely in Ukrainian. When testing with browser automation:
- Use `xclip -selection clipboard` to copy Cyrillic text, then Ctrl+V to paste
- Or use browser console to set input values programmatically
- English text works fine for entity titles/comments in testing

## Notes

- SQLite database is at `prisma/dev.db` — delete it and re-run migrations + seed to reset
- File uploads go to `public/uploads/` — no cleanup mechanism exists
- Admin endpoints have NO authentication — anyone can access `/admin`
- Rate limiting is in-memory (30 req/60s per IP) — resets on server restart
- Toxic word filter is English-only (9 words) — UI is in Ukrainian
- Next.js image optimization allows all remote hosts via `remotePatterns: [{ hostname: '**' }]`
