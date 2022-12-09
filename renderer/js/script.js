

const {ipcRenderer, dialog, BrowserWindow} = require('electron')

// const $ = require('jquery')
const toastify = require('toastify-js')

let receipts = []
let devices = []
let subjects = []

let updateStatus = false
let idReceiptToUpdate = ''

var table;



$(function() {
  "use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

  setupContextMenu()
  ipcRenderer.send('get-receipts')
  getDevices()
  getSubjects()
})



function initDataList() {
  $("#deviceOptions").empty();
  var options = "";
  devices.forEach(item => {
    options +='<option value=" ' + item.name + '">'; 
    console.log(item.name);
  })

  $('#deviceOptions').append(options)
}


function initSubjectList() {
  $("#subjectOptions").empty();
  var options = "";
  subjects.forEach(item => {
    options +='<option value=" ' + item.title + '">'; 
  })

  $('#subjectOptions').append(options)
}

function getDevices() {
  ipcRenderer.send("get-devices")
}

ipcRenderer.on("get-devices",(e, args)=> {
  let allDevices = JSON.parse(args)
  devices = allDevices
  initDataList()
})

function getSubjects() {
  ipcRenderer.send("get-subjects")
}

ipcRenderer.on("get-subjects",(e, args)=> {
  let allSubjects = JSON.parse(args)
  subjects = allSubjects
  initSubjectList()
})

function setupContextMenu() {
  var $contextMenu = $("#contextMenu");

  $("body").on("contextmenu", "table tr", function(e) {
       $contextMenu.css({
            display: "block",
            left: e.pageX,
            top: e.pageY
       });
    
       return false;
  });

  $('html').click(function() {
       $contextMenu.hide();
  });

$("#contextMenu li a").click(function(e){
  var  f = $(this);
});
}



function onDeleteReceipt(id){
  const result = confirm("Are you sure you want to delete Receipt ?")
  if (result) {
   ipcRenderer.send("delete-receipt",id)
  }
 }

 function updatedReceipt(id) {
   updateStatus = true
   idReceiptToUpdate = id
   const receipt = receipts.find(d => d._id === id)
   console.log("Id" , receipts);
  
  $("#customer").val(receipt.customerName)
  $("#phone").val(receipt.customerPhone)
  $("#device-name").val(receipt.device)
  $("#subject").val(receipt.subject)
  $("#prePayment").val(receipt.prePayment)
  $("#cost").val(receipt.cost)
  $("#reminingCost").val(receipt.remainingPayment)
  $("#fee").val(receipt.fee)
  $("#description").val(receipt.description)
 }


function renderReceipts(receiptItems) {

  $('#table').find("tr:gt(0)").remove();

  $('#table').DataTable({
    "dom": "<'row'<'col-sm-12 col-md-4'f><'col-sm-12 col-md-4 mt-1 block border-gray-300'l>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    "scrollY": "100vh",
    "scrollCollapse": true,
    "data": receipts,
    columns: [
      {"data":"receiptNumber"},
      {"data":"customerName"},
      {"data":"customerPhone"},
      {"data":"device"},
      {"data":"subject"},
      {"data":"cost"},
      {"data":"fee"},
      {"data":"prePayment"},
      {"data":"remainingPayment"},
      {"data":"description"},
      {"data":"createdAt"}
    ]
  });

  $('.dataTables_length').addClass('bs-select');
}

function reloadTable(receipts) {
  $('#table').DataTable().clear().rows.add(receipts).draw();
}

$("#receipt-form").on("submit", function(event) {
  event.preventDefault();

  const customerName = $("#customer").val()
  const customerPhone = parseInt($("#phone").val())
  const device = $("#device-name").val()
  const subject = $("#subject").val()
  const prePayment = parseInt($("#prePayment").val())
  const cost = parseInt($("#cost").val())
  const remainingPayment = parseInt($("#reminingCost").val())
  const fee = parseInt($("#fee").val())
  const description = $("#description").val()
    
  const receipt = {
    customerName,
    customerPhone,
    device,
    subject,
    prePayment,
    cost,
    fee,
    remainingPayment,
    description}
  
  console.log(customerPhone);
  if (!updateStatus) {
    ipcRenderer.send('new-receipt', receipt)
  } else {
    ipcRenderer.send("update-receipt",{...receipt, idReceiptToUpdate})
  }
})

ipcRenderer.on('new-receipt-saved',(e, args)=> {
  let receipt = JSON.parse(args)
  receipts.push(receipt)
  reloadTable(receipt)
  $("#receipt-form").trigger('reset')
  toastify({
    text: "Receipt Added",
    duration: 3000,
    position: "left",
    style: { background: "linear-gradient(to right, #00b09b, #96c93d)"}
  }).showToast();
})

ipcRenderer.on('get-receipts',(e, args)=> {
  let allReceipts = JSON.parse(args)
  receipts = allReceipts
  renderReceipts(receipts)  
})

ipcRenderer.on('delete-receipt-success',(e,args)=> {
  const receipt = JSON.parse(args)
  const newReceipt = receipts.filter(d => {
    return d._id !== receipt._id
  })

  receipts = newReceipt
  reloadTable(receipts)

})

ipcRenderer.on("update-receipt-success", (e, args) => {
  const updateReceipt = JSON.parse(args)
  receipts = receipts.map(d => {
    if (d._id === updateReceipt._id){
      d.customerName = updateReceipt.customerName
      d.customerPhone = updateReceipt.customerPhone
      d.device = updateReceipt.device
      d.subject = updateReceipt.subject
      d.cost = updateReceipt.cost
      d.fee = updateReceipt.fee
      d.prePayment = updateReceipt.prePayment
      d.remainingPayment = updateReceipt.remainingPayment
      d.description = updateReceipt.description
    }
    return d
  })

  reloadTable(receipts)
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

var options = {
  silent: false,
  printBackground: true,
  color: false,
  margin: {
      marginType: 'printableArea'
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Header of the Page',
  footer: 'Footer of the Page'
}

$('#current').on("click", function(event) {
  ipcRenderer.send('print', {})
})

$('#next-page').on("click", function(event) {
  ipcRenderer.send('show-preview')
})

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}