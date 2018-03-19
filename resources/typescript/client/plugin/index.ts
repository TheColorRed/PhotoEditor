import { canvas } from './canvas'
import { tool, toolSettings, toolIcon } from './tool'
import { plugin } from './plugin'
export interface addons {
  tool?: addonType<tool>
  canvas?: addonType<canvas>
}

export interface addon {
  tool?: tool
  canvas?: canvas
}

// export function registerPlugin(addon: addons) {
//   plugin.registerPlugin(addon)
// }

// export function getCanvas(id: string) {
//   let c = plugin.plugins.find(p => p.canvas instanceof canvas && p.canvas.id == id)
//   return c && c.canvas
// }

// export function getTool(id: string) {
//   let t = plugin.plugins.find(p => p.tool instanceof tool && p.tool.id == id)
//   return t && t.tool
// }

export interface addonType<T extends plugin> {
  new(): T
}

export interface toolPlugin {
  name: string
  settings: toolSettings
  icon: toolIcon
}