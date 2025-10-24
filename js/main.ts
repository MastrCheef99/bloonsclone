const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx= canvas.getContext("2d") as CanvasRenderingContext2D;

const GAME_WIDTH = 2560;
const GAME_HEIGHT = 1440;

const internalCanvas = document.createElement("canvas") as HTMLCanvasElement;
internalCanvas.width = GAME_WIDTH;
internalCanvas.height = GAME_HEIGHT;
const internalCtx = internalCanvas.getContext("2d") as CanvasRenderingContext2D;

resize();

window.addEventListener('resize', resize, true);

const p0: Point = {x: 26, y: 79};
const p1: Point = {x: 116*5, y: 216*5};
const p2: Point = {x: 169*5, y:21};
const p3: Point = {x: 233*5, y:79};

let bezier = new BezierCurve(p0, p1, p2, p3);

const track: Track = new Track([bezier], []);
var maxLen = 1900;
track.bloonArray.push(new Bloon(10, "blue", 5, ["bomb"]));

requestAnimationFrame(loop);

function loop(){
    internalCtx.fillStyle = "white";
    internalCtx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    internalCtx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    track.bloonLine.forEach(curve => {
        curve.render(internalCtx);
    })
    track.bloonArray.forEach(bloon => {
        bloon.move(track.bloonLine[0]);
        bloon.draw(internalCtx);
    });
    renderToScreen();
    requestAnimationFrame(loop);
}

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


function renderToScreen() { //this renders with bars to keep aspect ratio
    const scaleX = canvas.width / GAME_WIDTH;
    const scaleY = canvas.height / GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);

    const ctxWidth = GAME_WIDTH * scale;
    const ctxHeight = GAME_HEIGHT * scale;
    const offsetX = (canvas.width - ctxWidth) / 2; //barsize
    const offsetY = (canvas.height - ctxHeight) / 2; //rsize

    ctx.fillStyle = "black"; // Black bars
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = false; // does something
    ctx.drawImage(
        internalCanvas,
        0, 0, GAME_WIDTH, GAME_HEIGHT,
        offsetX, offsetY, ctxWidth, ctxHeight
    );
}
