var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import elem from "./elem.js"

export default {elem:elem,$:function (idOrQueryOrElement, queryOrElement = document)
{
    if (_k_.isStr(idOrQueryOrElement))
    {
        if (_k_.in(idOrQueryOrElement[0],['.',"#"]) || queryOrElement !== document)
        {
            return queryOrElement.querySelector(idOrQueryOrElement)
        }
        else
        {
            return document.getElementById(idOrQueryOrElement)
        }
    }
    else if (elem.isElement(idOrQueryOrElement) && _k_.isStr(queryOrElement))
    {
        return idOrQueryOrElement.querySelector(queryOrElement)
    }
    else
    {
        return idOrQueryOrElement
    }
},childIndex:function (e)
{
    return Array.prototype.indexOf.call(e.parentNode.childNodes,e)
},sw:function ()
{
    return document.body.clientWidth
},sh:function ()
{
    return document.body.clientHeight
},stopEvent:function (event)
{
    if ((event != null) && typeof(event.preventDefault) === 'function' && typeof(event.stopPropagation) === 'function')
    {
        event.preventDefault()
        event.stopPropagation()
    }
    return event
},setStyle:function (selector, key, value, ssid = 0)
{
    var rule

    var list = _k_.list(document.styleSheets[ssid].cssRules)
    for (var _45_17_ = 0; _45_17_ < list.length; _45_17_++)
    {
        rule = list[_45_17_]
        if (rule.selectorText === selector)
        {
            rule.style[key] = value
            return
        }
    }
    document.styleSheets[ssid].insertRule(`${selector} { ${key}: ${value} }`,document.styleSheets[ssid].cssRules.length)
    return
},getStyle:function (selector, key, value)
{
    var rule, styleSheet

    var list = _k_.list(document.styleSheets)
    for (var _54_23_ = 0; _54_23_ < list.length; _54_23_++)
    {
        styleSheet = list[_54_23_]
        var list1 = _k_.list(styleSheet.cssRules)
        for (var _55_21_ = 0; _55_21_ < list1.length; _55_21_++)
        {
            rule = list1[_55_21_]
            if (rule.selectorText === selector)
            {
                if ((rule.style[key] != null ? rule.style[key].length : undefined))
                {
                    return rule.style[key]
                }
            }
        }
    }
    return value
}}