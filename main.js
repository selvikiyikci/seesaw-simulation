(function () {
  const canvas = document.getElementById("cv");
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  context.scale(ratio, ratio);

  const plankLength = 400;
  const plankThickness = 16;

    const center = {
    x: canvas.clientWidth / 2,
    y: canvas.clientHeight / 2,
  };

  function draw() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
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
