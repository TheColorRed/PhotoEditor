import { addons } from '.'
import { tool } from './tool';
import * as path from 'path'

export class pluginGroup {
  public id: string
  public plugins: plugin[] = []

  public constructor() {
    this.id = Math.random().toString(36).substr(2, 6)
  }

  public add(plugin: plugin) {
    this.plugins.push(plugin)
  }

  public loaded() {
    plugin.plugins.push(this)
    this.plugins.forEach(p => typeof p.ready == 'function' && p.ready())
  }
}

export interface plugin {
  onSettingChanged(key: string): void
  ready(): void
}

export abstract class plugin {
  public readonly id: string
  public readonly groupid: string
  public static plugins: pluginGroup[] = []

  public constructor(groupid: string) {
    this.id = Math.random().toString(36).substr(2, 6)
    this.groupid = groupid
  }

  public getGroup() {
    return plugin.plugins.find(p => p.id == this.groupid) as pluginGroup
  }
}