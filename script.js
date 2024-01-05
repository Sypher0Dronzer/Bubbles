/**@type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(screen.width/7);
//ctx.createLinearGradient(startX, StartY, EndX, EndY)
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

// Add three color stops
gradient.addColorStop(0, "white");
gradient.addColorStop(0.2, "gold");
gradient.addColorStop(1, "orangered");

const particleCount=700

class Particle {
  constructor(effect) {
    this.effect = effect;
    // this.radius = Math.random() * 4 +2;
    this.radius=0.3
    this.minradius = this.radius;
    this.maxradius=this.radius*60
    this.x =
      this.radius +
      Math.floor(Math.random() * (this.effect.width - this.radius * 2));
    this.y =
      this.radius +
      Math.floor(Math.random() * (this.effect.height - this.radius * 2));
    this.velX = Math.random() * 0.1 - 0.05;
    this.velY = Math.random() * 0.1 - 0.05;
    
  }
  reset() {
    // this portion ensures that no partcle is stuck outside the canvas on resizing
    this.x =
      this.radius +
      Math.floor(Math.random() * (this.effect.width - this.radius * 2));
    this.y =
      this.radius +
      Math.floor(Math.random() * (this.effect.height - this.radius * 2));
  }
  draw(context) {
    context.save();
    context.globalAlpha=0.8
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
    context.restore();

    
    context.globalAlpha=0.7
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(this.x-this.radius*0.15, this.y-this.radius*0.26, this.radius*0.6, 0, 2 * Math.PI);
    context.fill();
  }
  // for bouncing
  update() {

    //mouse click effect
    if (this.effect.mouse.pressed) {
      let dy = this.y - this.effect.mouse.y;
      let dx = this.x - this.effect.mouse.x;
      let distance = Math.hypot(dx, dy);
      if (distance < this.effect.mouse.radius && this.radius<this.maxradius) {
        this.radius+=1.5
      }      
    }
    if(this.radius>this.minradius){
      this.radius-=0.01
    }

    
    this.x +=this.velX;
    this.y += this.velY;
   

    if(this.x <this.radius){
      this.x=this.radius;
      this.velX *= -1;
    }
    else if(this.x > this.effect.width-this.radius){
      this.x=this.effect.width-this.radius
      this.velX *= -1;

    }
    if(this.y <this.radius){
      this.y=this.radius;
      this.velY *= -1;
    }
     else if(this.y > this.effect.height-this.radius || this.y == this.effect.height-this.radius){
      this.y =this.effect.height-this.radius
      this.velY *= -1;

    }
    
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = particleCount;
    this.createParticles();

    window.addEventListener("resize", (e) => {
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });

    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: 50,
    };
    window.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      }
      
    });
    window.addEventListener("mousedown", (e) => {
      this.mouse.pressed = true;
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
    window.addEventListener("mouseup", () => {
      this.mouse.pressed = false;
    });
    window.addEventListener("touchstart", (e) => {
      [...e.changedTouches].forEach((touch) => {
        this.mouse.pressed = true;
        this.mouse.x = touch.pageX;
        this.mouse.y = touch.pageY;
        this.mouse.pressed = true;
      });
    });
    window.addEventListener("touchmove", (e) => {
      [...e.changedTouches].forEach((touch) => {
        this.mouse.pressed = true;
        this.mouse.x = touch.pageX;
        this.mouse.y = touch.pageY;
        this.mouse.pressed = true;
      });
    });
    
  }
  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }
  handleParticles(context) { 
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
  
  resize(width, height) {
    this.canvas.width = width;
    this.width = width;
    this.height = height;
    this.canvas.height = height;
    this.particles.forEach((particle) => {
      particle.reset();
    });
  }
}
let effect = new Effect(canvas);
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  requestAnimationFrame(animate);
}
animate();
