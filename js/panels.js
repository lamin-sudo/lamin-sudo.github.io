/* ==========================================================================
   PANELS — projects / skills / about / contact overlays.
   Built entirely from existing classes (win-box, win-bar, btn, link, ph,
   ph-in, corner-a, corner-b, fx-fade) so nothing new is invented visually.
   css/style.css and every original js file stay untouched.
   ========================================================================== */
(function(){
  const NS = "http://www.w3.org/2000/svg";

  function n(tag, cls, txt){
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  const ICONS = {
    github: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
    facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
    code: "M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
    print: "M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z",
    close: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    copy: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
  };

  function svgIcon(name){
    const s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", ICONS[name] || "");
    s.appendChild(p);
    return s;
  }

  function action(cls, iconName, label){
    const e = n(cls === "link" ? "a" : "button", cls);
    if (cls !== "link") e.type = "button";
    e.appendChild(svgIcon(iconName));
    e.appendChild(document.createTextNode(label));
    return e;
  }

  /* ---------------- toast ---------------- */
  let toastEl, toastTimer;
  function toast(msg){
    if (!toastEl){
      toastEl = n("div", "toast");
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("on"), 1600);
  }

  /* ---------------- clipboard ---------------- */
  function copyText(text){
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((ok, no) => {
      const ta = n("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      let done = false;
      try { done = document.execCommand("copy"); } catch (e) {}
      ta.remove();
      done ? ok() : no(new Error("copy unavailable"));
    });
  }

  /* ---------------- panel bodies ---------------- */
  function buildProjects(){
    const w = n("div");
    if (!PROJECTS.length){
      w.appendChild(n("div", "empty", STRINGS.noProjects));
      return w;
    }
    const pad = String(PROJECTS.length).padStart(2, "0");
    PROJECTS.forEach((p, i) => {
      const c = n("div", "pj fx-fade");

      const h = n("div", "pj-h");
      h.appendChild(n("span", "pj-n", p.name));
      if (p.alt) h.appendChild(n("span", "pj-a", p.alt));
      h.appendChild(n("span", "pj-i", String(i + 1).padStart(2, "0") + "/" + pad));
      c.appendChild(h);

      if (p.desc) c.appendChild(n("div", "pj-d", p.desc));

      if (p.shot){
        const fig = n("figure", "ph pj-s");
        const inner = n("div", "ph-in");
        const img = new Image();
        img.alt = p.name;
        img.loading = "lazy";
        img.decoding = "async";
        img.draggable = false;
        img.onerror = () => fig.remove();
        img.src = p.shot;
        inner.appendChild(img);
        fig.appendChild(inner);
        c.appendChild(fig);
      }

      if (p.tags && p.tags.length){
        const t = n("div", "pj-t");
        p.tags.forEach(x => t.appendChild(n("span", "pill", x)));
        c.appendChild(t);
      }

      const l = n("div", "pj-l");
      if (p.live){
        const a = action("link", "link", STRINGS.live);
        a.href = p.live;
        a.target = "_blank";
        a.rel = "noopener";
        l.appendChild(a);
      }
      if (p.repo){
        const a = action("link", "code", STRINGS.repo);
        a.href = p.repo;
        a.target = "_blank";
        a.rel = "noopener";
        l.appendChild(a);
      }
      if (l.childElementCount) c.appendChild(l);

      w.appendChild(c);
    });
    return w;
  }

  function buildSkills(){
    const w = n("div");
    SKILL_GROUPS.forEach(g => {
      const s = n("div", "sg");
      s.appendChild(n("div", "sg-k", g.k));
      const v = n("div", "sg-v");
      g.v.forEach(x => v.appendChild(n("span", "pill", x)));
      s.appendChild(v);
      w.appendChild(s);
    });
    return w;
  }

  function buildAbout(){
    const w = n("div");
    if (SITE.headline) w.appendChild(n("div", "ab-e", SITE.headline));
    w.appendChild(n("h2", "ab-h", SITE.nick));
    if (SITE.blurb) w.appendChild(n("p", "ab-p", SITE.blurb));

    if (JOURNEY.length){
      w.appendChild(n("div", "sec-t", STRINGS.journey));
      JOURNEY.forEach(j => {
        const i = n("div", "jn-i");
        i.appendChild(n("div", "jn-y", j.year));
        i.appendChild(n("div", "jn-t", j.title));
        if (j.text) i.appendChild(n("div", "jn-x", j.text));
        w.appendChild(i);
      });
    }

    const acts = n("div", "ab-cv");
    if (CV_URL){
      const a = action("link", "download", STRINGS.downloadCv);
      a.href = CV_URL;
      a.download = "";
      acts.appendChild(a);
    }
    const pr = action("link", "print", STRINGS.printCv);
    pr.style.marginTop = CV_URL ? "8px" : "0";
    pr.addEventListener("click", () => window.print());
    acts.appendChild(pr);
    acts.style.marginTop = "18px";
    w.appendChild(acts);

    return w;
  }

  function buildContact(){
    const w = n("div");

    if (FORM_ENDPOINT){
      const f = n("form", "fm");
      f.action = FORM_ENDPOINT;
      f.method = "POST";

      const name = n("input"); name.name = "name"; name.type = "text";
      name.placeholder = STRINGS.formName; name.required = true; name.autocomplete = "name";
      const email = n("input"); email.name = "email"; email.type = "email";
      email.placeholder = STRINGS.formEmail; email.required = true; email.autocomplete = "email";
      const hp = n("input", "fm-hp"); hp.name = "_gotcha"; hp.type = "text";
      hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true");
      const msg = n("textarea"); msg.name = "message";
      msg.placeholder = STRINGS.formBody; msg.required = true; msg.rows = 5;

      const send = action("link", "mail", STRINGS.sendMessage);
      send.type = "submit";

      f.append(name, email, hp, msg, send);

      f.addEventListener("submit", e => {
        e.preventDefault();
        if (hp.value) return;
        send.disabled = true;
        send.replaceChildren(svgIcon("mail"), document.createTextNode(STRINGS.sending));
        fetch(FORM_ENDPOINT, {
          method: "POST",
          body: new FormData(f),
          headers: { Accept: "application/json" }
        }).then(r => {
          if (!r.ok) throw new Error(String(r.status));
          f.reset();
          toast(STRINGS.sent);
        }).catch(() => {
          toast(STRINGS.sendFail);
        }).finally(() => {
          send.disabled = false;
          send.replaceChildren(svgIcon("mail"), document.createTextNode(STRINGS.sendMessage));
        });
      });

      w.appendChild(f);
      w.appendChild(n("div", "fm-n", STRINGS.formNote));
    }

    const list = n("div", "ct-l");
    list.style.marginTop = FORM_ENDPOINT ? "16px" : "0";

    SOCIALS.forEach(s => {
      let e;
      if (s.copy){
        e = action("link", "copy", s.label);
        e.type = "button";
        e.addEventListener("click", () => {
          copyText(s.copy).then(() => toast(s.copy + " " + STRINGS.copied))
                          .catch(() => { location.href = "mailto:" + s.copy; });
        });
      } else {
        e = action("link", s.icon || "link", s.label);
        e.href = s.href;
        if (!/^(mailto:|tel:)/.test(s.href)){ e.target = "_blank"; e.rel = "noopener"; }
      }
      if (s.sub) e.appendChild(n("span", "ct-sub", s.sub));
      list.appendChild(e);
    });

    w.appendChild(list);
    return w;
  }

  /* ---------------- shell ---------------- */
  const BUILDERS = {
    projects: { title: () => STRINGS.projects, build: buildProjects },
    skills:   { title: () => STRINGS.skills,   build: buildSkills },
    about:    { title: () => STRINGS.about,    build: buildAbout },
    contact:  { title: () => STRINGS.contact,  build: buildContact }
  };

  const registry = {};
  let openName = null, lastFocus = null;
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function setBackgroundInert(on){
    document.querySelectorAll("main,.fl.win").forEach(el => { el.inert = on; });
  }

  Object.keys(BUILDERS).forEach(key => {
    const def = BUILDERS[key];
    const panel = n("div", "panel");
    panel.id = "panel-" + key;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-hidden", "true");

    const box = n("div", "win-box panel-frame");
    box.append(n("i", "corner-a"), n("i", "corner-b"));

    const bar = n("div", "win-bar panel-bar");
    bar.append(n("i"), n("i"), n("i"));
    const titleEl = n("b", null, def.title());
    titleEl.id = "panel-title-" + key;
    panel.setAttribute("aria-labelledby", titleEl.id);

    const close = n("button", "btn panel-x");
    close.type = "button";
    close.setAttribute("aria-label", STRINGS.close);
    close.appendChild(svgIcon("close"));
    close.addEventListener("click", closePanel);
    bar.append(titleEl, close);

    const body = n("div", "panel-body");
    body.appendChild(def.build());

    box.append(bar, body);
    panel.appendChild(box);

    panel.addEventListener("mousedown", e => { if (e.target === panel) closePanel(); });
    panel.addEventListener("keydown", e => {
      if (e.key !== "Tab") return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });

    document.body.appendChild(panel);
    registry[key] = { panel, close };
  });

  function openPanel(name){
    const entry = registry[name];
    if (!entry) return;
    if (openName === name) return;
    if (openName) registry[openName].panel.classList.remove("open");
    lastFocus = document.activeElement;
    openName = name;
    entry.panel.classList.add("open");
    entry.panel.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("locked");
    setBackgroundInert(true);
    const sc = entry.panel.querySelector(".panel-body");
    if (sc) sc.scrollTop = 0;
    entry.close.focus({ preventScroll: true });
  }

  function closePanel(){
    if (!openName) return;
    const entry = registry[openName];
    entry.panel.classList.remove("open");
    entry.panel.setAttribute("aria-hidden", "true");
    openName = null;
    document.documentElement.classList.remove("locked");
    setBackgroundInert(false);
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }

  document.querySelectorAll("[data-panel]").forEach(b => {
    b.addEventListener("click", () => openPanel(b.dataset.panel));
  });

  addEventListener("keydown", e => {
    if (e.key !== "Escape" || !openName) return;
    if (window.LaminTerm && window.LaminTerm.isOpen()) return;
    closePanel();
  });

  window.LaminUI = {
    open: openPanel,
    close: closePanel,
    isOpen: () => openName,
    toast: toast,
    copy: copyText
  };
})();
