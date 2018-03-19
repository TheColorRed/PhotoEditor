import { plugin } from "..";

export interface canvas {
  mousedown(event: MouseEvent): void
  mousemove(event: MouseEvent): void
  mouseup(event: MouseEvent): void
  mouseenter(event: MouseEvent): void
  mouseleave(event: MouseEvent): void
}
export abstract class canvas extends plugin {

  protected canvas: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D
  protected draft: HTMLCanvasElement
  protected draftCtx: CanvasRenderingContext2D
  protected rect: ClientRect = document.body.getBoundingClientRect()
  protected mouse: { x: number, y: number } = { x: 0, y: 0 }

  protected get width() { return this.canvas.width }
  protected get height() { return this.canvas.height }

  public constructor(canvas: HTMLCanvasElement) {
    super()
    this.canvas = canvas
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.rect = canvas.getBoundingClientRect()
    this.draft = document.querySelector('canvas#draft') as HTMLCanvasElement
    this.draftCtx = this.draft.getContext('2d') as CanvasRenderingContext2D

    typeof this.mousedown == 'function' && window.addEventListener('mousedown', this.mousedown.bind(this))
    typeof this.mousemove == 'function' && window.addEventListener('mousemove', this.mousemove.bind(this))
    typeof this.mouseup == 'function' && window.addEventListener('mouseup', this.mouseup.bind(this))
    typeof this.mouseenter == 'function' && canvas.addEventListener('mouseenter', this.mouseenter.bind(this))
    typeof this.mouseleave == 'function' && canvas.addEventListener('mouseleave', this.mouseleave.bind(this))
    window.addEventListener('mousemove', this.mouseMovement.bind(this))
  }

  private mouseMovement(e: MouseEvent) {
    this.mouse.x = e.clientX - this.rect.left
    this.mouse.y = e.clientY - this.rect.top
  }

  public resized() {
    this.rect = this.canvas.getBoundingClientRect()
  }
}