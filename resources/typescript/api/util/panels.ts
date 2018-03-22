export class clientPanels {
  protected static lastPanelGroup: number = 0

  public static init() {
    let panels = document.querySelector('.panels') as HTMLDivElement
    panels.addEventListener('dragover', e => {
      e.preventDefault()
      e.stopPropagation()
    })
    panels.addEventListener('drop', e => {
      e.preventDefault()
      let target = e.currentTarget as HTMLDivElement
      if (target.matches('.panels')) {
        let group = this.createPanelGroup()
        panels.appendChild(group.panelGroup)
        this.moveTab(e, group.tabList)
        this.removeEmptyGroups()
        this.activateEachGroup()
      }
    })
  }

  public static createPanelGroup() {
    let panelGroup = document.createElement('div')
    panelGroup.id = 'panel-group-' + this.lastPanelGroup++
    panelGroup.classList.add('panel-group')
    let p = document.querySelector('.panels')
    if (p) p.appendChild(panelGroup)

    let tabList = panelGroup.querySelector('.tab-list')
    let panelList = panelGroup.querySelector('.panel-list')
    if (!tabList) {
      tabList = document.createElement('div')
      tabList.classList.add('tab-list')
      panelGroup.appendChild(tabList)
      tabList.addEventListener('dragover', e => {
        e.preventDefault()
        e.stopPropagation()
      })
      tabList.addEventListener('drop', e => {
        e.preventDefault()
        e.stopPropagation()
        this.moveTab(e as DragEvent)
      })
    }
    if (!panelList) {
      panelList = document.createElement('div')
      panelList.classList.add('panel-list')
      panelGroup.appendChild(panelList)
    }

    return { panelGroup, tabList, panelList }
  }

  public static activate(target: HTMLElement) {
    let pg = target.closest('.panel-group')
    if (!pg) return
    this.setActive(pg, target)
  }

  public static moveTab(e: DragEvent, target?: Element) {
    target = target instanceof HTMLElement ? target : e.currentTarget as HTMLElement
    let id = e.dataTransfer.getData('id')
    let tab = document.getElementById('tab-' + id)
    let panel = document.getElementById('panel-' + id)
    if (tab && panel) {
      if (target.matches('.tab')) {
        let p = target.closest('.tab-list') as HTMLElement
        p.insertBefore(tab, target)
      } else {
        target.appendChild(tab)
      }
      let group = target.closest('.panel-group') as HTMLDivElement
      let list = group.querySelector('.panel-list') as HTMLDivElement
      list.appendChild(panel)
      this.activate(tab)
      this.removeEmptyGroups()
      this.activateEachGroup()
      this.removeDragHover()
    }
  }

  public static removeEmptyGroups() {
    Array.from(document.querySelectorAll('.panels>.panel-group>.tab-list')).forEach(list => {
      let tabs = Array.from(list.querySelectorAll('.tab')).length
      if (tabs == 0) {
        let g = list.closest('.panel-group') as HTMLDivElement
        g.remove()
      }
    })
  }

  public static setActive(group: Element, target: Element) {
    this.clearActive(group)
    target.classList.add('active')
    let t = target.getAttribute('data-target')
    let panel = group.querySelector(`.panel${t}`)
    if (panel) panel.classList.add('active')
  }

  public static removeDragHover() {
    Array.from(document.querySelectorAll('.panels .tab-list>.tab')).forEach(i => i.classList.remove('drag-hover'))
  }

  public static clearActive(group: Element) {
    Array.from(group.querySelectorAll(`.tab-list>.tab,.panel-list>.panel`)).forEach(i => i.classList.remove('active'))
  }

  public static activateEachGroup() {
    this.removeEmptyGroups()
    Array.from(document.querySelectorAll('.panels>.panel-group>.tab-list')).forEach(list => {
      let active = list.querySelector('.tab.active')
      if (!active) {
        let tab = list.querySelector('.tab:first-child') as Element
        this.setActive(list.closest('.panel-group') as Element, tab)
      }
    })
  }
}