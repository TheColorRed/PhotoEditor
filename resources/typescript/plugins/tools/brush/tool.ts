import { paths, tool } from '../../../api'

export class brushTool extends tool {
  public toolName = 'Brush'
  public toolbarIcon = { label: 'Brush', icon: paths.images + '/paint-brush.svg' }
  public settings = [
    {
      label: 'Size',
      key: 'size',
      type: 'units',
      default: 50,
      min: 0,
      max: 2000,
    },
    {
      label: 'Opacity',
      key: 'opacity',
      type: 'units',
      default: 100,
      min: 0,
      max: 100
    }
  ]
}