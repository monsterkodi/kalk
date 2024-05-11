var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isFunc: function (o) {return typeof o === 'function'}}

var Menu

import dom from "./dom.js"
let elem = dom.elem
let stopEvent = dom.stopEvent

import post from "./post.js"
import keyinfo from "./keyinfo.js"
import popup from "./popup.js"


Menu = (function ()
{
    function Menu (opt)
    {
        var combo, div, item, _23_25_

        this["onMouseDown"] = this["onMouseDown"].bind(this)
        this["onKeyDown"] = this["onKeyDown"].bind(this)
        this["close"] = this["close"].bind(this)
        this["onFocusOut"] = this["onFocusOut"].bind(this)
        this["onHover"] = this["onHover"].bind(this)
        this["blur"] = this["blur"].bind(this)
        this["focus"] = this["focus"].bind(this)
        this.elem = elem({class:'menu',tabindex:0})
        var list = _k_.list(opt.items)
        for (var _18_17_ = 0; _18_17_ < list.length; _18_17_++)
        {
            item = list[_18_17_]
            if (item.hide)
            {
                continue
            }
            div = elem({class:'menuItem',text:item.text})
            div.item = item
            div.addEventListener('mousedown',this.onMouseDown)
            if ((item.combo != null))
            {
                combo = elem('span',{class:'popupCombo',text:keyinfo.short(item.combo)})
                div.appendChild(combo)
            }
            this.elem.appendChild(div)
        }
        this.select(this.elem.firstChild)
        this.elem.addEventListener('keydown',this.onKeyDown)
        this.elem.addEventListener('focusout',this.onFocusOut)
        this.elem.addEventListener('mouseover',this.onHover)
        post.on('window.blur',this.blur)
        post.on('window.focus',this.focus)
    }

    Menu.prototype["focus"] = function ()
    {
        var _52_13_

        this.focusElem = document.activeElement
        return (this.elem != null ? this.elem.focus() : undefined)
    }

    Menu.prototype["blur"] = function ()
    {
        return this.close()
    }

    Menu.prototype["onHover"] = function (event)
    {
        return this.select(event.target,{selectFirstItem:false})
    }

    Menu.prototype["onFocusOut"] = function (event)
    {
        var _60_45_

        if (this.popup && !(event.relatedTarget != null ? event.relatedTarget.classList.contains('popup') : undefined))
        {
            this.popup.close({focus:false})
            return delete this.popup
        }
    }

    Menu.prototype["open"] = function ()
    {
        return this.select(this.elem.firstChild,{activate:true})
    }

    Menu.prototype["close"] = function (opt = {})
    {
        var _80_17_

        if ((this.popup != null))
        {
            this.popup.close({focus:false})
            delete this.popup
            if (opt.focus !== false)
            {
                this.elem.focus()
            }
        }
        else
        {
            if (opt.focus !== false)
            {
                if (this.focusElem && _k_.isFunc(this.focusElem.focus))
                {
                    this.focusElem.focus()
                }
            }
        }
        return null
    }

    Menu.prototype["childClosed"] = function (child, opt)
    {
        if (child === this.popup)
        {
            delete this.popup
            if (opt.focus !== false)
            {
                this.elem.focus()
            }
        }
        return null
    }

    Menu.prototype["select"] = function (item, opt = {})
    {
        var hadPopup, _109_17_, _113_17_

        if (!(item != null))
        {
            return
        }
        if ((this.popup != null))
        {
            hadPopup = true
            this.popup.close({focus:false})
        }
        ;(this.selected != null ? this.selected.classList.remove('selected') : undefined)
        this.selected = item
        this.selected.classList.add('selected')
        if (hadPopup || opt.activate)
        {
            delete this.popup
            return this.activate(item,opt)
        }
    }

    Menu.prototype["trail"] = function ()
    {
        return ''
    }

    Menu.prototype["activate"] = function (item, opt = {})
    {
        var br, items, pr, _133_29_

        if (items = (item != null ? (_133_29_=item.item) != null ? _133_29_.menu : undefined : undefined))
        {
            if (this.popup)
            {
                this.popup.close({focus:false})
                delete this.popup
            }
            br = item.getBoundingClientRect()
            pr = item.parentNode.getBoundingClientRect()
            opt.items = items
            opt.parent = this
            opt.trail = item.item.text
            opt.x = br.left - 1
            opt.y = pr.top + pr.height - 1
            opt.class = 'titlemenu'
            this.popup = popup.menu(opt)
            if (opt.selectFirstItem === false)
            {
                return this.elem.focus()
            }
        }
    }

    Menu.prototype["toggle"] = function (item)
    {
        if (this.popup)
        {
            this.popup.close({focus:false})
            return delete this.popup
        }
        else
        {
            return this.activate(item,{selectFirstItem:false})
        }
    }

    Menu.prototype["open"] = function (item)
    {
        if (this.popup)
        {
            return
        }
        else
        {
            return this.activate(item,{selectFirstItem:false})
        }
    }

    Menu.prototype["itemSelected"] = function (item, elem)
    {}

    Menu.prototype["deactivate"] = function (item)
    {}

    Menu.prototype["navigateLeft"] = function ()
    {
        var _170_39_

        return this.select((this.selected != null ? this.selected.previousSibling : undefined),{activate:true,selectFirstItem:false})
    }

    Menu.prototype["navigateRight"] = function ()
    {
        var _171_39_

        return this.select((this.selected != null ? this.selected.nextSibling : undefined),{activate:true,selectFirstItem:false})
    }

    Menu.prototype["onKeyDown"] = function (event)
    {
        var combo, key, mod

        mod = keyinfo.forEvent(event).mod
        key = keyinfo.forEvent(event).key
        combo = keyinfo.forEvent(event).combo

        switch (combo)
        {
            case 'end':
            case 'page down':
                return stopEvent(event,this.select(this.elem.lastChild,{activate:true,selectFirstItem:false}))

            case 'home':
            case 'page up':
                return stopEvent(event,this.select(this.elem.firstChild,{activate:true,selectFirstItem:false}))

            case 'enter':
            case 'down':
            case 'space':
                return stopEvent(event,this.activate(this.selected))

            case 'esc':
                return stopEvent(event,this.close())

            case 'right':
                return stopEvent(event,this.navigateRight())

            case 'left':
                return stopEvent(event,this.navigateLeft())

        }

    }

    Menu.prototype["onMouseDown"] = function (e)
    {
        return this.open(e.target)
    }

    return Menu
})()

export default Menu;