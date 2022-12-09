const {ipcRenderer,app,dialog,BrowserWindow} = require('electron')
const $ = require('jquery')

ipcRenderer.on('message',(e,args)=> {
    let {title} = JSON.parse(args)
    console.log("Preview Page");
    $('#title').text(title)
    ipcRenderer.send("start-printing")
  })