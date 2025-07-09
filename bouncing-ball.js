// Multiple Bouncing Balls Sketch - using p5.js instance mode
var sketch2 = function(p) {
  // Ball class to manage multiple balls
  class Ball {
    constructor(x, y, radius, color, speedX, speedY) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.dx = speedX;
      this.dy = speedY;
    }

    update() {
      // Update ball position
      this.x += this.dx;
      this.y += this.dy;

      // Bounce off the edges
      if (this.x - this.radius < 0 || this.x + this.radius > p.width) {
        this.dx *= -1;
        // Keep ball within bounds
        this.x = p.constrain(this.x, this.radius, p.width - this.radius);
      }
      if (this.y - this.radius < 0 || this.y + this.radius > p.height) {
        this.dy *= -1;
        // Keep ball within bounds
        this.y = p.constrain(this.y, this.radius, p.height - this.radius);
      }
    }

    draw() {
      p.fill(this.color);
      p.noStroke();
      p.ellipse(this.x, this.y, this.radius * 2);
    }
  }

  // Array to store all balls
  var balls = [];

  p.setup = function() {
    // Create the canvas and attach it to the container
    var canvas = p.createCanvas(800, 400);
    canvas.parent('canvas-container-2');

    // Create 4 balls with different properties
    balls.push(new Ball(100, 100, 25, p.color(255, 100, 100), 3, 2));    // Red ball - small
    balls.push(new Ball(200, 200, 40, p.color(100, 180, 255), 4, 3));    // Blue ball - medium
    balls.push(new Ball(300, 150, 15, p.color(255, 220, 80), 5, 4));     // Yellow ball - tiny
    balls.push(new Ball(400, 300, 50, p.color(180, 100, 255), 2, 5));    // Purple ball - large
  };

  p.draw = function() {
    // Clear the background
    p.background(240);

    // Update and draw all balls
    for (var i = 0; i < balls.length; i++) {
      balls[i].update();
      balls[i].draw();
    }
  };
};

// Create the instance
var myp5_2 = new p5(sketch2, 'canvas-container-2'); 