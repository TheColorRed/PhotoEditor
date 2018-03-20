import { plugin } from './plugin'

export interface panel {
  postRender(): void
}

export abstract class panel extends plugin {
  protected readonly panel = document.createElement('div')

  abstract render(): Element

  public init() {
    let item = this.render()
    this.panel.appendChild(item)
    this.panel.id = 'panel_' + this.id
    this.panel.classList.add('panel')
    let panel = document.querySelector(`.panels>#panel_${this.id}`)
    if (panel) {
      panel.innerHTML = ''
      panel.appendChild(this.panel)
    } else {
      let panels = document.querySelector('.panels') as HTMLDivElement
      panels.appendChild(this.panel)
    }
    typeof this.postRender == 'function' && this.postRender()
  }
}