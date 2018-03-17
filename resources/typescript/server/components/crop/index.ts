import { tool, registerPlugin } from "../../api";
import { paths } from "../../core";

export class cropTool extends tool {
  public toolName = 'Crop'
  public toobarIcon = { label: 'Crop', icon: paths.images + '/crop.svg' }
  public settings = []
}

registerPlugin({
  tool: cropTool
})
