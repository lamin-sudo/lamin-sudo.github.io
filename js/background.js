(function(){
  const c = document.getElementById("bg");
  const ctx = c.getContext("2d");
  let w, h, dpr, pts = [];
  const mouse = { x: -9999, y: -9999 };

  let lastW = 0;
  const still = matchMedia("(prefers-reduced-motion:reduce)").matches;

  function size(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nh = innerHeight * dpr;
    if (pts.length && innerWidth === lastW){
      for (const p of pts) p.y = p.y * nh / h;
      h = c.height = nh;
      if (still) frame();
      return;
    }
    lastW = innerWidth;
    w = c.width = innerWidth * dpr;
    h = c.height = nh;
    const n = Math.round((innerWidth * innerHeight) / 15000);
    pts = Array.from({ length: Math.min(n, 110) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .25 * dpr,
      vy: (Math.random() - .5) * .25 * dpr,
      r: (Math.random() * 1.4 + .4) * dpr
    }));
  }

  function frame(){
    ctx.clearRect(0, 0, w, h);
    const link = 130 * dpr;
    for (const p of pts){
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 140 * dpr && d > 0){
        p.x += dx / d * .6 * dpr;
        p.y += dy / d * .6 * dpr;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,.6)";
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++){
      for (let j = i + 1; j < pts.length; j++){
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link){
          ctx.strokeStyle = "rgba(255,255,255," + (.18 * (1 - d / link)) + ")";
          ctx.lineWidth = dpr * .6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    if (!still) requestAnimationFrame(frame);
  }

  addEventListener("resize", () => { size(); if (still) frame(); });
  addEventListener("pointermove", e => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
  addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  size();
  frame();
})();
