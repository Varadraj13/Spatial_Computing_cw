// Zoomable/Pannable Mondrian/Le Corbusier-style Grid (10x size, improved zoom, with buttons)
var sketch3 = function(p) {
  var canvasWidth = 800;
  var canvasHeight = 400;
  var gridWidth = 8000;
  var gridHeight = 4000;
  var palette = ['#1A53C0', '#d63230', '#f5d547', '#0D274B', '#ffffff'];
  var rects = [];
  var minW = 40, minH = 40;
  var maxDepth = 4;
  var zoom = 1;
  var targetZoom = 1;
  var offsetX = 0;
  var offsetY = 0;
  var targetOffsetX = 0;
  var targetOffsetY = 0;
  var isDragging = false;
  var lastMouseX, lastMouseY;
  var canvas;
  var minZoom, maxZoom;
  var zoomAnimSpeed = 0.15; // Animation speed for smooth zoom

  p.setup = function() {
    canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container-3');
    rects = [];
    // Divide the grid vertically in half
    let gridX = gridWidth / 2;
    let gridY = gridHeight / 2;
    // Left half (favor squares)
    subdivideSquarish(gridX - gridWidth/4, gridY, gridWidth/2, gridHeight, 0);
    // Right half (favor rectangles)
    subdivideRectangular(gridX + gridWidth/4, gridY, gridWidth/2, gridHeight, 0);
    // Zoom limits: fit whole grid in view, or zoom in to 2x
    minZoom = Math.min(canvasWidth / gridWidth, canvasHeight / gridHeight);
    maxZoom = 2; // Allow zooming in up to 2x
    zoom = 1; // Start at 1:1 so you can zoom out
    targetZoom = zoom;
    offsetX = 0;
    offsetY = 0;
    targetOffsetX = 0;
    targetOffsetY = 0;
    // Add button listeners
    setTimeout(setupZoomButtons, 100);
  };

  function setupZoomButtons() {
    var zoomInBtn = document.getElementById('zoom-in-btn');
    var zoomOutBtn = document.getElementById('zoom-out-btn');
    if (zoomInBtn && zoomOutBtn) {
      zoomInBtn.onclick = function() {
        var newZoom = p.constrain(targetZoom * 1.15, minZoom, maxZoom);
        // Centered on canvas center
        var wx = (canvasWidth/2 - canvasWidth/2 - offsetX) / zoom + gridWidth/2;
        var wy = (canvasHeight/2 - canvasHeight/2 - offsetY) / zoom + gridHeight/2;
        var newOffsetX = (wx - gridWidth/2) * newZoom - (canvasWidth/2 - canvasWidth/2);
        var newOffsetY = (wy - gridHeight/2) * newZoom - (canvasHeight/2 - canvasHeight/2);
        targetZoom = newZoom;
        targetOffsetX = newOffsetX;
        targetOffsetY = newOffsetY;
      };
      zoomOutBtn.onclick = function() {
        var newZoom = p.constrain(targetZoom / 1.15, minZoom, maxZoom);
        var wx = (canvasWidth/2 - canvasWidth/2 - offsetX) / zoom + gridWidth/2;
        var wy = (canvasHeight/2 - canvasHeight/2 - offsetY) / zoom + gridHeight/2;
        var newOffsetX = (wx - gridWidth/2) * newZoom - (canvasWidth/2 - canvasWidth/2);
        var newOffsetY = (wy - gridHeight/2) * newZoom - (canvasHeight/2 - canvasHeight/2);
        targetZoom = newZoom;
        targetOffsetX = newOffsetX;
        targetOffsetY = newOffsetY;
      };
    }
  }

  p.draw = function() {
    // Smoothly animate zoom and pan
    zoom += (targetZoom - zoom) * zoomAnimSpeed;
    offsetX += (targetOffsetX - offsetX) * zoomAnimSpeed;
    offsetY += (targetOffsetY - offsetY) * zoomAnimSpeed;
    p.background(0);
    p.push();
    // Center canvas, apply pan and zoom
    p.translate(canvasWidth/2 + offsetX, canvasHeight/2 + offsetY);
    p.scale(zoom);
    p.translate(-gridWidth/2, -gridHeight/2);
    p.stroke(0);
    p.strokeWeight(3/zoom); // Keep border thickness consistent
    p.rectMode(p.CENTER);
    // Only draw rects that are visible in the current view for performance
    let viewX = -offsetX/zoom + gridWidth/2 - (canvasWidth/2)/zoom;
    let viewY = -offsetY/zoom + gridHeight/2 - (canvasHeight/2)/zoom;
    let viewW = canvasWidth/zoom;
    let viewH = canvasHeight/zoom;
    for (let r of rects) {
      if (
        r.x + r.w/2 < viewX ||
        r.x - r.w/2 > viewX + viewW ||
        r.y + r.h/2 < viewY ||
        r.y - r.h/2 > viewY + viewH
      ) continue;
      p.fill(r.color);
      p.rect(r.x, r.y, r.w, r.h);
    }
    p.pop();
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

  // Mouse wheel zoom (reduced sensitivity)
  p.mouseWheel = function(event) {
    if (canvas && canvas.elt.matches(':hover')) {
      var zoomFactor = 1.05; // Half the previous sensitivity
      var newZoom = targetZoom;
      if (event.delta > 0) {
        newZoom /= zoomFactor;
      } else {
        newZoom *= zoomFactor;
      }
      newZoom = p.constrain(newZoom, minZoom, maxZoom);
      // Mouse position in world coordinates before zoom
      var wx = (p.mouseX - canvasWidth/2 - offsetX) / zoom + gridWidth/2;
      var wy = (p.mouseY - canvasHeight/2 - offsetY) / zoom + gridHeight/2;
      var newOffsetX = (wx - gridWidth/2) * newZoom - (p.mouseX - canvasWidth/2);
      var newOffsetY = (wy - gridHeight/2) * newZoom - (p.mouseY - canvasHeight/2);
      targetZoom = newZoom;
      targetOffsetX = newOffsetX;
      targetOffsetY = newOffsetY;
      return false;
    }
  };

  // Mouse drag pan
  p.mousePressed = function() {
    if (canvas && canvas.elt.matches(':hover') && p.mouseButton === p.LEFT && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      isDragging = true;
      lastMouseX = p.mouseX;
      lastMouseY = p.mouseY;
    }
  };

  p.mouseDragged = function() {
    if (isDragging && canvas && canvas.elt.matches(':hover')) {
      targetOffsetX += p.mouseX - lastMouseX;
      targetOffsetY += p.mouseY - lastMouseY;
      lastMouseX = p.mouseX;
      lastMouseY = p.mouseY;
    }
  };

  p.mouseReleased = function() {
    isDragging = false;
  };
};

var myp5_3 = new p5(sketch3, 'canvas-container-3'); 