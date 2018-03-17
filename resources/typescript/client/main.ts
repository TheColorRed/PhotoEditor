import { ipcRenderer } from 'electron'
import { image } from './image';
// import { toolPlugin } from '../server/core/plugin/plugin'
document.addEventListener('DOMContentLoaded', e => {
  let canvas = document.querySelector('canvas#primary') as HTMLCanvasElement
  let canvasBg = document.querySelector('canvas#bg') as HTMLCanvasElement
  // let workarea = document.querySelector('.workarea') as HTMLDivElement
  let ctx = canvas.getContext('2d')
  let canvasRect = canvas.getBoundingClientRect()

  let isDrawing = false
  let strokeWidth = 100
  let mouse = { x: 0, y: 0 }
  let path: Path2D

  ipcRenderer.send('init')
  ipcRenderer.on('load-tool', async (evt, tool) => {
    let tools = document.querySelector('.tools') as HTMLDivElement
    console.log(tool)
    let icon = await image.svg(tool.icon.icon)
    let span = document.createElement('span')
    let btn = document.createElement('span')
    btn.classList.add('btn')
    span.classList.add('tool')
    span.appendChild(btn)
    btn.appendChild(icon)
    tools.appendChild(span)
    return
  })

  function drawBG() {
    let ctx = canvasBg.getContext('2d')
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
    canvasRect = canvas.getBoundingClientRect()
  })

  canvas.addEventListener('mouseenter', e => {
    canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${strokeWidth}" width="${strokeWidth}"><circle cx="${strokeWidth / 2}" cy="${strokeWidth / 2}" r="${strokeWidth / 2}" stroke="gray" stroke-width="1" fill="transparent" /></svg>') 50 50, auto`
  })

  window.addEventListener('mousedown', e => {
    isDrawing = true
    path = new Path2D
    ctx.lineWidth = strokeWidth
    ctx.lineJoin = ctx.lineCap = 'round'
    ctx.shadowBlur = 10
    ctx.shadowColor = '#000'
    ctx.strokeStyle = '#000'
    path.moveTo(mouse.x, mouse.y)
    path.lineTo(mouse.x, mouse.y)
  })

  window.addEventListener('mouseup', e => {
    isDrawing = false
  })

  canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX - canvasRect.left
    mouse.y = e.clientY - canvasRect.top
    if (isDrawing) {
      path.lineTo(mouse.x, mouse.y)
    }
  })

  function draw() {
    if (isDrawing) {
      ctx.stroke(path)
      path = new Path2D
      path.moveTo(mouse.x, mouse.y)
    }
    requestAnimationFrame(draw)
  }

  requestAnimationFrame(draw)

  drawBG()

})