var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var pretty


pretty = (function ()
{
    function pretty ()
    {}

    pretty["age"] = function (dateOrString, opt = {})
    {
        var date, diff, key, levels, s, sec, time, val, _19_28_

        levels = ((_19_28_=opt.levels) != null ? _19_28_ : 1)
        if (_k_.isStr(dateOrString))
        {
            date = new Date(Date.parse(dateOrString))
        }
        else
        {
            date = new Date(dateOrString)
        }
        diff = Date.now() - date.valueOf()
        sec = parseInt(diff / 1000)
        time = {year:Math.floor(sec / (60 * 60 * 24 * 30 * 12)),month:Math.floor(sec / (60 * 60 * 24 * 30) % 12),day:Math.floor(sec / (60 * 60 * 24) % 30),hour:Math.floor(sec / (60 * 60) % 24),minute:Math.floor(sec / 60 % 60),second:Math.floor(sec % 60)}
        s = []
        for (key in time)
        {
            val = time[key]
            if (val === 0)
            {
                if (s.length)
                {
                    return s[0]
                }
            }
            else
            {
                s.push(`${val} ${this.deplural(key + 's',val)}`)
            }
            if (s.length === levels)
            {
                return s.join(' ')
            }
        }
        if (_k_.empty(s))
        {
            return '0 seconds'
        }
        else
        {
            return s.join(' ')
        }
    }

    pretty["bytes"] = function (bytes)
    {
        var exponent, number, numStr, UNITS

        number = Math.abs(parseInt(bytes))
        if (!(_k_.isNum(number)) || number === 0)
        {
            return '0 bytes'
        }
        UNITS = ['bytes','kB','MB','GB','TB']
        exponent = Math.min(Math.floor(Math.log10(number) / 3),UNITS.length - 1)
        number /= Math.pow(1000,exponent)
        numStr = this.number(number,{decimals:0})
        return numStr + ' ' + this.deplural(UNITS[exponent],numStr)
    }

    pretty["number"] = function (number, opt = {})
    {
        var decimals, prune, ps, _81_32_, _84_32_

        decimals = ((_81_32_=opt.decimals) != null ? _81_32_ : 1)
        prune = ((_84_32_=opt.prune) != null ? _84_32_ : true)
        ps = number.toFixed(decimals)
        if (prune && decimals)
        {
            while (ps.slice(-1)[0] === '0')
            {
                ps = ps.slice(0, -1)
            }
            if (ps.slice(-1)[0] === '.')
            {
                ps = ps.slice(0, -1)
            }
        }
        return ps
    }

    pretty["deplural"] = function (plural, num)
    {
        if (parseInt(num) === 1 && plural.slice(-1)[0] === 's')
        {
            return plural.slice(0, -1)
        }
        else
        {
            return plural
        }
    }

    pretty["shortCount"] = function (num)
    {
        var v

        v = parseInt(num)
        if (v > 999999)
        {
            return `${Math.floor(v / 1000000)}M`
        }
        else if (v > 999)
        {
            return `${Math.floor(v / 1000)}k`
        }
        else
        {
            return `${v}`
        }
    }

    return pretty
})()

export default pretty;