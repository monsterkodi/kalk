var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.g3=_k_.k.F256(_k_.k.g(3));_k_.g4=_k_.k.F256(_k_.k.g(4));_k_.b3=_k_.k.F256(_k_.k.b(3));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.y4=_k_.k.F256(_k_.k.y(4))

var bundle

import slash from "../kxk/slash.js"
import nfs from "../kxk/nfs.js"

bundle = {path:slash.path(_k_.dir(),'../..')}
export default async function (args)
{
    var app, prt, prtExists, tgt

    app = args[0]
    if (_k_.empty(app))
    {
        return console.error('no app to spawn?')
    }
    prt = args[1]
    prt = (prt != null ? prt : slash.untilde(`~/s/${app}`))
    tgt = slash.path(prt,app + '.app')
    console.log(_k_.b5('ꦌ'),_k_.y4(app),_k_.b3('▸ ' + prt + '/') + _k_.g4(slash.file(tgt)))
    prtExists = await nfs.dirExists(prt)
    if (!prtExists)
    {
        return console.error(`parent directory ${tgt} doesn't exist`)
    }
    if (await nfs.exists(tgt))
    {
        await nfs.remove(tgt)
    }
    console.log(_k_.b3(''),_k_.b5(bundle.path),_k_.g3('▸'),_k_.g2(tgt))
    await nfs.copy(bundle.path,tgt)
    await nfs.copy(slash.path(bundle.path,`pyg/${app}.pug`),slash.path(tgt,'pyg/index.pug'))
    await nfs.copy(slash.path(bundle.path,`js/${app}.html`),slash.path(tgt,'js/index.html'))
    await nfs.copy(slash.path(bundle.path,`Contents/Resources/img/${app}.icns`),slash.path(tgt,'Contents/Resources/img/app.icns'))
    await nfs.remove(slash.path(tgt,'.stash'))
    await nfs.remove(slash.path(tgt,'package.noon'))
    await nfs.remove(slash.path(tgt,'package.js'))
    await nfs.remove(slash.path(tgt,'js/ko'))
    await nfs.remove(slash.path(tgt,'kode/ko'))
    await nfs.remove(slash.path(tgt,'pyg/ko'))
    await nfs.remove(slash.path(tgt,'pyg/ko.pug'))
    await nfs.remove(slash.path(tgt,'js/css/ko'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/img/ko.icns'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/img/ko.png'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/img/ko.pxm'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/img/menu_ko.png'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/menu_ko.noon'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/img/zen.png'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/font/devopicons.woff2'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/font/fa-regular-400.woff2'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/font/fa-solid-900.woff2'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/font/file-icons.woff2'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/font/fontawesome.woff2'))
    await nfs.remove(slash.path(tgt,'Contents/Resources/font/mfixx.woff2'))
    return await nfs.remove(slash.path(tgt,'Contents/Resources/font/octicons.woff2'))
};