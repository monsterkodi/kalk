var _k_ = {isFunc: function (o) {return typeof o === 'function'}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}}

var k, kakao, Kakao, v

import kxk from "./kxk.js"
let sleep = kxk.sleep
let post = kxk.post
let ffs = kxk.ffs

import bundle from "./bundle.js"


Kakao = (function ()
{
    function Kakao ()
    {}

    Kakao["init"] = async function (cb)
    {
        while (!window.bundlePath)
        {
            await sleep(100)
        }
        bundle.path = window.bundlePath
        if (_k_.isFunc(window.kakao.preInit))
        {
            await window.kakao.preInit()
        }
        return cb(bundle.path)
    }

    Kakao["send"] = function (route, ...args)
    {
        return window.webkit.messageHandlers.kakao.postMessage({route:route,args:args})
    }

    Kakao["request"] = function (route, ...args)
    {
        return window.webkit.messageHandlers.kakao_request.postMessage({route:route,args:args})
    }

    Kakao["receive"] = function (msg)
    {
        if (_k_.isStr(msg))
        {
            return post.emit(msg)
        }
        else if (_k_.isObj(msg))
        {
            return post.emit.apply(null,[msg.name].concat(msg.args))
        }
    }

    Kakao["bundle"] = bundle
    Kakao["ffs"] = ffs
    return Kakao
})()


kakao = function ()
{
    return Kakao.request.apply(null,arguments)
}
for (k in Kakao)
{
    v = Kakao[k]
    kakao[k] = v
}
window.kakao = kakao
export default kakao;