const { app, BrowserWindow, ipcMain, clipboard, shell, nativeImage, screen, Tray, Menu, dialog } = require('electron')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { execFile } = require('node:child_process')

const { fsRoute, expandTilde } = require('./routes.cjs')

const bundlePath = path.resolve(__dirname, '..')
const windows = new Map()
let nextWindowId = 0
let isQuitting = false
let tray = null

app.setName('kalk')
app.setVersion('1.1.0')
app.setDesktopName('kalk')

const hasLock = app.requestSingleInstanceLock()
if (!hasLock)
{
    app.quit()
}

app.on('second-instance', function (event, argv)
{
    const wins = kalkWindows()
    if (wins.length)
    {
        for (const win of wins)
        {
            win.show()
        }
        wins[wins.length - 1].focus()
        return
    }
    createWindow(indexFromArgv(argv))
})

function indexFromArgv (argv)
{
    const args = argv.slice(1).filter(function (arg)
    {
        return !arg.startsWith('--') &&
               arg !== '.' &&
               arg !== '..' &&
               arg !== __filename &&
               arg !== bundlePath &&
               arg !== bundlePath + path.sep
    })
    return args[0] || 'index.html'
}

function moveStashWins ()
{
    const dir = path.join(bundlePath, '.stash', 'win')
    const old = path.join(bundlePath, '.stash', 'old')
    fs.rmSync(old, { recursive: true, force: true })
    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir, { recursive: true })
        return
    }
    try
    {
        fs.renameSync(dir, old)
    }
    catch (err)
    {
        return
    }
    fs.mkdirSync(dir, { recursive: true })
}

function displayFor (win)
{
    try
    {
        return screen.getDisplayMatching(win.getBounds())
    }
    catch (err)
    {
        return screen.getPrimaryDisplay()
    }
}

function displayForFrame (rect, fallback)
{
    const found = screen.getAllDisplays().find(function (display)
    {
        return rect.x >= display.bounds.x &&
               rect.x < display.bounds.x + display.bounds.width
    })
    return found || fallback || screen.getPrimaryDisplay()
}

function displayUnderCursor ()
{
    return screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
}

function centerWindow (win)
{
    const display = displayFor(win)
    const area = display.workArea
    const size = win.getSize()
    win.setPosition(
        Math.round(area.x + (area.width - size[0]) / 2),
        Math.round(area.y + (area.height - size[1]) / 2)
    )
}

function toggleMaximize (win)
{
    const display = displayFor(win)
    const area = display.workArea
    if (win.kalkZoomed)
    {
        if (win.kalkRestoreBounds)
        {
            win.setBounds(win.kalkRestoreBounds)
        }
        win.kalkZoomed = false
        emitAll('window.demaximizes')
    }
    else
    {
        const bounds = win.getBounds()
        win.kalkRestoreBounds = bounds
        win.setBounds({
            x: bounds.x,
            y: area.y,
            width: bounds.width,
            height: area.height
        })
        win.kalkZoomed = true
        emitAll('window.maximizes')
    }
}

function toCocoaRect (rect, display)
{
    const height = display.bounds.y + display.bounds.height
    return {
        x: rect.x,
        y: height - (rect.y + rect.height),
        w: rect.width,
        h: rect.height
    }
}

function fromCocoaRect (rect, display)
{
    const height = display.bounds.y + display.bounds.height
    return {
        x: Math.round(rect.x),
        y: Math.round(height - (rect.y + rect.h)),
        width: Math.round(rect.w),
        height: Math.round(rect.h)
    }
}

function frameInfo (win)
{
    const display = displayFor(win)
    return {
        id: win.kalkId,
        frame: toCocoaRect(win.getBounds(), display),
        screen: {
            x: display.bounds.x,
            y: display.bounds.y,
            w: display.bounds.width,
            h: display.bounds.height
        }
    }
}

function sendMsg (win, msg)
{
    if (!win || win.isDestroyed())
    {
        return
    }
    win.webContents.send('kakao-receive', msg)
}

function sendEvent (win, name, ...args)
{
    sendMsg(win, { name: name, args: args })
}

function emitAll (name, ...args)
{
    for (const win of windows.values())
    {
        sendEvent(win, name, ...args)
    }
}

function kalkWindows ()
{
    return Array.from(windows.values()).filter(function (win)
    {
        return !win.isDestroyed()
    })
}

function resolveURL (urlString)
{
    if (!urlString)
    {
        urlString = 'index.html'
    }
    if (urlString.startsWith('http://') ||
        urlString.startsWith('https://') ||
        urlString.startsWith('file://'))
    {
        return urlString
    }
    if (urlString.startsWith('/') || urlString.startsWith('~'))
    {
        return pathToFileURL(expandTilde(urlString)).toString()
    }
    if (!urlString.endsWith('.html'))
    {
        urlString += '.html'
    }
    return pathToFileURL(path.join(bundlePath, 'js', urlString)).toString()
}

function createWindow (urlString, initScript)
{
    const id = ++nextWindowId
    const args = ['--kalk-bundle=' + bundlePath, '--kalk-win-id=' + id]
    if (initScript)
    {
        args.push('--kalk-init-script=' + Buffer.from(initScript, 'utf8').toString('base64'))
    }

    const display = displayUnderCursor()
    const area = display.workArea
    const win = new BrowserWindow({
        x: Math.round(area.x + (area.width - 400) / 2),
        y: Math.round(area.y + (area.height - 400) / 2),
        width: 400,
        height: 400,
        show: false,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        hasShadow: true,
        resizable: true,
        minimizable: true,
        maximizable: true,
        fullscreenable: true,
        title: 'kalk',
        icon: path.join(bundlePath, 'Contents', 'Resources', 'img', 'about_kalk.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: false,
            nodeIntegration: false,
            sandbox: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            spellcheck: false,
            backgroundThrottling: false,
            additionalArguments: args
        }
    })

    win.kalkId = id
    windows.set(id, win)

    win.setMenuBarVisibility(false)

    let frameTimer = null
    const sendFrameSoon = function ()
    {
        if (frameTimer)
        {
            return
        }
        frameTimer = setTimeout(function ()
        {
            frameTimer = null
            sendEvent(win, 'window.frame', frameInfo(win))
        }, 30)
    }

    win.on('resize', sendFrameSoon)
    win.on('move', sendFrameSoon)
    win.on('focus', function ()
    {
        sendMsg(win, { name: 'window.focus', args: [] })
    })
    win.on('blur', function ()
    {
        sendMsg(win, { name: 'window.blur', args: [] })
    })
    win.on('maximize', function ()
    {
        emitAll('window.maximizes')
    })
    win.on('unmaximize', function ()
    {
        emitAll('window.demaximizes')
    })

    win.on('close', function (event)
    {
        if (win.allowClose)
        {
            return
        }
        if (isQuitting)
        {
            return
        }
        event.preventDefault()
        const save = kalkWindows().length <= 1
        sendMsg(win, { name: 'window.close', args: [save] })
        setTimeout(function ()
        {
            if (!win.isDestroyed())
            {
                win.allowClose = true
                win.destroy()
            }
        }, 150)
    })

    win.on('closed', function ()
    {
        windows.delete(id)
    })

    win.webContents.on('did-finish-load', function ()
    {
        if (win.reloadPending)
        {
            win.reloadPending = false
            sendMsg(win, { name: 'window.didReload', args: [] })
        }
    })

    win.loadURL(resolveURL(urlString)).catch(function (err)
    {
        console.error('could not load', urlString, err)
    })
    win.show()

    return win
}

function quitApp ()
{
    if (isQuitting)
    {
        return
    }
    isQuitting = true
    for (const win of kalkWindows())
    {
        sendMsg(win, { name: 'window.close', args: [true] })
    }
    setTimeout(function ()
    {
        app.quit()
    }, 150)
}

function focusSibling (win, offset)
{
    const wins = kalkWindows()
    const index = wins.indexOf(win)
    if (index < 0 || wins.length < 2)
    {
        return null
    }
    let siblingIndex = index + offset
    if (siblingIndex < 0) siblingIndex = wins.length - 1
    if (siblingIndex >= wins.length) siblingIndex = 0
    const sibling = wins[siblingIndex]
    sibling.show()
    sibling.focus()
    return sibling
}

function createTray (iconPath)
{
    if (tray)
    {
        return tray
    }
    let image = nativeImage.createFromPath(iconPath)
    if (image.isEmpty())
    {
        image = nativeImage.createFromPath(path.join(bundlePath, 'Contents', 'Resources', 'img', 'menu_kakao.png'))
    }
    tray = new Tray(image)
    tray.setToolTip('kalk')
    tray.on('click', function ()
    {
        emitAll('status.click', { x: 0, y: 0, w: 0, h: 0 })
    })
    tray.on('right-click', function ()
    {
        emitAll('status.right_click', { x: 0, y: 0, w: 0, h: 0 })
    })
    return tray
}

function updateTrayFromPage (win, rect)
{
    try
    {
        createTray(path.join(bundlePath, 'Contents', 'Resources', 'img', 'menu_kalk.png'))
        const x = Math.max(0, Math.floor(rect.x || 0))
        const y = Math.max(0, Math.floor(rect.y || 0))
        const w = Math.max(1, Math.ceil(rect.w || 22))
        const h = Math.max(1, Math.ceil(rect.h || 22))
        const captureRect = {
            x: x,
            y: y,
            width: Math.min(w, Math.max(1, win.getContentSize()[0] - x)),
            height: Math.min(h, Math.max(1, win.getContentSize()[1] - y))
        }
        win.webContents.capturePage(captureRect).then(function (image)
        {
            if (image.isEmpty() || !tray)
            {
                return
            }
            tray.setImage(image.resize({ width: 22, height: 22 }))
        }).catch(function () {})
    }
    catch (err)
    {
        console.error('status.icon', err)
    }
}

function snapshot (win, filePath)
{
    let target = filePath
    if (!target)
    {
        const desktop = path.join(os.homedir(), 'Desktop')
        target = path.join(desktop, 'kakao.png')
        let number = 0
        while (fs.existsSync(target))
        {
            number++
            target = path.join(desktop, `kakao_${number}.png`)
        }
    }
    else
    {
        target = expandTilde(target)
    }
    win.webContents.capturePage().then(function (image)
    {
        fs.mkdirSync(path.dirname(target), { recursive: true })
        fs.writeFileSync(target, image.toPNG())
    }).catch(function (err)
    {
        console.error('snapshot', err)
    })
    return target
}

function runShellScript (args)
{
    const command = args[0]
    if (typeof command !== 'string')
    {
        return null
    }
    let rest = args.slice(1)
    let options = {}
    if (rest[0] && typeof rest[0] === 'object' && !Array.isArray(rest[0]))
    {
        const dict = rest[0]
        if (dict.cwd)
        {
            options.cwd = expandTilde(dict.cwd)
        }
        if (dict.args)
        {
            rest = dict.args
        }
        else if (dict.arg)
        {
            rest = Array.isArray(dict.arg) ? dict.arg : String(dict.arg).split(' ')
        }
        else
        {
            rest = []
        }
    }
    return new Promise(function (resolve)
    {
        execFile(command, rest, options, function (err, stdout)
        {
            resolve(err ? null : stdout)
        })
    })
}

function bundleRoute (req, args)
{
    const arg = args[0] || ''
    switch (req)
    {
        case 'path': return bundlePath
        case 'appPath': return path.join(bundlePath, arg)
        case 'macOSPath': return path.join(bundlePath, 'Contents', 'MacOS', arg)
        case 'jsPath': return path.join(bundlePath, 'js', arg)
        case 'resourcePath': return path.join(bundlePath, 'Contents', 'Resources', arg)
        case 'URL': return pathToFileURL(bundlePath).toString()
        case 'fileURL': return pathToFileURL(path.join(bundlePath, arg)).toString()
        case 'jsURL': return pathToFileURL(path.join(bundlePath, 'js', arg)).toString()
    }
    return null
}

async function windowRoute (req, args, win)
{
    const arg0 = args[0]
    const arg1 = args[1]

    switch (req)
    {
        case 'focusNext':
        {
            return focusSibling(win, 1)
        }
        case 'focusPrev':
        {
            return focusSibling(win, -1)
        }
        case 'frameInfo':
        {
            return frameInfo(win)
        }
        case 'new':
        {
            const created = createWindow(arg0 || 'index.html', arg1)
            return created.kalkId
        }
        case 'snapshot':
        {
            return snapshot(win, arg0)
        }
        case 'close':
        {
            win.close()
            return null
        }
        case 'reload':
        {
            sendMsg(win, 'window.willReload')
            win.reloadPending = true
            setTimeout(function ()
            {
                if (!win.isDestroyed())
                {
                    win.webContents.reloadIgnoringCache()
                }
            }, 100)
            return null
        }
        case 'raise':
        {
            win.show()
            win.focus()
            return null
        }
        case 'maximize':
        {
            toggleMaximize(win)
            return null
        }
        case 'minimize':
        {
            win.hide()
            return null
        }
        case 'hide':
        {
            win.hide()
            return null
        }
        case 'center':
        {
            centerWindow(win)
            return null
        }
        case 'setTopLeft':
        {
            const display = displayFor(win)
            const height = display.bounds.y + display.bounds.height
            win.setPosition(Math.round(arg0.x), Math.round(height - arg0.y))
            return null
        }
        case 'setFrame':
        {
            const display = displayForFrame(arg0, displayFor(win))
            const rect = fromCocoaRect(arg0, display)
            win.setBounds(rect)
            return null
        }
        case 'setSize':
        {
            win.setSize(Math.round(arg0), Math.round(arg1))
            return null
        }
        case 'setMinSize':
        {
            win.setMinimumSize(Math.round(arg0), Math.round(arg1))
            return null
        }
        case 'setMaxSize':
        {
            win.setMaximumSize(Math.round(arg0), Math.round(arg1))
            return null
        }
        case 'id':
        {
            return win.kalkId
        }
        case 'framerateDrop':
        {
            return null
        }
        case 'toggleInspector':
        {
            win.webContents.toggleDevTools()
            return null
        }
        case 'fullscreen':
        {
            win.setFullScreen(!win.isFullScreen())
            return null
        }
        case 'post':
        {
            const msg = { name: arg0, args: Array.isArray(arg1) ? arg1 : [] }
            for (const other of kalkWindows())
            {
                if (other !== win)
                {
                    sendMsg(other, msg)
                }
            }
            return null
        }
    }

    return null
}

function statusRoute (req, args, win)
{
    if (req === 'icon')
    {
        updateTrayFromPage(win, args[0] || {})
    }
    return null
}

async function request (msg, win)
{
    const route = msg && msg.route
    const args = (msg && Array.isArray(msg.args)) ? msg.args : []

    if (route === 'log')
    {
        console.log('kakao log', msg)
        return null
    }
    if (route === 'now')
    {
        return Date.now() / 1000
    }
    if (route === 'open')
    {
        const target = args[0]
        if (typeof target === 'string')
        {
            if (/^[a-z][a-z0-9+.-]*:/i.test(target) && !target.startsWith('/'))
            {
                shell.openExternal(target)
            }
            else
            {
                shell.openPath(expandTilde(target))
            }
        }
        return null
    }
    if (route === 'finder')
    {
        const targets = Array.isArray(args[0]) ? args[0] : [args[0]]
        for (const target of targets)
        {
            if (typeof target === 'string')
            {
                shell.showItemInFolder(expandTilde(target))
            }
        }
        return null
    }
    if (route && route.startsWith('bundle.'))
    {
        return bundleRoute(route.slice(7), args)
    }
    if (route && route.startsWith('window.'))
    {
        return windowRoute(route.slice(7), args, win)
    }
    if (route && route.startsWith('clipboard.'))
    {
        const req = route.slice(10)
        if (req === 'get' || req === 'read')
        {
            return clipboard.readText()
        }
        if (req === 'set' || req === 'write')
        {
            clipboard.writeText(String(args[0] ?? ''))
            return args[0]
        }
        return null
    }
    if (route && route.startsWith('app.'))
    {
        const req = route.slice(4)
        if (req === 'quit')
        {
            quitApp()
            return null
        }
        if (req === 'sh')
        {
            return runShellScript(args)
        }
        return null
    }
    if (route && route.startsWith('status.'))
    {
        return statusRoute(route.slice(7), args, win)
    }
    if (route && route.startsWith('fs.'))
    {
        const req = route.slice(3)
        if (req === 'openDialog')
        {
            const result = await dialog.showOpenDialog(win, {
                defaultPath: expandTilde(args[0] || bundlePath),
                properties: ['openFile', 'multiSelections', 'showHiddenFiles']
            })
            if (!result.canceled && result.filePaths.length)
            {
                sendMsg(win, { name: 'openDialog', args: [result.filePaths] })
            }
            return null
        }
        if (req === 'saveDialog')
        {
            const result = await dialog.showSaveDialog(win, {
                defaultPath: expandTilde(args[0] || bundlePath)
            })
            if (!result.canceled && result.filePath)
            {
                sendMsg(win, { name: 'saveDialog', args: result.filePath })
            }
            return null
        }
        return fsRoute(req, args)
    }
    if (route && route.startsWith('js.'))
    {
        return null
    }
    if (route && route.startsWith('test.'))
    {
        const req = route.slice(5)
        if (req === 'ping')
        {
            return `you say ${args[0]} you get pong!`
        }
        if (req === 'struct')
        {
            return { input: `you sent ${args[0]}`, output: 'you get this!' }
        }
        return null
    }

    console.log('unknown request', route, args)
    return null
}

function winForSender (sender)
{
    const browserWindow = BrowserWindow.fromWebContents(sender)
    if (browserWindow && browserWindow.kalkId)
    {
        return browserWindow
    }
    return null
}

ipcMain.on('kakao', function (event, msg)
{
    const win = winForSender(event.sender)
    if (win)
    {
        request(msg, win).catch(function (err)
        {
            console.error('kakao request', err)
        })
    }
})

ipcMain.handle('kakao-request', function (event, msg)
{
    const win = winForSender(event.sender)
    if (!win)
    {
        return null
    }
    return request(msg, win).catch(function (err)
    {
        console.error('kakao request', err)
        return null
    })
})

app.on('before-quit', function ()
{
    isQuitting = true
})

app.on('window-all-closed', function ()
{
    app.quit()
})

app.whenReady().then(function ()
{
    if (!hasLock)
    {
        return
    }
    Menu.setApplicationMenu(null)
    moveStashWins()
    createWindow(indexFromArgv(process.argv))
})
