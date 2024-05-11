var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }};_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w5=_k_.k.F256(_k_.k.w(5))

var args

import kxk from "../kxk.js"
let sleep = kxk.sleep
let karg = kxk.karg
let slash = kxk.slash
let os = kxk.os

import watch from "../kxk/watch.js"

import knrd from "./knrd.js"
import build from "./build.js"
import spawn from "./spawn.js"

import child_process from "child_process"

import fs from 'fs/promises'
args = karg(`kk
    options                                   **
    info       show build status              = false
    knrd       transpile kode, styl, pug      = false
    build      build application executable   = false
    rebuild    rebuild all targets            = false -R
    watch      watch for file changes         = false
    test       run tests                      = false
    run        launch application executable  = false
    clean      remove transpilated files      = false 
    spawn      spawn app                      = false
    verbose    log more                       = false
    quiet      log nothing                    = false
    debug      log debug                      = false`)
class kk
{
    static async run ()
    {
        while (!os.loaded)
        {
            await sleep(150)
        }
        if (args.info)
        {
            await kk.info()
        }
        if (args.clean)
        {
            await kk.clean()
        }
        if (args.knrd)
        {
            await knrd(args.options,args)
        }
        if (args.build)
        {
            await kk.build()
        }
        if (args.rebuild)
        {
            await kk.rebuild()
        }
        if (args.test)
        {
            await kk.test(args.options)
        }
        if (args.run)
        {
            await kk.launch(args.options)
        }
        if (args.spawn)
        {
            await kk.spawn(args.options)
        }
        if (args.watch)
        {
            return await kk.watch()
        }
    }

    static async build ()
    {
        if (!args.quiet)
        {
            console.log('🛠')
        }
        return build()
    }

    static async rebuild ()
    {
        await knrd()
        await kk.build()
        return kk.launch()
    }

    static async info ()
    {
        var info

        console.log(_k_.w4('○● info'))
        info = await knrd.info()
        console.log(info)
    }

    static async watch ()
    {
        var start

        console.log(_k_.w4('○● watch'),_k_.w5(kk.appPath()))
        start = function (cb)
        {
            return watch.watch(kk.appPath(),{recursive:true,cb:function (watcher)
            {
                return watcher.on('change',function (info)
                {
                    return cb(info.path)
                })
            }})
        }
        return start(async function (sourceFile)
        {
            if (slash.contains(sourceFile,'.stash'))
            {
                return
            }
            console.log(_k_.b5('🔧'),_k_.w3(sourceFile))
            if (_k_.in(slash.ext(sourceFile),['kode','pug','styl','noon']))
            {
                await knrd(sourceFile)
                return await kk.test(args.options)
            }
        })
    }

    static async test (options)
    {
        var cmd, opt

        cmd = "node js/test.js"
        if (!_k_.empty(options))
        {
            cmd += ' ' + options.join(' ')
        }
        opt = {shell:true,cwd:kk.appPath()}
        return new Promise(function (resolve, reject)
        {
            return child_process.exec(cmd,opt,function (err, stdout, stderr)
            {
                if (err)
                {
                    console.error('ERROR',err)
                    return resolve()
                }
                else
                {
                    if (!_k_.empty(stdout))
                    {
                        console.log(stdout)
                    }
                    return resolve()
                }
            })
        })
    }

    static async clean ()
    {
        var appExe, jsDir

        jsDir = slash.path(_k_.dir(),'../../js')
        appExe = slash.path(_k_.dir(),'../../Contents/MacOS/kakao')
        await fs.rm(jsDir,{recursive:true,force:true})
        return await fs.unlink(appExe)
    }

    static spawn (args)
    {
        return spawn(args)
    }

    static launch (args = [])
    {
        var cmd, opt

        console.log('🚀')
        cmd = slash.path(_k_.dir(),'../../Contents/MacOS/kakao')
        opt = {shell:true,detached:true}
        return child_process.spawn(cmd,args,opt)
    }

    static appPath ()
    {
        return slash.path(_k_.dir(),'../../')
    }

    static appName ()
    {
        return slash.name(kk.appPath())
    }
}

global['kk'] = kk
export default kk.run;