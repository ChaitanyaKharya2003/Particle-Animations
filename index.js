window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const image2 = document.getElementById("img2");
  const image3 = document.getElementById("img3");
  const image4 = document.getElementById("img4");
  const image5 = document.getElementById("img5");

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      // play with x and y to change the effect
      this.x = 0;
      this.y = Math.random() * this.effect.height;
      this.size = this.effect.gap;
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.color = color;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.2;
    }

    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
      this.dx = this.effect.mouse.x - this.x;
      this.dy = this.effect.mouse.y - this.y;
      this.distance = (this.dx * this.dx + this.dy * this.dy);
      this.force = -this.effect.mouse.radius / this.distance;
      this.x += (this.originX - this.x) * this.ease;
      this.y += (this.originY - this.y) * this.ease;
      
    }
    warp() {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.ease = Math.random() * 1;
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particlesArray = [];
      this.image = document.getElementById("img1");
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;
      this.x = this.centerX - this.image.width * 0.5;
      this.y = this.centerY - this.image.height * 0.5;
      this.gap = 1; //change for better resolution
      this.mouse = {
        radius: 3000,
        x: undefined,
        y: undefined,
      }
      window.addEventListener('mousemove', (event) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
      });
    }
    init(context) {
      context.drawImage(this.image, this.x, this.y);
      const pixels = context.getImageData(0, 0, this.width, this.height).data;
      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          const color = "rgb(" + red + "," + green + "," + blue + ")";

          if (alpha > 0) {
            this.particlesArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }

    draw(context) {
      this.particlesArray.forEach((particle) => particle.draw(context));
    }
    update() {
      this.particlesArray.forEach((particle) => particle.update());
    }
    warp() {
      this.particlesArray.forEach((particle) => particle.warp());
    }
  }
  const effect = new Effect(canvas.width, canvas.height);
  effect.init(ctx);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
  }

  animate();

  const warpButton = document.getElementById('warpButton');
  warpButton.addEventListener('click', function () {
    effect.warp();
  });
});
