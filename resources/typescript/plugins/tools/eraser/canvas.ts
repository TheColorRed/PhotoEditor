import { canvas, point, color } from "../../../api";
import { project } from "../../../api/util/project";

export class eraserCanvas extends canvas {
  private lineWidth: number = 100
  private isErasing = false
  private opacity: number = 1
  private lastPoint: point = { x: 0, y: 0 }

  public ready() {
    this.lineWidth = this.toolSettings.default('size') as number
    // this.opacity = this.toolSettings.default('opacity') as number / 100
  }

  public onSettingChanged(key: string) {
    if (key == 'size') this.lineWidth = this.toolSettings.current(key) as number
    // if (key == 'opacity') this.opacity = this.toolSettings.current(key) as number / 100
  }

  public mousedown(e: MouseEvent) {
    if (!this.onCanvas || e.button != 0) return
    this.isErasing = true
    if (!project.active.layers.active) return
    let ctx = project.active.layers.active.ctx
    ctx.lineWidth = this.lineWidth
    ctx.lineJoin = ctx.lineCap = 'round'
    ctx.globalCompositeOperation = 'destination-out'
    ctx.strokeStyle = 'rgba(0,0,0,1)'
    ctx.fillStyle = 'rgba(0,0,0,1)'
    this.lastPoint = { x: this.mouse.x, y: this.mouse.y }
    this.erase(this.lastPoint)
  }

  public mousemove(e: MouseEvent) {
    if (!this.isErasing) return
    let currentPoint = { x: this.mouse.x, y: this.mouse.y }
    this.erase(currentPoint)
    this.lastPoint = currentPoint
  }

  public mouseup(e: MouseEvent) {
    this.isErasing = false
  }

  private erase(currentPoint: point) {
    project.active.toActiveLayer((ctx) => {
      // let ctx = project.active.ctxPrimary
      ctx.beginPath()
      ctx.moveTo(this.lastPoint.x, this.lastPoint.y)
      ctx.lineTo(currentPoint.x, currentPoint.y)
      ctx.stroke()
      project.active.updateMainCanvas()
    })
  }

  public cursor() {
    return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${this.lineWidth}" width="${this.lineWidth}"><circle cx="${this.lineWidth / 2}" cy="${this.lineWidth / 2}" r="${this.lineWidth / 2}" stroke="gray" stroke-width="2" fill="transparent" /></svg>') ${this.lineWidth / 2} ${this.lineWidth / 2}, auto`
  }
}