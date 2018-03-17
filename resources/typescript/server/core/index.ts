import * as path from 'path'
export * from './plugin/plugin'
export * from './plugin/tools'

export const paths = {
  images: path.join(__dirname, '../../../', 'assets/images').replace(/\\/g, '/'),
  fonts: path.join(__dirname, '../../../', 'assets/fonts').replace(/\\/g, '/')
}