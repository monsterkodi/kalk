var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke
let kd = utils.kd

toExport["args"] = function ()
{
    section("func", function ()
    {
        compare(kc(`f = a -> a`),`
f = function (a)
{
    return a
}`)
        compare(kc(`f = a b -> a + b`),`
f = function (a, b)
{
    return a + b
}`)
        compare(kc(`f = a b=0 -> a + b`),`
f = function (a, b = 0)
{
    return a + b
}`)
        compare(kc(`f = a.map -> `),`f = a.map(function ()
{})`)
        compare(kc(`f = a() -> `),`f = a()(function ()
{})`)
    })
    section("function", function ()
    {
        compare(kc(`function D
    f: a b -> a + b`),`
D = (function ()
{
    function D ()
    {}

    D.prototype["f"] = function (a, b)
    {
        return a + b
    }

    return D
})()
`)
    })
    section("class", function ()
    {
        compare(kc(`class D
    f: a b -> a + b`),`class D
{
    f (a, b)
    {
        return a + b
    }
}
`)
    })
    section("object", function ()
    {
        compare(kc(`obj =
    f: (a,b) -> a + b`),`obj = {f:function (a, b)
{
    return a + b
}}`)
        compare(kc(`obj =
    f: a b -> a + b`),`obj = {f:function (a, b)
{
    return a + b
}}`)
    })
    section("varargs", function ()
    {
        compare(kc(`obj = 
    zip: (args...) ->`),`obj = {zip:function (...args)
{}}`)
        compare(kc(`obj = 
    zip: args... ->`),`obj = {zip:function (...args)
{}}`)
        compare(kc(`obj = 
    zip: a b c... ->`),`obj = {zip:function (a, b, ...c)
{}}`)
    })
    section("propargs", function ()
    {
        compare(kc(`obj = 
    pullAll: (arr, items, cmp=util.isEqual) ->`),`obj = {pullAll:function (arr, items, cmp = util.isEqual)
{}}`)
        compare(kc(`obj = 
    fnc: cmp=util.isEqual ->`),`obj = {fnc:function (cmp = util.isEqual)
{}}`)
        compare(kc(`obj = 
    fnc: a b=d.c c=x.y.z ->`),`obj = {fnc:function (a, b = d.c, c = x.y.z)
{}}`)
    })
    section("constructor", function ()
    {
        compare(kc(`function D
    @: a b -> a + b`),`
D = (function ()
{
    function D (a, b)
    {
        a + b
    }

    return D
})()
`)
        compare(kc(`class D
    @: a b -> a + b`),`class D
{
    constructor (a, b)
    {
        a + b
    }
}
`)
    })
    section("this", function ()
    {
        compare(kc(`class D
    t: @a ->`),`class D
{
    t (a)
    {
        this.a = a
    }
}
`)
        compare(kc(`class D
    t: @a @b -> @a + @b`),`class D
{
    t (a, b)
    {
        this.a = a
        this.b = b
    
        return this.a + this.b
    }
}
`)
    })
    section("default", function ()
    {
        compare(kc(`class D
    d: a=1 -> a`),`class D
{
    d (a = 1)
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a='2' -> a`),`class D
{
    d (a = '2')
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a b=2 d='3' -> a`),`class D
{
    d (a, b = 2, d = '3')
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a=@b -> a`),`class D
{
    d (a = this.b)
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a={} -> a`),`class D
{
    d (a = {})
    {
        return a
    }
}
`)
        compare(kc(`class D
    d: a=[] -> a`),`class D
{
    d (a = [])
    {
        return a
    }
}
`)
    })
}
toExport["args"]._section_ = true
toExport._test_ = true
export default toExport
