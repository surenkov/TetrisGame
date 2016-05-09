
var GameRenderer = function (logic, canvas, size) {
    function renderFigure(figure, pos) {
        if (!figure) return;
        pos = pos || { x: 0, y: 0 };
        var m = figure.matrix();
        for (var i = 0; i < m.length; i++) {
            for (var j = 0; j < m[i].length; j++) {
                if (m[i][j] !== 0) {
                    canvas.drawBlock({
                        x: pos.x + (figure.x + j) * size,
                        y: pos.y + (figure.y + i) * size,
                        w: size,
                        h: size
                    }, figure.style);
                }
            }
        }
    }

    function renderHud() {
        canvas.drawRect({ x: 0, y: 0, w: canvas.width(), h: canvas.height() }, "#b1c9ef");
    }

    function renderField() {
        var m = logic.matrix();
        for (var i = 0; i < m.length; i++)
            for (var j = 0; j < m[i].length; j++)
                if (m[i][j]) canvas.drawBlock({ x: j * size, y: i * size, w: size, h: size }, m[i][j].style);
        renderFigure(logic.current());
    }

    this.render = function (timestamp, state) {
        canvas.clear();
        renderHud();
        if (state != STATES.INIT)
            renderField();
    };
};
