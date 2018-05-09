###
00     00   0000000   000  000   000
000   000  000   000  000  0000  000
000000000  000000000  000  000 0 000
000 0 000  000   000  000  000  0000
000   000  000   000  000  000   000
###

{ prefs, empty, slash, about, noon, childp, log, fs, _ } = require 'kxk'

electron = require 'electron'
pkg      = require '../package.json'

app           = electron.app
BrowserWindow = electron.BrowserWindow
Tray          = electron.Tray
Menu          = electron.Menu
ipc           = electron.ipcMain
sel           = null
win           = null
tray          = null
debug         = false

# 000  00000000    0000000
# 000  000   000  000
# 000  00000000   000
# 000  000        000
# 000  000         0000000

ipc.on 'toggleMaximize',       -> if win?.isMaximized() then win?.unmaximize() else win?.maximize()
ipc.on 'closeWin',             -> win?.close()
ipc.on 'showAbout',            -> showAbout()
ipc.on 'quitApp',              -> quitApp()

#000   000  000  000   000  0000000     0000000   000   000
#000 0 000  000  0000  000  000   000  000   000  000 0 000
#000000000  000  000 0 000  000   000  000   000  000000000
#000   000  000  000  0000  000   000  000   000  000   000
#00     00  000  000   000  0000000     0000000   00     00

toggleWindow = ->
    if win?.isVisible()
        win.hide()
        app.dock?.hide()
    else
        showWindow()

showWindow = ->
    if win?
        win.show()
    else
        createWindow()
    app.dock?.show()

createWindow = ->

    win = new BrowserWindow
        width:           1000
        height:          1200
        backgroundColor: '#181818'
        maximizable:     true
        minimizable:     true
        fullscreen:      false
        show:            false
        titleBarStyle:   'hidden'
        autoHideMenuBar: true

    bounds = prefs.get 'bounds'
    win.setBounds bounds if bounds?

    win.loadURL "file://#{__dirname}/index.html"
    win.webContents.openDevTools() if debug
    win.on 'ready-to-show', -> win.show()
    win.on 'closed', -> win = null
    win.on 'resize', saveBounds
    win.on 'move', saveBounds
    win.on 'close',  ->
        app.dock?.hide()
    app.dock?.show()
    win

saveBounds = -> if win? then prefs.set 'bounds', win.getBounds()

showAbout = ->
    
    dark = 'dark' == prefs.get 'scheme', 'dark'
    about
        img:        "#{__dirname}/../img/about.png"
        color:      dark and '#383838' or '#ddd'
        background: dark and '#282828' or '#fff'
        highlight:  dark and '#fff'    or '#000'
        pkg:        pkg

quitApp = ->
    
    saveBounds()
    app.exit 0
    process.exit 0
        
app.on 'window-all-closed', (event) -> event.preventDefault()

#00000000   00000000   0000000   0000000    000   000
#000   000  000       000   000  000   000   000 000
#0000000    0000000   000000000  000   000    00000
#000   000  000       000   000  000   000     000
#000   000  00000000  000   000  0000000       000

app.on 'ready', ->

    tray = new Tray "#{__dirname}/../img/menu.png"
    tray.on 'click', toggleWindow
        
    tray.setContextMenu Menu.buildFromTemplate [
        label: "Quit"
        click: -> app.exit 0; process.exit 0
    ,
        label: "About"
        click: showAbout
    ]
    
    app.dock?.hide()
    
    app.setName pkg.productName

    # 00     00  00000000  000   000  000   000
    # 000   000  000       0000  000  000   000
    # 000000000  0000000   000 0 000  000   000
    # 000 0 000  000       000  0000  000   000
    # 000   000  00000000  000   000   0000000

    Menu.setApplicationMenu Menu.buildFromTemplate [
        label: app.getName()
        submenu: [
            label: "About #{pkg.name}"
            accelerator: 'CmdOrCtrl+.'
            click: -> showAbout()
        ,
            label: 'Clear Buffer'
            accelerator: 'CmdOrCtrl+K'
            click: -> clearBuffer()
        ,
            label: 'Save Buffer'
            accelerator: 'CmdOrCtrl+S'
            click: -> saveBuffer()
        ,
            type: 'separator'
        ,
            label:       'Close Window'
            accelerator: 'CmdOrCtrl+W'
            click:       -> win?.close()
        ,
            label: 'Quit'
            accelerator: 'CmdOrCtrl+Q'
            click: -> quitApp()
        ]
    ,
        # 000   000  000  000   000  0000000     0000000   000   000
        # 000 0 000  000  0000  000  000   000  000   000  000 0 000
        # 000000000  000  000 0 000  000   000  000   000  000000000
        # 000   000  000  000  0000  000   000  000   000  000   000
        # 00     00  000  000   000  0000000     0000000   00     00

        label: 'Window'
        submenu: [
            label:       'Minimize'
            accelerator: 'CmdOrCtrl+Alt+M'
            click:       -> win?.minimize()
        ,
            label:       'Maximize'
            accelerator: 'CmdOrCtrl+Shift+m'
            click:       -> if win?.isMaximized() then win?.unmaximize() else win?.maximize()
        ,
            type: 'separator'
        ,
            label:       'Reload Window'
            accelerator: 'CmdOrCtrl+Alt+L'
            click:       -> win?.webContents.reloadIgnoringCache()
        ,
            label:       'Toggle DevTools'
            accelerator: 'CmdOrCtrl+Alt+I'
            click:       -> win?.webContents.openDevTools()
        ]
    ]

    prefs.init
        maxBuffers: 50
        shortcut: 'CmdOrCtrl+Alt+V'

    electron.globalShortcut.register prefs.get('shortcut'), showWindow

    iconDir = slash.resolve "#{app.getPath('userData')}/icons"
    fs.ensureDirSync iconDir

    try
        fs.accessSync slash.join(iconDir, 'kalk.png'), fs.R_OK
    catch
        try
            fs.copySync "#{__dirname}/../img/kalk.png", slash.join iconDir, 'kalk.png'
        catch err
            log "can't copy kalk icon: #{err}"

    if slash.win()
        showWindow()

app.setName pkg.productName        
        
if app.makeSingleInstance showWindow
    app.quit()
    return
