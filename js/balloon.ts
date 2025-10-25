class Bloon {
    damage: number;
    color: string;
    speed: number;
    immunities: Array<string>;
    position: number;
    x: number;
    y: number;
    size: number;
    line: number;
    constructor(damage:number, color:string, speed:number, immunities:Array<string>, size:number, position = 0, line = 0){
        this.damage = damage;
        this.color = color;
        this.speed = speed;
        this.immunities = immunities;
        this.position = position;
        this.line = line;
        this.size = size;
    }

    move(curve: BezierCurve, delta: number):boolean{
        if (this.position + this.speed*delta < curve.getLength()){
            this.position += this.speed*delta;
            let point = curve.getPointAtDistance(this.position);
            this.x = point.x;
            this.y = point.y;
            return false;
        } else {
            this.position = 0;
            this.line++;
            return true;
        }
    }

    hit(dmg: number, dmgType:string, bloonArray: Array<Bloon>):boolean{
        if (!this.immunities.includes(dmgType)){
            // bloonArray.push(new Bloon()); TODO: EVENTUALLY MAKE THIS SPAWN THE NEXT LEVEL DOWN
            return true;
        }
        return false;
    }

    draw(ctx:CanvasRenderingContext2D):void{
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
	    ctx.strokeStyle = "black";
	    ctx.lineWidth = 2;
	    ctx.beginPath();
	    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	    ctx.stroke();
    }
}
