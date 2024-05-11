var _k_ = {last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

var gonzo

import kstr from "./kstr.js"


gonzo = function (str)
{
    var indent, line, lines, lst, stack, top, _49_25_, _55_21_

    lines = str.split('\n')
    stack = [{indent:-1,blck:[]}]
    while (line = lines.shift())
    {
        top = _k_.last(stack)
        indent = 0
        while (line[indent] === ' ')
        {
            indent++
        }
        line = line.slice(indent)
        if (lst = _k_.last(top.blck))
        {
            if (indent > lst.indent)
            {
                lst.blck = ((_49_25_=lst.blck) != null ? _49_25_ : [])
                lst.blck.push({line:line,indent:indent})
                stack.push(lst)
                continue
            }
        }
        if (indent > top.indent)
        {
            top.blck = ((_55_21_=top.blck) != null ? _55_21_ : [])
            top.blck.push({line:line,indent:indent})
            continue
        }
        while (indent <= top.indent && stack.length > 1)
        {
            stack.pop()
            top = _k_.last(stack)
        }
        top.blck.push({line:line,indent:indent})
    }
    return stack[0].blck
}
export default gonzo;