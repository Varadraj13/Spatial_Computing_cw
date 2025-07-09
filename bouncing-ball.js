// Animated Mondrian/Le Corbusier-style Grid - Windows Slide Out (with pause, slower speed, and looping)
var sketch2 = function(p) {
  var canvasWidth = 800;
  var canvasHeight = 400;
  var palette = ['#1A53C0', '#d63230', '#f5d547', '#0D274B', '#ffffff'];
  var rects = [];
  var minW = 40, minH = 40;
  var maxDepth = 4;
  var baseSpeed = 4;
  var slideSpeed = baseSpeed / 5; // 5 times slower
  var startTime = null;
  var sliding = false;

  function resetGrid() {
    rects = [];
    // Divide the grid vertically in half
    let gridW = canvasWidth * 0.9;
    let gridH = canvasHeight * 0.9;
    let gridX = canvasWidth / 2;
    let gridY = canvasHeight / 2;
    // Left half (favor squares)
    subdivideSquarish(gridX - gridW/4, gridY, gridW/2, gridH, 0);
    // Right half (favor rectangles)
    subdivideRectangular(gridX + gridW/4, gridY, gridW/2, gridH, 0);
    // For each rect, determine slide direction and set velocity
    for (let r of rects) {
      let leftDist = r.x - r.w/2;
      let rightDist = canvasWidth - (r.x + r.w/2);
      let topDist = r.y - r.h/2;
      let bottomDist = canvasHeight - (r.y + r.h/2);
      let minDist = Math.min(leftDist, rightDist, topDist, bottomDist);
      if (minDist === leftDist) {
        r.vx = -slideSpeed; r.vy = 0;
      } else if (minDist === rightDist) {
        r.vx = slideSpeed; r.vy = 0;
      } else if (minDist === topDist) {
        r.vx = 0; r.vy = -slideSpeed;
      } else {
        r.vx = 0; r.vy = slideSpeed;
      }
      r.active = true;
    }
    startTime = p.millis();
    sliding = false;
  }

  p.setup = function() {
    var canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container-2');
    resetGrid();
  };

  p.draw = function() {
    if (startTime === null) {
      startTime = p.millis();
    }
    var elapsed = p.millis() - startTime;
    p.background(0);
    p.stroke(0);
    p.strokeWeight(3);
    p.rectMode(p.CENTER);
    let anyActive = false;
    if (elapsed < 3000) {
      // Draw all rects static for 3 seconds
      for (let r of rects) {
        p.fill(r.color);
        p.rect(r.x, r.y, r.w, r.h);
      }
    } else {
      // Start sliding after 3 seconds
      sliding = true;
      for (let r of rects) {
        if (r.active) {
          r.x += r.vx;
          r.y += r.vy;
          // Check if rect is completely outside canvas
          if (
            r.x + r.w/2 < 0 ||
            r.x - r.w/2 > canvasWidth ||
            r.y + r.h/2 < 0 ||
            r.y - r.h/2 > canvasHeight
          ) {
            r.active = false;
          } else {
            anyActive = true;
          }
        }
        if (r.active) {
          p.fill(r.color);
          p.rect(r.x, r.y, r.w, r.h);
        }
      }
      // If all are gone, reset for looping
      if (!anyActive) {
        resetGrid();
      }
    }
  };

  // Subdivide to favor squares (width ≈ height)
  function subdivideSquarish(x, y, w, h, depth) {
    if (w < minW || h < minH || depth >= maxDepth) {
      rects.push({ x, y, w, h, color: p.random(palette) });
      return;
    }
    if (p.random() < 0.5) {
      let split = p.random(0.4, 0.6) * w;
      let w1 = split;
      let w2 = w - split;
      subdivideSquarish(x - (w/2) + (w1/2), y, w1, h, depth + 1);
      subdivideSquarish(x + (w/2) - (w2/2), y, w2, h, depth + 1);
    } else {
      let split = p.random(0.4, 0.6) * h;
      let h1 = split;
      let h2 = h - split;
      subdivideSquarish(x, y - (h/2) + (h1/2), w, h1, depth + 1);
      subdivideSquarish(x, y + (h/2) - (h2/2), w, h2, depth + 1);
    }
  }

  // Subdivide to favor rectangles (width ≠ height)
  function subdivideRectangular(x, y, w, h, depth) {
    if (w < minW || h < minH || depth >= maxDepth) {
      rects.push({ x, y, w, h, color: p.random(palette) });
      return;
    }
    if (p.random() < 0.5) {
      let split = p.random(0.2, 0.35) * w;
      if (p.random() < 0.5) split = w - split;
      let w1 = split;
      let w2 = w - split;
      subdivideRectangular(x - (w/2) + (w1/2), y, w1, h, depth + 1);
      subdivideRectangular(x + (w/2) - (w2/2), y, w2, h, depth + 1);
    } else {
      let split = p.random(0.2, 0.35) * h;
      if (p.random() < 0.5) split = h - split;
      let h1 = split;
      let h2 = h - split;
      subdivideRectangular(x, y - (h/2) + (h1/2), w, h1, depth + 1);
      subdivideRectangular(x, y + (h/2) - (h2/2), w, h2, depth + 1);
    }
  }
};

var myp5_2 = new p5(sketch2, 'canvas-container-2'); 