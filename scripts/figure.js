
var Figure = function (options) {
    this.x = 0;
    this.y = 0;
    this.score = options.score;
    this.style = options.style;

    var rotation = 0;
    var matrices = options.matrices;

    var staged = null;
    this.stage = function() {
        staged = {
            rotation: rotation,
            x: this.x,
            y: this.y
        };
    };

    this.unstage = function() {
        if (staged == null) return;
        this.x = staged.x;
        this.y = staged.y;
        rotation = staged.rotation;
        staged = null;
    };

    this.matrix = function() {
        return matrices[rotation % matrices.length];
    };

    this.rotate = function() {
        return ++rotation % matrices.length;
    };

    this.left = function () {
        var m = this.matrix();
        for (var i = 0; i < m[0].length; i++)
            for (var j = 0; j < m.length; j++)
                if (m[j][i]) return this.x + i;
        return this.x + m[0].length - 1;
    };

    this.top = function () {
        var m = this.matrix();
        for (var i = 0; i < m.length; i++)
            for (var j = 0; j < m[i].length; j++)
                if (m[i][j]) return this.y + i;
        return this.y + m.length - 1;
    };

    this.right = function () {
        var m = this.matrix();
        for (var i = m[0].length - 1; i >= 0; i--)
            for (var j = m.length - 1; j >= 0; j--)
                if (m[j][i]) return this.x + i;
        return this.x;
    };

    this.bottom = function () {
        var m = this.matrix();
        for (var i = m.length - 1; i >= 0; i--)
            for (var j = 0; j < m[i].length; j++)
                if (m[i][j]) return this.y + i;
        return this.y;
    };
};
