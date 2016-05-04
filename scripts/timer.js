
var RenderTimer = function(renderFunc, delay) {
    var animHandler = 0;
    var elapsedTime = 0;

    var start = this.start;
    var renderWrapperCallback = function(timestamp) {
        if (timestamp - elapsedTime >= delay) {
            renderFunc(timestamp);
            elapsedTime = timestamp;
        }
        start();
    }

    this.start = function() {
        animHandler = window.requestAnimationFrame(renderWrapperCallback);
    };

    this.stop = function() {
        window.cancelAnimationFrame(animHandler);
    };
}
