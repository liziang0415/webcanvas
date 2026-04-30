// TypeScript augmentations for the html-in-canvas WICG experimental API
interface CanvasRenderingContext2D {
  drawElementImage(element: Element, dx: number, dy: number): void
  drawElementImage(element: Element, dx: number, dy: number, dw: number, dh: number): void
}
interface HTMLCanvasElement {
  onpaint: ((event: Event) => void) | null
  requestPaint(): void
}
