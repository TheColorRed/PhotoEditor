import { canvas, color, point } from "../../../api"

export class brushCanvas extends canvas {
  private lineWidth: number = 100
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
    if (!this.onCanvas || e.button != 0) return
    this.isDrawing = true
    this.draftCTX.lineWidth = this.lineWidth
    this.draftCTX.lineJoin = this.draftCTX.lineCap = 'round'
    this.draftCTX.shadowBlur = 10
    this.draftCTX.shadowColor = e.ctrlKey ? color.current.bg.toHex() : color.current.fg.toHex()
    this.draftCTX.strokeStyle = e.ctrlKey ? color.current.bg.toHex() : color.current.fg.toHex()
    this.draftCTX.fillStyle = e.ctrlKey ? color.current.bg.toHex() : color.current.fg.toHex()
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
    this.draftCTX.beginPath()
    this.draftCTX.moveTo(this.lastPoint.x, this.lastPoint.y)
    this.draftCTX.lineTo(currentPoint.x, currentPoint.y)
    this.draftCTX.stroke()
  }

  public cursor() {
    return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${this.lineWidth}" width="${this.lineWidth}"><circle cx="${this.lineWidth / 2}" cy="${this.lineWidth / 2}" r="${this.lineWidth / 2}" stroke="gray" stroke-width="2" fill="transparent" /></svg>') ${this.lineWidth / 2} ${this.lineWidth / 2}, auto`
  }
}