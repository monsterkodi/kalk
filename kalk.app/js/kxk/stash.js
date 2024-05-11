var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Stash

import noon from "./noon.js"
import post from "./post.js"
import slash from "./slash.js"
import sds from "./sds.js"
import kstr from "./kstr.js"
import ffs from "./ffs.js"

import util from "./util.js"
let defaults = util.defaults
let isEqual = util.isEqual


Stash = (function ()
{
    function Stash (name, opt)
    {
        var _22_34_, _25_32_, _29_61_

        this.name = name
    
        this["save"] = this["save"].bind(this)
        if (!this.name)
        {
            return console.error('stash.constructor -- no name?')
        }
        this.sep = ((_22_34_=(opt != null ? opt.separator : undefined)) != null ? _22_34_ : '|')
        this.timer = null
        this.file = slash.path(kakao.bundle.path,`/.stash/${this.name}.noon`)
        this.timeout = ((_25_32_=(opt != null ? opt.timeout : undefined)) != null ? _25_32_ : 500)
        this.changes = []
        this.data = {}
        if (((opt != null ? opt.defaults : undefined) != null))
        {
            this.data = defaults(this.data,opt.defaults)
        }
        this.load()
    }

    Stash.prototype["keypath"] = function (key)
    {
        return key.split(this.sep)
    }

    Stash.prototype["get"] = function (key, value)
    {
        if (!(_k_.isStr(key)))
        {
            console.error('stash.get -- invalid key',key)
        }
        if (!(_k_.isStr(key)))
        {
            return value
        }
        return sds.get(this.data,this.keypath(key),value)
    }

    Stash.prototype["set"] = function (key, value)
    {
        if (!(_k_.isStr(key)))
        {
            return console.error('stash.set -- invalid key',key)
        }
        if (!isEqual(value,sds.get(this.data,this.keypath(key))))
        {
            sds.set(this.data,this.keypath(key),value)
            if (!isEqual(value,sds.get(this.data,this.keypath(key))))
            {
                console.warn('sds.set fail?',key,value,this.data)
            }
            if (this.timer)
            {
                clearTimeout(this.timer)
            }
            return this.timer = setTimeout(this.save,this.timeout)
        }
    }

    Stash.prototype["del"] = function (key)
    {
        return this.set(key)
    }

    Stash.prototype["isEmpty"] = function ()
    {
        return _k_.empty(this.data)
    }

    Stash.prototype["clear"] = function ()
    {
        this.data = {}
        clearTimeout(this.timer)
        this.timer = null
        return ffs.remove(this.file)
    }

    Stash.prototype["load"] = async function (file)
    {
        var data

        file = (file != null ? file : this.file)
        data = await noon.load(file)
        if (!_k_.empty(data))
        {
            this.data = data
            post.emit('stashLoaded')
        }
        return this.data
    }

    Stash.prototype["save"] = function ()
    {
        var text

        clearTimeout(this.timer)
        this.timer = null
        if (!this.file)
        {
            return
        }
        try
        {
            text = noon.stringify(this.data)
            ffs.write(this.file,text).then(function (file)
            {})
        }
        catch (err)
        {
            console.error(`stash.save -- can't save to '${this.file}': ${err}`)
        }
        return true
    }

    return Stash
})()

export default Stash;