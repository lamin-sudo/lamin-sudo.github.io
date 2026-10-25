(function(){
  const audio = new Audio();
  audio.preload = "auto";
  const $ = id => document.getElementById(id);
  const title = $("title"), artist = $("artist"), cover = $("cover"), coverImg = $("coverImg");
  const playBtn = $("play"), playIcon = $("playIcon"), fill = $("fill"), time = $("time"), bar = $("bar");
  const vol = $("vol"), vnum = $("vnum"), mute = $("mute"), muteIcon = $("muteIcon");
  const PLAY = "M8 5v14l11-7z";
  const PAUSE = "M6 5h4v14H6zm8 0h4v14h-4z";
  const SPK = "M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z";
  const OFF = "M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z";

  const HINT = STRINGS.musicHint;
  let queue = [], history = [], cur = -1, userPaused = false, failed = 0, dead = false, waiting = false;

  function shuffle(a){
    for (let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function refill(last){
    queue = shuffle(TRACKS.map((_, i) => i));
    if (queue.length > 1 && queue[queue.length - 1] === last){
      [queue[0], queue[queue.length - 1]] = [queue[queue.length - 1], queue[0]];
    }
  }

  function fmt(s){
    if (!isFinite(s)) return "0:00";
    return Math.floor(s / 60) + ":" + Math.floor(s % 60).toString().padStart(2, "0");
  }

  function load(i){
    cur = i;
    const t = TRACKS[i];
    audio.src = t.src;
    title.textContent = t.title;
    artist.textContent = waiting ? HINT : t.artist;
    coverImg.style.display = "";
    coverImg.src = t.cover || "";
    fill.style.width = "0%";
    time.textContent = "0:00";
    if ("mediaSession" in navigator){
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t.title,
        artist: t.artist,
        artwork: t.cover ? [{ src: t.cover, sizes: "240x240", type: "image/jpeg" }] : []
      });
    }
  }

  const nativeVolume = (() => { const a = new Audio(); a.volume = .5; return a.volume === .5; })();
  let actx = null, gain = null;

  function ensureGain(){
    if (nativeVolume || gain || !/^https?:$/.test(location.protocol)) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      actx = new AC();
      gain = actx.createGain();
      actx.createMediaElementSource(audio).connect(gain);
      gain.connect(actx.destination);
      gain.gain.value = audio.muted ? 0 : parseFloat(vol.value) / 100;
    } catch (e) { gain = null; }
  }

  function play(){
    if (dead) return;
    ensureGain();
    if (actx && actx.state === "suspended") actx.resume().catch(() => {});
    const p = audio.play();
    if (p && p.catch) p.catch(e => {
      if (e && e.name === "NotAllowedError" && !userPaused){
        waiting = true;
        artist.textContent = HINT;
      }
    });
  }

  function next(auto){
    if (cur >= 0) history.push(cur);
    if (!queue.length) refill(cur);
    load(queue.pop());
    if (auto || !audio.paused || !userPaused) play();
  }

  function prev(){
    if (audio.currentTime > 3 || !history.length){ audio.currentTime = 0; return; }
    queue.push(cur);
    load(history.pop());
    if (!userPaused) play();
  }

  function setIcon(playing){
    playIcon.setAttribute("d", playing ? PAUSE : PLAY);
    cover.classList.toggle("playing", playing);
  }

  function setVol(v, save){
    v = Math.max(0, Math.min(100, v));
    audio.volume = v / 100;
    if (gain) gain.gain.value = audio.muted ? 0 : v / 100;
    vol.value = v;
    vol.style.setProperty("--p", v + "%");
    vnum.textContent = Math.round(v);
    muteIcon.setAttribute("d", (audio.muted || v === 0) ? OFF : SPK);
    if (save){ try { localStorage.setItem("xb_vol3", String(v)); } catch (e) {} }
  }

  let saved = 10;
  try {
    const v = parseFloat(localStorage.getItem("xb_vol3"));
    if (isFinite(v)) saved = v;
  } catch (e) {}
  setVol(saved, false);

  playBtn.onclick = () => {
    if (audio.paused){ userPaused = false; play(); }
    else { userPaused = true; audio.pause(); }
  };
  $("prev").onclick = prev;
  $("next").onclick = () => next(false);
  mute.onclick = () => { audio.muted = !audio.muted; setVol(parseFloat(vol.value), false); };
  vol.addEventListener("input", () => { audio.muted = false; setVol(parseFloat(vol.value), true); });

  audio.onplay = () => {
    setIcon(true);
    if (waiting){ waiting = false; if (cur >= 0) artist.textContent = TRACKS[cur].artist; }
  };
  audio.onpause = () => setIcon(false);
  audio.onended = () => next(true);
  audio.onerror = () => {
    if (dead) return;
    const src = audio.currentSrc || audio.src || "";
    if (src.startsWith("data:") && !audio.dataset.blob){
      audio.dataset.blob = "1";
      fetch(src).then(r => r.blob()).then(b => {
        audio.src = URL.createObjectURL(b);
        if (!userPaused) play();
      }).catch(giveUp);
      return;
    }
    audio.dataset.blob = "";
    failed++;
    if (failed >= TRACKS.length){ giveUp(); return; }
    setTimeout(() => { if (!dead) next(true); }, 600);
  };
  function giveUp(){
    dead = true;
    audio.pause();
    title.textContent = STRINGS.musicFailedTitle;
    artist.textContent = STRINGS.musicFailedArtist;
    setIcon(false);
  }
  audio.ontimeupdate = () => {
    if (audio.currentTime > .3) failed = 0;
    fill.style.width = (audio.currentTime / audio.duration * 100 || 0) + "%";
    time.textContent = fmt(audio.currentTime);
  };
  bar.onclick = e => {
    const r = bar.getBoundingClientRect();
    if (audio.duration) audio.currentTime = (e.clientX - r.left) / r.width * audio.duration;
  };

  if ("mediaSession" in navigator){
    navigator.mediaSession.setActionHandler("play", () => { userPaused = false; play(); });
    navigator.mediaSession.setActionHandler("pause", () => { userPaused = true; audio.pause(); });
    navigator.mediaSession.setActionHandler("previoustrack", prev);
    navigator.mediaSession.setActionHandler("nexttrack", () => next(false));
  }

  next(false);
  setTimeout(() => { if (audio.paused && !userPaused) play(); }, 1000);
  addEventListener("focus", () => { if (audio.paused && !userPaused && !waiting) play(); });
  const kick = e => {
    if (e.target && e.target.closest && e.target.closest(".win-box")) return;
    if (!userPaused && audio.paused) play();
    if (!audio.paused) off();
  };
  const evs = ["pointerdown", "touchend", "keydown", "click"];
  function off(){ evs.forEach(n => removeEventListener(n, kick, true)); }
  evs.forEach(n => addEventListener(n, kick, true));
  audio.addEventListener("playing", off);
})();
