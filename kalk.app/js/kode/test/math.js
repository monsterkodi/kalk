var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["math"] = function ()
{
    compare(ke("2 * 2"),4)
    compare(ke("2 + 2"),4)
    compare(ke("2 ** 2"),4)
}
toExport["math"]._section_ = true
toExport._test_ = true
export default toExport
