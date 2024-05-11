var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isFunc: function (o) {return typeof o === 'function'}}

var Tooltip

import elem from "./elem.js"


Tooltip = (function ()
{
    function Tooltip (opt)
    {
        var _15_55_, _17_19_, _18_19_

        this.opt = opt
    
        this["onLeave"] = this["onLeave"].bind(this)
        this["popup"] = this["popup"].bind(this)
        this["onHover"] = this["onHover"].bind(this)
        this["del"] = this["del"].bind(this)
        this["mut"] = this["mut"].bind(this)
        if (!(this.opt != null ? this.opt.elem : undefined))
        {
            return console.error("no elem for tooltip?")
        }
        this.opt.delay = ((_17_19_=this.opt.delay) != null ? _17_19_ : 700)
        this.opt.html = ((_18_19_=this.opt.html) != null ? _18_19_ : this.opt.text)
        this.elem = this.opt.elem
        if (_k_.isStr(this.opt.elem))
        {
            this.elem = $(this.opt.elem)
        }
        this.elem.tooltip = this
        this.observer = new MutationObserver(this.mut)
        this.observer.observe(this.elem.parentElement,{childList:true})
        this.elem.addEventListener('mouseenter',this.onHover)
    }

    Tooltip.prototype["mut"] = function (mutationList, observer)
    {
        var mutation

        var list = _k_.list(mutationList)
        for (var _31_21_ = 0; _31_21_ < list.length; _31_21_++)
        {
            mutation = list[_31_21_]
            if (mutation.type === "childList")
            {
                if (_k_.in(this.elem,mutation.removedNodes))
                {
                    this.del()
                    return
                }
            }
        }
    }

    Tooltip.prototype["del"] = function (event)
    {
        var _40_27_

        if (this.opt.keep)
        {
            return
        }
        if (!(this.elem != null))
        {
            return
        }
        if (_k_.empty((event)) || (event != null ? event.target : undefined) === this.elem)
        {
            this.elem.removeEventListener('mouseenter',this.onLeave)
            delete this.elem.tooltip
            this.onLeave()
            this.observer.disconnect()
            delete this.observer
            return this.elem = null
        }
    }

    Tooltip.prototype["onHover"] = function (event)
    {
        var _52_27_, _53_22_

        if (!(this.elem != null))
        {
            return
        }
        if ((this.div != null))
        {
            return
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(this.popup,this.opt.delay)
        this.elem.addEventListener('mouseleave',this.onLeave)
        return this.elem.addEventListener('mousedown',this.onLeave)
    }

    Tooltip.prototype["popup"] = function (event)
    {
        var bound, br, html, _63_27_, _64_22_, _73_27_, _77_67_, _78_59_, _79_60_

        if (!(this.elem != null))
        {
            return
        }
        if ((this.div != null))
        {
            return
        }
        html = (_k_.isFunc(this.opt.html) ? this.opt.html() : this.opt.html)
        this.div = elem({id:'tooltip',class:'tooltip',html:html})
        if (this.opt.parent)
        {
            this.opt.parent.appendChild(this.div)
        }
        else
        {
            document.body.appendChild(this.div)
        }
        bound = ((_73_27_=this.opt.bound) != null ? _73_27_ : this.elem)
        br = bound.getBoundingClientRect()
        this.div.style.transform = "scaleY(1)"
        this.div.style.opacity = '1'
        if ((this.opt.textSize != null))
        {
            this.div.style.fontSize = `${this.opt.textSize}px`
        }
        if ((this.opt.x != null))
        {
            this.div.style.left = `${br.left + this.opt.x}px`
        }
        if ((this.opt.y != null))
        {
            return this.div.style.top = `${br.bottom + this.opt.y}px`
        }
    }

    Tooltip.prototype["onLeave"] = function (event, e)
    {
        var _83_16_, _89_12_

        if ((this.elem != null))
        {
            this.elem.removeEventListener('mouseleave',this.onLeave)
            this.elem.removeEventListener('mousedown',this.onLeave)
        }
        clearTimeout(this.timer)
        this.timer = null
        ;(this.div != null ? this.div.remove() : undefined)
        return this.div = null
    }

    return Tooltip
})()

export default Tooltip;