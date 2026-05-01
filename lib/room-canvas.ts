// lib/room-canvas.ts
// html-in-canvas WICG API integration.
// Pipeline per screen:
//   staging canvas  (off-screen) → layoutsubtree child → drawElementImage on paint
//   mirror canvas   (regular)    ← drawImage from staging each frame
//   CanvasTexture                ← backed by mirror, needsUpdate on change
import * as THREE from 'three'

export interface ScreenPipeline {
  texture:         THREE.CanvasTexture
  sync():          void   // call once per render frame
  requestRepaint(): void  // force re-capture (e.g. after content update)
  dispose():       void
}

export function createScreenPipeline(
  width: number,
  height: number,
  html: string
): ScreenPipeline {
  // ── Staging canvas ────────────────────────────────────────────────────────
  const staging = document.createElement('canvas')
  staging.width  = width
  staging.height = height
  // layoutsubtree goes on the CANVAS itself — this opts the canvas into
  // html-in-canvas mode, allowing drawElementImage to capture its DOM children.
  staging.setAttribute('layoutsubtree', '')
  // Position off-screen but keep in DOM (required for layout participation)
  staging.style.cssText =
    `position:fixed;left:-${width + 20}px;top:0;width:${width}px;height:${height}px;pointer-events:none;`
  document.body.appendChild(staging)

  const stagingCtx = staging.getContext('2d')!

  // Content element — regular child of the staging canvas (no layoutsubtree on it).
  // HTML is injected directly (not via iframe) to stay same-origin — cross-origin
  // iframes would be tainted and produce blank textures under the WICG spec.
  const contentEl = document.createElement('div')
  contentEl.style.cssText = `width:${width}px;height:${height}px;overflow:hidden;`
  contentEl.innerHTML = html
  staging.appendChild(contentEl)

  // ── Mirror canvas ─────────────────────────────────────────────────────────
  // Regular HTMLCanvasElement that Three.js reads. Pixels are copied from
  // staging every frame via drawImage.
  const mirror = document.createElement('canvas')
  mirror.width  = width
  mirror.height = height
  const mirrorCtx = mirror.getContext('2d')!

  const texture = new THREE.CanvasTexture(mirror)
  texture.minFilter      = THREE.LinearFilter
  texture.magFilter      = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.colorSpace     = THREE.SRGBColorSpace

  let dirty = false

  // html-in-canvas paint callback — fires when the layoutsubtree element changes.
  // onpaint is assigned without optional chaining: RoomGate already verified
  // drawElementImage exists before this code runs, so the full API is present.
  staging.onpaint = () => {
    stagingCtx.clearRect(0, 0, width, height)
    stagingCtx.drawElementImage(contentEl, 0, 0)
    dirty = true
  }

  // requestPaint uses optional chaining defensively for environments where
  // the API surface is partially polyfilled or the call is a no-op.
  staging.requestPaint?.()

  function sync() {
    if (!dirty) return
    mirrorCtx.clearRect(0, 0, width, height)
    mirrorCtx.drawImage(staging, 0, 0)
    texture.needsUpdate = true
    dirty = false
  }

  function requestRepaint() {
    staging.requestPaint?.()
  }

  function dispose() {
    texture.dispose()
    if (staging.parentNode) document.body.removeChild(staging)
  }

  return { texture, sync, requestRepaint, dispose }
}
