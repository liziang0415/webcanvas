'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { DevLogEntry } from '@/lib/devlog'
import DevLogModal from './DevLogModal'
interface Props { entry: DevLogEntry | null }
export default function DevLog({ entry }: Props) {
  const [modal, setModal] = useState(false)
  return (
    <section id="devlog" className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <p className="terminal-label mb-6"># section 2 — dev log</p>
          <p className="terminal-prompt mb-3">$ cat devlog/today.md</p>
          <div className="terminal-card p-5 mb-5">
            {entry ? (
              <>
                <p className="text-xs text-muted-2 mb-3">-- {entry.date}</p>
                <h3 className="text-foreground text-base font-semibold mb-3 leading-snug">&ldquo;{entry.title}&rdquo;</h3>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-wrap">{entry.body}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {entry.tags.map(t => <span key={t} className="text-xs text-muted-3 border border-border-muted px-1.5 py-0.5 rounded-sm">{t}</span>)}
                </div>
              </>
            ) : (
              <p className="text-muted text-sm">no entry today — check back later.</p>
            )}
          </div>
          <button onClick={() => setModal(true)} className="terminal-btn">$ ls devlog/</button>
        </motion.div>
      </div>
      <DevLogModal open={modal} onClose={() => setModal(false)} />
    </section>
  )
}
