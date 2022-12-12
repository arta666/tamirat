const { ipcRenderer, app, dialog, BrowserWindow } = require("electron");
const $ = require("jquery");
const Store = require("electron-store");
const store = new Store();

ipcRenderer.on("message", async (e, args) => {
  let {
    receiptNumber,
    customerName,
    customerPhone,
    device,
    subject,
    cost,
    fee,
    prePayment,
    remainingPayment,
    createdAt,
  } = JSON.parse(args);

  $("#title").text(store.get("header"));
  $("#receiptNumber").text(`شماره ${toFarsiNumber(parseInt(receiptNumber))}`);
  $("#date").text(`تاریخ  ${createdAt}`);
  $("#customerName").text(`جناب آقای / خانم ${customerName}`);
  $("#customerPhone").text(`شماره تماس ${customerPhone}`);
  $("#device").text(`نام دستگاه ${device}`);
  $("#subject").text(`عیب دستگاه ${subject}`);
  $("#fee").text(` دستمزد شرکتی ${fee}`);
  $("#prePayment").text(`پیش پرداخت ${prePayment}`);
  $("#remainingPayment").text(`مانده حساب ${remainingPayment}`);

  $("#c-title").text(store.get("header"));
  $("#c-receiptNumber").text(`شماره ${toFarsiNumber(parseInt(receiptNumber))}`);
  $("#c-date").text(`تاریخ  ${createdAt}`);
  $("#c-customerName").text(`جناب آقای / خانم ${customerName}`);
  $("#c-device").text(`نام دستگاه ${device}`);
  $("#c-subject").text(`عیب دستگاه ${subject}`);
  $("#c-cost").text(`هزینه تقریبی${cost}`);
  $("#c-prePayment").text(`پیش پرداخت ${prePayment}`);
  $("#c-remainingPayment").text(`مانده حساب ${remainingPayment}`);

  $("#c-footer").text(store.get("footer"));
  $("#c-address").text(store.get("address"));

  if (store.get("printer") === 1){
     window.print()
  }

  ipcRenderer.send("start-printing");
});

function toFarsiNumber(n) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
}
