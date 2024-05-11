var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

class Text
{
    static balance (txt)
    {
        var c, o

        o = 0
        var list = _k_.list(txt)
        for (var _14_14_ = 0; _14_14_ < list.length; _14_14_++)
        {
            c = list[_14_14_]
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

    static numbers = ['0','1','2','3','4','5','6','7','8','9']

    static constants = [symbol.euler,'π','ϕ','°']

    static ops = ['+','-','/','*','^','(']

    static unfinished = ['.','+','-','/','*','^','(']

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
        for (var _48_14_ = 0; _48_14_ < list.length; _48_14_++)
        {
            c = list[_48_14_]
            if (txt.endsWith(c))
            {
                return true
            }
        }
        return false
    }

    static popChar (txt)
    {
        return txt.substr(0,txt.length - 1)
    }

    static isInteger (txt)
    {
        return /\d+/.test(txt)
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
        if (this.endsWith(txt,['0']) && !(this.endsWith(popped,['.']) || this.endsWithNumber(popped)))
        {
            return popped
        }
        else
        {
            return txt
        }
    }
}

export default Text;