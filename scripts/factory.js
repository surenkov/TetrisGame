
var FigureFactory = function() {
    this.randomFigure = function() {
        return new Figure(Array.random(FigureFactory.registry));
    };
};

FigureFactory.registry = [];

FigureFactory.registerFigure = function(options) {
    this.registry.push(options);
};

FigureFactory.registerFigures = function(iterable) {
    for (var i = 0; i < iterable.length; i++)
        this.registry.push(iterable[i]);
};