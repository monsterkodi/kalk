var toExport = {}
var _k_

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["qmark"] = function ()
{
    section("nullcmp", function ()
    {
        compare(kc("a?"),";(a != null)")
        compare(kc("a.b.c?"),";(a.b.c != null)")
        compare(kc("a.b().c?"),";(a.b().c != null)")
        compare(kc("if a.b().c?"),"if ((a.b().c != null))\n{\n}")
        compare(kc("while l?"),"while ((l != null))\n{\n}")
        compare(kc("while l?.a"),"while ((l != null ? l.a : undefined))\n{\n}")
        compare(kc("@m?"),";(this.m != null)")
        compare(kc("-> m?"),`(function ()
{
    return (m != null)
})`)
        compare(kc("r.filter (m) -> m?"),`r.filter(function (m)
{
    return (m != null)
})`)
        compare(kc("matches = matches.filter (m) -> m[1]?"),`matches = matches.filter(function (m)
{
    return (m[1] != null)
})`)
    })
    section("?=", function ()
    {
        compare(kc("t.a ?= {}"),`t.a = ((_1_4_=t.a) != null ? _1_4_ : {})`)
        compare(kc("x = t.b ?= {}"),`x = t.b = ((_1_8_=t.b) != null ? _1_8_ : {})`)
    })
    section("qmrkcolon", function ()
    {
        compare(kc("a ? b : c"),`;(a ? b : c)`)
        compare(kc("x = a ? b : c"),`x = (a ? b : c)`)
        compare(kc("x = a == 1 ? b : c"),`x = (a === 1 ? b : c)`)
        compare(kc("x = a and d ? b or e : not c"),`x = (a && d ? b || e : !c)`)
        compare(kc("x = a() and d.e ? b[1] or e : not c f"),`x = (a() && d.e ? b[1] || e : !c(f))`)
        compare(kc("false ? 1 : 2"),";(false ? 1 : 2)")
        compare(ke("false ? 1 : 2"),2)
        compare(kc("null ? a: 'b'"),";(null != null ? null : {a:'b'})")
        compare(ke("null ? a: 'b'"),{a:'b'})
        compare(kc("true or false ? a:'b' : 666"),`;(true || false ? {a:'b'} : 666)`)
        compare(ke("true or false ? a:'b' : 666"),{a:'b'})
    })
    section("assert", function ()
    {
        compare(kc("e?.d"),";(e != null ? e.d : undefined)")
        compare(kc("e?[1]"),";(e != null ? e[1] : undefined)")
        compare(kc("e?[1].f"),";(e != null ? e[1].f : undefined)")
        compare(kc("e?[1]?.g"),";(e != null ? e[1] != null ? e[1].g : undefined : undefined)")
        compare(kc("e?.f?.d"),";(e != null ? (_1_4_=e.f) != null ? _1_4_.d : undefined : undefined)")
        compare(kc("@m?.n"),";(this.m != null ? this.m.n : undefined)")
        compare(kc("@m? a"),';(typeof this.m === "function" ? this.m(a) : undefined)')
        compare(kc("@m?.f a"),";(this.m != null ? this.m.f(a) : undefined)")
        compare(kc(`->
    s?.c
    r?.d`),`(function ()
{
    ;(s != null ? s.c : undefined)
    return (r != null ? r.d : undefined)
})`)
        compare(ke("e=1;e?[1]?.g"),undefined)
        compare(kc("line.turd?[..1] == 'xxx'"),";(line.turd != null ? line.turd.slice(0, 2) : undefined) === 'xxx'")
        section("call", function ()
        {
            compare(kc("e?()"),';(typeof e === "function" ? e() : undefined)')
            compare(kc(`if 1
    a?()`),`if (1)
{
    ;(typeof a === "function" ? a() : undefined)
}`)
        })
        section("assign", function ()
        {
            compare(kc(`a? = 1`),`if ((a != null)) { a = 1 }`)
            compare(kc(`a?.b = 1`),`if ((a != null)) { a.b = 1 }`)
            compare(kc(`a?.b? = 1`),`if (((a != null ? a.b : undefined) != null)) { a.b = 1 }`)
            compare(kc(`a?.b.c().d[1].e = 1`),`if ((a != null)) { a.b.c().d[1].e = 1 }`)
        })
    })
    section("combined", function ()
    {
        compare(kc("e?.col?"),";((e != null ? e.col : undefined) != null)")
        compare(kc(`(a.b?.c.d?.e == 2)`),`;(((_1_4_=a.b) != null ? (_1_9_=_1_4_.c.d) != null ? _1_9_.e : undefined : undefined) === 2)`)
        compare(kc(`x = a[1]?.b()?.c?().d?.e`),`x = (a[1] != null ? (_1_13_=a[1].b()) != null ? typeof (_1_16_=_1_13_.c) === "function" ? (_1_21_=_1_16_().d) != null ? _1_21_.e : undefined : undefined : undefined : undefined)`)
        compare(kc(`x = a.b?[222]?(333)?.e`),`x = ((_1_7_=a.b) != null ? typeof _1_7_[222] === "function" ? (_1_19_=_1_7_[222](333)) != null ? _1_19_.e : undefined : undefined : undefined)`)
    })
    section("functions", function ()
    {
        compare(kc("f c ? '', 4"),"f((c != null ? c : ''),4)")
        compare(kc(`a = ->
    if b?.e?.l
        hua
    oga`),`
a = function ()
{
    var _2_11_

    if ((b != null ? (_2_11_=b.e) != null ? _2_11_.l : undefined : undefined))
    {
        hua
    }
    return oga
}`)
    })
}
toExport["qmark"]._section_ = true
toExport._test_ = true
export default toExport
