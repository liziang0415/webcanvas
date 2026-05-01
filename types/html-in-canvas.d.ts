// TypeScript augmentations for the html-in-canvas WICG experimental API
// https://github.com/WICG/html-in-canvas
export {}
declare global {
  interface CanvasRenderingContext2D {
    drawElementImage(element: Element, dx: number, dy: number): void
    drawElementImage(element: Element, dx: number, dy: number, dw: number, dh: number): void
  }
  interface HTMLCanvasElement {
    onpaint: ((event: Event) => void) | null
    requestPaint(): void
  }
}
