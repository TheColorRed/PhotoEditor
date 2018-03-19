import { paths, tool, registerPlugin } from "../../api";

export class cropTool extends tool {
  public toolName = 'Crop'
  public toolbarIcon = { label: 'Crop', icon: paths.images + '/crop.svg' }
  public settings = []
}

registerPlugin({
  tool: cropTool
})
