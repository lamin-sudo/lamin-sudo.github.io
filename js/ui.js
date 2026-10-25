document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("dragstart", e => e.preventDefault());

(function(){
  const bar = document.querySelector(".win-bar");
  const box = document.querySelector(".win-box");
  bar.addEventListener("click", () => {
    if (matchMedia("(max-width:900px)").matches) box.classList.toggle("min");
  });
})();

(function(){
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const narrow = matchMedia("(max-width:900px)");
  const items = Array.from(document.querySelectorAll(".fl"));
  const reset = () => items.forEach(el => el.style.transform = "");
  if (narrow.addEventListener) narrow.addEventListener("change", reset);
  addEventListener("pointermove", e => {
    if (narrow.matches || e.pointerType === "touch") return;
    const nx = e.clientX / innerWidth - .5;
    const ny = e.clientY / innerHeight - .5;
    for (const el of items){
      const d = parseFloat(el.dataset.d || "1") * 26;
      el.style.transform = "translate3d(" + (-nx * d).toFixed(1) + "px," + (-ny * d).toFixed(1) + "px,0)";
    }
  });
})();
