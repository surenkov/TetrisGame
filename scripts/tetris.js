var KEY = { D: 68, W: 87, A: 65, S: 83, RIGHT: 39, UP: 38, LEFT: 37, DOWN: 40, Q: 81, SPACE: 32, PAUSE: 19 },
    STATES = { PAUSE: 1, PLAY: 0, OVER: 2 },
    defaultStroke = { width: 6, color: "#695aa0" };

var styles = [
    { fg: "#fff38b", bg: "#cabc47", ct: "#ffe400" },
    { fg: "#ac7fff", bg: "#5d36a5", ct: "#5701f5" },
    { fg: "#d58cff", bg: "#5d297a", ct: "#9c00f5" },
    { fg: "#ff8f63", bg: "#b0522d", ct: "#f54500" },
    { fg: "#8aff61", bg: "#499d2c", ct: "#56e325" },
    { fg: "#7ed9ff", bg: "#1b80aa", ct: "#00b4ff" }
];

Array.prototype.randomIndex = function () {
    return Math.floor(Math.random() * this.length);
}

function drawRect(ctx, rect, fill, stroke) {
    var fill = fill || "transparent",
        stroke = stroke || defaultStroke;

    ctx.lineWidth = stroke.width;
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = fill;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

function drawBlock(ctx, rect, style) {
    ctx.save();
    ctx.fillStyle = style.ct;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.lineWidth = 2;

    ctx.strokeStyle = style.bg;
    ctx.beginPath();
    ctx.moveTo(rect.x + 1, rect.y);
    ctx.lineTo(rect.x + 1, rect.y + rect.h - 1);
    ctx.lineTo(rect.x + rect.w, rect.y + rect.h - 1);
    ctx.stroke();

    ctx.strokeStyle = style.fg;
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.w - 1, rect.y + rect.h - 2);
    ctx.lineTo(rect.x + rect.w - 1, rect.y + 1);
    ctx.lineTo(rect.x + 2, rect.y + 1);
    ctx.stroke();

    ctx.fillStyle = style.fg;
    ctx.beginPath();
    ctx.moveTo(rect.x, rect.y);
    ctx.lineTo(rect.x + 2, rect.y + 2);
    ctx.lineTo(rect.x + 2, rect.y);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rect.x + rect.w, rect.y + rect.h);
    ctx.lineTo(rect.x + rect.w - 2, rect.y + rect.h - 2);
    ctx.lineTo(rect.x + rect.h - 2, rect.y);
    ctx.fill();
    ctx.restore();
}

var Tetris = function (settings) {
    this.speed = settings.speed || 300;
    this.accelerate = settings.accelerate || false;
    this.accelerateStep = settings.accelerateStep || 10;
    this.acceleration = settings.acceleration || 50;
    this.minSpeed = settings.minSpeed || 150;
    this.parent = settings.parent;

    var mainCanvas = document.createElement("canvas"),
        gameCanvas = document.createElement("canvas"),
        state = STATES.OVER,
        self = this,
        size = 20,
        height = 0,
        width = 0,
        renderFunc = null,
        speedInc = null,
        animHandler = -1,
        timestamp = 0;

    var gctx = gameCanvas.getContext("2d"),
        mctx = mainCanvas.getContext("2d");

    var figure = null,
        next = null,
        rotation = 0,
        matrixF = new Array(),
        stableSpeed = this.speed,
        stats = {
            count: 0,
            score: 0,
            maxScore: function () {
                var max = localStorage.getItem("max_score");
                return max ? parseInt(max) : 0;
            },
            addCount: function (cnt) {
                this.count += cnt;
                this.draw();
                if (self.accelerate && this.count > 0 && this.count % self.accelerateStep == 0)
                    self.speed = stableSpeed = Math.max(stableSpeed - self.acceleration, self.minSpeed);
            },
            addScore: function (cnt) {
                this.score += cnt;
                localStorage.setItem("max_score", Math.max(this.maxScore(), this.score));
                this.draw();
            },
            draw: function () {
                var x = gameCanvas.x + gameCanvas.width + size * 2 - 10,
                    y = size * 7,
                    w = mainCanvas.width - 13 * size,
                    h = size * 9,
                    t1 = "score:",
                    t2 = "max:",
                    t3 = "count:",
                    max = this.maxScore();

                mctx.fillStyle = "#b1c9ef";
                mctx.fillRect(x, y, w, h);
                mctx.fillStyle = "#695aa0";
                mctx.textAlign = "left";
                mctx.textBaseline = "top";

                mctx.font = "15pt GraphicPixel";
                mctx.fillText(t1, x, y);
                mctx.font = "20pt GraphicPixel";
                mctx.fillText(stats.score, x + 10, y + 20);

                mctx.font = "15pt GraphicPixel";
                mctx.fillText(t2, x, y + 55);
                mctx.font = "20pt GraphicPixel";
                mctx.fillText(max, x + 10, y + 75);

                mctx.font = "15pt GraphicPixel";
                mctx.fillText(t3, x, y + 110);
                mctx.font = "20pt GraphicPixel";
                mctx.fillText(stats.count, x + 10, y + 130);
            }
        };

    var figures = [
        new FigureC(),
        new FigureD(),
        new FigureE(),
        new FigureF(),
        new FigureG(),
        new FigureH(),
        new FigureI()
    ];

    function newFigure() {
        var res = Object.create(figures[figures.randomIndex()]);
        res.x = Math.floor((width - res.right()) / 2);
        return res;
    }

    function drawNext() {
        var rect = {
            x: gameCanvas.x + gameCanvas.width + size - 5,
            y: size - 3.5,
            width: mainCanvas.width - 12 * size,
            height: size * 5
        };
        mctx.clearRect(rect.x, rect.y, rect.width, rect.height);
        drawRect(mctx, rect, "#c4d7f3", { width: 3, color: defaultStroke.color });

        if (next == null)
            return;

        var x = next.x,
            y = next.y;

        next.x = Math.round((rect.x + rect.width / 2) / size - (next.right() - next.left()) / 2);
        next.y = Math.round((rect.y + rect.height / 2) / size - (next.bottom() - next.top()) / 2);

        next.draw(mctx, size);
        next.x = x;
        next.y = y;
    }

    function removeFilledLines() {
        var lines = [];
        for (var i = 0; i < matrixF.length; i++) {
            var count = 0;
            for (var j = 0; j < matrixF[i].length; j++)
                if (matrixF[i][j] != null)
                    count++
            if (count == matrixF[i].length)
                lines.push(i);
        }
        for (var i = 0; i < lines.length; i++) {
            matrixF.splice(lines[i], 1);
            matrixF = [new Array(width)].concat(matrixF);
        }
        stats.addScore(lines.length * 100);
    }

    var press = function (e) {
        var code = e.keyCode;
        switch (code) {
            case KEY.RIGHT:
            case KEY.D:
                figure.makeStep(matrixF, state,
                    function (figure) {
                        figure.x++;
                    },
                    function (figure) {
                        figure.x--;
                    });
                break;

            case KEY.UP:
            case KEY.W:
                figure.makeStep(matrixF, state,
                    function (figure) {
                        figure.rotation++;
                    },
                    function (figure) {
                        figure.rotation--;
                    });
                break;

            case KEY.LEFT:
            case KEY.A:
                figure.makeStep(matrixF, state,
                    function (figure) {
                        figure.x--;
                    },
                    function (figure) {
                        figure.x++;
                    });
                break;

            case KEY.DOWN:
            case KEY.S:
                this.speed = 40;
                break;

            case KEY.SPACE:
            case KEY.PAUSE:
                this.togglePlay();
                break;
        }
        draw();
    }.bind(this);

    var up = function (e) {
        var code = e.keyCode;
        switch (code) {
            case KEY.DOWN:
            case KEY.S:
                this.speed = stableSpeed;
        }
        renderFunc();
    }.bind(this);

    function draw() {
        gctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        figure.draw(gctx, size);
        for (var i = 0; i < matrixF.length; i++)
            for (var j = 0; j < matrixF[i].length; j++)
                if (matrixF[i][j] != null)
                    drawBlock(
                        gctx,
                        {
                            x: size * j,
                            y: size * i,
                            w: size,
                            h: size
                        },
                        styles[matrixF[i][j]]);
        if (state != STATES.PLAY) {
            gctx.fillStyle = "rgba(130, 160, 255, 0.6)";
            gctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            gctx.fillStyle = "white";
            gctx.font = "30pt GraphicPixel";
            gctx.textAlign = "center";
            gctx.textBaseline = "middle";
            if (state == STATES.OVER) {
                gctx.fillText("Game Over",
                Math.floor(gameCanvas.width / 2),
                Math.floor(gameCanvas.height / 2),
                gameCanvas.width - 10);
                next = null;
            }
            if (state == STATES.PAUSE) {
                gctx.fillText("Pause",
                Math.floor(gameCanvas.width / 2),
                Math.floor(gameCanvas.height / 2),
                gameCanvas.width - 10);
            }
            drawNext();
        }
    }

    function step() {
        if (state == STATES.PLAY) {
            var success = figure.makeStep(matrixF, state,
                function (figure) {
                    figure.y += 1;
                },
                function (figure) {
                    figure.y -= 1;
                });

            if (!success) {
                if (figure.y == 0) {
                    gameOver.call(this);
                }
                else {
                    addFigure(figure);
                    figure = next;
                    next = newFigure();
                    stats.addCount(1);
                    drawNext();
                }
            }
            removeFilledLines();
        }
    }

    function addFigure(fig) {
        var m = fig.currentMatrix(),
            x = fig.x,
            y = fig.y;

        for (var i = 0; i < m.length; i++)
            for (var j = 0; j < m[i].length; j++)
                if (m[i][j] != 0)
                    matrixF[y + i][x + j] = fig.style;

        stats.addScore(figure.score * 5);
    }

    function render() {
        var time = new Date().getTime();
        if (time >= timestamp + this.speed) {
            console.log("Render called");
            draw.call(this);
            step.call(this);
            timestamp = time;
        }
        if (state == STATES.PLAY)
            animHandler = requestAnimationFrame(renderFunc);
    }

    function gameOver() {
        document.removeEventListener("keydown", press);
        document.removeEventListener("keyup", up);
        addFigure(figure);

        var evt = document.createEvent("Event");
        evt.initEvent("gameover", true, false);
        this.parent.dispatchEvent(evt);

        state = STATES.OVER;
        draw();
        this.stop();
    }

    this.start = function () {
        document.addEventListener("keydown", press);
        document.addEventListener("keyup", up);
        state = STATES.PLAY;
        figure = newFigure();
        next = newFigure();
        drawNext();
        animHandler = requestAnimationFrame(renderFunc);
    }.bind(this);

    this.continue = function () {
        state = STATES.PLAY;
        animHandler = requestAnimationFrame(renderFunc);
    };

    this.stop = function () {
        state = STATES.PAUSE;
        cancelAnimationFrame(animHandler);
    };

    this.togglePlay = function () {
        if (state == STATES.PLAY)
            this.stop();
        else if (state == STATES.PAUSE)
            this.continue();
    }

    renderFunc = render.bind(this);
    mainCanvas.x = mainCanvas.y = 0;
    gameCanvas.x = gameCanvas.y = 9.5;
    mainCanvas.height = 400;
    mainCanvas.width = 360;
    gameCanvas.height = 380;
    gameCanvas.width = 200;
    mainCanvas.style.position = "absolute";
    gameCanvas.style.position = "absolute";
    gameCanvas.style.top = "10px";
    gameCanvas.style.left = "10px";

    settings.parent.appendChild(mainCanvas);
    settings.parent.appendChild(gameCanvas);

    drawRect(mctx, mainCanvas, "#b1c9ef");
    drawRect(mctx,
            {
                x: gameCanvas.x - 1,
                y: gameCanvas.y - 1,
                height: gameCanvas.height + 3,
                width: gameCanvas.width + 3
            },
            "rgba(255, 255, 255, .25)",
            { width: 3, color: defaultStroke.color });

    height = Math.floor(gameCanvas.height / size);
    width = Math.floor(gameCanvas.width / size);

    matrixF = new Array(height);
    for (var i = 0; i < height; i++)
        matrixF[i] = new Array(width);

    mctx.font = "30pt GraphicPixel";
    mctx.fillStyle = "#fff";
    mctx.strokeStyle = "#695aa0";
    mctx.lineWidth = 6;
    mctx.strokeText(
        "Tetris",
        gameCanvas.width + 24,
        gameCanvas.height + 7,
        mainCanvas.width - gameCanvas.width - 10);
    mctx.fillText(
        "Tetris",
        gameCanvas.width + 24,
        gameCanvas.height + 7,
        mainCanvas.width - gameCanvas.width - 10);
    drawNext();
    stats.draw();
}


var Figure = function () {
    this.x = 0;
    this.y = 0;
    this.score = 0;
    this.rotation = 0;
    this.matrices = null;
    this.style = styles.randomIndex();
};
Figure.prototype.draw = function (ctx, size) {
    var m = this.currentMatrix(),
        x = 0,
        y = 0;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, this.x * size, this.y * size);
    for (var i = 0; i < m.length; i++, y += size, x = 0)
        for (var j = 0; j < m[i].length; j++, x += size)
            if (m[i][j]) drawBlock(ctx, { x: x, y: y, w: size, h: size }, styles[this.style]);
    ctx.restore();
};
Figure.prototype.left = function () {
    var m = this.currentMatrix(),
        left = Infinity;
    for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[i].length; j++) {
            if (m[i][j]) {
                left = Math.min(left, j);
                break;
            }
        }
    }
    return this.x + left;
};
Figure.prototype.top = function () {
    var m = this.currentMatrix(),
        top = -1;
    for (var i = 0; i < m.length && top == -1; i++)
        for (var j = 0; j < m[i].length && top == -1; j++)
            if (m[i][j])
                top = i;
    return this.y + top;
};
Figure.prototype.right = function () {
    var m = this.currentMatrix(),
        size = size || 1,
        right = -1;
    for (var i = 0; i < m.length; i++) {
        for (var j = m[i].length - 1; j >= 0; j--) {
            if (m[i][j]) {
                right = Math.max(right, j);
                break;
            }
        }
    }
    return this.x + right + 1;
};
Figure.prototype.bottom = function () {
    var m = this.currentMatrix(),
        size = size || 1,
        bottom = -1;
    for (var i = m.length - 1; i >= 0 && bottom == -1; i--)
        for (var j = 0; j < m[i].length && bottom == -1; j++)
            if (m[i][j])
                bottom = i;
    return this.y + bottom + 1;
};
Figure.prototype.currentMatrix = function () {
    return this.matrices[this.rotation % this.matrices.length];
};
Figure.prototype.makeStep = function (matrix, state, step, restore) {
    if (state != STATES.PLAY)
        return false;
    step(this);
    var m = this.currentMatrix(),
        bottom = this.bottom(),
        right = this.right(),
        left = this.left(),
        top = this.top(),
        h = m.length,
        w = m[0].length;
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            var contains =
                    left < 0 ||
                    bottom > matrix.length ||
                    right > matrix[0].length;
            if (matrix[this.y + i] != null)
                contains |= matrix[this.y + i][this.x + j] != null;
            if (contains && m[i][j] != 0) {
                restore(this);
                return false;
            }
        }
    }
    return true;
};

var FigureC = function () {
    Figure.call(this);

    this.score = 4;
    this.matrices = [
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
        ],
        [
            [0, 1],
            [0, 1],
            [0, 1],
            [0, 1],
        ],
    ];
};
FigureC.prototype = new Figure();
FigureC.prototype.constructor = FigureC;


var FigureD = function () {
    Figure.call(this);

    this.score = 4;
    this.matrices = [
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 1]
        ],
        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ],
        [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 1, 1],
            [0, 1, 0],
            [0, 1, 0]
        ]
    ];
};
FigureD.prototype = new Figure();
FigureD.prototype.constructor = FigureD;


var FigureE = function () {
    Figure.call(this);

    this.score = 4;
    this.matrices = [
        [
            [1, 0],
            [1, 1],
            [0, 1]
        ],
        [
            [0, 1, 1],
            [1, 1, 0]
        ]
    ];
};
FigureE.prototype = new Figure();
FigureE.prototype.constructor = FigureE;


var FigureF = function () {
    Figure.call(this);

    this.score = 4;
    this.matrices = [
        [
            [0, 1],
            [1, 1],
            [1, 0]
        ],
        [
            [1, 1, 0],
            [0, 1, 1]
        ]
    ];
};
FigureF.prototype = new Figure();
FigureF.prototype.constructor = FigureF;


var FigureG = function () {
    Figure.call(this);

    this.score = 4;
    this.matrices = [
        [
            [0, 1, 0],
            [1, 1, 1],
        ],
        [
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 1],
            [1, 1],
            [0, 1]
        ]
    ];
};
FigureG.prototype = new Figure();
FigureG.prototype.constructor = FigureG;


var FigureH = function () {
    Figure.call(this);

    this.score = 4;
    this.matrices = [
        [
            [1, 1],
            [1, 1]
        ]
    ];
};
FigureH.prototype = new Figure();
FigureH.prototype.constructor = FigureH;


var FigureI = function () {
    Figure.call(this);

    this.score = 4;
    this.matrices = [
        [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [1, 0, 0]
        ],
        [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ]
    ];
};
FigureI.prototype = new Figure();
FigureI.prototype.constructor = FigureI;
