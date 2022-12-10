// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI

const { ipcRenderer } = require("electron");
const { dialog } = require("@electron/remote");
const toastify = require("toastify-js");

let devices = [];

let updateStatus = false;
let idDeviceToUpdate = "";

var table;

$(function () {
  "use strict";

  var fullHeight = function () {
    $(".js-fullheight").css("height", $(window).height());
    $(window).resize(function () {
      $(".js-fullheight").css("height", $(window).height());
    });
  };
  fullHeight();

  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
  });

  ipcRenderer.send("get-devices");
});

function deleteDevice(id) {
  const options = {
    type: "question",
    buttons: ["لغو", "حذف شود"],
    defaultId: 1,
    title: "حذف",
    message: "آیا میخواهید این دستگاه را حذف کنید ؟",
  };

  dialog
    .showMessageBox(null, options)
    .then((result) => {
      if (result.response === 1) {
        ipcRenderer.send("delete-device", id);
      }
    })
    .catch((e) => console.log(e));
}

function updateDevice(id) {
  updateStatus = true;
  idDeviceToUpdate = id;
  const device = devices.find((d) => d._id === id);
  $("#device-name").val(device.name);
}

function renderDevices(deviceItems) {
  $("#table").find("tr:gt(0)").remove();

  table = $("#table").DataTable({
    dom:
      "<'row'<'col-sm-12 col-md-4 text-black'f><'col-sm-12 col-md-4 mt-1 block text-black border-gray-300'l>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col'p>>",
    columnDefs: [
      {
        targets: -1,
        data: null,
        defaultContent:
          '<div class="container"><div class="row">' +
          '<div class="col-sm">' +
          '<button id="btn-edit" class="btn"><i class="fa fa-pencil"></i></button>' +
          "</div>" +
          '<div class="col-sm">' +
          '<button id="btn-delete" class="btn"><i class="fa fa-trash"></i></i></button>' +
          "</div>" +
          "</div> </div>",
      },
    ],
    scrollY: "100vh",
    scrollCollapse: true,
    language: {
      search: "Filter",
      searchPlaceholder: "",
    },

    data: deviceItems,
    columns: [{ data: "name" }, { data: null }],
  });
}

$("#table tbody").on("click", "button[id='btn-delete']", function (e) {
  var data = table.row($(this).parents("tr")).data();
  deleteDevice(data._id);
});

$("#table tbody").on("click", "button[id='btn-edit']", function (e) {
  var data = table.row($(this).parents("tr")).data();
  updateDevice(data._id);
});

function reloadTable(receipts) {
  $("#table").DataTable().clear().rows.add(receipts).draw();
}

$("#btn-action").click(function (event) {
  // alert( "Handler for .submit() called." );
  event.preventDefault();
  // Get some values from elements on the page:

  const name = $("#device-name").val();

  const dv = { name: name };

  if (!updateStatus) {
    ipcRenderer.send("new-device", dv);
  } else {
    ipcRenderer.send("update-device", { ...dv, idDeviceToUpdate });
  }

  
});

ipcRenderer.on("new-device-saved", (e, args) => {
  let device = JSON.parse(args);
  devices.push(device);
  reloadTable(devices);
  $("#device-form").trigger("reset");
  toastify({
    text: "Device Added",
    duration: 3000,
    position: "left",
    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
  }).showToast();
});

ipcRenderer.on("get-devices", (e, args) => {
  let allDevices = JSON.parse(args);
  devices = allDevices;
  renderDevices(devices);
});

ipcRenderer.on("delete-device-success", (e, args) => {
  const device = JSON.parse(args);
  const newDevices = devices.filter((d) => {
    return d._id !== device._id;
  });

  devices = newDevices;
  reloadTable(devices);
});

ipcRenderer.on("update-device-success", (e, args) => {
  const updateDevice = JSON.parse(args);
  devices = devices.map((d) => {
    if (d._id === updateDevice._id) {
      d.name = updateDevice.name;
    }
    return d;
  });

  reloadTable(devices);
  updateStatus = false;
});

ipcRenderer.on("error", (e, message) => {
  console.log(message);
  toastify({
    text: message,
    duration: 3000,
    style: { background: "#FF0000", color: "#ffffff" },
  }).showToast();
});
