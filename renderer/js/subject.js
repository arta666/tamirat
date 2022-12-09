
// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI

const {ipcRenderer, dialog} = require('electron')
const $ = require('jquery')
const toastify = require('toastify-js')

let subjects = []

let updateStatus = false
let idSubjectToUpdate = ''

$(function() {
  ipcRenderer.send('get-subjects')
  })

  function deleteSubject(id){
   const result = confirm("Are you sure you want to delete subject ?")
   if (result) {
    ipcRenderer.send("delete-subject",id)
   }
  }

  function updateSubject(id) {
    updateStatus = true
    idSubjectToUpdate = id
    const subject = subjects.find(d => d._id === id)
    $('#title').val(subject.title)
    $('#description').val(subject.description)

  }

  function renderSubjects(subjectItems) {

    $('#table').find("tr:gt(0)").remove();
    for(i= 0 ; i < subjectItems.length; i ++) {
      let dv = subjectItems[i]
      let id = dv._id
      let title = dv.title
      let description = dv.description
      $('#table tr:last').after(
        `<tr class="active-row">
        <td>${i}</td>
        <td>${title}</td>
        <td>${description}</td>
        <td><button type="button" onclick="updateSubject('${id}')">Edit</button></td>
        <td><button type="button" onclick="deleteSubject('${id}')">Delete</button></td>
        </tr>`);
    }
  }

  $("#btn-action" ).click(function( event ) {
    // alert( "Handler for .submit() called." );
    event.preventDefault();
    // Get some values from elements on the page:
  
    const title = $("#title").val()
    const description = $("#description").val()
    
    const dv = {title,description}
    
    if (!updateStatus) {
      ipcRenderer.send('new-subject', dv)
    } else {
      ipcRenderer.send("update-subject",{...dv, idSubjectToUpdate})
    }
    
    $("#subject-form").trigger('reset')
  });

  ipcRenderer.on('new-subject-saved',(e, args)=> {
    let subject = JSON.parse(args)
    subjects.push(subject)
    renderSubjects(subjects)
    toastify({
      text: "Subject Added",
      duration: 3000,
      position: "left",
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)"}
    }).showToast();
  })

  ipcRenderer.on('get-subjects',(e, args)=> {
    let allSubjects = JSON.parse(args)
    subjects = allSubjects
    renderSubjects(subjects)
  })

  ipcRenderer.on('delete-subject-success',(e,args)=> {
    const subject = JSON.parse(args)
    const newSubjects = subjects.filter(d => {
      return d._id !== subject._id
    })

    subjects = newSubjects
    renderSubjects(subjects)

  })

  ipcRenderer.on("update-subject-success", (e, args) => {
    const updateSubject = JSON.parse(args)
    subjects = subjects.map(d => {
      if (d._id === updateSubject._id){
        d.title = updateSubject.title
        d.description = updateSubject.description
      }
      return d
    })

    renderSubjects(subjects)
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

  