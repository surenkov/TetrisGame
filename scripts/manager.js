var KEY = { RIGHT: 39, UP: 38, LEFT: 37, DOWN: 40, SPACE: 32, PAUSE: 19 };
var STATES = { INIT: 0, PLAY: 1, PAUSE: 2, OVER: 3 };

var GameManager = function(factory, options) {
    var settings = {
        delay: 200,
        size: 20,
        width: 10,
        height: 20
    };
    Object.extend(settings, options);

    var state = STATES.INIT;

    var canvas = new GameCanvas({
        width: settings.width * settings.size,
        height: settings.height * settings.size,
        el: settings["el"]
    });
    var timer = new GameTimer(play, settings.delay);
    var dispatcher = new KeyboardDispatcher();

    var logic = new GameLogic(factory, dispatcher, {
        size: settings.size,
        width: settings.width,
        height: settings.height,
        callbacks: {
            over: gameOver,
            render: function() { scene.render(performance.now(), state); }
        }
    });
    var scene = new GameRenderer(logic, canvas, settings.size);

    this.init = function () {
        var toggle = this.toggle.bind(this);
        dispatcher.subscribe(KEY.PAUSE, toggle);
        dispatcher.subscribe(KEY.SPACE, toggle);
        dispatcher.bind();
        return canvas.el;
    };

    this.start = function() {
        state = STATES.PLAY;
    };

    this.stop = function() {
        state = STATES.PAUSE;
    };

    this.toggle = function() {
        var actions = {};
        actions[STATES.PLAY] = this.stop;
        actions[STATES.PAUSE] = this.start;
        actions[STATES.INIT] = this.start;
        actions[state]();
    };

    function play(timestamp) {
        dispatcher.dispatch();
        logic.play(timestamp, state);
        scene.render(timestamp, state);
    }

    function gameOver() {
        state = STATES.OVER;
    }

    timer.start();
};
