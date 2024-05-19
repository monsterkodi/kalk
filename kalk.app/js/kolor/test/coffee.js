var toExport = {}
var dss, rgs

import util from "./util.js"
let inc = util.inc
let ranges = util.ranges
let dissect = util.dissect
let lang = util.lang

lang('coffee')
toExport["coffee"] = function ()
{
    section("misc", function ()
    {
        rgs = ranges("util = require 'util'")
        compare(inc(rgs,7,'require'),'require')
        rgs = ranges("class Macro extends Command")
        compare(inc(rgs,0,'class'),'keyword')
        compare(inc(rgs,6,'Macro'),'class')
        compare(inc(rgs,12,'extends'),'keyword')
        compare(inc(rgs,20,'Command'),'class')
        rgs = ranges("exist?.prop")
        compare(inc(rgs,7,'prop'),'property')
        rgs = ranges("a and b")
        compare(inc(rgs,0,"a"),'text')
        compare(inc(rgs,2,"and"),'keyword')
        rgs = ranges("if a then b")
        compare(inc(rgs,0,"if"),'keyword')
        compare(inc(rgs,3,"a"),'text')
        compare(inc(rgs,5,"then"),'keyword')
        compare(inc(rgs,10,"b"),'text')
        rgs = ranges("switch a")
        compare(inc(rgs,0,"switch"),'keyword')
        rgs = ranges(" a: b")
        compare(inc(rgs,1,"a"),'dictionary key')
        compare(inc(rgs,2,":"),'punct dictionary')
        rgs = ranges("obj.value = obj.another.value")
        compare(inc(rgs,0,"obj"),'obj')
        compare(inc(rgs,4,"value"),'property')
        compare(inc(rgs,12,"obj"),'obj')
        compare(inc(rgs,16,"another"),'property')
        compare(inc(rgs,24,"value"),'property')
        rgs = ranges("if someObject.someProp")
        compare(inc(rgs,0,"if"),'keyword')
        compare(inc(rgs,3,"someObject"),'obj')
        compare(inc(rgs,13,"."),'punct property')
        compare(inc(rgs,14,"someProp"),'property')
        rgs = ranges("1 'a'")
        compare(inc(rgs,0,"1"),'number')
        rgs = ranges("a[0].prop")
        compare(inc(rgs,3,']'),'punct')
        rgs = ranges("[ f ]")
        compare(inc(rgs,2,'f'),'text')
        rgs = ranges("[ f , f ]")
        compare(inc(rgs,2,'f'),'text')
        rgs = ranges("a[...2]")
        compare(inc(rgs,2,'.'),'punct range')
        compare(inc(rgs,3,'.'),'punct range')
        compare(inc(rgs,4,'.'),'punct range')
        rgs = ranges("a[ -1 .. ]")
        compare(inc(rgs,6,'.'),'punct range')
        compare(inc(rgs,7,'.'),'punct range')
        rgs = ranges("a[1..n]")
        compare(inc(rgs,3,'.'),'punct range')
        compare(inc(rgs,4,'.'),'punct range')
        rgs = ranges("a[ .... ]")
        compare(inc(rgs,3,'.'),'punct')
        compare(inc(rgs,4,'.'),'punct')
        compare(inc(rgs,5,'.'),'punct')
        compare(inc(rgs,6,'.'),'punct')
        rgs = ranges("@f [1]")
        compare(inc(rgs,0,"@"),'punct function call')
        compare(inc(rgs,1,"f"),'function call')
        rgs = ranges("@f = 1")
        compare(inc(rgs,0,"@"),'punct this')
        compare(inc(rgs,1,"f"),'text this')
        rgs = ranges("@height/2 + @height/6")
        compare(inc(rgs,0,'@'),'punct this')
        compare(inc(rgs,1,'height'),'text this')
        compare(inc(rgs,8,"2"),'number')
    })
    section("function", function ()
    {
        rgs = ranges("obj.prop.call 1")
        compare(inc(rgs,0,'obj'),'obj')
        compare(inc(rgs,4,'prop'),'property')
        compare(inc(rgs,9,'call'),'function call')
        rgs = ranges("dolater =>")
        compare(inc(rgs,8,'='),'punct function bound tail')
        compare(inc(rgs,9,'>'),'punct function bound head')
        rgs = ranges("dolater ->")
        compare(inc(rgs,8,'-'),'punct function tail')
        compare(inc(rgs,9,'>'),'punct function head')
        rgs = ranges("async ○->")
        compare(inc(rgs,6,'○'),'punct function async')
        compare(inc(rgs,7,'-'),'punct function tail')
        compare(inc(rgs,8,'>'),'punct function head')
        rgs = ranges("@a @b 'c'")
        compare(inc(rgs,0,'@'),'punct function call')
        compare(inc(rgs,1,'a'),'function call')
        compare(inc(rgs,3,'@'),'punct function call')
        compare(inc(rgs,4,'b'),'function call')
        rgs = ranges("@a 3 @b '5'")
        compare(inc(rgs,0,'@'),'punct function call')
        compare(inc(rgs,1,'a'),'function call')
        rgs = ranges("fff 1")
        compare(inc(rgs,0,"fff"),'function call')
        rgs = ranges("f 'a'")
        compare(inc(rgs,0,"f"),'function call')
        rgs = ranges("ff 'b'")
        compare(inc(rgs,0,"ff"),'function call')
        rgs = ranges("ffff -1")
        compare(inc(rgs,0,"ffff"),'function call')
        rgs = ranges("f [1]")
        compare(inc(rgs,0,"f"),'function call')
        rgs = ranges("fffff {1}")
        compare(inc(rgs,0,"fffff"),'function call')
        rgs = ranges("i ++a")
        compare(inc(rgs,0,'i'),'function call')
        rgs = ranges("i +4")
        compare(inc(rgs,0,'i'),'function call')
        rgs = ranges("i -4")
        compare(inc(rgs,0,'i'),'function call')
        rgs = ranges("pos= (item, p) -> ")
        compare(inc(rgs,0,"pos"),'function')
        rgs = ranges("i != false")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i += 1")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i -= 1")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i *= 1")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i /= 1")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i ? false")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i < 3")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i > 3")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i + 3")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i - 3")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i * 3")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i / 3")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i % 3")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i = 3")
        compare(inc(rgs,0,'i'),'text')
        rgs = ranges("i == 3")
        compare(inc(rgs,0,'i'),'text')
    })
    section("triple regexp", function ()
    {
        rgs = ranges("///a///,b")
        compare(inc(rgs,0,"/"),'punct regexp triple')
        compare(inc(rgs,1,"/"),'punct regexp triple')
        compare(inc(rgs,2,"/"),'punct regexp triple')
        compare(inc(rgs,3,"a"),'text regexp triple')
        compare(inc(rgs,4,"/"),'punct regexp triple')
        compare(inc(rgs,5,"/"),'punct regexp triple')
        compare(inc(rgs,6,"/"),'punct regexp triple')
        compare(inc(rgs,8,"b"),'text')
        dss = dissect("///\na\n///")
        compare(inc(dss[0],0,"/"),'punct regexp triple')
        compare(inc(dss[0],1,"/"),'punct regexp triple')
        compare(inc(dss[0],2,"/"),'punct regexp triple')
        compare(inc(dss[1],0,"a"),'text regexp triple')
        compare(inc(dss[2],0,"/"),'punct regexp triple')
        compare(inc(dss[2],1,"/"),'punct regexp triple')
        compare(inc(dss[2],2,"/"),'punct regexp triple')
        dss = dissect(`///
    ([\\\\?]) # comment
///, a`)
        compare(inc(dss[0],0,"/"),'punct regexp triple')
        compare(inc(dss[0],1,"/"),'punct regexp triple')
        compare(inc(dss[0],2,"/"),'punct regexp triple')
        compare(inc(dss[1],4,"("),'punct minor regexp triple')
        compare(inc(dss[1],6,"\\"),'punct escape regexp triple')
        compare(inc(dss[1],12,"#"),'punct comment')
        compare(inc(dss[1],14,"comment"),'comment')
        compare(inc(dss[2],0,"/"),'punct regexp triple')
        compare(inc(dss[2],1,"/"),'punct regexp triple')
        compare(inc(dss[2],2,"/"),'punct regexp triple')
        compare(inc(dss[2],5,"a"),'text')
        dss = dissect(`arr = [ ///a\#{b}///
        key: 'value'
      ]`)
        compare(inc(dss[1],8,'key'),'dictionary key')
    })
    section("comment header", function ()
    {
        rgs = ranges("# 0 00 0000")
        compare(inc(rgs,0,"#"),'punct comment')
        compare(inc(rgs,2,"0"),'comment header')
        compare(inc(rgs,4,"00"),'comment header')
        compare(inc(rgs,7,"0000"),'comment header')
        dss = dissect("###\n 0 00 0 \n###")
        compare(inc(dss[1],1,"0"),'comment triple header')
        rgs = ranges("# 0 * 0.2")
        compare(inc(rgs,2,'0'),'comment')
        compare(inc(rgs,6,'0'),'comment')
        dss = dissect("###\n 0 1 0 \n###")
        compare(inc(dss[1],1,"0"),'comment triple')
    })
}
toExport["coffee"]._section_ = true
toExport._test_ = true
export default toExport