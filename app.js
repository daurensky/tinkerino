const { app, BrowserWindow } = require('electron')
const path = require('path')

// const env = process.env.NODE_ENV

// If development environment
// if (env === 'development') {
//     try {
//         require('electron-reloader')(module, {
//             debug: true,
//             watchRenderer: true,
//         })
//     } catch (_) {
//         console.log('Error')
//     }
//

const createWindow = () => {
    const win = new BrowserWindow({
        width: 500,
        height: 820,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        icon: path.join(__dirname, 'images/icon.ico'),
        frame: false,
        title: 'Calculated on Tinker',
    })

    // env === 'development' && win.webContents.openDevTools()
    win.removeMenu()
    win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
