(function(){
  const el = document.getElementById("enter");
  if (!ENTER_SCREEN){ el.remove(); return; }
  const root = document.documentElement;
  const behind = Array.from(document.querySelectorAll("main,.fl.win,.scatter"));
  root.classList.add("gate", "locked");
  behind.forEach(n => n.inert = true);
  el.focus({ preventScroll: true });
  if (matchMedia("(pointer:coarse)").matches) { document.getElementById("enterText").textContent = STRINGS.enterCtaTouch; document.getElementById("enterRu").textContent = SITE.tag; }
  const go = () => {
    el.classList.add("out");
    root.classList.remove("locked");
    behind.forEach(n => n.inert = false);
    setTimeout(() => el.remove(), 700);
  };
  el.addEventListener("click", go);
  addEventListener("keydown", function k(e){
    if (!document.body.contains(el)) return removeEventListener("keydown", k);
    if (e.key === "Enter" || e.key === " "){ e.preventDefault(); go(); }
  });
})();
