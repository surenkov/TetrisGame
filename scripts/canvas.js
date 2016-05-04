
var Canvas = function(options, el) {
    var defaultOptions = {
        fill: "transparent",
        stroke: { width: 6, color: "#695aa0" },
        text: {
            color: "#695aa0",
            align: "left",
            baseline: "top",
            size: "15pt",
            font: "GraphicPixel"
        }
    };
    Object.extend(defaultOptions, options);

    this.el = el || document.createElement("canvas");
    var ctx = this.el.getContext("2d");

    this.width = function() { return this.el.width; };
    this.height = function() { return this.el.height; };
    this.getContext = function() { return ctx; };

    this.clear = function(rect) {
        rect = rect || { x: 0, y: 0, w: width(), h: height() };
        ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
    };

    this.drawText = function(text, options) {
        ctx.save();
        ctx.fillStyle = options["color"] || defaultOptions.text.color;
        ctx.textAlign = options["align"] || defaultOptions.text.align;
        ctx.textBaseline = options["baseline"] || defaultOptions.text.baseline;
        ctx.font = (options["size"] || defaultOptions.text.size) + " " + (options["font"] || defaultOptions.text.font);
        ctx.fillText(text, options.x, options.y);
        ctx.restore();
    };

    this.drawRect = function(rect, fill, stroke) {
        fill = fill || defaultOptions.fill;
        stroke = stroke || defaultOptions.stroke;

        ctx.save();
        ctx.lineWidth = stroke.width;
        ctx.strokeStyle = stroke.color;
        ctx.fillStyle = fill;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
        ctx.restore();
    };

    this.drawBlock = function(rect, style) {
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
    };
};