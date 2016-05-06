
var GameTimer = function(renderFunc, delay) {
    var animHandler = 0;
    var elapsedTime = 0;
    this.delay = delay;

    var renderWrapperCallback = function(timestamp) {
        if (timestamp - elapsedTime >= this.delay) {
            renderFunc(timestamp);
            elapsedTime = timestamp;
        }
        animHandler = window.requestAnimationFrame(renderWrapperCallback);
    }.bind(this);

    this.start = function() {
        window.requestAnimationFrame(renderWrapperCallback);
    };

    this.immediate = function() {
        window.requestAnimationFrame(renderFunc);
    };

    this.stop = function() {
        window.cancelAnimationFrame(animHandler);
    };
};
