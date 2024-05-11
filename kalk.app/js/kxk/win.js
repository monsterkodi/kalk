var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}}

var Delegate, Win

import dom from "./dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import ffs from "./ffs.js"
import elem from "./elem.js"
import post from "./post.js"
import prefs from "./prefs.js"
import slash from "./slash.js"
import stash from "./stash.js"
import keyinfo from "./keyinfo.js"
import title from "./title.js"


Delegate = (function ()
{
    function Delegate ()
    {}

    Delegate.prototype["onWindowWillLoadStash"] = function (win)
    {
        console.log(`onWindowWillLoadStash ${win.id}`)
    }

    Delegate.prototype["onWindowDidLoadStash"] = function (win)
    {
        console.log(`onWindowDidLoadStash ${win.id}`)
    }

    Delegate.prototype["onWindowWithoutStash"] = function (win)
    {
        console.log(`onWindowWithoutStash ${win.id}`)
    }

    Delegate.prototype["onWindowWillShow"] = function (win)
    {
        console.log(`onWindowWillShow ${win.id}`)
    }

    Delegate.prototype["onWindowCreated"] = function (win)
    {
        console.log(`win ${win.id}`)
    }

    Delegate.prototype["onWindowAnimationTick"] = function (win, tickInfo)
    {}

    Delegate.prototype["onWindowResize"] = function (win, event)
    {
        console.log("onWindowResize",event)
    }

    Delegate.prototype["onWindowFocus"] = function (win)
    {
        console.log("onWindowFocus")
    }

    Delegate.prototype["onWindowBlur"] = function (win)
    {
        console.log("onWindowBlur")
    }

    Delegate.prototype["onWindowKeyDown"] = function (win, keyInfo)
    {
        if (!_k_.empty(keyInfo.combo))
        {
            console.log("onWindowKeyDown ",keyInfo.combo)
        }
    }

    Delegate.prototype["onWindowKeyUp"] = function (win, keyInfo)
    {
        if (!_k_.empty(keyInfo.combo))
        {
            console.log("onWindowKeyUp ",keyInfo.combo)
        }
    }

    Delegate.prototype["onWindowClose"] = function (win)
    {
        console.log(`onWindowClose ${win.id}`)
    }

    Delegate.prototype["onWindowMenuTemplate"] = function (win, template)
    {
        console.log(`onWindowMenuTemplate ${win.id}`,template)
    }

    return Delegate
})()


Win = (function ()
{
    Win["Delegate"] = Delegate
    function Win (delegate)
    {
        var main, menuIcon, menuNoon, _42_18_, _54_38_, _55_38_, _80_17_, _80_34_

        this.delegate = delegate
    
        this["onKeyUp"] = this["onKeyUp"].bind(this)
        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onStashLoaded"] = this["onStashLoaded"].bind(this)
        this["onWindowWillResize"] = this["onWindowWillResize"].bind(this)
        this["onWindowFrame"] = this["onWindowFrame"].bind(this)
        this["onWindowClose"] = this["onWindowClose"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["animate"] = this["animate"].bind(this)
        window.prefs = prefs
        window.prefs.init()
        this.saveStashOnClose = true
        this.delegate = ((_42_18_=this.delegate) != null ? _42_18_ : new Delegate)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        post.on('window.frame',this.onWindowFrame)
        post.on('window.willResize',this.onWindowWillResize)
        post.on('menuAction',this.onMenuAction)
        post.on('stashLoaded',this.onStashLoaded)
        post.on('saveStash',this.saveStash)
        post.on('menu.init',(function (template)
        {
            var _52_54_, _52_76_

            return ((_52_54_=this.delegate) != null ? typeof (_52_76_=_52_54_.onWindowMenuTemplate) === "function" ? _52_76_(this,template) : undefined : undefined)
        }).bind(this))
        menuIcon = ((_54_38_=this.delegate.menuIcon) != null ? _54_38_ : kakao.bundle.img('menu_kakao.png'))
        menuNoon = ((_55_38_=this.delegate.menuNoon) != null ? _55_38_ : kakao.bundle.res('menu_kakao.noon'))
        window.titlebar = new title({icon:menuIcon,menu:menuNoon})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        main = $('main')
        main.focus()
        this.id = window.winID
        window.stash = new stash(`win/${this.id}`)
        this.restoreFromStash()
        kakao('win.setMinSize',250,125)
        ;((_80_17_=this.delegate) != null ? typeof (_80_34_=_80_17_.onWindowCreated) === "function" ? _80_34_(this) : undefined : undefined)
    }

    Win.prototype["restoreFromStash"] = async function ()
    {
        var list, old

        console.log('restoreFromStash',this)
        list = await ffs.list(kakao.bundle.app('.stash/old'))
        if (!_k_.empty(list))
        {
            old = list.shift()
            if (_k_.isFunc(this.delegate.onWindowWillLoadStash))
            {
                await this.delegate.onWindowWillLoadStash(this)
            }
            await window.stash.load(old.path)
            if (_k_.isFunc(this.delegate.onWindowDidLoadStash))
            {
                await this.delegate.onWindowDidLoadStash(this)
            }
            ffs.remove(old.path)
            if (!_k_.empty(list))
            {
                kakao('window.new','ko.html')
            }
        }
        else
        {
            if (window.stash.isEmpty())
            {
                if (_k_.isFunc(this.delegate.onWindowWithoutStash))
                {
                    await this.delegate.onWindowWithoutStash(this)
                }
            }
            else
            {
                if (_k_.isFunc(this.delegate.onWindowDidLoadStash))
                {
                    await this.delegate.onWindowDidLoadStash(this)
                }
            }
        }
        if (_k_.isFunc(this.delegate.onWindowWillShow))
        {
            return await this.delegate.onWindowWillShow(this)
        }
    }

    Win.prototype["saveStash"] = function ()
    {
        console.log('saveStash')
        post.emit('saveChanges')
        post.emit('stash')
        window.prefs.save()
        return window.stash.save()
    }

    Win.prototype["animate"] = function ()
    {
        var delta, fps, now, _131_17_, _131_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao("window.framerateDrop",fps)
        }
        return ((_131_17_=this.delegate) != null ? typeof (_131_40_=_131_17_.onWindowAnimationTick) === "function" ? _131_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    Win.prototype["onResize"] = function (event)
    {
        var _133_36_, _133_52_

        return ((_133_36_=this.delegate) != null ? typeof (_133_52_=_133_36_.onWindowResize) === "function" ? _133_52_(this,event) : undefined : undefined)
    }

    Win.prototype["onWindowFocus"] = function ()
    {
        var _134_36_, _134_51_

        return ((_134_36_=this.delegate) != null ? typeof (_134_51_=_134_36_.onWindowFocus) === "function" ? _134_51_(this) : undefined : undefined)
    }

    Win.prototype["onWindowBlur"] = function ()
    {
        var _135_36_, _135_50_

        return ((_135_36_=this.delegate) != null ? typeof (_135_50_=_135_36_.onWindowBlur) === "function" ? _135_50_(this) : undefined : undefined)
    }

    Win.prototype["onWindowClose"] = function ()
    {
        var _136_80_, _136_95_

        if (this.saveStashOnClose)
        {
            post.emit('saveStash')
        }
        return ((_136_80_=this.delegate) != null ? typeof (_136_95_=_136_80_.onWindowClose) === "function" ? _136_95_(this) : undefined : undefined)
    }

    Win.prototype["onWindowFrame"] = function (info)
    {
        return window.stash.set('frame',info.frame)
    }

    Win.prototype["onWindowWillResize"] = function (info, newSize)
    {}

    Win.prototype["onStashLoaded"] = function ()
    {
        var frame

        if (frame = window.stash.get('frame'))
        {
            return kakao('window.setFrame',frame)
        }
    }

    Win.prototype["onMenuAction"] = function (action)
    {
        var _154_27_, _154_47_

        if (((_154_27_=this.delegate) != null ? typeof (_154_47_=_154_27_.onWindowMenuAction) === "function" ? _154_47_(this,action) : undefined : undefined))
        {
            return
        }
        switch (action.toLowerCase())
        {
            case 'focus next':
                kakao('window.focusNext')
                break
            case 'focus previous':
                kakao('window.focusPrev')
                break
            case 'new window':
                kakao('window.new',slash.file(document.URL))
                break
            case 'maximize':
                kakao('window.maximize')
                break
            case 'minimize':
                kakao('window.minimize')
                break
            case 'screenshot':
                kakao('window.snapshot')
                break
            case 'fullscreen':
                kakao('window.fullscreen')
                break
            case 'reload':
                kakao('window.reload')
                break
            case 'devtools':
                kakao('window.toggleInspector')
                break
            case 'quit':
                kakao('app.quit')
                break
            case 'open ...':
                kakao('window.new','ko.html')
                break
            case 'close':
                ffs.list(kakao.bundle.app('.stash/win')).then((function (list)
                {
                    if (list.length > 1)
                    {
                        window.stash.clear()
                        this.saveStashOnClose = false
                    }
                    return kakao('window.close')
                }).bind(this))
                break
            case 'about':
                if (this.delegate.aboutImage)
                {
                    kakao('window.new','about.html',`window.aboutImage = \"${this.delegate.aboutImage}\";`)
                }
                else
                {
                    kakao('window.new','about.html',`window.aboutImage = \"${kakao.bundle.img('about_kakao.png')}\";`)
                }
                break
        }

        return 0
    }

    Win.prototype["onKeyDown"] = function (event)
    {
        var info, _198_21_, _198_38_

        info = keyinfo.forEvent(event)
        info.event = event
        stopEvent(event)
        if ('unhandled' === window.titlebar.handleKeyInfo(info))
        {
            return ((_198_21_=this.delegate) != null ? typeof (_198_38_=_198_21_.onWindowKeyDown) === "function" ? _198_38_(this,info) : undefined : undefined)
        }
    }

    Win.prototype["onKeyUp"] = function (event)
    {
        var info, _205_17_, _205_32_

        info = keyinfo.forEvent(event)
        info.event = event
        return ((_205_17_=this.delegate) != null ? typeof (_205_32_=_205_17_.onWindowKeyUp) === "function" ? _205_32_(this,info) : undefined : undefined)
    }

    return Win
})()

export default Win;