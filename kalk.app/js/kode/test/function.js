var toExport = {}
var _k_

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke
let kd = utils.kd

toExport["function"] = function ()
{
    section("basics", function ()
    {
        compare(kc(`function A`),`
A = (function ()
{
    return A
})()
`)
        compare(kc(`function B
    @a: []
    @b: {}`),`
B = (function ()
{
    function B ()
    {}

    B["a"] = []
    B["b"] = {}
    return B
})()
`)
        compare(kc(`function C
    @a: ->
    b: ->`),`
C = (function ()
{
    function C ()
    {}

    C["a"] = function ()
    {}

    C.prototype["b"] = function ()
    {}

    return C
})()
`)
        compare(kc(`function D
    @: (@a=1,@b=2) ->`),`
D = (function ()
{
    function D (a = 1, b = 2)
    {
        this.a = a
        this.b = b
    }

    return D
})()
`)
    })
    section("async", function ()
    {
        compare(kc(`function C
    @a: ○->
    b: ○->`),`
C = (function ()
{
    function C ()
    {}

    C["a"] = async function ()
    {}

    C.prototype["b"] = async function ()
    {}

    return C
})()
`)
    })
    section("super", function ()
    {
        compare(kc(`function S
    @: -> super()`),`
S = (function ()
{
    function S ()
    {
        S.__super__.constructor.call(this)
    }

    return S
})()
`)
        compare(kc(`function S extends Q
    @: (a) -> 
        a = 1
        super a
        a = 2`),`
S = (function ()
{
    _k_.extend(S, Q)
    function S (a)
    {
        a = 1
        S.__super__.constructor.call(this,a)
        a = 2
    }

    return S
})()
`)
    })
    section("extends", function ()
    {
        compare(kc(`function A extends B.C
    @: -> `),`
A = (function ()
{
    _k_.extend(A, B.C)
    function A ()
    {
        return A.__super__.constructor.apply(this, arguments)
    }

    return A
})()
`)
    })
    section("old school", function ()
    {
        compare(ke(`function T1
    @: ->
    f: (a) -> 1 + a

function T2 extends T1
    @: ->
    f: (a) -> super(a) + 30
    
(new T2).f 1`),32)
        compare(ke(`function T3
     
    f: (a) -> 1 + a
 
function T4 extends T3
 
    f: (a) -> super(a) + 40
     
(new T4).f 1`),42)
    })
}
toExport["function"]._section_ = true
toExport._test_ = true
export default toExport
