import { app, BrowserWindow, ipcMain, WebContents } from 'electron'
import * as path from 'path'
import * as glob from 'glob'
// import { plugin } from './core';
require('electron-reload')(path.join(__dirname, '../../'))

const root = path.join(__dirname, '../../')
const locals = {
  assets: path.join(root, 'assets').replace(/\\/g, '/'),
  js: path.join(root, 'js/client').replace(/\\/g, '/'),
  css: path.join(root, 'css')
}
const pug = require('electron-pug')(undefined, locals)

declare global {
  namespace NodeJS {
    interface Global {
      web: WebContents
    }
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
} else {
  // Reload the app if anything changes
  // reload(root + '**/*')

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow: Electron.BrowserWindow | null = null

  const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1250,
      height: 800,
      show: false
    })

    // and load the index.html of the app.
    // mainWindow.loadURL(`file://${__dirname}/../../index.html`)
    let views = path.join(__dirname, '../../views')
    global.web = mainWindow.webContents
    mainWindow.loadURL(`file://${views}/windows/main.pug`)

    // Open the DevTools.
    global.web.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })

    global.web.on('dom-ready', e => {
      // ipcMain.on('get-tool', (evt, arg) => {
      //   // console.log(evt)
      //   // console.log(arg)
      // })
      mainWindow && mainWindow.show()
    })
  }

  // ipcMain.on('init', (e: Event) => {
  //   glob(path.join(__dirname, './components/**/index.js'), (err, files) => {
  //     files.forEach(file => {
  //       require(file)
  //       delete require.cache[require.resolve(file)]
  //     })
  //   })
  // })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })


  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and import them here.
}