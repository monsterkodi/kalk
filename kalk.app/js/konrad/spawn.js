var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}};_k_.b3=_k_.k.F256(_k_.k.b(3));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.y4=_k_.k.F256(_k_.k.y(4))

var bundle

import pretty from "../kxk/pretty.js"
import nfs from "../kxk/nfs.js"
import slash from "../kxk/slash.js"

bundle = {path:slash.path(_k_.dir(),'../..')}
export default async function (args)
{
    var app, cpy, f, prt, prtExists, remove, tgt, tmp

    app = args[0]
    if (_k_.empty(app))
    {
        return console.error('no app to spawn?')
    }
    prt = args[1]
    prt = (prt != null ? prt : slash.untilde(`~/s/${app}`))
    tgt = slash.path(prt,app + '.app')
    console.log(_k_.b5('ꦌ'),_k_.y4(app),_k_.b3(' '),pretty.filePath(bundle.path,w8,b3),_k_.b3('▸'),pretty.filePath(tgt,y5,y1))
    prtExists = await nfs.dirExists(prt)
    if (!prtExists)
    {
        return console.error(`parent directory ${tgt} doesn't exist`)
    }
    tmp = slash.tmpfile()
    await nfs.move(slash.path(tgt,'.stash'),tmp)
    if (await nfs.exists(tgt))
    {
        await nfs.remove(tgt)
    }
    cpy = async function (s, d)
    {
        return await nfs.copy(slash.path(bundle.path,s),slash.path(tgt,d))
    }
    await nfs.copy(bundle.path,tgt)
    await cpy(`pyg/${app}.pug`,'pyg/index.pug')
    await cpy(`js/${app}.html`,'js/index.html')
    await cpy(`Contents/Resources/img/${app}.icns`,'Contents/Resources/img/app.icns')
    if (app !== 'ko')
    {
        remove = ['js/ko','kode/ko','pyg/ko','pyg/ko.pug','js/css/ko','Contents/Resources/img/ko.icns','Contents/Resources/img/ko.png','Contents/Resources/img/ko.pxm','Contents/Resources/img/menu_ko.png','Contents/Resources/menu_ko.noon','Contents/Resources/font/Lilex-Bold.woff2','Contents/Resources/font/devopicons.woff2','Contents/Resources/font/fa-regular-400.woff2','Contents/Resources/font/fa-solid-900.woff2','Contents/Resources/font/file-icons.woff2','Contents/Resources/font/fontawesome.woff2','Contents/Resources/font/mfixx.woff2','Contents/Resources/font/octicons.woff2']
        var list = _k_.list(remove)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            f = list[_a_]
            await nfs.remove(slash.path(tgt,f))
        }
    }
    remove = ['.stash','Contents/Resources/img/zen.png']
    var list1 = _k_.list(remove)
    for (var _b_ = 0; _b_ < list1.length; _b_++)
    {
        f = list1[_b_]
        await nfs.remove(slash.path(tgt,f))
    }
    return await nfs.move(tmp,slash.path(tgt,'.stash'))
};