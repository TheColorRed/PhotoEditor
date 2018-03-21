import { colorPanel } from "..";
import { color, point } from "../../../../api";
import { colorPicker } from "./colorPicker";

export class huePicker {

  private panel: colorPanel
  private cp: colorPicker
  private huePicker: HTMLCanvasElement
  private hueRect: ClientRect
  private selecting: boolean = false
  private mouse: point = { x: 0, y: 0 }
  private button = 0

  public constructor(panel: colorPanel, cp: colorPicker) {
    this.panel = panel
    this.cp = cp
    this.huePicker = this.panel.panel.querySelector('.picker > canvas:last-child') as HTMLCanvasElement
    this.hueRect = this.huePicker.getBoundingClientRect()
    color.current.fg = '#fff'
    color.current.bg = '#000'
  }

  public drawHuePicker() {
    let rect = this.panel.panel.getBoundingClientRect()
    this.huePicker.width = 20
    this.huePicker.height = rect.width - 140
    this.redrawHuePicker()

    window.addEventListener('mouseup', e => { this.selecting = false })
    this.huePicker.addEventListener('mousedown', (e: MouseEvent) => {
      if (!this.huePicker) return
      this.selecting = true
      this.button = e.button
      this.hueRect = this.huePicker.getBoundingClientRect()
      this.mousePosition(e)
      this.setHue()
      this.redrawHuePicker()
    })

    window.addEventListener('mousemove', e => {
      if (!this.huePicker) return
      if (!this.selecting) return
      this.mousePosition(e)
      let x = this.mouse.x, y = this.mouse.y
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > this.huePicker.width) x = this.huePicker.width
      if (y > this.huePicker.height) y = this.huePicker.height
      this.mouse.x = x
      this.mouse.y = y
      this.setHue()
      this.redrawHuePicker()
    })

    this.huePicker.addEventListener('mouseleave', (e: MouseEvent) => {
      if (!this.selecting) return
    })

    this.huePicker.addEventListener('mouseup', (e: MouseEvent) => {
      this.selecting = false
    })
  }

  private setHue() {
    let p = (this.huePicker.height - this.mouse.y) / this.huePicker.height
    this.cp.setHue(p * 360)
    this.cp.redrawPicker(this.button)
  }

  private redrawHuePicker() {
    let ctx = this.huePicker.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, this.huePicker.width, this.huePicker.height)
    let vgrad = ctx.createLinearGradient(0, 0, 0, this.huePicker.height)
    vgrad.addColorStop(0, '#f00')
    vgrad.addColorStop(0.166, '#f0f')
    vgrad.addColorStop(0.332, '#00f')
    vgrad.addColorStop(0.500, '#0ff')
    vgrad.addColorStop(0.666, '#0f0')
    vgrad.addColorStop(0.832, '#ff0')
    vgrad.addColorStop(1, '#f00')
    ctx.fillStyle = vgrad
    ctx.fillRect(0, 0, this.huePicker.width, this.huePicker.height)
    this.redrawCursor()
  }

  private redrawCursor() {
    let ctx = this.huePicker.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#000'
    ctx.moveTo(0, this.mouse.y)
    ctx.lineTo(this.huePicker.width, this.mouse.y)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#fff'
    ctx.moveTo(0, this.mouse.y - 2)
    ctx.lineTo(this.huePicker.width, this.mouse.y - 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#fff'
    ctx.moveTo(0, this.mouse.y + 2)
    ctx.lineTo(this.huePicker.width, this.mouse.y + 2)
    ctx.stroke()
  }

  private mousePosition(e: MouseEvent) {
    if (!this.hueRect) return { x: 0, y: 0 }
    this.mouse.x = e.clientX - this.hueRect.left
    this.mouse.y = e.clientY - this.hueRect.top
  }
}