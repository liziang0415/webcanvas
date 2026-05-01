'use client'
import { motion } from 'framer-motion'
const rows = [
  { label:'lang',  value:'js  ·  python  ·  java  ·  c#' },
  { label:'web',   value:'react  ·  next.js  ·  node  ·  express  ·  tailwind  ·  flask' },
  { label:'db',    value:'mysql  ·  mongodb' },
  { label:'cloud', value:'aws', badge:'✓ certified' },
  { label:'tools', value:'git  ·  github  ·  android studio' },
  { label:'focus', value:'fullstack  ·  backend  ·  ml  ·  ai' },
]
const certs = ['AWS Certified Cloud Practitioner','ARIS Business Process Analysis Platform','Certificate of Outstanding Achievement — Java OOP']
export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <p className="terminal-label mb-6"># section 5 — skills + cv</p>
          <p className="terminal-prompt mb-4">$ skills --list</p>
          <div className="terminal-card p-5 mb-6">
            <div className="border-l border-border pl-4 space-y-2.5">
              {rows.map(r => (
                <div key={r.label} className="flex gap-4 items-baseline">
                  <span className="text-muted-2 text-xs w-14 flex-shrink-0">{r.label}</span>
                  <span className="text-muted text-sm">{r.value}{r.badge && <span className="ml-2 text-xs text-foreground">{r.badge}</span>}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="terminal-prompt mb-3">$ cat certs.txt</p>
          <div className="border-l border-border pl-4 mb-8 space-y-1.5">
            {certs.map(c => <p key={c} className="text-sm text-muted">→ {c}</p>)}
          </div>
          <a href="/api/cv" className="terminal-btn terminal-btn-primary inline-block">[ ↓ download cv ]</a>
        </motion.div>
      </div>
    </section>
  )
}
