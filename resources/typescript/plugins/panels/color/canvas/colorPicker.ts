import { panel, color } from "../../../../api";
import { colorPanel } from "..";

export class colorPicker {

  private colorPicker: HTMLCanvasElement
  private pickerRect: ClientRect
  private panel: colorPanel
  private selecting: boolean = false
  private hue = 0

  private cursorX = 0
  private cursorY = 0
  private button = 0

  public constructor(panel: colorPanel) {
    this.panel = panel
    this.colorPicker = this.panel.panel.querySelector('.picker > canvas:first-child') as HTMLCanvasElement
    this.pickerRect = this.colorPicker.getBoundingClientRect()
  }

  public backgroundColor(value: string) {
    let div = this.panel.panel.querySelector('.color.bg') as HTMLDivElement
    if (div) div.style.background = value
  }

  public setHue(h: number) {
    this.hue = h
  }

  public drawColorPicker() {
    let rect = this.panel.panel.getBoundingClientRect()
    this.colorPicker.width = rect.width - 140
    this.colorPicker.height = rect.width - 140
    this.redrawPicker()
    this.redrawCursor()
    this.colorPicker.addEventListener('mousedown', (e: MouseEvent) => {
      if (!this.colorPicker) return
      this.selecting = true
      this.pickerRect = this.colorPicker.getBoundingClientRect()
      let mouse = this.mousePosition(e)
      this.cursorX = mouse.x
      this.cursorY = mouse.y
      this.button = e.button
      this.redrawPicker()
      this.redrawCursor()
      this.setColor()
    })
    window.addEventListener('mouseup', e => { this.selecting = false })
    window.addEventListener('mousemove', e => {
      if (!this.colorPicker) return
      if (!this.selecting) return
      let mouse = this.mousePosition(e)
      let x = mouse.x, y = mouse.y
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > this.colorPicker.width) x = this.colorPicker.width
      if (y > this.colorPicker.height) y = this.colorPicker.height
      this.cursorX = x
      this.cursorY = y
      this.redrawPicker()
      this.redrawCursor()
      this.setColor()
    })
    this.colorPicker.addEventListener('mouseleave', (e: MouseEvent) => {
      if (!this.selecting) return
    })
    this.colorPicker.addEventListener('mouseup', (e: MouseEvent) => {
      this.selecting = false
    })
  }

  public setColor() {
    let s = this.cursorX / this.colorPicker.width
    let v = (this.colorPicker.height - this.cursorY) / this.colorPicker.height
    let hex = color.hsvToHex(this.hue, s, v)
    if (this.button == 0) color.current.fg = color.fromHsv(this.hue, s, v)
    if (this.button == 2) color.current.bg = color.fromHsv(this.hue, s, v)
  }

  public setCursor(x: number, y: number) {
    this.cursorX = x, this.cursorY = y
  }

  public redrawPicker(button: number = 0) {
    if ([0, 1].indexOf(button) > -1) this.button = button
    let ctx = this.colorPicker.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, this.colorPicker.width, this.colorPicker.height)
    let hgrad = ctx.createLinearGradient(0, 0, this.colorPicker.width, 0)
    hgrad.addColorStop(0, '#ffffff')
    hgrad.addColorStop(1, color.hsvToHex(this.hue, 1, 1))
    ctx.fillStyle = hgrad
    ctx.fillRect(0, 0, this.colorPicker.width, this.colorPicker.height)

    let vgrad = ctx.createLinearGradient(0, 0, 0, this.colorPicker.width)
    vgrad.addColorStop(0, 'rgba(0,0,0,0)')
    vgrad.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.fillStyle = vgrad
    ctx.fillRect(0, 0, this.colorPicker.width, this.colorPicker.height)
    this.redrawCursor()
  }

  public redrawCursor() {
    let ctx = this.colorPicker.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.strokeStyle = '#000'
    ctx.arc(this.cursorX, this.cursorY, 6, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.strokeStyle = '#fff'
    ctx.arc(this.cursorX, this.cursorY, 8, 0, 2 * Math.PI)
    ctx.stroke()
  }

  private mousePosition(e: MouseEvent) {
    if (!this.pickerRect) return { x: 0, y: 0 }
    return {
      x: e.clientX - this.pickerRect.left,
      y: e.clientY - this.pickerRect.top
    }
  }
}