import { paths, tool } from "../../../api";

export class eraserTool extends tool {
  public toolName = 'Eraser'
  public toolbarIcon = { label: 'Eraser', icon: paths.images + '/eraser.svg' }
  public settings = []
}