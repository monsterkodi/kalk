var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["return"] = function ()
{
    compare(kc('-> return 1'),`(function ()
{
    return 1
})`)
    compare(kc('f = -> 1'),`
f = function ()
{
    return 1
}`)
    compare(kc('f = -> ⮐ 2'),`
f = function ()
{
    return 2
}`)
    compare(kc('f = -> if true ➜ 4 else 5'),`
f = function ()
{
    if (true)
    {
        return 4
    }
    else
    {
        return 5
    }
}`)
    compare(kc('f = -> if true ➜ 4 else ⮐ 5'),`
f = function ()
{
    if (true)
    {
        return 4
    }
    else
    {
        return 5
    }
}`)
    compare(kc(`f = -> 
    if true 
        ⮐ 4 
    else ⮐ 5`),`
f = function ()
{
    if (true)
    {
        return 4
    }
    else
    {
        return 5
    }
}`)
    compare(kc(`f = -> 
    switch a
        '1' ➜ ⮐ 4 
        '2' ➜ ⮐ 5 `),`
f = function ()
{
    switch (a)
    {
        case '1':
            return 4

        case '2':
            return 5

    }

}`)
}
toExport["return"]._section_ = true
toExport._test_ = true
export default toExport
