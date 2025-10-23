class Bloon {
    constructor(health, color, speed, immunities){
        this.health = health;
        this.color = color;
        this.speed = speed;
        this.immunities = immunities;
        this.position = 0;
    }
    move(maxLen){
        if (this.position < maxLen){
            this.position += this.speed;
            return false;
        } else {
            return true;
        }
    }
    hit(dmg, dmgType){
        if (!this.immunities.find(dmgType)){
            this.health -= dmg;
        }
        return (this.health <= 0);
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position, 40, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}