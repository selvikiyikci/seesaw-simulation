 ⚖️ Seesaw Simulation (HTML + CSS + JS)

Interactive seesaw built with pure HTML, CSS, and Canvas 2D API.
Move the mouse to see the projection, click to drop a weight, and watch the board tilt based on torque.

Visit https://selvikiyikci.github.io/seesaw-simulation/

## 1) Design Process 

# Step 1 — HTML & base CSS
* Wrote a minimal layout: value cards (LEFT/NEXT/RIGHT/ANGLE), a canvas, a reset button, and a log.
* Kept CSS simple first (colors, spacing). Focus was “get the skeleton up”.

  <img width="2269" height="1153" alt="image" src="https://github.com/user-attachments/assets/481691f9-4da7-4054-af51-16b9b334556a" />


# Step 2 — JavaScript core (Canvas, drawing, loop)

* Set up the canvas context with devicePixelRatio.
* Drew the pivot and plank and started the animation loop (requestAnimationFrame).
* Added mouse events for **projection** and **click to drop.

# Step 3 — Physics (torque → target angle → easing)

* Implemented a simple, readable torque model (see below).
* Mapped net torque to a clamped target angle and eased toward it each frame.

 <img width="2186" height="1252" alt="image" src="https://github.com/user-attachments/assets/723b04a9-8e18-483d-b732-ea6ffe4a00fa" />


# Step 4 — UX polish (go back to CSS)

* After JS worked smoothly, I returned to CSS: gradient cards, darker hover, compact log, bigger seesaw area.

 <img width="2549" height="1317" alt="image" src="https://github.com/user-attachments/assets/7cc5f2d6-f550-458e-83cc-e4cc6d3f2035" />



## 2) Torque & Projection — What the Code Does 

 # 2.1 Projection (cursor → plank axis)

canvas.addEventListener("mousemove", (e) => {
  const r = canvas.getBoundingClientRect();
  const mouse = {
    x: (e.clientX - r.left) * (CANVAS_WIDTH / r.width),
    y: (e.clientY - r.top) * (CANVAS_HEIGHT / r.height),
  };

  const rad = (angle * Math.PI) / 180;
  const ux = Math.cos(rad), uy = Math.sin(rad);   // unit along plank
  const dx = mouse.x - center.x, dy = mouse.y - center.y;

  const s = dx * ux + dy * uy;                    // signed projection
  const sClamped = Math.max(-plankLength/2, Math.min(plankLength/2, s));

  hover = {
    mouse,
    proj: { x: center.x + sClamped * ux, y: center.y + sClamped * uy },
    s: sClamped
  };
});


# Meaning: project mouse onto the rotated plank, bounded to plank ends and draw a ghost weight there.

# 2.2 Placing a weight & logging


canvas.addEventListener("click", () => {
  if (!hover) return;
  weights.push({ w: nextW, x: hover.s, animating: true, animOpacity: 0 });
  log(⚖️ <b>${nextW}kg</b> ${hover.s < 0 ? "left" : "right"} ${Math.abs(Math.round(hover.s))}px);
  nextW = rndW(); updateNextUI(); saveState();
});

# 2.3 Torque → target angle and easing)


function updateBalance() {
  let leftTorque = 0, rightTorque = 0;
  leftSum = 0; rightSum = 0;

  for (const it of weights) {
    const t = it.w * Math.abs(it.x);     // torque = w × d
    if (it.x < 0) { leftSum += it.w; leftTorque += t; }
    else          { rightSum += it.w; rightTorque += t; }
  }

  const diff = rightTorque - leftTorque;
  const TORQUE_SCALE = 10;
  targetA = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, diff / TORQUE_SCALE));

  leftVal.textContent  = leftSum.toFixed(1)  + " kg";
  rightVal.textContent = rightSum.toFixed(1) + " kg";
  angleVal.textContent = targetA.toFixed(1)  + "°";
}


angle += (targetA - angle) * 0.06;  // smooth, damped transition


Meaning: heavier/farther weights dominate; we map net torque to a target tilt and ease toward it.

## 3) Trade-offs / Limitations 

Simple physics: linear torque→angle mapping (no angular momentum, no friction/bounce).
Pixels as distance: not scaled to real units; chosen for clarity and interview scope.
Interactions: drop/remove only; no drag-to-reposition (kept scope tight).
Mobile: tap works; advanced touch gestures not implemented.



## 4) What AI Helped With (Honest & Minimal)
Helped with wording/README clarity and a few CSS polish ideas (gradient hover, spacing).
Did NOT write the core logic: physics, projection math, canvas drawing, state management are hand written.

