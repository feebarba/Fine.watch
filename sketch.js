/* global drawingContext, deltaTime */

let centerX = 0;
let centerY = 0;
let dialRadius = 0;
let numberBodies = [];
let numberSize = 0;
let lastPointerX = 0;
let lastPointerY = 0;
let bigHandPath;
let smallHandPath;

const colors = {
  ink: '#050505',
  hand: '#d8e2e4',
  second: '#ef7058',
};

const bigHandPathData = 'M10.5,0C4.7,0,0,4.7,0,10.5v272.2c0,3.5,1.7,6.5,4.3,8.4,1.1.8,1.7,2.3,1.7,3.7v21.6c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5v-21.6c0-1.4.5-2.8,1.7-3.7,2.6-1.9,4.3-4.9,4.3-8.4V10.5C20.9,4.7,16.3,0,10.5,0Z';
const smallHandPathData = 'M10.5,0C4.7,0,0,4.7,0,10.5v172.2c0,3.5,1.7,6.5,4.3,8.4,1.1.8,1.7,2.3,1.7,3.7v21.6c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5v-21.6c0-1.4.5-2.8,1.7-3.7,2.6-1.9,4.3-4.9,4.3-8.4V10.5C20.9,4.7,16.3,0,10.5,0Z';

const numberVectorDefinitions = {
  1: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 29.8,
    visibleHeight: 120.4,
    pathData: 'M140.2,117.5h-26.3v-3.1c25.3-0.3,26-1.2,26.7-24.4h3.1v120.4h-3.4V117.5z',
  },
  2: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 75.9,
    visibleHeight: 123,
    pathData: 'M121.3,167.5l17.5-13.4c10.5-8.1,21.8-17.5,21.8-33.9c0-14.6-10-28.4-31.6-28.4c-20,0-31.8,13.9-33.2,29.1h-3.6\n\t\tc1.5-17.7,15.8-32.2,37.2-32.2c24.3,0,34.7,15.3,34.7,31.5c0,16.9-10.8,27.2-23,36.5l-17.5,13.4c-15.3,11.7-27.2,24.3-28.7,38.5\n\t\th71.9v3.1H90.9C91.9,194.2,102.7,181.8,121.3,167.5z',
  },
  3: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 78.1,
    visibleHeight: 125.6,
    pathData: 'M89.8,184.6h3.4c2.4,15.3,13.1,25.3,34.7,25.3c21.3,0,36.5-13.1,36.5-31.3c0-17.5-14.1-30.1-34.4-30.1h-8.4v-3.1h8.4\n\t\tc17.7,0,30.1-13.9,30.1-27.3c0-17.5-13.2-27.5-31-27.5c-17.2,0-29.6,8.9-32.5,23.6h-3.4c2.1-15.1,16.2-26.7,36.3-26.7\n\t\tc20.6,0,34.1,12.6,34.1,30.1c0,14.1-10.8,25.6-22.9,28.9v0.3c11.4,1.9,27.2,12.4,27.2,31.8c0,19.8-16.9,34.4-40.1,34.4\n\t\tC104,213,92,201.7,89.8,184.6z',
  },
  4: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 76.2,
    visibleHeight: 120.4,
    pathData: 'M148.1,179.5H90.7v-3.1L148.1,90h3.4v86.3h15.3v3.1h-15.3v31h-3.4V179.5z M148.1,176.4v-54.2c0-6,0.2-16.5,0.5-26.3H148\n\t\tc-4,6.5-7.4,11.7-12.4,19.1l-40.9,61.4H148.1z',
  },
  5: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 77.2,
    visibleHeight: 123,
    pathData: 'M90.2,181.6h3.4c3.1,16.2,12.9,27,33.9,27c20.8,0,36.5-15.7,36.5-40.2c0-24.6-14.8-38.7-35.3-38.7\n\t\tc-15.8,0-27.9,8.9-32,20.6h-3.4l7.6-61.6h60.7v3.1h-57.6l-6.5,50.2l0.2,0.2c6-8.8,16.9-15.7,32-15.7c21.2,0,37.8,15.5,37.8,41.8\n\t\tc0,25.8-16.3,43.3-39.9,43.3C103.8,211.7,93.1,198.8,90.2,181.6z',
  },
  6: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 78.3,
    visibleHeight: 125.6,
    pathData: 'M89.7,156.4c0-45.1,15.8-69,41.3-69c20,0,31.1,8.9,34.2,25.1h-3.6c-3.3-14.1-12.4-22-30.6-22c-23,0-38.7,20.8-37.8,74.1\n\t\th0.5c1.9-19.4,18.2-31.3,36.8-31.3c20.5,0,37.5,13.9,37.5,39.7c0,26.3-17,39.9-37.8,39.9C105,213,89.7,196.8,89.7,156.4z\n\t\t M164.5,173.1c0-23.4-14.6-36.6-34.4-36.6c-19.4,0-34.2,13.2-34.2,36.6c0,23.6,14.4,36.8,34.2,36.8\n\t\tC149.9,209.9,164.5,196.7,164.5,173.1z',
  },
  7: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 77.9,
    visibleHeight: 120.4,
    pathData: 'M164.1,93.1H89.8V90h77.9v3.4c-28.6,31-42.8,69.8-48.5,117h-3.8C121.1,164.3,135.6,124.1,164.1,93.1z',
  },
  8: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 79.5,
    visibleHeight: 125.6,
    pathData: 'M89.1,179.6c0-20.1,12.9-30.4,26.5-32.9c-9.8-2.2-22.2-11-22.2-29.1c0-19.8,16.2-30.3,35.4-30.3\n\t\tc19.4,0,35.4,10.5,35.4,30.3c0,18.1-12.2,26.8-22,29.1c11.9,2.1,26.3,11.4,26.3,32.9c0,20.6-15.1,33.4-39.7,33.4\n\t\tC104.4,213,89.1,200.3,89.1,179.6z M165.1,179.1c0-20.6-15.1-30.6-36.3-30.6c-21,0-36.3,10-36.3,30.6s15.3,30.8,36.3,30.8\n\t\tC150,209.9,165.1,199.8,165.1,179.1z M160.8,118.1c0-18.9-15-27.5-32-27.5c-16.9,0-32,8.6-32,27.5c0,18.9,15.1,27.3,32,27.3\n\t\tC145.8,145.4,160.8,137,160.8,118.1z',
  },
  9: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 78.3,
    visibleHeight: 125.6,
    pathData: 'M167.9,144c0,45.1-15.8,69-41.3,69c-20,0-31.1-8.9-34.2-25.1H96c3.3,14.1,12.4,22,30.6,22c23,0,38.7-20.8,37.8-74.1H164\n\t\tc-1.9,19.4-18.2,31.3-36.8,31.3c-20.5,0-37.5-13.9-37.5-39.7c0-26.3,17-39.9,37.8-39.9C152.6,87.4,167.9,103.6,167.9,144z\n\t\t M93.1,127.4c0,23.4,14.6,36.6,34.4,36.6c19.4,0,34.2-13.2,34.2-36.6c0-23.6-14.4-36.8-34.2-36.8C107.7,90.5,93.1,103.8,93.1,127.4\n\t\tz',
  },
  10: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 135,
    visibleHeight: 125.6,
    pathData: 'M87.6,117.5H61.3v-3.1c25.3-0.3,26-1.2,26.7-24.4H91v120.4h-3.4V117.5z M118,150.2c0-38.7,12.9-62.8,39.2-62.8c26.1,0,39,24.1,39,62.8s-12,62.8-39,62.8C130.1,213,118,188.9,118,150.2z\n\t\t M192.9,150.2c0-36.1-11.2-59.7-35.6-59.7c-24.6,0-35.8,23.6-35.8,59.7s11.2,59.7,35.8,59.7C181.7,209.9,192.9,186.3,192.9,150.2z',
  },
  11: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 80.8,
    visibleHeight: 120.4,
    pathData: 'M114.7,117.5H88.4v-3.1c25.3-0.3,26-1.2,26.7-24.4h3.1v120.4h-3.4V117.5z M165.8,117.5h-26.3v-3.1c25.3-0.3,26-1.2,26.7-24.4h3.1v120.4h-3.4V117.5z',
  },
  12: {
    width: 257.6,
    height: 300.5,
    visibleWidth: 130,
    visibleHeight: 123,
    pathData: 'M90.1,118.8H63.8v-3.1c25.3-0.3,26-1.2,26.7-24.4h3.1v120.4h-3.4V118.8z M148.4,167.5l17.5-13.4c10.5-8.1,21.8-17.5,21.8-33.9c0-14.6-10-28.4-31.6-28.4c-20,0-31.8,13.9-33.2,29.1h-3.6\n\t\tc1.5-17.7,15.8-32.2,37.2-32.2c24.3,0,34.7,15.3,34.7,31.5c0,16.9-10.8,27.2-23,36.5l-17.5,13.4c-15.3,11.7-27.2,24.3-28.7,38.5\n\t\th71.9v3.1H118C119,194.2,129.8,181.8,148.4,167.5z',
  },
};

const lunarPhysics = {
  gravity: 0.1,
  bounce: 0.39,
  airDrift: 0.07,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  bigHandPath = new Path2D(bigHandPathData);
  smallHandPath = new Path2D(smallHandPathData);
  for (const definition of Object.values(numberVectorDefinitions)) {
    definition.path = new Path2D(definition.pathData);
  }

  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  angleMode(RADIANS);
  updateGeometry();
  createNumbers();
  lastPointerX = mouseX;
  lastPointerY = mouseY;
}

function draw() {
  background(255);
  updateGeometry();
  updateNumbers();
  drawNumbers();
  drawHands(getDisplayTime());
}

function updateGeometry() {
  centerX = width / 2;
  centerY = height / 2;
  dialRadius = Math.min(width, height) * 0.43;
  numberSize = Math.max(20, dialRadius * 0.32);
}

function windowResized() {
  const previousCenterX = centerX;
  const previousCenterY = centerY;
  const previousDialRadius = dialRadius;

  resizeCanvas(windowWidth, windowHeight);
  updateGeometry();

  const resizeScale = previousDialRadius > 0 ? dialRadius / previousDialRadius : 1;

  for (const body of numberBodies) {
    body.x = centerX + (body.x - previousCenterX) * resizeScale;
    body.y = centerY + (body.y - previousCenterY) * resizeScale;
    body.homeX = centerX + (body.homeX - previousCenterX) * resizeScale;
    body.homeY = centerY + (body.homeY - previousCenterY) * resizeScale;
    body.collisionRadius = getNumberCollisionRadius(body.vector);
  }

  resolveViewportCollisions();
}

function drawNumbers() {
  noStroke();
  fill(colors.ink);
  textAlign(CENTER, CENTER);
  textFont('Didot');
  textStyle(NORMAL);
  textSize(numberSize);

  for (const body of numberBodies) {
    if (body.vector) {
      drawNumberVector(body.vector, body.x, body.y, body.rotation);
    } else {
      push();
      translate(body.x, body.y);
      rotate(body.rotation);
      text(body.value, 0, 0);
      pop();
    }
  }
}

function drawNumberVector(vector, x, y, rotation) {
  const scale = numberSize / vector.visibleHeight;
  const context = drawingContext;

  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.scale(scale, scale);
  context.translate(-vector.width / 2, -vector.height / 2);
  context.fillStyle = colors.ink;
  context.fill(vector.path);
  context.restore();
}

function createNumbers() {
  numberBodies = [];
  const numberRadius = dialRadius * 0.95;

  textFont('Didot');
  textStyle(NORMAL);
  textSize(numberSize);

  for (let hour = 1; hour <= 12; hour += 1) {
    const angle = (hour / 12) * TWO_PI - HALF_PI;
    const x = centerX + Math.cos(angle) * numberRadius;
    const y = centerY + Math.sin(angle) * numberRadius;
    const vector = numberVectorDefinitions[hour];
    const collisionRadius = getNumberCollisionRadius(vector);

    numberBodies.push({
      value: hour,
      x,
      y,
      homeX: x,
      homeY: y,
      vector,
      collisionRadius,
      velocityX: 0,
      velocityY: 0,
      rotation: 0,
      spin: 0,
      awake: false,
      wasHit: false,
    });
  }
}

function getNumberCollisionRadius(vector) {
  const vectorScale = vector ? numberSize / vector.visibleHeight : 0;
  const visibleWidth = vector ? vector.visibleWidth * vectorScale : textWidth('0');

  return Math.max(numberSize * 0.5, visibleWidth * 0.5) + numberSize * 0.04;
}

function updateNumbers() {
  const step = Math.min(Math.max(deltaTime / 16.67, 0.4), 2.2);
  const point = pointerPosition();
  const pointerIsVisible = point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
  const pointerVelocityX = point.x - lastPointerX;
  const pointerVelocityY = point.y - lastPointerY;
  const clampedPointerVelocityX = constrain(pointerVelocityX, -14, 14);
  const clampedPointerVelocityY = constrain(pointerVelocityY, -14, 14);
  const influenceRadius = Math.max(56, dialRadius * 0.22);

  for (const body of numberBodies) {
    const distanceToPointer = dist(body.x, body.y, point.x, point.y);
    const isHit = pointerIsVisible && distanceToPointer < influenceRadius;

    if (isHit && !body.wasHit) {
      const falloff = 1 - distanceToPointer / influenceRadius;
      const safeDistance = Math.max(distanceToPointer, 0.001);
      const directionX = (body.x - point.x) / safeDistance;
      const directionY = (body.y - point.y) / safeDistance;
      const impact = (2.8 + falloff * 4.8) * step;

      body.awake = true;
      body.velocityX += directionX * impact + clampedPointerVelocityX * (0.1 + falloff * 0.16);
      body.velocityY += directionY * impact + clampedPointerVelocityY * (0.1 + falloff * 0.16);
      body.velocityY += falloff * 0.1 * step;
      body.spin += (clampedPointerVelocityX * 0.002 + directionX * 0.025) * falloff;
    }

    body.wasHit = isHit;

    if (!body.awake) continue;

    // Depois do impacto, cada número cai como um pequeno corpo independente.
    body.velocityY += lunarPhysics.gravity * step;
    body.velocityY += Math.sin(frameCount * 0.04 + body.value) * lunarPhysics.airDrift * step;
    body.velocityX *= Math.pow(0.992, step);
    body.velocityY *= Math.pow(0.999, step);
    body.spin *= Math.pow(0.985, step);
    body.x += body.velocityX * step;
    body.y += body.velocityY * step;
    body.rotation += body.spin * step;

    const floor = height - body.collisionRadius;

    if (body.y > floor) {
      body.y = floor;
      body.velocityY *= -lunarPhysics.bounce;
      body.velocityX *= 0.96;
      body.spin *= 0.78;
      if (Math.abs(body.velocityY) < 0.3) body.velocityY = 0;
    }
  }

  resolveNumberCollisions();
  resolveViewportCollisions();

  lastPointerX = point.x;
  lastPointerY = point.y;
}

function resolveViewportCollisions() {
  for (const body of numberBodies) {
    const radius = body.collisionRadius;
    const leftWall = radius;
    const rightWall = width - radius;
    const topWall = radius;
    const bottomWall = height - radius;

    if (body.x < leftWall) {
      body.x = leftWall;
      if (body.velocityX < 0) body.velocityX *= -lunarPhysics.bounce;
    } else if (body.x > rightWall) {
      body.x = rightWall;
      if (body.velocityX > 0) body.velocityX *= -lunarPhysics.bounce;
    }

    if (body.y < topWall) {
      body.y = topWall;
      if (body.velocityY < 0) body.velocityY *= -lunarPhysics.bounce;
    } else if (body.y > bottomWall) {
      body.y = bottomWall;
      if (body.velocityY > 0) body.velocityY *= -lunarPhysics.bounce;
    }
  }
}

function resolveNumberCollisions() {
  const iterations = 3;
  const restitution = 0.24;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    for (let firstIndex = 0; firstIndex < numberBodies.length; firstIndex += 1) {
      const firstBody = numberBodies[firstIndex];

      for (let secondIndex = firstIndex + 1; secondIndex < numberBodies.length; secondIndex += 1) {
        const secondBody = numberBodies[secondIndex];

        if (!firstBody.awake && !secondBody.awake) continue;

        const offsetX = secondBody.x - firstBody.x;
        const offsetY = secondBody.y - firstBody.y;
        const distance = Math.hypot(offsetX, offsetY);
        const minimumDistance = firstBody.collisionRadius + secondBody.collisionRadius;

        if (distance >= minimumDistance) continue;

        const safeDistance = Math.max(distance, 0.001);
        const normalX = offsetX / safeDistance;
        const normalY = offsetY / safeDistance;
        const overlap = minimumDistance - distance;
        const firstIsDynamic = firstBody.awake;
        const secondIsDynamic = secondBody.awake;

        if (firstIsDynamic && secondIsDynamic) {
          firstBody.x -= normalX * overlap * 0.5;
          firstBody.y -= normalY * overlap * 0.5;
          secondBody.x += normalX * overlap * 0.5;
          secondBody.y += normalY * overlap * 0.5;
        } else if (firstIsDynamic) {
          firstBody.x -= normalX * overlap;
          firstBody.y -= normalY * overlap;
        } else {
          secondBody.x += normalX * overlap;
          secondBody.y += normalY * overlap;
        }

        const relativeVelocityX = secondBody.velocityX - firstBody.velocityX;
        const relativeVelocityY = secondBody.velocityY - firstBody.velocityY;
        const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

        if (velocityAlongNormal < 0) {
          const impulse = -(1 + restitution) * velocityAlongNormal;

          if (firstIsDynamic && secondIsDynamic) {
            firstBody.velocityX -= normalX * impulse * 0.5;
            firstBody.velocityY -= normalY * impulse * 0.5;
            secondBody.velocityX += normalX * impulse * 0.5;
            secondBody.velocityY += normalY * impulse * 0.5;
          } else if (firstIsDynamic) {
            firstBody.velocityX -= normalX * impulse;
            firstBody.velocityY -= normalY * impulse;
          } else {
            secondBody.velocityX += normalX * impulse;
            secondBody.velocityY += normalY * impulse;
          }
        }

        if (firstIsDynamic !== secondIsDynamic) {
          firstBody.awake = true;
          secondBody.awake = true;
        }
      }
    }
  }
}

function drawHands(time) {
  const secondValue = time.seconds + time.milliseconds / 1000;
  const minuteValue = time.minutes + secondValue / 60;
  const hourValue = (time.hours % 12) + minuteValue / 60;

  drawVectorHand(bigHandPath, 20.9, 320.9, minuteValue / 60, dialRadius * 0.93);
  drawVectorHand(smallHandPath, 20.9, 220.9, hourValue / 12, dialRadius * 0.62);
  drawHand(secondValue / 60, dialRadius * 0.99, colors.second, dialRadius * 0.012, 0);

  noStroke();
  fill(colors.ink);
  ellipse(centerX, centerY, dialRadius * 0.08925, dialRadius * 0.08925);
}

function drawVectorHand(path, viewBoxWidth, viewBoxHeight, progress, length) {
  if (!path) return;

  const angle = progress * TWO_PI - HALF_PI;
  const scale = length / viewBoxHeight;
  const context = drawingContext;

  context.save();
  context.translate(centerX, centerY);
  context.rotate(angle + HALF_PI);
  context.scale(scale, scale);
  context.translate(-viewBoxWidth / 2, -viewBoxHeight);
  context.fillStyle = colors.hand;
  context.fill(path);
  context.restore();
}

function drawHand(progress, length, colorValue, thickness, tailLength) {
  const angle = progress * TWO_PI - HALF_PI;
  const start = length * tailLength;
  const x1 = centerX - Math.cos(angle) * start;
  const y1 = centerY - Math.sin(angle) * start;
  const x2 = centerX + Math.cos(angle) * length;
  const y2 = centerY + Math.sin(angle) * length;

  stroke(colorValue);
  strokeWeight(thickness);
  strokeCap(ROUND);
  line(x1, y1, x2, y2);
}

function getDisplayTime() {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    milliseconds: now.getMilliseconds(),
  };
}

function pointerPosition() {
  return { x: mouseX, y: mouseY };
}

function doubleClicked() {
  createNumbers();
  return false;
}
