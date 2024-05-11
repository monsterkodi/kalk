var _k_ = {clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var Prefs

import slash from "./slash.js"
import store from "./store.js"


Prefs = (function ()
{
    function Prefs ()
    {}

    Prefs["store"] = null
    Prefs["init"] = function ()
    {
        var _19_64_

        if ((this.store != null))
        {
            return console.error('prefs.init -- duplicate stores?')
        }
        return this.store = new store('prefs')
    }

    Prefs["get"] = function (key, value)
    {
        return (this.store ? this.store.get(key,value) : _k_.clone(value))
    }

    Prefs["set"] = function (key, value)
    {
        var _23_30_

        return (this.store != null ? this.store.set(key,value) : undefined)
    }

    Prefs["del"] = function (key, value)
    {
        var _24_30_

        return (this.store != null ? this.store.del(key) : undefined)
    }

    Prefs["save"] = function ()
    {
        var _25_30_

        return (this.store != null ? this.store.save() : undefined)
    }

    Prefs["toggle"] = function (key)
    {
        var val

        val = !this.get(key,false)
        this.set(key,val)
        return val
    }

    return Prefs
})()

export default Prefs;