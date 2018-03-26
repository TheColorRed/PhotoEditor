import { layers } from "./layers";
import { project } from "../project";
import { canvas } from "../..";

export enum layerSort { id, name, sort }

export class layer {
  public label: string = ''
  public readonly id: number = 0

  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _sort: number
  private _preview: HTMLCanvasElement
  private _ctxPreview: CanvasRenderingContext2D

  public get canvas() { return this._canvas }
  public get preview() { return this._preview }
  public get ctx() { return this._ctx }
  public get ctxPreview() { return this._ctxPreview }
  public get sort() { return this._sort }
  // private _project: project

  public constructor(cvs: HTMLCanvasElement, label?: string) {
    this._canvas = cvs
    this._ctx = cvs.getContext('2d') as CanvasRenderingContext2D
    this.label = label ? label : this.createLabel()// label ? label : 'Layer ' + layer.layers.length
    // this.id = layer.count++
    this._sort = layers.length
    this._preview = document.createElement('canvas') as HTMLCanvasElement
    this._ctxPreview = this._preview.getContext('2d') as CanvasRenderingContext2D
    if (this._canvas.height > this._canvas.width) {
      this._preview.height = 80
      this._preview.width = this._canvas.width / this._canvas.height * 80
    } else {
      this._preview.width = 80
      this._preview.height = this._canvas.height / this._canvas.width * 80
    }
    canvas.drawBackgroundPattern(this._preview, 5)
    project.active.layers.add(this)
  }

  public updatePreview() {
    this._ctxPreview.clearRect(0, 0, this._canvas.width, this._canvas.height)
    canvas.drawBackgroundPattern(this._preview, 5)
    let w = this._preview.width
    let h = this._preview.height
    this._ctxPreview.drawImage(this._canvas, 0, 0, w, h)
  }

  private createLabel() {
    let label = ''
    let min = 1
    for (let i = 0, l = layers.length; i < l; i++) {
      let lyr = project.active.layers.findByLabel('Layer ' + i)
      if (lyr) min++
    }
    label = 'Layer ' + min
    return label
  }
}