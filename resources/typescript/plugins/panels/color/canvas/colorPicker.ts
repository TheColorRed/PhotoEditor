import { panel, color } from "../../../../api";
import { colorPanel } from "..";

export class colorPicker {

  private colorPicker: HTMLCanvasElement
  private pickerRect: ClientRect
  private panel: colorPanel
  private selecting: boolean = false

  public constructor(panel: colorPanel) {
    this.panel = panel
    this.colorPicker = this.panel.panel.querySelector('.picker > canvas:first-child') as HTMLCanvasElement
    this.pickerRect = this.colorPicker.getBoundingClientRect()
  }

  public drawColorPicker(hue: string) {
    let rect = this.panel.panel.getBoundingClientRect()
    this.colorPicker.width = rect.width - 140
    this.colorPicker.height = rect.width - 140
    this.redrawPicker(this.colorPicker, 0, 0, hue)
    window.addEventListener('mouseup', e => { this.selecting = false })
    this.colorPicker.addEventListener('mousedown', (e: MouseEvent) => {
      if (!this.colorPicker) return
      this.selecting = true
      this.pickerRect = this.colorPicker.getBoundingClientRect()
      let mouse = this.mousePosition(e)
      this.setColor(e.button, this.colorPicker.width, this.colorPicker.height, mouse.x, mouse.y, 120)
      this.redrawPicker(this.colorPicker, mouse.x, mouse.y, hue)
    })
    window.addEventListener('mousemove', e => {
      if (!this.colorPicker) return
      if (!this.selecting) return
      let mouse = this.mousePosition(e)
      let x = mouse.x, y = mouse.y
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > this.colorPicker.width) x = this.colorPicker.width
      if (y > this.colorPicker.height) y = this.colorPicker.height
      this.setColor(e.button, this.colorPicker.width, this.colorPicker.height, x, y, 120)
      this.redrawPicker(this.colorPicker, x, y, hue)
    })
    this.colorPicker.addEventListener('mouseleave', (e: MouseEvent) => {
      if (!this.selecting) return
    })
    this.colorPicker.addEventListener('mouseup', (e: MouseEvent) => {
      this.selecting = false
    })
  }

  private setColor(button: number, width: number, height: number, x: number, y: number, h: number) {
    h = h / 360
    let s = x / width
    let v = (height - y) / height
    let hex = color.hsvToHex(h, s, v)
    if (button == 0) color.current.fg = hex
    if (button == 2) color.current.bg = hex
  }

  private redrawPicker(colorPicker: HTMLCanvasElement, x: number, y: number, hue: string) {
    let ctx = colorPicker.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, colorPicker.width, colorPicker.height)
    let hgrad = ctx.createLinearGradient(0, 0, colorPicker.width, 0)
    hgrad.addColorStop(0, '#ffffff')
    hgrad.addColorStop(1, hue)
    ctx.fillStyle = hgrad
    ctx.fillRect(0, 0, colorPicker.width, colorPicker.height)

    let vgrad = ctx.createLinearGradient(0, 0, 0, colorPicker.width)
    vgrad.addColorStop(0, 'rgba(0,0,0,0)')
    vgrad.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.fillStyle = vgrad
    ctx.fillRect(0, 0, colorPicker.width, colorPicker.height)
    ctx.beginPath()
    ctx.strokeStyle = '#000'
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.strokeStyle = '#fff'
    ctx.arc(x, y, 8, 0, 2 * Math.PI)
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