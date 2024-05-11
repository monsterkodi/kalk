var toExport = {}
var _k_

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["loops"] = function ()
{
    section("for", function ()
    {
        section("in", function ()
        {
            section("range", function ()
            {
                compare(kc("for x in [3...4]"),`for (x = 3; x < 4; x++)
{
}`)
                compare(kc("for x in [3..4]"),`for (x = 3; x <= 4; x++)
{
}`)
                compare(kc("for x in 5..6"),`for (x = 5; x <= 6; x++)
{
}`)
                compare(kc("for x in 5..6"),`for (x = 5; x <= 6; x++)
{
}`)
                compare(kc("for x in 15..4"),`for (x = 15; x >= 4; x--)
{
}`)
                compare(kc(`for i in a..b
    log i`),`for (var _1_9_ = i = a, _1_12_ = b; (_1_9_ <= _1_12_ ? i <= b : i >= b); (_1_9_ <= _1_12_ ? ++i : --i))
{
    console.log(i)
}`)
                compare(kc(`for a in [1..2] then for b in [1..3] then c = 1; d = 1`),`for (a = 1; a <= 2; a++)
{
    for (b = 1; b <= 3; b++)
    {
        c = 1
        d = 1
    }
}`)
                compare(kc(`for a in [1..9] then for b in [1..9]
    c = 3
    d:
        e: 1`),`for (a = 1; a <= 9; a++)
{
    for (b = 1; b <= 9; b++)
    {
        c = 3
        {d:{e:1}}
    }
}`)
            })
        })
        section("in", function ()
        {
            section("list", function ()
            {
                compare(kc(`for t in l
    t`),`var list = _k_.list(l)
for (var _1_6_ = 0; _1_6_ < list.length; _1_6_++)
{
    t = list[_1_6_]
    t
}`)
                compare(kc(`for a in [1,2,3] then log a`),`var list = [1,2,3]
for (var _1_6_ = 0; _1_6_ < list.length; _1_6_++)
{
    a = list[_1_6_]
    console.log(a)
}`)
                compare(kc(`for a in [1,2,3] then log a
log a`),`var list = [1,2,3]
for (var _1_6_ = 0; _1_6_ < list.length; _1_6_++)
{
    a = list[_1_6_]
    console.log(a)
}
console.log(a)`)
                compare(kc(`for a in [1,2,3]
    log '1' a
    log '2' a
log '3' a`),`var list = [1,2,3]
for (var _1_6_ = 0; _1_6_ < list.length; _1_6_++)
{
    a = list[_1_6_]
    console.log('1',a)
    console.log('2',a)
}
console.log('3',a)`)
                compare(kc(`for v,i in @regs
    log i,v`),`var list = _k_.list(this.regs)
for (i = 0; i < list.length; i++)
{
    v = list[i]
    console.log(i,v)
}`)
                compare(kc(`for [a,b] in @regs
    log a,b`),`var list = _k_.list(this.regs)
for (var _1_10_ = 0; _1_10_ < list.length; _1_10_++)
{
    a = list[_1_10_][0]
    b = list[_1_10_][1]
    console.log(a,b)
}`)
                compare(kc(`empty = (a) -> a in ['' null undefined] or b`),`
empty = function (a)
{
    return _k_.in(a,['',null,undefined]) || b
}`)
                compare(kc(`@exp body.exps,k,e for e,k in body.exps`),`var list = _k_.list(body.exps)
for (k = 0; k < list.length; k++)
{
    e = list[k]
    this.exp(body.exps,k,e)
}`)
            })
        })
        section("of", function ()
        {
            compare(kc(`for key,val of @patts
    log key, val`),`for (key in this.patts)
{
    val = this.patts[key]
    console.log(key,val)
}`)
            compare(kc(`matches = ([k, r.exec t] for k,r of rgs)`),`matches = (function () { var r_1_33_ = []; for (var k in rgs)  { var r = rgs[k];r_1_33_.push([k,r.exec(t)])  } return r_1_33_ }).bind(this)()`)
        })
        section("tail", function ()
        {
            compare(kc(`f e for e in l ? []`),`var list = (l != null ? l : [])
for (var _1_10_ = 0; _1_10_ < list.length; _1_10_++)
{
    e = list[_1_10_]
    f(e)
}`)
        })
    })
    section("list comprehension", function ()
    {
        compare(kc("m = ([k, r.exec t] for k,r of rgs)"),`m = (function () { var r_1_27_ = []; for (var k in rgs)  { var r = rgs[k];r_1_27_.push([k,r.exec(t)])  } return r_1_27_ }).bind(this)()`)
        compare(kc("m = ([i, k] for k,i in rgs)"),`m = (function () { var r_1_20_ = []; var list = _k_.list(rgs); for (i = 0; i < list.length; i++)  { var k = list[i];r_1_20_.push([i,k])  } return r_1_20_ }).bind(this)()`)
        compare(ke("1"),1)
        compare(ke("'abc'"),'abc')
        compare(ke("[1,2,3]"),[1,2,3])
        compare(ke("[i for i in [1,2,3]]"),[1,2,3])
        compare(ke("(i for i in [1,2,3])"),[1,2,3])
        compare(ke("[i*2 for i in [1,2,3]]"),[2,4,6])
        compare(ke("(i+3 for i in [1,2,3])"),[4,5,6])
        compare(ke("(k for k of {a:1,b:2,c:3})"),['a','b','c'])
        compare(ke("(v*v for k,v of {a:1,b:2,c:3})"),[1,4,9])
        compare(ke("(''+i+' '+v for i,v of [5,4,3])"),['0 5','1 4','2 3'])
        compare(ke('((-> (a={})[v]=k; a)() for k,v of {a:1,b:2,c:3})'),[{'1':'a'},{'2':'b'},{'3':'c'}])
    })
    section("each", function ()
    {
        compare(ke("a = {a:1,b:2}"),{a:1,b:2})
        compare(ke("a = {a:1,b:2} each (k,v) -> [k, v*3]"),{a:3,b:6})
        compare(ke("a = {a:1,b:2} each (k,v) -> ['▸'+k, v]"),{'▸a':1,'▸b':2})
        compare(ke("a = [1,2,3] each (i,v) -> [i, v]"),[1,2,3])
        compare(ke("a = [1,2,3] each (i,v) -> [2-i, v]"),[3,2,1])
        compare(ke("a = [1,3]   each (i,v) -> [1-i,v*v]"),[9,1])
        compare(ke("a = ['3''2''1'] each (i,v) -> [i, v+'▸'+i]"),['3▸0','2▸1','1▸2'])
        compare(ke("a = 'hello' each (i,c) -> [i,c+c]"),"hheelllloo")
        compare(ke("a = 'hello world' each (i,c) -> [i,i%2 and c.toUpperCase() or c]"),"hElLo wOrLd")
        compare(ke("a = 'hello again' each (i,c) -> [i,((i%2) ? c.toUpperCase() : c)]"),"hElLo aGaIn")
        section("single", function ()
        {
            compare(ke("a = '' each ->"),'')
            compare(ke("a = {} each ->"),{})
            compare(ke("a = [] each ->"),[])
            compare(ke("a = [1,2] each -> 'a'"),['a','a'])
            compare(ke("a = [1,2] each ->"),[])
            compare(ke("a = [1,2,3] each (v) -> v"),[1,2,3])
            compare(ke("a = {a:1,b:2} each (v) -> v*3"),{a:3,b:6})
            compare(ke("[0,1,2] each (v) -> v"),[0,1,2])
            compare(ke("f = (a) -> a\nr = f [0,1,2] each (v) -> 2*v"),[0,2,4])
        })
    })
    section("while", function ()
    {
        compare(kc(`while true
    log 4`),`while (true)
{
    console.log(4)
}`)
        compare(kc(`while true then log 5`),`while (true)
{
    console.log(5)
}`)
        compare(kc(`while a == b then log c; log d
log e`),`while (a === b)
{
    console.log(c)
    console.log(d)
}
console.log(e)`)
    })
}
toExport["loops"]._section_ = true
toExport._test_ = true
export default toExport
