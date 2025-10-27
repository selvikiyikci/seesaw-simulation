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

  
  const EASE = 0.06;      
  const MAX_ANGLE = 30;   
  let targetA = 0;        
  let angle = 0;      

  function draw() {
    if (canvas.width !== CANVAS_WIDTH * dpr) updateCanvasSize();

    // Ekranı temizlemek için
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

   //Açıyı güncellemek için
    angle += (targetA - angle) * EASE;

    // Arka plan
    context.fillStyle = "#1e2535";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Zemin
    context.fillStyle = "#1e2535";
    context.fillRect(0, CANVAS_HEIGHT * 0.8, CANVAS_WIDTH, CANVAS_HEIGHT * 0.2);

   //Pivot için
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
  //Tahta için
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
