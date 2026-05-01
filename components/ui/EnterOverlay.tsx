'use client'
interface Props { visible: boolean; onEnter: () => void }
export default function EnterOverlay({ visible, onEnter }: Props) {
  if (!visible) return null
  return (
    <div
      onClick={onEnter}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer"
      style={{ background: 'rgba(5,5,10,0.88)', backdropFilter: 'blur(6px)' }}
    >
      <p className="font-mono text-xs text-muted-2 tracking-widest uppercase mb-6">Ziang Li — Portfolio</p>
      <div className="font-mono text-foreground text-sm border border-border px-6 py-3 hover:border-foreground transition-colors">
        [ click to explore ]
      </div>
      <p className="font-mono text-xs text-muted-3 mt-6">WASD to move · mouse to look · ESC to exit</p>
      <p className="font-mono text-xs mt-2" style={{ color: '#1e1e1e' }}>
        requires Chromium 147+ · enable chrome://flags/#canvas-draw-element
      </p>
    </div>
  )
}
