import { plugin, pluginGroup } from "./plugin";
import { tool, toolSettings } from "./tool";

export interface canvas {
  mousedown(event: MouseEvent): void
  mousemove(event: MouseEvent): void
  mouseup(event: MouseEvent): void
  mouseenter(event: MouseEvent): void
  mouseleave(event: MouseEvent): void
}

export abstract class canvas extends plugin {
  protected primaryCanvas: HTMLCanvasElement
  protected primaryCTX: CanvasRenderingContext2D
  protected draft: HTMLCanvasElement
  protected draftCtx: CanvasRenderingContext2D
  protected rect: ClientRect = document.body.getBoundingClientRect()
  protected mouse: { x: number, y: number } = { x: 0, y: 0 }
  protected onCanvas: boolean = false

  protected get width() { return this.primaryCanvas.width }
  protected get height() { return this.primaryCanvas.height }
  protected get toolSettings() {
    let plug = plugin.plugins.find(p => p.id == this.groupid) as pluginGroup
    let t = plug.plugins.find(p => p instanceof tool) as tool
    return new toolSettings(t.settings)
  }

  abstract cursor(): string

  public constructor(groupid: string) {
    super(groupid)
    this.primaryCanvas = document.querySelector('canvas#primary') as HTMLCanvasElement
    this.primaryCTX = this.primaryCanvas.getContext('2d') as CanvasRenderingContext2D
    this.rect = this.primaryCanvas.getBoundingClientRect()
    this.draft = document.querySelector('canvas#draft') as HTMLCanvasElement
    this.draftCtx = this.draft.getContext('2d') as CanvasRenderingContext2D

    window.addEventListener('mousedown', this.onMouseDown.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    window.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.primaryCanvas.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.primaryCanvas.addEventListener('mouseleave', this.onMouseLeave.bind(this))
  }

  protected apply() {
    this.primaryCTX.drawImage(this.draft, 0, 0)
    this.draftCtx.clearRect(0, 0, this.width, this.height)
  }

  public onTool() {
    let group = this.getGroup()
    let currentToolGroup = tool.activeTool && tool.activeTool.getGroup()
    if (group == currentToolGroup) this.primaryCanvas.style.cursor = this.cursor()
    else this.primaryCanvas.style.cursor = 'default'
  }

  private onMouseDown(e: MouseEvent) {
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
    let group = this.getGroup()
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
    this.rect = this.primaryCanvas.getBoundingClientRect()
  }
}