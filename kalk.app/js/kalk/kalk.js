var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Delegate

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let $ = kxk.$
let win = kxk.win
let kpos = kxk.kpos
let post = kxk.post
let popup = kxk.popup
let stopEvent = kxk.stopEvent

import symbol from "./symbol.js"
import keys from "./keys.js"
import input from "./input.js"
import sheet from "./sheet.js"

window.WIN_MIN_WIDTH = 476
window.WIN_MIN_HEIGHT = 596

Delegate = (function ()
{
    _k_.extend(Delegate, win.Delegate)
    function Delegate ()
    {
        var main

        this["cut"] = this["cut"].bind(this)
        this["cpy"] = this["cpy"].bind(this)
        this["currentSelection"] = this["currentSelection"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowKeyUp"] = this["onWindowKeyUp"].bind(this)
        this["onWindowKeyDown"] = this["onWindowKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["showContextMenu"] = this["showContextMenu"].bind(this)
        this["onContextMenu"] = this["onContextMenu"].bind(this)
        this["onCalc"] = this["onCalc"].bind(this)
        this["onWindowResize"] = this["onWindowResize"].bind(this)
        this["onWindowCreated"] = this["onWindowCreated"].bind(this)
        this.menuIcon = kakao.bundle.img('menu_kalk.png')
        this.menuNoon = kakao.bundle.res('menu_kalk.noon')
        this.aboutImage = kakao.bundle.img('about_kalk.png')
        this.aboutURL = "https://github.com/monsterkodi/kalk"
        main = $('main')
        main.addEventListener('contextmenu',this.onContextMenu)
        post.on('menuAction',this.onMenuAction)
        post.on('calc',this.onCalc)
        return Delegate.__super__.constructor.apply(this, arguments)
    }

    Delegate.prototype["onWindowWillShow"] = function ()
    {
        return document.body.style.display = 'inherit'
    }

    Delegate.prototype["onWindowWithoutStash"] = function ()
    {
        kakao('win.setSize',window.WIN_MIN_WIDTH,window.WIN_MIN_HEIGHT)
        return kakao('win.center')
    }

    Delegate.prototype["onWindowCreated"] = function ()
    {
        kakao('win.setMinSize',window.WIN_MIN_WIDTH,window.WIN_MIN_HEIGHT)
        return kakao('win.setMaxSize',window.WIN_MIN_WIDTH,6666)
    }

    Delegate.prototype["onWindowResize"] = function ()
    {
        return post.emit('resize')
    }

    Delegate.prototype["onCalc"] = function (calc)
    {
        window.input.setText(calc)
        return post.emit('button','=')
    }

    Delegate.prototype["onContextMenu"] = function (event)
    {
        return stopEvent(event,this.showContextMenu(kpos(event)))
    }

    Delegate.prototype["showContextMenu"] = function (pos)
    {
        var items, main, opt

        if (!(pos != null))
        {
            main = $('main')
            pos = kpos(main.getBoundingClientRect().left,main.getBoundingClientRect().top)
        }
        items = [{text:'Clear Log',combo:'k'},{text:'Clear & Close Log',combo:'cmdctrl+k'}]
        opt = {x:pos.x,y:pos.y,items:items}
        return popup.menu(opt)
    }

    Delegate.prototype["onMenuAction"] = function (action, args)
    {
        switch (action)
        {
            case 'Cut':
                return this.cut()

            case 'Copy':
                return this.cpy()

            case 'Paste':
                return this.paste()

            case 'Clear':
                return post.emit('button',symbol.clear)

            case 'Clear Log':
                return post.emit('sheet','clear') && post.emit('button',symbol.clear)

            case 'Clear & Close Log':
                return post.emit('sheet','collapse') && post.emit('button',symbol.clear)

            case 'Sin':
            case 'Cos':
            case 'Tan':
            case 'aTan':
            case 'Log':
                return post.emit('button',action.toLowerCase())

            case 'Exp':
                return post.emit('button',symbol.exp)

            case 'Hex':
                return post.emit('button',symbol.hex)

            case 'Bin':
                return post.emit('button',symbol.bin)

            case 'Oct':
                return post.emit('button',symbol.oct)

            case 'Deg2Rad':
                return post.emit('button',symbol.deg2rad)

            case 'E':
                return post.emit('button',symbol.euler)

            case 'PI':
                return post.emit('button',symbol.pi)

            case 'PHI':
                return post.emit('button',symbol.phi)

            case 'Plus':
                return post.emit('button','+')

            case 'Minus':
                return post.emit('button','-')

            case 'Multiply':
                return post.emit('button','*')

            case 'Divide':
                return post.emit('button','/')

            case 'Sqrt':
                return post.emit('button',symbol.sqrt)

            case 'Begin':
                return post.emit('button',symbol.open)

            case 'End':
                return post.emit('button',symbol.close)

            case 'Del':
                return post.emit('button',symbol.backspace)

            case 'Equals':
                return post.emit('button','=')

        }

        console.log('onMenuAction',action,args)
        return 'unhandled'
    }

    Delegate.prototype["onWindowKeyDown"] = function (win, info)
    {
        if ('unhandled' !== window.keys.keyDown(info))
        {
            return stopEvent(info.event)
        }
        switch (info.combo)
        {
            case 'ctrl+v':
                return this.paste()

            case 'ctrl+c':
                return this.cpy()

            case 'ctrl+x':
                return this.cut()

        }

    }

    Delegate.prototype["onWindowKeyUp"] = function (win, info)
    {
        return window.keys.keyUp(info)
    }

    Delegate.prototype["onWindowBlur"] = function (win)
    {}

    Delegate.prototype["onWindowFocus"] = function (win)
    {}

    Delegate.prototype["currentSelection"] = function ()
    {
        var selection

        selection = document.getSelection().toString()
        if (!_k_.empty(selection))
        {
            return selection
        }
        return ''
    }

    Delegate.prototype["cpy"] = function ()
    {
        var selection

        if (selection = this.currentSelection())
        {
            return kakao('clipboard.set',selection)
        }
        else
        {
            return kakao('clipboard.set',window.input.text())
        }
    }

    Delegate.prototype["cut"] = function ()
    {
        var selection

        this.cpy()
        if (selection = this.currentSelection())
        {
            return document.getSelection().deleteFromDocument()
        }
        else
        {
            return window.input.clear()
        }
    }

    Delegate.prototype["paste"] = async function ()
    {
        var text

        text = await kakao('clipboard.get')
        console.log('got clipboard text',text)
        return window.input.setText(window.input.text() + text)
    }

    return Delegate
})()

kakao.init(function ()
{
    new win(new Delegate)
    window.sheet = new sheet
    window.input = new input
    window.keys = new keys
    return this
})