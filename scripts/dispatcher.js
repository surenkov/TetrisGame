
var DOMEventDispatcher = function(element) {
    var eventsTable = {};

    this.subscribe = function (event, callback) {
        var callbacks = eventsTable[event] = eventsTable[event] || [];
        callbacks.push(callback);
        element.addEventListener(event, callback);
    };

    this.unsubscribe = function(event, callback) {
        var callbacks = eventsTable[event] || [];
        if (callback === undefined) {
            for (var i = 0; i < callbacks.length; i++)
                element.removeEventListener(event, callbacks[i]);
            delete eventsTable[event];
        } else {
            var idx = callbacks.indexOf(callback);
            if (idx !== -1) callbacks.splice(idx, 1);
            if (callbacks.length === 0) delete eventsTable[event];
            element.removeEventListener(event, callback);
        }
    };
};