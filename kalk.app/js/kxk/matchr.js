var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var config, dissect, merge, ranges, sortRanges


config = function (patterns, flags)
{
    var a, p

    return (function () { var r_a_ = []; for (var p in patterns)  { var a = patterns[p];r_a_.push([new RegExp(p,flags),a])  } return r_a_ }).bind(this)()
}

sortRanges = function (rgs)
{
    return rgs.sort(function (a, b)
    {
        if (a.start === b.start)
        {
            return a.index - b.index
        }
        else
        {
            return a.start - b.start
        }
    })
}

ranges = function (regexes, text, flags)
{
    var arg, gi, gs, i, j, match, r, reg, rgs, s, value, _68_35_

    if (!(regexes instanceof Array))
    {
        if (_k_.isStr(regexes))
        {
            regexes = [[new RegExp(regexes,flags),'found']]
        }
        else
        {
            regexes = [[regexes,'found']]
        }
    }
    else if (!_k_.empty((regexes)) && !(regexes[0] instanceof Array))
    {
        regexes = [regexes]
    }
    rgs = []
    if (!(text != null) || _k_.empty(regexes))
    {
        return rgs
    }
    for (var _b_ = r = 0, _c_ = regexes.length; (_b_ <= _c_ ? r < regexes.length : r > regexes.length); (_b_ <= _c_ ? ++r : --r))
    {
        reg = regexes[r][0]
        if (!(reg != null) || !(reg.exec != null))
        {
            console.error('no reg?',regexes,text,flags)
            return rgs
        }
        arg = regexes[r][1]
        i = 0
        s = text
        while (s.length)
        {
            match = reg.exec(s)
            if (!(match != null))
            {
                break
            }
            if (match.length === 1)
            {
                if (match[0].length > 0)
                {
                    rgs.push({start:match.index + i,match:match[0],clss:arg,index:r})
                }
                i += match.index + Math.max(1,match[0].length)
                s = text.slice(i)
            }
            else
            {
                gs = 0
                for (var _d_ = j = 0, _e_ = match.length - 2; (_d_ <= _e_ ? j <= match.length - 2 : j >= match.length - 2); (_d_ <= _e_ ? ++j : --j))
                {
                    value = arg
                    if (value instanceof Array && j < value.length)
                    {
                        value = value[j]
                    }
                    else if (_k_.isObj(value) && j < Object.keys(value).length)
                    {
                        value = [Object.keys(value)[j],value[Object.keys(value)[j]]]
                    }
                    if (!(match[j + 1] != null))
                    {
                        break
                    }
                    gi = match[0].slice(gs).indexOf(match[j + 1])
                    rgs.push({start:match.index + i + gs + gi,match:match[j + 1],clss:value,index:r})
                    gs += match[j + 1].length
                }
                i += match.index + match[0].length
                s = text.slice(i)
            }
        }
    }
    return sortRanges(rgs)
}

dissect = function (ranges, opt = {join:false})
{
    var c, d, di, dps, i, p, pn, r, rg, ri, si, _167_22_, _168_36_, _170_48_

    if (!ranges.length)
    {
        return []
    }
    di = []
    var list = _k_.list(ranges)
    for (var _f_ = 0; _f_ < list.length; _f_++)
    {
        rg = list[_f_]
        di.push([rg.start,rg.index])
        di.push([rg.start + rg.match.length,rg.index])
    }
    di.sort(function (a, b)
    {
        if (a[0] === b[0])
        {
            return a[1] - b[1]
        }
        else
        {
            return a[0] - b[0]
        }
    })
    d = []
    si = -1
    var list1 = _k_.list(di)
    for (var _10_ = 0; _10_ < list1.length; _10_++)
    {
        dps = list1[_10_]
        if (dps[0] > si)
        {
            si = dps[0]
            d.push({start:si,cls:[]})
        }
    }
    p = 0
    for (var _11_ = ri = 0, _12_ = ranges.length; (_11_ <= _12_ ? ri < ranges.length : ri > ranges.length); (_11_ <= _12_ ? ++ri : --ri))
    {
        rg = ranges[ri]
        while (d[p].start < rg.start)
        {
            p += 1
        }
        pn = p
        while (d[pn].start < rg.start + rg.match.length)
        {
            if ((rg.clss != null))
            {
                if (!(rg.clss.split != null))
                {
                    var list2 = _k_.list(rg.clss)
                    for (var _13_ = 0; _13_ < list2.length; _13_++)
                    {
                        r = list2[_13_]
                        if (!((r != null ? r.split : undefined) != null))
                        {
                            continue
                        }
                        var list3 = _k_.list(r.split('.'))
                        for (var _14_ = 0; _14_ < list3.length; _14_++)
                        {
                            c = list3[_14_]
                            if (d[pn].cls.indexOf(c) < 0)
                            {
                                d[pn].cls.push(c)
                            }
                        }
                    }
                }
                else
                {
                    var list4 = _k_.list(rg.clss.split('.'))
                    for (var _15_ = 0; _15_ < list4.length; _15_++)
                    {
                        c = list4[_15_]
                        if (d[pn].cls.indexOf(c) < 0)
                        {
                            d[pn].cls.push(c)
                        }
                    }
                }
            }
            if (pn + 1 < d.length)
            {
                if (!d[pn].match)
                {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start,d[pn + 1].start - d[pn].start)
                }
                pn += 1
            }
            else
            {
                if (!d[pn].match)
                {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start)
                }
                break
            }
        }
    }
    d = d.filter(function (i)
    {
        var _185_31_

        return (i.match != null ? i.match.trim().length : undefined)
    })
    var list5 = _k_.list(d)
    for (var _16_ = 0; _16_ < list5.length; _16_++)
    {
        i = list5[_16_]
        i.clss = i.cls.join(' ')
        delete i.cls
    }
    if (d.length > 1)
    {
        for (var _17_ = i = d.length - 2, _18_ = 0; (_17_ <= _18_ ? i <= 0 : i >= 0); (_17_ <= _18_ ? ++i : --i))
        {
            if (d[i].start + d[i].match.length === d[i + 1].start)
            {
                if (d[i].clss === d[i + 1].clss)
                {
                    d[i].match += d[i + 1].match
                    d.splice(i + 1,1)
                }
            }
        }
    }
    return d
}

merge = function (dssA, dssB)
{
    var A, B, d, result

    result = []
    A = dssA.shift()
    B = dssB.shift()
    while (A && B)
    {
        if (A.start + A.match.length < B.start)
        {
            result.push(A)
            A = dssA.shift()
            continue
        }
        if (B.start + B.match.length < A.start)
        {
            result.push(B)
            B = dssB.shift()
            continue
        }
        if (A.start < B.start)
        {
            d = B.start - A.start
            result.push({start:A.start,clss:A.clss,match:A.match.slice(0,d)})
            A.start += d
            A.match = A.match.slice(d)
            continue
        }
        if (B.start < A.start)
        {
            d = A.start - B.start
            result.push({start:B.start,clss:B.clss,match:B.match.slice(0,d)})
            B.start += d
            B.match = B.match.slice(d)
            continue
        }
        if (A.start === B.start)
        {
            d = A.match.length - B.match.length
            result.push({start:A.start,clss:A.clss + " " + B.clss,match:d >= 0 && B.match || A.match})
            if (d > 0)
            {
                A.match = A.match.slice(B.match.length)
                A.start += B.match.length
                B = dssB.shift()
            }
            else if (d < 0)
            {
                B.match = B.match.slice(A.match.length)
                B.start += A.match.length
                A = dssA.shift()
            }
            else
            {
                A = dssA.shift()
                B = dssB.shift()
            }
        }
    }
    if (B && !A)
    {
        result = result.concat([B],dssB)
    }
    if (A && !B)
    {
        result = result.concat([A],dssA)
    }
    return result
}
export default {config:config,ranges:ranges,dissect:dissect,sortRanges:sortRanges,merge:merge}