var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, file: function () { return import.meta.url.substring(7); }, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }};_k_.G2=_k_.k.B256(_k_.k.G(2));_k_.y8=_k_.k.F256(_k_.k.y(8))

var file, files, hdr, m, mod, mods, test, tests

import fs from "./kxk/fs.js"
import slash from "./kxk/slash.js"

import tester from "./kode/tester.js"

mods = ['kxk','kode','kolor','ko','kalk']
if (process.argv.slice(-1)[0] === 'help')
{
    console.log(`
kakao test runner

usage

    kk -t                    run all tests
    kk -t brief|silent       set verbosity
    kk -t ${mods.join('|')}  test a single module
    kk -t .../file.js        run a single test file
`)
    process.exit(0)
}
tests = {}
var list = _k_.list(mods)
for (var _30_18_ = 0; _30_18_ < list.length; _30_18_++)
{
    m = list[_30_18_]
    tests[m] = true
}

hdr = function (h)
{
    console.log(_k_.G2(_k_.y8(' ' + _k_.rpad(33,h) + ' ')))
}
if (process.argv.slice(-1)[0] === 'brief')
{
    tester.logSections = false
}
else if (process.argv.slice(-1)[0] === 'silent')
{
    tester.logSections = false
    tester.logModules = false
}
else if (_k_.in(process.argv.slice(-1)[0],mods))
{
    var list1 = _k_.list(mods)
    for (var _45_10_ = 0; _45_10_ < list1.length; _45_10_++)
    {
        m = list1[_45_10_]
        tests[m] = m === process.argv.slice(-1)[0]
    }
}
else if (process.argv.slice(-1)[0] !== _k_.file())
{
    var list2 = _k_.list(mods)
    for (var _49_10_ = 0; _49_10_ < list2.length; _49_10_++)
    {
        m = list2[_49_10_]
        tests[m] = false
    }
    hdr(process.argv.slice(-1)[0])
    file = slash.path(_k_.dir(),'..',process.argv.slice(-1)[0])
    test = await import(file)
    tester.test(test.default)
}
var list3 = _k_.list(mods)
for (var _57_8_ = 0; _57_8_ < list3.length; _57_8_++)
{
    mod = list3[_57_8_]
    if (tests[mod])
    {
        hdr(mod)
        files = await fs.list(slash.path(_k_.dir(),mod,'test'))
        var list4 = _k_.list(files)
        for (var _61_17_ = 0; _61_17_ < list4.length; _61_17_++)
        {
            file = list4[_61_17_]
            test = await import(file.path)
            tester.test(test.default)
        }
    }
}
tester.summarize()