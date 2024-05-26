var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}}

var Delegate

import version from "../konrad/version.js"

import dom from "./dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import util from "./util.js"
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
        return 'unhandled'
    }

    Delegate.prototype["onWindowKeyUp"] = function (win, keyInfo)
    {
        if (!_k_.empty(keyInfo.combo))
        {
            console.log("onWindowKeyUp ",keyInfo.combo)
        }
        return 'unhandled'
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

class Win
{
    static Delegate = Delegate

    constructor (delegate)
    {
        var main, menuIcon, menuNoon, _45_18_, _60_38_, _61_38_, _86_17_, _86_34_

        this.delegate = delegate
    
        this.onKeyUp = this.onKeyUp.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onMenuAction = this.onMenuAction.bind(this)
        this.onWindowClose = this.onWindowClose.bind(this)
        this.onWindowWillResize = this.onWindowWillResize.bind(this)
        this.onWindowFrame = this.onWindowFrame.bind(this)
        this.onWindowBlur = this.onWindowBlur.bind(this)
        this.onWindowFocus = this.onWindowFocus.bind(this)
        this.onResize = this.onResize.bind(this)
        this.animate = this.animate.bind(this)
        this.onWindowDidReload = this.onWindowDidReload.bind(this)
        this.onStashMissing = this.onStashMissing.bind(this)
        this.onStashLoaded = this.onStashLoaded.bind(this)
        window.name = slash.name(window.location.pathname)
        window.prefs = prefs
        window.prefs.init()
        this.saveStashOnClose = true
        this.delegate = ((_45_18_=this.delegate) != null ? _45_18_ : new Delegate)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('window.close',this.onWindowClose)
        post.on('window.frame',this.onWindowFrame)
        post.on('menuAction',this.onMenuAction)
        post.on('stashLoaded',this.onStashLoaded)
        post.on('stashMissing',this.onStashMissing)
        post.on('saveStash',this.saveStash)
        post.on('window.willReload',this.saveStash)
        post.on('window.willResize',this.onWindowWillResize)
        post.on('window.didReload',this.onWindowDidReload)
        post.on('menu.init',(function (template)
        {
            var _58_54_, _58_76_

            return ((_58_54_=this.delegate) != null ? typeof (_58_76_=_58_54_.onWindowMenuTemplate) === "function" ? _58_76_(this,template) : undefined : undefined)
        }).bind(this))
        menuIcon = ((_60_38_=this.delegate.menuIcon) != null ? _60_38_ : kakao.bundle.img('menu_kakao.png'))
        menuNoon = ((_61_38_=this.delegate.menuNoon) != null ? _61_38_ : kakao.bundle.res('menu_kakao.noon'))
        window.titlebar = new title({icon:menuIcon,menu:menuNoon})
        window.addEventListener('keydown',this.onKeyDown)
        window.addEventListener('keyup',this.onKeyUp)
        window.addEventListener('resize',this.onResize)
        window.requestAnimationFrame(this.animate)
        if (main = $('main'))
        {
            main.focus()
        }
        this.id = window.winID
        console.log('stash',`win/${this.id}_${window.name}`)
        window.stash = new stash(`win/${this.id}_${window.name}`)
        ;((_86_17_=this.delegate) != null ? typeof (_86_34_=_86_17_.onWindowCreated) === "function" ? _86_34_(this) : undefined : undefined)
    }

    async onStashLoaded ()
    {
        var frame, _90_20_, _92_28_, _92_59_

        if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowDidLoadStash : undefined)))
        {
            await this.delegate.onWindowDidLoadStash(this)
        }
        if (true !== ((_92_28_=this.delegate) != null ? typeof (_92_59_=_92_28_.onWindowRestoreFrameFromStash) === "function" ? _92_59_(this,window.stash.get('frame')) : undefined : undefined))
        {
            if (frame = window.stash.get('frame'))
            {
                kakao('window.setFrame',frame,true)
            }
        }
        return this.showWindow()
    }

    async onStashMissing ()
    {
        var list, old, other, otherApp, sameApp, _111_24_, _116_24_, _121_24_

        list = await ffs.list(kakao.bundle.app('.stash/old'))
        var _a_ = util.splitWith(list,function (i)
        {
            return slash.name(i.path).endsWith('_' + window.name)
        }); sameApp = _a_[0]; otherApp = _a_[1]

        if (!_k_.empty(sameApp))
        {
            old = sameApp.shift()
            if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowWillLoadStash : undefined)))
            {
                await this.delegate.onWindowWillLoadStash(this)
            }
            await window.stash.load(old.path)
            if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowDidLoadStash : undefined)))
            {
                await this.delegate.onWindowDidLoadStash(this)
            }
            await ffs.remove(old.path)
        }
        else
        {
            if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowWithoutStash : undefined)))
            {
                await this.delegate.onWindowWithoutStash(this)
            }
        }
        this.showWindow()
        if (!_k_.empty(sameApp))
        {
            return kakao('window.new',`${window.name}.html`)
        }
        else if (!_k_.empty(otherApp))
        {
            other = slash.name(otherApp[0].path).split('_')[1]
            return kakao('window.new',`${other}.html`)
        }
    }

    async showWindow ()
    {
        var _140_20_

        document.body.style.display = 'inherit'
        if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowWillShow : undefined)))
        {
            return await this.delegate.onWindowWillShow(this)
        }
    }

    onWindowDidReload ()
    {
        console.log('window.didReload')
        return document.body.style.display = 'inherit'
    }

    saveStash ()
    {
        post.emit('saveChanges')
        post.emit('stash')
        return window.stash.save()
    }

    animate ()
    {
        var delta, fps, now, _169_17_, _169_40_

        window.requestAnimationFrame(this.animate)
        now = window.performance.now()
        delta = (now - this.lastAnimationTime)
        this.lastAnimationTime = now
        fps = parseInt(1000 / delta)
        if (fps < 20)
        {
            kakao("window.framerateDrop",fps)
        }
        return ((_169_17_=this.delegate) != null ? typeof (_169_40_=_169_17_.onWindowAnimationTick) === "function" ? _169_40_(this,{delta:delta,fps:fps,time:now}) : undefined : undefined)
    }

    onResize (event)
    {
        var _171_36_, _171_52_

        return ((_171_36_=this.delegate) != null ? typeof (_171_52_=_171_36_.onWindowResize) === "function" ? _171_52_(this,event) : undefined : undefined)
    }

    onWindowFocus ()
    {
        var _172_36_, _172_51_

        return ((_172_36_=this.delegate) != null ? typeof (_172_51_=_172_36_.onWindowFocus) === "function" ? _172_51_(this) : undefined : undefined)
    }

    onWindowBlur ()
    {
        var _173_36_, _173_50_

        return ((_173_36_=this.delegate) != null ? typeof (_173_50_=_173_36_.onWindowBlur) === "function" ? _173_50_(this) : undefined : undefined)
    }

    onWindowFrame (info)
    {
        return window.stash.set('frame',info.frame)
    }

    onWindowWillResize (info, newSize)
    {}

    onWindowClose (save)
    {
        var _184_17_, _184_32_

        if (save)
        {
            post.emit('saveStash')
        }
        else
        {
            window.stash.clear()
        }
        window.prefs.save()
        return ((_184_17_=this.delegate) != null ? typeof (_184_32_=_184_17_.onWindowClose) === "function" ? _184_32_(this) : undefined : undefined)
    }

    onMenuAction (action)
    {
        var url, vrs, _196_27_, _196_47_

        if (((_196_27_=this.delegate) != null ? typeof (_196_47_=_196_27_.onWindowMenuAction) === "function" ? _196_47_(this,action) : undefined : undefined))
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
                kakao('window.close')
                break
            case 'about':
                vrs = ` window.aboutVersion = \"${(this.delegate.aboutVersion ? this.delegate.aboutVersion : version)}\";`
                url = (this.delegate.aboutURL ? ` window.aboutURL = \"${this.delegate.aboutURL}\";` : '')
                if (this.delegate.aboutImage)
                {
                    kakao('window.new','about.html',`window.aboutImage = \"${this.delegate.aboutImage}\";${vrs}${url}`)
                }
                else
                {
                    kakao('window.new','about.html',`window.aboutImage = \"${kakao.bundle.img('about_kakao.png')}\";${vrs}${url}`)
                }
                break
        }

        return 0
    }

    onKeyDown (event)
    {
        var info, _234_26_, _237_20_, _238_62_, _238_79_

        info = keyinfo.forEvent(event)
        info.event = event
        if (_k_.isFunc((window.titlebar != null ? window.titlebar.handleKeyInfo : undefined)))
        {
            if ('unhandled' !== window.titlebar.handleKeyInfo(info))
            {
                return stopEvent(event)
            }
        }
        if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowKeyDown : undefined)))
        {
            if ('unhandled' !== ((_238_62_=this.delegate) != null ? typeof (_238_79_=_238_62_.onWindowKeyDown) === "function" ? _238_79_(this,info) : undefined : undefined))
            {
                return stopEvent(event)
            }
        }
    }

    onKeyUp (event)
    {
        var info, _245_20_, _246_46_, _246_61_

        info = keyinfo.forEvent(event)
        info.event = event
        if (_k_.isFunc((this.delegate != null ? this.delegate.onWindowKeyUp : undefined)))
        {
            if ('unhandled' !== ((_246_46_=this.delegate) != null ? typeof (_246_61_=_246_46_.onWindowKeyUp) === "function" ? _246_61_(this,info) : undefined : undefined))
            {
                return
            }
        }
    }
}

export default Win;