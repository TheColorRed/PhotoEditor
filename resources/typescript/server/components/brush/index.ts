import { tool, registerPlugin } from "../../api";
import { paths } from "../../core";

export class brushTool extends tool {
  public toolName = 'Brush'
  public toobarIcon = { label: 'Brush', icon: paths.images + '/paint-brush.svg' }
  public settings = [
    {
      label: 'Size',
      type: 'units',
      min: 0,
      max: 2000,
      default: 50
    }
  ]
}

registerPlugin({
  tool: brushTool
})
