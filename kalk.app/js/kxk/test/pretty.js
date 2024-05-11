var toExport = {}
var _k_

var before, now

import pretty from "../pretty.js"

toExport["pretty"] = function ()
{
    section("age", function ()
    {
        now = (new Date(Date.now())).toString()
        compare(pretty.age(now),'0 seconds')
        before = (new Date(Date.now() - 999)).toString()
        compare(pretty.age(before),'1 second')
        before = (new Date(Date.now() - 1000 * 60 * 60)).toString()
        compare(pretty.age(before),'1 hour')
        before = (new Date(Date.now() - 1000 * 60 * 60 * 24 * 29)).toString()
        compare(pretty.age(before),'29 days')
        before = (new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)).toString()
        compare(pretty.age(before),'1 month')
    })
    section("number", function ()
    {
        compare(pretty.number(1),'1')
        compare(pretty.number(0.11),'0.1')
    })
    section("bytes", function ()
    {
        compare(pretty.bytes(),'0 bytes')
        compare(pretty.bytes(0.99),'0 bytes')
        compare(pretty.bytes('x'),'0 bytes')
        compare(pretty.bytes(0),'0 bytes')
        compare(pretty.bytes(1),'1 byte')
        compare(pretty.bytes(3),'3 bytes')
        compare(pretty.bytes(3.33),'3 bytes')
        compare(pretty.bytes('123'),'123 bytes')
        compare(pretty.bytes(316),'316 bytes')
        compare(pretty.bytes(1000),'1 kB')
        compare(pretty.bytes(1024),'1 kB')
        compare(pretty.bytes(20000),'20 kB')
        compare(pretty.bytes(20480),'20 kB')
        compare(pretty.bytes(-1),'1 byte')
        compare(pretty.bytes(-3),'3 bytes')
        compare(pretty.bytes(-3.33),'3 bytes')
        compare(pretty.bytes('-123'),'123 bytes')
        compare(pretty.bytes(-316),'316 bytes')
        compare(pretty.bytes(-1000),'1 kB')
        compare(pretty.bytes(-1024),'1 kB')
        compare(pretty.bytes(-20000),'20 kB')
        compare(pretty.bytes(-20480),'20 kB')
    })
}
toExport["pretty"]._section_ = true
toExport._test_ = true
export default toExport
