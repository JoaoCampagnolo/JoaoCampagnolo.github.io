(function () {
  const PARTICLE_STEP = 5;      // sample every Nth pixel — controls dot density
  const DOT_RADIUS = 2.8;       // radius of each drawn dot
  const ANIM_DURATION = 2800;   // ms for the full settle animation
  const SCATTER_RADIUS = 400;   // how far particles scatter initially
  const ACCENT = '#b7ff5d';

  const canvas = document.getElementById('portrait-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = 'images/joao_cv_dithered_big_dots_300px.png';

  img.onload = function () {
    // Match canvas resolution to image (scaled down for performance)
    const scale = 0.5;
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    canvas.width = w;
    canvas.height = h;

    // Draw image to an offscreen canvas to read pixel data
    const offscreen = document.createElement('canvas');
    offscreen.width = w;
    offscreen.height = h;
    const offCtx = offscreen.getContext('2d');
    offCtx.drawImage(img, 0, 0, w, h);
    const imageData = offCtx.getImageData(0, 0, w, h);
    const data = imageData.data;

    // Sample dark pixels as target positions
    const targets = [];
    for (let y = 0; y < h; y += PARTICLE_STEP) {
      for (let x = 0; x < w; x += PARTICLE_STEP) {
        const i = (y * w + x) * 4;
        const brightness = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        if (brightness < 128) {
          targets.push({ x: x, y: y });
        }
      }
    }

    // Create particles with random start positions
    const cx = w / 2;
    const cy = h / 2;
    const particles = targets.map(function (t) {
      const angle = Math.random() * Math.PI * 2;
      const dist = SCATTER_RADIUS + Math.random() * SCATTER_RADIUS;
      return {
        sx: cx + Math.cos(angle) * dist,  // start x
        sy: cy + Math.sin(angle) * dist,  // start y
        tx: t.x,                           // target x
        ty: t.y,                           // target y
      };
    });

    // Easing: cubic ease-out
    function ease(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    var startTime = null;
    var settled = false;

    function draw(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / ANIM_DURATION, 1);
      var t = ease(progress);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ACCENT;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var x = p.sx + (p.tx - p.sx) * t;
        var y = p.sy + (p.ty - p.sy) * t;
        ctx.beginPath();
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) {
        requestAnimationFrame(draw);
      } else {
        settled = true;
      }
    }

    // Use IntersectionObserver to trigger animation when visible
    var hasPlayed = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasPlayed) {
          hasPlayed = true;
          startTime = null;
          requestAnimationFrame(draw);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(canvas);

    // Also allow re-play on click
    canvas.style.cursor = 'pointer';
    canvas.addEventListener('click', function () {
      // Re-scatter and replay
      var particles2 = particles;
      for (var i = 0; i < particles2.length; i++) {
        var angle = Math.random() * Math.PI * 2;
        var dist = SCATTER_RADIUS + Math.random() * SCATTER_RADIUS;
        particles2[i].sx = cx + Math.cos(angle) * dist;
        particles2[i].sy = cy + Math.sin(angle) * dist;
      }
      startTime = null;
      settled = false;
      requestAnimationFrame(draw);
    });
  };
})();
