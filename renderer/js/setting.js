const toastify = require("toastify-js");

const Store = require('electron-store');
const store = new Store();

$(function () {

    initForm()

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

    
  
});


function initForm() {

    const selectedPrinter = store.get("printer") || 0
    const selectedCurrency = store.get("currency") || 0

    $("#select-printer > [value=" + selectedPrinter + "]").attr("selected", "true");
    $("#select-currency > [value=" + selectedCurrency + "]").attr("selected", "true");

    const title = store.get("title") || ""
    const address = store.get("address") || ""
    const header = store.get("header") || ""
    const footer = store.get("footer") || ""

    $("#title").val(title)
    $("#address").val(address)
    $("#header").val(header)
    $("#footer").val(footer)
}

$("#select-printer").on('change',function () {
    var end = this.value;
    store.set('printer',parseInt(end))
});

$("#select-currency").on('change',function () {
    var end = this.value;
    store.set('currency',parseInt(end))
});

$("#form").on("submit", function (event) {
  // alert( "Handler for .submit() called." );
  event.preventDefault();
  // Get some values from elements on the page:

  const title = $("#title").val();
  const address = $("#address").val();
  const header = $("#header").val();
  const footer = $("#footer").val();

  store.set('title',title)
  store.set('address',address)
  store.set('header',header)
  store.set('footer',footer)

  console.log(store.get('title'));

});


