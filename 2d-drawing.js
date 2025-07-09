// Mondrian/Le Corbusier-style Collage - Split Squares and Rectangles
var sketch1 = function(p) {
  var canvasWidth = 800;
  var canvasHeight = 400;
  var canvas;
  var palette = ['#1A53C0', '#d63230', '#f5d547', '#0D274B', '#ffffff'];
  var rects = [];
  var minW = 40, minH = 40; // Minimum size for subdivision
  var maxDepth = 4; // Controls how many times to subdivide

  p.setup = function() {
    canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container-1');
    p.noLoop();
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
  };

  p.draw = function() {
    p.background(0); // Black background
    p.stroke(0);
    p.strokeWeight(3);
    p.rectMode(p.CENTER);
    for (let r of rects) {
      p.fill(r.color);
      p.rect(r.x, r.y, r.w, r.h);
    }
  };

  // Subdivide to favor squares (width ≈ height)
  function subdivideSquarish(x, y, w, h, depth) {
    if (w < minW || h < minH || depth >= maxDepth) {
      rects.push({ x, y, w, h, color: p.random(palette) });
      return;
    }
    // Try to keep splits close to square
    if (p.random() < 0.5) {
      // Vertical split
      let split = p.random(0.4, 0.6) * w;
      let w1 = split;
      let w2 = w - split;
      subdivideSquarish(x - (w/2) + (w1/2), y, w1, h, depth + 1);
      subdivideSquarish(x + (w/2) - (w2/2), y, w2, h, depth + 1);
    } else {
      // Horizontal split
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
    // Favor splits that create rectangles (one side much longer)
    if (p.random() < 0.5) {
      // Vertical split, but not near the middle
      let split = p.random(0.2, 0.35) * w;
      if (p.random() < 0.5) split = w - split;
      let w1 = split;
      let w2 = w - split;
      subdivideRectangular(x - (w/2) + (w1/2), y, w1, h, depth + 1);
      subdivideRectangular(x + (w/2) - (w2/2), y, w2, h, depth + 1);
    } else {
      // Horizontal split, but not near the middle
      let split = p.random(0.2, 0.35) * h;
      if (p.random() < 0.5) split = h - split;
      let h1 = split;
      let h2 = h - split;
      subdivideRectangular(x, y - (h/2) + (h1/2), w, h1, depth + 1);
      subdivideRectangular(x, y + (h/2) - (h2/2), w, h2, depth + 1);
    }
  }
};

var myp5_1 = new p5(sketch1, 'canvas-container-1'); 