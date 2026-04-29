# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a terminal-style personal portfolio site for Ziang Li with a Claude-powered Daily AI Dev Log, deployed to Vercel.

**Architecture:** Single Next.js 15 App Router page with six scroll sections (Hero → AI Dev Log → About → Projects → Skills/CV → Contact). The AI Dev Log is generated daily by a Vercel Cron job calling the Claude API; visitors can stream a "remix" in real time. Past entries live in a flat JSON file and open in a modal.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS (B&W palette), Framer Motion, Anthropic SDK, Vercel Cron, Jest

---

## File Map

```
personalweb/
├── app/
│   ├── layout.tsx                    # root layout, Geist Mono font, metadata
│   ├── page.tsx                      # server component, assembles all sections
│   ├── globals.css                   # Tailwind base + terminal component classes + particle bg
│   └── api/
│       ├── devlog/
│       │   ├── generate/route.ts     # POST — cron-protected, calls Claude, writes devlog.json
│       │   ├── list/route.ts         # GET — returns last 30 entries
│       │   └── remix/route.ts        # GET — streams a new angle via Claude
│       └── cv/route.ts               # GET — serves CV PDF with download headers
├── components/
│   ├── Nav.tsx                       # fixed terminal titlebar with section anchors
│   ├── Hero.tsx                      # whoami block, blinking cursor, particle bg, CTAs
│   ├── DevLog.tsx                    # today's entry, remix button, modal trigger
│   ├── DevLogModal.tsx               # past entries modal with expandable rows
│   ├── About.tsx                     # bio paragraph, key facts
│   ├── Projects.tsx                  # three project cards
│   ├── Skills.tsx                    # terminal table of skills + CV download
│   └── Contact.tsx                   # email/github/linkedin as terminal output
├── lib/
│   ├── devlog.ts                     # readEntries / prependEntry / getTodayEntry (pure fs utils)
│   └── claude.ts                     # Anthropic client + system prompt + prompt builders
├── lib/__tests__/
│   └── devlog.test.ts                # unit tests for devlog fs utilities
├── data/
│   └── devlog.json                   # rolling array of last 30 entries (committed to repo)
├── public/
│   └── Ziang_Li_CV.pdf               # CV file
├── tailwind.config.ts
├── jest.config.ts
├── vercel.json                       # cron schedule
└── .env.local.example                # template for ANTHROPIC_API_KEY, CRON_SECRET
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `jest.config.ts`, `.env.local.example`, `.gitignore`

- [ ] **Step 1.1: Bootstrap Next.js in the existing directory**

```bash
cd "/Users/paulli/Home/Personal Web"
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --no-git
```

When prompted "The directory . contains files that could conflict" → type `y` to proceed.
Choose: Would you like to use Turbopack? → No

- [ ] **Step 1.2: Install extra dependencies**

```bash
npm install framer-motion @anthropic-ai/sdk
npm install --save-dev jest jest-environment-node ts-jest @types/jest
```

- [ ] **Step 1.3: Configure Jest**

Replace the generated `jest.config.ts` (or create it):

```typescript
// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs' } }] },
  testPathPattern: 'lib/__tests__',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
}

export default config
```

- [ ] **Step 1.4: Configure Tailwind with B&W palette**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        border: '#1e1e1e',
        'border-muted': '#222222',
        foreground: '#ffffff',
        muted: '#555555',
        'muted-2': '#444444',
        'muted-3': '#333333',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 1.5: Write globals.css**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-foreground font-mono;
    scroll-behavior: smooth;
  }
  ::selection {
    background-color: #ffffff;
    color: #000000;
  }
  /* custom scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #333; }
}

@layer components {
  .terminal-btn {
    @apply font-mono text-sm px-3 py-1.5 border border-border text-muted hover:border-foreground hover:text-foreground transition-colors rounded-sm cursor-pointer;
  }
  .terminal-btn-primary {
    @apply bg-foreground text-background border-foreground hover:bg-transparent hover:text-foreground;
  }
  .terminal-card {
    @apply bg-surface border border-border rounded-sm font-mono;
  }
  .terminal-label {
    @apply text-muted-2 text-xs tracking-widest uppercase;
  }
  .terminal-prompt {
    @apply text-muted text-sm;
  }
}

/* Particle background — subtle dot grid with float animation */
@keyframes particle-float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.15; }
  50% { transform: translateY(-12px) translateX(6px); opacity: 0.4; }
}

.particles-bg {
  background-image: radial-gradient(circle, #2a2a2a 1px, transparent 1px);
  background-size: 48px 48px;
  animation: particle-float 8s ease-in-out infinite;
}
```

- [ ] **Step 1.6: Write `.env.local.example`**

```bash
# .env.local.example
ANTHROPIC_API_KEY=sk-ant-...
CRON_SECRET=your-random-secret-here
```

- [ ] **Step 1.7: Add `.superpowers/` and `data/` to `.gitignore`**

Append to `.gitignore`:
```
.superpowers/
.env.local
```

- [ ] **Step 1.8: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts on `http://localhost:3000` with no errors.

- [ ] **Step 1.9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 project with Tailwind B&W config and Jest"
```

---

## Task 2: Devlog Data Utilities (TDD)

**Files:**
- Create: `lib/devlog.ts`
- Create: `lib/__tests__/devlog.test.ts`
- Create: `data/devlog.json`

- [ ] **Step 2.1: Write failing tests first**

```typescript
// lib/__tests__/devlog.test.ts
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { readEntries, prependEntry, getTodayDate, getTodayEntry, DevLogEntry } from '../devlog'

let tmpFile: string

beforeEach(() => {
  tmpFile = path.join(os.tmpdir(), `devlog-test-${Date.now()}.json`)
})

afterEach(async () => {
  await fs.unlink(tmpFile).catch(() => {})
})

test('readEntries returns [] when file does not exist', async () => {
  const result = await readEntries('/nonexistent/devlog.json')
  expect(result).toEqual([])
})

test('prependEntry writes first entry', async () => {
  const entry: DevLogEntry = { date: '2026-04-29', title: 'Test', body: 'Body text', tags: ['Node.js'] }
  await prependEntry(entry, tmpFile)
  const result = await readEntries(tmpFile)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual(entry)
})

test('prependEntry puts newest entry first', async () => {
  const older: DevLogEntry = { date: '2026-04-28', title: 'Older', body: 'B', tags: [] }
  const newer: DevLogEntry = { date: '2026-04-29', title: 'Newer', body: 'B', tags: [] }
  await prependEntry(older, tmpFile)
  await prependEntry(newer, tmpFile)
  const result = await readEntries(tmpFile)
  expect(result[0].title).toBe('Newer')
})

test('prependEntry enforces 30 entry limit', async () => {
  for (let i = 0; i < 32; i++) {
    const d = String(i + 1).padStart(2, '0')
    await prependEntry({ date: `2026-01-${d}`, title: `T${i}`, body: 'B', tags: [] }, tmpFile)
  }
  const result = await readEntries(tmpFile)
  expect(result).toHaveLength(30)
})

test('getTodayDate returns YYYY-MM-DD format', () => {
  expect(getTodayDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
})

test('getTodayEntry returns null when no entry for today', async () => {
  const entry: DevLogEntry = { date: '2000-01-01', title: 'Old', body: 'B', tags: [] }
  await prependEntry(entry, tmpFile)
  const result = await getTodayEntry(tmpFile)
  expect(result).toBeNull()
})

test('getTodayEntry returns entry matching today', async () => {
  const today = getTodayDate()
  const entry: DevLogEntry = { date: today, title: 'Today', body: 'B', tags: [] }
  await prependEntry(entry, tmpFile)
  const result = await getTodayEntry(tmpFile)
  expect(result?.title).toBe('Today')
})
```

- [ ] **Step 2.2: Run tests — confirm they all fail**

```bash
npx jest
```

Expected: all 7 tests FAIL with "Cannot find module '../devlog'"

- [ ] **Step 2.3: Implement `lib/devlog.ts`**

```typescript
// lib/devlog.ts
import fs from 'fs/promises'
import path from 'path'

export interface DevLogEntry {
  date: string   // YYYY-MM-DD
  title: string
  body: string
  tags: string[]
}

const DEFAULT_PATH = path.join(process.cwd(), 'data', 'devlog.json')
const MAX_ENTRIES = 30

export async function readEntries(filePath = DEFAULT_PATH): Promise<DevLogEntry[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export async function prependEntry(entry: DevLogEntry, filePath = DEFAULT_PATH): Promise<void> {
  const entries = await readEntries(filePath)
  const updated = [entry, ...entries].slice(0, MAX_ENTRIES)
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2))
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export async function getTodayEntry(filePath = DEFAULT_PATH): Promise<DevLogEntry | null> {
  const entries = await readEntries(filePath)
  const today = getTodayDate()
  return entries.find(e => e.date === today) ?? null
}
```

- [ ] **Step 2.4: Run tests — confirm they all pass**

```bash
npx jest
```

Expected: 7 tests PASS

- [ ] **Step 2.5: Create `data/devlog.json` with a seed entry**

```json
[
  {
    "date": "2026-04-29",
    "title": "Why I keep reaching for Express even when everyone says use Fastify",
    "body": "I started a new side project last week and, almost automatically, typed `npm install express`. I didn't even think about it. Which made me wonder: am I choosing Express because it's genuinely the right tool, or because it's the tool that's already in my hands?\n\nThe honest answer is probably both. Express is boring in the best way — the docs are complete, every error message has a Stack Overflow thread, and I know exactly where the footguns are. With Fastify I'd spend the first hour learning the framework instead of building the thing.\n\nFor a hobby project, speed of thought matters more than speed of execution. Maybe that changes when I'm building something that needs to handle real load. But for now, boring wins.",
    "tags": ["Node.js", "Express", "Backend"]
  }
]
```

- [ ] **Step 2.6: Commit**

```bash
git add lib/devlog.ts lib/__tests__/devlog.test.ts data/devlog.json
git commit -m "feat: add devlog data utilities with tests"
```

---

## Task 3: Claude Client

**Files:**
- Create: `lib/claude.ts`

- [ ] **Step 3.1: Create `.env.local` from example**

```bash
cp .env.local.example .env.local
# Then fill in your ANTHROPIC_API_KEY and a random CRON_SECRET
```

Generate a CRON_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] **Step 3.2: Implement `lib/claude.ts`**

```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const ZIANG_SYSTEM_PROMPT = `You write daily dev log entries for Ziang Li — a full-stack developer and Master of Information Technology student at the University of Auckland, specialising in Machine Learning and AI.

Ziang's voice: direct, thoughtful, slightly opinionated. He writes like a developer thinking out loud, not performing expertise. He's pragmatic about tradeoffs, occasionally self-deprecating, never hypey about technology.

His world: Node.js, Express, MongoDB, Python, Flask, MySQL, React, Next.js, AWS (certified), ML/AI concepts. Projects include TeamUp (group formation web app) and a Game Library website.

Entry format:
- Title: specific and concrete, not generic. Good: "Why I stopped fighting Express middleware". Bad: "Thoughts on Node.js".
- Body: 150–200 words. Starts with a concrete moment or observation. Develops one clear thought. Ends with something unresolved or honest.
- Tags: 2–3 from: Node.js, Python, Express, MongoDB, MySQL, AWS, React, Next.js, Flask, Backend, Frontend, ML, AI, System Design, Tooling, Learning, Cloud

Return valid JSON only — no markdown, no code fences:
{"title": "...", "body": "...", "tags": ["...", "..."]}`

export function buildGeneratePrompt(): string {
  return `Write today's dev log entry. Pick one specific topic from Ziang's world — a tool, a tradeoff, a mistake, a realisation. Make the title punchy and specific.`
}

export function buildRemixPrompt(originalTitle: string): string {
  return `Today's dev log is titled: "${originalTitle}". Write a fresh take on the same subject — different angle, different example, or different conclusion. Keep Ziang's voice. Return valid JSON only: {"title": "...", "body": "...", "tags": ["...", "..."]}`
}
```

- [ ] **Step 3.3: Commit**

```bash
git add lib/claude.ts .env.local.example
git commit -m "feat: add Claude API client with Ziang voice system prompt"
```

---

## Task 4: API Routes

**Files:**
- Create: `app/api/devlog/generate/route.ts`
- Create: `app/api/devlog/list/route.ts`
- Create: `app/api/devlog/remix/route.ts`
- Create: `app/api/cv/route.ts`

- [ ] **Step 4.1: Implement generate route**

```typescript
// app/api/devlog/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { anthropic, ZIANG_SYSTEM_PROMPT, buildGeneratePrompt } from '@/lib/claude'
import { prependEntry, getTodayEntry, getTodayDate } from '@/lib/devlog'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await getTodayEntry()
  if (existing) {
    return NextResponse.json({ skipped: true, entry: existing })
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: ZIANG_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildGeneratePrompt() }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(text) as { title: string; body: string; tags: string[] }

  const entry = { date: getTodayDate(), title: parsed.title, body: parsed.body, tags: parsed.tags }
  await prependEntry(entry)

  return NextResponse.json({ success: true, entry })
}
```

- [ ] **Step 4.2: Implement list route**

```typescript
// app/api/devlog/list/route.ts
import { NextResponse } from 'next/server'
import { readEntries } from '@/lib/devlog'

export async function GET() {
  const entries = await readEntries()
  return NextResponse.json(entries)
}
```

- [ ] **Step 4.3: Implement remix streaming route**

```typescript
// app/api/devlog/remix/route.ts
import { NextRequest } from 'next/server'
import { anthropic, ZIANG_SYSTEM_PROMPT, buildRemixPrompt } from '@/lib/claude'
import { getTodayEntry } from '@/lib/devlog'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest) {
  const entry = await getTodayEntry()
  if (!entry) {
    return new Response('No entry for today', { status: 404 })
  }

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: ZIANG_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildRemixPrompt(entry.title) }],
  })

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
    cancel() {
      stream.abort()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
```

- [ ] **Step 4.4: Implement CV route**

```typescript
// app/api/cv/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'Ziang_Li_CV.pdf')
  try {
    const file = await fs.readFile(filePath)
    return new Response(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Ziang_Li_CV.pdf"',
      },
    })
  } catch {
    return NextResponse.json({ error: 'CV not found' }, { status: 404 })
  }
}
```

- [ ] **Step 4.5: Copy CV to public/**

```bash
cp "/Users/paulli/Home/Personal Web/Ziang LI.pdf" "/Users/paulli/Home/Personal Web/public/Ziang_Li_CV.pdf"
```

- [ ] **Step 4.6: Smoke-test the routes**

```bash
# Start dev server in one terminal
npm run dev

# In another terminal:

# List (uses seed entry from data/devlog.json)
curl http://localhost:3000/api/devlog/list
# Expected: JSON array with the seed entry

# Generate (uses CRON_SECRET from .env.local)
CRON_SECRET=$(grep CRON_SECRET .env.local | cut -d= -f2)
curl -X POST http://localhost:3000/api/devlog/generate \
  -H "Authorization: Bearer $CRON_SECRET"
# Expected: {"skipped":true,...} (seed entry already exists for today)

# Remix (streams — should see JSON text appear incrementally)
curl http://localhost:3000/api/devlog/remix

# CV download
curl -I http://localhost:3000/api/cv
# Expected: Content-Disposition: attachment; filename="Ziang_Li_CV.pdf"
```

- [ ] **Step 4.7: Commit**

```bash
git add app/api/ public/Ziang_Li_CV.pdf
git commit -m "feat: add devlog generate/list/remix and CV API routes"
```

---

## Task 5: Layout and Nav

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/Nav.tsx`

- [ ] **Step 5.1: Update layout.tsx**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Ziang Li',
  description: 'Full-stack developer & MIT student at University of Auckland. Backend, ML/AI, cloud.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5.2: Create `components/Nav.tsx`**

```typescript
// components/Nav.tsx
'use client'
import { useEffect, useState } from 'react'

const links = [
  { href: '#devlog', label: '~/devlog' },
  { href: '#about', label: '~/about' },
  { href: '#projects', label: '~/projects' },
  { href: '#skills', label: '~/skills' },
  { href: '#contact', label: '~/contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled ? 'bg-surface border-b border-border' : ''
      }`}
    >
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-6">
        <div className="flex gap-1.5 flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
        </div>
        <span className="font-mono text-xs text-muted-3 flex-1 text-center hidden sm:block">
          ziang.li — bash
        </span>
        <div className="hidden md:flex gap-5 flex-shrink-0">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs text-muted hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 5.3: Commit**

```bash
git add app/layout.tsx components/Nav.tsx
git commit -m "feat: add layout with Geist Mono and terminal Nav"
```

---

## Task 6: Hero Section

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 6.1: Create `components/Hero.tsx`**

```typescript
// components/Hero.tsx
'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(t)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 overflow-hidden"
    >
      {/* Particle dot grid background */}
      <div className="absolute inset-0 particles-bg pointer-events-none" aria-hidden="true" />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto w-full pt-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <p className="terminal-prompt mb-2">$ whoami</p>
        <h1 className="font-mono text-5xl md:text-7xl font-bold text-foreground leading-none mb-3">
          Ziang Li
          <span
            className="inline-block w-[3px] h-[0.9em] bg-foreground ml-1 align-middle"
            style={{ opacity: cursor ? 1 : 0, transition: 'opacity 0.05s' }}
            aria-hidden="true"
          />
        </h1>
        <p className="font-mono text-muted text-sm md:text-base mb-10">
          {'// full-stack · backend · ml · auckland, nz'}
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#projects" className="terminal-btn">[ projects ]</a>
          <a href="#skills" className="terminal-btn">[ skills ]</a>
          <a href="/api/cv" className="terminal-btn terminal-btn-primary">
            [ ↓ download cv ]
          </a>
        </div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 6.2: Verify hero renders correctly**

Open `http://localhost:3000` — expect:
- Dark background with subtle dot grid
- "$ whoami" in muted text
- Large "Ziang Li" with blinking cursor
- Three buttons visible

- [ ] **Step 6.3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add Hero section with blinking cursor and particle background"
```

---

## Task 7: DevLog and Modal Components

**Files:**
- Create: `components/DevLog.tsx`
- Create: `components/DevLogModal.tsx`

- [ ] **Step 7.1: Create `components/DevLogModal.tsx`**

```typescript
// components/DevLogModal.tsx
'use client'
import { useEffect, useState } from 'react'
import type { DevLogEntry } from '@/lib/devlog'

interface Props {
  open: boolean
  onClose: () => void
}

export default function DevLogModal({ open, onClose }: Props) {
  const [entries, setEntries] = useState<DevLogEntry[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    fetch('/api/devlog/list')
      .then(r => r.json())
      .then(setEntries)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-sm w-full max-w-lg max-h-[80vh] flex flex-col font-mono shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-border flex-shrink-0">
          <span className="text-sm terminal-prompt">$ ls devlog/</span>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors text-sm ml-4"
            aria-label="Close"
          >
            [x]
          </button>
        </div>

        {/* Entry list */}
        <div className="overflow-y-auto p-3 flex flex-col gap-2">
          {entries.length === 0 && (
            <p className="text-center text-muted text-sm py-6">no entries yet</p>
          )}
          {entries.map(entry => (
            <div key={entry.date} className="border border-border rounded-sm overflow-hidden">
              <button
                className="w-full text-left px-3 py-2.5 hover:bg-[#1a1a1a] transition-colors flex items-baseline gap-3"
                onClick={() => setExpanded(expanded === entry.date ? null : entry.date)}
              >
                <span className="text-xs text-muted-2 flex-shrink-0">{entry.date}</span>
                <span className="text-sm text-muted">{entry.title}</span>
              </button>
              {expanded === entry.date && (
                <div className="px-3 pb-3 border-t border-border">
                  <p className="text-sm text-muted leading-relaxed mt-3 whitespace-pre-wrap">
                    {entry.body}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.tags.map(t => (
                      <span
                        key={t}
                        className="text-xs text-muted-3 border border-border-muted px-1.5 py-0.5 rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <p className="text-xs text-muted-3 text-center pt-1 pb-2">30 entries kept</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7.2: Create `components/DevLog.tsx`**

```typescript
// components/DevLog.tsx
'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { DevLogEntry } from '@/lib/devlog'
import DevLogModal from './DevLogModal'

interface Props {
  entry: DevLogEntry | null
}

function getRemixCount(): number {
  if (typeof window === 'undefined') return 0
  const date = localStorage.getItem('remix_date')
  const today = new Date().toISOString().split('T')[0]
  if (date !== today) return 0
  return parseInt(localStorage.getItem('remix_count') ?? '0', 10)
}

function incrementRemixCount(): void {
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem('remix_date', today)
  const current = getRemixCount()
  localStorage.setItem('remix_count', String(current + 1))
}

export default function DevLog({ entry }: Props) {
  const [remixBody, setRemixBody] = useState<string | null>(null)
  const [remixLoading, setRemixLoading] = useState(false)
  const [remixCount, setRemixCount] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  // Hydrate remix count client-side
  const [hydrated, setHydrated] = useState(false)
  if (!hydrated && typeof window !== 'undefined') {
    setRemixCount(getRemixCount())
    setHydrated(true)
  }

  async function handleRemix() {
    if (remixLoading || remixCount >= 3 || !entry) return
    setRemixLoading(true)
    setRemixBody('')
    incrementRemixCount()
    setRemixCount(c => c + 1)

    const res = await fetch('/api/devlog/remix')
    if (!res.body) { setRemixLoading(false); return }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      setRemixBody(prev => (prev ?? '') + decoder.decode(value, { stream: true }))
    }
    setRemixLoading(false)
  }

  const displayBody = remixBody !== null ? remixBody : entry?.body
  const displayTitle = entry?.title

  return (
    <section id="devlog" className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="terminal-label mb-6"># section 2 — ai dev log ✦</p>
          <p className="terminal-prompt mb-3">$ cat devlog/today.md</p>

          <div className="terminal-card p-5 mb-5">
            {entry ? (
              <>
                <p className="text-xs text-muted-2 mb-3">-- {entry.date} | generated by claude</p>
                <h3 className="text-foreground text-base font-semibold mb-3 leading-snug">
                  &ldquo;{displayTitle}&rdquo;
                </h3>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-wrap">
                  {displayBody}
                  {remixLoading && (
                    <span className="inline-block w-[2px] h-[1em] bg-muted ml-0.5 align-middle animate-pulse" />
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {entry.tags.map(t => (
                    <span
                      key={t}
                      className="text-xs text-muted-3 border border-border-muted px-1.5 py-0.5 rounded-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted text-sm">no entry yet today — check back later.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRemix}
              disabled={remixLoading || remixCount >= 3 || !entry}
              className="terminal-btn disabled:opacity-40 disabled:cursor-not-allowed"
            >
              $ remix --topic{remixCount > 0 ? ` (${3 - remixCount} left)` : ''}
            </button>
            <button onClick={() => setModalOpen(true)} className="terminal-btn">
              $ ls devlog/
            </button>
          </div>
        </motion.div>
      </div>

      <DevLogModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
```

- [ ] **Step 7.3: Commit**

```bash
git add components/DevLog.tsx components/DevLogModal.tsx
git commit -m "feat: add DevLog section with streaming remix and past entries modal"
```

---

## Task 8: Content Sections

**Files:**
- Create: `components/About.tsx`
- Create: `components/Projects.tsx`
- Create: `components/Skills.tsx`
- Create: `components/Contact.tsx`

- [ ] **Step 8.1: Create `components/About.tsx`**

```typescript
// components/About.tsx
'use client'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="terminal-label mb-6"># section 3 — about</p>
          <p className="terminal-prompt mb-4">$ cat about.txt</p>
          <div className="border-l border-border pl-5 space-y-4">
            <p className="text-sm text-muted leading-relaxed">
              Master of Information Technology student at the University of Auckland, focused on Machine
              Learning and Artificial Intelligence. I enjoy backend and full-stack development —
              turning ideas into practical, user-focused applications across web, cloud, and AI projects.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              I work with AI tools like Claude Code and Codex as part of my development workflow,
              and I&apos;m interested in the intersection of software engineering and applied ML.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-2 pt-1">
              <span>AWS Certified ✓</span>
              <span>English · Chinese</span>
              <span>Volunteer Teacher · Chiang Mai</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8.2: Create `components/Projects.tsx`**

```typescript
// components/Projects.tsx
'use client'
import { motion } from 'framer-motion'

const projects = [
  {
    name: 'TeamUp',
    role: 'Backend Developer',
    status: 'ongoing',
    stack: ['node.js', 'express', 'mongodb', 'aws'],
    description:
      'Web application for university group formation and management. Built backend APIs for authentication, student profiles, and group joining. Supported AWS deployment and Agile sprint delivery.',
  },
  {
    name: 'Game Library Website',
    role: 'Full Stack Developer',
    status: 'team',
    stack: ['python', 'flask', 'mysql', 'html/css'],
    description:
      'Web app for managing a library of games — users can browse, search, and review titles. Responsive HTML/CSS front end with Flask backend and MySQL data storage.',
  },
  {
    name: 'Personal Data Platform',
    role: 'Developer',
    status: 'capstone',
    stack: ['python', 'sql', 'ux design', 'information modelling'],
    description:
      'Privacy-aware prototype for ethical personal data trading. Applied design thinking, regulatory analysis, and information modelling to shape a system that balanced user needs with compliance.',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="terminal-label mb-6"># section 4 — projects</p>
          <p className="terminal-prompt mb-4">$ ls projects/</p>
          <div className="flex flex-col gap-3">
            {projects.map(p => (
              <div key={p.name} className="terminal-card p-5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-foreground font-semibold text-sm">{p.name}</span>
                  <span className="text-xs text-muted-3 flex-shrink-0 ml-3">{p.status}</span>
                </div>
                <p className="text-xs text-muted-2 mb-3">{p.role}</p>
                <p className="text-sm text-muted leading-relaxed mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map(t => (
                    <span
                      key={t}
                      className="text-xs text-muted-3 border border-border-muted px-1.5 py-0.5 rounded-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8.3: Create `components/Skills.tsx`**

```typescript
// components/Skills.tsx
'use client'
import { motion } from 'framer-motion'

const rows = [
  { label: 'lang', value: 'js  ·  python  ·  java  ·  c#' },
  { label: 'web', value: 'react  ·  next.js  ·  node  ·  express  ·  tailwind  ·  flask' },
  { label: 'db', value: 'mysql  ·  mongodb' },
  { label: 'cloud', value: 'aws', badge: '✓ certified' },
  { label: 'tools', value: 'git  ·  github  ·  android studio' },
  { label: 'focus', value: 'fullstack  ·  backend  ·  ml  ·  ai' },
]

const certs = [
  'AWS Certified Cloud Practitioner',
  'ARIS Business Process Analysis Platform',
  'Certificate of Outstanding Achievement — Java OOP',
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="terminal-label mb-6"># section 5 — skills + cv</p>
          <p className="terminal-prompt mb-4">$ skills --list</p>

          <div className="terminal-card p-5 mb-6">
            <div className="border-l border-border pl-4 space-y-2.5">
              {rows.map(r => (
                <div key={r.label} className="flex gap-4 items-baseline">
                  <span className="text-muted-2 text-xs w-14 flex-shrink-0">{r.label}</span>
                  <span className="text-muted text-sm">
                    {r.value}
                    {r.badge && (
                      <span className="ml-2 text-xs text-foreground">{r.badge}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="terminal-prompt mb-3">$ cat certs.txt</p>
          <div className="border-l border-border pl-4 mb-8 space-y-1.5">
            {certs.map(c => (
              <p key={c} className="text-sm text-muted">→ {c}</p>
            ))}
          </div>

          <a href="/api/cv" className="terminal-btn terminal-btn-primary inline-block">
            [ ↓ download cv ]
          </a>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8.4: Create `components/Contact.tsx`**

```typescript
// components/Contact.tsx
'use client'
import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 pb-32">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="terminal-label mb-6"># section 6 — contact</p>
          <p className="terminal-prompt mb-4">$ open --links</p>
          <div className="border-l border-border pl-5 space-y-3">
            <div className="flex gap-4 items-center">
              <span className="text-muted-2 text-xs w-14 flex-shrink-0">email</span>
              <a
                href="mailto:zli775@aucklanduni.ac.nz"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                → zli775@aucklanduni.ac.nz
              </a>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-muted-2 text-xs w-14 flex-shrink-0">github</span>
              <a
                href="https://github.com/liziang0415"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                → github.com/liziang0415
              </a>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-muted-2 text-xs w-14 flex-shrink-0">linkedin</span>
              <span className="text-sm text-muted-3">→ add your LinkedIn URL here</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8.5: Commit**

```bash
git add components/About.tsx components/Projects.tsx components/Skills.tsx components/Contact.tsx
git commit -m "feat: add About, Projects, Skills, Contact sections"
```

---

## Task 9: Page Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 9.1: Replace `app/page.tsx` with assembled page**

```typescript
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import DevLog from '@/components/DevLog'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import { getTodayEntry } from '@/lib/devlog'

export default async function Home() {
  const todayEntry = await getTodayEntry()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <DevLog entry={todayEntry} />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
```

- [ ] **Step 9.2: Full visual check in browser**

Open `http://localhost:3000` and verify:
- Nav bar with window chrome dots and section links
- Hero with blinking cursor and dot-grid background
- Dev Log section showing the seed entry, remix and modal buttons work
- About, Projects, Skills, Contact scroll-fade in
- CV download button triggers a PDF download
- Past entries modal opens, shows the seed entry, expands on click, closes with Escape or `[x]`

- [ ] **Step 9.3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble single-page layout with all six sections"
```

---

## Task 10: Vercel Deployment

**Files:**
- Create: `vercel.json`

- [ ] **Step 10.1: Create `vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/devlog/generate",
      "schedule": "0 12 * * *"
    }
  ]
}
```

Note: `0 12 * * *` = noon UTC = midnight NZST (UTC+12).

- [ ] **Step 10.2: Push all changes to GitHub**

```bash
git add vercel.json
git commit -m "chore: add Vercel cron config for daily devlog generation"
git push origin main
```

- [ ] **Step 10.3: Connect repo to Vercel**

1. Go to https://vercel.com/new
2. Import repository `liziang0415/personalweb`
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables:
   - `ANTHROPIC_API_KEY` → your API key
   - `CRON_SECRET` → the secret from `.env.local`
5. Click **Deploy**

- [ ] **Step 10.4: Smoke-test production**

Once deployed (URL will be `personalweb-*.vercel.app` or custom domain):

```bash
PROD_URL=https://your-deployment.vercel.app
CRON_SECRET=your-secret

# Trigger generation manually to populate prod devlog
curl -X POST $PROD_URL/api/devlog/generate \
  -H "Authorization: Bearer $CRON_SECRET"
# Expected: {"success":true,"entry":{...}}

# Verify list
curl $PROD_URL/api/devlog/list
# Expected: JSON array with one entry

# Verify remix streams
curl $PROD_URL/api/devlog/remix
# Expected: streaming JSON text

# Verify CV download
curl -I $PROD_URL/api/cv
# Expected: Content-Disposition: attachment; filename="Ziang_Li_CV.pdf"
```

Open the production URL in a browser and verify the full page renders correctly.

- [ ] **Step 10.5: Verify cron in Vercel dashboard**

Go to Vercel dashboard → your project → **Cron Jobs** tab. Confirm the job at `/api/devlog/generate` appears with schedule `0 12 * * *`.

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Single page, 6 sections in correct order (Hero → DevLog → About → Projects → Skills → Contact)
- ✅ Terminal/CMD aesthetic (monospace, `$` prompts, window chrome, B&W palette)
- ✅ Blinking cursor in hero
- ✅ Daily cron generation (Task 10 + generate route)
- ✅ Streaming remix with 3/day localStorage limit
- ✅ Past entries modal with expandable rows, Escape to close
- ✅ CV download via `/api/cv`
- ✅ Particle background (CSS dot grid)
- ✅ All three projects from CV included
- ✅ Skills table + certs from CV
- ✅ Contact links (email, GitHub)
- ✅ Vercel deployment + cron config

**Type consistency:**
- `DevLogEntry` exported from `lib/devlog.ts`, imported in routes and components — consistent across all tasks
- `buildGeneratePrompt` / `buildRemixPrompt` defined in Task 3, used in Task 4 — consistent
- `prependEntry(entry, filePath?)` signature in Task 2 matches all call sites

**One gap found and added:** LinkedIn URL placeholder in Contact.tsx — user needs to fill in their LinkedIn URL before deploying.
