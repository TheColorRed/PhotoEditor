import { ipcRenderer, remote } from 'electron'
import { image } from './image';
import { canvas, tool } from '../api'
document.addEventListener('DOMContentLoaded', e => {
  let canvas = document.querySelector('canvas#primary') as HTMLCanvasElement
  let canvasBg = document.querySelector('canvas#bg') as HTMLCanvasElement
  let ctx = canvas.getContext('2d')
  let canvasRect = canvas.getBoundingClientRect()

  let canvasPlugins: canvas[] = []

  ipcRenderer.send('init')
  ipcRenderer.on('load-tool', async (evt: Event, id: string) => {
    let tool = remote.require('../api').getTool(id) as tool
    if (!tool) return
    let tools = document.querySelector('.tools') as HTMLDivElement
    let icon = await image.svg(tool.toolbarIcon.icon)
    let span = document.createElement('span')
    let btn = document.createElement('span')
    btn.classList.add('btn')
    span.classList.add('tool')
    span.appendChild(btn)
    btn.appendChild(icon)
    tools.appendChild(span)
    return
  })

  ipcRenderer.on('init-canvas', (evt: Event, id: string) => {
    let canvasPlugin = require('../components/brush/canvas').default
    let plugin = new canvasPlugin(canvas) as canvas
    canvasPlugins.push(plugin)
  })

  function drawBG() {
    let ctx = canvasBg.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvasBg.width, canvasBg.height)
    let width = canvasBg.width
    let height = canvasBg.height
    let squareSize = 15
    let i = 0
    for (let x = 0; x < width; x += squareSize) {
      for (let y = 0; y < height; y += squareSize) {
        ctx.fillStyle = i++ % 2 == 0 ? '#888' : '#fff'
        ctx.fillRect(x, y, squareSize, squareSize)
      }
      i++
    }
  }

  window.addEventListener('resize', e => {
    canvasPlugins.forEach(c => c.resized())
    drawBG()
  })

  drawBG()

})