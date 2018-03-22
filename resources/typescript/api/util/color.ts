import { plugin } from "..";
import { clamp, normalize01 } from "./number";

export class color {

  public readonly r: number = 0
  public readonly g: number = 0
  public readonly b: number = 0
  public readonly a: number = 255

  public static get white() { return new color(255, 255, 255) }
  public static get black() { return new color(0, 0, 0) }

  public static readonly current = new Proxy({ fg: color.white, bg: color.black }, {
    set: (target: { [key: string]: color }, property, value) => {
      let prop = property.toString()
      let oldValue = target[prop]
      Reflect.set(target, property, value)
      if (value == oldValue) return true
      if (property == 'fg') {
        plugin.broadcast('foregroundColor', value)
      }
      if (property == 'bg') {
        plugin.broadcast('backgroundColor', value)
      }
      return true
    },
    get: (target, key): color => Reflect.get(target, key) as color
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
    color.current.fg = this
  }

  public setBackground() {
    color.current.bg = this
  }

  public static fromHsv(h: number, s: number, v: number) {
    let rgb = color.hsvToRgb(h, s, v)
    return new color(rgb.r, rgb.g, rgb.b)
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

    return new color(r * 255, g * 255, b * 255)
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

  public static hexToRgb(hex: string) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    })

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as string[]
    return new color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16))
    // return result ? {
    //   r: parseInt(result[1], 16),
    //   g: parseInt(result[2], 16),
    //   b: parseInt(result[3], 16)
    // } : null;
  }

}