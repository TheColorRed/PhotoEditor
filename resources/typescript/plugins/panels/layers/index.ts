import { panel, paths, canvas } from "../../../api";
import { image } from "../../../client/image";
import { layer } from "../../../api/util/layers/layer";
import { project } from "../../../api/util/project";

export class layerPanel extends panel {

  public panelGroup: number = 1
  protected key: string = 'panel-layers'
  protected label: string = 'Layers'
  protected layers?: HTMLDivElement

  public async render(): Promise<Element> {
    let newLayer = await image.svg(paths.images + '/file.svg')
    newLayer.style.height = '16px'
    let newLayerGroup = await image.svg(paths.images + '/folder.svg')
    let div = document.createElement('div')
    div.innerHTML = `
    <div class="layers"></div>
    <div class="options">
      <div class="option new-layer" title="New Layer"><div class="btn">${newLayer.outerHTML}</div></div>
      <div class="option" title="New Layer Group"><div class="btn">${newLayerGroup.outerHTML}</div></div>
    </div>
    `
    return div
  }

  public postRender() {
    this.layers = this.panel.querySelector('.layers') as HTMLDivElement
    let newLayer = this.panel.querySelector('.options > .new-layer') as HTMLDivElement
    this.drawLayers()
    newLayer.addEventListener('click', e => {
      let canvas = document.createElement('canvas')
      canvas.width = project.active.width
      canvas.height = project.active.height
      let l = new layer(canvas)
      this.drawLayers()
    })
  }

  private drawLayers() {
    if (!this.layers) return
    this.layers.innerHTML = ''
    project.active.layers.getSortedLayers().forEach(lyr => {
      this.addLayer(lyr)
    })
  }

  private addLayer(lyr: layer) {
    if (!this.layers) return
    let layerDiv = document.createElement('div')
    let label = document.createElement('div')
    layerDiv.classList.add('layer')
    if (lyr == project.active.layers.active) layerDiv.classList.add('active')
    label.textContent = lyr.label
    layerDiv.appendChild(lyr.preview)
    layerDiv.appendChild(label)
    this.layers.appendChild(layerDiv)
    layerDiv.addEventListener('click', e => {
      if (!this.layers) return
      e.stopPropagation()
      let target = e.currentTarget as HTMLDivElement
      Array.from(this.layers.querySelectorAll('.layer')).forEach(l => l.classList.remove('active'))
      target.classList.add('active')
      project.active.layers.setActiveLayer(lyr)
    })
  }

}