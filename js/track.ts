//Thank you chatgpt for the help with the calculus
interface Point {
  x: number;
  y: number;
}

class BezierCurve {
  constructor(
    public p0: Point,
    public p1: Point,
    public p2: Point,
    public p3: Point
  ) {}

  /** Get a point at parameter t ∈ [0, 1] */
  getPoint(t: number): Point {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const x = uuu * this.p0.x
            + 3 * uu * t * this.p1.x
            + 3 * u * tt * this.p2.x
            + ttt * this.p3.x;

    const y = uuu * this.p0.y
            + 3 * uu * t * this.p1.y
            + 3 * u * tt * this.p2.y
            + ttt * this.p3.y;

    return { x, y };
  }

  /** Approximate the total curve length */
  getLength(samples = 100): number {
    let length = 0;
    let prev = this.getPoint(0);

    for (let i = 1; i <= samples; i++) {
      const t = i / samples;
      const point = this.getPoint(t);
      length += Math.hypot(point.x - prev.x, point.y - prev.y);
      prev = point;
    }

    return length;
  }

  /**
   * Get the point at a specific distance along the curve.
   * Clamps automatically if distance < 0 or > total length.
   */
  getPointAtDistance(distance: number, samples = 200): Point {
    const total = this.getLength(samples);
    const target = Math.min(Math.max(distance, 0), total);

    let prev = this.getPoint(0);
    let traveled = 0;

    for (let i = 1; i <= samples; i++) {
      const t = i / samples;
      const point = this.getPoint(t);
      const segLen = Math.hypot(point.x - prev.x, point.y - prev.y);

      if (traveled + segLen >= target) {
        const ratio = (target - traveled) / segLen;
        return {
          x: prev.x + (point.x - prev.x) * ratio,
          y: prev.y + (point.y - prev.y) * ratio,
        };
      }

      traveled += segLen;
      prev = point;
    }

    return this.getPoint(1);
  }
  
  render(ctx: CanvasRenderingContext2D){
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.p0.x, this.p0.y);
    ctx.bezierCurveTo(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
    ctx.stroke();
  }
}

class Track {
    bloonLine: Array<BezierCurve>;
    bloonArray: Array<Bloon>;

    constructor(bloonLine: Array<BezierCurve>, bloonArray: Array<Bloon>){
        this.bloonLine = bloonLine;
        this.bloonArray = bloonArray;
    }
}