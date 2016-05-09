var KEY = { RIGHT: 39, UP: 38, LEFT: 37, DOWN: 40, SPACE: 32, PAUSE: 19 };
var STATES = { INIT: 0, PLAY: 1, PAUSE: 2, OVER: 3 };

var GameManager = function(factory, options) {
    var settings = {
        size: 20,
        width: 10,
        height: 20,
        minTimeout: 300,
        maxTimeout: 1000,
        topScore: 4000
    };
    Object.extend(settings, options);

    var state = STATES.INIT;

    var canvas = new GameCanvas({
        width: settings.width * settings.size + 116,
        height: settings.height * settings.size + 12,
        el: settings["el"]
    });
    var timer = new GameTimer(play);
    var dispatcher = new KeyboardDispatcher();

    var logic = new GameLogic(factory, dispatcher, {
        size: settings.size,
        width: settings.width,
        height: settings.height,
        topScore: settings.topScore,
        callbacks: {
            over: gameOver,
            render: function() { scene.render(performance.now(), state); }
        }
    });
    var scene = new GameRenderer(logic, canvas, {
        size: settings.size,
        width: settings.width,
        height: settings.height
    });

    this.init = function () {
        var toggle = this.toggle.bind(this);
        dispatcher.subscribe(KeyboardDispatcher.down, KEY.PAUSE, toggle);
        dispatcher.subscribe(KeyboardDispatcher.down, KEY.SPACE, toggle);
        dispatcher.bind();
        return canvas.el;
    };

    this.start = function() {
        state = STATES.PLAY;
    };

    this.stop = function() {
        state = STATES.PAUSE;
    };

    var actions = {};
    actions[STATES.INIT] = this.start;
    actions[STATES.PLAY] = this.stop;
    actions[STATES.PAUSE] = this.start;
    actions[STATES.OVER] = gameOver;
    this.toggle = function() {
        actions[state]();
    };

    function play(timestamp) {
        logic.play(timestamp, state);
        scene.render(timestamp, state);
    }

    function gameOver() {
        state = STATES.OVER;
    }

    timer.start();
};
