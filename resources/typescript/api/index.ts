import * as path from 'path'

export { getCanvas, getTool, registerPlugin } from '../server/core/plugin'
export { canvas } from '../server/core/plugin/canvas'
export { tool } from '../server/core/plugin/tools'

export const paths = {
  images: path.join(__dirname, '../../', 'assets/images').replace(/\\/g, '/'),
  fonts: path.join(__dirname, '../../', 'assets/fonts').replace(/\\/g, '/')
}