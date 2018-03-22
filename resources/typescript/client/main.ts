import { ipcRenderer, remote } from 'electron'
import { image } from './image';
import { canvas, tool, panel } from '../api'
import * as glob from 'glob'
import * as path from 'path'
import { addons, addon, addonType, plugin, pluginGroup } from '../api';
import { clientPanels } from '../api/util/panels';
document.addEventListener('DOMContentLoaded', e => {
  let mainCanvas = document.querySelector('canvas#primary') as HTMLCanvasElement
  let canvasBg = document.querySelector('canvas#bg') as HTMLCanvasElement
  let ctx = mainCanvas.getContext('2d')
  let canvasRect = mainCanvas.getBoundingClientRect()

  glob(path.join(__dirname, '../plugins/*/*/index.js'), (err, files) => {
    files.forEach(file => {
      let p: { [key: string]: any } = require(file) as addons
      let pg: pluginGroup = new pluginGroup
      for (let i in p) {
        let item = p[i]
        try {
          let p = new item(pg.id)
          p instanceof tool && p.init()
          p instanceof panel && p.init()
          pg.add(p)
        } catch (e) { console.error(e.message) }
      }
      pg.loaded()
    })
    clientPanels.init()
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
    plugin.plugins.forEach(c => {
      c.plugins.forEach(c => c instanceof canvas && c.resized())
    })
    drawBG()
  })

  drawBG()

})