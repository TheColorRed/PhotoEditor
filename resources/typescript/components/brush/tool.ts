import { paths, tool } from '../../api'

export class brushTool extends tool {
  public toolName = 'Brush'
  public toolbarIcon = { label: 'Brush', icon: paths.images + '/paint-brush.svg' }
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