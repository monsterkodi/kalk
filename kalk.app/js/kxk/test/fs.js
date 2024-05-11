var toExport = {}
var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, file: function () { return import.meta.url.substring(7); }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var t, _130_21_, _131_21_, _132_21_, _21_24_, _22_25_, _23_44_, _30_29_, _31_28_, _35_27_, _36_28_, _46_21_, _47_22_, _51_27_, _52_25_

import fs from "../fs.js"
import slash from "../slash.js"

toExport["fs"] = function ()
{
    section("exists", function ()
    {
        compare(((fs.exists(_k_.dir()) != null)),true)
        compare(((fs.exists(_k_.file()) != null)),true)
        compare(((fs.exists(slash.path(_k_.file(),'foo')) != null)),false)
        fs.exists(_k_.file(),function (stat)
        {
            return compare(((stat != null)),true)
        })
        fs.exists(slash.path(_k_.file(),'foo'),function (stat)
        {
            return compare(((stat != null)),false)
        })
    })
    section("fileExists", function ()
    {
        compare(((fs.fileExists(_k_.file()) != null)),true)
        compare(((fs.fileExists(_k_.dir()) != null)),false)
    })
    section("dirExists", function ()
    {
        compare(((fs.dirExists(_k_.dir()) != null)),true)
        compare(((fs.dirExists(_k_.file()) != null)),false)
    })
    section("pkg", function ()
    {
        compare(((fs.pkg(_k_.dir()) != null)),true)
        compare(((fs.pkg(_k_.file()) != null)),true)
        if (slash.win())
        {
            compare(((fs.pkg('C:\\') != null)),false)
            compare(((fs.pkg('C:') != null)),false)
        }
    })
    section("read", function ()
    {
        fs.read(_k_.dir() + '/../../package.noon',function (text)
        {
            return compare(text,function (a)
            {
                return a.startsWith('name')
            })
        })
        fs.read(_k_.dir() + '/dir/filedoesntexist',function (text)
        {
            return compare(text,'')
        })
    })
    section("dirlist", function ()
    {
        process.chdir(_k_.dir())
        fs.list(_k_.dir()).then(function (items)
        {
            return compare(items.map(function (i)
            {
                return i.path
            }),function (a)
            {
                return _k_.in(slash.path(_k_.file()),a)
            })
        })
    })
    section("tmpfile", function ()
    {
        compare(slash.tmpfile('txt'),function (a)
        {
            return /\.txt$/.test(a)
        })
        compare(slash.tmpfile(),function (a)
        {
            return /[a-f\d]+$/.test(a)
        })
    })
    section("remove", function ()
    {
        t = fs.touch(slash.tmpfile())
        compare(((fs.isFile(t) != null)),true)
        compare(((fs.remove(t) != null)),false)
        compare(((fs.isFile(t) != null)),false)
    })
}
toExport["fs"]._section_ = true
toExport._test_ = true
export default toExport
