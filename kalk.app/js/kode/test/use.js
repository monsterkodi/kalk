var toExport = {}
var _k_ = {file: function () { return import.meta.url.substring(7); }}

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["use"] = function ()
{
    compare(kc('use blark'),'import blark from "blark"\n')
    compare(kc('use flubb',_k_.file()),'import flubb from "flubb"\n')
    compare(kc('use ./loops',_k_.file()),'import loops from "./loops.js"\n')
    compare(kc('use ../returner',_k_.file()),'import returner from "../returner.js"\n')
    compare(kc('use ./kode/kode',_k_.file()),'import kode from "./kode/kode.js"\n')
    compare(kc('use ./loops'),'import loops from "./loops.js"\n')
    compare(kc('use ../returner'),'import returner from "../returner.js"\n')
    compare(kc('use ./kode/kode'),'import kode from "./kode/kode.js"\n')
    compare(kc('use ./noon'),'import noon from "./noon.js"\n')
    compare(kc('use mod1 mod2'),`import mod1 from "mod1"
import mod2 from "mod2"\n`)
    compare(kc('use mod3 mod4',_k_.file()),`import mod3 from "mod3"
import mod4 from "mod4"\n`)
    compare(kc(`use mod5
use ./mod6
use mod7`),`import mod5 from "mod5"\n
import mod6 from "./mod6.js"\n
import mod7 from "mod7"\n`)
    section("items", function ()
    {
        compare(kc('use ./kxk ▪ slash noon'),`import kxk from "./kxk.js"
let slash = kxk.slash
let noon = kxk.noon
`)
        compare(kc('use ./lib_ko ▪ moment immutable fuzzy pbytes '),`import lib_ko from "./lib_ko.js"
let moment = lib_ko.moment
let immutable = lib_ko.immutable
let fuzzy = lib_ko.fuzzy
let pbytes = lib_ko.pbytes
`)
    })
    section("named", function ()
    {
        compare(kc('use ./file ● File'),`import File from "./file.js"
`)
    })
    section("folder", function ()
    {
        compare(kc('use ◆ A B c'),`import A from "./A.js"
import B from "./B.js"
import c from "./c.js"
`)
        compare(kc('use ../sibling ◆ Sister Brother'),`import Sister from "../sibling/Sister.js"
import Brother from "../sibling/Brother.js"
`)
        compare(kc('use ../../Parents ◆ mom dad'),`import mom from "../../Parents/mom.js"
import dad from "../../Parents/dad.js"
`)
    })
}
toExport["use"]._section_ = true
toExport._test_ = true
export default toExport
