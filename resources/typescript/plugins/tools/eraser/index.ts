import { paths, tool } from "../../../api";
import { toolSetting, toolIcon } from "../../../api/plugin/tool";
export { eraserCanvas } from './canvas'
export class eraserTool extends tool {
  public toolName = 'Eraser'
  public toolbarIcon: toolIcon = { label: 'Eraser', icon: paths.images + '/eraser.svg' }
  public settings: toolSetting[] = [
    {
      label: 'Size',
      key: 'size',
      default: 50,
      type: 'units',
      min: 0,
      max: 2000
    }
  ]
}