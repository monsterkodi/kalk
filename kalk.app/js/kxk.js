var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var exp, kxk, utl

kxk = {}
import dom from "./kxk/dom.js"
import elem from "./kxk/elem.js"
import post from "./kxk/post.js"
import drag from "./kxk/drag.js"
import slash from "./kxk/slash.js"
import stash from "./kxk/stash.js"
import store from "./kxk/store.js"
import prefs from "./kxk/prefs.js"
import matchr from "./kxk/matchr.js"
import immutable from "./kxk/immutable.js"
import linediff from "./kxk/linediff.js"
import karg from "./kxk/karg.js"
import krzl from "./kxk/krzl.js"
import plot from "./kxk/plot.js"
import pretty from "./kxk/pretty.js"
import profile from "./kxk/profile.js"
import keyinfo from "./kxk/keyinfo.js"
import tooltip from "./kxk/tooltip.js"
import events from "./kxk/events.js"
import popup from "./kxk/popup.js"
import scheme from "./kxk/scheme.js"
import kstr from "./kxk/kstr.js"
import kermit from "./kxk/kermit.js"
import scooter from "./kxk/scooter.js"
import clippo from "./kxk/clippo.js"
import kpos from "./kxk/kpos.js"
import util from "./kxk/util.js"
import sds from "./kxk/sds.js"
import fps from "./kxk/fps.js"
import win from "./kxk/win.js"
import os from "./kxk/os.js"
import ffs from "./kxk/ffs.js"
import noon from "./kxk/noon.js"

var list = _k_.list("dom elem post drag slash stash store prefs matchr immutable linediff karg krzl plot pretty profile keyinfo tooltip events popup scheme kstr kermit scooter clippo kpos util sds fps win os ffs noon".split(' '))
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    exp = list[_a_]
    kxk[exp] = eval(exp)
}
var list1 = _k_.list("$ setStyle getStyle stopEvent".split(' '))
for (var _b_ = 0; _b_ < list1.length; _b_++)
{
    exp = list1[_b_]
    kxk[exp] = eval(`dom.${exp}`)
}
for (exp in util)
{
    utl = util[exp]
    kxk[exp] = utl
}
kxk.isElement = elem.isElement
export default kxk;