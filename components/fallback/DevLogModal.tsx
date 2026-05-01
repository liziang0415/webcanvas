'use client'
import { useEffect, useState } from 'react'
import type { DevLogEntry } from '@/lib/devlog'
interface Props { open: boolean; onClose: () => void }
export default function DevLogModal({ open, onClose }: Props) {
  const [entries, setEntries] = useState<DevLogEntry[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  useEffect(() => { if (open) fetch('/api/devlog/list').then(r => r.json()).then(setEntries) }, [open])
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-sm w-full max-w-lg max-h-[80vh] flex flex-col font-mono shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-border">
          <span className="text-sm terminal-prompt">$ ls devlog/</span>
          <button onClick={onClose} className="text-muted hover:text-foreground text-sm">[x]</button>
        </div>
        <div className="overflow-y-auto p-3 flex flex-col gap-2">
          {entries.length === 0 && <p className="text-center text-muted text-sm py-6">no entries yet</p>}
          {entries.map(entry => (
            <div key={entry.date} className="border border-border rounded-sm overflow-hidden">
              <button className="w-full text-left px-3 py-2.5 hover:bg-[#1a1a1a] transition-colors flex items-baseline gap-3" onClick={() => setExpanded(expanded === entry.date ? null : entry.date)}>
                <span className="text-xs text-muted-2 flex-shrink-0">{entry.date}</span>
                <span className="text-sm text-muted">{entry.title}</span>
              </button>
              {expanded === entry.date && (
                <div className="px-3 pb-3 border-t border-border">
                  <p className="text-sm text-muted leading-relaxed mt-3 whitespace-pre-wrap">{entry.body}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.tags.map(t => <span key={t} className="text-xs text-muted-3 border border-border-muted px-1.5 py-0.5 rounded-sm">{t}</span>)}
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
