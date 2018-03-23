import { Menu } from "electron";

const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      { label: 'New...', accelerator: 'ctrl+n' },
      { label: 'Open...', accelerator: 'ctrl+o' },
      { type: 'separator' },
      { label: 'Close' },
      { type: 'separator' },
      { label: 'Save', accelerator: 'ctrl+s' },
      { label: 'Save As...', accelerator: 'ctrl+shfit+s' },
      { type: 'separator' },
      { label: 'Quit Application', accelerator: 'ctrl+shfit+s' },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'ctrl+n' },
      { label: 'Redo', accelerator: 'ctrl+n' },
      { label: 'Repeat', accelerator: 'ctrl+n' },
      { label: 'Revert...', accelerator: 'ctrl+n' },
      { label: 'Restore Original...', accelerator: 'ctrl+n' },
      { label: 'Goto...', accelerator: 'ctrl+n' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'ctrl+n' },
      { label: 'Copy', accelerator: 'ctrl+n' },
      { label: 'Paste', accelerator: 'ctrl+n' },
      { label: 'Paste As New Layer', accelerator: 'ctrl+n' },
      { label: 'Paste As New Image', accelerator: 'ctrl+n' },
    ]
  },
  {
    label: 'Image'
  },
  {
    label: 'Layer'
  },
  {
    label: 'Select'
  },
  {
    label: 'Filter'
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)