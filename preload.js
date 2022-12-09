const os = require('os')
const path = require('path')
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('os', {
  home: () => os.homedir()
})

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args)
})

contextBridge.exposeInMainWorld('Toastify', {
  Toastify: () => require('toastify-js')
})

