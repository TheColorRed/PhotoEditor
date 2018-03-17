import { plugin } from "./plugin";

export interface toolSettings {
  label: string
  type: string
  min?: number
  max?: number
  default?: string | number
}

export interface toolIcon {
  label: string
  icon: string
}

export abstract class tool extends plugin {
  abstract toolName: string
  abstract toobarIcon: toolIcon
  abstract settings: toolSettings[]
}