# Personal Website — Design Spec
**Date:** 2026-04-29  
**Repo:** personalweb (to be created on GitHub)  
**Reference:** https://github.com/eurooooo/zephyrlin.me

---

## Context

Ziang Li (MIT student, UoA, focus on ML/AI) wants a personal website that showcases his CV, projects, and skills to recruiters, while also demonstrating his AI and full-stack capabilities in a memorable, technically impressive way. The site uses a terminal/CMD aesthetic and includes a Claude-powered Daily AI Dev Log as the headline feature.

---

## Visual Design

- **Palette:** Strict black and white — `#0a0a0a` background, `#fff` foreground, `#111`/`#1e1e1e` for card surfaces, `#555`/`#444` for muted text
- **Font:** Monospace throughout (JetBrains Mono or Geist Mono via Google Fonts)
- **Aesthetic:** Terminal/CMD — `$` prompts, `cat`/`ls` command metaphors, window chrome dots, blinking cursor on hero
- **Animations:** Subtle fade-in on scroll (Framer Motion), blinking cursor in hero
- **Nav:** Fixed top bar styled as a terminal title bar — dots + `ziang.li — bash`

---

## Architecture

```
Next.js 15 (App Router)
├── Tailwind CSS (B&W custom palette)
├── Framer Motion (scroll animations)
├── Anthropic SDK (TypeScript) — Claude API
├── Vercel Cron (daily devlog generation)
└── data/devlog.json (flat file storage, last 30 entries)
```

**Deployment:** Vercel free tier, connected to `personalweb` GitHub repo.  
**Env vars:** `ANTHROPIC_API_KEY`, `CRON_SECRET`

---

## Page Structure (Single Page)

All sections on `/` with smooth scroll. A fixed nav links to each section anchor.

### Section 1 — Hero
- Name: **Ziang Li** with blinking cursor
- Tagline: `// full-stack · backend · ml · auckland, nz`
- Terminal prompt styling: `$ whoami`
- CTA buttons: `[projects]` `[skills]` `[download cv]`
- Subtle animated particle background (CSS keyframe animation — B&W floating dots, no extra dependency)

### Section 2 — AI Dev Log ✦
- `$ cat devlog/today.md` heading
- Today's Claude-generated entry (title + ~150 word body)
- Two action buttons:
  - `$ remix --topic` — streams a new angle on today's topic live via Claude API (client-side fetch to `/api/devlog/remix`)
  - `$ ls devlog/` — opens past entries modal
- **Past entries modal:** scrollable list of last 30 entries (date + title), styled as a terminal file listing

### Section 3 — About
- `$ cat about.txt` heading
- Short bio paragraph (from CV summary)
- Photo (optional, circular)
- Key facts: AWS Certified · English + Chinese · Volunteer teacher

### Section 4 — Projects
- `$ ls projects/` heading
- Three project cards (terminal-box style):
  - **TeamUp** — Node.js · Express · MongoDB · AWS · Ongoing
  - **Game Library** — Python · Flask · MySQL · HTML/CSS · Team
  - **Personal Data Platform** — Python · SQL · UX Design · Capstone
- Each card: name, role, tech stack tags, 2-line description, optional GitHub link

### Section 5 — Skills & CV
- `$ skills --list` heading
- Skills displayed as a terminal table: `lang:`, `web:`, `db:`, `cloud:`, `focus:`
- Certifications inline: AWS Certified Cloud Practitioner, ARIS, Java OOP cert
- Prominent `[↓ download cv]` button linking to the PDF

### Section 6 — Contact
- `$ open --links` heading
- Email, GitHub, LinkedIn displayed as terminal output lines
- No contact form — keep it simple

---

## AI Dev Log — Feature Detail

### Daily Generation (Server)
- **Trigger:** Vercel Cron job at midnight NZST (`0 12 * * *` UTC)
- **Route:** `POST /api/devlog/generate` (protected by `CRON_SECRET` header)
- **Prompt:** System prompt defines Ziang's voice — opinionated, concise, backend-focused developer. Seeded with his skills (Node.js, Python, AWS, ML) and projects. Claude picks a topic and writes a ~200-word dev thought with a punchy title.
- **Storage:** Prepend new entry to `data/devlog.json`, keep last 30. Entry shape:
  ```json
  { "date": "2026-04-29", "title": "...", "body": "...", "tags": ["Node.js", "Backend"] }
  ```

### Remix Feature (Client)
- **Route:** `GET /api/devlog/remix?date=2026-04-29` — streams a Claude response
- **Behaviour:** Takes today's title as seed, asks Claude for a different angle. Response streams to the UI via `ReadableStream` — text appears token by token.
- **Rate limit:** 3 remixes per visitor per day (localStorage counter — simple, no auth needed)

### Past Entries Modal
- Modal opens on `$ ls devlog/` button click
- Data fetched from `GET /api/devlog/list` (returns last 30 entries, title + date only)
- Click an entry to expand and read the full body inline in the modal
- Styled as a terminal directory listing

---

## Content (from CV)

| Field | Value |
|---|---|
| Name | Ziang Li |
| Location | Auckland, New Zealand |
| Email | zli775@aucklanduni.ac.nz |
| Education | MIT @ UoA (2025–present, ML/AI focus) · BSc CS @ UoA (2022–2025) |
| Projects | TeamUp, Game Library Website, Personal Data Platform |
| Skills | JS, Python, Java, C#; React, Next.js, Node.js, Express, Flask, Tailwind; MySQL, MongoDB; AWS, Git |
| Certs | AWS Cloud Practitioner, ARIS, Java OOP |
| Languages | English, Chinese |

---

## File Structure

```
personalweb/
├── app/
│   ├── page.tsx              # single page with all sections
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── devlog/
│       │   ├── generate/route.ts   # cron-triggered generation
│       │   ├── remix/route.ts      # streaming remix
│       │   └── list/route.ts       # past entries list
│       └── cv/route.ts             # serves CV PDF
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── DevLog.tsx            # today's entry + remix + modal trigger
│   ├── DevLogModal.tsx       # past entries modal
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   └── Contact.tsx
├── data/
│   └── devlog.json           # rolling 30-entry store
├── public/
│   └── cv.pdf                # Ziang LI.pdf
└── lib/
    └── claude.ts             # Anthropic SDK client + prompt helpers
```

---

## Verification

1. `npm run dev` — all 6 sections render, B&W terminal style correct
2. Call `POST /api/devlog/generate` manually — entry appears in `data/devlog.json`
3. Click `$ remix --topic` — response streams token by token in the UI
4. Click `$ ls devlog/` — modal opens with past entries list
5. Click a past entry — full body expands inline
6. `[↓ download cv]` button — downloads the PDF
7. Deploy to Vercel — cron job appears in Vercel dashboard, fires correctly
