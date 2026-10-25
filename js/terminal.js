/* ==========================================================================
   TERMINAL — hidden console drawer. Opens with ` or Ctrl+K, or the >_ button.
   Reads the music state straight from the DOM (#title / #artist / .playing)
   so js/player.js never has to be touched.
   ========================================================================== */
(function(){
  function n(tag, cls, txt){
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  const NS = "http://www.w3.org/2000/svg";
  const CLOSE_PATH = "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z";

  const shell = n("div", "tm");
  shell.setAttribute("role", "dialog");
  shell.setAttribute("aria-modal", "true");
  shell.setAttribute("aria-label", "Terminal");
  shell.setAttribute("aria-hidden", "true");

  const box = n("div", "win-box tm-box");
  box.append(n("i", "corner-a"), n("i", "corner-b"));

  const bar = n("div", "win-bar");
  bar.append(n("i"), n("i"), n("i"), n("b", null, "terminal"));
  const closeBtn = n("button", "btn panel-x");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close terminal");
  const cs = document.createElementNS(NS, "svg");
  cs.setAttribute("viewBox", "0 0 24 24");
  cs.setAttribute("aria-hidden", "true");
  const cp = document.createElementNS(NS, "path");
  cp.setAttribute("d", CLOSE_PATH);
  cs.appendChild(cp);
  closeBtn.appendChild(cs);
  bar.append(closeBtn);

  const out = n("div", "tm-out");
  out.setAttribute("aria-live", "polite");

  const row = n("div", "tm-row");
  const prompt = n("span", null, ">");
  const input = n("input");
  input.type = "text";
  input.autocomplete = "off";
  input.autocapitalize = "off";
  input.spellcheck = false;
  input.setAttribute("aria-label", "Terminal command");
  row.append(prompt, input);

  box.append(bar, out, row);
  shell.appendChild(box);
  document.body.appendChild(shell);

  input.addEventListener("contextmenu", e => e.stopPropagation());

  /* ---------------- output ---------------- */
  function scroll(){ out.scrollTop = out.scrollHeight; }
  function say(text, cls){
    out.appendChild(n("div", "tm-l" + (cls ? " " + cls : ""), text));
    scroll();
  }
  function echo(cmd){ say("> " + cmd, "tm-c"); }

  /* ---------------- commands ---------------- */
  const COMMANDS = {
    help: {
      hint: "list every command",
      run(){
        say("available commands", "tm-d");
        Object.keys(COMMANDS).sort().forEach(k => {
          say("  " + k.padEnd(12) + COMMANDS[k].hint, "tm-d");
        });
      }
    },
    whoami: {
      hint: "who is behind this site",
      run(){
        say(SITE.nick + " — " + SITE.tag);
        if (SITE.headline) say(SITE.headline, "tm-d");
        if (SITE.blurb) say(SITE.blurb, "tm-d");
      }
    },
    skills: {
      hint: "print the skill groups",
      run(){
        SKILL_GROUPS.forEach(g => say("  " + g.k + ": " + g.v.join(", ")));
      }
    },
    projects: {
      hint: "list shipped projects",
      run(){
        if (!PROJECTS.length) return say("  nothing here yet", "tm-d");
        PROJECTS.forEach((p, i) => {
          say("  " + String(i + 1) + ". " + p.name + (p.alt ? "  " + p.alt : ""));
          say("     " + p.desc, "tm-d");
          if (p.live) say("     " + p.live, "tm-d");
        });
        say("open a link with: visit <number>", "tm-d");
      }
    },
    visit: {
      hint: "visit <number> — open a project",
      run(arg){
        const i = parseInt(arg, 10);
        const p = PROJECTS[i - 1];
        if (!p || !p.live) return say("  no project at that number", "tm-d");
        say("opening " + p.live, "tm-d");
        window.open(p.live, "_blank", "noopener");
      }
    },
    journey: {
      hint: "print the timeline",
      run(){
        JOURNEY.forEach(j => say("  " + j.year + "  " + j.title + " — " + j.text));
      }
    },
    contact: {
      hint: "show how to reach me",
      run(){
        say("  email     " + EMAIL);
        say("  github    github.com/" + GITHUB_USER);
        SOCIALS.filter(s => !s.copy && !/github/i.test(s.label)).forEach(s => {
          say("  " + s.label.toLowerCase().padEnd(8) + s.sub, "tm-d");
        });
        say("copy the address with: copy", "tm-d");
      }
    },
    copy: {
      hint: "copy my email to the clipboard",
      run(){
        window.LaminUI.copy(EMAIL)
          .then(() => say("  copied " + EMAIL, "tm-d"))
          .catch(() => say("  copy blocked by the browser", "tm-d"));
      }
    },
    nowplaying: {
      hint: "what the player is running",
      run(){
        const t = document.getElementById("title");
        const a = document.getElementById("artist");
        const playing = document.getElementById("cover").classList.contains("playing");
        say("  " + (playing ? "playing  " : "paused   ") + (t.textContent || "—") + " — " + (a.textContent || "—"));
        say("  " + TRACKS.length + " tracks in the pool, shuffled", "tm-d");
      }
    },
    resume: {
      hint: "download the CV",
      run(){
        if (!CV_URL) return say("  no cv file configured yet", "tm-d");
        say("downloading " + CV_URL, "tm-d");
        const a = n("a");
        a.href = CV_URL;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    },
    open: {
      hint: "open <projects|skills|about|contact>",
      run(arg){
        const name = String(arg || "").trim().toLowerCase();
        if (!["projects", "skills", "about", "contact"].includes(name)){
          return say("  pick one: projects, skills, about, contact", "tm-d");
        }
        hide();
        window.LaminUI.open(name);
      }
    },
    clear: {
      hint: "wipe the screen",
      run(){ out.replaceChildren(); }
    },
    exit: {
      hint: "close the terminal",
      run(){ hide(); }
    }
  };

  const ALIASES = { ls: "projects", "?": "help", quit: "exit", cls: "clear", np: "nowplaying" };

  function run(raw){
    const line = raw.trim();
    if (!line) return;
    echo(line);
    const parts = line.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const name = ALIASES[cmd] || cmd;
    const entry = COMMANDS[name];
    if (!entry) return say("  unknown command: " + cmd + "  —  type help", "tm-d");
    entry.run(parts.slice(1).join(" "));
  }

  /* ---------------- history + completion ---------------- */
  const history = [];
  let hIndex = -1;

  input.addEventListener("keydown", e => {
    if (e.key === "Enter"){
      const v = input.value;
      input.value = "";
      if (v.trim()){ history.push(v); }
      hIndex = history.length;
      run(v);
    } else if (e.key === "ArrowUp"){
      e.preventDefault();
      if (hIndex > 0){ hIndex--; input.value = history[hIndex]; }
    } else if (e.key === "ArrowDown"){
      e.preventDefault();
      if (hIndex < history.length - 1){ hIndex++; input.value = history[hIndex]; }
      else { hIndex = history.length; input.value = ""; }
    } else if (e.key === "Tab"){
      e.preventDefault();
      const typed = input.value.trim().toLowerCase();
      if (!typed) return;
      const names = Object.keys(COMMANDS).concat(Object.keys(ALIASES));
      const hits = names.filter(c => c.startsWith(typed));
      if (hits.length === 1) input.value = hits[0] + " ";
      else if (hits.length > 1) { echo(input.value); say("  " + hits.join("   "), "tm-d"); }
    } else if (e.key === "Escape"){
      e.stopPropagation();
      hide();
    }
  });

  /* ---------------- show / hide ---------------- */
  let greeted = false, lastFocus = null;

  function greet(){
    if (greeted) return;
    greeted = true;
    say(SITE.nick + " — " + SITE.tag, "tm-c");
    say("type help and press enter", "tm-d");
  }

  function show(){
    if (document.getElementById("enter")) return;
    if (window.LaminUI.isOpen()) window.LaminUI.close();
    lastFocus = document.activeElement;
    greet();
    shell.classList.add("open");
    shell.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("locked");
    document.querySelectorAll("main,.fl.win,.scatter").forEach(el => { el.inert = true; });
    input.focus();
  }

  function hide(){
    if (!shell.classList.contains("open")) return;
    shell.classList.remove("open");
    shell.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("locked");
    document.querySelectorAll("main,.fl.win,.scatter").forEach(el => { el.inert = false; });
    input.blur();
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }

  closeBtn.addEventListener("click", hide);
  shell.addEventListener("mousedown", e => { if (e.target === shell) hide(); });
  out.addEventListener("click", () => input.focus());

  addEventListener("keydown", e => {
    const t = e.target;
    const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

    if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === "k"){
      e.preventDefault();
      shell.classList.contains("open") ? hide() : show();
      return;
    }
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "`"){
      e.preventDefault();
      shell.classList.contains("open") ? hide() : show();
    }
  });

  const termBtn = document.getElementById("termBtn");
  if (termBtn) termBtn.addEventListener("click", show);

  window.LaminTerm = { open: show, close: hide, isOpen: () => shell.classList.contains("open") };
})();
