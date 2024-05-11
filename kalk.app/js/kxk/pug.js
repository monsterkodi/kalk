var _k_ = {rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var pug, render

import kstr from "./kstr.js"
let unfillet = kstr.unfillet
let blockFillets = kstr.blockFillets


render = function (block, text)
{
    var args, b, fromIndex, idt, p, t

    idt = _k_.rpad(block.indent)
    args = ''
    fromIndex = 1
    if (block.fillet[0].match === '#')
    {
        fromIndex = 2
    }
    if ((block.fillet[fromIndex] != null ? block.fillet[fromIndex].match : undefined) === '#')
    {
        args += ` id=\"${block.fillet[fromIndex + 1].match}\"`
        fromIndex += 2
    }
    if (block.fillet.length > fromIndex)
    {
        args += ' ' + unfillet(block.fillet.slice(fromIndex))
    }
    t = ((function ()
    {
        switch (block.fillet[0].match)
        {
            case 'doctype':
                return `<!DOCTYPE ${block.fillet[1].match}>\n`

            case 'title':
                return `<${block.fillet[0].match}>${block.fillet[1].match}</${block.fillet[0].match}>\n`

            case 'meta':
            case 'link':
            case 'script':
            case 'head':
            case 'body':
            case 'span':
            case 'html':
                return `<${block.fillet[0].match}${args}>`

            case '#':
                return `<div id=\"${block.fillet[1].match}\"${args}>`

        }

    }).bind(this))()
    if (!_k_.empty(t))
    {
        text += idt + t
    }
    if (!_k_.empty(block.blocks))
    {
        text += '\n'
        var list = _k_.list(block.blocks)
        for (var _49_14_ = 0; _49_14_ < list.length; _49_14_++)
        {
            b = list[_49_14_]
            text += render(b,'')
        }
        text += idt
    }
    p = ((function ()
    {
        switch (block.fillet[0].match)
        {
            case 'link':
            case 'meta':
                return '\n'

            case 'script':
            case 'head':
            case 'body':
            case 'span':
            case 'html':
                return `</${block.fillet[0].match}>\n`

            case '#':
                return "</div>\n"

        }

    }).bind(this))()
    if (!_k_.empty(p))
    {
        text += p
    }
    return text
}

pug = function (srcText)
{
    var block, blocks, lines, tgtText

    tgtText = ''
    lines = srcText.split('\n')
    blocks = blockFillets(lines.map(function (line)
    {
        return kstr.fillet(line,'-')
    }))
    var list = _k_.list(blocks)
    for (var _78_14_ = 0; _78_14_ < list.length; _78_14_++)
    {
        block = list[_78_14_]
        tgtText = render(block,tgtText)
    }
    return tgtText
}
export default pug;