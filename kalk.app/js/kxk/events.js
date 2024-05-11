var _k_

var events


events = (function ()
{
    function events ()
    {
        this.dispatcher = new EventTarget
    }

    events.prototype["on"] = function (eventName, cb)
    {
        return this.dispatcher.addEventListener(eventName,function (e)
        {
            return cb.apply(cb,e.args)
        })
    }

    events.prototype["emit"] = function (eventName, ...args)
    {
        var event

        event = new Event(eventName)
        event.args = args
        return this.dispatcher.dispatchEvent(event)
    }

    events.prototype["removeListener"] = function (eventName, listener)
    {
        return this.dispatcher.removeEventListener(eventName,listener)
    }

    return events
})()

export default events;