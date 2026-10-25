(function(){
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const c = document.getElementById("snow");
  const ctx = c.getContext("2d");
  const card = document.querySelector(".card");
  let w, h, dpr, flakes = [], extra = [], settled = [];
  let t = 0;
  const m = { x: -1e4, y: -1e4, vx: 0, vy: 0, last: 0 };

  function make(initial){
    const big = Math.random() < .22;
    const px = big ? 4 : Math.random() < .5 ? 3 : 2;
    return {
      x: Math.random() * (w + 40 * dpr) - 20 * dpr,
      y: initial ? Math.random() * h : -10 * dpr,
      s: px * dpr,
      v: (big ? .9 : .45 + Math.random() * .45) * dpr,
      a: big ? .75 : .35 + Math.random() * .35,
      p: Math.random() * Math.PI * 2,
      sw: (.2 + Math.random() * .5) * dpr,
      vx: 0, vy: 0
    };
  }

  let lastW = 0;

  function size(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nh = innerHeight * dpr;
    if (flakes.length && innerWidth === lastW){
      for (const f of flakes) f.y = f.y * nh / h;
      h = c.height = nh;
      return;
    }
    lastW = innerWidth;
    w = c.width = innerWidth * dpr;
    h = c.height = nh;
    const n = Math.min(Math.round(innerWidth * innerHeight / 14000), 120);
    flakes = Array.from({ length: n }, () => make(true));
    settled = [];
  }

  function burst(x, y){
    for (let i = 0; i < 26; i++){
      const f = make(false);
      const ang = Math.random() * Math.PI * 2;
      const sp = (1.5 + Math.random() * 3.5) * dpr;
      f.x = x; f.y = y;
      f.vx = Math.cos(ang) * sp;
      f.vy = Math.sin(ang) * sp - 1.5 * dpr;
      f.life = 1;
      extra.push(f);
    }
    if (extra.length > 300) extra.splice(0, extra.length - 300);
  }

  function push(f){
    const dx = f.x - m.x, dy = f.y - m.y;
    const d2 = dx * dx + dy * dy;
    const R = 110 * dpr;
    if (d2 < R * R){
      const d = Math.sqrt(d2) || 1;
      const k = 1 - d / R;
      f.vx += dx / d * k * .9 * dpr + m.vx * k * .08;
      f.vy += dy / d * k * .6 * dpr + m.vy * k * .08;
    }
  }

  function step(f, wind, r){
    push(f);
    f.vx *= .94; f.vy *= .94;
    f.y += f.v + f.vy;
    f.x += wind + Math.sin(t * 2 + f.p) * f.sw * .3 + f.vx;
    if (r && Math.abs(f.vx) < .5 * dpr && f.vy > -0.2 && f.y >= r.top && f.y - f.v - f.vy < r.top && f.x > r.left && f.x < r.right && Math.random() < .7){
      settled.push({ x: f.x, y: r.top - f.s, s: f.s, a: f.a, ox: f.x - r.left, life: 1, melt: .0008 + Math.random() * .001 });
      if (settled.length > 220) settled.shift();
      return true;
    }
    return false;
  }

  function draw(x, y, s, a){
    ctx.fillStyle = "rgba(255,255,255," + a + ")";
    ctx.fillRect(Math.round(x / dpr) * dpr, Math.round(y / dpr) * dpr, s, s);
  }

  function frame(){
    t += .01;
    ctx.clearRect(0, 0, w, h);
    const wind = Math.sin(t * .6) * .25 * dpr + .12 * dpr;
    let r = null;
    if (document.getElementById("enter")) settled.length = 0;
    else if (card){
      const b = card.getBoundingClientRect();
      r = { top: b.top * dpr, left: b.left * dpr, right: b.right * dpr };
    }
    m.vx *= .85; m.vy *= .85;

    for (let i = 0; i < flakes.length; i++){
      const f = flakes[i];
      const landed = step(f, wind, r);
      if (landed || f.y > h + 10 || f.x > w + 30 || f.x < -30 || f.y < -60 * dpr){
        flakes[i] = make(false);
        continue;
      }
      draw(f.x, f.y, f.s, f.a);
    }

    for (let i = extra.length - 1; i >= 0; i--){
      const f = extra[i];
      f.life -= .006;
      const landed = step(f, wind, r);
      if (landed || f.life <= 0 || f.y > h + 10){
        extra.splice(i, 1);
        continue;
      }
      draw(f.x, f.y, f.s, f.a * Math.min(1, f.life * 2));
    }

    for (let i = settled.length - 1; i >= 0; i--){
      const p = settled[i];
      p.life -= p.melt;
      if (r){ p.x = r.left + p.ox; p.y = r.top - p.s; }
      const dx = p.x - m.x, dy = p.y - m.y;
      if (dx * dx + dy * dy < 1600 * dpr * dpr || p.life <= 0){
        if (p.life > 0){
          const f = make(false);
          f.x = p.x; f.y = p.y; f.s = p.s; f.a = p.a;
          f.vx = (dx > 0 ? 1 : -1) * (1 + Math.random() * 2) * dpr;
          f.vy = -(1 + Math.random() * 2) * dpr;
          f.life = 1;
          extra.push(f);
        }
        settled.splice(i, 1);
        continue;
      }
      draw(p.x, p.y, p.s, p.a * Math.min(1, p.life * 1.5));
    }

    requestAnimationFrame(frame);
  }

  function move(x, y){
    const nx = x * dpr, ny = y * dpr;
    const now = performance.now();
    if (m.x > -1e3 && now - m.last < 80){
      m.vx = nx - m.x;
      m.vy = ny - m.y;
    }
    m.x = nx; m.y = ny; m.last = now;
  }

  addEventListener("resize", size);
  addEventListener("pointermove", e => move(e.clientX, e.clientY), { passive: true });
  addEventListener("pointerdown", e => {
    move(e.clientX, e.clientY);
    if (e.target.closest("a,button,.bar")) return;
    burst(e.clientX * dpr, e.clientY * dpr);
  }, { passive: true });
  addEventListener("pointerup", e => { if (e.pointerType !== "mouse"){ m.x = m.y = -1e4; } });
  document.addEventListener("pointerleave", () => { m.x = m.y = -1e4; });
  size();
  frame();
})();
