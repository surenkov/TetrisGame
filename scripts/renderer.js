
var GameRenderer = function (logic, canvas, options) {
    var settings = { size: 20 };
    Object.extend(settings, options);

    var size = settings.size;

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

    function overflowText(text, textSize, transparent) {
        if (!transparent)
            canvas.drawRect({ x: 5, y: 5, w: settings.width * size + 2, h: settings.height * size + 2 }, "rgba(255, 255, 255, .4)");
        canvas.drawText(text, {
            size: textSize,
            align: "center",
            baseline: "middle",
            x: settings.width * size / 2 + 5,
            y: canvas.height() / 2
        });
    }

    var previewWidth = size * 5;
    var previewHeight = size * 4;
    var previewX = canvas.width() - 5 - previewWidth;
    var previewY = 5;
    var top = previewY + previewHeight;

    function renderHud() {
        canvas.drawRect({ x: 1, y: 1, w: canvas.width() - 2, h: canvas.height() - 2 }, "#b1c9ef");
        canvas.drawRect({ x: 5, y: 5, w: settings.width * size + 2, h: settings.height * size + 2 }, "#b1c9ef");
        canvas.drawRect({ x: previewX, y: previewY, w: previewWidth, h: previewHeight });

        canvas.drawText("score:", { size: "16px", x: previewX, y: top + 10 });
        canvas.drawText(logic.score, { size: "16px", x: previewX, y: top + 26 });
        canvas.drawText("max:", { size: "16px", x: previewX, y: top + 48 });
        canvas.drawText(logic.maxScore, { size: "16px", x: previewX, y: top + 64 });
    }

    function renderNext() {
        var next = logic.next();
        var nextWidth = (next.right() - next.left() + 1) * size;
        var nextHeight = (next.bottom() - next.top() + 1) * size;
        var addX = (previewWidth - nextWidth) / 2;
        var addY = (previewHeight - nextHeight) / 2;
        renderFigure(next, { x: previewX + addX, y: previewY + addY });
    }

    function renderField() {
        var m = logic.matrix();
        for (var i = 0; i < m.length; i++)
            for (var j = 0; j < m[i].length; j++)
                if (m[i][j]) canvas.drawBlock({ x: j * size + 6, y: i * size + 6, w: size, h: size }, m[i][j].style);
        renderFigure(logic.current(), {x: 6, y: 6});
    }

    function renderInit() {
        renderHud();
        overflowText("Press space to start", "13.5pt", true);
    }

    function renderPlay() {
        renderHud();
        renderNext();
        renderField();
    }

    function renderPause() {
        renderPlay();
        overflowText("Paused", "16pt");
    }

    function renderOver() {
        renderHud();
        renderField();
        overflowText("Game Over", "16pt");
    }

    var actions = {};
    actions[STATES.INIT] = renderInit;
    actions[STATES.PLAY] = renderPlay;
    actions[STATES.PAUSE] = renderPause;
    actions[STATES.OVER] = renderOver;

    this.render = function (timestamp, state) {
        canvas.clear();
        if (state in actions)
            actions[state](timestamp, state);
    };
};
