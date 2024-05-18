var _k_ = {isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isFunc: function (o) {return typeof o === 'function'}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Krzl


Krzl = (function ()
{
    function Krzl (opt)
    {
        var _24_31_, _25_41_

        if (_k_.isArr(opt))
        {
            opt = {values:opt}
        }
        else
        {
            opt = (opt != null ? opt : {})
        }
        this.values = opt.values
        this.weight = opt.weight
        this.extract = ((_24_31_=opt.extract) != null ? _24_31_ : function (i)
        {
            return i
        })
        this.sortByLength = ((_25_41_=opt.sortByLength) != null ? _25_41_ : true)
    }

    Krzl.prototype["match"] = function (abbrv, exstr)
    {
        var ac, ai, ec, ei, indices

        if (_k_.isStr(abbrv) && _k_.isStr(exstr))
        {
            ai = 0
            ei = 0
            indices = []
            while (ai < abbrv.length && ei < exstr.length)
            {
                ac = abbrv[ai]
                ec = exstr[ei]
                if (ac === ec)
                {
                    indices.push(ei)
                    ai++
                    ei++
                    continue
                }
                ei++
            }
            if (ai === abbrv.length)
            {
                return {extract:exstr,indices:indices}
            }
        }
        return null
    }

    Krzl.prototype["sort"] = function (pairs)
    {
        return pairs.sort((function (a, b)
        {
            return this.calcWeight(a) - this.calcWeight(b)
        }).bind(this))
    }

    Krzl.prototype["calcWeight"] = function (pair)
    {
        var e, info, lengthOffset, value, w

        var _a_ = pair; value = _a_[0]; info = _a_[1]

        e = 0.00001
        w = e
        if (_k_.isFunc(this.weight))
        {
            w = this.weight(value,info)
            if (!(_k_.isNum(w)) || w < e)
            {
                w = e
            }
        }
        lengthOffset = (this.sortByLength ? 1 - 1 / info.extract.length : 0)
        return (1 / w) * (info.indices[0] + lengthOffset)
    }

    Krzl.prototype["filter"] = function (abbrv)
    {
        var mi, pairs, value

        if (_k_.empty(abbrv))
        {
            console.warn('krzl.filter without abbreviation?')
            return []
        }
        if (_k_.empty(this.values))
        {
            console.warn('krzl.filter without @values?')
            return []
        }
        if (!(_k_.isStr(abbrv)))
        {
            console.warn('krzl.filter abbreviation not a string?')
            return []
        }
        if (!(_k_.isArr(this.values)))
        {
            console.warn('krzl.filter @values not an array?')
            return []
        }
        pairs = []
        var list = _k_.list(this.values)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            value = list[_a_]
            if (mi = this.match(abbrv.toLowerCase(),this.extract(value).toLowerCase()))
            {
                pairs.push([value,mi])
            }
        }
        this.sort(pairs)
        return pairs.map(function (p)
        {
            return p[0]
        })
    }

    return Krzl
})()

export default Krzl;