var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var CHAR_BACKWARD_SLASH, CHAR_DOT, CHAR_FORWARD_SLASH, isPathSeparator, isPosixPathSeparator, normalize, normStr, sep

sep = '/'
CHAR_FORWARD_SLASH = '/'.charCodeAt(0)
CHAR_BACKWARD_SLASH = '\\'.charCodeAt(0)
CHAR_DOT = '.'.charCodeAt(0)

isPosixPathSeparator = function (c)
{
    return c === CHAR_FORWARD_SLASH
}

isPathSeparator = function (c)
{
    return c === CHAR_FORWARD_SLASH || c === CHAR_BACKWARD_SLASH
}

normStr = function (path, isAbsolute, separator, isPathSeparator)
{
    var code, dots, i, lastSegmentLength, lastSlash, lastSlashIndex, res

    res = ''
    lastSegmentLength = 0
    lastSlash = -1
    dots = 0
    code = 0
    for (var _32_13_ = i = 0, _32_16_ = path.length; (_32_13_ <= _32_16_ ? i <= path.length : i >= path.length); (_32_13_ <= _32_16_ ? ++i : --i))
    {
        if (i < path.length)
        {
            code = path.charCodeAt(i)
        }
        else if (isPathSeparator(code))
        {
            break
        }
        else
        {
            code = CHAR_FORWARD_SLASH
        }
        if (isPathSeparator(code))
        {
            if (lastSlash === i - 1 || dots === 1)
            {
                true
            }
            else if (dots === 2)
            {
                if ((res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT))
                {
                    if (res.length > 2)
                    {
                        lastSlashIndex = res.lastIndexOf(separator)
                        if (lastSlashIndex === -1)
                        {
                            res = ''
                            lastSegmentLength = 0
                        }
                        else
                        {
                            res = res.slice(0,lastSlashIndex)
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator)
                        }
                        lastSlash = i
                        dots = 0
                        continue
                    }
                    else if (res.length !== 0)
                    {
                        res = ''
                        lastSegmentLength = 0
                        lastSlash = i
                        dots = 0
                        continue
                    }
                }
                if (!isAbsolute)
                {
                    res += (res.length > 0 ? `${separator}..` : '..')
                    lastSegmentLength = 2
                }
            }
            else
            {
                if (res.length > 0)
                {
                    res += `${separator}${path.slice(lastSlash + 1,i)}`
                }
                else
                {
                    res = path.slice(lastSlash + 1,i)
                }
                lastSegmentLength = i - lastSlash - 1
            }
            lastSlash = i
            dots = 0
        }
        else if (code === CHAR_DOT && dots !== -1)
        {
            dots++
        }
        else
        {
            dots = -1
        }
    }
    return res
}

normalize = function (path)
{
    var isAbsolute, trailingSeparator

    if (!(_k_.isStr(path)))
    {
        return path
    }
    if (path.length === 0)
    {
        return ''
    }
    isAbsolute = isPathSeparator(path.charCodeAt(0))
    trailingSeparator = isPathSeparator(path.charCodeAt(path.length - 1))
    path = normStr(path,isAbsolute,'/',isPathSeparator)
    if (path.length === 0)
    {
        if (isAbsolute)
        {
            return '/'
        }
        return (trailingSeparator ? './' : '.')
    }
    if (trailingSeparator)
    {
        path += '/'
    }
    return (isAbsolute ? `/${path}` : path)
}