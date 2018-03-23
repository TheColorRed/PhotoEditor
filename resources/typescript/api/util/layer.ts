export class layer {
  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D

  public get data() { return this._canvas }

  public constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas
    this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  }
}