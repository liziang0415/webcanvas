'use client'
import { motion } from 'framer-motion'
export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 pb-32">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <p className="terminal-label mb-6"># section 6 — contact</p>
          <p className="terminal-prompt mb-4">$ open --links</p>
          <div className="border-l border-border pl-5 space-y-3">
            <div className="flex gap-4 items-center">
              <span className="text-muted-2 text-xs w-14 flex-shrink-0">email</span>
              <a href="mailto:zli775@aucklanduni.ac.nz" className="text-sm text-muted hover:text-foreground transition-colors">→ zli775@aucklanduni.ac.nz</a>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-muted-2 text-xs w-14 flex-shrink-0">github</span>
              <a href="https://github.com/liziang0415" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">→ github.com/liziang0415</a>
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
