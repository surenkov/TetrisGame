
var FigureFactory = function(figures) {
    this.registry = [];

    this.registerFigure = function (options) {
        this.registry.push(options);
    };

    this.registerFigures = function (iterable) {
        for (var i = 0; i < iterable.length; i++)
            this.registry.push(iterable[i]);
    };

    this.randomFigure = function() {
        return new Figure(Array.random(this.registry));
    };

    if (figures) this.registerFigures(figures);
};

