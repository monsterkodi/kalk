import kxk from "../kxk.js"
let post = kxk.post
let elem = kxk.elem
let $ = kxk.$

import kakao from "../kakao.js"

kakao.init(function ()
{
    var main, version, _25_34_

    kakao('window.setSize',250,250)
    kakao('window.center')
    post.on('window.blur',function ()
    {
        return kakao('window.close')
    })
    window.onkeydown = function ()
    {
        return kakao('window.close')
    }
    main = $('#main')
    main.classList.add('app-drag-region')
    version = ((_25_34_=window.aboutVersion) != null ? _25_34_ : '1.0.0')
    return elem('div',{class:'about',id:'about',parent:main,children:[elem('img',{class:'image',src:window.aboutImage}),elem('div',{class:'version',id:'version',text:version,click:function ()
    {
        if (window.aboutURL)
        {
            return kakao('open',window.aboutURL)
        }
    }})]})
})