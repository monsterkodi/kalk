var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

class Text
{
    static balance (txt)
    {
        var c, o

        o = 0
        var list = _k_.list(txt)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            switch (c)
            {
                case '(':
                    o += 1
                    break
                case ')':
                    o -= 1
                    break
            }

        }
        return o
    }

    static close (txt)
    {
        var o

        o = this.balance(txt)
        while (o > 0)
        {
            o -= 1
            txt += ')'
        }
        return txt
    }

    static clean (txt)
    {
        var o

        o = this.balance(txt)
        while (o > 0)
        {
            o -= 1
            txt = txt.replace('(',' ')
        }
        return txt
    }

    static endsWith (txt, chars)
    {
        var c

        if (_k_.empty(txt))
        {
            return false
        }
        if (!(_k_.isStr(txt)))
        {
            return false
        }
        var list = _k_.list(chars)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            if (txt.endsWith(c))
            {
                return true
            }
        }
        return false
    }

    static numbers = ['0','1','2','3','4','5','6','7','8','9']

    static constants = [symbol.euler,symbol.pi,symbol.phi,symbol.deg2rad]

    static ops = ['+','-','/','*','^','(']

    static unfinished = ['.','+','-','/','*','^','(','0x','0b','0o']

    static popChar (txt)
    {
        return txt.substr(0,txt.length - 1)
    }

    static isInteger (txt)
    {
        return /\d+/.test(txt)
    }

    static endsWithHex (txt)
    {
        return /0x[\dabcdef]*$/.test(txt)
    }

    static endsWithOct (txt)
    {
        return /0o[0-7]*$/.test(txt)
    }

    static endsWithBin (txt)
    {
        return /0b[01]*$/.test(txt)
    }

    static endsWithFloat (txt)
    {
        return /\.\d+$/.test(txt)
    }

    static endsWithValue (txt)
    {
        return this.endsWithNumber(txt) || this.endsWithConstant(txt) || txt === '∞'
    }

    static endsWithNumber (txt)
    {
        return this.endsWith(txt,this.numbers)
    }

    static endsWithConstant (txt)
    {
        return this.endsWith(txt,this.constants)
    }

    static endsWithUnfinished (txt)
    {
        return this.endsWith(txt,this.unfinished)
    }

    static endsWithOp (txt)
    {
        return this.endsWith(txt,this.ops)
    }

    static removeZeroInfinity (txt)
    {
        var popped

        popped = this.popChar(txt)
        if (txt === '∞')
        {
            return popped
        }
        if (this.endsWith(txt,['0']) && !(this.endsWith(popped,['.']) || this.endsWithNumber(popped) || this.endsWithHex(popped) || this.endsWithOct(popped) || this.endsWithBin(popped)))
        {
            return popped
        }
        else
        {
            return txt
        }
    }

    static makeTrailingHex (txt)
    {
        var num

        if (Text.endsWithHex(txt))
        {
            return txt
        }
        if (Text.endsWithNumber(txt))
        {
            num = ''
            while (Text.endsWithNumber(txt))
            {
                num += txt.slice(-1)[0]
                txt = this.popChar(txt)
            }
            txt += '0x' + num
        }
        else
        {
            txt += '0x'
        }
        return txt
    }
}

export default Text;