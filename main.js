(function () {
  const canvas = document.getElementById("cv");
  const context = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  let CANVAS_WIDTH = 800;
  let CANVAS_HEIGHT = 300;

  const COLORS = [
    "#2f6fec", "#2fc48d", "#ffb020", "#ef5766", "#7b61ff",
    "#34aadc", "#8bd26a", "#f27f3d", "#aa66cc", "#5e6ad2"
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

  const center = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
  };

  window.addEventListener("resize", () => {
    center.x = CANVAS_WIDTH / 2;
    center.y = CANVAS_HEIGHT / 2;
  });

  const EASE = 0.06;
  const MAX_ANGLE = 30;
  let targetA = 0;
  let angle = 0;


  let weights = [];
  let nextW = rndW(); // sıradaki ağırlık
  let hover = null;

  // Random ağırlık oluşturma
  function rndW() {
    return 1 + Math.floor(Math.random() * 10); // 1–10 kg arası
  }

  // Ağırlığın rengi
  function colorOf(w) {
    return COLORS[(w - 1) % COLORS.length];
  }

  // Ekrandaki mouse pozisyonunu canvas koordinatına çevirme
  function toCanvas(p) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (p.clientX - r.left) * (CANVAS_WIDTH / r.width),
      y: (p.clientY - r.top) * (CANVAS_HEIGHT / r.height),
    };
  }

  // Hover 
  canvas.addEventListener("mousemove", (e) => {
    const mousePos = toCanvas(e);
    const rad = (angle * Math.PI) / 180;
    const ux = Math.cos(rad);
    const uy = Math.sin(rad);
    const dx = mousePos.x - center.x;
    const dy = mousePos.y - center.y;
    const projection = dx * ux + dy * uy;
    const clampedS = Math.max(-plankHalf, Math.min(plankHalf, projection));
    const projX = center.x + clampedS * ux;
    const projY = center.y + clampedS * uy;
    hover = { mouse: mousePos, proj: { x: projX, y: projY }, s: clampedS };
    canvas.style.cursor = "pointer";
  });

  canvas.addEventListener("mouseleave", () => {
    hover = null;
    canvas.style.cursor = "default";
  });

  // Çizim
  function draw() {
    if (canvas.width !== CANVAS_WIDTH * dpr) updateCanvasSize();

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    angle += (targetA - angle) * EASE;

    // Arka plan
    context.fillStyle = "#1e2535";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Zemin
    context.fillStyle = "#1e2535";
    context.fillRect(0, CANVAS_HEIGHT * 0.8, CANVAS_WIDTH, CANVAS_HEIGHT * 0.2);

    // Pivot
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

    // Hoverdaki görünmez ağırlık
    if (hover) {
      context.save();
      const ghostY = 100;
      const ghostRadius = 10 + (nextW - 1) * (10 / 9);
      const c = colorOf(nextW);
      context.fillStyle = c;
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

    // Tahta için
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
