var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var pepe


pepe = function (str, delimiters = [['"','"'],["'","'"],['(',')'],['[',']'],['{','}']])
{
    var advance, cnt, contentPush, end, ends, isGreedy, lp, next, op, p, pairs, popped, r, stack, start, starts

    if (!(_k_.isStr(str)))
    {
        return []
    }
    if (_k_.empty(str))
    {
        return ['']
    }
    starts = delimiters.map(function (d)
    {
        return d[0]
    })
    ends = delimiters.map(function (d)
    {
        return d[1]
    })
    pairs = {}
    delimiters.map(function (d)
    {
        return pairs[d[0]] = d[1]
    })
    stack = [{content:[]}]
    p = lp = 0
    isGreedy = function ()
    {
        return _k_.last(stack).start && pairs[_k_.last(stack).start] === _k_.last(stack).start
    }
    contentPush = function ()
    {
        if (lp !== p)
        {
            return _k_.last(stack).content.push(str.slice(lp, typeof p === 'number' ? p : -1))
        }
    }
    advance = function ()
    {
        return lp = p += start.length
    }
    while (p < str.length)
    {
        next = str.slice(p)
        op = p
        var list = _k_.list(starts)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            start = list[_a_]
            if (next.startsWith(start))
            {
                if (start === pairs[_k_.last(stack).start])
                {
                    break
                }
                if (isGreedy())
                {
                    break
                }
                contentPush()
                stack.push({start:start,content:[]})
                advance(start.length)
                break
            }
        }
        if (p === op)
        {
            if (isGreedy() && !next.startsWith(pairs[_k_.last(stack).start]))
            {
                contentPush()
                cnt = _k_.last(stack).content.pop() || ''
                _k_.last(stack).content.push(cnt + next[0])
                advance(1)
            }
            else
            {
                var list1 = _k_.list(ends)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    end = list1[_b_]
                    if (next.startsWith(end))
                    {
                        if (end === pairs[_k_.last(stack).start])
                        {
                            contentPush()
                            _k_.last(stack).end = end
                            popped = stack.pop()
                            _k_.last(stack).content.push(popped)
                            advance(end.length)
                        }
                        else
                        {
                            contentPush()
                            return {mismatch:stack,tail:str.slice(p, typeof str.length === 'number' ? str.length : -1)}
                        }
                        break
                    }
                }
            }
        }
        if (p === op)
        {
            p += 1
        }
    }
    if (stack.length > 1)
    {
        r = {unbalanced:stack}
        if (lp !== p)
        {
            r.tail = str.slice(lp, typeof p === 'number' ? p : -1)
        }
        return r
    }
    contentPush()
    return _k_.last(stack).content
}

pepe.depepe = function (pep, cb)
{
    var p, r

    r = ''
    var list = _k_.list(pep)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        p = list[_c_]
        if (_k_.isStr(p))
        {
            r += p
        }
        else
        {
            r += p.start
            r += cb(pepe.depepe(p.content,cb))
            r += p.end
        }
    }
    return r
}
export default pepe;