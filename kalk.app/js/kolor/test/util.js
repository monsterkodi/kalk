var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var ext

import kolor from "../kolor.js"

ext = 'kode'
export default {lang:function (l)
{
    return ext = l
},ranges:function (s)
{
    return kolor.ranges(s,ext)
},dissect:function (c)
{
    return kolor.dissect(c.split('\n'),ext)
},inc:function (rgs, start, match)
{
    var r

    var list = _k_.list(rgs)
    for (var _19_14_ = 0; _19_14_ < list.length; _19_14_++)
    {
        r = list[_19_14_]
        if (r.start === start && r.match === match)
        {
            return r.clss
        }
    }
    console.log('fail',rgs)
}}