var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kxk from "../kxk.js"
let $ = kxk.$
let elem = kxk.elem
let ffs = kxk.ffs
let post = kxk.post

import calc from "./calc.js"
import color from "./color.js"
import text from "./text.js"

class Input
{
    constructor ()
    {
        this.onButton = this.onButton.bind(this)
        this.onResize = this.onResize.bind(this)
        this.clear = this.clear.bind(this)
        this.view = $('#input')
        this.plain = ''
        post.on('resize',this.onResize)
        post.on('button',this.onButton)
        this.input = elem({class:'input-text','tab-index':1})
        this.view.appendChild(elem({class:'input-frame',child:this.input}))
    }

    appendText (text)
    {
        return this.setText(this.text() + text)
    }

    textLength ()
    {
        return this.text().length
    }

    clear ()
    {
        this.setText('')
        return delete this.forceBracket
    }

    onResize ()
    {
        return this.setText(this.plain)
    }

    text ()
    {
        return this.plain
    }

    setText (plain)
    {
        var br, cw, fs

        this.plain = plain
    
        if ((text.balance(this.plain) === 1) && !this.forceBracket)
        {
            this.input.innerHTML = color(text.clean(this.plain))
        }
        else
        {
            this.input.innerHTML = color(this.plain)
        }
        br = this.input.getBoundingClientRect()
        cw = 55
        if (this.plain.length > br.width / cw)
        {
            fs = 90 * br.width / (cw * this.plain.length)
        }
        else
        {
            fs = 90
        }
        post.emit('inputText',this.plain)
        return this.input.style.fontSize = `${fs}px`
    }

    onButton (key)
    {
        switch (key)
        {
            case 'ƒ':
                return post.emit('keys','functions')

            case 'ℵ':
                return post.emit('keys','numbers')

            case 'C':
                return this.clear()

            default:
                if (_k_.in(key,'()'))
            {
                this.forceBracket = true
            }
                return this.setText(calc.textKey(this.text(),key))
        }

    }
}

export default Input;