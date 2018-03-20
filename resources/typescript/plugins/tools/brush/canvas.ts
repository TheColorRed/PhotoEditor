import { canvas } from "../../../api"

interface point { x: number, y: number }

export class brushCanvas extends canvas {
  private lineWidth: number = 100// parseFloat(this.toolSettings.get('size').default.toString())
  private isDrawing = false
  private opacity: number = 1
  private lastPoint: point = { x: 0, y: 0 }

  public ready() {
    this.lineWidth = this.toolSettings.default('size') as number
    this.opacity = parseFloat((this.toolSettings.default('opacity') as number / 100).toString())
  }

  public onSettingChanged(key: string) {
    if (key == 'size') this.lineWidth = this.toolSettings.current(key) as number
    if (key == 'opacity') this.opacity = parseFloat((this.toolSettings.current(key) as number / 100).toString())
  }

  public mousedown(e: MouseEvent) {
    this.isDrawing = true
    this.draftCtx.lineWidth = this.lineWidth
    this.draftCtx.lineJoin = this.draftCtx.lineCap = 'round'
    this.draftCtx.shadowBlur = 10
    this.draftCtx.shadowColor = 'red'
    this.draftCtx.strokeStyle = 'red'
    this.draftCtx.fillStyle = 'red'
    this.draft.style.opacity = this.opacity.toString()
    this.primaryCTX.globalAlpha = this.opacity
    this.lastPoint = { x: this.mouse.x, y: this.mouse.y }
    this.draw(this.lastPoint)
  }

  public mouseup() {
    this.isDrawing = false
    this.apply()
  }

  public mousemove(e: MouseEvent) {
    if (!this.isDrawing) return
    let currentPoint = { x: this.mouse.x, y: this.mouse.y }
    this.draw(currentPoint)
    this.lastPoint = currentPoint
  }

  private draw(currentPoint: point) {
    this.draftCtx.beginPath()
    this.draftCtx.moveTo(this.lastPoint.x, this.lastPoint.y)
    this.draftCtx.lineTo(currentPoint.x, currentPoint.y)
    this.draftCtx.stroke()
  }

  public mouseenter() {
    if (!this.primaryCanvas) return
    this.primaryCanvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${this.lineWidth}" width="${this.lineWidth}"><circle cx="${this.lineWidth / 2}" cy="${this.lineWidth / 2}" r="${this.lineWidth / 2}" stroke="gray" stroke-width="2" fill="transparent" /></svg>') ${this.lineWidth / 2} ${this.lineWidth / 2}, auto`
  }
}