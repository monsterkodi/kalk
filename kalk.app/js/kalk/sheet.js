var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

import kxk from "../kxk.js"
let $ = kxk.$
let elem = kxk.elem
let kstr = kxk.kstr
let post = kxk.post

import color from "./color.js"

class Sheet
{
    constructor ()
    {
        this.onSheet = this.onSheet.bind(this)
        this.clear = this.clear.bind(this)
        this.onResize = this.onResize.bind(this)
        this.view = $("#sheet")
        this.calc = elem({class:'sheet-calc'})
        this.result = elem({class:'sheet-result'})
        this.view.appendChild(this.calc)
        this.view.appendChild(this.result)
        post.on('sheet',this.onSheet)
        post.on('resize',this.onResize)
    }

    onResize ()
    {
        if (window.innerHeight <= window.WIN_MIN_HEIGHT)
        {
            return this.view.style.display = 'none'
        }
        else
        {
            return this.view.style.display = 'flex'
        }
    }

    async compact ()
    {
        var info

        info = await kakao('win.frameInfo')
        kakao('win.setFrame',{x:info.frame.x,y:info.frame.y,w:476,h:window.WIN_MIN_HEIGHT})
        return this
    }

    async expand ()
    {
        var add, info, spaceAbove

        info = await kakao('win.frameInfo')
        spaceAbove = (info.screen.h + info.screen.y) - (info.frame.h + info.frame.y)
        if (spaceAbove > 34)
        {
            add = this.view.scrollHeight - this.view.getBoundingClientRect().height + 4
            kakao('win.setFrame',{x:info.frame.x,y:info.frame.y,w:476,h:_k_.max(656,info.frame.h + add)})
        }
        return this
    }

    clear ()
    {
        this.calc.innerHTML = ''
        this.result.innerHTML = ''
        return this
    }

    onSheet (action)
    {
        if (action === 'clear')
        {
            return this.clear()
        }
        else if (action === 'collapse')
        {
            return this.clear().compact()
        }
        else if (action.text !== kstr(action.val))
        {
            this.calc.appendChild(elem({class:'sheet-line calc',html:color(action.text)}))
            this.result.appendChild(elem({class:'sheet-line result',html:color(action.val)}))
        }
        else
        {
            this.calc.appendChild(elem({class:'sheet-line calc',html:''}))
            this.result.appendChild(elem({class:'sheet-line result',html:color(action.val)}))
        }
        this.result.lastChild.scrollIntoView()
        return this.expand()
    }
}

export default Sheet;