import { tool, paths, canvas, color } from "../../../api";
import { toolIcon, toolSetting } from "../../../api/plugin/tool";
import { button } from "../../../api/plugin/canvas";

export class eyeDropperTool extends tool {
  toolName: string = 'Eye Droppper'
  toolbarIcon: toolIcon = { label: 'Eye Dropper', icon: paths.images + '/eye-dropper.svg' }
  settings: toolSetting[] = []
}

export class eyeDropperCanvas extends canvas {
  private selecting = false

  cursor(): string {
    return 'default'
  }

  public mousedown() {
    this.selecting = true
    this.setColor()
  }

  public mousemove() {
    if (!this.selecting && !this.onCanvas) return
    this.setColor()
  }

  public mouseup() {
    this.selecting = false
  }

  private setColor() {
    let data = this.primaryCTX.getImageData(this.mouse.x, this.mouse.y, 1, 1).data
    let rgb = new color(data[0], data[1], data[2])
    if (this.button == button.left) color.current.fg = rgb
    if (this.button == button.right) color.current.bg = rgb
  }
}