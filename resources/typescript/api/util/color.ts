export class color {

  public static readonly current = new Proxy({ fg: '#000', bg: '#fff', hue: 0 }, {
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

  public static hsvToHex(h: number, s: number, v: number) {
    let rgb = this.hsvToRgb(h, s, v)
    return "#" + ("000000" + this.rgbToHex(rgb.r, rgb.g, rgb.b)).slice(-6)
  }


  public static rgbToHex(r: number, g: number, b: number) {
    if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  public static hsvToRgb(h: number, s: number, v: number) {
    var r: number = 0, g: number = 0, b: number = 0

    var i = Math.floor(h * 6)
    var f = h * 6 - i
    var p = v * (1 - s)
    var q = v * (1 - f * s)
    var t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0: r = v, g = t, b = p; break
      case 1: r = q, g = v, b = p; break
      case 2: r = p, g = v, b = t; break
      case 3: r = p, g = q, b = v; break
      case 4: r = t, g = p, b = v; break
      case 5: r = v, g = p, b = q; break
    }

    return { r: r * 255, g: g * 255, b: b * 255 }
  }
}