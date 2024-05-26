var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var charsets, isValidPattern, make, setWithChar

charsets = ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ','0123456789','-','.','+=<>~','!|@#$%^&*(){}[];:?,/_\'\"\`\\']

setWithChar = function (char)
{
    var set

    var list = _k_.list(charsets)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        set = list[_a_]
        if (_k_.in(char,set))
        {
            return set
        }
    }
}

isValidPattern = function (pattern)
{
    var c

    var list = _k_.list(pattern)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        c = list[_b_]
        if (!setWithChar(c))
        {
            return false
        }
    }
    return true
}

make = function (hash, pattern)
{
    var cs, i, pw, s, ss, sum

    pw = ""
    ss = Math.floor(hash.length / pattern.length)
    for (var _c_ = i = 0, _d_ = pattern.length; (_c_ <= _d_ ? i < pattern.length : i > pattern.length); (_c_ <= _d_ ? ++i : --i))
    {
        sum = 0
        for (var _e_ = s = 0, _f_ = ss; (_e_ <= _f_ ? s < ss : s > ss); (_e_ <= _f_ ? ++s : --s))
        {
            sum += parseInt(hash[i * ss + s],16)
        }
        sum += pattern.charCodeAt(i)
        cs = setWithChar(pattern[i])
        pw += cs[sum % cs.length]
    }
    return pw
}
export default {make:make,isValidPattern:isValidPattern}