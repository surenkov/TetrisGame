
var GameLogic = function (factory, dispatcher, options) {
    var self = this;
    var settings = {
        minTimeout: 300,
        maxTimeout: 1000,
        scoreMultiplier: 10,
        topScore: 4000
    };
    Object.extend(settings, options);

    var currentFigure = null;
    var nextFigure = factory.randomFigure();

    var matrix = new Array(settings.height);
    for (var i = 0; i < matrix.length; i++)
        matrix[i] = new Array(settings.width);

    function canMakeStep() {
        var left = currentFigure.left();
        var top = currentFigure.top();
        var right = currentFigure.right();
        var bottom = currentFigure.bottom();

        var res = left < 0 ||
            top < 0 ||
            right >= matrix[0].length ||
            bottom >= matrix.length;

        if (res) return false;
        var x = currentFigure.x,
            y = currentFigure.y;
        var m = currentFigure.matrix();
        for (var i = 0; i < m.length; i++) {
            for (var j = 0; j < m[i].length; j++) {
                var iy = i + y, jx = j + x;
                if (iy < top || iy > bottom || jx < left || jx > right)
                    continue;
                if (matrix[i + y][j + x] && m[i][j])
                    return false;
            }
        }
        return true;
    }

    function merge() {
        var m = currentFigure.matrix();
        var x = currentFigure.x,
            y = currentFigure.y;
        for (var i = 0; i < m.length; i++) {
            for (var j = 0; j < m[i].length; j++) {
                if (m[i][j] > 0) {
                    matrix[i + y][j + x] = {
                        style: currentFigure.style,
                        score: currentFigure.score || 4
                    };
                }
            }
        }
    }

    function addNew() {
        currentFigure = nextFigure;
        nextFigure = factory.randomFigure();

        var m = currentFigure.matrix();
        currentFigure.x = Math.floor((settings.width - m[0].length) * 0.5);
    }
    addNew();

    function removeFilledLines() {
        var lines = [];
        for (var i = 0; i < matrix.length; i++) {
            var count = 0;
            for (var j = 0; j < matrix[i].length; j++)
                if (matrix[i][j]) count++;
            if (count == matrix[i].length)
                lines.push(i);
        }
        var removed = [];
        for (var i = 0; i < lines.length; i++) {
            removed = matrix.splice(lines[i], 1).concat(removed);
            matrix = [new Array(settings.width)].concat(matrix);
        }

        if (removed.length === 0) return;

        var sum = 0;
        for (var i = 0; i < removed.length; i++)
            for (var j = 0; j < removed[i].length; j++)
                sum += removed[i][j].score;
        self.score += sum * settings.scoreMultiplier;
    }

    function pressOnPlay(direction) {
        var command = {
            left: function() { currentFigure.x -= 1; },
            up: function() { currentFigure.rotate(); },
            right: function() { currentFigure.x += 1; },
            bottom: function() {}
        }[direction];
        return function() {
            if (state !== STATES.PLAY) return;
            currentFigure.stage();
            command();
            if (!canMakeStep()) currentFigure.unstage();
            else settings.callbacks.render();
        };
    }

    function speedUp() { stepTimeout = 50; }
    function restoreSpeed() { stepTimeout = backupTimeout; }

    this.matrix = function() { return matrix; };
    this.current = function() { return currentFigure; };
    this.next = function() { return nextFigure; };

    var prev = 0;
    var score = 0;
    var state = STATES.INIT;
    var stepTimeout = settings.maxTimeout;
    var backupTimeout = settings.maxTimeout;

    Object.defineProperty(this, "timeout", {
        get: function() { return stepTimeout; },
        set: function(value) {
            stepTimeout = backupTimeout = value;
        }
    });

    Object.defineProperty(this, "score", {
        get: function() { return score; },
        set: function(value) {
            score = value;
            var minTimeout = settings.minTimeout;
            var maxTimeout = settings.maxTimeout;
            var topScore = settings.topScore;
            self.timeout = minTimeout + Math.max((maxTimeout - minTimeout) * (topScore - score) / topScore, 0);
        }
    });

    this.play = function(timestamp, gameState) {
        state = gameState;
        if (state !== STATES.PLAY || timestamp - prev < stepTimeout) return;
        prev = timestamp;

        currentFigure.stage();
        currentFigure.y += 1;
        if (!canMakeStep()) {
            currentFigure.unstage();
            merge();
            if (currentFigure.y === 0) {
                nextFigure = null;
                settings.callbacks.over();
            } else {
                addNew();
            }
        }
        removeFilledLines();
    };

    dispatcher.subscribe(KeyboardDispatcher.down, KEY.UP, pressOnPlay("up"));
    dispatcher.subscribe(KeyboardDispatcher.down, KEY.LEFT, pressOnPlay("left"));
    dispatcher.subscribe(KeyboardDispatcher.down, KEY.RIGHT, pressOnPlay("right"));
    dispatcher.subscribe(KeyboardDispatcher.down, KEY.DOWN, speedUp);
    dispatcher.subscribe(KeyboardDispatcher.up, KEY.DOWN, restoreSpeed);
};
