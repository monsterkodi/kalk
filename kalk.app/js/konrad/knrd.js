var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.m3=_k_.k.F256(_k_.k.m(3));_k_.m4=_k_.k.F256(_k_.k.m(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3))

var gatherFiles, jsDir, knrd, kodeDir, pygDir, rules, srcForFile, tgtForSrc

import kode from "../kode/kode.js"

import slash from "../kxk/slash.js"
let tilde = slash.tilde

import fs from "../kxk/fs.js"
import pug from "../kxk/pug.js"
import styl from "../kxk/styl.js"
import noon from "../kxk/noon.js"

kodeDir = slash.path(_k_.dir(),'/../../kode')
pygDir = slash.path(_k_.dir(),'/../../pyg')
jsDir = slash.path(_k_.dir(),'/../../js')
rules = {kode:{tgtExt:'js',srcDir:kodeDir,tgtDir:jsDir,compile:function (srcText, srcFile)
{
    var k0de

    k0de = new kode({header:false})
    return k0de.compile(srcText,srcFile)
}},styl:{tgtExt:'css',srcDir:pygDir,tgtDir:jsDir + '/css',compile:function (srcText, srcFile)
{
    return styl(srcText)
}},pug:{tgtExt:'html',srcDir:pygDir,tgtDir:jsDir,compile:function (srcText, srcFile)
{
    return pug(srcText)
}},noon:{tgtExt:'json',srcDir:kodeDir,tgtDir:jsDir,compile:function (srcText, srcFile)
{
    return JSON.stringify(noon.parse(srcText),null,'  ')
}},ignore:['kolor/lang.noon','ko/help.noon']}

gatherFiles = async function ()
{
    var files, list

    list = await fs.list(kodeDir)
    list = list.concat(await fs.list(pygDir))
    list = list.filter(function (item)
    {
        return item.type === 'file'
    })
    files = list.map(function (item)
    {
        return item.path
    })
    return files = files.filter(function (file)
    {
        var ignore

        var list1 = _k_.list(rules.ignore)
        for (var _67_19_ = 0; _67_19_ < list1.length; _67_19_++)
        {
            ignore = list1[_67_19_]
            if (file.endsWith(ignore))
            {
                return false
            }
        }
        return true
    })
}

srcForFile = function (file)
{
    var srcFile

    srcFile = file
    if (slash.isRelative(srcFile))
    {
        srcFile = slash.path(process.cwd(),srcFile)
    }
    return srcFile
}

tgtForSrc = function (srcFile, rule)
{
    return slash.swapExt(srcFile.replace(rule.srcDir,rule.tgtDir),rule.tgtExt)
}

knrd = async function (files = [], opt = {})
{
    var compText, file, ignore, rule, skip, srcFile, srcText, tgtFile, tgtText, transpiled, _102_23_, _103_16_

    if (_k_.isStr(files))
    {
        if (_k_.in(slash.ext(files),['kode']))
        {
            files = [files]
        }
        else
        {
            files = []
        }
    }
    if (_k_.isArr(files))
    {
        if (!(_k_.in(slash.ext(files[0]),['kode'])))
        {
            files = []
        }
    }
    opt.rerunWhenDirty = ((_102_23_=opt.rerunWhenDirty) != null ? _102_23_ : true)
    opt.verbose = ((_103_16_=opt.verbose) != null ? _103_16_ : false)
    if (opt.debug)
    {
        console.log('opt',opt)
    }
    if (opt.debug)
    {
        console.log('files',files)
    }
    if (_k_.empty(files))
    {
        files = await gatherFiles()
    }
    if (!opt.quiet)
    {
        console.log('🔨 ',files.length)
    }
    transpiled = 0
    var list = _k_.list(files)
    for (var _117_13_ = 0; _117_13_ < list.length; _117_13_++)
    {
        file = list[_117_13_]
        skip = false
        var list1 = _k_.list(rules.ignore)
        for (var _120_19_ = 0; _120_19_ < list1.length; _120_19_++)
        {
            ignore = list1[_120_19_]
            if (file.endsWith(ignore))
            {
                if (opt.verbose)
                {
                    console.log(_k_.w2('✘  '),_k_.w3(tilde(file)))
                }
                skip = true
                break
            }
        }
        if (skip)
        {
            continue
        }
        if (rule = rules[slash.ext(file)])
        {
            srcFile = srcForFile(file)
            tgtFile = tgtForSrc(srcFile,rule)
            srcText = await fs.read(srcFile)
            tgtText = await fs.read(tgtFile)
            compText = rule.compile(srcText,srcFile)
            if (opt.debug && opt.verbose)
            {
                console.log('tgtText',tgtFile,tgtText)
            }
            if (opt.debug && opt.verbose)
            {
                console.log('compText',compText)
            }
            if (_k_.empty(compText))
            {
                console.log(_k_.y5('✘ '),_k_.r5(tilde(srcFile)),_k_.r4('transpiles to empty!'))
            }
            else
            {
                if (opt.verbose)
                {
                    console.log(_k_.g2('🔧'),_k_.m3(tilde(srcFile)))
                }
                if (tgtText !== compText)
                {
                    transpiled++
                    await fs.write(tgtFile,compText)
                    console.log(_k_.b5('✔ '),_k_.g5(tilde(tgtFile)))
                }
            }
        }
        null
    }
    if (opt.rerunWhenDirty && transpiled)
    {
        return knrd(files,{rerunWhenDirty:false})
    }
}

knrd.info = async function ()
{
    var file, files, rule, srcFile, srcInfo, tgtFile, tgtInfo

    files = await gatherFiles()
    var list = _k_.list(files)
    for (var _162_13_ = 0; _162_13_ < list.length; _162_13_++)
    {
        file = list[_162_13_]
        if (rule = rules[slash.ext(file)])
        {
            srcFile = srcForFile(file)
            tgtFile = tgtForSrc(srcFile,rule)
            srcInfo = await fs.info(srcFile)
            tgtInfo = await fs.info(tgtFile)
            console.log(_k_.y5(srcFile,srcInfo))
            console.log(_k_.m4(tgtFile,tgtInfo))
        }
    }
    return []
}
export default knrd;