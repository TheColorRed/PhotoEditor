import { tool, toolSettings, toolIcon } from "./tools";

export interface addons {
  tool?: addonType<tool>
}

export interface addon {
  tool?: tool
}

export function registerPlugin(addon: addons) {
  plugin.registerPlugin(addon)
}

export interface addonType<T extends plugin> {
  new(): T
}

export interface toolPlugin {
  name: string
  settings: toolSettings
  icon: toolIcon
}

export abstract class plugin {
  public static plugins: addon[] = []

  public static async registerPlugin(plugin: addons) {
    let addon = this.plugins.find(p => p.tool instanceof plugin.tool)
    if (!addon && plugin.tool) {
      let tool = new plugin.tool
      console.log('Registered', `"${tool.toolName}"`, 'tool')
      this.sendLoadTool(tool)
      console.log('---')
      this.plugins.push({ tool })
    } else {
      console.log('Reload', `"${addon.tool.toolName}"`, 'tool')
      this.sendLoadTool(addon.tool)
    }
  }

  private static sendLoadTool(tool: tool) {
    global.web.send('load-tool', {
      name: tool.toolName,
      icon: tool.toobarIcon,
      settings: tool.settings
    })
  }
}