
var Figure = function (options) {
    this.x = 0;
    this.y = 0;
    this.rotation = 0;

    this.matrices = options.matrices;
    this.score = options.score;

    this.currentMatrix = function() {
        return this.matrices[this.rotation % this.matrices.length];
    };

    this.nextMatrix = function() {
        return ++this.rotation % this.matrices.length;
    }

    this.draw = function(canvas, size) {
        
    };

    this.left = function () {
        var m = this.currentMatrix();
        for (var i = 0; i < m[0].length; i++)
            for (var j = 0; j < m.length; j++)
                if (m[j][i]) return this.x + i;
        return this.x + m[0].length - 1;
    };

    this.top = function () {
        var m = this.currentMatrix();
        for (var i = 0; i < m.length; i++)
            for (var j = 0; j < m[i].length; j++)
                if (m[i][j]) return this.y + i;
        return this.y + m.length - 1;
    };

    this.right = function () {
        var m = this.currentMatrix();
        for (var i = m[0].length - 1; i >= 0; i--)
            for (var j = m.length - 1; j >= 0; j--)
                if (m[j][i]) return this.y + i;
        return this.x;
    };

    this.bottom = function () {
        var m = this.currentMatrix();
        for (var i = m.length - 1; i >= 0; i--)
            for (var j = 0; j < m[i].length; j++)
                if (m[i][j]) return this.y + i;
        return this.y;
    };
};

