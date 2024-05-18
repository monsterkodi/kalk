var toExport = {}
import linediff from "../linediff.js"

toExport["linediff"] = function ()
{
    compare(linediff('','y'),[{index:0,length:1}])
    compare(linediff('x','y'),[{index:0,length:1}])
    compare(linediff('xy','z'),[{index:0,length:1}])
    compare(linediff('x','yz'),[{index:0,length:2}])
    compare(linediff('ABC',''),[])
    compare(linediff('ABC','A'),[{index:0,length:1}])
    compare(linediff('ABC','AB'),[{index:0,length:2}])
    compare(linediff('ABC','AC'),[{index:0,length:2}])
    compare(linediff('ABC','ABC'),[])
    compare(linediff('ABCD','ABC'),[{index:0,length:3}])
    compare(linediff('ABC','AbC'),[{index:0,length:3}])
    compare(linediff('C D E','CxDyE'),[{index:0,length:5}])
    compare(linediff('C','ABBB'),[{index:0,length:4}])
    compare(linediff('xyz',' x y z '),[{index:1,length:1},{index:3,length:1},{index:5,length:1}])
    compare(linediff('t = w','t  =  w'),[])
    compare(linediff('if diff','continue if not diff'),[{index:0,length:8},{index:12,length:3}])
    compare(linediff("       when 'change' then return false","       when 'change' ➜ return false"),[{index:21,length:1}])
    compare(linediff("       when 'delete' then deletes++","       when 'delete' ➜ deletes++"),[{index:21,length:1}])
    compare(linediff("       when 'insert' then inserts++","       when 'insert' ➜ inserts++"),[{index:21,length:1}])
    compare(linediff('window.terminal.appendMeta','if spacer ➜ window.terminal.appendMeta'),[{index:0,length:2},{index:3,length:6},{index:10,length:1}])
    compare(linediff('  window.terminal.appendMeta','  if spacer ➜ window.terminal.appendMeta'),[{index:2,length:2},{index:5,length:6},{index:12,length:1}])
    compare(linediff("       when 'change' then return false","       'change' ➜ return false"),[{index:16,length:1}])
    compare(linediff("       when 'delete' then deletes++","       'delete' ➜ deletes++"),[{index:16,length:1}])
    compare(linediff("       when 'insert' then inserts++","       'insert' ➜ inserts++"),[{index:16,length:1}])
    compare(linediff("# log 'out:' out","window.terminal.clear()"),[{index:0,length:23}])
    compare(linediff("    # changes = lineDiff oldLine, newLine","    changes = lineDiff oldLine, newLine"),[])
}
toExport["linediff"]._section_ = true
toExport._test_ = true
export default toExport
