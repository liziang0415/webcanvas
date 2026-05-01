'use client'
import { motion } from 'framer-motion'
export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <p className="terminal-label mb-6"># section 3 — about</p>
          <p className="terminal-prompt mb-4">$ cat about.txt</p>
          <div className="border-l border-border pl-5 space-y-4">
            <p className="text-sm text-muted leading-relaxed">MIT student at the University of Auckland, focused on Machine Learning and AI. I enjoy backend and full-stack development — turning ideas into practical, user-focused applications across web, cloud, and AI projects.</p>
            <p className="text-sm text-muted leading-relaxed">I work with AI tools like Claude Code as part of my development workflow, and I&apos;m interested in the intersection of software engineering and applied ML.</p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-2 pt-1">
              <span>AWS Certified ✓</span><span>English · Chinese</span><span>Volunteer Teacher · Chiang Mai</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
