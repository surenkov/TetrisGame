
var GameLogic = function (factory, dispatcher, options) {
    var currentFigure = null;
    var nextFigure = factory.randomFigure();

    var matrix = new Array(options.height);
    for (var i = 0; i < matrix.length; i++)
        matrix[i] = new Array(options.width);

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
        for (var i = 0; i < m.length; i++)
            for (var j = 0; j < m[i].length; j++)
                if (m[i][j] > 0)
                    matrix[i + y][j + x] = currentFigure.style;
    }

    function addNew() {
        currentFigure = nextFigure;
        nextFigure = factory.randomFigure();

        var m = currentFigure.matrix();
        currentFigure.x = Math.floor((options.width - m[0].length) * 0.5);
    }
    addNew();

    function removeFilledLines() {
        var lines = [];
        for (var i = 0; i < matrix.length; i++) {
            var count = 0;
            for (var j = 0; j < matrix[i].length; j++)
                if (matrix[i][j]) count++
            if (count == matrix[i].length)
                lines.push(i);
        }
        for (var i = 0; i < lines.length; i++) {
            matrix.splice(lines[i], 1);
            matrix = [new Array(options.width)].concat(matrix);
        }
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
            else options.callbacks.render();
        };
    }

    this.matrix = function () { return matrix; };
    this.current = function () { return currentFigure; };
    this.next = function () { return nextFigure; };

    var state;
    this.play = function(timestamp, gameState) {
        state = gameState;
        if (state !== STATES.PLAY) return;
        currentFigure.stage();
        currentFigure.y += 1;
        if (!canMakeStep()) {
            currentFigure.unstage();
            merge();
            if (currentFigure.y === 0) {
                nextFigure = null;
                options.callbacks.over();
            } else {
                addNew();
            }
        }
        removeFilledLines();
    };

    dispatcher.subscribe(KeyboardDispatcher.down, KEY.UP, pressOnPlay("up"));
    dispatcher.subscribe(KeyboardDispatcher.down, KEY.LEFT, pressOnPlay("left"));
    dispatcher.subscribe(KeyboardDispatcher.down, KEY.RIGHT, pressOnPlay("right"));
};
