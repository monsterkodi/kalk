var _k_ = {clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import elem from "./elem.js"
import post from "./post.js"

class FPS
{
    constructor (parent, opt = {})
    {
        var _15_20_, _16_20_

        this.stash = this.stash.bind(this)
        this.onStashLoaded = this.onStashLoaded.bind(this)
        this.draw = this.draw.bind(this)
        opt.width = ((_15_20_=opt.width) != null ? _15_20_ : 130)
        opt.height = ((_16_20_=opt.height) != null ? _16_20_ : 15)
        this.topDown = opt.topDown
        this.samples = opt.width
        this.height = opt.height * 2
        this.elem = elem({class:'fps',parent:parent,width:opt.width,height:opt.height})
        this.canvas = elem('canvas',{class:'fpsCanvas',width:this.samples,height:this.height})
        this.elem.appendChild(this.canvas)
        if (this.topDown)
        {
            this.canvas.style.transform = 'scaleY(-1)'
        }
        this.history = [56]
        this.last = performance.now()
        post.on('stash',this.stash)
        post.on('stashLoaded',this.onStashLoaded)
        this.draw()
    }

    draw ()
    {
        var ctx, green, h, i, ms, red, time

        time = performance.now()
        this.history.push(time - this.last)
        while (this.history.length > this.samples)
        {
            this.history.shift()
        }
        this.canvas.height = this.canvas.height
        ctx = this.canvas.getContext('2d')
        for (var _a_ = i = 0, _b_ = this.history.length; (_a_ <= _b_ ? i < this.history.length : i > this.history.length); (_a_ <= _b_ ? ++i : --i))
        {
            ms = Math.max(0,this.history[i] - 34)
            red = parseInt(32 + 223 * _k_.clamp(0,1,(ms - 16) / 16))
            green = parseInt(32 + 223 * _k_.clamp(0,1,(ms - 32) / 32))
            ctx.fillStyle = `rgb(${red}, ${green}, 32)`
            h = Math.min(ms,this.height)
            ctx.fillRect(this.samples - this.history.length + i,this.height - h,1,h)
        }
        this.last = time
        if (this.elem.style.display !== 'none')
        {
            return window.requestAnimationFrame(this.draw)
        }
    }

    visible ()
    {
        return this.elem.style.display !== 'none'
    }

    onStashLoaded ()
    {
        return this.draw()
    }

    stash ()
    {}

    toggle ()
    {
        this.elem.style.display = this.visible() && 'none' || 'flex'
        this.history.push(49)
        if (this.visible())
        {
            window.requestAnimationFrame(this.draw)
        }
        return this.stash()
    }
}

export default FPS;