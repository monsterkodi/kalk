var toExport = {}
var _k_

var i, rgs

import util from "./util.js"
let inc = util.inc
let ranges = util.ranges

toExport["strings"] = function ()
{
    rgs = ranges("slash = require 'kslash'")
    compare(inc(rgs,16,"'"),'punct require')
    compare(inc(rgs,17,"kslash"),'text require')
    compare(inc(rgs,23,"'"),'punct require')
    rgs = ranges('a="\'X\'"')
    compare(inc(rgs,2,'"'),'punct string double')
    compare(inc(rgs,3,"'"),'string double')
    compare(inc(rgs,4,"X"),'string double')
    compare(inc(rgs,6,'"'),'punct string double')
    rgs = ranges('a=\'"X"\'','coffee')
    compare(inc(rgs,2,"'"),'punct string single')
    compare(inc(rgs,3,'"'),'string single')
    compare(inc(rgs,4,'X'),'string single')
    compare(inc(rgs,6,"'"),'punct string single')
    rgs = ranges('a="  \'X\'  Y  " ')
    compare(inc(rgs,2,'"'),'punct string double')
    compare(inc(rgs,5,"'"),'string double')
    compare(inc(rgs,6,"X"),'string double')
    compare(inc(rgs,7,"'"),'string double')
    compare(inc(rgs,13,'"'),'punct string double')
    rgs = ranges('a="";b=" ";c="X"')
    var list = [2,3,7,9,13,15]
    for (var _44_10_ = 0; _44_10_ < list.length; _44_10_++)
    {
        i = list[_44_10_]
        compare(inc(rgs,i,'"'),'punct string double')
    }
    compare(inc(rgs,14,'X'),'string double')
    rgs = ranges("a='';b=' ';c='Y'")
    var list1 = [2,3,7,9,13,15]
    for (var _49_10_ = 0; _49_10_ < list1.length; _49_10_++)
    {
        i = list1[_49_10_]
        compare(inc(rgs,i,"'"),'punct string single')
    }
    compare(inc(rgs,14,'Y'),'string single')
    rgs = ranges('"s = \'/some\\path/file.txt:10\'"')
    compare(inc(rgs,5,"'"),'string double')
    compare(inc(rgs,17,"file"),'string double')
    compare(inc(rgs,21,"."),'string double')
    compare(inc(rgs,22,"txt"),'string double')
    compare(inc(rgs,26,"10"),'string double')
    compare(inc(rgs,28,"'"),'string double')
    compare(inc(rgs,29,'"'),'punct string double')
    rgs = ranges("when '\"\"\"' then 'string double triple'")
    compare(inc(rgs,6,'"'),'string single')
    compare(inc(rgs,7,'"'),'string single')
    compare(inc(rgs,8,'"'),'string single')
    section("interpolation", function ()
    {
        rgs = ranges('"#{xxx}"')
        compare(inc(rgs,0,'"'),'punct string double')
        compare(inc(rgs,1,"#"),'punct string interpolation start')
        compare(inc(rgs,2,"{"),'punct string interpolation start')
        compare(inc(rgs,3,'xxx'),'text')
        compare(inc(rgs,6,"}"),'punct string interpolation end')
        compare(inc(rgs,7,'"'),'punct string double')
        rgs = ranges('"#{666}"')
        compare(inc(rgs,0,'"'),'punct string double')
        compare(inc(rgs,3,'666'),'number')
        compare(inc(rgs,7,'"'),'punct string double')
        rgs = ranges('"""#{777}"""')
        compare(inc(rgs,0,'"'),'punct string double triple')
        compare(inc(rgs,1,'"'),'punct string double triple')
        compare(inc(rgs,2,'"'),'punct string double triple')
        compare(inc(rgs,3,'#'),'punct string interpolation start')
        compare(inc(rgs,4,'{'),'punct string interpolation start')
        compare(inc(rgs,5,'777'),'number')
        compare(inc(rgs,8,'}'),'punct string interpolation end')
        compare(inc(rgs,9,'"'),'punct string double triple')
        compare(inc(rgs,10,'"'),'punct string double triple')
        compare(inc(rgs,11,'"'),'punct string double triple')
        rgs = ranges('"#{__dirname}/../"')
        compare(inc(rgs,12,'}'),'punct string interpolation end')
        compare(inc(rgs,13,'/'),'string double')
        rgs = ranges("p = 'c:\\\\path\\\\'; 1")
        compare(inc(rgs,4,"'"),'punct string single')
        compare(inc(rgs,5,"c"),'string single')
        compare(inc(rgs,6,":"),'string single')
        compare(inc(rgs,7,"\\"),'string single')
        compare(inc(rgs,8,"\\"),'string single')
        compare(inc(rgs,9,"path"),'string single')
        compare(inc(rgs,13,"\\"),'string single')
        compare(inc(rgs,14,"\\"),'string single')
        compare(inc(rgs,15,"'"),'punct string single')
        compare(inc(rgs,16,";"),'punct minor')
        compare(inc(rgs,18,"1"),'number')
        rgs = ranges('a="\\"X\\""')
        compare(inc(rgs,2,'"'),'punct string double')
        compare(inc(rgs,3,'\\'),'string double')
        compare(inc(rgs,4,'"'),'string double')
        compare(inc(rgs,5,'X'),'string double')
        compare(inc(rgs,6,'\\'),'string double')
        compare(inc(rgs,7,'"'),'string double')
        compare(inc(rgs,8,'"'),'punct string double')
    })
}
toExport["strings"]._section_ = true
toExport._test_ = true
export default toExport
