import { panel, canvas, color } from '../../../api'
import { colorPicker } from './canvas/colorPicker';
import { huePicker } from './canvas/huePicker';
export class colorPanel extends panel {

  protected key: string = 'panel-colors'
  protected label: string = 'Colors'
  public panelGroup: number = 0
  protected cp?: colorPicker
  protected hp?: huePicker
  protected fg?: HTMLDivElement
  protected bg?: HTMLDivElement

  public render() {
    let colorPallet = document.createElement('div')
    colorPallet.innerHTML = `
      <div class="row">
        <div class="selected-colors">
          <div class="color fg" style="background:${color.current.fg}"></div>
          <div class="color bg" style="background:${color.current.bg}"></div>
        </div>
        <div class="picker">
          <canvas></canvas>
          <canvas></canvas>
        </div>
      </div>
    `
    return colorPallet
  }

  public onForegroundColor(value: color) {
    if (this.fg) this.fg.style.background = value.toHex()
  }

  public onBackgroundColor(value: color) {
    if (this.bg) this.bg.style.background = value.toHex()
  }

  public postRender() {
    this.cp = new colorPicker(this)
    this.hp = new huePicker(this, this.cp)
    this.cp.drawColorPicker()
    this.hp.drawHuePicker()
    this.fg = this.panel.querySelector('.color.fg') as HTMLDivElement
    this.bg = this.panel.querySelector('.color.bg') as HTMLDivElement
    this.onForegroundColor(color.current.fg)
    this.onBackgroundColor(color.current.bg)
  }

}