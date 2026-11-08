const { ipcRenderer } = require('electron')
const os = require('node:os')
const path = require('node:path')

function argValue (name)
{
    const prefix = `--${name}=`
    const found = process.argv.find(function (arg)
    {
        return arg.startsWith(prefix)
    })
    return found ? found.slice(prefix.length) : null
}

const bundlePath = argValue('kalk-bundle') || path.resolve(__dirname, '..')
const winID = Number(argValue('kalk-win-id') || 0)
const initScriptBase64 = argValue('kalk-init-script')

window.bundlePath = bundlePath
window.winID = winID
window.userName = os.userInfo().username
window.homeDir = os.homedir()
window.tmpDir = os.tmpdir()
window.kalkPlatform = 'linux'
window.kalkCommandKey = 'ctrl'

if (!window.webkit)
{
    window.webkit = {}
}
if (!window.webkit.messageHandlers)
{
    window.webkit.messageHandlers = {}
}
window.webkit.messageHandlers.kakao = {
    postMessage: function (msg)
    {
        ipcRenderer.send('kakao', msg)
    }
}
window.webkit.messageHandlers.kakao_request = {
    postMessage: function (msg)
    {
        return ipcRenderer.invoke('kakao-request', msg)
    }
}

const queue = []
let pumping = false

function deliver (msg)
{
    if (window.kakao && typeof window.kakao.receive === 'function')
    {
        window.kakao.receive(msg)
        return true
    }
    return false
}

function pump ()
{
    if (!queue.length)
    {
        pumping = false
        return
    }
    if (deliver(queue[0]))
    {
        queue.shift()
    }
    pumping = true
    setTimeout(pump, 50)
}

ipcRenderer.on('kakao-receive', function (event, msg)
{
    queue.push(msg)
    if (!pumping)
    {
        pumping = true
        pump()
    }
})

if (initScriptBase64)
{
    try
    {
        const initScript = Buffer.from(initScriptBase64, 'base64').toString('utf8')
        ;(0, eval)(initScript)
    }
    catch (err)
    {
        console.error('kalk init script', err)
    }
}

window.addEventListener('DOMContentLoaded', function ()
{
    const style = document.createElement('style')
    style.textContent = `
        #titlebar, .app-drag-region { -webkit-app-region: drag; }
        #titlebar .winicon, #titlebar .menu, #titlebar .winbutton,
        .winbutton, .menu, .menuItem, .popup, .popupItem, .key, .version,
        button, input, textarea, select { -webkit-app-region: no-drag; }
    `
    document.documentElement.appendChild(style)
})
