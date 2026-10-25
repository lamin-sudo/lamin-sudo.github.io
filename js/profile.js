(function(){
  const $ = id => document.getElementById(id);

  $("nick").textContent = SITE.nick;
  $("enterNick").textContent = SITE.nick;
  $("tagline").textContent = SITE.tag;
  $("foot").textContent = SITE.foot;
  $("winTitle").textContent = STRINGS.nowPlaying;
  $("enterRu").textContent = SITE.tag;

  $("gh").href = "https://github.com/" + GITHUB_USER;
  $("ghName").textContent = GITHUB_USER;
  $("ghSub").textContent = "github.com/" + GITHUB_USER;
  $("mail").href = "mailto:" + EMAIL;
  $("mailName").textContent = SITE.nick;
  $("mailSub").textContent = EMAIL;

  function copyText(text){
    if (navigator.clipboard && window.isSecureContext){
      return navigator.clipboard.writeText(text);
    }
    return new Promise((ok, no) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      let done = false;
      try { done = document.execCommand("copy"); } catch (e) {}
      ta.remove();
      done ? ok() : no(new Error("copy failed"));
    });
  }

  const wrap = $("rows");
  ROWS.forEach(r => {
    const row = document.createElement("div");
    row.className = "row";

    const k = document.createElement("span");
    k.className = "k";
    k.textContent = r.k;

    const v = document.createElement("span");
    v.className = "v";
    v.textContent = r.auto === "projects" ? String(PROJECTS.length) : r.v;

    if (r.copy){
      v.classList.add("v-copy");
      v.title = STRINGS.copyHint;
      v.setAttribute("role", "button");
      v.tabIndex = 0;
      const original = v.textContent;
      const fire = () => {
        copyText(r.copy).then(() => {
          v.textContent = STRINGS.copied;
          v.classList.add("v-ok");
          setTimeout(() => { v.textContent = original; v.classList.remove("v-ok"); }, 1200);
        }).catch(() => { location.href = "mailto:" + r.copy; });
      };
      v.addEventListener("click", fire);
      v.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " "){ e.preventDefault(); fire(); }
      });
    }

    row.append(k, v);
    wrap.appendChild(row);
  });
})();
