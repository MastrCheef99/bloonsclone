var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
resize();

window.addEventListener('resize', () => {
    resize();
}, true)

var track = [];
var maxLen = 10009;
track.push(new Bloon(10, "blue", 5, ["bomb"]));
requestAnimationFrame(loop);

function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    track.forEach(bloon => {
        bloon.move(maxLen);
        bloon.draw(ctx);
    });
    requestAnimationFrame(loop);
}

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}