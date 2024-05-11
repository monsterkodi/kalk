var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.R1=_k_.k.B256(_k_.k.R(1));_k_.Rr1=s=>_k_.R1(_k_.r8(s));_k_.r8=_k_.k.F256(_k_.k.r(8));_k_.G1=_k_.k.B256(_k_.k.G(1));_k_.Gg1=s=>_k_.G1(_k_.g8(s));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.G2=_k_.k.B256(_k_.k.G(2));_k_.Gg2=s=>_k_.G2(_k_.g7(s));_k_.g3=_k_.k.F256(_k_.k.g(3));_k_.G3=_k_.k.B256(_k_.k.G(3));_k_.Gg3=s=>_k_.G3(_k_.g6(s));_k_.g6=_k_.k.F256(_k_.k.g(6));_k_.g7=_k_.k.F256(_k_.k.g(7));_k_.g8=_k_.k.F256(_k_.k.g(8))

var ext, extlang, extlangFile, exts, json, keywords, lang, langNoon, names, noonFile, value, word, words, _31_18_

import kxk from "../kxk.js"
let noon = kxk.noon
let slash = kxk.slash

import fs from "../kxk/fs.js"

noonFile = slash.path(_k_.dir(),'..','..','kode','kolor','lang.noon')
extlangFile = slash.path(_k_.dir(),'extlang.js')
console.log(_k_.Gg3(' input:  '),_k_.g3(noonFile))
console.log(_k_.Gg2(' output: '),_k_.g2(extlangFile))
lang = {}
exts = ['txt','log']
langNoon = await noon.load(noonFile)
for (names in langNoon)
{
    keywords = langNoon[names]
    var list = _k_.list(names.split(/\s/))
    for (var _29_12_ = 0; _29_12_ < list.length; _29_12_++)
    {
        ext = list[_29_12_]
        if (!(_k_.in(ext,exts)))
        {
            exts.push(ext)
        }
        lang[ext] = ((_31_18_=lang[ext]) != null ? _31_18_ : {})
        for (value in keywords)
        {
            words = keywords[value]
            var list1 = _k_.list(words)
            for (var _33_21_ = 0; _33_21_ < list1.length; _33_21_++)
            {
                word = list1[_33_21_]
                lang[ext][word] = value
            }
        }
    }
}
json = JSON.stringify({exts:exts,lang:lang},null,4)
extlang = `export default ${json}`
if (await fs.write(extlangFile,extlang))
{
    console.log(_k_.Gg1(' ok '))
}
else
{
    console.log(_k_.Rr1(' fail '))
}