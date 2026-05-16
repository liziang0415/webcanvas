import type { CSSProperties } from "react";
import { HeroSignal, MagneticAnchor, ScrollProgress } from "./portfolio-motion";
import { TrendingRepositories } from "./trending-repositories";

const navItems = [
  ["Home", "#home"],
  ["Log", "#dev-log"],
  ["About", "#about"],
  ["Work", "#work"],
  ["Stack", "#stack"],
  ["Contact", "#contact"],
] as const;

const projects = [
  {
    title: "TeamUp",
    type: "Collaboration platform",
    body: "Course-team formation, authentication flows, student profiles, and group joining APIs for university workflows.",
    stack: ["Node.js", "Express", "MongoDB"],
    metric: "AWS",
    href: "https://github.com/UOA-CS732-S1-2026/group-project-404-again",
  },
  {
    title: "Game Library",
    type: "Collection interface",
    body: "A responsive catalog for browsing, searching, and reviewing games with a Python backend and relational storage.",
    stack: ["HTML/CSS", "Flask", "MySQL"],
    metric: "Team",
    href: "https://github.com/liziang0415/zli775-group-work",
  },
  {
    title: "Personal Data Platform",
    type: "Private analytics",
    body: "A capstone prototype for privacy-aware personal data trading, shaped through UX research and information modelling.",
    stack: ["Python", "SQL", "UX Design"],
    metric: "Capstone",
    href: "https://github.com/liziang0415/DATA-MARKETPLACE",
  },
  {
    title: "FakeBust",
    type: "AI verification tool",
    body: "An AI-powered fake news detector with multilingual input, confidence scoring, shareable reports, and MongoDB-backed evaluation history.",
    stack: ["Next.js", "TypeScript", "Gemini API"],
    metric: "Vercel",
    href: "https://github.com/liziang0415/FakeBust",
  },
  {
    title: "WebCanvas",
    type: "3D portfolio room",
    body: "A Three.js portfolio room that renders live HTML pages inside canvas-driven 3D screens with a maintainable Next.js workflow.",
    stack: ["Three.js", "Canvas API", "Tailwind CSS"],
    metric: "3D",
    href: "https://github.com/liziang0415/webcanvas",
  },
];

const stackGroups = [
  ["Languages", ["JavaScript", "TypeScript", "Python", "Java", "C#"]],
  ["Frontend", ["React", "Next.js", "Vite", "Tailwind CSS", "Three.js"]],
  ["Backend", ["Node.js", "Express", "Flask", "REST APIs"]],
  ["Systems", ["MySQL", "MongoDB", "AWS", "Vercel", "GitHub"]],
] as const;

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <ScrollProgress />
      <div className="grain-layer" aria-hidden="true" />
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(146,214,203,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(146,214,203,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <header className="fixed inset-x-0 top-0 z-30 border-b border-border/80 bg-background/78 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <a href="#home" className="font-sans text-base font-semibold tracking-tight">
            Ziang Li
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3 py-2 text-sm text-muted transition duration-300 hover:bg-surface hover:text-foreground active:translate-y-px"
              >
                {label}
              </a>
            ))}
          </div>
          <MagneticAnchor
            href="/Ziang_Li_CV.pdf"
            className="rounded-full border border-foreground/18 bg-foreground px-4 py-2 text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(232,239,238,0.35)] transition hover:bg-signal active:translate-y-px"
          >
            Download CV
          </MagneticAnchor>
        </nav>
      </header>

      <section
        id="home"
        className="relative mx-auto grid min-h-[78dvh] w-full max-w-[1400px] grid-cols-1 content-center gap-12 px-4 pb-12 pt-24 sm:px-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:px-10"
      >
        <HeroSignal />
        <div className="relative z-10 max-w-[760px]">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-signal">
            Backend, AI, fullstack systems
          </p>
          <h1 className="text-[clamp(3rem,6vw,6.25rem)] font-semibold leading-[0.9] tracking-tighter text-foreground">
            I build calm software for messy problems.
          </h1>
          <p className="mt-8 max-w-[62ch] text-lg leading-8 text-muted sm:text-xl">
            I am Ziang Li, a Master of Information Technology student at the
            University of Auckland with a completed Bachelor of Science in
            Computer Science and Information and Technology Management. I focus
            on backend systems, ML and AI experiments, and interfaces that feel
            precise instead of noisy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["#Ziang", "#Fullstack", "#AI", "#Backend"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface/70 px-4 py-2 font-mono text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <aside className="relative z-10 self-end lg:pb-10">
          <div className="console-panel">
            <div className="mb-8 flex items-center justify-between border-b border-border pb-4 font-mono text-xs text-muted">
              <span>portfolio.kernel</span>
              <span className="live-dot">online</span>
            </div>
            <div className="space-y-6 font-mono text-sm">
              <div>
                <p className="text-muted-2">current_focus</p>
                <p className="mt-2 text-foreground">AI-assisted fullstack systems</p>
              </div>
              <div>
                <p className="text-muted-2">location</p>
                <p className="mt-2 text-foreground">Auckland, New Zealand</p>
              </div>
              <div>
                <p className="text-muted-2">working_style</p>
                <p className="mt-2 text-foreground">
                  prototype with AI tools, trace the backend path, document the
                  tradeoffs
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <TrendingRepositories />

      <section id="about" className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 border-t border-border pt-12 lg:grid-cols-[0.6fr_1.4fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">About</p>
            <h2 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Student, builder, steady debugger.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_0.72fr]">
            <article className="border border-border bg-surface/55 p-6">
              <p className="text-lg leading-8 text-muted">
                My path sits between practical software engineering and
                learning-heavy experimentation: backend APIs, fullstack product
                work, cloud foundations, machine learning coursework, 3D web
                experiments, and AI-assisted prototyping with Claude Code,
                Codex, and Stitch.
              </p>
            </article>
            <div className="grid gap-4 font-mono text-sm">
              <div className="border border-border bg-surface/40 p-5">
                <p className="text-muted-2">education</p>
                <p className="mt-3 text-foreground">
                  MIT, University of Auckland
                </p>
                <p className="mt-2 text-muted">
                  Focus: Machine Learning and Artificial Intelligence
                </p>
              </div>
              <div className="border border-border bg-surface/40 p-5">
                <p className="text-muted-2">bachelor</p>
                <p className="mt-3 text-foreground">
                  BSc, Computer Science and IT Management
                </p>
                <p className="mt-2 text-muted">University of Auckland, 2022-2025</p>
              </div>
              <div className="border border-border bg-surface/40 p-5">
                <p className="text-muted-2">certificate</p>
                <p className="mt-3 text-foreground">AWS Certified Cloud Practitioner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="border-t border-border pt-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.42fr_1fr]">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Selected work
            </h2>
            <div className="grid gap-4">
              {projects.map((project, index) => (
                <a
                  key={project.title}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="project-row reveal-block group grid gap-6 border border-border bg-surface/40 p-5 transition duration-300 hover:border-signal/45 hover:bg-surface active:translate-y-px md:grid-cols-[1fr_0.65fr_7rem]"
                  style={{ "--index": index } as CSSProperties}
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-2">
                      {project.type}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight group-hover:text-signal">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-[56ch] text-sm leading-7 text-muted">{project.body}</p>
                  </div>
                  <div className="flex flex-wrap content-start gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="font-mono text-sm text-signal md:text-right">
                    {project.metric}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="stack" className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 border-t border-border pt-12 lg:grid-cols-[1fr_1.35fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Tech stack</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Practical tools, carefully arranged.
            </h2>
          </div>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {stackGroups.map(([group, items]) => (
              <div key={group} className="border-t border-border pt-5">
                <h3 className="text-xl font-semibold tracking-tight">{group}</h3>
                <ul className="mt-5 space-y-3 text-sm text-muted">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="h-px w-5 bg-signal/70" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-[1400px] px-4 py-24 sm:px-6 lg:px-10">
        <div className="grid gap-10 border-t border-border pt-12 lg:grid-cols-[1.15fr_0.85fr]">
          <h2 className="text-[clamp(3rem,7vw,7.5rem)] font-semibold leading-[0.9] tracking-tighter">
            Let&apos;s build the useful thing.
          </h2>
          <div className="self-end">
            <p className="max-w-[48ch] text-lg leading-8 text-muted">
              I am open to backend, AI, and fullstack roles where craft and
              systems thinking both matter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticAnchor
                href="mailto:zli775@aucklanduni.ac.nz"
                className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:bg-signal active:translate-y-px"
              >
                Email
              </MagneticAnchor>
              <MagneticAnchor
                href="https://github.com/liziang0415"
                className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:border-signal hover:text-signal active:translate-y-px"
              >
                GitHub
              </MagneticAnchor>
              <MagneticAnchor
                href="/Ziang_Li_CV.pdf"
                className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:border-signal hover:text-signal active:translate-y-px"
              >
                CV
              </MagneticAnchor>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 font-mono text-xs text-muted-2 md:flex-row md:items-center md:justify-between">
          <span>Ziang Li</span>
          <span>Built with Next.js, Tailwind CSS, and Framer Motion.</span>
        </div>
      </footer>
    </main>
  );
}
