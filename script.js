(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const low=/Mobi|Android/i.test(navigator.userAgent)||innerWidth<700;
let gl=false;
try{const c=document.createElement('canvas');gl=!!(window.THREE&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){}
if(!gl)document.body.classList.add('nogl');

/* cursor + mouse */
const mouse={x:0,y:0},cur=$('.cursor');
addEventListener('pointermove',e=>{
  mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight*2-1);
  cur.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;
});
document.addEventListener('pointerover',e=>{const on=e.target.closest('a,.chip,.pin');cur.style.width=cur.style.height=on?'30px':'14px';cur.style.marginLeft=cur.style.marginTop=on?'-8px':'0'});

/* nav stick */
const nav=$('#nav');addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>60),{passive:true});

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(el=>io.observe(el));

/* 3D tilt */
$$('.tilt').forEach(el=>{
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(900px) rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(20px)`});
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

/* parallax (mouse + scroll) via individual `translate` property */
const px=$$('[data-d]');
(function par(){requestAnimationFrame(par);px.forEach(el=>{const d=+el.dataset.d,r=el.getBoundingClientRect(),s=(r.top+r.height/2-innerHeight/2)*-.04;
  el.style.translate=`${mouse.x*d}px ${-mouse.y*d+s}px`})})();

/* magnetic button */
const mag=$('#mag');
addEventListener('pointermove',e=>{const r=mag.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
  const near=Math.hypot(dx,dy)<160;mag.style.translate=near?`${dx*.3}px ${dy*.3}px`:'0 0'});

/* CSS 3D carousel */
(()=>{
  const ring=$('#ring'),cards=$$('.pcard'),stage=$('#stage'),n=cards.length,R=low?230:380;
  cards.forEach((c,i)=>c.style.transform=`rotateY(${i*360/n}deg) translateZ(${R}px)`);
  let a=0,drag=false,lx=0,v=.18;
  stage.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;stage.style.cursor='grabbing'});
  addEventListener('pointerup',()=>{drag=false;stage.style.cursor='grab'});
  addEventListener('pointermove',e=>{if(drag){a+=(e.clientX-lx)*.4;lx=e.clientX}});
  (function f(){requestAnimationFrame(f);if(!drag)a+=v;ring.style.transform=`rotateY(${a}deg) rotateX(${-mouse.y*6}deg)`})();
})();

/* ---------- Three.js ---------- */
if(gl){
const scenes=[],clock=new THREE.Clock();
const mk=(id,fov,z)=>{
  const cv=$(id),r=new THREE.WebGLRenderer({canvas:cv,antialias:!low,alpha:true});
  r.setPixelRatio(Math.min(devicePixelRatio,low?1:2));
  const o={r,cv,s:new THREE.Scene(),c:new THREE.PerspectiveCamera(fov,1,.1,100),vis:true,tick(){}};
  o.c.position.z=z;
  const rs=()=>{const w=cv.clientWidth,h=cv.clientHeight;r.setSize(w,h,false);o.c.aspect=w/h;o.c.updateProjectionMatrix()};
  rs();addEventListener('resize',rs);
  new IntersectionObserver(e=>o.vis=e[0].isIntersecting).observe(cv);
  scenes.push(o);return o;
};

/* 1. HERO: morphing code crystal + reactive particle grid */
{
  const H=mk('#c-hero',60,8);H.c.position.y=1;H.c.lookAt(0,0,0);
  H.s.fog=new THREE.Fog(0x050510,8,20);
  const geo=new THREE.IcosahedronGeometry(1.6,low?1:2),base=geo.attributes.position.array.slice();
  const crystal=new THREE.Group();crystal.position.y=1.3;
  crystal.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x0a1a50,transparent:true,opacity:.5})));
  crystal.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x00f0ff,wireframe:true})));
  const inner=new THREE.Mesh(new THREE.OctahedronGeometry(.9),new THREE.MeshBasicMaterial({color:0xa855f7,wireframe:true}));
  crystal.add(inner);H.s.add(crystal);
  const N=low?22:46,sp=.5,inst=new THREE.InstancedMesh(new THREE.OctahedronGeometry(.045),new THREE.MeshBasicMaterial(),N*N),m=new THREE.Matrix4(),col=new THREE.Color();
  for(let i=0;i<N*N;i++){col.setHSL(.5+(i%N)/N*.2,1,.6);inst.setColorAt(i,col)}
  H.s.add(inst);
  H.tick=t=>{
    const p=geo.attributes.position.array;
    for(let i=0;i<p.length;i+=3){const k=1+.18*Math.sin(base[i]*2.2+t*1.6)*Math.cos(base[i+1]*2.2+t*1.2)+.1*Math.sin(base[i+2]*3+t*2);p[i]=base[i]*k;p[i+1]=base[i+1]*k;p[i+2]=base[i+2]*k}
    geo.attributes.position.needsUpdate=true;
    crystal.rotation.y=t*.4+mouse.x*.6;crystal.rotation.x=t*.2-mouse.y*.4;crystal.position.y=1.3+Math.sin(t)*.15;
    inner.rotation.y=-t*.9;inner.rotation.z=t*.6;
    const mx=mouse.x*9,mz=-mouse.y*5+1;let i=0;
    for(let x=0;x<N;x++)for(let z=0;z<N;z++){
      const X=(x-N/2)*sp,Z=(z-N/2)*sp-2,d=Math.hypot(X-mx,Z-mz);
      const y=-2.4+Math.sin(X*.7+t*1.5)*.2+Math.cos(Z*.7+t)*.2+Math.max(0,2-d)*.7;
      m.makeTranslation(X,y,Z);inst.setMatrixAt(i++,m);
    }
    inst.instanceMatrix.needsUpdate=true;
  };
}

/* 2. SKILLS: sphere with orbiting clickable labels */
{
  const S=mk('#c-skills',50,7),g=new THREE.Group();S.s.add(g);
  g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.4,2),new THREE.MeshBasicMaterial({color:0xa855f7,wireframe:true,transparent:true,opacity:.6})));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(1.2,24,24),new THREE.MeshBasicMaterial({color:0x0a0a30})));
  const halo=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(Array.from({length:600},()=>(Math.random()-.5)*10)),3)),new THREE.PointsMaterial({color:0x00f0ff,size:.03}));
  S.s.add(halo);
  const info={'JavaScript':'The language of the web — my main tool and focus of learning.','React':'Building component-driven interfaces. Currently learning.','Node.js':'JavaScript on the server: APIs and tooling. Currently learning.','Databases':'Modeling, querying and storing data reliably.','Git':'Version control and clean collaboration workflows.','Web Dev':'HTML, CSS and JS crafted into fast, immersive sites.'};
  const tex=(t,on)=>{const c=document.createElement('canvas');c.width=320;c.height=80;const x=c.getContext('2d');
    x.font='700 40px Space Grotesk,sans-serif';x.textAlign='center';x.textBaseline='middle';
    x.shadowColor=on?'#fff':'#00f0ff';x.shadowBlur=on?30:12;x.fillStyle=on?'#fff':'#00f0ff';x.fillText(t,160,40);return new THREE.CanvasTexture(c)};
  const names=Object.keys(info),sprites=names.map((n,i)=>{
    const y=1-(i/(names.length-1))*2,r=Math.sqrt(1-y*y),th=i*2.4,a=tex(n,false),b=tex(n,true);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:a,transparent:true}));
    s.position.set(Math.cos(th)*r*2.9,y*2.4,Math.sin(th)*r*2.9);s.scale.set(2.4,.6,1);s.userData={n,a,b};g.add(s);return s});
  let act=null;const ray=new THREE.Raycaster(),v=new THREE.Vector2(),box=$('#skill-info');
  S.cv.addEventListener('click',e=>{const r=S.cv.getBoundingClientRect();v.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);
    ray.setFromCamera(v,S.c);const h=ray.intersectObjects(sprites)[0];if(!h)return;
    sprites.forEach(s=>{s.material.map=s.userData.a;s.scale.set(2.4,.6,1)});act=h.object;act.material.map=act.userData.b;act.scale.set(3.2,.8,1);
    box.innerHTML=`<h3>${act.userData.n}</h3><p>${info[act.userData.n]}</p>`});
  S.tick=t=>{g.rotation.y=t*.3;g.rotation.x=-mouse.y*.3;g.rotation.z=mouse.x*.15;halo.rotation.y=-t*.05};
}

/* 3. CONTACT: portal tunnel of rings */
{
  const P=mk('#c-portal',70,5),rings=[];
  for(let i=0;i<16;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(2.2,.035,8,low?32:80),new THREE.MeshBasicMaterial({color:i%2?0x00f0ff:0xa855f7,transparent:true}));m.position.z=-i*2.5;P.s.add(m);rings.push(m)}
  P.tick=t=>{rings.forEach((m,i)=>{m.position.z+=.04;if(m.position.z>4)m.position.z-=40;
    const d=(m.position.z+36)/40;m.material.opacity=Math.max(0,Math.min(1,d*1.2))*(m.position.z>3?(4-m.position.z):1);
    m.rotation.z=t*.3*(i%2?1:-1);m.scale.setScalar(1+Math.sin(t*2+i)*.04)});
    P.c.position.x+=(mouse.x*1.2-P.c.position.x)*.05;P.c.position.y+=(mouse.y*.8-P.c.position.y)*.05};
}

/* loop (30fps cap on mobile) */
let last=0;
(function loop(now){requestAnimationFrame(loop);if(low&&now-last<33)return;last=now;
  const t=clock.getElapsedTime();scenes.forEach(o=>{if(o.vis){o.tick(t);o.r.render(o.s,o.c)}})})(0);

/* cleanup */
addEventListener('beforeunload',()=>scenes.forEach(o=>{
  o.s.traverse(n=>{if(n.geometry)n.geometry.dispose();if(n.material){if(n.material.map)n.material.map.dispose();n.material.dispose()}});
  o.r.dispose()}));
}
})();
