const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, Menu, ipcMain, webContents } = require("electron");

const isDev = process.env.NODE_ENV !== "production";

const isMac = process.platform === "darwin";

const { mongoose } = require("./db/mongoose");

const receiptController = require("./controllers/receipt");

const deviceController = require("./controllers/device");

const subjectController = require("./controllers/subject");
const e = require("express");

let printerWindow;
let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Tamirat",
    width: isDev ? 1000 : 500,
    height: 600,
    show: false,
    backgroundColor: "#ffff00",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));

  mainWindow.once("ready-to-show", mainWindow.show);
}

function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About",
    width: 300,
    height: 300,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
}

function createDevicesWindow() {
  const devicesWindow = new BrowserWindow({
    title: "Devices",
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  if (isDev) {
    devicesWindow.webContents.openDevTools();
  }

  devicesWindow.loadFile(path.join(__dirname, "./renderer/devices.html"));
}

function createSubjecstWindow() {
  const subjectsWindow = new BrowserWindow({
    title: "Subjects",
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  if (isDev) {
    subjectsWindow.webContents.openDevTools();
  }

  subjectsWindow.loadFile(path.join(__dirname, "./renderer/subject.html"));
}

function createCustomerWindow() {
  const customerWindow = new BrowserWindow({
    title: "Devices",
    width: 800,
    height: 600,
  });

  customerWindow.loadFile(path.join(__dirname, "./renderer/newCustomer.html"));
}

app.whenReady().then(() => {
  createMainWindow();

  // Implement menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:",
      },
    ],
  },
  {
    label: "settings",
    submenu: [
      {
        label: "Devices",
        click: createDevicesWindow,
      },
      {
        label: "Subjects",
        click: createSubjecstWindow,
      },
      {
        label: "Customers",
        click: createCustomerWindow,
      },
    ],
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

function showMainWindow() {
    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"))
        .then(() => { window.show(); })
}

function showLoginWindow() {
    // window.loadURL('https://www.your-site.com/login')
    mainWindow.loadFile(path.join(__dirname, "./renderer/setting.html"))
        .then(() => { window.show(); })
}

ipcMain.on('show-main',(e,args)=> {
    showMainWindow()
})

ipcMain.on('show-preview',(e,args)=> {
    showLoginWindow()
})


// Receipt

ipcMain.on("new-receipt", receiptController.onAddNewReceipt);

ipcMain.on("get-receipts", receiptController.onGetReceipts);

ipcMain.on("delete-receipt", receiptController.onDeleteReceipt);

ipcMain.on("update-receipt", receiptController.onUpdateReceipt);

// Device

ipcMain.on(deviceController.ADD_NEW_DEVICE, deviceController.onAddNewDevice);

ipcMain.on(deviceController.GET_ALL_DEVICE, deviceController.onGetDevices);

ipcMain.on(deviceController.DELETE_DEVICE, deviceController.onDeleteDevices);

ipcMain.on(deviceController.UPDATE_DEVICE, deviceController.onUpdateDevices);

// Subject

ipcMain.on("new-subject", subjectController.onAddNewSubject);

ipcMain.on("get-subjects", subjectController.onGetSubjects);

ipcMain.on("delete-subject", subjectController.onDeleteSubjects);

ipcMain.on("update-subject", subjectController.onUpdateSubjects);

var options = {
  silent: false,
  printBackground: true,
  color: false,
  margin: {
    marginType: "printableArea",
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: "Header of the Page",
  footer: "Footer of the Page",
};

var options = {
  marginsType: 0,
  pageSize: "A5",
  printBackground: true,
  printSelectionOnly: false,
  landscape: false,
};
ipcMain.on("print", function (event, args) {
  // let win = BrowserWindow.getAllWindows()[0];
  printerWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  printerWindow.loadFile(path.join(__dirname, "./renderer/preview.html"));

  printerWindow.webContents.openDevTools();

  printerWindow.once("ready-to-show", () => printerWindow.hide());

  printerWindow.on("close", () => printerWindow = null);

  printerWindow.webContents.on("did-finish-load", async () => {
    if (printerWindow === null) return;

    console.log("Did Finish Load");

    console.log("Start Creating PDF");
    let data = { title: "Jack And Dani" };
    printerWindow.webContents.send("message", JSON.stringify(data));
    
  });
});

ipcMain.on("start-printing", async (event, args) => {
    const pdf = await event.sender.printToPDF(options);
    await createPDFFrom(pdf);
    printerWindow.close()
    printerWindow = null
})


async function createPDFFrom(data) {
  var filepath1 = path.join("/Users/armanbalash/Desktop/", "print1.pdf");
  if (data !== undefined || data !== null) {
    console.log("Start Write To File");
    fs.writeFile(filepath1, data, (err) => {
      if (err) {
        return false;
      } else {
        console.log("PDF Generated Successfully");
        return true;
      }
    });
  }
  return;
}

// ipcMain.on('print', (event, arg) => {
//     let win = new BrowserWindow({ width: 302, height: 793, show: false });
//     win.once('ready-to-show', () => win.hide());

//     fs.writeFile(path.join(__dirname, './renderer/preview.html'), arg, function () {
//         win.loadURL(`file://${path.join(__dirname, './renderer/preview.html')}`);
//         win.webContents.on('did-finish-load', async () => {

//         // Finding Default Printer name
//             let printersInfo = await win.webContents.getPrintersAsync();
//             let printer = printersInfo.filter(printer => printer.isDefault === true)[0];

//             const options = {
//                 silent: true,
//                 deviceName: printer.name,
//                 pageSize: { height: 301000, width: 50000 }
//             }

//             win.webContents.print(options, () => {
//                 win = null;
//             });
//         });
//     })

//     event.returnValue = true;
// });
