var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.b5=_k_.k.F256(_k_.k.b(5))

var Watch

import slash from "./slash.js"
import fs from "./fs.js"
import events from "./events.js"


Watch = (function ()
{
    _k_.extend(Watch, events)
    function Watch (path, opt)
    {
        this["onChange"] = this["onChange"].bind(this)
        Watch.__super__.constructor.call(this)
        this.dir = slash.path(path)
        this.opt = (opt != null ? opt : {})
        this.last = {}
        fs.exists(this.dir,(function (stat)
        {
            if (stat)
            {
                return this.watchDir()
            }
        }).bind(this))
    }

    Watch["dir"] = function (path, opt)
    {
        return new Watch(path,opt)
    }

    Watch["watch"] = function (path, opt)
    {
        if (opt.cb)
        {
            return fs.isDir(path,function (stat)
            {
                if (stat)
                {
                    return opt.cb(Watch.dir(path,opt))
                }
                else
                {
                    return opt.cb(Watch.file(path,opt))
                }
            })
        }
        else
        {
            if (fs.isDir(path))
            {
                return Watch.dir(path,opt)
            }
            else
            {
                return Watch.file(path,opt)
            }
        }
    }

    Watch["file"] = function (path, opt)
    {
        var w

        w = Watch.dir(slash.dir(path),opt)
        w.file = slash.path(path)
        return w
    }

    Watch.prototype["watchDir"] = async function ()
    {
        var change, item, items, watch

        if (!this.dir)
        {
            return
        }
        this.watch = fs.watch(this.dir)
        this.watch.on('error',(function (err)
        {
            console.error(`watch dir:'${this.dir}' error: ${err}`)
        }).bind(this))
        this.watch.on('change',this.onChange)
        if (this.opt.recursive)
        {
            items = await fs.list(this.dir)
            this.watchers = []
            var list = _k_.list(items)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                item = list[_a_]
                if (item.type === 'dir')
                {
                    if (_k_.in(item.file,['node_modules','.git']))
                    {
                        console.log(_k_.b5(item.file))
                        continue
                    }
                    watch = fs.watch(item.path)
                    this.watchers.push(watch)
                    change = (function (dir)
                    {
                        return (function (chg, pth)
                        {
                            return this.onChange(chg,pth,dir)
                        }).bind(this)
                    }).bind(this)
                    watch.on('error',function (err)
                    {
                        console.error(`watch subdir:'${item.path}' error: ${err}`)
                    })
                    watch.on('change',change(item.path))
                }
            }
        }
    }

    Watch.prototype["ignore"] = function (path)
    {
        var regex

        if (this.opt.ignore)
        {
            var list = _k_.list(this.opt.ignore)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                regex = list[_a_]
                if (new RegExp(regex).test(path))
                {
                    return true
                }
            }
        }
    }

    Watch.prototype["close"] = function ()
    {
        var watch, _102_14_

        ;(this.watch != null ? this.watch.close() : undefined)
        delete this.watch
        delete this.dir
        if (this.opt.recursive)
        {
            var list = _k_.list(this.watchers)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                watch = list[_a_]
                watch.close()
            }
            return delete this.watchers
        }
    }

    Watch.prototype["onChange"] = function (change, path, dir = this.dir)
    {
        var clearRemove, stat, _132_48_, _138_28_, _138_68_, _138_75_

        if (this.ignore(path))
        {
            return
        }
        path = slash.path(dir,path)
        if (this.file && this.file !== path)
        {
            return
        }
        if (fs.isDir(path))
        {
            if (this.file)
            {
                console.log('ignore dir',path)
                return
            }
        }
        if (stat = fs.exists(path))
        {
            if (this.opt.skipSave && path === (this.remove != null ? this.remove.path : undefined))
            {
                clearTimeout(this.remove.timer)
                clearRemove = (function ()
                {
                    return delete this.remove
                }).bind(this)
                setTimeout(clearRemove,100)
                return
            }
            if (path === (this.last != null ? this.last.path : undefined) && stat.mtime.getTime() === ((_138_68_=this.last) != null ? (_138_75_=_138_68_.mtime) != null ? _138_75_.getTime() : undefined : undefined))
            {
                return
            }
            this.last = {mtime:stat.mtime,path:path}
            return this.emit('change',{dir:dir,path:path,change:change,watch:this})
        }
        else
        {
            if (this.opt.skipSave)
            {
                return this.remove = {path:path,timer:setTimeout((function (d, p, w)
                {
                    return function ()
                    {
                        delete w.remove
                        return w.emit('change',{dir:d,path:p,change:'remove',watch:w})
                    }
                })(dir,path,this),100)}
            }
            else if (this.opt.emitRemove)
            {
                return this.emit('change',{dir:dir,path:path,change:'remove',watch:this})
            }
        }
    }

    return Watch
})()

export default Watch;