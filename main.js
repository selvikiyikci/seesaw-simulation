(function () {
  const canvas = document.getElementById("cv");
  const context = canvas.getContext("2d");
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * pixelRatio;
  canvas.height = canvas.clientHeight * pixelRatio;

  context.scale(pixelRatio, pixelRatio);

  // Test amaçlı arka plan rengi eklendi
  context.fillStyle = "#333";
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
})();
