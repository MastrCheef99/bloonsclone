class Bloon {
    health: number;
    color: string;
    speed: number;
    immunities: Array<string>;
    position: number;
    x: number;
    y: number;
    line: number;
    constructor(health:number, color:string, speed:number, immunities:Array<string>){
        this.health = health;
        this.color = color;
        this.speed = speed;
        this.immunities = immunities;
        this.position = 0;
        this.line = 0;
    }

    move(curve: BezierCurve):boolean{
        if (this.position + this.speed < curve.getLength()){
            this.position += this.speed;
            let point = curve.getPointAtDistance(this.position);
            this.x = point.x;
            this.y = point.y;
            return false;
        } else {
            return true;
        }
    }

    hit(dmg: number, dmgType:string):boolean{
        if (!this.immunities.includes(dmgType)){
            this.health -= dmg;
        }
        return (this.health <= 0);
    }

    draw(ctx:CanvasRenderingContext2D):void{
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.fill();
	    ctx.strokeStyle = "black";
	    ctx.lineWidth = 3;
	    ctx.beginPath();
	    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
	    ctx.stroke();
    }
}
