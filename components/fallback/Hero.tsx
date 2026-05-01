'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
export default function Hero() {
  const [cursor, setCursor] = useState(true)
  useEffect(() => { const t = setInterval(() => setCursor(c => !c), 530); return () => clearInterval(t) }, [])
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 particles-bg pointer-events-none" aria-hidden="true" />
      <motion.div className="relative z-10 max-w-3xl mx-auto w-full pt-20" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
        <p className="terminal-prompt mb-2">$ whoami</p>
        <h1 className="font-mono text-5xl md:text-7xl font-bold text-foreground leading-none mb-3">
          Ziang Li
          <span className="inline-block w-[3px] h-[0.9em] bg-foreground ml-1 align-middle" style={{ opacity: cursor ? 1 : 0, transition:'opacity 0.05s' }} aria-hidden="true" />
        </h1>
        <p className="font-mono text-muted text-sm md:text-base mb-10">{'// full-stack · backend · ml · auckland, nz'}</p>
        <div className="flex flex-wrap gap-3">
          <a href="#projects" className="terminal-btn">[ projects ]</a>
          <a href="#skills"   className="terminal-btn">[ skills ]</a>
          <a href="/api/cv"   className="terminal-btn terminal-btn-primary">[ ↓ download cv ]</a>
        </div>
      </motion.div>
    </section>
  )
}
