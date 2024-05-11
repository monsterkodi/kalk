var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var Drag

import dom from "./dom.js"
let $ = dom.$
let stopEvent = dom.stopEvent

import kpos from "./kpos.js"


Drag = (function ()
{
    function Drag (cfg)
    {
        var t, _17_32_, _22_35_, _23_35_, _31_22_, _37_22_, _39_59_, _40_57_, _41_55_, _46_18_

        this["deactivate"] = this["deactivate"].bind(this)
        this["activate"] = this["activate"].bind(this)
        this["dragStop"] = this["dragStop"].bind(this)
        this["dragUp"] = this["dragUp"].bind(this)
        this["dragMove"] = this["dragMove"].bind(this)
        this["dragStart"] = this["dragStart"].bind(this)
        this["eventPos"] = this["eventPos"].bind(this)
        cfg = (cfg != null ? cfg : {})
        this.target = ((_17_32_=cfg.target) != null ? _17_32_ : 'titlebar')
        this.handle = cfg.handle
        this.onStart = cfg.onStart
        this.onMove = cfg.onMove
        this.onStop = cfg.onStop
        this.active = ((_22_35_=cfg.active) != null ? _22_35_ : true)
        this.stopEvent = ((_23_35_=cfg.stopEvent) != null ? _23_35_ : true)
        if (_k_.isStr(this.target))
        {
            t = $(this.target)
            if (!(t != null))
            {
                return console.error("Drag -- can't find drag target with id",this.target)
            }
            this.target = t
        }
        if (!(this.target != null))
        {
            return console.error("Drag -- can't find drag target")
        }
        if (this.target === document.body)
        {
            this.useScreenPos = true
        }
        this.useScreenPos = ((_37_22_=this.useScreenPos) != null ? _37_22_ : cfg.useScreenPos)
        if ((this.onStart != null) && !(typeof(this.onStart) === 'function'))
        {
            console.error("Drag -- onStart not a function?")
        }
        if ((this.onMove != null) && !(typeof(this.onMove) === 'function'))
        {
            console.error("Drag -- onMove not a function?")
        }
        if ((this.onEnd != null) && !(typeof(this.onEnd) === 'function'))
        {
            console.error("Drag -- onEnd not a function?")
        }
        this.dragging = false
        this.listening = false
        if (_k_.isStr(this.handle))
        {
            this.handle = $(this.handle)
        }
        this.handle = ((_46_18_=this.handle) != null ? _46_18_ : this.target)
        if (this.active)
        {
            this.activate()
        }
    }

    Drag.prototype["start"] = function (p, event)
    {
        var _65_33_

        if (!this.dragging && this.listening)
        {
            this.dragging = true
            this.startPos = p
            this.pos = p
            this.delta = kpos(0,0)
            this.deltaSum = kpos(0,0)
            if ('skip' === (typeof this.onStart === "function" ? this.onStart(this,event) : undefined))
            {
                delete this.startPos
                this.dragging = false
                return this
            }
            this.lastPos = p
            if (this.stopEvent !== false)
            {
                stopEvent(event)
            }
            document.addEventListener('mousemove',this.dragMove)
            document.addEventListener('mouseup',this.dragUp)
        }
        return this
    }

    Drag.prototype["eventPos"] = function (event)
    {
        if (this.useScreenPos)
        {
            return kpos({x:event.screenX,y:event.screenY})
        }
        else
        {
            return kpos(event)
        }
    }

    Drag.prototype["dragStart"] = function (event)
    {
        return this.start(this.eventPos(event),event)
    }

    Drag.prototype["dragMove"] = function (event)
    {
        var _101_28_, _102_27_, _108_19_

        if (this.dragging)
        {
            this.pos = this.eventPos(event)
            this.delta = this.lastPos.to(this.pos)
            this.deltaSum = this.startPos.to(this.pos)
            if ((this.constrainKey != null) && event[this.constrainKey])
            {
                this.constrain = ((_102_27_=this.constrain) != null ? _102_27_ : Math.abs(this.delta.x) >= Math.abs(this.delta.y) ? kpos(1,0) : kpos(0,1))
                this.delta.x *= this.constrain.x
                this.delta.y *= this.constrain.y
            }
            else
            {
                delete this.constrain
            }
            ;(typeof this.onMove === "function" ? this.onMove(this,event) : undefined)
            this.lastPos = this.pos
        }
        return this
    }

    Drag.prototype["dragUp"] = function (event)
    {
        delete this.constrain
        return this.dragStop(event)
    }

    Drag.prototype["dragStop"] = function (event)
    {
        var _128_39_

        if (this.dragging)
        {
            document.removeEventListener('mousemove',this.dragMove)
            document.removeEventListener('mouseup',this.dragUp)
            if ((this.onStop != null) && (event != null))
            {
                this.onStop(this,event)
            }
            delete this.lastPos
            delete this.startPos
            this.dragging = false
        }
        return this
    }

    Drag.prototype["activate"] = function ()
    {
        if (!this.listening)
        {
            this.listening = true
            this.handle.addEventListener('mousedown',this.dragStart)
        }
        return this
    }

    Drag.prototype["deactivate"] = function ()
    {
        if (this.listening)
        {
            this.handle.removeEventListener('mousedown',this.dragStart)
            this.listening = false
            if (this.dragging)
            {
                this.dragStop()
            }
        }
        return this
    }

    return Drag
})()

export default Drag;