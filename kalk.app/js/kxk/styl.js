var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var calculus, funcs, funcVar, listAssign, render, styl, subvars, vars

import kstr from "./kstr.js"
let unfillet = kstr.unfillet
let blockFillets = kstr.blockFillets

vars = {}
funcs = {}
funcVar = {}
listAssign = []

render = function (block, text, amps = [])
{
    var amp, assign, b, cb, childBlocks, f, funcName, funcValue, idt, joinFillets, resetFillet, varName, varValue

    if ((block.fillet[0] != null ? block.fillet[0].match : undefined) === '//')
    {
        return text
    }
    if ((block.fillet[1] != null ? block.fillet[1].match : undefined) === '=')
    {
        varName = (block.fillet[0] != null ? block.fillet[0].match : undefined)
        varValue = unfillet(calculus(subvars(block.fillet.slice(2))))
        vars[varName] = varValue
        return text
    }
    if ((block.fillet[1] != null ? block.fillet[1].match : undefined) === '()')
    {
        funcName = (block.fillet[0] != null ? block.fillet[0].match : undefined)
        if (funcs[funcName])
        {
            text += funcs[funcName]
            return text
        }
        funcValue = ''
        var list = _k_.list(block.blocks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            cb = list[_a_]
            funcValue = render(cb,funcValue,amps)
        }
        funcs[funcName] = funcValue
        return text
    }
    if ((block.fillet[1] != null ? block.fillet[1].match[0] : undefined) === '(')
    {
        funcName = (block.fillet[0] != null ? block.fillet[0].match : undefined)
        if (funcVar[funcName])
        {
            varValue = kstr.strip(unfillet(block.fillet.slice(1)),'()')
            vars[funcVar[funcName].var] = varValue
            var list1 = _k_.list(funcVar[funcName].blocks)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                cb = list1[_b_]
                text += render(cb,'')
            }
            delete vars[funcVar[funcName].var]
            return text
        }
        funcVar[funcName] = {blocks:block.blocks,var:block.fillet[2].match}
        return text
    }
    var list2 = _k_.list(block.fillet)
    for (var _c_ = 0; _c_ < list2.length; _c_++)
    {
        f = list2[_c_]
        if (f.match === '{' && _k_.last(block.fillet).match === '}')
        {
            text += unfillet(block.fillet)
            text += '\n'
            return text
        }
    }
    idt = _k_.rpad(block.indent)
    if (!_k_.empty(block.blocks))
    {
        joinFillets = function (lhs, rhs)
        {
            var offset

            offset = _k_.last(lhs).index + _k_.last(lhs).length - 1
            return lhs.concat(rhs.map(function (f)
            {
                var c

                c = _k_.copy(f)
                c.index += offset
                return c
            }))
        }
        resetFillet = function (f)
        {
            var c, offset

            c = _k_.copy(f)
            offset = f[0].index
            return c.map(function (i)
            {
                i.index -= offset
                return i
            })
        }
        childBlocks = block.blocks.filter(function (cb)
        {
            if ((cb.fillet[0] != null ? cb.fillet[0].match[0] : undefined) === '&')
            {
                cb.fillet[0].match = cb.fillet[0].match.slice(1)
                if (!_k_.empty(listAssign))
                {
                    cb.assign = listAssign.map(function (la)
                    {
                        return unfillet(la) + unfillet(cb.fillet)
                    })
                }
                cb.fillet = joinFillets(block.fillet,resetFillet(cb.fillet))
                amps.push(cb)
                return false
            }
            else
            {
                return true
            }
        })
        if (idt === '')
        {
            while (assign = listAssign.shift())
            {
                text += '\n' + unfillet(assign) + ','
            }
        }
        text += '\n' + idt + unfillet(block.fillet)
        text += '\n' + idt + '{'
        var list3 = _k_.list(childBlocks)
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            b = list3[_d_]
            text += render(b,'')
        }
        text += '\n' + idt + '}\n'
    }
    else
    {
        text += '\n'
        if (idt === '')
        {
            listAssign.push(block.fillet)
        }
        else
        {
            text += idt + block.fillet[0].match + ': ' + unfillet(calculus(subvars(block.fillet.slice(1))))
            text += ';'
        }
    }
    while (amp = amps.shift())
    {
        amp.indent = 0
        var list4 = _k_.list(amp.blocks)
        for (var _e_ = 0; _e_ < list4.length; _e_++)
        {
            block = list4[_e_]
            block.indent = 4
        }
        if (amp.assign)
        {
            while (assign = amp.assign.shift())
            {
                text += '\n' + assign + ','
            }
        }
        text += render(amp,'')
    }
    return text
}

subvars = function (fillets)
{
    var fillet, value

    fillets = _k_.clone(fillets)
    var list = _k_.list(fillets)
    for (var _f_ = 0; _f_ < list.length; _f_++)
    {
        fillet = list[_f_]
        if (value = vars[fillet.match])
        {
            fillet.match = value
        }
    }
    return fillets
}

calculus = function (fillets)
{
    var fillet, index, lhs, lhu, result, rhs, rhu, unit

    var list = _k_.list(fillets)
    for (index = 0; index < list.length; index++)
    {
        fillet = list[index]
        if (index === 0)
        {
            if (_k_.in(fillet.match,'+-'))
            {
                rhs = parseFloat(fillets[index + 1].match)
                rhu = _k_.trim(fillets[index + 1].match.slice((`${rhs}`).length))
                fillets.splice(index,2,{match:fillet.match + rhs + rhu})
                return calculus(fillets)
            }
            if (fillet.match[0] === '-')
            {
                if (vars[fillet.match.slice(1)])
                {
                    fillets.splice(index,1,{match:'-' + vars[fillet.match.slice(1)]})
                    return calculus(fillets)
                }
            }
        }
        if (_k_.in(fillet.match,'*+-/'))
        {
            lhs = parseFloat(fillets[index - 1].match)
            rhs = parseFloat(fillets[index + 1].match)
            if (_k_.isNum(lhs) && _k_.isNum(rhs))
            {
                lhu = _k_.trim(fillets[index - 1].match.slice((`${lhs}`).length))
                rhu = _k_.trim(fillets[index + 1].match.slice((`${rhs}`).length))
                unit = (!_k_.empty(lhu) ? lhu : rhu)
                result = eval(`${lhs} ${fillet.match} ${rhs}`)
                result += unit
                fillets.splice(index - 1,3,{match:result})
                return calculus(fillets)
            }
        }
    }
    return fillets
}

styl = function (srcText)
{
    var block, blocks, lines, tgtText

    vars = {}
    funcs = {}
    funcVar = {}
    listAssign = []
    tgtText = ''
    lines = srcText.split('\n')
    blocks = blockFillets(lines.map(function (line)
    {
        return kstr.fillet(line,'-.')
    }))
    var list = _k_.list(blocks)
    for (var _11_ = 0; _11_ < list.length; _11_++)
    {
        block = list[_11_]
        tgtText = render(block,tgtText)
    }
    return tgtText
}
export default styl;