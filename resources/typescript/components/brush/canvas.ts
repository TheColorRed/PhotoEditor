import { canvas } from "../../api"

interface point { x: number, y: number }

export default class extends canvas {
  private strokeWidth = 100
  private isDrawing = false
  private lastPoint = { x: 0, y: 0 }

  public mousedown(e: MouseEvent) {
    this.isDrawing = true
    this.draftCtx.lineWidth = this.strokeWidth
    this.draftCtx.lineJoin = this.draftCtx.lineCap = 'round'
    this.draftCtx.shadowBlur = 10
    this.draftCtx.shadowColor = 'red'
    this.draftCtx.strokeStyle = 'red'
    this.draftCtx.fillStyle = 'red'
    this.draft.style.opacity = 0.5.toString()
    this.ctx.globalAlpha = 0.5
    this.lastPoint = { x: this.mouse.x, y: this.mouse.y }
  }

  public mouseup() {
    this.isDrawing = false
    this.ctx.drawImage(this.draft, 0, 0)
    this.draftCtx.clearRect(0, 0, this.width, this.height)
  }

  public mousemove(e: MouseEvent) {
    if (!this.isDrawing) return
    let currentPoint = { x: this.mouse.x, y: this.mouse.y }
    this.draftCtx.beginPath()
    this.draftCtx.moveTo(this.lastPoint.x, this.lastPoint.y)
    this.draftCtx.lineTo(currentPoint.x, currentPoint.y)
    this.draftCtx.stroke()
    this.lastPoint = currentPoint
  }

  public mouseenter() {
    if (!this.canvas) return
    this.canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${this.strokeWidth}" width="${this.strokeWidth}" viewBox="0 0 ${this.strokeWidth} ${this.strokeWidth}"><circle cx="${this.strokeWidth / 2}" cy="${this.strokeWidth / 2}" r="${this.strokeWidth / 2}" stroke="gray" stroke-width="2" fill="transparent" /></svg>') 50 50, auto`
  }

  private distanceBetween(point1: point, point2: point) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
  }

  private angleBetween(point1: point, point2: point) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y)
  }
}