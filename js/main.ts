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
const trackImg = new Image();
let track: Track;
let lastTime: number;
let currentTime: number;
let mask: ImageData;
let towers: Array<Tower> = [];

load();

async function load() {
    trackImg.addEventListener("error", (e) => {
        console.error("Error loading image:", e);
    });
    await loadTrack("trackjson/monkeyLane.json", bezierCurveArray, tunnelSegments);
    track = new Track(bezierCurveArray, [], trackImg, tunnelSegments);
    track.bloonArray.push(new Bloon(10, "blue", 200, [], 15));
    track.bloonArray.push(new Bloon(10, "red", 150, [], 15));
    lastTime = performance.now();
    currentTime = performance.now()+1;

    requestAnimationFrame(loop);
}



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
    imgurl: string;
    maskurl: string;
}

async function loadTrack(url:string, array: Array<BezierCurve>, tunnelArr: Array<number>){
    const data = await fetch("trackjson/monkeyLane.json");
    const jsonData: TrackData = await data.json();
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
    trackImg.src = jsonData.imgurl;
    mask = await loadMask(jsonData.maskurl);
}

async function loadMask(url: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      resolve(imageData);
    };
    img.onerror = reject;
    img.src = url + "?_=" + Date.now(); // disable cache
  });
}

function isBlocked(x: number, y: number, mask: ImageData): boolean {
  if (x < 0 || y < 0 || x >= mask.width || y >= mask.height) return true;
  const index = (Math.floor(y) * mask.width + Math.floor(x)) * 4;
  const r = mask.data[index];
  const g = mask.data[index + 1];
  const b = mask.data[index + 2];
  const brightness = (r + g + b) / 3;
  return brightness < 128;
}

function pointInCircle(px: number, py: number, cx: number, cy: number, r: number): boolean {
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= r * r;
}
