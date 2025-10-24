const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx= canvas.getContext("2d") as CanvasRenderingContext2D;

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

const internalCanvas = document.createElement("canvas") as HTMLCanvasElement;
internalCanvas.width = GAME_WIDTH;
internalCanvas.height = GAME_HEIGHT;
const internalCtx = internalCanvas.getContext("2d") as CanvasRenderingContext2D;

resize();

window.addEventListener('resize', resize, true);

let debug = false;
let debugClicked = false;

document.addEventListener('keydown', (e)=>{
    if (e.key == "d" && !debugClicked){
        debug = !debug;
        debugClicked = true;
    }
})

document.addEventListener('keyup', (e)=>{
    if (e.key == "d"){
        debugClicked = false;
    }
})

let bezierCurveArray: Array<BezierCurve> = [];
let tunnelSegments: Array<number> = [];
let unplaceArr: Array<Array<Point>> = [];
loadTrack("trackjson/monkeyLane.json", bezierCurveArray, tunnelSegments);

const trackImg = new Image();
trackImg.src = "img/tracks/monkeyLane.jpg";
trackImg.addEventListener("error", (e) => {
    console.error("Error loading image:", e);
  });
const track: Track = new Track(bezierCurveArray, [], trackImg, tunnelSegments);
var maxLen = 1900;
track.bloonArray.push(new Bloon(10, "blue", 200, []));
track.bloonArray.push(new Bloon(10, "red", 150, []));

let lastTime = performance.now();
let currentTime = performance.now()+1;

requestAnimationFrame(loop);

function loop(){
    currentTime = performance.now();
    const dtMs = currentTime - lastTime;
    let dtSeconds = dtMs / 1000;
    dtSeconds = Math.min(dtSeconds, 0.1);

    
    internalCtx.fillStyle = "white";
    internalCtx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    internalCtx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    track.drawBg(internalCtx);
    track.moveBloons(dtSeconds);
    track.drawBloons(internalCtx);
    if (debug) track.debugRenderCurves(internalCtx);
    renderToScreen();
    lastTime = currentTime;
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

    ctx.imageSmoothingEnabled = true; // does something
    ctx.drawImage(
        internalCanvas,
        0, 0, GAME_WIDTH, GAME_HEIGHT,
        offsetX, offsetY, ctxWidth, ctxHeight
    );
}

interface Segment {
    p0: Point;
    p1: Point;
    p2: Point;
    p3: Point;
}

interface TrackData {
    segments: Segment[];
    tunnelSegments: Array<number>;
    unplaceablePoints: Array<Point>;
}

function loadTrack(url:string, array: Array<BezierCurve>, tunnelArr: Array<number>){
    const jsonData:TrackData = loadJSONSync<TrackData>("trackjson/monkeyLane.json");
    jsonData.segments.forEach(segment => {
        array.push(new BezierCurve(
            segment.p0,
            segment.p1,
            segment.p2,
            segment.p3
        ));
    });
    jsonData.tunnelSegments.forEach(segment => {
        tunnelArr.push(segment);
    });
}

function loadJSONSync<T = any>(url: string): T {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url + "?_=" + Date.now(), false); // false = synchronous
  xhr.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  xhr.setRequestHeader("Pragma", "no-cache");
  xhr.setRequestHeader("Expires", "0");
  xhr.send(null);

  if (xhr.status !== 200) {
    throw new Error(`HTTP error ${xhr.status} when loading ${url}`);
  }

  return JSON.parse(xhr.responseText);
}
