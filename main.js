(function () {
  const canvas = document.getElementById("cv");
  const context = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  let CANVAS_WIDTH = 800;
  let CANVAS_HEIGHT = 300;

  const leftVal = document.getElementById("leftVal");
  const rightVal = document.getElementById("rightVal");
  const angleVal = document.getElementById("angleVal");
  const nextVal = document.getElementById("nextVal");
  const resetBtn = document.getElementById("resetBtn");
  const logEl = document.getElementById("log");

  const KEY = "seesaw_simulation";

  function fmt(n, u = "") {
    return n.toFixed(1) + u;
  }

  const COLORS = [
    "#2f6fec",
    "#2fc48d",
    "#ffb020",
    "#ef5766",
    "#7b61ff",
    "#34aadc",
    "#8bd26a",
    "#f27f3d",
    "#aa66cc",
    "#5e6ad2",
  ];

  function updateCanvasSize() {
    const container = canvas.parentElement;
    const containerWidth = Math.min(container.clientWidth, 800);
    const aspectRatio = 800 / 300;
    CANVAS_WIDTH = containerWidth;
    CANVAS_HEIGHT = containerWidth / aspectRatio;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);
  }

  updateCanvasSize();
  window.addEventListener("resize", updateCanvasSize);

  const plankLength = 400;
  const plankThickness = 16;
  const TH = plankThickness;
  const plankHalf = plankLength / 2;

  const center = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
  window.addEventListener("resize", () => {
    center.x = CANVAS_WIDTH / 2;
    center.y = CANVAS_HEIGHT / 2;
  });

  const EASE = 0.06;
  const MAX_ANGLE = 30;
  let targetA = 0;
  let angle = 0;

  let leftSum = 0,
    rightSum = 0;
  let weights = [];
  let nextW = rndW();
  let hover = null;

  function rndW() {
    return 1 + Math.floor(Math.random() * 10);
  }

  function colorOf(w) {
    return COLORS[(w - 1) % COLORS.length];
  }

  function updateNextUI() {
    if (nextVal) nextVal.textContent = `${nextW} kg`;
  }
  updateNextUI();

  function log(html) {
    if (!logEl) return;
    const d = document.createElement("div");
    d.className = "entry";
    d.innerHTML = "⚖️ " + html;
    logEl.prepend(d);
  }

  function saveState() {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          weights,
          nextW,
          logHtml: logEl ? logEl.innerHTML : "",
        })
      );
    } catch {}
  }

  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s && Array.isArray(s.weights)) {
        weights = s.weights.map((w) => ({
          w: w.w,
          x: w.x,
          animating: false,
          animOpacity: 1,
        }));
        nextW = s.nextW || rndW();
        if (logEl && s.logHtml) logEl.innerHTML = s.logHtml;
        updateNextUI();
      }
    } catch {}
  }

  loadState();

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      weights = [];
      nextW = rndW();
      updateNextUI();
      if (logEl) logEl.innerHTML = "";
      saveState();
      log("Reseted all weights and log.");
    });
  }

  function toCanvas(p) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (p.clientX - r.left) * (CANVAS_WIDTH / r.width),
      y: (p.clientY - r.top) * (CANVAS_HEIGHT / r.height),
    };
  }

  canvas.addEventListener("mousemove", (e) => {
    const mousePos = toCanvas(e);
    const rad = (angle * Math.PI) / 180;
    const ux = Math.cos(rad),
      uy = Math.sin(rad);
    const dx = mousePos.x - center.x,
      dy = mousePos.y - center.y;
    const projection = dx * ux + dy * uy;
    const boundedS = Math.max(-plankHalf, Math.min(plankHalf, projection));
    const projX = center.x + boundedS * ux;
    const projY = center.y + boundedS * uy;
    hover = { mouse: mousePos, proj: { x: projX, y: projY }, s: boundedS };
    canvas.style.cursor = "pointer";
  });

  canvas.addEventListener("mouseleave", () => {
    hover = null;
    canvas.style.cursor = "default";
  });

  canvas.addEventListener("click", () => {
    if (!hover) return;
    weights.push({
      w: nextW,
      x: hover.s,
      animating: true,
      animationY: -300,
      animOpacity: 0,
      startY: -300,
    });

    log(
      `<b>${nextW}kg</b> placed at <span class="chip">${Math.abs(
        Math.round(hover.s)
      )}px</span> ${hover.s < 0 ? "left" : "right"}`
    );

    nextW = rndW();
    updateNextUI();
    saveState();
  });

  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const mouse = toCanvas(e);
    let closestIndex = -1,
      closestDist = 9999;

    for (let i = 0; i < weights.length; i++) {
      const it = weights[i];
      const rad = (angle * Math.PI) / 180;
      const cosA = Math.cos(rad),
        sinA = Math.sin(rad);
      const localX = it.x,
        localY = -TH / 2 - 14;
      const screenX = center.x + localX * cosA - localY * sinA;
      const screenY = center.y + localX * sinA + localY * cosA;
      const dist = Math.hypot(mouse.x - screenX, mouse.y - screenY);
      if (dist < 20 && dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }

    if (closestIndex !== -1) {
      const removed = weights.splice(closestIndex, 1)[0];
      log(`Removed <b>${removed.w}kg</b>`);
      saveState();
    }
  });

  function drawWeights() {
    for (const it of weights) {
      const rad = (angle * Math.PI) / 180;
      const cosA = Math.cos(rad),
        sinA = Math.sin(rad);
      const localX = it.x,
        localY = -TH / 2 - 14;
      const screenX = center.x + localX * cosA - localY * sinA;
      const screenY = center.y + localX * sinA + localY * cosA;

      if (it.animating) {
        if (it.startScreenY === undefined) {
          it.startScreenY = 20;
          it.animationY = 20;
        }
        const endY = screenY;
        const distance = endY - it.animationY;
        it.animationY += distance * 0.08;
        it.animOpacity += (1 - it.animOpacity) * 0.15;
        if (Math.abs(it.animationY - endY) < 2 && it.animOpacity > 0.99) {
          it.animating = false;
          it.startScreenY = undefined;
          saveState();
        }
      }

      context.save();
      context.translate(screenX, it.animating ? it.animationY : screenY);
      context.globalAlpha = it.animOpacity || 1;
      const radius = 10 + (it.w - 1) * (10 / 9);
      context.fillStyle = colorOf(it.w);
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#000";
      context.lineWidth = 2;
      context.stroke();
      context.fillStyle = "#fff";
      context.font = "bold 12px system-ui";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(it.w + "kg", 0, 0);
      context.restore();
    }
  }

  function updateBalance() {
    leftSum = 0;
    rightSum = 0;
    let leftTorque = 0,
      rightTorque = 0;

    for (const it of weights) {
      const torque = it.w * Math.abs(it.x);
      if (it.x < 0) {
        leftSum += it.w;
        leftTorque += torque;
      } else {
        rightSum += it.w;
        rightTorque += torque;
      }
    }

    const diff = rightTorque - leftTorque;
    const TORQUE_SCALE = 10;
    targetA = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, diff / TORQUE_SCALE));

    if (leftVal) leftVal.textContent = fmt(leftSum, " kg");
    if (rightVal) rightVal.textContent = fmt(rightSum, " kg");
    if (angleVal) angleVal.textContent = fmt(targetA, "°");
  }

  function draw() {
    if (canvas.width !== CANVAS_WIDTH * dpr) updateCanvasSize();
    updateBalance();

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    angle += (targetA - angle) * EASE;

    context.fillStyle = "#1e2535";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillRect(0, CANVAS_HEIGHT * 0.8, CANVAS_WIDTH, CANVAS_HEIGHT * 0.2);

    context.save();
    context.translate(center.x, center.y + 12);
    context.fillStyle = "#33445c";
    context.beginPath();
    context.moveTo(-34, 32);
    context.lineTo(0, -8);
    context.lineTo(34, 32);
    context.closePath();
    context.fill();
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.stroke();
    context.restore();

    if (hover) {
      context.save();
      const ghostY = 100;
      const ghostRadius = 10 + (nextW - 1) * (10 / 9);
      context.fillStyle = colorOf(nextW);
      context.beginPath();
      context.arc(hover.proj.x, ghostY, ghostRadius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#000";
      context.lineWidth = 2;
      context.stroke();
      context.fillStyle = "#fff";
      context.font = "bold 11px system-ui";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(nextW + "kg", hover.proj.x, ghostY);
      context.restore();

      context.save();
      context.strokeStyle = "#888";
      context.lineWidth = 1;
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(hover.proj.x, ghostY + 13);
      context.lineTo(hover.proj.x, ghostY + 60);
      context.stroke();
      context.restore();
    }

    drawWeights();

    context.save();
    context.translate(center.x, center.y);
    context.rotate((angle * Math.PI) / 180);
    context.fillStyle = "#8b6a45";
    context.fillRect(
      -plankLength / 2,
      -plankThickness / 2,
      plankLength,
      plankThickness
    );
    context.strokeStyle = "#5a4430";
    context.lineWidth = 2;
    context.strokeRect(
      -plankLength / 2,
      -plankThickness / 2,
      plankLength,
      plankThickness
    );
    context.restore();

    requestAnimationFrame(draw);
  }

  draw();
})();
