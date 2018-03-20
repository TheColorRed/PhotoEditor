import { plugin } from "./plugin";
import { image } from "../../client/image";
import { canvas } from "..";

export interface toolSetting {
  label: string
  key: string
  type: string
  default: string | number
  min?: number
  max?: number
  current?: string | number
}

export interface toolIcon {
  label: string
  icon: string
}

export class toolSettings {
  public readonly settings: toolSetting[]
  public constructor(settings: toolSetting[]) {
    this.settings = settings
  }

  public get(key: string) {
    return this.settings.find(s => s.key == key) as toolSetting
  }

  public default(key: string) {
    return (this.settings.find(s => s.key == key) as toolSetting).default
  }

  public current(key: string) {
    return (this.settings.find(s => s.key == key) as toolSetting).current || ''
  }
}

export abstract class tool extends plugin {
  abstract toolName: string
  abstract toolbarIcon: toolIcon
  abstract settings: toolSetting[]

  public static activeTool?: tool

  public async init() {
    let tools = document.querySelector('.tools') as HTMLDivElement
    let icon = await image.svg(this.toolbarIcon.icon)
    let mainTool = document.createElement('span')
    let btn = document.createElement('span')
    btn.classList.add('btn')
    mainTool.classList.add('tool')
    mainTool.appendChild(btn)
    btn.appendChild(icon)
    tools.appendChild(mainTool)
    mainTool.title = this.toolbarIcon.label

    mainTool.addEventListener('click', e => {
      Array.from(tools.querySelectorAll('.tool')).forEach(tool => tool.classList.remove('active'))
      mainTool.classList.add('active')
      tool.activeTool = this
      plugin.plugins.forEach(pg => pg.plugins.forEach(p => p instanceof canvas && p.onTool()))
      let options = document.querySelector('.options') as HTMLDivElement
      options.innerHTML = ''
      this.settings.forEach(setting => {
        console.log(setting)
        if (setting.type == 'units') {
          let item = document.createElement('div')
          item.classList.add('units')
          let label = document.createElement('label')
          label.textContent = setting.label + ':' || ''
          let txt = document.createElement('input')
          txt.classList.add('units')
          txt.value = (setting.current || setting.default).toString()
          txt.type = 'text'
          item.appendChild(label)
          item.appendChild(txt)
          options.appendChild(item)
          txt.addEventListener('input', e => {
            e.preventDefault()
            let target = e.currentTarget
            if (target instanceof HTMLInputElement) setting.current = target.value
            this.getGroup().plugins.forEach(p => typeof p.onSettingChanged == 'function' && p.onSettingChanged(setting.key))
          })
        }
      })
    })

    return
  }
}