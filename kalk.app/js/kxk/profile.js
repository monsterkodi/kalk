var _k_

var profile


profile = (function ()
{
    function profile ()
    {}

    profile["hrtime"] = {}
    profile["start"] = async function (id)
    {
        if (globalThis.kakao)
        {
            return profile.hrtime[id] = await kakao('now')
        }
        else
        {
            return profile.hrtime[id] = performance.now()
        }
    }

    profile["end"] = async function (id, threshold = 0)
    {
        var b, f, t, u, v

        if (globalThis.kakao)
        {
            t = await kakao('now')
        }
        else
        {
            t = performance.now()
        }
        b = t - profile.hrtime[id]
        f = 0.001
        var list = ['s','ms','μs']
        for (var _29_14_ = 0; _29_14_ < list.length; _29_14_++)
        {
            u = list[_29_14_]
            if (u === 'μs' || b * f > 1)
            {
                v = b * f
                v < 1 ? f = v.toFixed(2) : f = v.toFixed(0)
                if (b >= threshold)
                {
                    console.log(id + ' ' + f + ' ' + u)
                }
                return b
            }
            f *= 1000
        }
    }

    return profile
})()

export default profile;