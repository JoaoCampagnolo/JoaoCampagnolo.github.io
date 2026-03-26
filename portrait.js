(function () {
  // --- Tunable parameters ---
  var GRAIN = 3;                // pixel sampling step (lower = finer grain, more dots)
  var MAX_DOT = 2.2;            // max dot radius for darkest pixels
  var MIN_DOT = 0.6;            // min dot radius for lightest visible pixels
  var BG_THRESHOLD = 245;       // brightness above this is treated as removed background (skip)
  var SKIN_THRESHOLD = 120;     // brightness below this draws dark dots; above draws accent dots
  var ANIM_DURATION = 2500;     // ms for settle animation
  var SCATTER_RADIUS = 350;     // how far particles scatter initially
  var ACCENT = '#b7ff5d';
  var DARK = '#0b0b0c';

  var canvas = document.getElementById('portrait-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = 'images/portrait_xx25_no_bg_cropped.jpg';

  img.onload = function () {
    // Set canvas resolution to a workable size
    var size = Math.min(img.width, img.height, 500);
    var w = size;
    var h = size;
    canvas.width = w;
    canvas.height = h;

    // Draw image centered/cropped to square on offscreen canvas
    var offscreen = document.createElement('canvas');
    offscreen.width = w;
    offscreen.height = h;
    var offCtx = offscreen.getContext('2d');

    // Center-crop: if image isn't square, crop from center
    var srcSize = Math.min(img.width, img.height);
    var sx = (img.width - srcSize) / 2;
    var sy = (img.height - srcSize) / 2;
    offCtx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, w, h);

    var imageData = offCtx.getImageData(0, 0, w, h);
    var data = imageData.data;

    // Sample pixels and create particles
    // Two types: dark dots for dark features, accent dots for light skin/shirt
    var targets = [];
    for (var y = 0; y < h; y += GRAIN) {
      for (var x = 0; x < w; x += GRAIN) {
        var i = (y * w + x) * 4;
        var brightness = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

        // Skip removed background (pure white / near-white)
        if (brightness > BG_THRESHOLD) continue;

        if (brightness <= SKIN_THRESHOLD) {
          // Dark features: eyes, hair, eyebrows, beard, shadows
          // Darker = bigger dot
          var norm = brightness / SKIN_THRESHOLD;
          var radius = MAX_DOT - (norm * norm) * (MAX_DOT - MIN_DOT);
          targets.push({ x: x, y: y, r: radius, color: DARK });
        } else {
          // Light skin / shirt area: draw accent (lime) dots
          // Brighter skin = slightly smaller dot, but all reasonably visible
          var skinNorm = (brightness - SKIN_THRESHOLD) / (BG_THRESHOLD - SKIN_THRESHOLD);
          var skinRadius = MAX_DOT * 0.85 - skinNorm * (MAX_DOT * 0.85 - MIN_DOT);
          targets.push({ x: x, y: y, r: skinRadius, color: ACCENT });
        }
      }
    }

    // Create particles with random start positions
    var cx = w / 2;
    var cy = h / 2;
    var particles = [];
    for (var j = 0; j < targets.length; j++) {
      var t = targets[j];
      var angle = Math.random() * Math.PI * 2;
      var dist = SCATTER_RADIUS + Math.random() * SCATTER_RADIUS;
      particles.push({
        sx: cx + Math.cos(angle) * dist,
        sy: cy + Math.sin(angle) * dist,
        tx: t.x,
        ty: t.y,
        r: t.r,
        color: t.color
      });
    }

    // Easing: cubic ease-out
    function ease(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    var startTime = null;

    function draw(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / ANIM_DURATION, 1);
      var t = ease(progress);

      ctx.clearRect(0, 0, w, h);

      for (var k = 0; k < particles.length; k++) {
        var p = particles[k];
        var px = p.sx + (p.tx - p.sx) * t;
        var py = p.sy + (p.ty - p.sy) * t;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) {
        requestAnimationFrame(draw);
      }
    }

    // Trigger animation when canvas scrolls into view
    var hasPlayed = false;
    var observer = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting && !hasPlayed) {
          hasPlayed = true;
          startTime = null;
          requestAnimationFrame(draw);
        }
      }
    }, { threshold: 0.1 });

    observer.observe(canvas);

    // Click to replay
    canvas.style.cursor = 'pointer';
    canvas.addEventListener('click', function () {
      for (var k = 0; k < particles.length; k++) {
        var angle = Math.random() * Math.PI * 2;
        var dist = SCATTER_RADIUS + Math.random() * SCATTER_RADIUS;
        particles[k].sx = cx + Math.cos(angle) * dist;
        particles[k].sy = cy + Math.sin(angle) * dist;
      }
      startTime = null;
      requestAnimationFrame(draw);
    });
  };
})();
