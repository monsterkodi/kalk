var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["class"] = function ()
{
    section("empty", function ()
    {
        compare(kc(`class A`),`class A
{}
`)
    })
    section("constructor", function ()
    {
        compare(kc(`class B
    @: ->`),`class B
{
    constructor ()
    {}
}
`)
    })
    section("async", function ()
    {
        compare(kc(`class C
    @a: ○->
    b: ○->`),`class C
{
    static async a ()
    {}

    async b ()
    {}
}
`)
    })
    section("static", function ()
    {
        compare(kc(`class C
    @a: ->
    b: ->`),`class C
{
    static a ()
    {}

    b ()
    {}
}
`)
        compare(kc(`class E
    @f: ->
    @g: ->`),`class E
{
    static f ()
    {}

    static g ()
    {}
}
`)
        compare(kc(`class F
    @f: ->
    @g: ->
    @h: ->`),`class F
{
    static f ()
    {}

    static g ()
    {}

    static h ()
    {}
}
`)
        compare(kc(`class X
    @: ->
        '@'

    m: -> 'm'`),`class X
{
    constructor ()
    {
        '@'
    }

    m ()
    {
        return 'm'
    }
}
`)
        compare(kc(`class Y
    @: -> '@'

    m: ->
        'm'`),`class Y
{
    constructor ()
    {
        '@'
    }

    m ()
    {
        return 'm'
    }
}
`)
        compare(kc(`class C
    m: ->
        w = new W
            p: true`),`class C
{
    m ()
    {
        var w

        return w = new W({p:true})
    }
}
`)
        section("var", function ()
        {
            compare(kc(`class SV
    @x: 1`),`class SV
{
    static x = 1
}
`)
        })
    })
    section("new", function ()
    {
        compare(kc(`a = new app
    dir: __dirname`),`a = new app({dir:__dirname})`)
    })
    section("bind", function ()
    {
        compare(kc(`class D
    a: =>`),`class D
{
    constructor ()
    {
        this.a = this.a.bind(this)
    }

    a ()
    {}
}
`)
        compare(kc(`class A
    @: -> @f()
    b: => log 'hello'
    f: ->
        g = => @b()
        g()`),`class A
{
    constructor ()
    {
        this.b = this.b.bind(this)
        this.f()
    }

    b ()
    {
        console.log('hello')
    }

    f ()
    {
        var g

        g = (function ()
        {
            return this.b()
        }).bind(this)
        return g()
    }
}
`)
        compare(kc(`class E extends e

    @: (@e) ->

        super()
        @v = -1
        
    start: =>`),`class E extends e
{
    constructor (e)
    {
        super()
    
        this.e = e
    
        this.start = this.start.bind(this)
        this.v = -1
    }

    start ()
    {}
}
`)
    })
    section("extends", function ()
    {
        compare(kc(`class A extends B.C
    @: -> `),`class A extends B.C
{
    constructor ()
    {}
}
`)
    })
}
toExport["class"]._section_ = true
toExport._test_ = true
export default toExport
