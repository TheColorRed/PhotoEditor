import { layerSort, layer } from "./layer";

export class layers {

  public readonly layers: layer[] = []
  private count: number = 0
  public active?: layer

  public get length() { return this.layers.length }

  public getSortedLayers(sort: layerSort = layerSort.sort) {
    let layers = this.layers.concat()
    if (sort == layerSort.sort) {
      layers.sort((a, b) => a.sort < b.sort ? 1 : 0)
    }
    return layers
  }

  public getLayer(idx: number) {
    return this.layers[idx]
  }

  public add(layer: layer) {
    this.layers.push(layer)
  }

  public setActiveLayer(layer: layer) {
    this.active = layer
  }

  public findByLabel(label: string) {
    return this.layers.find(lyr => lyr.label == label)
  }
}