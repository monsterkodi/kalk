var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import elem from "./elem.js"
import post from "./post.js"

class plot
{
    constructor (opt = {})
    {
        var _17_20_, _18_20_, _22_29_, _23_29_

        this.draw = this.draw.bind(this)
        this.history = []
        opt.width = ((_17_20_=opt.width) != null ? _17_20_ : 1500)
        opt.height = ((_18_20_=opt.height) != null ? _18_20_ : 1000)
        this.samples = opt.width * 2
        this.height = opt.height * 2
        this.scale = ((_22_29_=opt.scale) != null ? _22_29_ : {})
        this.color = ((_23_29_=opt.color) != null ? _23_29_ : {})
        this.elem = elem({class:'plot',width:opt.width,height:opt.height})
        this.canvas = elem('canvas',{class:'plotCanvas',width:this.samples,height:this.height})
        this.elem.appendChild(this.canvas)
    }

    add (sample)
    {
        this.history.push(sample)
        while (this.history.length > this.samples)
        {
            this.history.shift()
        }
        return this.draw()
    }

    draw ()
    {
        var ctx, i, k, sample, v

        this.canvas.height = this.canvas.height
        ctx = this.canvas.getContext('2d')
        var list = _k_.list(this.history)
        for (i = 0; i < list.length; i++)
        {
            sample = list[i]
            for (k in sample)
            {
                v = sample[k]
                if (this.color[k])
                {
                    ctx.fillStyle = this.color[k]
                }
                else
                {
                    ctx.fillStyle = "white"
                }
                if (this.scale[k])
                {
                    v *= this.scale[k]
                }
                ctx.fillRect(this.samples - this.history.length + i,this.height - v,1,1)
            }
        }
    }
}

export default plot;