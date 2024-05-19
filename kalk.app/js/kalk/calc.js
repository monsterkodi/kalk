var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

import kxk from "../kxk.js"
let scooter = kxk.scooter
let fromPairs = kxk.fromPairs
let kstr = kxk.kstr
let post = kxk.post

import text from "./text.js"

class Calc
{
    static activeKey (txt, key)
    {
        var apply, bin, clean, close, cOnst, deg2rad, dot, float, hex, int, num, oct, op, open, rad2deg, unfin, value

        clean = _k_.empty(txt)
        cOnst = text.endsWithConstant(txt)
        value = text.endsWithValue(txt)
        float = text.endsWithFloat(txt)
        hex = text.endsWithHex(txt)
        oct = text.endsWithOct(txt)
        bin = text.endsWithBin(txt)
        num = text.endsWithNumber(txt)
        unfin = text.endsWithUnfinished(txt)
        int = num && !float && !oct && !bin
        open = txt.slice(-1)[0] === symbol.open
        close = txt.slice(-1)[0] === symbol.close
        deg2rad = txt.slice(-1)[0] === symbol.deg2rad
        rad2deg = txt.slice(-1)[0] === symbol.rad2deg
        dot = txt.slice(-1)[0] === symbol.dot
        apply = !unfin && !clean
        switch (key)
        {
            case symbol.func:
            case symbol.numbers:
                return true

            case symbol.pi:
            case symbol.phi:
            case symbol.euler:
                return !cOnst && !deg2rad && !dot

            case '1':
            case '0':
                return !cOnst && !deg2rad

            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
                return !cOnst && !deg2rad && !bin

            case '8':
            case '9':
                return !cOnst && !deg2rad && !bin && !oct

            case 'x':
                return txt.slice(-1)[0] === '0' && !float && !hex && !bin && !oct

            case 'a':
            case 'b':
            case 'c':
            case 'd':
            case 'e':
            case 'f':
                return clean || hex || int || (unfin && !dot)

            case symbol.clear:
            case symbol.backspace:
                return !clean

            case 'sin':
            case 'cos':
            case 'tan':
            case 'atan':
            case 'deg':
            case 'rad':
            case 'log':
                if (dot || close)
                {
                    return false
                }
                return true

            case '/':
            case '*':
            case '=':
            case symbol.pow:
                return apply

            case symbol.exp:
            case symbol.oneoverx:
            case symbol.bin:
            case symbol.oct:
            case symbol.hex:
            case symbol.sqrt:
                return open || apply || clean || (unfin && !dot)

            case symbol.rad2deg:
                return apply && !rad2deg

            case symbol.deg2rad:
                return apply && !deg2rad

            case '+':
            case '-':
                return !text.endsWith(txt,['+','-','.'])

            case '.':
                return int

            case symbol.open:
                return !dot && !open && !cOnst && !close && !value

            case symbol.close:
                if (unfin || clean)
                {
                    return false
                }
                if (text.balance(txt) > 0)
                {
                    return true
                }
                if (close)
                {
                    return false
                }
                var list = ['+','-','/','*','^']
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    op = list[_a_]
                    if (_k_.in(op,txt))
                    {
                        return true
                    }
                }
                return false
                return true

            default:
                console.log('ever come here?',txt,key)
                if (_k_.in(key,text.unfinished))
            {
                return apply
            }
        }

        console.log('activeKey',txt,key)
        return false
    }

    static calc (expr)
    {
        var val

        if (_k_.empty(expr))
        {
            return ''
        }
        expr = text.close(expr)
        expr = _k_.trim(expr,' \n')
        val = scooter(expr)
        ;(post != null ? post.emit('sheet',{text:expr,val:val}) : undefined)
        return val
    }

    static textKey (txt, key)
    {
        var clean, cOnst, f, float, func, num, open, p, prfx, unfin, value

        if (!this.activeKey(txt,key))
        {
            return txt
        }
        if (txt === 'NaN')
        {
            txt = ''
        }
        clean = _k_.empty(txt)
        cOnst = text.endsWithConstant(txt)
        value = text.endsWithValue(txt)
        float = text.endsWithFloat(txt)
        num = text.endsWithNumber(txt)
        unfin = text.endsWithUnfinished(txt)
        open = txt.slice(-1)[0] === symbol.open
        switch (key)
        {
            case symbol.backspace:
                var list = ['sin','cos','tan','atan','deg','rad','log','NaN',symbol.sqrt]
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    f = list[_a_]
                    if (txt.endsWith(f))
                    {
                        return txt = txt.slice(0, txt.length - f.length)
                    }
                    if (txt.endsWith(f + '('))
                    {
                        return txt = txt.slice(0, txt.length - f.length - 1)
                    }
                }
                txt = txt.slice(0, -1)
                break
            case symbol.sqrt:
            case 'sin':
            case 'cos':
            case 'tan':
            case 'atan':
            case 'deg':
            case 'rad':
            case 'log':
                if (!_k_.empty((txt)) && text.endsWithValue(txt))
                {
                    txt = this.calc(key + '(' + txt)
                }
                else if (!text.endsWith(txt,['.']))
                {
                    txt += key + '('
                }
                break
            case symbol.exp:
                open || clean ? txt += symbol.euler + '^' : txt = this.calc(symbol.euler + '^(' + txt + ')')
                break
            case symbol.bin:
            case symbol.oct:
            case symbol.hex:
                switch (key)
                {
                    case symbol.bin:
                        prfx = '0b'
                        func = 'bin'
                        break
                    case symbol.oct:
                        prfx = '0o'
                        func = 'oct'
                        break
                    case symbol.hex:
                        prfx = '0x'
                        func = 'hex'
                        break
                }

                var list1 = ['0b','0o','0x']
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    p = list1[_b_]
                    if (p !== prfx && txt.endsWith(p))
                    {
                        return txt.slice(0, -2) + prfx
                    }
                }
                open || clean || unfin ? txt += prfx : txt = this.calc(func + '(' + txt + ')')
                break
            case symbol.oneoverx:
                open || clean || unfin ? txt += '1/' : txt = this.calc('1/(' + txt + ')')
                break
            case symbol.rad2deg:
                txt = this.calc('∡(' + txt + ')')
                break
            case symbol.euler:
            case symbol.phi:
            case symbol.pi:
                if (value)
                {
                    txt += '*'
                }
                txt += key
                break
            case '=':
                txt = this.calc(txt)
                break
            case '+':
            case '-':
            case '.':
            case symbol.open:
            case symbol.deg2rad:
            case symbol.close:
                txt += key
                break
            default:
                if (_k_.in(key,text.unfinished))
            {
                if (!_k_.empty(txt))
                {
                    if (!text.endsWithUnfinished(txt))
                    {
                        txt += key
                    }
                }
            }
            else if (!text.endsWithConstant(txt))
            {
                if (key !== 'x')
                {
                    txt = text.removeZeroInfinity(txt)
                }
                if (_k_.in(key,'abcdef'))
                {
                    txt = text.makeTrailingHex(txt)
                }
                txt = txt + key
            }
        }

        return txt
    }
}

export default Calc;