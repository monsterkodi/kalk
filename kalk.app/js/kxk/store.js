var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Store

import noon from "./noon.js"
import events from "./events.js"
import slash from "./slash.js"
import post from "./post.js"
import ffs from "./ffs.js"
import sds from "./sds.js"

import util from "./util.js"
let isEqual = util.isEqual
let defaults = util.defaults


Store = (function ()
{
    _k_.extend(Store, events)
    Store["stores"] = {}
    function Store (name, opt = {})
    {
        var _24_22_, _25_22_

        this["save"] = this["save"].bind(this)
        this["load"] = this["load"].bind(this)
        this["reload"] = this["reload"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this["delayedSave"] = this["delayedSave"].bind(this)
        this["del"] = this["del"].bind(this)
        this["set"] = this["set"].bind(this)
        this["get"] = this["get"].bind(this)
        this["keypath"] = this["keypath"].bind(this)
        Store.__super__.constructor.call(this)
        this.name = name
        opt.separator = ((_24_22_=opt.separator) != null ? _24_22_ : '|')
        opt.timeout = ((_25_22_=opt.timeout) != null ? _25_22_ : 4000)
        if (!this.name)
        {
            return console.error('no name for store?')
        }
        this.sep = opt.separator
        this.file = slash.path(kakao.bundle.path,`/.stash/${this.name}.noon`)
        post.on('store',(function (name, action, ...argl)
        {
            if (this.name !== name)
            {
                return
            }
            switch (action)
            {
                case 'data':
                    return this.data = argl[0]

                case 'set':
                    return sds.set(this.data,this.keypath(argl[0]),argl[1])

                case 'get':
                    return sds.get(this.data,this.keypath(argl[0]),argl[1])

                case 'del':
                    return sds.del(this.data,this.keypath(argl[0]))

            }

        }).bind(this))
        this.load().then((function ()
        {
            defaults(this.data,opt.defaults)
            return post.emit(`${this.name}Loaded`)
        }).bind(this))
    }

    Store.prototype["keypath"] = function (key)
    {
        return key.split(this.sep)
    }

    Store.prototype["get"] = function (key, value)
    {
        var _60_45_

        if (!((key != null ? key.split : undefined) != null))
        {
            return _k_.clone((value))
        }
        return _k_.clone(sds.get(this.data,this.keypath(key),value))
    }

    Store.prototype["set"] = function (key, value)
    {
        var _78_14_

        if (!(_k_.isStr(key)))
        {
            return
        }
        if (isEqual(this.get(key),value))
        {
            return
        }
        if (this.get(key) === value)
        {
            return
        }
        if (_k_.empty(value))
        {
            return this.del(key)
        }
        this.data = ((_78_14_=this.data) != null ? _78_14_ : {})
        sds.set(this.data,this.keypath(key),value)
        this.delayedSave()
        return post.toWins('store',this.name,'set',key,value)
    }

    Store.prototype["del"] = function (key)
    {
        if (!this.data)
        {
            return
        }
        sds.del(this.data,this.keypath(key))
        this.delayedSave()
        return post.toWins('store',this.name,'del',key)
    }

    Store.prototype["delayedSave"] = function ()
    {
        clearTimeout(this.timer)
        return this.timer = setTimeout(((function ()
        {
            return this.save()
        }).bind(this)),this.timeout)
    }

    Store.prototype["clear"] = function ()
    {
        this.data = {}
        if (this.timer)
        {
            clearTimeout(this.timer)
        }
        return post.toWins('store',this.name,'data',{})
    }

    Store.prototype["reload"] = function ()
    {
        return this.load().then(function ()
        {
            return post.toWins('store',this.name,'data',this.data)
        })
    }

    Store.prototype["load"] = async function ()
    {
        try
        {
            return this.data = await noon.load(this.file)
        }
        catch (err)
        {
            console.error(`store.save -- can't load '${this.file}':`,err)
            return {}
        }
    }

    Store.prototype["save"] = async function ()
    {
        var text

        if (!this.file)
        {
            return
        }
        if (_k_.empty(this.data))
        {
            return
        }
        clearTimeout(this.timer)
        this.timer = null
        try
        {
            text = noon.stringify(this.data,{indent:2,maxalign:8}) + '\n'
            return await ffs.write(this.file,text)
        }
        catch (err)
        {
            console.error(`store.save -- can't save to '${this.file}:`,err)
        }
    }

    return Store
})()

export default Store;