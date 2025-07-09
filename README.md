
# Managing Multiple P5.js Canvases in HTML

## Tutorial for how to include mulitple P5.js canvases in HTML
---

## HTML file code snippets for beginners
### 1  HTML Setup for p5.js

In order to add your p5.js sketch to your website, you need to load the p5.js library:

**Essential Lines You Must Add:**

**In the `<head>` section:**
```html
<!-- REQUIRED: Load p5.js library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
```

Add your latest sketch to a new javascript file 'yourSketch.js' (name it appropriately) and link it to you html file. 

**In the `<body>` section (before closing `</body>` tag):**
```html
<!-- REQUIRED: Load your sketch file -->
<script src="yourSketch.js"></script>
```

### 2 Loading Multiple Canvases

To create multiple p5.js canvases on a single webpage, you need to use **Instance Mode** instead of Global Mode. Instance Mode allows each canvas to have its own p5.js instance, preventing conflicts between different sketches.

#### Key Concepts

- **Global Mode**: Default p5.js mode where all functions are global (single canvas only)
- **Instance Mode**: Each canvas has its own p5.js instance with scoped functions
- **Canvas Containers**: HTML div elements that hold each canvas
- **Instance Variables**: Each sketch function receives a parameter (typically `p`) that contains all p5.js functions

#### Step-by-Step Implementation

**1. HTML Structure**
Create a container div for each canvas in your HTML:

```html
<!-- Canvas container for first sketch -->
<div id="canvas-container-1"></div>

<!-- Canvas container for second sketch -->
<div id="canvas-container-2"></div>

<!-- Canvas container for third sketch -->
<div id="canvas-container-3"></div>
```

**2. JavaScript Sketch Structure**
Each sketch file should follow this pattern:

```javascript
// Sketch using p5.js instance mode
var sketch1 = function(p) {
  // All variables are scoped to this instance
  var canvasWidth = 800;
  var canvasHeight = 400;
  
  p.setup = function() {
    var canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container-1'); // Attach to specific container
  };
  
  p.draw = function() {
    p.background(250);
    // Your drawing code here
  };
};

// Create the instance
var myp5_1 = new p5(sketch1, 'canvas-container-1');
```

**3. Loading Scripts**
Load each sketch file in your HTML (before closing `</body>` tag):

```html
<script src="sketch1.js"></script>
<script src="sketch2.js"></script>
<script src="sketch3.js"></script>
```

#### Important Notes

- **Function Prefix**: All p5.js functions must be prefixed with the instance parameter (e.g., `p.background()`, `p.rect()`, `p.mouseX`)
- **Variable Scope**: Variables declared inside the sketch function are scoped to that instance
- **Canvas Attachment**: Use `canvas.parent('container-id')` to attach each canvas to its specific container
- **Event Handling**: Mouse and keyboard events are also scoped to each instance

#### Example Implementation

This folder contains three different canvas examples:
1. **2D Drawing** (`2d-drawing.js`): Static geometric shapes with grid
2. **Bouncing Ball** (`bouncing-ball.js`): Animated physics simulation  
3. **Interactive Grid** (`zoom-pan.js`): Zoom and pan functionality

You can see these examples in action by opening `index.html` in your browser.

#### Additional Resources

For more information on multiple canvases in p5.js, see the official documentation:
- [p5.js Multiple Canvases Example](https://p5js.org/examples/advanced-canvas-rendering-multiple-canvases/)

This approach allows you to create complex interactive web pages with multiple independent p5.js sketches, each with their own functionality and interaction patterns.