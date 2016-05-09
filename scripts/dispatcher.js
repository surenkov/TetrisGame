
var KeyboardDispatcher = function() {
    var eventTable = {};
    var cacheTable = {};

    function boundCallback(evt) {
        cacheTable[evt] = cacheTable[evt] ||  function (e) {
            var key = e.keyCode || window.event.keyCode;
            if (!(evt in eventTable && key in eventTable[evt]))
                return true;

            var callbacks = eventTable[evt][key] || [];
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](evt, key);

            return false;
        };
        return cacheTable[evt];
    }

    this.bind = function() {
        document.addEventListener("keypress", boundCallback(KeyboardDispatcher.press));
        document.addEventListener("keydown", boundCallback(KeyboardDispatcher.down));
        document.addEventListener("keyup", boundCallback(KeyboardDispatcher.up));
    };

    this.unbind = function() {
        document.removeEventListener("keypress", boundCallback(KeyboardDispatcher.press));
        document.removeEventListener("keydown", boundCallback(KeyboardDispatcher.down));
        document.removeEventListener("keyup", boundCallback(KeyboardDispatcher.up));
    };

    this.subscribe = function(evt, key, callback) {
        if (!evt || !key || !callback) return false;
        eventTable[evt] = eventTable[evt] || {};
        eventTable[evt][key] = eventTable[evt][key] || [];
        eventTable[evt][key].push(callback);
        return true;
    };

    this.unsubscribe = function(evt, key, callback) {
        if (key === undefined) {
            delete eventTable[evt];
        } else if (key in eventTable[evt]) {
            if (callback) {
                var arr = eventTable[evt][key] || [];
                var idx = arr.indexOf(callback);
                if (idx !== -1)
                    arr.splice(idx, 1);
            } else {
                delete eventTable[evt][key];
            }
        }
    };
};

Object.defineProperties(KeyboardDispatcher, {
    press: { get: function() { return "keypress"; } },
    down: { get: function() { return "keydown"; } },
    up: { get: function() { return "keyup"; } }
});
