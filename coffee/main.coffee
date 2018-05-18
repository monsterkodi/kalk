###
00     00   0000000   000  000   000
000   000  000   000  000  0000  000
000000000  000000000  000  000 0 000
000 0 000  000   000  000  000  0000
000   000  000   000  000  000   000
###

{ prefs, empty, slash, about, karg, post, watch, childp, fs, log, error, _ } = require 'kxk'

electron = require 'electron'
pkg      = require '../package.json'

app           = electron.app
BrowserWindow = electron.BrowserWindow
Tray          = electron.Tray
Menu          = electron.Menu
sel           = null
win           = null
tray          = null
debug         = false

#  0000000   00000000    0000000    0000000
# 000   000  000   000  000        000
# 000000000  0000000    000  0000  0000000
# 000   000  000   000  000   000       000
# 000   000  000   000   0000000   0000000

args  = karg """

#{pkg.name}

    noprefs   . ? don't load preferences     . = false
    DevTools  . ? open developer tools       . = false
    watch     . ? watch sources for changes  . = false

version  #{pkg.version}

"""

app.exit 0 if not args?

# 00000000    0000000    0000000  000000000  
# 000   000  000   000  000          000     
# 00000000   000   000  0000000      000     
# 000        000   000       000     000     
# 000         0000000   0000000      000     

post.on 'menuAction', (action, arg) -> onMenuAction action, arg
post.on 'toggleMaximize',       -> if win?.isMaximized() then win?.unmaximize() else win?.maximize()
post.on 'closeWin',             -> win?.close()
post.on 'showAbout',            -> showAbout()
post.on 'quitApp',              -> quitApp()

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
        width:           480
        height:          900
        backgroundColor: '#181818'
        maximizable:     false
        resizable:       false
        minimizable:     true
        fullscreen:      false
        show:            false
        titleBarStyle:   'hidden'
        autoHideMenuBar: true
        frame:           false
        icon:            slash.path __dirname + '/../img/kalk.ico'

    bounds = prefs.get 'bounds'
    win.setPosition bounds.x, bounds.y if bounds?

    win.loadURL "file://#{__dirname}/index.html"
    win.webContents.openDevTools() if args.DevTools
    win.on 'ready-to-show', -> win.show()
    win.on 'closed', -> win = null
    win.on 'resize', saveBounds
    win.on 'move', saveBounds
    win.on 'close',  -> app.dock?.hide()
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
    
    stopWatcher()
    saveBounds()
    app.exit 0
    process.exit 0
        
app.on 'window-all-closed', (event) -> event.preventDefault()

# 000   000   0000000   000000000   0000000  000   000  00000000  00000000     
# 000 0 000  000   000     000     000       000   000  000       000   000    
# 000000000  000000000     000     000       000000000  0000000   0000000      
# 000   000  000   000     000     000       000   000  000       000   000    
# 00     00  000   000     000      0000000  000   000  00000000  000   000    

watcher = null

startWatcher = ->
    
    watcher = watch.watch __dirname
    watcher.on 'change', onSrcChange
    watcher.on 'error', (err) -> error err

stopWatcher = -> 
    
    if watcher?
        watcher.close()
        watcher = null

onSrcChange = (path) ->
    # log "changed #{path}"
    if path == __filename
        stopWatcher()
        app.exit 0
        childp.execSync "#{__dirname}/../node_modules/.bin/electron . -w",
            cwd:      "#{__dirname}/.."
            encoding: 'utf8'
            stdio:    'inherit'
            shell:    true
        process.exit 0
    else
        post.toWins 'reload'
        
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
    
    app.setName pkg.name

    if not args.noprefs
        prefs.init
            shortcut: 'CmdOrCtrl+Alt+C'

    electron.globalShortcut.register prefs.get('shortcut'), showWindow

    showWindow()
    
    if args.watch
        startWatcher()

onMenuAction = (action, arg) ->

    switch action
        when 'Quit'       then quitApp()
        when 'About kalk' then showAbout()
        
app.setName pkg.name        
        
if app.makeSingleInstance showWindow
    app.quit()
    return
