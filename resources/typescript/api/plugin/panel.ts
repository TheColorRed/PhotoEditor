import { plugin } from './plugin'
import { clientPanels } from '../util/panels';

export interface panel {
  postRender(): void
}

export abstract class panel extends plugin {
  public readonly panel = document.createElement('div')

  protected abstract label: string
  protected abstract key: string
  public abstract panelGroup: number

  abstract render(): Element | Promise<Element>

  public async init() {
    let firstItem = false
    let panelGroup = document.querySelector(`.panels>#panel-group-${this.panelGroup}`)
    let panels = document.querySelector('.panels') as HTMLDivElement

    let tabList: Element, panelList: Element
    if (panelGroup) {
      tabList = panelGroup.querySelector('.tab-list') as HTMLElement
      panelList = panelGroup.querySelector('.panel-list') as HTMLElement
    } else {
      let group = clientPanels.createPanelGroup()
      this.panel.classList.add('active')
      panelGroup = group.panelGroup
      panelList = group.panelList
      tabList = group.tabList
      firstItem = true
    }

    let tab = document.createElement('div')
    tab.draggable = true
    tab.setAttribute('data-target', '#panel-' + this.id)
    tab.textContent = this.label
    tab.classList.add('tab')
    firstItem && tab.classList.add('active')
    tabList.appendChild(tab)
    tab.id = 'tab-' + this.id
    tab.addEventListener('click', e => clientPanels.activate(e.currentTarget as HTMLElement))
    tab.addEventListener('dragstart', e => e.dataTransfer.setData('id', this.id))
    tab.addEventListener('drop', e => {
      e.stopPropagation()
      e.preventDefault()
      clientPanels.moveTab(e, e.currentTarget as Element)
    })
    tab.addEventListener('dragover', e => (e.currentTarget as HTMLElement).classList.add('drag-hover'))
    tab.addEventListener('dragleave', e => (e.currentTarget as HTMLElement).classList.remove('drag-hover'))
    let panelContent = this.render()
    if (panelContent instanceof Element) {
      this.addPanel(panelContent, panelList, firstItem)
    } else {
      panelContent.then(el => {
        this.addPanel(el, panelList, firstItem)
      })
    }

  }

  private addPanel(panelContent: Element, panelList: Element, firstItem: boolean) {
    panelContent.classList.add('panel-content', this.key)
    this.panel.id = 'panel-' + this.id
    this.panel.classList.add('panel')
    firstItem && this.panel.classList.add('active')
    this.panel.appendChild(panelContent)

    panelList.appendChild(this.panel)
    typeof this.postRender == 'function' && this.postRender()
  }

}