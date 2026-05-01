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
  // Keep in viewport at opacity:0 — browsers skip painting truly off-screen
  // elements, which would prevent drawElementImage from ever getting a paint
  // record. opacity:0 keeps it in the render tree while hiding it from users.
  staging.style.cssText =
    `position:fixed;left:0;top:0;width:${width}px;height:${height}px;opacity:0;pointer-events:none;z-index:-1;`
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
    try {
      stagingCtx.clearRect(0, 0, width, height)
      stagingCtx.drawElementImage(contentEl, 0, 0)
      dirty = true
    } catch {
      // "No cached paint record" — element not yet laid out by the browser.
      // Request another paint on the next animation frame to retry.
      requestAnimationFrame(() => staging.requestPaint?.())
    }
  }

  // Delay the initial requestPaint until the browser has completed at least
  // one layout pass — otherwise the element has no paint record yet.
  requestAnimationFrame(() => staging.requestPaint?.())

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
