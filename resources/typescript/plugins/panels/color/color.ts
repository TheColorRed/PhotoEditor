import { panel, canvas } from '../../../api'
import { colorPicker } from './canvas/colorPicker';
import { huePicker } from './canvas/huePicker';
export class colorPanel extends panel {

  public render() {
    let colorPallet = document.createElement('div')
    colorPallet.innerHTML = `
      <div class="row">
        <div class="selected-colors">
          <div class="color fg"></div>
          <div class="color bg"></div>
        </div>
        <div class="picker">
          <canvas></canvas>
          <canvas></canvas>
        </div>
      </div>
    `
    return colorPallet
  }

  public postRender() {
    let cp = new colorPicker(this)
    let hp = new huePicker(this)
    cp.drawColorPicker('#0f0')
    hp.drawHuePicker('#0f0')
  }

}