var toExport = {}
var _k_

var cb

import pepe from "../pepe.js"

toExport["pepe"] = function ()
{
    section("simple", function ()
    {
        compare(pepe(1),[])
        compare(pepe(null),[])
        compare(pepe(""),[''])
        compare(pepe(" "),[' '])
        compare(pepe("A B C"),['A B C'])
        compare(pepe(" s p a c e "),[" s p a c e "])
    })
    section("brackets", function ()
    {
        compare(pepe("()"),[{start:'(',content:[],end:')'}])
        compare(pepe("(())"),[{start:'(',content:[{start:'(',content:[],end:')'}],end:')'}])
        compare(pepe("A ( B ) C"),['A ',{start:'(',content:[' B '],end:')'},' C'])
        compare(pepe("A ({ B }) C"),['A ',{start:'(',content:[{start:'{',content:[' B '],end:'}'}],end:')'},' C'])
        compare(pepe("A ({[B]}) C"),['A ',{start:'(',content:[{start:'{',content:[{start:'[',content:['B'],end:']'}],end:'}'}],end:')'},' C'])
        compare(pepe("A [[[B]]] C"),['A ',{start:'[',content:[{start:'[',content:[{start:'[',content:['B'],end:']'}],end:']'}],end:']'},' C'])
    })
    section("unbalanced", function ()
    {
        compare(pepe("("),{unbalanced:[{content:[]},{start:'(',content:[]}]})
        compare(pepe(";(("),{unbalanced:[{content:[';']},{start:'(',content:[]},{start:'(',content:[]}]})
        compare(pepe(";(8("),{unbalanced:[{content:[';']},{start:'(',content:['8']},{start:'(',content:[]}]})
        compare(pepe(";(8)("),{unbalanced:[{content:[';',{start:'(',content:['8'],end:')'}]},{start:'(',content:[]}]})
        compare(pepe(";(8)(xxx"),{unbalanced:[{content:[';',{start:'(',content:['8'],end:')'}]},{start:'(',content:[]}],tail:'xxx'})
    })
    section("mismatch", function ()
    {
        compare(pepe("}"),{mismatch:[{content:[]}],tail:'}'})
        compare(pepe(")"),{mismatch:[{content:[]}],tail:')'})
        compare(pepe("]"),{mismatch:[{content:[]}],tail:']'})
        compare(pepe("(])"),{mismatch:[{content:[]},{start:'(',content:[]}],tail:'])'})
        compare(pepe("(]"),{mismatch:[{content:[]},{start:'(',content:[]}],tail:']'})
        compare(pepe("(]xxx"),{mismatch:[{content:[]},{start:'(',content:[]}],tail:']xxx'})
        compare(pepe("(xxx]"),{mismatch:[{content:[]},{start:'(',content:['xxx']}],tail:']'})
    })
    section("strings", function ()
    {
        compare(pepe("''"),[{start:"'",content:[],end:"'"}])
        compare(pepe("'x'"),[{start:"'",content:['x'],end:"'"}])
        compare(pepe("'"),{unbalanced:[{content:[]},{start:"'",content:[]}]})
        compare(pepe('"'),{unbalanced:[{content:[]},{start:'"',content:[]}]})
        compare(pepe("'()'"),[{start:"'",content:['()'],end:"'"}])
        compare(pepe("'(]}'"),[{start:"'",content:['(]}'],end:"'"}])
        compare(pepe("'\"'"),[{start:"'",content:['"'],end:"'"}])
        compare(pepe("'\"\"\"'"),[{start:"'",content:['"""'],end:"'"}])
        compare(pepe("str: '}])([{'"),['str: ',{start:"'",content:['}])([{'],end:"'"}])
    })
    section("depepe", function ()
    {
        cb = function (s)
        {
            return s.toLowerCase()
        }
        compare(pepe.depepe(pepe("A ( B ) C"),cb),"A ( b ) C")
        compare(pepe.depepe(pepe("A ({ B }) C"),cb),"A ({ b }) C")
    })
}
toExport["pepe"]._section_ = true
toExport._test_ = true
export default toExport
