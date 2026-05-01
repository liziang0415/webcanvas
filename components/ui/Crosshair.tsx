'use client'
interface Props { visible: boolean }
export default function Crosshair({ visible }: Props) {
  if (!visible) return null
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
      <div style={{ position: 'relative', width: 16, height: 16 }}>
        <div style={{ position: 'absolute', top: 7, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.55)' }} />
        <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.55)' }} />
      </div>
    </div>
  )
}
