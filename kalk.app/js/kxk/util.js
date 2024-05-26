var _k_ = {isArr: function (o) {return Array.isArray(o)}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var util

util = {isEqual:function (a, b)
{
    var index

    if (_k_.isArr(a) && _k_.isArr(b))
    {
        if (a.length !== b.length)
        {
            return false
        }
        for (var _a_ = index = 0, _b_ = a.length; (_a_ <= _b_ ? index < a.length : index > a.length); (_a_ <= _b_ ? ++index : --index))
        {
            if (!util.isEqual(a[index],b[index]))
            {
                return false
            }
        }
        return true
    }
    if (_k_.isObj(a) && _k_.isObj(b))
    {
        return util.isEqual(Object.keys(a),Object.keys(b)) && util.isEqual(Object.values(a),Object.values(b))
    }
    return a === b
},zip:function (...args)
{
    var i, maxLen, result

    result = []
    maxLen = _k_.max(args.map(function (a)
    {
        return a.length
    }))
    for (var _c_ = i = 0, _d_ = maxLen; (_c_ <= _d_ ? i < maxLen : i > maxLen); (_c_ <= _d_ ? ++i : --i))
    {
        result.push(args.map(function (a)
        {
            return a[i]
        }))
    }
    return result
},fold:function (l, a)
{
    var i, result

    result = []
    i = 0
    while (i <= a.length - l)
    {
        result.push(a.slice(i,i + l))
        i += l
    }
    return result
},reversed:function (arr)
{
    return arr.slice(0).reverse()
},max:function (arr)
{
    return Math.max.apply(null,arr)
},min:function (arr)
{
    return Math.min.apply(null,arr)
},pull:function (arr, item)
{
    var index

    if (_k_.isArr(arr))
    {
        index = arr.indexOf(item)
        if (index >= 0)
        {
            arr.splice(index,1)
        }
    }
    return arr
},pullIf:function (arr, pred)
{
    var index

    for (var _e_ = index = arr.length - 1, _f_ = 0; (_e_ <= _f_ ? index <= 0 : index >= 0); (_e_ <= _f_ ? ++index : --index))
    {
        if (pred(arr[index]))
        {
            arr.splice(index,1)
        }
    }
    return arr
},keepIf:function (arr, pred)
{
    return util.pullIf(arr,function (m)
    {
        return !pred(m)
    })
},splitWith:function (arr, pred)
{
    var exc, inc, item

    inc = []
    exc = []
    if (!_k_.empty(arr) && _k_.isArr(arr))
    {
        var list = _k_.list(arr)
        for (var _10_ = 0; _10_ < list.length; _10_++)
        {
            item = list[_10_]
            if (pred(item))
            {
                inc.push(item)
            }
            else
            {
                exc.push(item)
            }
        }
    }
    return [inc,exc]
},findIf:function (arr, pred)
{
    var v

    var list = _k_.list(arr)
    for (var _11_ = 0; _11_ < list.length; _11_++)
    {
        v = list[_11_]
        if (pred(v))
        {
            return v
        }
    }
},pullAll:function (arr, items, cmp = util.isEqual)
{
    var index, item

    if (!_k_.empty(arr) && _k_.isArr(arr))
    {
        var list = _k_.list(items)
        for (var _12_ = 0; _12_ < list.length; _12_++)
        {
            item = list[_12_]
            for (var _13_ = index = arr.length - 1, _14_ = 0; (_13_ <= _14_ ? index <= 0 : index >= 0); (_13_ <= _14_ ? ++index : --index))
            {
                if (cmp(arr[index],item))
                {
                    arr.splice(index,1)
                }
            }
        }
    }
    return arr
},uniq:function (arr)
{
    var item, result

    result = []
    var list = _k_.list(arr)
    for (var _15_ = 0; _15_ < list.length; _15_++)
    {
        item = list[_15_]
        if (!(_k_.in(item,result)))
        {
            result.push(item)
        }
    }
    return result
},uniqEqual:function (arr)
{
    var add, item, result, ritem

    result = []
    var list = _k_.list(arr)
    for (var _16_ = 0; _16_ < list.length; _16_++)
    {
        item = list[_16_]
        add = true
        var list1 = _k_.list(result)
        for (var _17_ = 0; _17_ < list1.length; _17_++)
        {
            ritem = list1[_17_]
            if (util.isEqual(item,ritem))
            {
                add = false
                break
            }
        }
        if (add)
        {
            result.push(item)
        }
    }
    return result
},uniqBy:function (arr, prop)
{
    var add, item, key, result, ritem

    if (_k_.isStr(prop))
    {
        key = prop
        prop = function (o)
        {
            return o[key]
        }
    }
    result = []
    var list = _k_.list(arr)
    for (var _18_ = 0; _18_ < list.length; _18_++)
    {
        item = list[_18_]
        add = true
        var list1 = _k_.list(result)
        for (var _19_ = 0; _19_ < list1.length; _19_++)
        {
            ritem = list1[_19_]
            if (prop(item) === prop(ritem))
            {
                add = false
                break
            }
        }
        if (add)
        {
            result.push(item)
        }
    }
    return result
},sortBy:function (arr, prop)
{
    var key

    if (_k_.isStr(prop))
    {
        key = prop
        prop = function (o)
        {
            return o[key]
        }
    }
    return arr.sort(function (a, b)
    {
        var pa, pb

        pa = prop(a)
        pb = prop(b)
        if (_k_.isStr(pa) && _k_.isStr(pb))
        {
            return pa.localeCompare(pb,'en',{sensitivity:'variant',caseFirst:'upper',numeric:true})
        }
        else
        {
            return Number(pa) - Number(pb)
        }
    })
},defaults:function (obj, def)
{
    var key, val, _162_21_

    for (key in def)
    {
        val = def[key]
        obj[key] = ((_162_21_=obj[key]) != null ? _162_21_ : val)
    }
    return obj
},pickBy:function (obj, pred)
{
    var key, result, val

    result = {}
    for (key in obj)
    {
        val = obj[key]
        if (pred(key,val))
        {
            result[key] = val
        }
    }
    return result
},deleteBy:function (obj, pred)
{
    var key, val

    for (key in obj)
    {
        val = obj[key]
        if (pred(key,val))
        {
            delete obj[key]
        }
    }
    return obj
},toPairs:function (obj)
{
    var key, result, val

    result = []
    if (_k_.isObj(obj))
    {
        for (key in obj)
        {
            val = obj[key]
            result.push([key,val])
        }
    }
    else if (_k_.isArr(obj))
    {
        result = util.fold(2,obj)
    }
    return result
},fromPairs:function (pairs)
{
    var pair, result

    result = {}
    var list = _k_.list(pairs)
    for (var _1a_ = 0; _1a_ < list.length; _1a_++)
    {
        pair = list[_1a_]
        result[pair[0]] = pair[1]
    }
    return result
},sleep:async function (ms)
{
    await new Promise((function (r)
    {
        return setTimeout(r,ms)
    }).bind(this))
    return true
},uuid:function ()
{
    return crypto.randomUUID()
},rad2deg:function (r)
{
    return 180 * r / Math.PI
},deg2rad:function (d)
{
    return Math.PI * d / 180
},randInt:function (r)
{
    return Math.floor(Math.random() * r)
},randIntRange:function (l, h)
{
    return Math.floor(l + Math.random() * (h - l + 1))
},randRange:function (l, h)
{
    return l + Math.random() * (h - l)
},absMax:function (a, b)
{
    return ((Math.abs(a) >= Math.abs(b)) ? a : b)
},absMin:function (a, b)
{
    return ((Math.abs(a) < Math.abs(b)) ? a : b)
}}
export default util;