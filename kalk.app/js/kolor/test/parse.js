var toExport = {}
var _k_

var b, ext, lang, parse

import kolor from "../kolor.js"

ext = 'coffee'

lang = function (l)
{
    return ext = l
}

parse = function (c, e)
{
    return kolor.parse(c.split('\n'),(e != null ? e : ext))
}
toExport["parse"] = function ()
{
    section("comment", function ()
    {
        lang('coffee')
        compare(parse("##"),[{chunks:[{start:0,length:1,match:"#",turd:"##",clss:'punct comment'},{start:1,length:1,match:"#",clss:'comment'}],chars:2,index:0,number:1,ext:'coffee'}])
        compare(parse(",#a"),[{chunks:[{start:0,length:1,match:",",turd:",#",clss:'punct minor'},{start:1,length:1,match:"#",clss:'punct comment'},{start:2,length:1,match:"a",clss:'comment'}],chars:3,index:0,number:1,ext:'coffee'}])
    })
    section("function", function ()
    {
        compare(parse('->'),[{chunks:[{start:0,length:1,match:'-',turd:'->',clss:'punct function tail'},{start:1,length:1,match:'>',clss:'punct function head'}],chars:2,index:0,number:1,ext:'coffee'}])
        compare(parse('=>'),[{chunks:[{start:0,length:1,match:'=',turd:'=>',clss:'punct function bound tail'},{start:1,length:1,match:'>',clss:'punct function bound head'}],chars:2,index:0,number:1,ext:'coffee'}])
        compare(parse('f=->1'),[{chunks:[{start:0,length:1,match:'f',clss:'function'},{start:1,length:1,match:'=',turd:'=->',clss:'punct function'},{start:2,length:1,match:'-',turd:'->',clss:'punct function tail'},{start:3,length:1,match:'>',clss:'punct function head'},{start:4,length:1,match:'1',clss:'number'}],chars:5,index:0,number:1,ext:'coffee'}])
    })
    section("minimal", function ()
    {
        compare(parse('1'),[{chunks:[{start:0,length:1,match:'1',clss:'number'}],chars:1,index:0,number:1,ext:'coffee'}])
        compare(parse('a'),[{chunks:[{start:0,length:1,match:'a',clss:'text'}],chars:1,index:0,number:1,ext:'coffee'}])
        compare(parse('.'),[{chunks:[{start:0,length:1,match:'.',clss:'punct'}],chars:1,index:0,number:1,ext:'coffee'}])
        compare(parse('1.a'),[{chunks:[{start:0,length:1,match:'1',clss:'number'},{start:1,length:1,match:'.',clss:'punct property'},{start:2,length:1,match:'a',clss:'property'}],chars:3,index:0,number:1,ext:'coffee'}])
        compare(parse('++a'),[{chunks:[{start:0,length:1,match:'+',turd:'++',clss:'punct'},{start:1,length:1,match:'+',clss:'punct'},{start:2,length:1,match:'a',clss:'text'}],chars:3,index:0,number:1,ext:'coffee'}])
    })
    section("space", function ()
    {
        b = parse("x")
        compare(b[0].chunks[0].start,0)
        b = parse(" xx")
        compare(b[0].chunks[0].start,1)
        b = parse("    xxx")
        compare(b[0].chunks[0].start,4)
        b = parse("    x 1  , ")
        compare(b[0].chunks[0].start,4)
        compare(b[0].chunks[1].start,6)
        compare(b[0].chunks[2].start,9)
    })
}
toExport["parse"]._section_ = true
toExport["globalize"] = function ()
{
    section("enable", function ()
    {
        kolor.klor.globalize()
        compare(global['red'],kolor.klor.red)
        compare(global['red']('txt'),kolor.klor.red('txt'))
    })
    section("disable", function ()
    {
        kolor.klor.globalize(false)
        compare(global['red']('txt'),'txt')
    })
}
toExport["globalize"]._section_ = true
toExport._test_ = true
export default toExport
