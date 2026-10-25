(function(){
  const POOL = PHOTOS;
  const slots = Array.from(document.querySelectorAll(".scatter .ph-in"));
  const FX = ["soft", "soft", "rise"];
  const showing = new Set();
  let order = POOL.map((_, i) => i).sort(() => Math.random() - .5);
  let cursor = 0;

  function nextIndex(){
    for (let tries = 0; tries < POOL.length * 2; tries++){
      if (cursor >= order.length){
        order = POOL.map((_, i) => i).sort(() => Math.random() - .5);
        cursor = 0;
      }
      const i = order[cursor++];
      if (!showing.has(i)) return i;
    }
    return -1;
  }

  function clearOld(slot, keep){
    Array.from(slot.querySelectorAll("img")).forEach(x => {
      if (x !== keep){ showing.delete(+x.dataset.i); x.remove(); }
    });
  }

  function show(slot, first){
    const i = nextIndex();
    if (i < 0) return;
    showing.add(i);
    const img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.draggable = false;
    img.dataset.i = i;
    img.onload = () => {
      if (first){
        img.className = "fx-fade";
        slot.appendChild(img);
        return;
      }
      const fx = FX[Math.floor(Math.random() * FX.length)];
      img.className = "fx-" + fx;
      slot.appendChild(img);
      setTimeout(() => clearOld(slot, img), 1700);
    };
    img.onerror = () => { showing.delete(i); img.remove(); };
    img.src = POOL[i];
  }

  function visible(slot){ return slot.offsetParent !== null; }

  function sync(){
    slots.forEach(slot => {
      if (!visible(slot)){ clearOld(slot, null); return; }
      if (!slot.querySelector("img")) show(slot, true);
    });
  }

  slots.forEach((slot, k) => {
    const loop = () => {
      setTimeout(() => {
        if (visible(slot) && !document.hidden && !slot.closest(".ph").matches(":hover")){
          show(slot, !slot.querySelector("img"));
        }
        loop();
      }, 7000 + Math.random() * 8000);
    };
    setTimeout(loop, 1500 + k * 700);
  });

  let rs;
  addEventListener("resize", () => { clearTimeout(rs); rs = setTimeout(sync, 250); });
  sync();
})();
