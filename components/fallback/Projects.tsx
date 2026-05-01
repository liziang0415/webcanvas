'use client'
import { motion } from 'framer-motion'
const projects = [
  { name:'TeamUp', role:'Backend Developer', status:'ongoing', stack:['node.js','express','mongodb','aws'], description:'Web app for university group formation. APIs for auth, profiles, group joining. AWS deployment.' },
  { name:'Game Library Website', role:'Full Stack Developer', status:'team', stack:['python','flask','mysql','html/css'], description:'Browse, search, and review games. Flask backend with MySQL, responsive HTML/CSS front end.' },
  { name:'Personal Data Platform', role:'Developer', status:'capstone', stack:['python','sql','ux design'], description:'Privacy-aware prototype for ethical personal data trading. Design thinking and regulatory analysis.' },
]
export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <p className="terminal-label mb-6"># section 4 — projects</p>
          <p className="terminal-prompt mb-4">$ ls projects/</p>
          <div className="flex flex-col gap-3">
            {projects.map(p => (
              <div key={p.name} className="terminal-card p-5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-foreground font-semibold text-sm">{p.name}</span>
                  <span className="text-xs text-muted-3 ml-3">{p.status}</span>
                </div>
                <p className="text-xs text-muted-2 mb-3">{p.role}</p>
                <p className="text-sm text-muted leading-relaxed mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.stack.map(t => <span key={t} className="text-xs text-muted-3 border border-border-muted px-1.5 py-0.5 rounded-sm">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
