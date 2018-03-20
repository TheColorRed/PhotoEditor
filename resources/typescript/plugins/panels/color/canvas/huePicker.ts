import { colorPanel } from "..";

export class huePicker {

  private panel: colorPanel
  private huePicker: HTMLCanvasElement
  private hueRect: ClientRect
  private selecting: boolean = false

  public constructor(panel: colorPanel) {
    this.panel = panel
    this.huePicker = this.panel.panel.querySelector('.picker > canvas:last-child') as HTMLCanvasElement
    this.hueRect = this.huePicker.getBoundingClientRect()
  }

  public drawHuePicker(hue: string) {
    let rect = this.panel.panel.getBoundingClientRect()
    this.huePicker.width = 20
    this.huePicker.height = rect.width - 140
    let ctx = this.huePicker.getContext('2d')
    if (!ctx) return
    let vgrad = ctx.createLinearGradient(0, 0, 0, this.huePicker.height)
    vgrad.addColorStop(0, '#f00')
    vgrad.addColorStop(0.15, '#f0f')
    vgrad.addColorStop(0.325, '#00f')
    vgrad.addColorStop(0.50, '#0ff')
    vgrad.addColorStop(0.675, '#0f0')
    vgrad.addColorStop(0.85, '#ff0')
    vgrad.addColorStop(1, '#f00')
    ctx.fillStyle = vgrad
    ctx.fillRect(0, 0, this.huePicker.width, this.huePicker.height)


    window.addEventListener('mouseup', e => { this.selecting = false })
    this.huePicker.addEventListener('mousedown', (e: MouseEvent) => {
      if (!this.huePicker) return
      this.selecting = true
      this.hueRect = this.huePicker.getBoundingClientRect()
      let mouse = this.mousePosition(e)
      // this.setColor(e.button, this.huePicker.width, this.huePicker.height, mouse.x, mouse.y, 120)
      // this.redrawPicker(this.huePicker, mouse.x, mouse.y, hue)
    })
  }

  private mousePosition(e: MouseEvent) {
    if (!this.hueRect) return { x: 0, y: 0 }
    return {
      x: e.clientX - this.hueRect.left,
      y: e.clientY - this.hueRect.top
    }
  }
}