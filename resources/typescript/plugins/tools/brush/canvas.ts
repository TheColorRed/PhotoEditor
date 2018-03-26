import { canvas, color, point } from "../../../api"
import { clamp } from "../../../api/util/number";
import { project } from "../../../api/util/project";

export class brushCanvas extends canvas {
  private lineWidth: number = 100
  private opacity: number = 1
  private softness: number = 50


  private isDrawing = false
  private lastPoint: point = { x: 0, y: 0 }

  private brush: HTMLCanvasElement = this.createBrush(color.current.fg)

  public ready() {
    this.lineWidth = this.toolSettings.default('size') as number
    this.opacity = parseFloat((this.toolSettings.default('opacity') as number / 100).toString())
    this.softness = parseFloat((this.toolSettings.default('softness') as number).toString())
  }

  public onSettingChanged(key: string) {
    if (key == 'size') this.lineWidth = this.toolSettings.current(key) as number
    if (key == 'opacity') this.opacity = parseFloat((this.toolSettings.current(key) as number / 100).toString())
    if (key == 'softness') this.softness = parseFloat((this.toolSettings.current(key) as number).toString())
  }

  public mousedown(e: MouseEvent) {
    if (!this.onCanvas || e.button != 0) return
    this.isDrawing = true
    this.brush = this.createBrush(color.current.fg)
    project.active.setOpacity(this.opacity)
    this.lastPoint = { x: this.mouse.x, y: this.mouse.y }
    this.draw(this.lastPoint)
  }

  public mouseup() {
    this.isDrawing = false
    // this.apply()
  }

  public mousemove(e: MouseEvent) {
    if (!this.isDrawing) return
    let currentPoint = { x: this.mouse.x, y: this.mouse.y }
    this.draw(currentPoint)
    this.lastPoint = currentPoint
  }

  private createBrush(color: color): HTMLCanvasElement {
    let size = this.lineWidth
    let canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = size, canvas.height = size
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    let grad = ctx.createRadialGradient(size / 2, size / 2, size / 2, size / 2, size / 2, 0)
    grad.addColorStop(0, color.setAlpha(0).toString())
    grad.addColorStop(this.softness / 100, color.setAlpha(this.softness / 100 * 255).toString())
    grad.addColorStop(1, color.setAlpha(255).toString())
    ctx.fillStyle = grad
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    ctx.clip()
    ctx.fillRect(0, 0, size, size)
    return canvas
  }

  private draw(currentPoint: point) {
    if (!project.active.layers.active) return
    project.active.toActiveLayer((ctx) => {
      // let ctx = project.active.ctxDraft
      ctx.beginPath()
      ctx.moveTo(this.lastPoint.x, this.lastPoint.y)
      ctx.lineTo(currentPoint.x, currentPoint.y)
      this.brushLine(this.lastPoint, currentPoint)
      this.apply()
    })
  }

  private brushLine(lastPoint: point, currentPoint: point) {
    let active = project.active.layers.active
    if (!active) return
    let x1 = lastPoint.x, x2 = currentPoint.x, y1 = lastPoint.y, y2 = currentPoint.y
    let bw = this.lineWidth, bh = this.lineWidth

    var diffX = Math.abs(x2 - x1),
      diffY = Math.abs(y2 - y1),
      dist = Math.sqrt(diffX * diffX + diffY * diffY),
      step = (this.softness / 100 * (this.lineWidth / 4)),// bw / (dist ? dist : 1),
      i = 0,
      t = 0,
      b, x, y;

    while (i <= dist) {
      t = Math.max(0, Math.min(1, i / dist));
      x = x1 + (x2 - x1) * t;
      y = y1 + (y2 - y1) * t;
      b = (Math.random() * 3) | 0;
      active.ctx.drawImage(this.brush, x - bw * 0.5, y - bh * 0.5);
      i += step
    }

    // let distance = parseInt(this.distanceBetween2Points(lastPoint, currentPoint).toString())
    // let angle = this.angleBetween2Points(lastPoint, currentPoint)
    // let x = 0, y = 0
    // let steps = (this.softness / 100 * (this.lineWidth / 4))
    // for (let z = 0; (z <= distance || z == 0); z += steps) {
    //   x = lastPoint.x + (Math.sin(angle) * z) - (this.lineWidth / 2)
    //   y = lastPoint.y + (Math.cos(angle) * z) - (this.lineWidth / 2)
    //   this.draftCTX.drawImage(this.brush, x, y)
    // }
  }

  private distanceBetween2Points(point1: point, point2: point) {
    let dx = point2.x - point1.x
    let dy = point2.y - point1.y
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  }

  private angleBetween2Points(point1: point, point2: point) {
    let dx = point2.x - point1.x
    let dy = point2.y - point1.y
    return Math.atan2(dx, dy)
  }


  public cursor() {
    return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${this.lineWidth}" width="${this.lineWidth}"><circle cx="${this.lineWidth / 2}" cy="${this.lineWidth / 2}" r="${this.lineWidth / 2}" stroke="gray" stroke-width="2" fill="transparent" /></svg>') ${this.lineWidth / 2} ${this.lineWidth / 2}, auto`
  }
}