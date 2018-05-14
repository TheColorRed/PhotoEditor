import { plugin, pluginGroup } from "./plugin";
import { tool, toolSettings } from "./tool";
import { project } from "../util/project";

export interface canvas {
  mousedown(event: MouseEvent): void
  mousemove(event: MouseEvent): void
  mouseup(event: MouseEvent): void
  mouseenter(event: MouseEvent): void
  mouseleave(event: MouseEvent): void
}

export enum button { none = -1, left = 0, middle = 1, right = 2 }

export abstract class canvas extends plugin {
  // protected primaryCanvas: HTMLCanvasElement
  protected workarea: HTMLElement
  // protected primaryCTX: CanvasRenderingContext2D
  // protected draft: HTMLCanvasElement
  // protected draftCTX: CanvasRenderingContext2D
  protected rect: ClientRect = document.body.getBoundingClientRect()
  protected mouse: { x: number, y: number } = { x: 0, y: 0 }
  protected button: button = button.none
  protected onCanvas: boolean = false

  protected get width() { return project.active.width }
  protected get height() { return project.active.height }

  protected get toolSettings() {
    let plug = plugin.plugins.find(p => p.id == this.groupid) as pluginGroup
    let t = plug.plugins.find(p => p instanceof tool) as tool
    return new toolSettings(t.settings)
  }

  abstract cursor(): string

  public constructor(groupid: string) {
    super(groupid)
    this.workarea = document.querySelector('.workarea-group') as HTMLElement
    // this.workspaceChanged()
    // let proj = project.getProject()
    // this.primaryCanvas = proj.canvasPrimary
    // this.primaryCTX = this.primaryCanvas.getContext('2d') as CanvasRenderingContext2D
    // this.rect = this.primaryCanvas.getBoundingClientRect()
    // this.draft = proj.canvasDraft
    // this.draftCTX = this.draft.getContext('2d') as CanvasRenderingContext2D

    // this.primaryCTX.save()
    // this.draftCTX.save()

    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    window.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.workarea.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.workarea.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.workarea.addEventListener('mouseleave', this.onMouseLeave.bind(this))
  }

  // protected workspaceChanged() {
  //   let proj = project.getProject()
  //   this.primaryCanvas = proj.canvasPrimary// document.querySelector('canvas#primary') as HTMLCanvasElement
  //   this.primaryCTX = this.primaryCanvas.getContext('2d') as CanvasRenderingContext2D
  //   this.rect = this.primaryCanvas.getBoundingClientRect()
  //   this.draft = proj.canvasDraft// document.querySelector('canvas#draft') as HTMLCanvasElement
  //   this.draftCTX = this.draft.getContext('2d') as CanvasRenderingContext2D

  //   this.primaryCTX.save()
  //   this.draftCTX.save()
  // }

  protected apply() {
    let layer = project.active.layers.active
    if (!layer) return
    layer.ctx.drawImage(project.active.canvasDraft, 0, 0)
    project.active.ctxDraft.clearRect(0, 0, this.width, this.height)
    project.active.updateMainCanvas()
  }

  public onTool() {
    let group = this.getGroup()
    let currentToolGroup = tool.activeTool && tool.activeTool.getGroup()
    if (group == currentToolGroup) this.updateCursor()
  }

  private updateCursor() {
    this.workarea.style.cursor = this.cursor()
  }

  private onMouseDown(e: MouseEvent) {
    this.button = e.button
    this.rect = project.active.getBoundingClientRect()
    let group = this.getGroup()
    let currentToolGroup = tool.activeTool && tool.activeTool.getGroup()
    group == currentToolGroup && typeof this.mousedown == 'function' && this.mousedown(e)
  }

  private onMouseMove(e: MouseEvent) {
    this.mouse.x = e.clientX - this.rect.left
    this.mouse.y = e.clientY - this.rect.top
    let group = this.getGroup()
    let currentToolGroup = tool.activeTool && tool.activeTool.getGroup()
    group == currentToolGroup && typeof this.mousemove == 'function' && this.mousemove(e)
  }

  private onMouseUp(e: MouseEvent) {
    this.button = button.none
    let group = this.getGroup()
    project.active.setGlobalCompositeOperation('source-over')
    if (project.active.layers.active) project.active.layers.active.ctx.globalCompositeOperation = 'source-over'
    // project.active.ctxPrimary.globalCompositeOperation = 'source-over'
    let currentToolGroup = tool.activeTool && tool.activeTool.getGroup()
    group == currentToolGroup && typeof this.mouseup == 'function' && this.mouseup(e)
  }

  private onMouseEnter(e: MouseEvent) {
    let group = this.getGroup()
    let currentToolGroup = tool.activeTool && tool.activeTool.getGroup()
    group == currentToolGroup && typeof this.mouseenter == 'function' && this.mouseenter(e)
    this.onCanvas = true
  }

  private onMouseLeave(e: MouseEvent) {
    let group = this.getGroup()
    let currentToolGroup = tool.activeTool && tool.activeTool.getGroup()
    group == currentToolGroup && typeof this.mouseleave == 'function' && this.mouseleave(e)
    this.onCanvas = false
  }

  public resized() {
    this.rect = project.active.getBoundingClientRect()
  }

  public static drawBackgroundPattern(canvas: HTMLCanvasElement, squareSize = 15) {
    let ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let width = canvas.width
    let height = canvas.height
    let i = 0
    for (let x = 0; x < width; x += squareSize) {
      for (let y = 0; y < height; y += squareSize) {
        ctx.fillStyle = i++ % 2 == 0 ? '#888' : '#fff'
        ctx.fillRect(x, y, squareSize, squareSize)
      }
      i++
    }
  }
}