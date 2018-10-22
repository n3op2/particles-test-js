const getRnd = (min, max) => Math.random() * (max - min) + min;
const toNeg = (n) => -Math.abs(n); 
const toPos = (n) => Math.abs(n); 
const angPI = (min_deg, max_deg) => 2 * Math.PI / getRnd(min_deg, max_deg); 
const getDist = (tx, x, ty, y) => {
  let dx = tx - x;
  let dy = ty - y;
  return { dx: dx, dy: dy, dist: Math.sqrt((dx * dx) + (dy * dy)) };
}
const getDist2 = (x, y, tx, ty) => {
	let new_x, let new_y;
	let dx = tx - x; 
	let dy = ty - y; 
	let dist = Math.sqrt((dx * dx) + (dy * dy));
}
const newCords = (dx, dy, ratio) => { newX: ratio * dx, newY: ratio * dy }
/*
        let ratio;
        if(dist > this.vel){
          if(this.aStep < this.aStepMax) this.aStep *= this.f;
          if(this.vel < this.velMax) { 
            this.vel *= this.f;
            this.f *= 1.0008;
          }
          ratio = this.vel / dist;
          let new_x = ratio * dx;
          let new_y = ratio * dy;
          this.x += new_x - this.radius * Math.sin(this.a);
          this.y += new_y - this.radius * Math.cos(this.a);
        } 
      } else {
        if(this.aStep < this.aStepMax) this.aStep *= this.f;
*/

class Particle {
  constructor(x, y, ctx) {
		//To go through all of them
    this.dir = Math.random() > 0.5 ? true : false;
    this.ax = x, this.ay = y;
		this.f_range = getRnd(150, 25);
    this.x = x, this.y = y;
    this.vel = 2, this.velMax = 10;
    this.ctx = ctx
    this.r = getRnd(7, 1);
    this.f_default = 1.000873;
    this.f = this.f_default;
    this.a = 0;
    this.radius = getRnd(2, -2), this.radiusMax = 3.5;
    this.aStep = angPI(660, 40), this.aStepMax = 1.4;
    this.col = [Math.ceil(getRnd(155, 10)), Math.ceil(getRnd(150, 0)), 20];
    this.moves = {
      toText: false
    }

    this.draw = () => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgb(' + this.col.join(',') + ')';
      ctx.shadowColor = 'black';
			// Shadows are very effective but expensive too
      ctx.shadowBlur = '4';
      ctx.shadowOffsetX = this.radius;
      ctx.shadowOffsetY = this.radius;
      ctx.fill();
    }

    this.restore = (x, y) => {
      // reset all moves
      this.moves.toText = false;
      this.vel = 2;
      this.radius = getRnd(1, -1);
      this.f = this.f_default;
      this.aStep = 2 * Math.PI / getRnd(860, 40);
    }

    this.sendTo = (x, y) => {
			//Again this is something that I should review and find a better way.
      this.targetX = x;
      this.targetY = y;
      this.moves.toText = true;
    }
    
    this.follow = (mx, my, r) => {
      // Write a new function, return new_x new_y;
      let { dx, dy, dist } = getDist(mx, this.x, my, this.y);
      let ratio;
      // To get nice accelaration depending on the distance so 100% - 0 vel | 0 % 100 vel
      let obj = getDist(this.ax, this.x, this.ay, this.y); 
      //console.log(dist / (obj.dist));
      if((mx <= this.x + r && mx >= this.x - r) || (my <= this.y + r && my >= this.y - r)) { 
        if(dist > this.vel  / 2 && !this.moves.toText) {
          if(this.vel < this.velMax) this.vel *= this.f;
          ratio = (this.vel / 2) / dist;
          let new_x = ratio * dx;
          let new_y = ratio * dy;
          this.x += new_x - this.radius * Math.sin(this.a);
          this.y += new_y - this.radius * Math.cos(this.a);
        }
      }
    }

    this.step = () => {
      if(this.moves.toText){
      // Write a new function, return new_x new_y;
        // Same Here
        let { dx, dy, dist } = getDist(this.targetX, this.x, this.targetY, this.y);
        let ratio;
        if(dist > this.vel){
          if(this.aStep < this.aStepMax) this.aStep *= this.f;
          if(this.vel < this.velMax) { 
            this.vel *= this.f;
            this.f *= 1.0008;
          }
          ratio = this.vel / dist;
          let new_x = ratio * dx;
          let new_y = ratio * dy;
          this.x += new_x - this.radius * Math.sin(this.a);
          this.y += new_y - this.radius * Math.cos(this.a);
        } 
      } else {
        if(this.aStep < this.aStepMax) this.aStep *= this.f;
        if(this.x < 0 || this.y < 0) this.aStep /= this.f;
        if(this.radius > toNeg(this.radiusMax) && this.radius < this.radiusMax) { 
          this.radius *= this.f;
        } else {
          this.radius /= 2;
        }
        
        // Write a new function, return new_x new_y;
        // Same Here Change controls in a new js file Controls.js and add to main?
        this.x -= this.radius * Math.sin(this.a) * 1.4;
        this.y -= this.radius * Math.cos(this.a) * 1.2;
      }
      this.dir ? this.a += this.aStep : this.a -= this.aStep;
    }
  }
}
