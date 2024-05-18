var _k_ = {noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var ESCAPE_REGEXP, str, STRIPANSI

import ansi from "./ansi.js"


str = function (o)
{
    if (!(o != null))
    {
        return 'null'
    }
    return _k_.noon(o)
}

str.fillet = function (s, wordCharacterSet = '')
{
    var ch, ci, fillet, fillets, isWord

    fillets = []
    if (!(_k_.isStr(s)))
    {
        return fillets
    }
    for (var _a_ = ci = 0, _b_ = s.length; (_a_ <= _b_ ? ci < s.length : ci > s.length); (_a_ <= _b_ ? ++ci : --ci))
    {
        ch = s[ci]
        if (_k_.in(ch,' \t\n\r'))
        {
            if (!_k_.empty(fillet))
            {
                fillets.push(fillet)
            }
            fillet = null
            continue
        }
        isWord = /\w/.test(ch) || _k_.in(ch,wordCharacterSet)
        if ((fillet != null ? fillet.word : undefined) === isWord)
        {
            fillet.match += ch
            fillet.length++
        }
        else
        {
            if (!_k_.empty(fillet))
            {
                fillets.push(fillet)
            }
            fillet = {match:ch,index:ci,length:1,word:isWord}
        }
    }
    if (!_k_.empty(fillet))
    {
        fillets.push(fillet)
    }
    return fillets
}

str.unfillet = function (fillets)
{
    var fillet, s

    s = ''
    var list = _k_.list(fillets)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        fillet = list[_c_]
        s = _k_.rpad(fillet.index,s)
        s += fillet.match
    }
    return _k_.trim(s)
}

str.blockFillets = function (lineFillets)
{
    var block, blocks, fillet, indent, lineIndex, stack, stackTop

    blocks = []
    stack = []
    var list = _k_.list(lineFillets)
    for (lineIndex = 0; lineIndex < list.length; lineIndex++)
    {
        fillet = list[lineIndex]
        if (_k_.empty(fillet))
        {
            continue
        }
        indent = (fillet[0] != null ? fillet[0].index : undefined)
        block = {line:lineIndex,indent:indent,fillet:fillet,blocks:[]}
        if (stackTop = _k_.last(stack))
        {
            if (indent > stackTop.indent)
            {
                stackTop.blocks.push(block)
            }
            else if (indent === stackTop.indent)
            {
                stack.pop()
                if (stackTop = _k_.last(stack))
                {
                    stackTop.blocks.push(block)
                }
                else
                {
                    blocks.push(block)
                }
            }
            else
            {
                while (!_k_.empty((stack)) && indent <= _k_.last(stack).indent)
                {
                    stack.pop()
                }
                if (stackTop = _k_.last(stack))
                {
                    stackTop.blocks.push(block)
                }
                else
                {
                    blocks.push(block)
                }
            }
        }
        else
        {
            blocks.push(block)
            stack.pop()
        }
        stack.push(block)
    }
    return blocks
}

str.splice = function (s, i, c, r = '')
{
    return s.slice(0,i) + r + s.slice(i + Math.abs(c))
}

str.encode = function (s, spaces = true)
{
    var r

    if (s)
    {
        r = encodeURI(s)
        if (spaces)
        {
            r = r.replace(/\s/g,'&nbsp;')
        }
        return r
    }
    else
    {
        return ''
    }
}
ESCAPE_REGEXP = /[\-\\\^\$\*\+\?\.\(\)\|\[\]\{\}\/]/g

str.escapeRegexp = function (s)
{
    return s.replace(ESCAPE_REGEXP,'\\$&')
}

str.escapeRegExp = function (s)
{
    return s.replace(ESCAPE_REGEXP,'\\$&')
}

str.rstrip = function (s, cs = ' ')
{
    s = (s != null ? s : '')
    while (_k_.in(s.slice(-1)[0],cs))
    {
        s = s.slice(0, s.length - 1)
    }
    return s
}

str.lstrip = function (s, cs = ' ')
{
    s = (s != null ? s : '')
    while (_k_.in(s[0],cs))
    {
        s = s.slice(1)
    }
    return s
}

str.strip = function (s, cs = ' ')
{
    return str.rstrip(str.lstrip(s,cs),cs)
}
str.trim = str.strip
str.ltrim = str.lstrip
str.rtrim = str.rstrip

str.lcnt = function (s, c)
{
    var i

    s = (s != null ? s : '')
    if (typeof(s) === 'number' && Number.isFinite(s))
    {
        s = String(s)
    }
    if (typeof(s) !== 'string')
    {
        return 0
    }
    c = (c != null ? c : '')
    i = -1
    while (_k_.in(s[++i],c))
    {
    }
    return i
}

str.rcnt = function (s, c)
{
    var i

    s = (s != null ? s : '')
    if (typeof(s) === 'number' && Number.isFinite(s))
    {
        s = String(s)
    }
    if (typeof(s) !== 'string')
    {
        return 0
    }
    c = (c != null ? c : '')
    i = -1
    while (_k_.in(s[s.length - (++i) - 1],c))
    {
    }
    return i
}

str.cnt = function (s, c)
{
    var m

    m = s.match(new RegExp(c,'g'))
    return ((m != null) ? m.length : 0)
}

str.lpad = function (s, l, c = ' ')
{
    s = String(s)
    while (s.length < l)
    {
        s = c + s
    }
    return s
}

str.rpad = function (s, l, c = ' ')
{
    s = String(s)
    while (s.length < l)
    {
        s += c
    }
    return s
}
str.pad = str.rpad

str.detab = function (s)
{
    var i

    s = String(s)
    i = 0
    while (i < s.length)
    {
        if (s[i] === '\t')
        {
            s = s.slice(0, typeof i === 'number' ? i : -1) + (str.lpad('',4 - (i % 4))) + s.slice(i + 1)
        }
        i += 1
    }
    return s
}

str.time = function (t)
{
    var f, k, num, o, thsnd

    switch (typeof(t))
    {
        case 'number':
            f = 1
            o = {ms:1000,second:60,minute:60,hour:24,day:30,month:12,year:0}
            var list = _k_.list(Object.keys(o))
            for (var _e_ = 0; _e_ < list.length; _e_++)
            {
                k = list[_e_]
                num = parseInt(t / f)
                f *= o[k]
                if (k === 'year' || t < f)
                {
                    if (k !== 'ms' && num !== 1)
                    {
                        k += 's'
                    }
                    return '' + num + ' ' + k
                }
            }
            break
        case 'bigint':
            thsnd = BigInt(1000)
            f = thsnd
            var list1 = ['ns','μs','ms','second']
            for (var _f_ = 0; _f_ < list1.length; _f_++)
            {
                k = list1[_f_]
                if (k === 'seconds' || t < f)
                {
                    num = parseInt(thsnd * t / f)
                    if (k === 'second' && num !== 1)
                    {
                        k += 's'
                    }
                    return '' + num + ' ' + k
                }
                f *= thsnd
            }
            break
        default:
            return String(t)
    }

}

str.now = function ()
{
    var now

    now = new Date(Date.now())
    return `${str.lpad(now.getHours(),2,'0')}:${str.lpad(now.getMinutes(),2,'0')}:${str.lpad(now.getSeconds(),2,'0')}.${str.lpad(now.getMilliseconds(),3,'0')}`
}
STRIPANSI = /\x1B[[(?);]{0,2}(;?\d)*./g

str.stripAnsi = function (s)
{
    var _305_13_

    return (typeof s.replace === "function" ? s.replace(STRIPANSI,'') : undefined)
}

str.ansi2html = function (s)
{
    return ansi.html(s)
}
str.ansi = ansi
export default str;