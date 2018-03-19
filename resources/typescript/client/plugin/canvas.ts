import { plugin, pluginGroup } from "./plugin";
import { tool, toolSettings } from "./tool";

export interface canvas {
  mousedown(event: MouseEvent): void
  mousemove(event: MouseEvent): void
  mouseup(event: MouseEvent): void
  mouseenter(event: MouseEvent): void
  mouseleave(event: MouseEvent): void
}

export abstract class canvas extends plugin {
  protected primaryCanvas: HTMLCanvasElement
  protected primaryCTX: CanvasRenderingContext2D
  protected draft: HTMLCanvasElement
  protected draftCtx: CanvasRenderingContext2D
  protected rect: ClientRect = document.body.getBoundingClientRect()
  protected mouse: { x: number, y: number } = { x: 0, y: 0 }

  protected get width() { return this.primaryCanvas.width }
  protected get height() { return this.primaryCanvas.height }
  protected get toolSettings() {
    let plug = plugin.plugins.find(p => p.id == this.groupid) as pluginGroup
    let t = plug.plugins.find(p => p instanceof tool) as tool
    return new toolSettings(t.settings)
  }

  public constructor(groupid: string) {
    super(groupid)
    this.primaryCanvas = document.querySelector('canvas#primary') as HTMLCanvasElement
    this.primaryCTX = this.primaryCanvas.getContext('2d') as CanvasRenderingContext2D
    this.rect = this.primaryCanvas.getBoundingClientRect()
    this.draft = document.querySelector('canvas#draft') as HTMLCanvasElement
    this.draftCtx = this.draft.getContext('2d') as CanvasRenderingContext2D

    typeof this.mousedown == 'function' && window.addEventListener('mousedown', this.mousedown.bind(this))
    typeof this.mousemove == 'function' && window.addEventListener('mousemove', this.mousemove.bind(this))
    typeof this.mouseup == 'function' && window.addEventListener('mouseup', this.mouseup.bind(this))
    typeof this.mouseenter == 'function' && this.primaryCanvas.addEventListener('mouseenter', this.mouseenter.bind(this))
    typeof this.mouseleave == 'function' && this.primaryCanvas.addEventListener('mouseleave', this.mouseleave.bind(this))
    window.addEventListener('mousemove', this.mouseMovement.bind(this))
  }

  protected apply() {
    this.primaryCTX.drawImage(this.draft, 0, 0)
    this.draftCtx.clearRect(0, 0, this.width, this.height)
  }

  private mouseMovement(e: MouseEvent) {
    this.mouse.x = e.clientX - this.rect.left
    this.mouse.y = e.clientY - this.rect.top
  }

  public resized() {
    this.rect = this.primaryCanvas.getBoundingClientRect()
  }
}