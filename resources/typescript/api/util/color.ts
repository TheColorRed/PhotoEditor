import { plugin } from "..";
import { clamp, normalize01 } from "./number";

export class color {

  public readonly r: number = 0
  public readonly g: number = 0
  public readonly b: number = 0
  public readonly a: number = 255

  public static readonly current = new Proxy({ fg: '#fff', bg: '#000' }, {
    set: (target, key, value) => {
      if (key == 'fg') {
        plugin.broadcast('foregroundColor', value)
      }
      if (key == 'bg') {
        plugin.broadcast('backgroundColor', value)
      }
      return Reflect.set(target, key, value)
    },
    get: (target, key) => Reflect.get(target, key)
  })

  public constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = clamp(r, 0, 255), this.g = clamp(g, 0, 255), this.b = clamp(b, 0, 255), this.a = clamp(a, 0, 255)
  }

  public toString() {
    return `rgba(${this.r},${this.g},${this.b},${normalize01(this.a)})`
  }

  public toHex() {
    return color.rgbToHex(this.r, this.g, this.b)
  }

  public toHsv() {
    return color.rgbToHsv(this.r, this.g, this.b)
  }

  public setForeground() {
    color.current.fg = this.toHex()
  }

  public setBackground() {
    color.current.bg = this.toHex()
  }

  public static hsvToHex(h: number, s: number, v: number) {
    let rgb = this.hsvToRgb(h, s, v)
    return this.rgbToHex(rgb.r, rgb.g, rgb.b)
  }


  public static rgbToHex(r: number, g: number, b: number) {
    if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
    return "#" + (("000000" + ((r << 16) | (g << 8) | b).toString(16))).slice(-6)
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

  public static rgbToHsv(r: number, g: number, b: number) {
    r /= 255, g /= 255, b /= 255

    var max = Math.max(r, g, b), min = Math.min(r, g, b)
    var h: number = 0, s: number, v: number = max

    var d = max - min
    s = max == 0 ? 0 : d / max

    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }

      h /= 6;
    }

    return { h, s, v }
  }
}