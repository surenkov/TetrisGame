
var KeyboardDispatcher = function() {
    var eventTable = {};
    var generatedCallbacks = {};

    this.subscribe = function(event, key, callback) {
        eventTable[event] = eventTable[event] || {};
        eventTable[event][key] = eventTable[event][key] || [];
        eventTable[event][key].push(callback);
    };

    this.unsubscribe = function(event, key, callback) {
        if (!event) eventTable = {};
        else if (!key) delete eventTable[event];
        else if (!callback) delete eventTable[event][key];
        else {
            var a = eventTable[event][key];
            var idx = a.indexOf(callback);
            if (idx !== -1) a.splice(idx, 1);
        }
    };

    this.dispatch = function() {
        for (var c in generatedCallbacks)
            if (generatedCallbacks.hasOwnProperty(c))
                document.removeEventListener(c, generatedCallbacks[c]);
        generatedCallbacks = {};

        function generator(callbacks) {
            return function(e) {
                var callback = callbacks[e.keyCode];
                if (callback)
                    for (var i = 0; i < callback.length; i++)
                        callback[i](e);
            }
        }

        for (var evt in eventTable) {
            if (!eventTable.hasOwnProperty(evt)) continue;
            var cb = generator(eventTable[evt]);
            document.addEventListener(evt, cb);
            generatedCallbacks[evt] = cb;
        }
    };

    Object.defineProperties(KeyboardDispatcher, {
        down: { get: function() { return "keydown"; } },
        press: { get: function() { return "keypress"; } },
        up: { get: function() { return "keyup"; } }
    });
};
