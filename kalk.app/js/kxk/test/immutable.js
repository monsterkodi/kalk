var toExport = {}
var _k_

var imm, ma, nx2, nxt

import immutable from "../immutable.js"

toExport["immutable"] = function ()
{
    imm = null
    section("simple", function ()
    {
        imm = immutable({arr:[],obj:{},int:0,str:'hello'})
        compare(imm.arr,[])
        compare(imm.obj,{})
        compare(imm.int,0)
        compare(imm.str,'hello')
        compare(immutable.isImmutable(imm),true)
        nxt = imm.set('arr',[1,2])
        compare(immutable.isImmutable(nxt),true)
        compare(imm.arr,[])
        compare(nxt.arr,[1,2])
        compare(nxt.obj,{})
        compare(nxt.int,0)
        compare(nxt.str,'hello')
        ma = nxt.arr.asMutable({deep:true})
        compare(immutable.isImmutable(ma),false)
        ma.push(3)
        nx2 = nxt.set('arr',ma)
        compare(nx2.arr,[1,2,3])
    })
    section("throws", function ()
    {
        try
        {
            imm['blah'] = 1
            compare(true,false)
        }
        catch (err)
        {
            compare(`${err}`.indexOf('Cannot add property blah, object is not extensible') >= 0,true)
        }
        try
        {
            imm.arr.push('world')
            compare(true,false)
        }
        catch (err)
        {
            compare(`${err}`.indexOf('The push method cannot be invoked on an Immutable data structure.') >= 0,true)
        }
        try
        {
            imm.int += 1
            compare(true,false)
        }
        catch (err)
        {
            compare(`${err}`.indexOf("Cannot assign to read only property 'int' of object") >= 0,true)
        }
    })
}
toExport["immutable"]._section_ = true
toExport._test_ = true
export default toExport
