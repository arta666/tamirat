
// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI

const {ipcRenderer, dialog} = require('electron')
const $ = require('jquery')
const toastify = require('toastify-js')

let devices = []

let updateStatus = false
let idDeviceToUpdate = ''

$(function() {
  ipcRenderer.send('get-devices')
  })

  function deleteDevice(id){
   const result = confirm("Are you sure you want to delete device ?")
   if (result) {
    ipcRenderer.send("delete-device",id)
   }
  }

  function updateDevice(id) {
    updateStatus = true
    idDeviceToUpdate = id
    const device = devices.find(d => d._id === id)
    $('#device-name').val(device.name)

  }

  function renderDevices(deviceItems) {

    $('#table').find("tr:gt(0)").remove();
    for(i= 0 ; i < deviceItems.length; i ++) {
      let dv = deviceItems[i]
      let id = dv._id
      let name = dv.name
      $('#table tr:last').after(
        `<tr class="active-row">
        <td>${i}</td>
        <td>${name}</td>
        <td><button type="button" onclick="updateDevice('${id}')">Edit</button></td>
        <td><button type="button"  onclick="deleteDevice('${id}')">Delete</button></td>
        </tr>`);
    }
  }

  $("#btn-action" ).click(function( event ) {
    // alert( "Handler for .submit() called." );
    event.preventDefault();
    // Get some values from elements on the page:
  
    const name = $("#device-name").val()
    
    const dv = {name: name}
    
    if (!updateStatus) {
      ipcRenderer.send('new-device', dv)
    } else {
      ipcRenderer.send("update-device",{...dv, idDeviceToUpdate})
    }
    
    $("#device-form").trigger('reset')
  });

  ipcRenderer.on('new-device-saved',(e, args)=> {
    let device = JSON.parse(args)
    devices.push(device)
    renderDevices(devices)
    toastify({
      text: "Device Added",
      duration: 3000,
      position: "left",
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)"}
    }).showToast();
  })

  ipcRenderer.on('get-devices',(e, args)=> {
    let allDevices = JSON.parse(args)
    devices = allDevices
    renderDevices(devices)
  })

  ipcRenderer.on('delete-device-success',(e,args)=> {
    const device = JSON.parse(args)
    const newDevices = devices.filter(d => {
      return d._id !== device._id
    })

    devices = newDevices
    renderDevices(devices)

  })

  ipcRenderer.on("update-device-success", (e, args) => {
    const updateDevice = JSON.parse(args)
    devices = devices.map(d => {
      if (d._id === updateDevice._id){
        d.name = updateDevice.name
      }
      return d
    })

    renderDevices(devices)
    updateStatus = false

  })

  ipcRenderer.on('error',(e, message)=> {
    console.log(message)
    toastify({
      text: message,
      duration: 3000,
      style: { background: "#FF0000",color: "#ffffff"}
    }).showToast();
  })

  