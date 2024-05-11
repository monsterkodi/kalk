var toExport = {}
var _k_

import utils from "./utils.js"
let ast = utils.ast

toExport["ast"] = function ()
{
    section("simple", function ()
    {
        compare(ast('a'),'a')
        compare(ast('1'),'1')
        compare(ast('no'),'no')
        compare(ast('1;2'),'1\n2')
    })
    section("operation", function ()
    {
        compare(ast('a and b'),`operation
    lhs
        a
    operator
        and
    rhs
        b`)
        compare(ast('1 + 2'),`operation
    lhs
        1
    operator
        +
    rhs
        2`)
        compare(ast('++a'),`operation
    operator
        ++
    rhs
        a`)
        compare(ast('not a'),`operation
    operator
        not
    rhs
        a`)
        compare(ast('a = b + 1'),`operation
    lhs
        a
    operator
        =
    rhs
        operation
            lhs
                b
            operator
                +
            rhs
                1`)
        compare(ast('a = b = c'),`operation
    lhs
        a
    operator
        =
    rhs
        operation
            lhs
                b
            operator
                =
            rhs
                c`)
        compare(ast('for a in l then a'),`for
    vals
        a
    inof
        in
    list
        l
    then
        a`)
    })
}
toExport["ast"]._section_ = true
toExport._test_ = true
export default toExport
