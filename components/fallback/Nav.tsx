'use client'
import { useEffect, useState } from 'react'
const links = [
  { href: '#devlog', label: '~/devlog' }, { href: '#about', label: '~/about' },
  { href: '#projects', label: '~/projects' }, { href: '#skills', label: '~/skills' },
  { href: '#contact', label: '~/contact' },
]
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${scrolled ? 'bg-surface border-b border-border' : ''}`}>
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-6">
        <div className="flex gap-1.5">
          {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-border" />)}
        </div>
        <span className="font-mono text-xs text-muted-3 flex-1 text-center hidden sm:block">ziang.li — bash</span>
        <div className="hidden md:flex gap-5">
          {links.map(l => <a key={l.href} href={l.href} className="font-mono text-xs text-muted hover:text-foreground transition-colors">{l.label}</a>)}
        </div>
      </div>
    </nav>
  )
}
