var KEY = { D: 68, W: 87, A: 65, S: 83, RIGHT: 39, UP: 38, LEFT: 37, DOWN: 40, Q: 81, SPACE: 32, PAUSE: 19 };
var STATES = { INIT: 0, PLAY: 1, PAUSE: 2, OVER: 3 };
var styles = [
    { fg: "#fff38b", bg: "#cabc47", ct: "#ffe400" },
    { fg: "#ac7fff", bg: "#5d36a5", ct: "#5701f5" },
    { fg: "#d58cff", bg: "#5d297a", ct: "#9c00f5" },
    { fg: "#ff8f63", bg: "#b0522d", ct: "#f54500" },
    { fg: "#8aff61", bg: "#499d2c", ct: "#56e325" },
    { fg: "#7ed9ff", bg: "#1b80aa", ct: "#00b4ff" }
];


var GameManager = function(options) {
    var settings = {};
    Object.extend(settings, options);

    var state = STATES.INIT;
    var timer = new RenderTimer();
    var canvas = new Canvas();
    var factory = new FigureFactory();
    var dispatcher = new DOMEventDispatcher(document);

    this.start = function() {
        state = STATES.PLAY;
        timer.start();
    };

    this.continue = function() {
        state = STATES.PLAY;
        timer.start();
    }

    this.stop = function() {
        state = STATES.PAUSE;
        timer.stop();
    };

    this.togglePlay = function() {
        var actions = {};
        actions[STATES.PLAY] = this.stop;
        actions[STATES.PAUSE] = this.continue;
        actions[state]();
    };
};
