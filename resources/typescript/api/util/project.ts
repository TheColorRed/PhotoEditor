import { layers } from './layers/layers'
import { image } from '../../client/image';
import { paths, canvas } from '..';
import { layer } from './layers/layer';

export class project {

  private static projects: project[] = []
  private static activeProject: project

  public readonly layers: layers = new layers

  public width: number = 0
  public height: number = 0

  private _canvasPrimary: HTMLCanvasElement
  private _canvasGizmos: HTMLCanvasElement
  private _canvasDraft: HTMLCanvasElement
  private _canvasBg: HTMLCanvasElement

  private _ctxPrimary: CanvasRenderingContext2D
  private _ctxGizmos: CanvasRenderingContext2D
  private _ctxDraft: CanvasRenderingContext2D
  private _ctxBg: CanvasRenderingContext2D

  public static get active() { return this.activeProject }

  // Project canvases
  // public get canvasPrimary() { return this._canvasPrimary }
  public get canvasGizmos() { return this._canvasGizmos }
  public get canvasDraft() { return this._canvasDraft }
  public get canvasBg() { return this._canvasBg }

  // Project canvas context's
  // public get ctxPrimary() { return this._ctxPrimary }
  public get ctxGizmos() { return this._ctxGizmos }
  public get ctxDraft() { return this._ctxDraft }
  public get ctxBg() { return this._ctxBg }

  public constructor(width: number, height: number) {
    project.projects.push(this)
    this.width = width
    this.height = height
    this._canvasPrimary = this.createCanvas('primary')
    this._canvasGizmos = this.createCanvas('gizmos')
    this._canvasDraft = this.createCanvas('draft')
    this._canvasBg = this.createCanvas('bg')
    this._ctxPrimary = this._canvasPrimary.getContext('2d') as CanvasRenderingContext2D
    this._ctxGizmos = this._canvasGizmos.getContext('2d') as CanvasRenderingContext2D
    this._ctxDraft = this._canvasDraft.getContext('2d') as CanvasRenderingContext2D
    this._ctxBg = this._canvasBg.getContext('2d') as CanvasRenderingContext2D
    canvas.drawBackgroundPattern(this._canvasBg)
    this.addToWorkarea()
  }

  public static setOpacity(opacity: number) {
    project.active._canvasDraft.style.opacity = opacity.toString()
    project.active._ctxPrimary.globalAlpha = opacity
  }

  public setOpacity(opacity: number) {
    if (!project.active.layers.active) return
    project.active.layers.active.canvas.style.opacity = opacity.toString()
    project.active.layers.active.ctx.globalAlpha = opacity
    // project.active._canvasDraft.style.opacity = opacity.toString()
    // project.active._ctxPrimary.globalAlpha = opacity
  }

  public updateMainCanvas() {
    let layers = project.active.layers
    if (!layers) return
    let i = layers.layers.length
    this._ctxPrimary.clearRect(0, 0, this.width, this.height)
    while (i) {
      i--
      let layer = layers.getLayer(i)
      if (layer) {
        this._ctxPrimary.drawImage(layer.canvas, 0, 0)
        layer.updatePreview()
      }
    }
  }

  public toActiveLayer(callback: (ctx: CanvasRenderingContext2D, layer: layer) => void) {
    if (this.layers.active) {
      callback(this.layers.active.ctx, this.layers.active)
    }
  }

  public getPixel(x: number, y: number) {
    return this._ctxPrimary.getImageData(x, y, 1, 1)
  }

  public getBoundingClientRect() {
    return this._canvasPrimary.getBoundingClientRect()
  }

  public setGlobalCompositeOperation(operation: string) {
    this._ctxPrimary.globalCompositeOperation = operation
  }

  private async addToWorkarea() {
    let workarea = document.querySelector('#workarea') as HTMLDivElement
    let tabs = workarea.querySelector('.workarea-tab-group') as HTMLDivElement
    let projects = workarea.querySelector('.workarea-group') as HTMLDivElement
    let proj = document.createElement('div')
    let tab = document.createElement('div')
    proj.classList.add('project', 'active')
    tab.classList.add('tab', 'active')
    tab.textContent = 'Untitled'
    let close = document.createElement('div')
    close.classList.add('close')
    let times = await image.svg(paths.images + '/times.svg')
    close.appendChild(times)
    tab.appendChild(close)

    proj.appendChild(this._canvasDraft)
    proj.appendChild(this._canvasPrimary)
    proj.appendChild(this._canvasBg)
    projects.appendChild(proj)
    tabs.appendChild(tab)
  }

  public static setActive(project: project) {
    this.activeProject = project
  }

  // public static getProject(idx: number = 0) {
  //   return project.projects[idx]
  // }

  private createCanvas(...classes: string[]) {
    let canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = this.width
    canvas.height = this.height
    canvas.classList.add(...classes)
    return canvas
  }
}