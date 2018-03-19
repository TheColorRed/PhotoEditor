// import { toolSettings, toolIcon } from '..'
import { addons } from '.'
import { tool } from '..';
import * as path from 'path'

export class pluginGroup {
  public id: string
  public tool?: tool

  public constructor() {
    this.id = Math.random().toString(36).substr(2, 6)
  }
}

export abstract class plugin {
  public readonly id: string
  public static plugins: pluginGroup[] = []

  public constructor() {
    this.id = Math.random().toString(36).substr(2, 6)
  }

  public static async registerPlugin(addon: addons) {
    let group = new pluginGroup
    if (addon.tool) {
      group.tool = new addon.tool
      global.web.send('load-tool', group.tool.id)
    }
    if (addon.canvas) {
      global.web.send('init-canvas', group.id)
    }
    this.plugins.push(group)
    // let addon = this.plugins.find(p => p instanceof tool)
    // let t: any = undefined, c: any = undefined
    // if (plugin.tool) {
    //   let addon = this.plugins.find(p => p.tool instanceof <any>plugin.tool)
    //   if (!addon) {
    //     t = new plugin.tool
    //     console.log('Registered', `"${t.toolName}"`, 'tool')
    //     this.sendLoadTool(t)
    //     console.log('---')
    //   } else {
    //     addon.tool && console.log('Reload', `"${addon.tool.toolName}"`, 'tool')
    //     // this.sendLoadTool(addon.tool)
    //   }
    // }
    // if (plugin.canvas) {
    //   let addon = this.plugins.find(p => p.canvas instanceof <any>plugin.canvas)
    //   if (!addon) {
    //     c = new plugin.canvas
    //   } else {
    //     // console.log('Reload', `"${addon.canvas.toolName}"`, 'tool')
    //     // this.sendLoadTool(addon.canvas.id)
    //   }
    // }
    // this.plugins.push({ tool: t })
    // if (c) global.web.send('load-canvas', c.id)
    // if (t) global.web.send('load-tool', t.id)
    // if (t) this.sendLoadTool(t)
  }

  private static sendLoadTool(tool: tool) {
    global.web.send('load-tool', {
      name: tool.toolName,
      icon: tool.toolbarIcon,
      settings: tool.settings
    })
  }
}