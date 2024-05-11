var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

import kxk from "../kxk.js"
let scooter = kxk.scooter
let kstr = kxk.kstr
let post = kxk.post

import text from "./text.js"

class Calc
{
    static activeKey (txt, key)
    {
        var apply, clean, close, cOnst, deg2rad, dot, float, nuber, op, open, rad2deg, unfin, value

        clean = _k_.empty(txt)
        cOnst = text.endsWithConstant(txt)
        value = text.endsWithValue(txt)
        float = text.endsWithFloat(txt)
        nuber = text.endsWithNumber(txt)
        unfin = text.endsWithUnfinished(txt)
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
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                return !cOnst && !deg2rad

            case 'c':
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
                return nuber && !float

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
                for (var _74_23_ = 0; _74_23_ < list.length; _74_23_++)
                {
                    op = list[_74_23_]
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

        console.log('fallthrough false?',txt,key)
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
        var clean, cOnst, f, float, nuber, open, unfin, value

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
        nuber = text.endsWithNumber(txt)
        unfin = text.endsWithUnfinished(txt)
        open = txt.slice(-1)[0] === symbol.open
        switch (key)
        {
            case symbol.backspace:
                var list = ['sin','cos','tan','atan','deg','rad','log','NaN',symbol.sqrt]
                for (var _131_22_ = 0; _131_22_ < list.length; _131_22_++)
                {
                    f = list[_131_22_]
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
            case '°':
                txt += key
                break
            case '=':
                txt = this.calc(txt)
                break
            case symbol.oneoverx:
                open || clean || unfin ? txt += '1/' : txt = this.calc('1/(' + txt + ')')
                break
            case '∡':
                txt = this.calc('∡(' + txt + ')')
                break
            case '+':
            case '-':
                txt += key
                break
            case '.':
                txt += key
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
            case '(':
                txt += key
                break
            case ')':
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
                txt = text.removeZeroInfinity(txt) + key
            }
        }

        return txt
    }
}

export default Calc;