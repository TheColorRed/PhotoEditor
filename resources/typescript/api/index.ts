import * as path from 'path'

export { canvas } from '../client/plugin/canvas'
export { tool } from '../client/plugin/tool'

export const paths = {
  images: path.join(__dirname, '../../', 'assets/images').replace(/\\/g, '/'),
  fonts: path.join(__dirname, '../../', 'assets/fonts').replace(/\\/g, '/')
}