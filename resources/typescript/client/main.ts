import { ipcRenderer, remote } from 'electron'
import { image } from './image';
import { canvas, tool, panel } from '../api'
import * as glob from 'glob'
import * as path from 'path'
import { addons, addon, addonType, plugin, pluginGroup } from '../api';
import { clientPanels } from '../api/util/panels';
import { project } from '../api/util/project';
document.addEventListener('DOMContentLoaded', e => {
  // let mainCanvas = document.querySelector('canvas#primary') as HTMLCanvasElement
  // let canvasBg = document.querySelector('canvas#bg') as HTMLCanvasElement
  // let ctx = mainCanvas.getContext('2d')
  // let canvasRect = mainCanvas.getBoundingClientRect()

  let p = new project(800, 600)
  project.setActive(p)

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
        } catch (err) {
          let e: Error = err
          console.error(e.stack)
        }
      }
      pg.loaded()
    })
    clientPanels.init()
  })

  window.addEventListener('resize', e => {
    plugin.plugins.forEach(c => {
      c.plugins.forEach(c => c instanceof canvas && c.resized())
    })
    // drawBG()
  })

  // drawBG()

})