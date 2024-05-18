var _k_ = {each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var STYLES, toHexString

STYLES = {f0:'#000',f1:'#F00',f2:'#0D0',f3:'#DD0',f4:'#00F',f5:'#D0D',f6:'#0DD',f7:'#AAA',f8:'#555',f9:'#F55',f10:'#5F5',f11:'#FF5',f12:'#55F',f13:'#F5F',f14:'#5FF',f15:'#FFF',b0:'#000',b1:'#A00',b2:'#0A0',b3:'#A50',b4:'#00A',b5:'#A0A',b6:'#0AA',b7:'#AAA',b8:'#555',b9:'#F55',b10:'#5F5',b11:'#FF5',b12:'#55F',b13:'#F5F',b14:'#5FF',b15:'#FFF'}

toHexString = function (num)
{
    num = num.toString(16)
    while (num.length < 2)
    {
        num = `0${num}`
    }
    return num
}
;(function (o) {
    var r_a_ = _k_.each_r(o)
    for (var k in o)
    {   
        var m = (function (red)
    {
        return         (function (o) {
            var r_b_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (green)
            {
                return                 (function (o) {
                    var r_c_ = _k_.each_r(o)
                    for (var k in o)
                    {   
                        var m = (function (blue)
                    {
                        var b, c, g, n, r, rgb

                        c = 16 + (red * 36) + (green * 6) + blue
                        r = red > 0 ? red * 40 + 55 : 0
                        g = green > 0 ? green * 40 + 55 : 0
                        b = blue > 0 ? blue * 40 + 55 : 0
                        rgb = (function () { var r_d_ = []; var list = [r,g,b]; for (var _e_ = 0; _e_ < list.length; _e_++)  { n = list[_e_];r_d_.push(toHexString(n))  } return r_d_ }).bind(this)().join('')
                        STYLES[`f${c}`] = `#${rgb}`
                        return STYLES[`b${c}`] = `#${rgb}`
                    })(o[k])
                        if (m != null)
                        {
                            r_c_[k] = m
                        }
                    }
                    return typeof o == 'string' ? r_c_.join('') : r_c_
                })([0,1,2,3,4,5])
            })(o[k])
                if (m != null)
                {
                    r_b_[k] = m
                }
            }
            return typeof o == 'string' ? r_b_.join('') : r_b_
        })([0,1,2,3,4,5])
    })(o[k])
        if (m != null)
        {
            r_a_[k] = m
        }
    }
    return typeof o == 'string' ? r_a_.join('') : r_a_
})([0,1,2,3,4,5])
;(function (o) {
    var r_f_ = _k_.each_r(o)
    for (var k in o)
    {   
        var m = (function (gray)
    {
        var c, l

        c = gray + 232
        l = toHexString(gray * 10 + 8)
        STYLES[`f${c}`] = `#${l}${l}${l}`
        return STYLES[`b${c}`] = `#${l}${l}${l}`
    })(o[k])
        if (m != null)
        {
            r_f_[k] = m
        }
    }
    return typeof o == 'string' ? r_f_.join('') : r_f_
})((function() { var r = []; for (var i = 0; i <= 23; i++){ r.push(i); } return r; }).apply(this))
class Ansi
{
    static html (s)
    {
        var andi, d, diss, htmlLine, i, l, lines, span, _79_32_

        andi = new Ansi()
        lines = []
        var list = ((_79_32_=(s != null ? s.split('\n') : undefined)) != null ? _79_32_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            l = list[_a_]
            diss = andi.dissect(l)[1]
            htmlLine = ''
            for (var _b_ = i = 0, _c_ = diss.length; (_b_ <= _c_ ? i < diss.length : i > diss.length); (_b_ <= _c_ ? ++i : --i))
            {
                d = diss[i]
                span = d.styl && `<span style=\"${d.styl}\">${d.match}</span>` || d.match
                if (parseInt(i))
                {
                    if (diss[i - 1].start + diss[i - 1].match.length < d.start)
                    {
                        htmlLine += ' '
                    }
                }
                htmlLine += span
            }
            lines.push(htmlLine)
        }
        return lines.join('\n')
    }

    dissect (input)
    {
        this.input = input
    
        this.diss = []
        this.text = ""
        this.tokenize()
        return [this.text,this.diss]
    }

    tokenize ()
    {
        var addStyle, addText, ansiCode, ansiHandler, ansiMatch, bg, delStyle, fg, handler, i, invert, length, process, resetStyle, setBG, setFG, st, start, toHighIntensity, tokens

        start = 0
        ansiHandler = 2
        ansiMatch = false
        invert = false
        fg = bg = ''
        st = []
        resetStyle = function ()
        {
            fg = bg = ''
            invert = false
            return st = []
        }
        addStyle = function (style)
        {
            if (!(_k_.in(style,st)))
            {
                return st.push(style)
            }
        }
        delStyle = function (style)
        {
            return st.splice(st.indexOf(style),1)
        }
        setFG = function (cs)
        {
            if (cs.length === 5)
            {
                return fg = `rgb(${cs[2]},${cs[3]},${cs[4]})`
            }
            else
            {
                return fg = STYLES[`f${cs[2]}`]
            }
        }
        setBG = function (cs)
        {
            if (cs.length === 5)
            {
                return bg = `rgb(${cs[2]},${cs[3]},${cs[4]})`
            }
            else
            {
                return bg = STYLES[`b${cs[2]}`]
            }
        }
        addText = (function (t)
        {
            var addMatch, addSpace, i, match, mstrt, space, sstrt

            start = this.text.length
            match = ''
            mstrt = start
            space = ''
            sstrt = start
            addMatch = (function ()
            {
                var style

                if (match.length)
                {
                    style = ''
                    if (invert)
                    {
                        if (bg.length)
                        {
                            style += `color:${bg};`
                        }
                        else
                        {
                            style += 'color:#000;'
                        }
                        if (fg.length)
                        {
                            style += `background-color:${fg};`
                        }
                        else
                        {
                            style += 'background-color:#fff;'
                        }
                    }
                    else
                    {
                        if (fg.length)
                        {
                            style += `color:${fg};`
                        }
                        if (bg.length)
                        {
                            style += `background-color:${bg};`
                        }
                    }
                    if (st.length)
                    {
                        style += st.join(';')
                    }
                    this.diss.push({match:match,start:mstrt,styl:style})
                    return match = ''
                }
            }).bind(this)
            addSpace = (function ()
            {
                if (space.length)
                {
                    this.diss.push({match:space,start:sstrt,styl:`background-color:${bg};`})
                    return space = ''
                }
            }).bind(this)
            for (var _a_ = i = 0, _b_ = t.length; (_a_ <= _b_ ? i < t.length : i > t.length); (_a_ <= _b_ ? ++i : --i))
            {
                if (t[i] !== ' ')
                {
                    if (match === '')
                    {
                        mstrt = start + i
                    }
                    match += t[i]
                    addSpace()
                }
                else
                {
                    if (bg.length)
                    {
                        if (space === '')
                        {
                            sstrt = start + i
                        }
                        space += t[i]
                    }
                    addMatch()
                }
            }
            addMatch()
            addSpace()
            this.text += t
            start = this.text.length
            return ''
        }).bind(this)
        toHighIntensity = function (c)
        {
            var i

            for (i = 0; i <= 7; i++)
            {
                if (c === STYLES[`f${i}`])
                {
                    return STYLES[`f${8 + i}`]
                }
            }
            return c
        }
        ansiCode = function (m, c)
        {
            var code, cs

            ansiMatch = true
            if (c.trim().length === 0)
            {
                c = '0'
            }
            cs = c.trimRight(';').split(';')
            var list = _k_.list(cs)
            for (var _c_ = 0; _c_ < list.length; _c_++)
            {
                code = list[_c_]
                code = parseInt(code,10)
                switch (code)
                {
                    case 0:
                        resetStyle()
                        break
                    case 1:
                        addStyle('font-weight:bold')
                        fg = toHighIntensity(fg)
                        break
                    case 2:
                        addStyle('opacity:0.5')
                        break
                    case 4:
                        addStyle('text-decoration:underline')
                        break
                    case 7:
                        invert = true
                        break
                    case 27:
                        invert = false
                        break
                    case 8:
                        addStyle('display:none')
                        break
                    case 9:
                        addStyle('text-decoration:line-through')
                        break
                    case 39:
                        fg = STYLES["f15"]
                        break
                    case 49:
                        bg = STYLES["b0"]
                        break
                    case 38:
                        setFG(cs)
                        break
                    case 48:
                        setBG(cs)
                        break
                    case 28:
                        delStyle('display:none')
                        break
                    case 22:
                        delStyle('font-weight:bold')
                        delStyle('opacity:0.5')
                        break
                    default:
                        if ((30 <= code && code <= 37))
                    {
                        fg = STYLES[`f${code - 30}`]
                    }
                    else if ((40 <= code && code <= 47))
                    {
                        bg = STYLES[`b${code - 40}`]
                    }
                    else if ((90 <= code && code <= 97))
                    {
                        fg = STYLES[`f${8 + code - 90}`]
                    }
                }

                if (_k_.in(code,[38,48]))
                {
                    break
                }
            }
            return ''
        }
        tokens = [{pattern:/^\x08+/,sub:''},{pattern:/^\x1b\[[012]?K/,sub:''},{pattern:/^\x1b\[((?:\d{1,3};?)+|)m/,sub:ansiCode},{pattern:/^\x1b\[?[\d;]{0,3}/,sub:''},{pattern:/^([^\x1b\x08\n]+)/,sub:addText}]
        process = (function (handler, i)
        {
            if (i > ansiHandler && ansiMatch)
            {
                return
            }
            ansiMatch = false
            return this.input = this.input.replace(handler.pattern,handler.sub)
        }).bind(this)
        while ((length = this.input.length) > 0)
        {
            var list = _k_.list(tokens)
            for (i = 0; i < list.length; i++)
            {
                handler = list[i]
                process(handler,i)
            }
            if (this.input.length === length)
            {
                break
            }
        }
    }
}

export default Ansi;