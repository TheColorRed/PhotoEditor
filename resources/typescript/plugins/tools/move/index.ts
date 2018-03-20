import { paths, tool } from "../../../api";

export class moveTool extends tool {
  public toolName = 'Move'
  public toolbarIcon = { label: 'Move', icon: paths.images + '/arrows.svg' }
  public settings = []
}

// registerPlugin({
//   tool: moveTool
// })
