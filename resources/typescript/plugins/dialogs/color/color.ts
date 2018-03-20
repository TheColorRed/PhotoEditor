import { panel, canvas } from '../../../api'
export class color extends panel {

  private colors = new Proxy({ fg: '#000', bg: '#fff' }, {
    set: (target, key, value) => {
      if (key == 'fg') {
        let fg = document.querySelector('.color.fg') as HTMLDivElement
        if (fg) fg.style.background = value
      }
      if (key == 'bg') {
        let bg = document.querySelector('.color.bg') as HTMLDivElement
        if (bg) bg.style.background = value
      }
      return Reflect.set(target, key, value)
    },
    get: (target, key) => Reflect.get(target, key)
  })

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
    this.drawColorPicker('#0f0')
    this.drawHuePicker()
  }

  private drawColorPicker(hue: string) {
    let colorPicker = this.panel.querySelector('.picker > canvas:first-child') as HTMLCanvasElement
    let rect = this.panel.getBoundingClientRect()
    colorPicker.width = rect.width - 140
    colorPicker.height = rect.width - 140
    let ctx = colorPicker.getContext('2d')
    if (!ctx) return
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
    let selecting = false
    let pickerRect = colorPicker.getBoundingClientRect()
    window.addEventListener('mouseup', e => { selecting = false })
    colorPicker.addEventListener('mousedown', e => {
      selecting = true
      this.setColor(e.button, colorPicker.width, colorPicker.height, e.clientX - pickerRect.left, e.clientY - pickerRect.top, 120)
    })
    window.addEventListener('mousemove', e => {
      if (!selecting) return
      let x = e.clientX - pickerRect.left, y = e.clientY - pickerRect.top
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > colorPicker.width) x = colorPicker.width
      if (y > colorPicker.height) y = colorPicker.height
      this.setColor(e.button, colorPicker.width, colorPicker.height, x, y, 120)
    })
    colorPicker.addEventListener('mouseleave', e => {
      if (!selecting) return
    })
    colorPicker.addEventListener('mouseup', e => {
      selecting = false
    })
  }

  private setColor(button: number, width: number, height: number, x: number, y: number, h: number) {
    h = h / 360
    let s = x / width
    let l = (height - y) / height
    let rgb = this.hsvToRgb(h, s, l)
    let hex = "#" + ("000000" + this.rgbToHex(rgb[0], rgb[1], rgb[2])).slice(-6)
    if (button == 0) this.colors.fg = hex
    if (button == 2) this.colors.bg = hex
  }

  private drawHuePicker() {
    let huePicker = this.panel.querySelector('.picker > canvas:last-child') as HTMLCanvasElement
    console.log(huePicker)
    let rect = this.panel.getBoundingClientRect()
    huePicker.width = 20
    huePicker.height = rect.width - 140
    let ctx = huePicker.getContext('2d')
    if (!ctx) return
    let vgrad = ctx.createLinearGradient(0, 0, 0, huePicker.height)
    vgrad.addColorStop(0, '#f00')
    vgrad.addColorStop(0.15, '#f0f')
    vgrad.addColorStop(0.325, '#00f')
    vgrad.addColorStop(0.50, '#0ff')
    vgrad.addColorStop(0.675, '#0f0')
    vgrad.addColorStop(0.85, '#ff0')
    vgrad.addColorStop(1, '#f00')
    ctx.fillStyle = vgrad
    ctx.fillRect(0, 0, huePicker.width, huePicker.height)

  }

  private rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  private
  private hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
  }

}