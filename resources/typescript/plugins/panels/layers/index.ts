import { panel, paths } from "../../../api";
import { image } from "../../../client/image";

export class layerPanel extends panel {

  public panelGroup: number = 1
  protected key: string = 'layers'
  protected label: string = 'Layers'

  public async render(): Promise<Element> {
    let newLayer = await image.svg(paths.images + '/file.svg')
    newLayer.style.height = '16px'
    let newLayerGroup = await image.svg(paths.images + '/folder.svg')
    let div = document.createElement('div')
    div.innerHTML = `
    <div class="layers"></div>
    <div class="options">
      <div class="option" title="New Layer"><div class="btn">${newLayer.outerHTML}</div></div>
      <div class="option" title="New Layer Group"><div class="btn">${newLayerGroup.outerHTML}</div></div>
    </div>
    `
    return div
  }
}