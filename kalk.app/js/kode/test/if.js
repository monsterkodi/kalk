var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["if"] = function ()
{
    section("then", function ()
    {
        compare(kc(`if n
    b `),`if (n)
{
    b
}`)
        compare(kc(`if undefined == null
    no`),`if (undefined === null)
{
    false
}`)
        compare(kc(`if 2
    c = 0
    1`),`if (2)
{
    c = 0
    1
}`)
        compare(kc('if false then true'),`if (false)
{
    true
}`)
        compare(kc(`if false
    true`),`if (false)
{
    true
}`)
        compare(kc(`if false
    true
a = 1`),`if (false)
{
    true
}
a = 1`)
        compare(kc(`if false
    log 2.1
log 2`),`if (false)
{
    console.log(2.1)
}
console.log(2)`)
        compare(kc(`if 2
    a.b c`),`if (2)
{
    a.b(c)
}`)
        compare(kc(`if 3
    a.b c
    a.b c`),`if (3)
{
    a.b(c)
    a.b(c)
}`)
        compare(kc(`if not op in ['--''++']
    decr`),`if (!(_k_.in(op,['--','++'])))
{
    decr
}`)
        compare(kc(`if op not in ['--''++']
    incr`),`if (!(_k_.in(op,['--','++'])))
{
    incr
}`)
        compare(kc(`if 1
    if 2
        a
    if 3
        if 4
            b
        else 
            c
    log 'yes1'`),`if (1)
{
    if (2)
    {
        a
    }
    if (3)
    {
        if (4)
        {
            b
        }
        else
        {
            c
        }
    }
    console.log('yes1')
}`)
        compare(kc(`if e then 1
if 2 then f`),`if (e)
{
    1
}
if (2)
{
    f
}`)
        compare(kc(`->
    if not e then return
        
    if 1
        if 2 in a
            3
        return`),`(function ()
{
    if (!e)
    {
        return
    }
    if (1)
    {
        if (_k_.in(2,a))
        {
            3
        }
        return
    }
})`)
        compare(kc(`if a.clone
    1`),`if (a.clone)
{
    1
}`)
        compare(kc(`if not regexes is Array`),`if (!(regexes instanceof Array))
{
}`)
    })
    section("block", function ()
    {
        compare(kc(`if
    1 then 2`),`if (1)
{
    2
}`)
        compare(kc(`if
    10
        20`),`if (10)
{
    20
}`)
        compare(kc(`if
    100
        200
    300
        400
    500
        600
    else
        700`),`if (100)
{
    200
}
else if (300)
{
    400
}
else if (500)
{
    600
}
else
{
    700
}`)
    })
    section("call arg", function ()
    {
        compare(kc(`t.push if
    1 ➜ 2
    2 ➜ 3`),`t.push(1 ? 2 : 2 ? 3 : undefined)`)
        compare(kc(`t.push if 2 ➜ 3`),`t.push(2 ? 3 : undefined)`)
        compare(kc(`t.push if 2 then 3 else 4`),`t.push(2 ? 3 : 4)`)
        compare(kc(`t.push if 5 ➜ 6
          7 ➜ 8
            ➜ 9`),`t.push(5 ? 6 : 7 ? 8 : 9)`)
        compare(kc(`t.push if 5 ➜ 6
  7 ➜ 8
    ➜ 9`),`t.push(5 ? 6 : 7 ? 8 : 9)`)
        compare(kc(`t.push if
    1 and 2
        item = clone undefined
        item
    else
        null`),`t.push(((function ()
{
    var item

    if (1 && 2)
    {
        item = _k_.clone(undefined)
        return item
    }
    else
    {
        return null
    }
}).bind(this))())`)
    })
    section("inline", function ()
    {
        compare(kc("v = if k == 1 then 2 else 3"),"v = k === 1 ? 2 : 3")
        compare(kc("i = 1 if i == 0"),`if (i === 0)
{
    i = 1
}`)
        compare(kc("if a then i = 10 if i == 10"),`if (a)
{
    if (i === 10)
    {
        i = 10
    }
}`)
        compare(kc(`if false then true else no
a = 1`),`false ? true : false
a = 1`)
        compare(kc(`if false then log 1.1
log 1`),`if (false)
{
    console.log(1.1)
}
console.log(1)`)
        compare(kc(`if false then true else log 3.3
log 3`),`false ? true : console.log(3.3)
console.log(3)`)
        compare(kc(`if 1 then a.b c`),`if (1)
{
    a.b(c)
}`)
        compare(kc(`j = ->
    for m in ms then if bla then blub
    nextline`),`
j = function ()
{
    var m

    var list = _k_.list(ms)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        m = list[_a_]
        if (bla)
        {
            blub
        }
    }
    return nextline
}`)
        compare(kc(`if c then return f a
nextline`),`if (c)
{
    return f(a)
}
nextline`)
        compare(kc(`s = if 1
        2
    else if 3
        4
    else
        5`),`s = 1 ? 2 : 3 ? 4 : 5`)
        compare(kc(`s = if 1
        2
    else if 3
        4`),`s = 1 ? 2 : 3 ? 4 : undefined`)
        compare(kc("h = if w then f g else '0'"),"h = w ? f(g) : '0'")
        compare(kc("a = if 1 then 2 else if 3 then 4 else if 5 then 6 else 7"),"a = 1 ? 2 : 3 ? 4 : 5 ? 6 : 7")
        compare(kc(`a = if 0 then if 1 then if 2 then 3 else if 4 then 5 else 6 else if 7 then 8 else 9 else if 10 then 11 else 12`),`a = 0 ? 1 ? 2 ? 3 : 4 ? 5 : 6 : 7 ? 8 : 9 : 10 ? 11 : 12`)
    })
    section("else if", function ()
    {
        compare(kc(`if 1
    log 'yes2'
else if no
    false
else
    log 'no2'
log 'end'`),`if (1)
{
    console.log('yes2')
}
else if (false)
{
    false
}
else
{
    console.log('no2')
}
console.log('end')`)
        compare(kc(`if a in l
    log 'yes3'
else
    log 'no3'
log 'END'`),`if (_k_.in(a,l))
{
    console.log('yes3')
}
else
{
    console.log('no3')
}
console.log('END')`)
    })
    section("returns", function ()
    {
        compare(kc(`-> if false then true`),`(function ()
{
    if (false)
    {
        return true
    }
})`)
        compare(kc(`-> if 1 then 2 else 3`),`(function ()
{
    if (1)
    {
        return 2
    }
    else
    {
        return 3
    }
})`)
        compare(kc(`->    
    if a
        e.push
            key:
                key: val`),`(function ()
{
    if (a)
    {
        return e.push({key:{key:val}})
    }
})`)
    })
    section("tail", function ()
    {
        compare(kc(`a if b`),`if (b)
{
    a
}`)
        compare(kc(`a if b if c`),`if (c)
{
    if (b)
    {
        a
    }
}`)
        compare(kc(`log 'msg' if dbg`),`if (dbg)
{
    console.log('msg')
}`)
        compare(kc("if 1 then 2"),"if (1)\n{\n    2\n}")
        compare(kc("if 1 then 2"),kc("if 1 then 2"))
        compare(kc("if 1 ➜ 2 else 3"),kc("if 1 then 2 else 3"))
    })
    section("nicer", function ()
    {
        compare(kc(`if
    x       ➜ 1
    a == 5  ➜ 2
    'hello' ➜ 3
            ➜ fark`),`if (x)
{
    1
}
else if (a === 5)
{
    2
}
else if ('hello')
{
    3
}
else
{
    fark
}`)
        compare(kc(`if
    x       ➜ 1
    a == 5  ➜ 2
    'hello' ➜ 3
    else
        fark`),`if (x)
{
    1
}
else if (a === 5)
{
    2
}
else if ('hello')
{
    3
}
else
{
    fark
}`)
        compare(kc(`if  
    x       ➜ 1
    a == 5  ➜ 2
    'hello' ➜ 3
    else   fark`),`if (x)
{
    1
}
else if (a === 5)
{
    2
}
else if ('hello')
{
    3
}
else
{
    fark
}`)
        compare(kc(`if  x  ➜ 1
    y  ➜ 2`),`if (x)
{
    1
}
else if (y)
{
    2
}`)
        compare(kc(`if  a 'x' ➜ X
    b 'y' ➜ Y
    else    Z`),`if (a('x'))
{
    X
}
else if (b('y'))
{
    Y
}
else
{
    Z
}`)
        compare(kc(`if  a 'x' ➜ X
    b 'y' ➜ Y
          ➜ Z`),`if (a('x'))
{
    X
}
else if (b('y'))
{
    Y
}
else
{
    Z
}`)
        compare(kc(`if  b   ➜ R
        ➜ S`),`if (b)
{
    R
}
else
{
    S
}`)
        compare(kc(`if  a ➜ P
    ➜   Q`),`if (a)
{
    P
}
else
{
    Q
}`)
    })
}
toExport["if"]._section_ = true
toExport._test_ = true
export default toExport
