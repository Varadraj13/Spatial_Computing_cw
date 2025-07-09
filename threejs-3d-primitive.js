// 3D Mondrian/Le Corbusier-style Grid: Each window is a rotating 3D face (with 3s pause and hover to pause)
(function() {
  // --- Grid logic (copied from 2d-drawing.js) ---
  const canvasWidth = 800;
  const canvasHeight = 400;
  const palette = ['#1A53C0', '#d63230', '#f5d547', '#0D274B', '#ffffff'];
  const minW = 40, minH = 40;
  const maxDepth = 4;
  let rects = [];

  function subdivideSquarish(x, y, w, h, depth) {
    if (w < minW || h < minH || depth >= maxDepth) {
      rects.push({ x, y, w, h, color: palette[Math.floor(Math.random()*palette.length)] });
      return;
    }
    if (Math.random() < 0.5) {
      let split = Math.random() * 0.2 + 0.4; // 0.4-0.6
      let w1 = split * w;
      let w2 = w - w1;
      subdivideSquarish(x - (w/2) + (w1/2), y, w1, h, depth + 1);
      subdivideSquarish(x + (w/2) - (w2/2), y, w2, h, depth + 1);
    } else {
      let split = Math.random() * 0.2 + 0.4;
      let h1 = split * h;
      let h2 = h - h1;
      subdivideSquarish(x, y - (h/2) + (h1/2), w, h1, depth + 1);
      subdivideSquarish(x, y + (h/2) - (h2/2), w, h2, depth + 1);
    }
  }
  function subdivideRectangular(x, y, w, h, depth) {
    if (w < minW || h < minH || depth >= maxDepth) {
      rects.push({ x, y, w, h, color: palette[Math.floor(Math.random()*palette.length)] });
      return;
    }
    if (Math.random() < 0.5) {
      let split = Math.random() * 0.15 + 0.2; // 0.2-0.35
      if (Math.random() < 0.5) split = 1 - split;
      let w1 = split * w;
      let w2 = w - w1;
      subdivideRectangular(x - (w/2) + (w1/2), y, w1, h, depth + 1);
      subdivideRectangular(x + (w/2) - (w2/2), y, w2, h, depth + 1);
    } else {
      let split = Math.random() * 0.15 + 0.2;
      if (Math.random() < 0.5) split = 1 - split;
      let h1 = split * h;
      let h2 = h - h1;
      subdivideRectangular(x, y - (h/2) + (h1/2), w, h1, depth + 1);
      subdivideRectangular(x, y + (h/2) - (h2/2), w, h2, depth + 1);
    }
  }
  // Generate grid
  rects = [];
  let gridW = canvasWidth * 0.9;
  let gridH = canvasHeight * 0.9;
  let gridX = canvasWidth / 2;
  let gridY = canvasHeight / 2;
  subdivideSquarish(gridX - gridW/4, gridY, gridW/2, gridH, 0);
  subdivideRectangular(gridX + gridW/4, gridY, gridW/2, gridH, 0);

  // --- Three.js scene setup ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 800/400, 0.1, 2000);
  camera.position.set(0, 0, 700);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(800, 400);
  renderer.setClearColor(0x000000);
  const container = document.getElementById('threejs-canvas-main');
  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(0, 0, 1);
  scene.add(dirLight);

  // --- Create a 3D face for each window ---
  const faces = [];
  rects.forEach((r, i) => {
    // PlaneGeometry: width, height
    const geometry = new THREE.PlaneGeometry(r.w, r.h);
    const color = new THREE.Color(r.color);
    const material = new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    // Center the grid at (0,0)
    mesh.position.x = r.x - canvasWidth/2;
    mesh.position.y = -(r.y - canvasHeight/2); // Invert y for Three.js
    mesh.position.z = 0;
    // Store a random rotation axis and speed for each face
    mesh.userData = {
      rotAxis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
      rotSpeed: 0.01 + Math.random()*0.015
    };
    scene.add(mesh);
    faces.push(mesh);
  });

  // --- Mouse hover pause logic ---
  let paused = false;
  container.addEventListener('mouseenter', () => { paused = true; });
  container.addEventListener('mouseleave', () => { paused = false; });

  // --- Animation loop ---
  const startTime = Date.now();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = Date.now() - startTime;
    faces.forEach(mesh => {
      if (elapsed > 3000 && !paused) {
        mesh.rotateOnAxis(mesh.userData.rotAxis, mesh.userData.rotSpeed);
      }
    });
    renderer.render(scene, camera);
  }
  animate();
})(); 