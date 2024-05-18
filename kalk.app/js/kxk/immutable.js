var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var addImmutabilityTag, addPropertyTo, arraySet, arraySetIn, asDeepMutable, asMutableArray, asMutableObject, asObject, banProperty, flatMap, getIn, getInPath, immutabilityTag, Immutable, immutableEmptyArray, immutableEmptyObject, ImmutableError, instantiateEmptyObject, isBlobObject, isEqual, isError, isFileObject, isImmutable, isMergableObject, isObject, isPromise, makeImmutable, makeImmutableArray, makeImmutableObject, makeMethodReturnImmutable, merge, mutatingArrayMethods, mutatingObjectMethods, nonMutatingArrayMethods, nonMutatingObjectMethods, objectReplace, objectSet, objectSetIn, quickCopy, toStatic, toStaticObjectOrArray, update, updateIn, without


isObject = function (obj)
{
    return (obj !== null) && (typeof(obj) === 'object') && (!Array.isArray(obj))
}

isFileObject = function (obj)
{
    return (typeof(File) !== 'undefined') && (obj instanceof File)
}

isBlobObject = function (obj)
{
    return (typeof(Blob) !== 'undefined') && (obj instanceof Blob)
}

isPromise = function (obj)
{
    return (typeof(obj) === 'object') && typeof(obj.then) === 'function'
}

isError = function (obj)
{
    return obj instanceof Error
}

instantiateEmptyObject = function (obj)
{
    var prototype

    if (prototype = Object.getPrototypeOf(obj))
    {
        return Object.create(prototype)
    }
    else
    {
        return {}
    }
}

addPropertyTo = function (target, methodName, value)
{
    return Object.defineProperty(target,methodName,{enumerable:false,configurable:false,writable:false,value:value})
}

banProperty = function (target, methodName)
{
    return addPropertyTo(target,methodName,function ()
    {
        throw new ImmutableError(`The ${methodName} method cannot be invoked on an Immutable data structure.`)
    })
}
immutabilityTag = "__immutable__"

addImmutabilityTag = function (target)
{
    return addPropertyTo(target,immutabilityTag,true)
}

isImmutable = function (target)
{
    if (typeof(target) === "object")
    {
        return target === null || Boolean(Object.getOwnPropertyDescriptor(target,immutabilityTag))
    }
    else
    {
        return true
    }
}

isEqual = function (a, b)
{
    return a === b || (a !== a && b !== b)
}

isMergableObject = function (target)
{
    return (target !== null) && typeof(target) === "object" && (!Array.isArray(target))
}
mutatingObjectMethods = ["setPrototypeOf"]
nonMutatingObjectMethods = ["keys"]
mutatingArrayMethods = mutatingObjectMethods.concat(['push','pop','sort','splice','shift','unshift','reverse'])
nonMutatingArrayMethods = nonMutatingObjectMethods.concat(['map','filter','slice','concat','reduce','reduceRight'])

ImmutableError = function (message)
{
    this.name = 'ImmutableError'
    this.message = message
    return this.stack = (new Error()).stack
}
ImmutableError.prototype = new Error()
ImmutableError.prototype.constructor = Error

makeImmutable = function (obj, bannedMethods)
{
    var banned

    addImmutabilityTag(obj)
    var list = _k_.list(bannedMethods)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        banned = list[_a_]
        banProperty(obj,banned)
    }
    Object.freeze(obj)
    return obj
}

makeImmutableObject = function (obj)
{
    addPropertyTo(obj,"merge",merge)
    addPropertyTo(obj,"replace",objectReplace)
    addPropertyTo(obj,"without",without)
    addPropertyTo(obj,"asMutable",asMutableObject)
    addPropertyTo(obj,"set",objectSet)
    addPropertyTo(obj,"setIn",objectSetIn)
    addPropertyTo(obj,"update",update)
    addPropertyTo(obj,"updateIn",updateIn)
    addPropertyTo(obj,"getIn",getIn)
    return makeImmutable(obj,mutatingObjectMethods)
}

makeImmutableArray = function (array)
{
    var i, methodName

    var list = _k_.list(nonMutatingArrayMethods)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        methodName = list[_b_]
        makeMethodReturnImmutable(array,methodName)
    }
    addPropertyTo(array,"flatMap",flatMap)
    addPropertyTo(array,"asObject",asObject)
    addPropertyTo(array,"asMutable",asMutableArray)
    addPropertyTo(array,"set",arraySet)
    addPropertyTo(array,"setIn",arraySetIn)
    addPropertyTo(array,"update",update)
    addPropertyTo(array,"updateIn",updateIn)
    addPropertyTo(array,"getIn",getIn)
    for (var _c_ = i = 0, _d_ = array.length; (_c_ <= _d_ ? i < array.length : i > array.length); (_c_ <= _d_ ? ++i : --i))
    {
        array[i] = Immutable(array[i])
    }
    return makeImmutable(array,mutatingArrayMethods)
}

Immutable = function (obj, options, stackRemaining)
{
    var key, prototype, theClone

    if (isImmutable(obj) || isFileObject(obj) || isBlobObject(obj) || isError(obj))
    {
        return obj
    }
    else if (isPromise(obj))
    {
        return obj.then(Immutable)
    }
    else if (Array.isArray(obj))
    {
        return makeImmutableArray(obj.slice())
    }
    else
    {
        prototype = options && options.prototype
        theClone = {}
        if (prototype && (prototype !== Object.prototype))
        {
            theClone = Object.create(prototype)
        }
        if (stackRemaining === null)
        {
            stackRemaining = 64
        }
        if (stackRemaining <= 0)
        {
            throw new ImmutableError("object either contains recursion or is nested too deep!")
        }
        stackRemaining -= 1
        for (key in obj)
        {
            if (Object.getOwnPropertyDescriptor(obj,key))
            {
                theClone[key] = Immutable(obj[key],undefined,stackRemaining)
            }
        }
        return makeImmutableObject(theClone)
    }
}

makeMethodReturnImmutable = function (obj, methodName)
{
    var currentMethod

    currentMethod = obj[methodName]
    return addPropertyTo(obj,methodName,function ()
    {
        return Immutable(currentMethod.apply(obj,arguments))
    })
}

arraySet = function (idx, value, config)
{
    var deep, mutable

    deep = config && config.deep
    if (this[idx])
    {
        if (deep && this[idx] !== value && isMergableObject(value) && isMergableObject(this[idx]))
        {
            value = Immutable.merge(this[idx],value,{deep:true,mode:'replace'})
        }
        if (isEqual(this[idx],value))
        {
            return this
        }
    }
    mutable = asMutableArray.call(this)
    mutable[idx] = Immutable(value)
    return makeImmutableArray(mutable)
}
immutableEmptyArray = Immutable([])

arraySetIn = function (pth, value, config)
{
    var head, mutable, newValue, nextHead, tail, thisHead

    head = pth[0]
    if (pth.length === 1)
    {
        return arraySet.call(this,head,value,config)
    }
    else
    {
        tail = pth.slice(1)
        thisHead = this[head]
        newValue
        if (typeof(thisHead) === "object" && thisHead !== null)
        {
            newValue = Immutable.setIn(thisHead,tail,value)
        }
        else
        {
            nextHead = tail[0]
            if ((nextHead !== '' && isFinite(nextHead)))
            {
                newValue = arraySetIn.call(immutableEmptyArray,tail,value)
            }
            else
            {
                newValue = objectSetIn.call(immutableEmptyObject,tail,value)
            }
        }
        if (this[head] && thisHead === newValue)
        {
            return this
        }
        mutable = asMutableArray.call(this)
        mutable[head] = newValue
        return makeImmutableArray(mutable)
    }
}

flatMap = function (iterator)
{
    var index, iteratorResult, result

    if (arguments.length === 0)
    {
        return this
    }
    result = []
    for (var _e_ = index = 0, _f_ = this.length; (_e_ <= _f_ ? index < this.length : index > this.length); (_e_ <= _f_ ? ++index : --index))
    {
        iteratorResult = iterator(this[index],index,this)
        if (Array.isArray(iteratorResult))
        {
            result.push.apply(result,iteratorResult)
        }
        else
        {
            result.push(iteratorResult)
        }
    }
    return makeImmutableArray(result)
}

without = function (remove)
{
    var key, keysToRemoveArray, result

    if (typeof(remove) === "undefined" && arguments.length === 0)
    {
        return this
    }
    if (typeof(remove) !== "function")
    {
        keysToRemoveArray = (Array.isArray(remove) ? remove.slice() : Array.prototype.slice.call(arguments))
        keysToRemoveArray.forEach(function (el, idx, arr)
        {
            if (typeof(el) === "number")
            {
                return arr[idx] = el.toString()
            }
        })
        remove = function (val, key)
        {
            return keysToRemoveArray.indexOf(key) !== -1
        }
    }
    result = instantiateEmptyObject(this)
    for (key in this)
    {
        if (this.hasOwnProperty(key) && remove(this[key],key) === false)
        {
            result[key] = this[key]
        }
    }
    return makeImmutableObject(result)
}

asMutableArray = function (opts)
{
    var i, result

    result = []
    for (var _10_ = i = 0, _11_ = this.length; (_10_ <= _11_ ? i < this.length : i > this.length); (_10_ <= _11_ ? ++i : --i))
    {
        result.push(asDeepMutable(this[i]))
    }
    return result
}

asObject = function (iterator)
{
    var index, key, length, pair, result, value

    if (typeof(iterator) !== "function")
    {
        iterator = function (value)
        {
            return value
        }
    }
    result = {}
    length = this.length
    for (var _12_ = index = 0, _13_ = length; (_12_ <= _13_ ? index < length : index > length); (_12_ <= _13_ ? ++index : --index))
    {
        pair = iterator(this[index],index,this)
        key = pair[0]
        value = pair[1]
        result[key] = value
    }
    return makeImmutableObject(result)
}

asDeepMutable = function (obj)
{
    if (!obj || (typeof(obj) !== 'object') || !Object.getOwnPropertyDescriptor(obj,immutabilityTag))
    {
        return obj
    }
    return Immutable.asMutable(obj)
}

quickCopy = function (src, dest)
{
    var key

    for (key in src)
    {
        if (Object.getOwnPropertyDescriptor(src,key))
        {
            dest[key] = src[key]
        }
    }
    return dest
}

merge = function (other, config)
{
    var addToResult, clearDroppedKeys, deep, index, key, merger, mode, otherFromArray, receivedArray, result

    if (arguments.length === 0)
    {
        return this
    }
    if ((other === null) || (typeof(other) !== "object"))
    {
        throw new TypeError("Immutable#merge can only be invoked with objects or arrays, not " + JSON.stringify(other))
    }
    receivedArray = Array.isArray(other)
    deep = (config != null ? config.deep : undefined)
    mode = (config != null ? config.mode : undefined) || 'merge'
    merger = (config != null ? config.merger : undefined)
    result = undefined
    addToResult = function (currentObj, otherObj, key)
    {
        var currentValue, immutableValue, mergerResult, newValue

        immutableValue = Immutable(otherObj[key])
        mergerResult = merger && merger(currentObj[key],immutableValue,config)
        currentValue = currentObj[key]
        if ((result !== undefined) || (mergerResult !== undefined) || (!currentObj.hasOwnProperty(key)) || (!isEqual(immutableValue,currentValue)))
        {
            if (mergerResult !== undefined)
            {
                newValue = mergerResult
            }
            else if (deep && isMergableObject(currentValue) && isMergableObject(immutableValue))
            {
                newValue = Immutable.merge(currentValue,immutableValue,config)
            }
            else
            {
                newValue = immutableValue
            }
            if ((!isEqual(currentValue,newValue)) || (!currentObj.hasOwnProperty(key)))
            {
                if (result === undefined)
                {
                    result = quickCopy(currentObj,instantiateEmptyObject(currentObj))
                }
                result[key] = newValue
            }
        }
        return null
    }
    clearDroppedKeys = function (currentObj, otherObj)
    {
        var key

        for (key in currentObj)
        {
            if (!otherObj.hasOwnProperty(key))
            {
                if (result === undefined)
                {
                    result = quickCopy(currentObj,instantiateEmptyObject(currentObj))
                }
                delete result[key]
            }
        }
    }
    if (!receivedArray)
    {
        for (key in other)
        {
            if (Object.getOwnPropertyDescriptor(other,key))
            {
                addToResult(this,other,key)
            }
        }
        if (mode === 'replace')
        {
            clearDroppedKeys(this,other)
        }
    }
    else
    {
        for (var _14_ = index = 0, _15_ = other.length; (_14_ <= _15_ ? index < other.length : index > other.length); (_14_ <= _15_ ? ++index : --index))
        {
            otherFromArray = other[index]
            for (key in otherFromArray)
            {
                if (otherFromArray.hasOwnProperty(key))
                {
                    addToResult(((result !== undefined ? result : this)),otherFromArray,key)
                }
            }
        }
    }
    if (result === undefined)
    {
        return this
    }
    else
    {
        return makeImmutableObject(result)
    }
}

objectReplace = function (value, config)
{
    var deep

    deep = config && config.deep
    if (arguments.length === 0)
    {
        return this
    }
    if (value === null || typeof(value) !== "object")
    {
        throw new TypeError("Immutable#replace can only be invoked with objects or arrays, not " + JSON.stringify(value))
    }
    return Immutable.merge(this,value,{deep:deep,mode:'replace'})
}
immutableEmptyObject = Immutable({})

objectSetIn = function (path, value, config)
{
    var head, mutable, newValue, tail, thisHead

    if ((!Array.isArray(path)) || (path.length === 0))
    {
        throw new TypeError("The first argument to Immutable#setIn must be an array containing at least one \"key\" string.")
    }
    head = path[0]
    if (path.length === 1)
    {
        return objectSet.call(this,head,value,config)
    }
    tail = path.slice(1)
    newValue = undefined
    thisHead = this[head]
    if (this.hasOwnProperty(head) && (typeof(thisHead) === "object") && (thisHead !== null))
    {
        newValue = Immutable.setIn(thisHead,tail,value)
    }
    else
    {
        newValue = objectSetIn.call(immutableEmptyObject,tail,value)
    }
    if (this.hasOwnProperty(head) && (thisHead === newValue))
    {
        return this
    }
    mutable = quickCopy(this,instantiateEmptyObject(this))
    mutable[head] = newValue
    return makeImmutableObject(mutable)
}

objectSet = function (property, value, config)
{
    var deep, mutable

    deep = config && config.deep
    if (this.hasOwnProperty(property))
    {
        if (deep && (this[property] !== value) && isMergableObject(value) && isMergableObject(this[property]))
        {
            value = Immutable.merge(this[property],value,{deep:true,mode:'replace'})
        }
        if (isEqual(this[property],value))
        {
            return this
        }
    }
    mutable = quickCopy(this,instantiateEmptyObject(this))
    mutable[property] = Immutable(value)
    return makeImmutableObject(mutable)
}

update = function (property, updater)
{
    var initialVal, restArgs

    restArgs = Array.prototype.slice.call(arguments,2)
    initialVal = this[property]
    return Immutable.set(this,property,updater.apply(initialVal,[initialVal].concat(restArgs)))
}

getInPath = function (obj, path)
{
    var i

    for (var _16_ = i = 0, _17_ = path.length; (_16_ <= _17_ ? i < path.length : i > path.length); (_16_ <= _17_ ? ++i : --i))
    {
        obj = obj[path[i]]
        if (obj === null)
        {
            break
        }
    }
    return ((i === path.length) ? obj : undefined)
}

updateIn = function (path, updater)
{
    var initialVal, restArgs

    restArgs = Array.prototype.slice.call(arguments,2)
    initialVal = getInPath(this,path)
    return Immutable.setIn(this,path,updater.apply(initialVal,[initialVal].concat(restArgs)))
}

getIn = function (path, defaultValue)
{
    var value

    value = getInPath(this,path)
    if (value === undefined)
    {
        return defaultValue
    }
    else
    {
        return value
    }
}

asMutableObject = function (opts)
{
    var key, result

    result = instantiateEmptyObject(this)
    key
    for (key in this)
    {
        if (this.hasOwnProperty(key))
        {
            result[key] = asDeepMutable(this[key])
        }
    }
    return result
}

toStatic = function (fn)
{
    var staticWrapper

    staticWrapper = function ()
    {
        var args, self

        args = [].slice.call(arguments)
        self = args.shift()
        return fn.apply(self,args)
    }
    return staticWrapper
}

toStaticObjectOrArray = function (fnObject, fnArray)
{
    var staticWrapper

    staticWrapper = function ()
    {
        var args, self

        args = [].slice.call(arguments)
        self = args.shift()
        if (Array.isArray(self))
        {
            return fnArray.apply(self,args)
        }
        else
        {
            return fnObject.apply(self,args)
        }
    }
    return staticWrapper
}
Immutable.from = Immutable
Immutable.isImmutable = isImmutable
Immutable.ImmutableError = ImmutableError
Immutable.merge = toStatic(merge)
Immutable.replace = toStatic(objectReplace)
Immutable.without = toStatic(without)
Immutable.asMutable = toStaticObjectOrArray(asMutableObject,asMutableArray)
Immutable.set = toStaticObjectOrArray(objectSet,arraySet)
Immutable.setIn = toStaticObjectOrArray(objectSetIn,arraySetIn)
Immutable.update = toStatic(update)
Immutable.updateIn = toStatic(updateIn)
Immutable.getIn = toStatic(getIn)
Immutable.flatMap = toStatic(flatMap)
Immutable.asObject = toStatic(asObject)
Object.freeze(Immutable)
export default Immutable;