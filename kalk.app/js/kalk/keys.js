var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kxk from "../kxk.js"
let $ = kxk.$
let elem = kxk.elem
let post = kxk.post
let stopEvent = kxk.stopEvent

import calc from "./calc.js"

class Keys
{
    constructor ()
    {
        this.onButton = this.onButton.bind(this)
        this.key = this.key.bind(this)
        this.row = this.row.bind(this)
        this.setKeys = this.setKeys.bind(this)
        this.onInputText = this.onInputText.bind(this)
        this.onKeys = this.onKeys.bind(this)
        this.view = $('#keys')
        this.table = elem('table',{class:'key-table',cellSpacing:'7px'})
        this.view.appendChild(this.table)
        this.numberKeys()
        post.on('keys',this.onKeys)
        post.on('inputText',this.onInputText)
        this.update()
    }

    onKeys (action)
    {
        switch (action)
        {
            case 'functions':
                this.functionKeys()
                break
            case 'numbers':
                this.numberKeys()
                break
        }

        return this.update()
    }

    update ()
    {
        return this.onInputText(window.input.plain)
    }

    onInputText (text)
    {
        var active, wrap, wraps

        console.log('onInputText',text)
        wraps = document.querySelectorAll('.key-wrap')
        var list = _k_.list(wraps)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            wrap = list[_a_]
            active = calc.activeKey(text,wrap.innerHTML)
            wrap.parentElement.classList.toggle('inactive',!active)
            wrap.classList.toggle('inactive',!active)
        }
    }

    setKeys (keys1, keys)
    {
        var i, row

        this.keys = keys1
    
        this.table.innerHTML = ''
        row = elem('tr',{class:'spacing-row'})
        for (i = 0; i < 5; i++)
        {
            row.appendChild(elem('td',{class:'spacing-cell',width:'84px'}))
        }
        this.table.appendChild(row)
        var list = _k_.list(keys)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            row = list[_a_]
            this.table.appendChild(row)
        }
    }

    row (children)
    {
        return elem('tr',{class:'key-row',children:children})
    }

    key (text, clss = '')
    {
        var cfg

        if (text === '_')
        {
            return elem('td',{class:'key hidden'})
        }
        else
        {
            cfg = {class:'key ' + clss,click:this.onButton,child:elem({class:'key-wrap',text:text})}
            if (clss.indexOf('wide') >= 0)
            {
                cfg.colSpan = 2
            }
            if (clss.indexOf('tall') >= 0)
            {
                cfg.rowSpan = 2
            }
            return elem('td',cfg)
        }
    }

    numberKeys ()
    {
        return this.setKeys('numbers',[this.row([this.key('c','tall clear'),this.key(symbol.sqrt,'op0 sqrt'),this.key('^','op0 pow'),this.key('/','op1 dot divide'),this.key('*','op1 dot multiply')]),this.row([this.key('7','digit'),this.key('8','digit'),this.key('9','digit'),this.key('-','op2')]),this.row([this.key(symbol.backspace,'backspace'),this.key('4','digit'),this.key('5','digit'),this.key('6','digit'),this.key('+','op2')]),this.row([this.key(symbol.func,'tall bottom func'),this.key('1','digit'),this.key('2','digit'),this.key('3','digit'),this.key('=','tall bottom equals')]),this.row([this.key('0','wide digit right'),this.key('.','dot')])])
    }

    functionKeys ()
    {
        return this.setKeys('functions',[this.row([this.key('c','tall clear'),this.key(symbol.sqrt,'op1 sqrt'),this.key(symbol.exp,'op1 exp'),this.key(symbol.oneoverx,'op1 oneoverx'),this.key('*','dot multiply')]),this.row([this.key('sin','function sin'),this.key('cos','function cos'),this.key('π','constant pi'),this.key('-','dot')]),this.row([this.key(symbol.backspace,'backspace'),this.key('tan','function tan'),this.key('log','function log'),this.key(symbol.euler,'constant euler'),this.key('+','dot')]),this.row([this.key(symbol.numbers,'tall bottom numbers'),this.key('atan','function atan'),this.key('∡','op1 rad2deg'),this.key('ϕ','constant phi'),this.key('=','tall bottom equals')]),this.row([this.key('(','bracket'),this.key('°','digit deg2rad'),this.key(')','bracket')])])
    }

    onButton (event)
    {
        return post.emit('button',event.target.firstChild.innerHTML.trim())
    }

    toggleKeys ()
    {
        return (this.keys === 'numbers' ? this.functionKeys() : this.numberKeys())
    }

    keyDown (info)
    {
        var combo

        if (info.key === 'shift')
        {
            post.emit('keys','functions')
            this.shiftFunctions = true
        }
        combo = info.combo
        switch (combo)
        {
            case 'tab':
                return this.toggleKeys()

            case '/':
            case '*':
            case '+':
            case '-':
            case '=':
            case '.':
                return post.emit('button',combo)

            case 'enter':
                return post.emit('button','=')

            case 'backspace':
                return post.emit('button',symbol.backspace)

            case 'delete':
            case 'esc':
                return post.emit('button','c')

            case 'shift+8':
                return post.emit('button','*')

            case 'shift+6':
                return post.emit('button','^')

            case 'shift+=':
                return post.emit('button','+')

            case 'shift+9':
                return post.emit('button',symbol.open)

            case 'shift+0':
                return post.emit('button',symbol.close)

            case 'e':
                return post.emit('button',symbol.euler)

            case 'c':
                return post.emit('button','c')

            case 'p':
                return post.emit('button',symbol.pi)

            case 's':
                return post.emit('button','sin')

            case 'shift+s':
            case 'shift+c':
                return post.emit('button','cos')

            case 't':
                return post.emit('button','tan')

            case 'l':
                return post.emit('button','log')

            case 'd':
                return post.emit('button',symbol.deg2rad)

            case 'r':
                return post.emit('button',symbol.sqrt)

            case 'x':
                return post.emit('button',symbol.exp)

            case 'i':
                return post.emit('button',symbol.oneoverx)

            case 'num lock':
                return post.emit('button','c')

        }

        if (combo.startsWith('numpad'))
        {
            return post.emit('button',combo.split(' ')[1])
        }
        else if (_k_.in(combo,[0,1,2,3,4,5,6,7,8,9].map(function (i)
            {
                return `${i}`
            })))
        {
            return post.emit('button',combo)
        }
        return 'unhandled'
    }

    keyUp (info)
    {
        if (info.key === 'shift')
        {
            if (this.shiftFunctions)
            {
                post.emit('keys','numbers')
                return delete this.shiftFunctions
            }
        }
    }
}

export default Keys;