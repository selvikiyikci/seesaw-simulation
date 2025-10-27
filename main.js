(function () {
  const canvas = document.getElementById("cv");
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  context.scale(ratio, ratio);
  let CANVAS_WIDTH = 800;
  let CANVAS_HEIGHT = 300;
  const dpr = window.devicePixelRatio || 1;

  function updateCanvasSize() {
  const container = canvas.parentElement;
  const containerWidth = Math.min(container.clientWidth, 800);
  const aspectRatio = 800 / 300;
  CANVAS_WIDTH = containerWidth;
  CANVAS_HEIGHT = containerWidth / aspectRatio;
  canvas.width = CANVAS_WIDTH * dpr;
  canvas.height = CANVAS_HEIGHT * dpr;
  context.setTransform(1,0,0,1,0,0);
  context.scale(dpr, dpr);
  }
  updateCanvasSize();
  window.addEventListener("resize", updateCanvasSize);
  const plankLength = 400;
  const plankThickness = 16;

    const center = {
    x: canvas.clientWidth / 2,
    y: canvas.clientHeight / 2,
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
  };
  window.addEventListener("resize", () => {
  center.x = CANVAS_WIDTH / 2;
  center.y = CANVAS_HEIGHT / 2;
  });

  function draw() {
    if (canvas.width !== CANVAS_WIDTH * dpr) updateCanvasSize();
    context.fillStyle = "#1e2535";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillStyle = "#1e2535";
    context.fillRect(0, CANVAS_HEIGHT * 0.8, CANVAS_WIDTH, CANVAS_HEIGHT * 0.2);
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.save();
    context.translate(center.x, center.y + 20);
    context.fillStyle = "#3a4b5e";
    context.beginPath();
    context.moveTo(-30, 20);
    context.lineTo(30, 20);
    context.lineTo(0, -10);
    context.closePath();
    context.fill();
    context.restore();
    context.save();
    context.translate(center.x, center.y);
    context.fillStyle = "#8b6a45";
    context.fillRect(-plankLength / 2, -plankThickness / 2, plankLength, plankThickness);
    context.restore();
    requestAnimationFrame(draw);
  }
  draw();
})();
