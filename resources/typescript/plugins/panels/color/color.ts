import { panel, canvas, color } from '../../../api'
import { colorPicker } from './canvas/colorPicker';
import { huePicker } from './canvas/huePicker';
export class colorPanel extends panel {

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

  public foregroundColor(value: string) {
    let div = this.panel.querySelector('.color.fg') as HTMLDivElement
    if (div) div.style.background = value
  }

  public backgroundColor(value: string) {
    let div = this.panel.querySelector('.color.bg') as HTMLDivElement
    if (div) div.style.background = value
  }

  public postRender() {
    let cp = new colorPicker(this)
    let hp = new huePicker(this, cp)
    cp.drawColorPicker()
    hp.drawHuePicker()
  }

}