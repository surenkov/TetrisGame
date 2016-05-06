
var Tetris = function(parent) {
    var styles = [
        { fg: "#fff38b", bg: "#cabc47", ct: "#ffe400" },
        { fg: "#ac7fff", bg: "#5d36a5", ct: "#5701f5" },
        { fg: "#d58cff", bg: "#5d297a", ct: "#9c00f5" },
        { fg: "#ff8f63", bg: "#b0522d", ct: "#f54500" },
        { fg: "#8aff61", bg: "#499d2c", ct: "#56e325" },
        { fg: "#7ed9ff", bg: "#1b80aa", ct: "#00b4ff" }
    ];

    var factory = new FigureFactory([{
        score: 4,
        style: styles[0],
        matrices: [
            [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
            [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
            [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
            [[0, 1, 1], [0, 1, 0], [0, 1, 0]]
        ]
    }, {
        score: 4,
        style: styles[1],
        matrices: [
            [[1, 0], [1, 1], [0, 1]],
            [[0, 1, 1], [1, 1, 0]]
        ]
    }, {
        score: 4,
        style: styles[2],
        matrices: [
            [[0, 1], [1, 1], [1, 0]],
            [[1, 1, 0], [0, 1, 1]]
        ]
    }, {
        score: 4,
        style: styles[3],
        matrices: [
            [[0, 1, 0], [1, 1, 1]],
            [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
            [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
            [[0, 1], [1, 1], [0, 1]]
        ]
    }, {
        score: 4,
        style: styles[4],
        matrices: [[[1, 1], [1, 1]]]
    }, {
        score: 4,
        style: styles[5],
        matrices: [
            [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
            [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
            [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
            [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
        ]
    }]);

    var manager = new GameManager(factory);
    parent.appendChild(manager.init());
}