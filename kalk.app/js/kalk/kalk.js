var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Delegate

import kakao from "../kakao.js"

import kxk from "../kxk.js"
let $ = kxk.$
let win = kxk.win
let post = kxk.post
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
        this["cut"] = this["cut"].bind(this)
        this["cpy"] = this["cpy"].bind(this)
        this["currentSelection"] = this["currentSelection"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowKeyUp"] = this["onWindowKeyUp"].bind(this)
        this["onWindowKeyDown"] = this["onWindowKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onCalc"] = this["onCalc"].bind(this)
        this["onWindowResize"] = this["onWindowResize"].bind(this)
        this["onWindowCreated"] = this["onWindowCreated"].bind(this)
        this.menuIcon = kakao.bundle.img('menu_kalk.png')
        this.menuNoon = kakao.bundle.res('menu_kalk.noon')
        this.aboutImage = kakao.bundle.img('about_kalk.png')
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

            case 'Clear All':
                return post.emit('sheet','collapse') && post.emit('menuAction','Clear')

            case 'Clear Log':
                return post.emit('sheet','clear')

            case 'Save':
                return post.toMain('saveBuffer')

            case 'Sin':
            case 'Cos':
            case 'Tan':
            case 'aTan':
            case 'Log':
                return post.emit('button',action.toLowerCase())

            case 'Exp':
                return post.emit('button',symbol.exp)

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