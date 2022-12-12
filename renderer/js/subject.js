// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI

const { ipcRenderer } = require("electron");

const { dialog } = require("@electron/remote");

const toastify = require("toastify-js");

let subjects = [];

let updateStatus = false;
let idSubjectToUpdate = "";

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

  ipcRenderer.send("get-subjects");
});

function deleteSubject(id) {
  const options = {
    type: "question",
    buttons: ["لغو", "حذف شود"],
    defaultId: 1,
    title: "حذف",
    message: "آیا میخواهید این آیتم را حذف کنید ؟",
  };

  dialog
    .showMessageBox(null, options)
    .then((result) => {
      if (result.response === 1) {
        ipcRenderer.send("delete-subject", id);
      }
    })
    .catch((e) => console.log(e));
}

function updateSubject(id) {
  updateStatus = true;
  idSubjectToUpdate = id;
  const subject = subjects.find((d) => d._id === id);
  $("#title").val(subject.title);
  $("#description").val(subject.description);
}

function renderSubjects(subjectItems) {
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

    data: subjectItems,
    columns: [{ data: "title" }, { data: "description" }, { data: null }],
  });

}

$("#table tbody").on("click", "button[id='btn-delete']", function (e) {
  var data = table.row($(this).parents("tr")).data();
  deleteSubject(data._id);
});

$("#table tbody").on("click", "button[id='btn-edit']", function (e) {
  var data = table.row($(this).parents("tr")).data();
  updateSubject(data._id);
});

function reloadTable(receipts) {
  $("#table").DataTable().clear().rows.add(receipts).draw();
}

$("#btn-action").click(function (event) {
  // alert( "Handler for .submit() called." );
  event.preventDefault();
  // Get some values from elements on the page:

  const title = $("#title").val();
  const description = $("#description").val();

  const dv = { title, description };

  if (!updateStatus) {
    ipcRenderer.send("new-subject", dv);
  } else {
    ipcRenderer.send("update-subject", { ...dv, idSubjectToUpdate });
  }

});

ipcRenderer.on("new-subject-saved", (e, args) => {
  let subject = JSON.parse(args);
  subjects.push(subject);
  reloadTable(subjects);
  $("#subject-form").trigger("reset");
  toastify({
    text: "Subject Added",
    duration: 3000,
    position: "left",
    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
  }).showToast();
});

ipcRenderer.on("get-subjects", (e, args) => {
  let allSubjects = JSON.parse(args);
  subjects = allSubjects;
  renderSubjects(subjects);
});

ipcRenderer.on("delete-subject-success", (e, args) => {
  const subject = JSON.parse(args);
  const newSubjects = subjects.filter((d) => {
    return d._id !== subject._id;
  });

  subjects = newSubjects;
  reloadTable(subjects);
});

ipcRenderer.on("update-subject-success", (e, args) => {
  const updateSubject = JSON.parse(args);
  subjects = subjects.map((d) => {
    if (d._id === updateSubject._id) {
      d.title = updateSubject.title;
      d.description = updateSubject.description;
    }
    return d;
  });

  reloadTable(subjects);
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
