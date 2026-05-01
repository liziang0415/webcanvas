// lib/screen-content.ts
// Self-contained HTML string templates for the three 3D room screens.
// Inline CSS only — Tailwind classes are not available in off-screen canvases.
// Target resolutions: monitor 1200×750, tv 1120×630, poster 560×800.

const MONO = `'Courier New', 'Lucida Console', monospace`
const BASE = `* { box-sizing: border-box; margin: 0; padding: 0; } body, html { width: 100%; height: 100%; overflow: hidden; }`

// ── MONITOR (back wall) — Projects — 1200×750 ──────────────────────────────
export function getProjectsScreenHTML(): string {
  return `<!DOCTYPE html><html><head><style>
    ${BASE}
    body { background:#0a0a0a; color:#fff; font-family:${MONO}; padding:32px; display:flex; flex-direction:column; }
    .label { color:#333; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin-bottom:10px; }
    .prompt { color:#444; font-size:13px; margin-bottom:24px; }
    .grid { display:flex; flex-direction:column; gap:12px; flex:1; }
    .card { border:1px solid #1e1e1e; background:#111; border-radius:2px; padding:16px 18px; flex:1; }
    .card-header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px; }
    .card-name { color:#fff; font-size:15px; font-weight:700; }
    .card-status { color:#333; font-size:10px; }
    .card-role { color:#444; font-size:11px; margin-bottom:10px; }
    .card-desc { color:#555; font-size:12px; line-height:1.65; margin-bottom:12px; }
    .tags { display:flex; gap:6px; flex-wrap:wrap; }
    .tag { border:1px solid #1e1e1e; color:#333; font-size:10px; padding:2px 8px; border-radius:2px; }
  </style></head><body>
    <div class="label"># projects</div>
    <div class="prompt">$ ls projects/</div>
    <div class="grid">
      <div class="card">
        <div class="card-header"><span class="card-name">TeamUp</span><span class="card-status">ongoing</span></div>
        <div class="card-role">Backend Developer</div>
        <div class="card-desc">Web app for university group formation. Backend APIs for authentication, student profiles, and group joining. AWS deployment and Agile sprint delivery.</div>
        <div class="tags"><span class="tag">node.js</span><span class="tag">express</span><span class="tag">mongodb</span><span class="tag">aws</span></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-name">Game Library Website</span><span class="card-status">team</span></div>
        <div class="card-role">Full Stack Developer</div>
        <div class="card-desc">Browse, search, and review games. Responsive HTML/CSS front end with Flask backend and MySQL data storage.</div>
        <div class="tags"><span class="tag">python</span><span class="tag">flask</span><span class="tag">mysql</span><span class="tag">html/css</span></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-name">Personal Data Platform</span><span class="card-status">capstone</span></div>
        <div class="card-role">Developer</div>
        <div class="card-desc">Privacy-aware prototype for ethical personal data trading. Design thinking, information modelling, regulatory analysis.</div>
        <div class="tags"><span class="tag">python</span><span class="tag">sql</span><span class="tag">ux design</span></div>
      </div>
    </div>
  </body></html>`
}

// ── TV (right wall) — Dev Log — 1120×630 ─────────────────────────────────
export function getDevLogScreenHTML(entry: {
  date: string; title: string; body: string; tags: string[]
} | null): string {
  const bodyHTML = entry
    ? `<div class="meta">-- ${entry.date}</div>
       <div class="title">"${entry.title}"</div>
       <div class="body">${entry.body.replace(/\n/g, '<br/><br/>')}</div>
       <div class="tags">${entry.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
    : `<div class="body" style="color:#333">no entry today — check back later.</div>`

  return `<!DOCTYPE html><html><head><style>
    ${BASE}
    body { background:#0a0a0a; color:#fff; font-family:${MONO}; padding:32px; display:flex; flex-direction:column; }
    .label { color:#333; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin-bottom:10px; }
    .prompt { color:#444; font-size:13px; margin-bottom:16px; }
    .badge { display:inline-block; border:1px solid #2a2a2a; color:#333; font-size:9px; padding:2px 8px; border-radius:2px; margin-bottom:16px; letter-spacing:1px; }
    .card { border:1px solid #1e1e1e; background:#111; border-radius:2px; padding:24px; flex:1; }
    .meta { color:#333; font-size:11px; margin-bottom:12px; }
    .title { color:#fff; font-size:16px; font-weight:700; margin-bottom:16px; line-height:1.4; }
    .body { color:#555; font-size:13px; line-height:1.75; margin-bottom:20px; }
    .tags { display:flex; gap:6px; flex-wrap:wrap; }
    .tag { border:1px solid #1e1e1e; color:#333; font-size:10px; padding:2px 8px; border-radius:2px; }
  </style></head><body>
    <div class="label"># dev log</div>
    <div class="prompt">$ cat devlog/today.md</div>
    <div class="badge">STATIC ENTRY</div>
    <div class="card">${bodyHTML}</div>
  </body></html>`
}

// ── POSTER (left wall) — About + Skills + Contact — 560×800 ──────────────
export function getAboutScreenHTML(): string {
  return `<!DOCTYPE html><html><head><style>
    ${BASE}
    body { background:#0a0a0a; color:#fff; font-family:${MONO}; padding:28px; display:flex; flex-direction:column; gap:20px; }
    .label { color:#333; font-size:10px; letter-spacing:3px; text-transform:uppercase; margin-bottom:8px; }
    .prompt { color:#444; font-size:12px; margin-bottom:10px; }
    .name { font-size:22px; font-weight:700; color:#fff; margin-bottom:4px; }
    .tagline { color:#444; font-size:11px; margin-bottom:12px; }
    .bio { color:#555; font-size:11px; line-height:1.7; border-left:1px solid #1e1e1e; padding-left:12px; }
    hr { border:none; border-top:1px solid #111; }
    .row { display:flex; gap:8px; align-items:baseline; margin-bottom:6px; }
    .lbl { color:#333; font-size:10px; width:44px; flex-shrink:0; }
    .val { color:#555; font-size:10px; line-height:1.5; }
    .badge { color:#fff; font-size:9px; margin-left:4px; }
    .cv-btn { margin-top:4px; border:1px solid #fff; color:#fff; font-family:${MONO}; font-size:11px; padding:6px 14px; display:inline-block; border-radius:2px; }
  </style></head><body>
    <div>
      <div class="label"># about</div>
      <div class="prompt">$ cat about.txt</div>
      <div class="name">Ziang Li</div>
      <div class="tagline">// full-stack · backend · ml · auckland, nz</div>
      <div class="bio">MIT student at UoA, focused on ML/AI. I build backend systems and full-stack applications. AWS certified. English + Chinese.</div>
    </div>
    <hr/>
    <div>
      <div class="label"># skills</div>
      <div class="prompt">$ skills --list</div>
      <div class="row"><span class="lbl">lang</span><span class="val">js · python · java · c#</span></div>
      <div class="row"><span class="lbl">web</span><span class="val">react · next.js · node · express · tailwind</span></div>
      <div class="row"><span class="lbl">db</span><span class="val">mysql · mongodb</span></div>
      <div class="row"><span class="lbl">cloud</span><span class="val">aws<span class="badge">✓</span></span></div>
      <div class="row"><span class="lbl">focus</span><span class="val">fullstack · backend · ml · ai</span></div>
    </div>
    <hr/>
    <div>
      <div class="label"># contact</div>
      <div class="prompt">$ open --links</div>
      <div class="row"><span class="lbl">email</span><span class="val">→ zli775@aucklanduni.ac.nz</span></div>
      <div class="row"><span class="lbl">github</span><span class="val">→ github.com/liziang0415</span></div>
      <div class="row"><span class="lbl">linkedin</span><span class="val">→ add your LinkedIn here</span></div>
      <div class="cv-btn">[ ↓ download cv ]</div>
    </div>
  </body></html>`
}
