var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../kxk.js"
let matchr = kxk.matchr

class Color
{
    constructor ()
    {
        var cfg

        this.colorize = this.colorize.bind(this)
        cfg = {'(sin|cos|a?tan|exp|log|hex|oct|bin)':'function','0x[0-9a-f]*':'hex','0b[01]*':'bin','0o[0-7]*':'oct','=':'equals','[\\.]':'dot','[\\(\\)]':'bracket','\\d+':'digit','°':'digit','i':'complex','NaN':'nan','[π∞ϕ]':'constant','[∡√^]':'op0','[*/]':'op1','[+-]':'op2'}
        cfg[symbol.euler] = 'constant'
        this.config = matchr.config(cfg)
    }

    colorize (text)
    {
        var clss, colorized, index, rng, rngs, _48_28_

        rngs = matchr.ranges(this.config,text)
        colorized = ''
        index = 0
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            while (index < rng.start)
            {
                index += 1
                colorized += "&nbsp;"
            }
            if (index > rng.start)
            {
                continue
            }
            clss = ((_48_28_=rng.clss) != null ? _48_28_ : 'text')
            switch (clss)
            {
                case 'hex':
                    colorized += "<span class=\"hex prefix\">0x</span>"
                    colorized += `<span class=\"hex digit\">${rng.match.slice(2)}</span>`
                    break
                case 'bin':
                    colorized += "<span class=\"bin prefix\">0b</span>"
                    colorized += `<span class=\"bin digit\">${rng.match.slice(2)}</span>`
                    break
                case 'oct':
                    colorized += "<span class=\"oct prefix\">0o</span>"
                    colorized += `<span class=\"oct digit\">${rng.match.slice(2)}</span>`
                    break
                default:
                    colorized += `<span class=\"${clss}\">${rng.match}</span>`
            }

            index = rng.start + rng.match.length
        }
        while (index < text.length)
        {
            index += 1
            colorized += "&nbsp;"
        }
        return colorized
    }
}

export default (new Color()).colorize;