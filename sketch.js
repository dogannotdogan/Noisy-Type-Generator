let font;
let textPoints = [];

function preload() {
  // font
  font = loadFont(
    "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf"
  );
}

function setup() {
  createCanvas(800, 800);
  pixelDensity(20);
  background(220);

  // background, midground, and foreground cityscapes
  drawCity(12, 180, 250, 0.4, 0.6); // background
  drawCity(10, 220, 300, 0.6, 0.75); // midground
  drawCity(8, 260, 350, 0.8, 1); // foreground

  // noisy typography
  drawNoisyText("WHAT", 50, 500, 192, 1, 0.9);
  drawNoisyText("THE", 40, 650, 130, 2, 0.9);
  drawNoisyText("F$#%", 250, 750, 192, 5, 0.9);

  noLoop();
}

function draw() {}

function drawCity(numBuildings, minHeight, maxHeight, alpha, weightScale) {
  let margin = 20;
  let buildingWidthRange = [40, 80];
  let spacing = (width - margin * 2) / numBuildings;

  for (let i = 0; i < numBuildings; i++) {
    let bWidth = random(buildingWidthRange[0], buildingWidthRange[1]);
    let bHeight = random(minHeight, maxHeight);
    let x = margin + i * spacing + random(-10, 10);
    let y = height - bHeight;

    drawBuilding(x, y, bWidth, bHeight, alpha, weightScale);
  }
}

function drawBuilding(x, y, w, h, alpha, weightScale) {
  let lines = int(w / 4);

  for (let i = 0; i <= lines; i++) {
    let offsetX = map(i, 0, lines, 0, w);
    let p1 = { x: x + offsetX, y: y };
    let p2 = { x: x + offsetX, y: y + h };
    drawNoisyLine(p1, p2, alpha, weightScale);
  }

  // Optional top edge
  drawNoisyLine({ x: x, y: y }, { x: x + w, y: y }, alpha, weightScale);
}

function drawNoisyLine(p1, p2, alpha, weightScale) {
  for (let n = 0; n < 1; n += 0.002) {
    let iP = interp(p1, p2, n);
    let noi = noise(iP.x * 0.02, iP.y * 0.02) * 2 * weightScale;
    strokeWeight(noi);
    stroke(0, 255 * alpha);
    point(iP.x + random(-0.3, 0.3), iP.y + random(-0.3, 0.3));
  }
}

function interp(p1, p2, i) {
  return {
    x: p1.x * (1 - i) + p2.x * i,
    y: p1.y * (1 - i) + p2.y * i,
  };
}

function drawNoisyText(txt, x, y, fontSize, weightScale, alpha) {
  textPoints = font.textToPoints(txt, x, y, fontSize, {
    sampleFactor: 0.25, // point density
    simplifyThreshold: 0,
  });

  for (let i = 0; i < textPoints.length - 1; i++) {
    let p1 = textPoints[i];
    let p2 = textPoints[i + 1];
    drawNoisyLine(p1, p2, alpha, weightScale);
  }
}
