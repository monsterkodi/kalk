var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["export"] = function ()
{
    compare(kc('export { export1, export2 }'),'export { export1 , export2 };')
    compare(kc('export { export1, export2 as blark }'),'export { export1 , export2 as blark };')
    compare(kc(`export
    k: 1
    $: 2`),`export default {k:1,$:2}`)
    compare(kc(`export
    elem: elem
    $: (a) -> log a`),`export default {elem:elem,$:function (a)
{
    console.log(a)
}}`)
    compare(kc('export single'),'export default single;')
    compare(kc('d = { export:1 }'),'d = {export:1}')
}
toExport["export"]._section_ = true
toExport._test_ = true
export default toExport
