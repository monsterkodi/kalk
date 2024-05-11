var toExport = {}
var _k_

var dss, rgs

import util from "./util.js"
let inc = util.inc
let ranges = util.ranges
let dissect = util.dissect
let lang = util.lang

lang('styl')
toExport["styl"] = function ()
{
    section("number", function ()
    {
        rgs = ranges("1em")
        compare(inc(rgs,0,"1em"),'number')
        rgs = ranges("1ex")
        compare(inc(rgs,0,"1ex"),'number')
        rgs = ranges("1px")
        compare(inc(rgs,0,"1px"),'number')
        rgs = ranges("1s")
        compare(inc(rgs,0,"1s"),'number')
        rgs = ranges("1.0")
        compare(inc(rgs,0,"1"),'number float')
        compare(inc(rgs,1,"."),'punct number float')
        compare(inc(rgs,2,"0"),'number float')
    })
    section("class", function ()
    {
        rgs = ranges(".clss")
        compare(inc(rgs,0,"."),'punct class')
        compare(inc(rgs,1,"clss"),'class')
        rgs = ranges(".clss-foo-bar")
        compare(inc(rgs,0,"."),'punct class')
        compare(inc(rgs,1,"clss"),'class')
        compare(inc(rgs,5,"-"),'punct class')
        compare(inc(rgs,6,"foo"),'class')
        compare(inc(rgs,9,"-"),'punct class')
        compare(inc(rgs,10,"bar"),'class')
    })
    section("id", function ()
    {
        rgs = ranges("#id")
        compare(inc(rgs,0,"#"),'punct function')
        compare(inc(rgs,1,"id"),'function')
        rgs = ranges("#id-foo-bar")
        compare(inc(rgs,0,"#"),'punct function')
        compare(inc(rgs,1,"id"),'function')
        compare(inc(rgs,3,"-"),'punct function')
        compare(inc(rgs,4,"foo"),'function')
        compare(inc(rgs,7,"-"),'punct function')
        compare(inc(rgs,8,"bar"),'function')
    })
    section("hex", function ()
    {
        rgs = ranges("#666")
        compare(inc(rgs,0,"#"),'punct number hex')
        compare(inc(rgs,1,"666"),'number hex')
        rgs = ranges("#abc")
        compare(inc(rgs,0,"#"),'punct number hex')
        compare(inc(rgs,1,"abc"),'number hex')
        rgs = ranges("#f0f0f0")
        compare(inc(rgs,0,"#"),'punct number hex')
        compare(inc(rgs,1,"f0f0f0"),'number hex')
    })
    section("comment header", function ()
    {
        rgs = ranges("// 000")
        compare(inc(rgs,3,"000"),'comment header')
        dss = dissect("/*\n 0 0 0 \n*/")
        compare(inc(dss[1],1,"0"),'comment triple header')
    })
}
toExport["styl"]._section_ = true
toExport._test_ = true
export default toExport
