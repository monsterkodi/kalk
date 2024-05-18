var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["call"] = function ()
{
    section("calls", function ()
    {
        compare(kc('a(b)'),'a(b)')
        compare(kc('a(b,c)'),'a(b,c)')
        compare(kc('a(1,null,"2")'),'a(1,null,"2")')
        compare(kc('a[1](b)'),'a[1](b)')
        compare(kc("f 'b', (a) ->"),"f('b',function (a)\n{})")
        compare(kc("a('1' 2 3.4 true false null undefined NaN Infinity)"),"a('1',2,3.4,true,false,null,undefined,NaN,Infinity)")
        compare(kc("cb not err"),"cb(!err)")
        compare(kc(`a b:c[1], d:2`),`a({b:c[1],d:2})`)
        compare(kc(`a b:c[2], d:3
4`),`a({b:c[2],d:3})
4`)
        compare(kc(`a '1'
b  2
c  3.4
d  true`),`a('1')
b(2)
c(3.4)
d(true)`)
        compare(kc(`a b 1
c d 2`),`a(b(1))
c(d(2))`)
        compare(kc("a 'b' -> c"),`a('b',function ()
{
    return c
})`)
        compare(kc('l = pat.map ->'),'l = pat.map(function ()\n{})')
        compare(kc(`((a) -> 1)`),`;(function (a)
{
    return 1
})`)
        compare(kc(`l = a (i) -> 0`),`l = a(function (i)
{
    return 0
})`)
        compare(kc(`l = timer ((i) -> 1)`),`l = timer((function (i)
{
    return 1
}))`)
        compare(kc(`l = timer ((i) -> i), y`),`l = timer((function (i)
{
    return i
}),y)`)
        compare(kc(`a.b c:2
x = y`),`a.b({c:2})
x = y`)
    })
    section("obj, func", function ()
    {
        compare(kc(`g h:1, -> 2`),`g({h:1},function ()
{
    return 2
})`)
        compare(kc(`j k:1, (l) -> 3`),`j({k:1},function (l)
{
    return 3
})`)
    })
    section("if", function ()
    {
        compare(kc(`a if 1 ➜ 2
     2 ➜ 3
       ➜ 4`),`a(1 ? 2 : 2 ? 3 : 4)`)
        compare(kc(`a if 1 ➜ 2
     2 ➜ 1+1;3
       ➜ 4`),`a(((function ()
{
    if (1)
    {
        return 2
    }
    else if (2)
    {
        1 + 1
        return 3
    }
    else
    {
        return 4
    }
}).bind(this))())`)
    })
    section("switch", function ()
    {
        compare(kc(`a switch x
     2 ➜ 3
       ➜ 4`),`a(((function ()
{
    switch (x)
    {
        case 2:
            return 3

        default:
            return 4
    }

}).bind(this))())`)
    })
    section("lambda", function ()
    {
        compare(kc("a = (-> 1)()"),`a = (function ()
{
    return 1
})()`)
        compare(kc(`a = (->
    1)()`),`a = (function ()
{
    return 1
})()`)
    })
    section("parens", function ()
    {
        compare(kc(`a(
    '1'
    2
    3.4
    true
    [
        null
        undefined
    ]
)`),`a('1',2,3.4,true,[null,undefined])`)
    })
    section("block", function ()
    {
        compare(kc(`a
    b
        3
c
    d
        4`),`a(b(3))
c(d(4))`)
        compare(kc(`a
    b
    1
c
    d
    2`),`a(b,1)
c(d,2)`)
        compare(kc(`a = x
    c:1
    d:2`),`a = x({c:1,d:2})`)
        compare(kc(`if false
    a = x
        c:1
        d:2`),`if (false)
{
    a = x({c:1,d:2})
}`)
        compare(kc(`f = ->
    a = x
        c:1
        d:2`),`
f = function ()
{
    var a

    return a = x({c:1,d:2})
}`)
        compare(kc(`d = k:1
    v: x
        c:1
        d:2`),`d = {k:1,v:x({c:1,d:2})}`)
        compare(kc(`d = v: x
        c:1
        d:2
    k:1`),`d = {v:x({c:1,d:2}),k:1}`)
        compare(kc(`switch y
    'z'
        x
            c:1
            d:2
    'zz'
        xx
            e:3`),`switch (y)
{
    case 'z':
        x({c:1,d:2})
        break
    case 'zz':
        xx({e:3})
        break
}
`)
        compare(kc(`for y in [1..10]
    x
        c:1
        d:2`),`for (y = 1; y <= 10; y++)
{
    x({c:1,d:2})
}`)
        compare(kc(`for y in [1..10]
    x   c:1
        d:2`),`for (y = 1; y <= 10; y++)
{
    x({c:1,d:2})
}`)
        compare(kc(`for y in [1..10]
    x   c:a
        d:2`),`for (y = 1; y <= 10; y++)
{
    x({c:a,d:2})
}`)
        compare(kc(`for y in [1..10]
    x   c:a
            d:2`),`for (y = 1; y <= 10; y++)
{
    x({c:a({d:2})})
}`)
        compare(ke(`f = (a) -> a

f 
    1 ? 2 : 3`),2)
        compare(ke(`f = (a) -> a

f 1 ? 2 : 3`),2)
        compare(ke(`f = (a) -> a

f if 1 then 2 else 3`),2)
        compare(ke(`f = (a) -> a

f 
    if 1 then 2 else 3`),2)
        section("comma", function ()
        {
            compare(kc(`c 1,
  2`),`c(1,2)`)
        })
    })
    section("chain", function ()
    {
        compare(kc(`c = []
    .map (t) -> t
    .length > 0`),`c = [].map(function (t)
{
    return t
}).length > 0`)
    })
}
toExport["call"]._section_ = true
toExport._test_ = true
export default toExport
