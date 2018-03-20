import * as path from 'path'

export { plugin, pluginGroup } from './plugin/plugin'
export { canvas } from './plugin/canvas'
export { tool } from './plugin/tool'
export { panel } from './plugin/panel'

export { addon, addons, addonType } from './plugin'

export const paths = {
  images: path.join(__dirname, '../../', 'assets/images').replace(/\\/g, '/'),
  fonts: path.join(__dirname, '../../', 'assets/fonts').replace(/\\/g, '/')
}