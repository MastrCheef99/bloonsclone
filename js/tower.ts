class Projectile{
    type: string;
    x: number;
    y: number;
    speed: number;
    direction: number;
    timeLeft: number;
    pierce: number;
    name: string;
    color:string;

    constructor(type:string, x:number, y:number, speed: number, direction: number, timeLeft: number, pierce: number, name: string, color:string){
        this.type = type;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = direction;
        this.timeLeft = timeLeft;
        this.pierce = pierce;
        this.name = name;
        this.color = color;
    }

    loop(delta: number, bloonArr: Array<Bloon>):boolean{
        this.timeLeft -= delta;
        this.x+=Math.cos(this.direction);
        this.y+=Math.sin(this.direction);
        let remove: Array<number> = this.hit(bloonArr);

        for (let i = remove.length-1; i >= 0; i--){
            if (remove[i] != -1) bloonArr.splice(remove[i], 1);
        }
        if (remove.includes(-1)){
            return true;
        }
        return false;
    }

    hit(bloonArray: Array<Bloon>): Array<number>{
        let indicies: Array<number>= [];
        if (this.pierce <= 0){
            indicies.push(-1);
            return indicies;
        }
        for (let i = 0; i < bloonArray.length; i++){
            const bloon = bloonArray[i];
            if (pointInCircle(this.x, this.y, bloon.x, bloon.y, bloon.size)) indicies.push(i);
            if (this.pierce <= 0){
                indicies.push(-1);
                return indicies;
            }
        }
        return indicies;
    }

    copy(): Projectile{
        return new Projectile(this.type, this.x, this.y, this.speed, this.direction, this.timeLeft, this.pierce, this.name, this.color);
    }

    draw(ctx: CanvasRenderingContext2D):void{
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

interface Tower {
    x: number;
    y: number;
    range: number;
    fireRate: number;
    ugPathTracker: Array<number>;
    projectiles: Array<Projectile>;
    possibleProjectiles: Array<Projectile>;
    lastFire: number;
    
    loop(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    drawProjectiles(ctx: CanvasRenderingContext2D): void;
    upgrade(path: number):void;
    isUpgradeAvailable(path: number, money: number):boolean;
    moveProjectiles(): void;
}

class DartMonkey implements Tower{
    lastFire: number;
    fireRate: number;
    range: number;
    x: number;
    y: number;
    ugPathTracker: number[];
    projectiles: Projectile[];
    possibleProjectiles: Projectile[];
    loop(): void {
        //TODO: Try and fire a dart at a targeted bloon if performance.now()-fireRate=lastFire. Fires by making a new dart projectile with velocity aimed at bloon.
        throw new Error("Method not implemented.");
    }
    draw(ctx: CanvasRenderingContext2D): void {
        //TODO: Add variables that define how itll look (color, size, etc) and do a draw. SCRATCH THAT, HARDCODE IT
        throw new Error("Method not implemented.");
    }
    drawProjectiles(ctx: CanvasRenderingContext2D): void {
        //TODO: Loop through projectile array and call their .draw methods
        throw new Error("Method not implemented.");
    }
    upgrade(path: number): void {
        //TODO: assume upgrade is available, just increment on the path
        throw new Error("Method not implemented.");
    }
    isUpgradeAvailable(path: number, money: number): boolean {
        //TODO: check if there are any more available upgrades on the path and if you can afford them. REMEMBER. YOU CAN HARDCODE STUFF HERE
        throw new Error("Method not implemented.");
    }
    moveProjectiles(): void {
        //TODO: call .hit on each projectile
        throw new Error("Method not implemented.");
    }
}