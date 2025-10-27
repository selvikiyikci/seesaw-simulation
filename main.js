(function () {
  const canvas = document.getElementById("cv");
  const context = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  let CANVAS_WIDTH = 800;
  let CANVAS_HEIGHT = 300;

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

  const center = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
  };

  window.addEventListener("resize", () => {
    center.x = CANVAS_WIDTH / 2;
    center.y = CANVAS_HEIGHT / 2;
  });

  function draw() {
    if (canvas.width !== CANVAS_WIDTH * dpr) updateCanvasSize();

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    
    context.fillStyle = "#1e2535";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    
    context.fillStyle = "#1e2535";
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
    
    context.save();
    context.translate(center.x, center.y);
    context.fillStyle = "#8b6a45";
    context.fillRect(-plankLength / 2, -plankThickness / 2, plankLength, plankThickness);
    context.restore();

    requestAnimationFrame(draw);
  }

  draw();
})();
