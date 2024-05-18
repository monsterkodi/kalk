var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.R1=_k_.k.B256(_k_.k.R(1));_k_.R2=_k_.k.B256(_k_.k.R(2));_k_.r3=_k_.k.F256(_k_.k.r(3));_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g1=_k_.k.F256(_k_.k.g(1));_k_.G1=_k_.k.B256(_k_.k.G(1));_k_.g3=_k_.k.F256(_k_.k.g(3));_k_.y2=_k_.k.F256(_k_.k.y(2));_k_.y3=_k_.k.F256(_k_.k.y(3));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.y6=_k_.k.F256(_k_.k.y(6));_k_.y8=_k_.k.F256(_k_.k.y(8));_k_.W1=_k_.k.B256(_k_.k.W(1));_k_.w2=_k_.k.F256(_k_.k.w(2))

var allfails, allsuccs, comps, fail, fails, file, files, stack, succs, test, tester

import klor from "../kxk/klor.js"
import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"
import fs from "../kxk/fs.js"

import print from "./print.js"

klor.globalize()
comps = 0
succs = 0
fails = []
stack = []
allfails = []
allsuccs = 0
class Tester
{
    constructor ()
    {
        this.test = this.test.bind(this)
        this.compare = this.compare.bind(this)
        this.section = this.section.bind(this)
    }

    section (t, f)
    {
        var depth

        stack.push(t)
        comps = 0
        depth = stack.length
        if (this.logSections !== false)
        {
            console.log(_k_.W1(_k_.lpad(depth * 3 - 1) + ' ' + global[`g${_k_.max(1,8 - 2 * depth)}`](_k_.rpad(34 - depth * 3,t) + ' ')))
        }
        try
        {
            f()
        }
        catch (err)
        {
            console.log(err)
            fails.push({stack:stack.concat([comps]),comps:comps,lhs:`${err}`,rhs:''})
        }
        return stack.pop()
    }

    sameObjects (a, b, keystack)
    {
        var i, sameKeys, sameVals

        if (Object.is(a,b))
        {
            return true
        }
        else if (typeof(a) !== typeof(b))
        {
            return false
        }
        else if (_k_.isArr(a) && _k_.isArr(b))
        {
            if (a.length !== b.length)
            {
                return false
            }
            for (var _a_ = i = 0, _b_ = a.length; (_a_ <= _b_ ? i < a.length : i > a.length); (_a_ <= _b_ ? ++i : --i))
            {
                if (!this.sameObjects(a[i],b[i]))
                {
                    return false
                }
            }
            return true
        }
        else if (_k_.isStr(a) && _k_.isStr(b))
        {
            if (a !== b)
            {
                console.log(_k_.r5(this.showSpace(a)))
                console.log(_k_.g3(this.showSpace(b)))
                return false
            }
            return true
        }
        else if (_k_.isObj(a) && _k_.isObj(b))
        {
            sameKeys = this.sameObjects(Object.keys(a),Object.keys(b))
            sameVals = this.sameObjects(Object.values(a),Object.values(b))
            return sameKeys && sameVals
        }
        return a === b
    }

    compare (a, b)
    {
        var ind

        comps++
        if (typeof(b) === 'function')
        {
            if (b(a))
            {
                succs++
                return
            }
        }
        if (this.sameObjects(a,b))
        {
            succs++
            return
        }
        ind = _k_.lpad((stack.length + 1) * 3)
        console.log(_k_.R1(black(ind + comps + ' ')) + ' ' + _k_.r5(this.short(a)) + ' ' + _k_.R1(_k_.r4(' ▸ ')) + ' ' + _k_.g1(this.short(b)))
        return fails.push({stack:stack.concat([comps]),comps:comps,lhs:a,rhs:b})
    }

    test (testModule)
    {
        var logModules

        if ((testModule != null ? testModule._test_ : undefined) !== true)
        {
            return
        }
        comps = 0
        succs = 0
        fails = []
        stack = []
        global.compare = this.compare
        global.section = this.section
        logModules = this.logModules
        ;        (function (o) {
            var r = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (k, v)
            {
                if (v._section_)
                {
                    stack.push(k)
                    if (logModules !== false)
                    {
                        console.log(_k_.G1(_k_.y8(' ' + _k_.rpad(33,k) + ' ')))
                    }
                    try
                    {
                        v()
                    }
                    catch (err)
                    {
                        console.log(err)
                        fails.push({comps:comps,lhs:`${err}`,rhs:''})
                    }
                    return stack.pop()
                }
            })(k, o[k])
                if (m != null && m[0] != null)
                {
                    r[m[0]] = m[1]
                }
            }
            return typeof o == 'string' ? r.join('') : r
        })(testModule)
        allsuccs += succs
        allfails = allfails.concat(fails)
        return _k_.empty(fails)
    }

    showSpace (s)
    {
        if (!(_k_.isStr(s)))
        {
            return _k_.noon(s)
        }
        return s.split('\n').map(function (l)
        {
            return l + _k_.w2('◂')
        }).join('\n')
    }

    summarize ()
    {
        var fail, summary

        var list = _k_.list(allfails)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            fail = list[_a_]
            console.log(_k_.R2(_k_.y5(' ' + fail.stack[0] + ' ')) + _k_.R1(_k_.y5(' ' + fail.stack.slice(1).join(_k_.r3(' ▸ ')) + ' ')))
            console.log(_k_.r5(this.showSpace(fail.lhs)))
            console.log(_k_.R1(_k_.r3(' ▸ ')))
            console.log(_k_.g3(this.showSpace(fail.rhs)))
        }
        if (allsuccs || fails.length)
        {
            summary = _k_.w2(kstr.now() + ' ')
            if (!_k_.empty(allfails))
            {
                summary += _k_.R2(_k_.y2(' ✘ ') + _k_.y6(allfails.length) + _k_.y3(' failure' + ((allfails.length > 1 ? 's ' : ' '))))
            }
            else if (allsuccs)
            {
                summary += _k_.g3(" ✔ ") + _k_.g1(allsuccs) + ' '
            }
            console.log(summary)
        }
        allfails = []
        return allsuccs = 0
    }

    short (s)
    {
        var l, split, ss

        if (_k_.empty(s))
        {
            return s
        }
        split = ('' + s).split('\n')
        l = 0
        split = (function (o) {
            var r_a_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                if (!_k_.empty(v))
                {
                    return v = '' + v
                }
            })(o[k])
                if (m != null)
                {
                    r_a_[k] = m
                }
            }
            return typeof o == 'string' ? r_a_.join('') : r_a_
        })(split)
        split = split.filter(function (s)
        {
            return s.length
        })
        ss = split.join(_k_.w2('➜ '))
        return ss
    }
}

export default new Tester;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    files = await fs.list(slash.path(_k_.dir(),'test'))
    fail = false
    var list = _k_.list(files)
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    file = list[_a_]
    if (slash.name(file.path) === 'utils')
    {
        continue
    }
    test = await import(file.path)
    tester = new Tester
    fail = fail || !tester.test(test.default)
}
    if (fail)
{
    process.exit(1)
}
}