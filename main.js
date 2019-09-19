// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut} = require('electron')
const path = require('path');

//########################################################################
//This is own content of modules that need to be required for this file
//const { dialog } = require('electron')

//########################################################################

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: true,
    width: 1250,
    height: 1000,
    resizable: true,
    //show: false,
    center: true,
    backgroundColor: '#312450',
    icon: path.join(__dirname, 'i2rightarrow.png')
  })

  globalShortcut.register('f5', function() {
		console.log('f5 is pressed')
		mainWindow.reload()
	})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  //########################################################################
  //This is own content (which shall be loaded at startup)
  //console.log(dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }))

  //########################################################################

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

//########################################################################
//This is own content

//This method is called after the window is created
app.on('browser-window-created',function(e,window) {
  window.setMenu(null);
});

//########################################################################

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
