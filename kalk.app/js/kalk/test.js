var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var l, list, t

import calc from "./calc.js"

toExport["calc"] = function ()
{
    section("calc", function ()
    {
        list = [['2^2^2','16'],['2^(3^4)','2.4178516392292583e+24'],['2^3^4','2.4178516392292583e+24'],['(2^3)^4','4096'],['9*-3','-27'],['180°','3.141592653589793'],['√(9)','3'],['√(8+1','3'],['log(ℇ','1'],['cos(π','-1'],['sin(π/2','1'],['cos(sin(π','1'],['1/0','∞'],['1/(∞','0'],['0/0','']]
        var list1 = _k_.list(list)
        for (var _32_14_ = 0; _32_14_ < list1.length; _32_14_++)
        {
            l = list1[_32_14_]
            compare(calc.calc(l[0]),l[1])
        }
    })
    section("equals", function ()
    {
        list = [['2^2','=','4'],['2^4','=','16'],['2^2^2','=','16']]
        var list2 = _k_.list(list)
        for (var _42_14_ = 0; _42_14_ < list2.length; _42_14_++)
        {
            l = list2[_42_14_]
            compare(calc.textKey(l[0],l[1]),l[2])
        }
    })
    section("replace", function ()
    {
        list = [['2^0','1'],['2^0','2'],['∞','3']]
        var list3 = _k_.list(list)
        for (var _52_14_ = 0; _52_14_ < list3.length; _52_14_++)
        {
            l = list3[_52_14_]
            compare(calc.textKey(l[0],l[1]),l[0].substr(0,l[0].length - 1) + l[1])
        }
    })
    section("block", function ()
    {
        list = [[['0','0°','ℇ','π'],'0'],[['1°','ℇ','π'],'1'],[['2°','ℇ','π'],'π'],[['3°','ℇ','π'],'ℇ'],[['','4^'],'^'],[['','5.','5°','5.5'],'.'],[['','6.','6/'],'/'],[['','7.','7*'],'*'],[['8°','8.','ℇ','π'],'°'],[['9.'],'√'],[['','(','2+2','((2+2)*3)'],')']]
        var list4 = _k_.list(list)
        for (var _70_14_ = 0; _70_14_ < list4.length; _70_14_++)
        {
            l = list4[_70_14_]
            var list5 = _k_.list(l[0])
            for (var _71_18_ = 0; _71_18_ < list5.length; _71_18_++)
            {
                t = list5[_71_18_]
                compare(calc.textKey(t,l[1]),t)
            }
        }
    })
}
toExport["calc"]._section_ = true
toExport._test_ = true
export default toExport
