var clippo

import post from "./post.js"


clippo = (function ()
{
    function clippo ()
    {}

    clippo["content"] = ''
    clippo["history"] = []
    clippo["watch"] = async function ()
    {
        var current

        current = await kakao('clipboard.get')
        if (current !== clippo.content)
        {
            clippo.content = current
            clippo.history.push(clippo.content)
            post.emit('clipboard',clippo.content)
        }
        return setTimeout(clippo.watch,500)
    }

    return clippo
})()

export default clippo;