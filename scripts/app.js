function start() {
    var init = {
        speed: 500,
        accelerate: true,
        parent: document.getElementById("tetris-canvas")
    };
    init.parent.style.top = (Math.floor(window.innerHeight / 2) - 200) + "px";
    init.parent.style.left = (Math.floor(window.innerWidth / 2) - 200) + "px";

    var tetris = new Tetris(init);

    var a = document.createElement("a");
    a.className = "tetris-action";
    init.parent.appendChild(a);
    a.innerHTML = "Start";
    a.style.width = "110px";
    a.addEventListener("click", function (e) {
        e.preventDefault();
        document.removeEventListener("keypress", press);
        init.parent.removeChild(e.target);
        tetris.start();
    });

    var press = function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            document.removeEventListener("keypress", press);
            init.parent.removeChild(a);
            tetris.start();
        }
    };
    document.addEventListener("keypress", press);
};
