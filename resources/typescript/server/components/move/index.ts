import { tool, registerPlugin } from "../../api";
import { paths } from "../../core";

export class moveTool extends tool {
  public toolName = 'Move'
  public toobarIcon = { label: 'Move', icon: paths.images + '/arrows.svg' }
  public settings = []
}

registerPlugin({
  tool: moveTool
})
