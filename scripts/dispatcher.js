
var KeyboardDispatcher = function(el) {
    var eventTable = {};
    var raisedEvents = {};
    var boundElem = el || document;

    var boundDownCallback = function(e) {
        raisedEvents[e.keyCode] = true;
    };
    var boundUpCallback = function(e) {
        delete raisedEvents[e.keyCode];
    };

    this.bind = function(el) {
        boundElem = el || boundElem;
        boundElem.addEventListener("keydown", boundDownCallback);
        boundElem.addEventListener("keyup", boundUpCallback);
    };

    this.unbind = function() {
        boundElem.removeEventListener("keydown", boundDownCallback);
        boundElem.removeEventListener("keyup", boundUpCallback);
    };

    this.subscribe = function(key, callback) {
        eventTable[key] = eventTable[key] || [];
        if (eventTable[key].indexOf(callback) == -1)
            eventTable[key].push(callback);
    };

    this.unsubscribe = function(key, callback) {
        if (callback) {
            var arr = eventTable[key] || [];
            var idx = arr.indexOf(callback);
            if (idx != -1)
                arr.splice(idx, 1);
        } else {
            delete eventTable[key];
        }
    };

    this.dispatch = function() {
        for (var keyCode in raisedEvents) {
            if (raisedEvents[keyCode] && eventTable.hasOwnProperty(keyCode)) {
                var arr = eventTable[keyCode];
                for (var i = 0; i < arr.length; i++)
                    arr[i](keyCode);
            }
        }
    };
};
