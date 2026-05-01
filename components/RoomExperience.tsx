// components/RoomExperience.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { createRoomScene } from '@/lib/room-scene'
import { createScreenPipeline } from '@/lib/room-canvas'
import { createRoomControls } from '@/lib/room-controls'
import { getProjectsScreenHTML, getDevLogScreenHTML, getAboutScreenHTML } from '@/lib/screen-content'
import EnterOverlay from './ui/EnterOverlay'
import Crosshair from './ui/Crosshair'
import type { DevLogEntry } from '@/lib/devlog'

interface Props { todayEntry: DevLogEntry | null }

export default function RoomExperience({ todayEntry }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const canvas  = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    // ── Scene ────────────────────────────────────────────────────────────
    const { camera, renderer, screenMeshes, resize, render } = createRoomScene(canvas)

    // Force initial size — canvas.clientWidth is 0 at useEffect time before
    // the browser has completed a layout pass, so we use window dimensions.
    const initW = canvas.clientWidth  || window.innerWidth
    const initH = canvas.clientHeight || window.innerHeight
    renderer.setSize(initW, initH, false)
    camera.aspect = initW / initH
    camera.updateProjectionMatrix()

    // ── Screen pipelines ─────────────────────────────────────────────────
    const monitorP = createScreenPipeline(1200, 750,  getProjectsScreenHTML())
    const tvP      = createScreenPipeline(1120, 630,  getDevLogScreenHTML(todayEntry))
    const posterP  = createScreenPipeline(560,  800,  getAboutScreenHTML())

    // Apply textures to screen meshes
    const monitorMat = screenMeshes.monitor.material as THREE.MeshBasicMaterial
    const tvMat      = screenMeshes.tv.material      as THREE.MeshBasicMaterial
    const posterMat  = screenMeshes.poster.material  as THREE.MeshBasicMaterial
    monitorMat.map = monitorP.texture
    tvMat.map      = tvP.texture
    posterMat.map  = posterP.texture
    monitorMat.needsUpdate = true
    tvMat.needsUpdate      = true
    posterMat.needsUpdate  = true

    // ── Controls ─────────────────────────────────────────────────────────
    const controls = createRoomControls(overlay, camera, setLocked)

    // ── Render loop ──────────────────────────────────────────────────────
    let raf: number
    let prev = performance.now()
    let lastTvRepaint = 0

    function loop() {
      raf = requestAnimationFrame(loop)
      const now = performance.now()
      const dt  = Math.min((now - prev) / 1000, 0.1)
      prev = now

      resize()
      controls.update(dt)

      // Repaint TV ~30 Hz to keep any CSS animations alive in the content
      if (now - lastTvRepaint > 33) {
        tvP.requestRepaint()
        lastTvRepaint = now
      }

      monitorP.sync()
      tvP.sync()
      posterP.sync()
      render()
    }

    loop()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      controls.dispose()
      monitorP.dispose()
      tvP.dispose()
      posterP.dispose()
      renderer.dispose()
    }
  }, [todayEntry])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div ref={overlayRef} className="absolute inset-0">
        <EnterOverlay
          visible={!locked}
          onEnter={() => overlayRef.current?.requestPointerLock()}
        />
        <Crosshair visible={locked} />
      </div>
    </div>
  )
}
