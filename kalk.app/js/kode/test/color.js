var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var c, l, n, s

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["color"] = function ()
{
    compare(kc("R1 'Red' + g1 ' green'"),"_k_.R1('Red' + _k_.g1(' green'))")
    return
    for (c = 8; c >= 1; c--)
    {
        s = ''
        var list = _k_.list('RGBCMYW')
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            n = list[_a_]
            l = n.toLowerCase()
            s += ke(`${n}${l}${c}(' ${n}${l}${c} ')`)
        }
        console.log(s)
    }
}
toExport["color"]._section_ = true
toExport._test_ = true
export default toExport
