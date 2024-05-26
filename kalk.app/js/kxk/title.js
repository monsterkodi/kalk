var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Title

import dom from "./dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent
let elem = dom.elem

import sds from "./sds.js"
import menu from "./menu.js"
import keyinfo from "./keyinfo.js"
import slash from "./slash.js"
import post from "./post.js"
import noon from "./noon.js"


Title = (function ()
{
    function Title (opt)
    {
        var pkg, _21_13_, _25_27_

        this.opt = opt
    
        this["openMenu"] = this["openMenu"].bind(this)
        this["toggleMenu"] = this["toggleMenu"].bind(this)
        this["hideMenu"] = this["hideMenu"].bind(this)
        this["showMenu"] = this["showMenu"].bind(this)
        this["menuVisible"] = this["menuVisible"].bind(this)
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["onTitlebar"] = this["onTitlebar"].bind(this)
        this["onWindowBlur"] = this["onWindowBlur"].bind(this)
        this["onWindowFocus"] = this["onWindowFocus"].bind(this)
        this.opt = ((_21_13_=this.opt) != null ? _21_13_ : {})
        pkg = this.opt.pkg
        this.elem = $(((_25_27_=this.opt.elem) != null ? _25_27_ : "#titlebar"))
        if (!this.elem)
        {
            return
        }
        this.elem.classList.add('focus')
        post.on('titlebar',this.onTitlebar)
        post.on('menuAction',this.onMenuAction)
        post.on('window.blur',this.onWindowBlur)
        post.on('window.focus',this.onWindowFocus)
        post.on('prefsLoaded',(function ()
        {
            if (!window.prefs.get('menu'))
            {
                return this.hideMenu()
            }
        }).bind(this))
        this.elem.addEventListener('dblclick',function (event)
        {
            stopEvent(event)
            return post.emit('menuAction','Maximize')
        })
        this.winicon = elem({class:'winicon',dblclick:function (event)
        {
            return stopEvent(event)
        }})
        if (this.opt.icon)
        {
            this.winicon.appendChild(elem('img',{src:this.opt.icon}))
        }
        else
        {
            this.winicon.appendChild(elem('div',{class:'noicon'}))
        }
        this.elem.appendChild(this.winicon)
        this.winicon.addEventListener('click',function ()
        {
            return post.emit('menuAction','Open Menu')
        })
        this.title = elem({class:'titlebar-title app-drag-region',id:'title'})
        this.elem.appendChild(this.title)
        this.setTitle(this.opt)
        this.minimize = elem({class:'winbutton minimize gray'})
        this.minimize.innerHTML = `<svg width="100%" height="100%" viewBox="-10 -8 30 30">
    <line x1="-1" y1="5" x2="11" y2="5"></line>
</svg>`
        this.elem.appendChild(this.minimize)
        this.minimize.addEventListener('click',function ()
        {
            return post.emit('menuAction','Minimize')
        })
        this.maximize = elem({class:'winbutton maximize gray'})
        this.maximize.innerHTML = `<svg width="100%" height="100%" viewBox="-10 -9 30 30">
  <rect width="11" height="11" style="fill-opacity: 0;"></rect>
</svg>`
        this.elem.appendChild(this.maximize)
        this.maximize.addEventListener('click',function ()
        {
            return post.emit('menuAction','Maximize')
        })
        this.close = elem({class:'winbutton close'})
        this.close.innerHTML = `<svg width="100%" height="100%" viewBox="-10 -9 30 30">
    <line x1="0" y1="0" x2="10" y2="11"></line>
    <line x1="10" y1="0" x2="0" y2="11"></line>
</svg>`
        this.elem.appendChild(this.close)
        this.close.addEventListener('click',function ()
        {
            return post.emit('menuAction','Close')
        })
        this.topframe = elem({class:'topframe'})
        this.elem.appendChild(this.topframe)
        this.initMenu()
    }

    Title.prototype["pushElem"] = function (elem)
    {
        return this.elem.insertBefore(elem,this.minimize)
    }

    Title.prototype["showTitle"] = function ()
    {
        return this.title.style.display = 'initial'
    }

    Title.prototype["hideTitle"] = function ()
    {
        return this.title.style.display = 'none'
    }

    Title.prototype["onWindowFocus"] = function ()
    {
        this.elem.classList.remove('blur')
        return this.elem.classList.add('focus')
    }

    Title.prototype["onWindowBlur"] = function ()
    {
        this.elem.classList.remove('focus')
        return this.elem.classList.add('blur')
    }

    Title.prototype["setTitle"] = function (opt)
    {
        var html, parts, _125_26_

        html = ""
        parts = ((_125_26_=opt.title) != null ? _125_26_ : [])
        if (opt.pkg)
        {
            if (opt.pkg.name && _k_.in('name',parts))
            {
                html += `<span class='titlebar-name'>${opt.pkg.name}</span>`
            }
            if (opt.pkg.version && _k_.in('version',parts))
            {
                html += `<span class='titlebar-dot'>${opt.pkg.version}</span>`
            }
            if (opt.pkg.path && _k_.in('path',parts))
            {
                html += "<span class='titlebar-dot'> ► </span>"
                html += `<span class='titlebar-name'>${opt.pkg.path}</span>`
            }
        }
        return this.title.innerHTML = html
    }

    Title.prototype["onTitlebar"] = function (action)
    {
        switch (action)
        {
            case 'showTitle':
                return this.showTitle()

            case 'hideTitle':
                return this.hideTitle()

            case 'showMenu':
                return this.showMenu()

            case 'hideMenu':
                return this.hideMenu()

            case 'toggleMenu':
                return this.toggleMenu()

        }

    }

    Title.prototype["onMenuAction"] = function (action)
    {
        switch (action.toLowerCase())
        {
            case 'toggle menu':
                return this.toggleMenu()

            case 'open menu':
                return this.openMenu()

            case 'show menu':
                return this.showMenu()

            case 'hide menu':
                return this.hideMenu()

        }

    }

    Title.prototype["initMenu"] = async function ()
    {
        var tc

        if (!this.opt.menu)
        {
            return []
        }
        if (_k_.empty(this.templateCache))
        {
            tc = await noon.load(this.opt.menu)
            if (!_k_.empty(tc))
            {
                this.templateCache = this.makeTemplate(tc)
                return this.initFromCache()
            }
            else
            {
                console.error('title.initMenu - empty template?',this.opt.menu)
            }
        }
        else
        {
            return this.initFromCache()
        }
    }

    Title.prototype["initFromCache"] = function ()
    {
        delete window.kakao.menuTemplate
        post.emit('menu.init',this.templateCache)
        if (window.kakao.menuTemplate)
        {
            this.templateCache = window.kakao.menuTemplate
        }
        this.menu = new menu({items:this.templateCache})
        return this.elem.insertBefore(this.menu.elem,this.elem.firstChild.nextSibling)
    }

    Title.prototype["makeTemplate"] = function (obj)
    {
        var menuOrCombo, text, tmpl

        tmpl = []
        for (text in obj)
        {
            menuOrCombo = obj[text]
            tmpl.push(((function ()
            {
                var item, _208_33_, _208_57_

                if (_k_.empty(menuOrCombo) && text.startsWith('-'))
                {
                    return {text:''}
                }
                else if (_k_.isNum(menuOrCombo))
                {
                    return {text:text,combo:kstr(menuOrCombo)}
                }
                else if (_k_.isStr(menuOrCombo))
                {
                    return {text:text,combo:keyinfo.convertCmdCtrl(menuOrCombo)}
                }
                else if (_k_.empty(menuOrCombo))
                {
                    return {text:text,combo:''}
                }
                else if ((menuOrCombo.combo != null) || (menuOrCombo.command != null))
                {
                    item = _k_.clone(menuOrCombo)
                    item.text = text
                    return item
                }
                else
                {
                    return {text:text,menu:this.makeTemplate(menuOrCombo)}
                }
            }).bind(this))())
        }
        return tmpl
    }

    Title.prototype["menuVisible"] = function ()
    {
        return this.menu.elem.style.display !== 'none'
    }

    Title.prototype["showMenu"] = function ()
    {
        var _218_68_, _218_75_

        this.menu.elem.style.display = 'inline-block'
        ;((_218_68_=this.menu) != null ? typeof (_218_75_=_218_68_.focus) === "function" ? _218_75_() : undefined : undefined)
        return prefs.set('menu',true)
    }

    Title.prototype["hideMenu"] = function ()
    {
        var _219_25_, _219_69_

        ;(this.menu != null ? this.menu.close() : undefined)
        prefs.set('menu',false)
        if (((this.menu != null ? this.menu.elem : undefined)))
        {
            return this.menu.elem.style.display = 'none'
        }
    }

    Title.prototype["toggleMenu"] = function ()
    {
        if (this.menuVisible())
        {
            return this.hideMenu()
        }
        else
        {
            return this.showMenu()
        }
    }

    Title.prototype["openMenu"] = function ()
    {
        if (this.menuVisible())
        {
            return this.hideMenu()
        }
        else
        {
            this.showMenu()
            return this.menu.open()
        }
    }

    Title.prototype["handleKeyInfo"] = function (modKeyComboEvent)
    {
        var action, combo, combos, event, item, key, keypath, keypaths, menu, mod, trail, _248_37_

        mod = modKeyComboEvent.mod
        key = modKeyComboEvent.key
        combo = modKeyComboEvent.combo
        event = modKeyComboEvent.event

        if (_k_.empty(combo))
        {
            return 'unhandled'
        }
        menu = this.templateCache
        if (_k_.empty(menu))
        {
            return 'unhandled'
        }
        keypaths = sds.find.key(menu,'combo')
        var list = _k_.list(keypaths)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            keypath = list[_a_]
            combos = sds.get(menu,keypath).split(' ')
            combos = combos.map(function (c)
            {
                return keyinfo.convertCmdCtrl(c)
            })
            if (_k_.in(combo,combos))
            {
                keypath.pop()
                item = sds.get(menu,keypath)
                action = ((_248_37_=item.action) != null ? _248_37_ : item.text)
                trail = []
                while (keypath.length > 1)
                {
                    keypath.pop()
                    keypath.pop()
                    trail.unshift(sds.get(menu,keypath).text)
                }
                trail = trail.join('▸')
                post.emit('menuAction',action,trail)
                return action
            }
        }
        return 'unhandled'
    }

    return Title
})()

export default Title;