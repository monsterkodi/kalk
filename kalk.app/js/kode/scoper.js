var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

class Scoper
{
    constructor (kode)
    {
        this.kode = kode
    
        this.verbose = this.kode.args.verbose
        this.debug = this.kode.args.debug
        this.raw = this.kode.args.raw
    }

    collect (tl)
    {
        this.maps = []
        this.args = []
        this.vars = []
        this.scope(tl)
        return tl
    }

    scope (body)
    {
        var e

        this.maps.push({})
        this.args.push({})
        this.vars.push(body.vars)
        var list = _k_.list(body.exps)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            e = list[_a_]
            this.exp(e)
        }
        this.maps.pop()
        this.args.pop()
        this.vars.pop()
        return body
    }

    func (f)
    {
        var arg, e, t, _62_25_, _65_37_, _65_42_, _68_72_, _68_77_, _70_30_

        this.maps.push({})
        this.args.push({})
        this.vars.push(f.body.vars)
        var list = _k_.list((f.args != null ? f.args.parens.exps : undefined))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            arg = list[_a_]
            if (t = arg.text)
            {
                this.args.slice(-1)[0][t] = t
            }
            else if (t = ((_65_37_=arg.operation) != null ? (_65_42_=_65_37_.lhs) != null ? _65_42_.text : undefined : undefined))
            {
                this.args.slice(-1)[0][t] = t
            }
            else
            {
                if (((_68_72_=arg.prop) != null ? (_68_77_=_68_72_.obj) != null ? _68_77_.text : undefined : undefined) !== '@')
                {
                    this.verb('todo: scoper handle complex arg?',arg)
                }
            }
        }
        var list1 = _k_.list((f.body != null ? f.body.exps : undefined))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            e = list1[_b_]
            this.exp(e)
        }
        this.maps.pop()
        this.args.pop()
        this.vars.pop()
        return f
    }

    exp (e)
    {
        var fv, insert, key, keyval, op, v, val, _105_29_, _116_25_, _121_37_, _121_45_

        if (!e)
        {
            return
        }
        insert = (function (v, t)
        {
            var arg, map

            var list = _k_.list(this.maps)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                map = list[_a_]
                if (map[v])
                {
                    return
                }
            }
            var list1 = _k_.list(this.args)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                arg = list1[_b_]
                if (arg[v])
                {
                    return
                }
            }
            this.verb(yellow(v),red(t))
            this.vars.slice(-1)[0].push({text:v,type:t})
            return this.maps.slice(-1)[0][v] = t
        }).bind(this)
        if (e.type)
        {
            if (e.type === 'code')
            {
                this.exp(e.exps)
            }
            return
        }
        else if (e instanceof Array)
        {
            if (e.length)
            {
                var list = _k_.list(e)
                for (var _c_ = 0; _c_ < list.length; _c_++)
                {
                    v = list[_c_]
                    this.exp(v)
                }
            }
        }
        else if (e instanceof Object)
        {
            if (op = e.operation)
            {
                if (op.operator.text === '=')
                {
                    if ((op.lhs != null ? op.lhs.text : undefined))
                    {
                        insert(op.lhs.text,op.operator.text)
                    }
                    else if (op.lhs.object)
                    {
                        var list1 = _k_.list(op.lhs.object.keyvals)
                        for (var _d_ = 0; _d_ < list1.length; _d_++)
                        {
                            keyval = list1[_d_]
                            if (keyval.type === 'var')
                            {
                                insert(keyval.text,'curly')
                            }
                        }
                    }
                    else if (op.lhs.array)
                    {
                        var list2 = _k_.list(op.lhs.array.items)
                        for (var _e_ = 0; _e_ < list2.length; _e_++)
                        {
                            val = list2[_e_]
                            if (val.type === 'var')
                            {
                                insert(val.text,'array')
                            }
                        }
                    }
                }
            }
            if (fv = (e.for != null ? e.for.vals : undefined))
            {
                if (fv.text)
                {
                    insert(fv.text,'for')
                }
                else
                {
                    var list3 = ((_121_45_=(fv.array != null ? fv.array.items : undefined)) != null ? _121_45_ : e.for.vals)
                    for (var _f_ = 0; _f_ < list3.length; _f_++)
                    {
                        v = list3[_f_]
                        if (v.text)
                        {
                            insert(v.text,'for')
                        }
                    }
                }
            }
            if (e.assert)
            {
                this.verb('assert',e)
                if (e.assert.obj.type !== 'var' && !e.assert.obj.index)
                {
                    insert(`_${e.assert.qmrk.line}_${e.assert.qmrk.col}_`,'?.')
                }
            }
            if (e.qmrkop)
            {
                this.verb('qmrkop',e)
                if (e.qmrkop.lhs.type !== 'var')
                {
                    insert(`_${e.qmrkop.qmrk.line}_${e.qmrkop.qmrk.col}_`,' ? ')
                }
            }
            if (e.function)
            {
                insert(e.function.name.text)
            }
            if (e.func)
            {
                this.func(e.func)
            }
            else
            {
                for (key in e)
                {
                    val = e[key]
                    this.exp(val)
                }
            }
        }
        return
    }

    verb ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }
}

export default Scoper;