import { brushCanvas } from './canvas'
import { brushTool } from './tool'
import { registerPlugin } from '../../api'

registerPlugin({
  tool: brushTool,
  canvas: brushCanvas
})