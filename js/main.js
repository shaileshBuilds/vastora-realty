const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* monochrome SVG "photography" generator, doubles as image fallback */
function art(k,v=0,w=800,h=600){
const g=['#dbe4ff','#d3f3f0','#ece4ff'][v%3],d=['#1b2340','#14323a','#2a2150'][v%3];let s='';
const win=(x,y,ww,hh,c='#f5f5f5')=>`<rect x="${x}" y="${y}" width="${ww}" height="${hh}" fill="${c}"/>`;
s+=`<rect width="${w}" height="${h}" fill="${g}"/><circle cx="${620-v*90}" cy="120" r="46" fill="#fff" opacity=".85"/><rect y="460" width="${w}" height="140" fill="#8d9bbd"/>`;
if(k=="villa"){s+=`<rect x="110" y="300" width="360" height="170" fill="${d}"/><rect x="70" y="270" width="300" height="24" fill="#555"/><rect x="340" y="220" width="320" height="250" fill="#f1f1f1"/><rect x="310" y="200" width="380" height="22" fill="${d}"/>`+win(140,330,120,100,'#777')+win(380,250,230,160,'#555')+win(600,330,40,140,'#999')+`<rect x="40" y="470" width="720" height="14" fill="#e8e8e8"/><rect x="480" y="486" width="240" height="60" fill="#7a7a7a"/>`}
else if(k=="tower"){for(let i=0;i<3;i++){const x=120+i*180,t=90+i*40-(v*20);s+=`<rect x="${x}" y="${t}" width="150" height="${470-t}" fill="${i==1?'#f1f1f1':d}"/>`;for(let r=0;r<(470-t)/44-1;r++)for(let c=0;c<3;c++)s+=win(x+14+c*44,t+16+r*44,30,28,i==1?'#999':'#666')}}
else if(k=="office"){s+=`<rect x="90" y="190" width="620" height="280" fill="${d}"/><rect x="70" y="170" width="660" height="20" fill="#555"/>`;for(let r=0;r<3;r++)for(let c=0;c<7;c++)s+=win(110+c*84,210+r*80,70,62,'#888');s+=win(370,410,70,60,'#f5f5f5')}
else{s+=`<path d="M0 420 Q200 360 400 400 T800 380 V460 H0z" fill="#a9b7d6"/>`;for(let i=0;i<9;i++)s+=`<rect x="${80+i*76}" y="${400-i%3*6}" width="3" height="70" fill="${d}"/>`;s+=`<rect x="80" y="420" width="610" height="3" fill="${d}"/><rect x="330" y="300" width="120" height="70" fill="#fff"/><rect x="380" y="370" width="4" height="60" fill="${d}"/><circle cx="160" cy="400" r="30" fill="#777"/><rect x="157" y="420" width="6" height="50" fill="#555"/>`}
return 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">${s}</svg>`)}
const pick=(k,v)=>{const a=IMG.props[k];return a[v%a.length]};
const img=(k,v,alt,src)=>`<img loading="lazy" src="${src||pick(k,v)}" alt="${alt}" onerror="this.onerror=null;this.src='${IMG.fb}'">`;
const fmt=p=>p.mode=="Rent"?`$${p.price.toLocaleString()}<small style="color:var(--mid)"> /mo</small>`:`$${p.price.toLocaleString()}`;

let favs=[];try{favs=JSON.parse(localStorage.getItem("estora-fav")||"[]")}catch(e){}
const saveFav=()=>{try{localStorage.setItem("estora-fav",JSON.stringify(favs))}catch(e){}};
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2600)};

/* state + filters */
const F={mode:"All",cat:"All",loc:"All",price:"0",shown:6};
const LOCS=[...new Set(PROPS.map(p=>p.loc))];
$("#sl").innerHTML=`<option value="All">All locations</option>`+LOCS.map(l=>`<option>${l}</option>`).join("");
$("#st").innerHTML=`<option value="All">All types</option>`+CATS.map(c=>`<option>${c}</option>`).join("");
const inRange=(p,r)=>r=="0"||(r=="1"&&p.mode=="Rent"&&p.price<1000)||(r=="2"&&p.price>=1000&&p.price<500000)||(r=="3"&&p.price>=500000&&p.price<1500000)||(r=="4"&&p.price>=1500000);
function card(p){return `<article class="card rv in"><div class="ph"><a href="#/p/${p.id}" aria-label="View ${p.name}" style="display:block;height:100%">${img(p.k,p.id,p.name+" (sample image)")}</a><span class="tag">For ${p.mode}</span>
<button class="fav ${favs.includes(p.id)?'on':''}" data-f="${p.id}" aria-pressed="${favs.includes(p.id)}" aria-label="Save ${p.name}"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.800-8 11-8 11z"/></svg></button></div>
<div style="padding:20px"><div class="lbl">${p.loc} · ${p.cat}</div><h3 style="font-size:26px;margin:6px 0">${p.name}</h3><div style="font-size:18px;font-weight:400">${fmt(p)}</div>
<div class="meta"><span>${p.bed||"—"} bd</span><span>${p.bath||"—"} ba</span><span>${p.area.toLocaleString()} sqft</span></div>
<a href="#/p/${p.id}" class="lbl" style="color:var(--ink);display:inline-block;margin-top:16px;border-bottom:1px solid var(--ink);padding-bottom:3px;text-decoration:none">View Property →</a></div></article>`}
function render(){
const list=PROPS.filter(p=>(F.mode=="All"||p.mode==F.mode)&&(F.cat=="All"||p.cat==F.cat)&&(F.loc=="All"||p.loc==F.loc)&&inRange(p,F.price));
$("#grid").innerHTML=list.slice(0,F.shown).map(card).join("");
$("#none").style.display=list.length?"none":"block";$("#more").style.display=list.length>F.shown?"inline-block":"none";
$("#chips").innerHTML=["All",...CATS].map(c=>`<button class="chip ${F.cat==c?'on':''}" data-c="${c}">${c}</button>`).join("");
$("#modes").innerHTML=["All","Sale","Rent"].map(m=>`<button class="chip ${F.mode==m?'on':''}" data-m="${m}">${m=="All"?"All":"For "+m}</button>`).join("");
$("#sl").value=F.loc;$("#st").value=F.cat;$("#sp").value=F.price}
document.addEventListener("click",e=>{
const f=e.target.closest("[data-f]");if(f){const id=+f.dataset.f;favs=favs.includes(id)?favs.filter(x=>x!=id):[...favs,id];saveFav();$$(`[data-f="${id}"]`).forEach(b=>{b.classList.toggle("on",favs.includes(id));b.setAttribute("aria-pressed",favs.includes(id))});toast(favs.includes(id)?"Saved to favourites":"Removed from favourites");return}
const c=e.target.closest("[data-c]");if(c){F.cat=c.dataset.c;F.shown=6;render()}
const m=e.target.closest("[data-m]");if(m){F.mode=m.dataset.m;F.shown=6;render()}
const t=e.target.closest("[data-t]");if(t){F.cat=t.dataset.t;F.shown=6;render();location.hash="#listings";if(!inDetail())$("#listings").scrollIntoView()}
const nm=e.target.closest("a[data-mode]");if(nm){F.mode=nm.dataset.mode;F.shown=6;render()}
if(e.target.closest("a[data-sell]"))$("#cm").value="I'd like to sell my property. Details: ";
if(e.target.closest("[data-ph]")){e.preventDefault();toast("Social link is a placeholder")}
const fc=e.target.closest("[data-fc]");if(fc){F.cat=fc.dataset.fc;F.shown=6;render()}
if(e.target.closest("#mob a"))closeMenu()});
const inDetail=()=>$("#detail").style.display!="none";
$("#more").onclick=()=>{F.shown+=6;render()};
$("#sf").onsubmit=e=>{e.preventDefault();F.loc=$("#sl").value;F.cat=$("#st").value;F.price=$("#sp").value;F.mode="All";F.shown=6;render();$("#listings").scrollIntoView();};

/* categories, why, footer cats */
$("#tiles").innerHTML=CATS.map((c,i)=>`<button class="tile rv ${i<2?"lg:col-span-3 col-span-2":"lg:col-span-2"}" data-t="${c}">${img(0,0,c,IMG.cat[i])}<span>${c}</span></button>`).join("");
$("#fc").innerHTML=CATS.map(c=>`<a href="#listings" data-fc="${c}">${c}</a>`).join("");
$("#why").innerHTML=WHY.map((w,i)=>`<div class="rv" style="background:#fff;border:1px solid var(--line);padding:32px"><img class="wi" src="${IMG.why[i]}" alt=""><h3 style="font-size:24px;margin:0 0 8px">${w[0]}</h3><p style="color:var(--mid);font-size:14px;line-height:1.7;margin:0">Straightforward standards applied to every listing and every conversation.</p></div>`).join("");
$("#himg").innerHTML=IMG.hero.map((s,i)=>`<img src="${s}" alt="" class="${i?'':'on'}">`).join("");
let hi=0;setInterval(()=>{const a=$$("#himg img");a[hi].classList.remove("on");hi=(hi+1)%a.length;a[hi].classList.add("on")},6500);$("#aimg").src=IMG.about[0];$("#aimg").onerror=function(){this.onerror=null;this.src=IMG.fb};

/* testimonials */
let ti=0,tm;function showT(i){ti=(i+TEST.length)%TEST.length;const t=TEST[ti];
$("#ts").innerHTML=`<img class="tp" src="${IMG.ts[ti%4]}" alt="${t[0]}"><p class="serif" style="font-size:clamp(24px,3.4vw,36px);line-height:1.35;margin:0 0 24px;animation:up .7s">“${t[1]}”</p><div class="lbl">${t[0]}</div>`;
$("#td").innerHTML=TEST.map((_,j)=>`<i style="width:7px;height:7px;background:${j==ti?'var(--acc)':'var(--line)'};display:block"></i>`).join("")}
const autoT=()=>{clearInterval(tm);tm=setInterval(()=>showT(ti+1),6000)};
$("#tp").onclick=()=>{showT(ti-1);autoT()};$("#tn").onclick=()=>{showT(ti+1);autoT()};showT(0);autoT();

/* forms */
const bad=(el,msg)=>{el.classList.toggle("bad",!!msg);el.nextElementSibling.textContent=msg;return !msg};
function val(form){let ok=true;const v=id=>$(id,form);
ok&=bad(v("#cn")||v("#cn"),v("#cn").value.trim().length<2?"Please enter your full name.":"");
ok&=bad(v("#ce"),/^\S+@\S+\.\S+$/.test(v("#ce").value)?"":"Please enter a valid email.");
ok&=bad(v("#cp"),/^[+\d][\d\s\-()]{6,}$/.test(v("#cp").value.trim())?"":"Please enter a valid phone number.");
ok&=bad(v("#cm"),v("#cm").value.trim().length<10?"Message must be at least 10 characters.":"");return !!ok}
$("#cf").onsubmit=e=>{e.preventDefault();if(val(e.target)){toast("Thanks! (Demo: no backend connected, nothing was sent)");e.target.reset()}else toast("Please fix the highlighted fields")};
$("#nf").onsubmit=e=>{e.preventDefault();/^\S+@\S+\.\S+$/.test($("#nm").value)?(toast("Subscribed (demo only)"),e.target.reset()):toast("Enter a valid email")};

/* header, menu */
const closeMenu=()=>{$("#mob").classList.remove("open");$("#bg").classList.remove("x");$("#bg").setAttribute("aria-expanded","false")};
$("#bg").onclick=()=>{const o=$("#mob").classList.toggle("open");$("#bg").classList.toggle("x",o);$("#bg").setAttribute("aria-expanded",o)};
addEventListener("scroll",()=>{$("#hd").classList.toggle("sc",scrollY>20);const h=$("#himg");if(scrollY<900&&!inDetail())h.style.transform=`translateY(${scrollY*.18}px)`},{passive:true});

/* reveal + counters */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;en.target.classList.add("in");
if(en.target.dataset.n){const n=+en.target.dataset.n,t0=performance.now();(function s(t){const p=Math.min((t-t0)/1600,1);en.target.textContent=Math.round(n*(1-Math.pow(1-p,3)))+"+";p<1&&requestAnimationFrame(s)})(t0)}
io.unobserve(en.target)}),{threshold:.15});
const watch=()=>$$(".rv:not(.in),[data-n]").forEach(el=>io.observe(el));

/* detail page */
function detail(id){const p=PROPS.find(x=>x.id==id);if(!p){location.hash="#top";return}
const sim=PROPS.filter(x=>x.id!=p.id&&(x.cat==p.cat||x.loc==p.loc)).slice(0,3);
$("#detail").innerHTML=`<div class="wrap" style="padding-top:32px;padding-bottom:80px"><a href="#listings" class="lbl" style="color:var(--ink);text-decoration:none">← Back to properties</a>
<div class="gal" style="margin-top:20px"><div class="ph">${img(p.k,p.id,p.name+" main view")}</div><div class="ph">${img(p.k,0,p.name+" interior",IMG.int[p.id%7])}</div><div class="ph">${img(p.k,0,p.name+" interior 2",IMG.int[(p.id+3)%7])}</div></div>
<div class="grid lg:grid-cols-3 gap-12" style="margin-top:44px"><div class="lg:col-span-2">
<div class="lbl">${p.cat} · For ${p.mode}</div><h1 style="font-size:clamp(40px,6vw,72px);margin:8px 0">${p.name}</h1>
<div class="lbl" style="margin-bottom:20px">${p.loc} — sample address</div><div class="serif" style="font-size:36px;margin-bottom:28px">${fmt(p)}</div>
<div class="spec"><div><span class="lbl">Bedrooms</span><b>${p.bed||"—"}</b></div><div><span class="lbl">Bathrooms</span><b>${p.bath||"—"}</b></div><div><span class="lbl">Area</span><b>${p.area.toLocaleString()} sqft</b></div><div><span class="lbl">Type</span><b>${p.cat.split(" ")[0]}</b></div></div>
<h2 style="font-size:32px;margin:40px 0 12px">Overview</h2><p style="color:var(--mid);line-height:1.85">A sample description for ${p.name}. Light-filled interiors, considered materials and a calm, minimal layout define this ${p.cat.toLowerCase()} listing in ${p.loc}. Replace with the verified property description.</p>
<h2 style="font-size:32px;margin:40px 0 12px">Amenities</h2><ul style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0;list-style:none;font-size:14px">${AMEN.map(a=>`<li style="border-bottom:1px solid var(--line);padding:10px 0">— ${a}</li>`).join("")}</ul>
<h2 style="font-size:32px;margin:40px 0 12px">Location</h2><div class="mp"><img src="${IMG.map}" alt="Map location" onerror="this.onerror=null;this.src='${IMG.fb}'"><i></i></div>
<p class="lbl" style="margin-top:8px;text-transform:none;letter-spacing:.02em">Map placeholder — embed a real map before launch.</p></div>
<aside><form id="af" novalidate style="border:1px solid var(--line);padding:28px;display:grid;gap:14px;position:sticky;top:96px"><h3 style="font-size:26px;margin:0">Contact agent</h3>
<div><label for="cn">Full name</label><input id="cn"><div class="err"></div></div><div><label for="ce">Email</label><input id="ce" type="email"><div class="err"></div></div><div><label for="cp">Phone</label><input id="cp" type="tel"><div class="err"></div></div><div><label for="cm">Message</label><textarea id="cm" rows="3">I'm interested in ${p.name}.</textarea><div class="err"></div></div><button class="btn">Request Details</button></form></aside></div>
<h2 style="font-size:36px;margin:72px 0 24px">Similar properties</h2><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${sim.map(card).join("")}</div></div>`;
$("#af").onsubmit=e=>{e.preventDefault();val(e.target)?(toast("Enquiry validated (demo — not sent)"),e.target.reset()):toast("Please fix the highlighted fields")}}

/* router */
function route(){const h=location.hash;
if(h.startsWith("#/p/")){$("#home").style.display="none";$("#detail").style.display="block";detail(h.slice(4));scrollTo(0,0);document.title="Estora Realty — Property"}
else{const was=inDetail();$("#detail").style.display="none";$("#home").style.display="block";document.title="ESTORA REALTY — Find Your Place";
const el=h.length>1&&document.getElementById(h.slice(1));if(el)was?setTimeout(()=>el.scrollIntoView(),30):0;else if(was)scrollTo(0,0);watch()}}
const $m=n=>(n).toLocaleString("en-US",{maximumFractionDigits:0});
$("#mq").innerHTML=[0,1].map(()=>["Luxury Homes","Modern Apartments","Villas","Commercial Spaces","Residential Plots"].map(c=>`<span>${c}</span><span><i>✦</i></span>`).join("")).join("");
$("#steps").innerHTML=[["Search","Filter by location, type and budget to shortlist homes."],["Visit","Book a guided viewing in person or by video."],["Negotiate","Our agents handle offers with clear, honest pricing."],["Move in","Paperwork, handover and keys — without the stress."]].map((x,i)=>`<div class="st rv"><b>0${i+1}</b><h3 style="font-size:26px;margin:8px 0">${x[0]}</h3><p style="color:var(--mid);font-size:14px;line-height:1.7;margin:0">${x[1]}</p></div>`).join("");
$("#ag").innerHTML=[["Aarav Mehta","Luxury Homes","AM"],["Sofia Reyes","Villas & Plots","SR"],["Daniel Kim","Apartments","DK"],["Priya Nair","Commercial","PN"]].map((a,i)=>`<div class="ag rv"><img class="av" src="${IMG.ag[i]}" alt="${a[0]}"><h3 style="font-size:24px;margin:0">${a[0]}</h3><div class="lbl" style="margin:6px 0 14px">${a[1]}</div><a href="#contact" class="lbl" style="color:var(--acc);text-decoration:none">Contact →</a></div>`).join("");
$("#faq").innerHTML=[["Are these listings real?","No — all properties, prices and people on this demo site are sample content. Replace them with verified data before launch."],["How do I book a viewing?","Use the contact form or any property page's Contact agent form. (Demo: forms don't send data yet.)"],["Can I save properties?","Yes. Tap the heart on any card — favourites are stored in your browser."],["Do you help with selling?","Yes. Choose Sell in the menu and tell us about your property."]].map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("");
function calc(){const P=+$("#kp").value,d=+$("#kd").value,r=+$("#kr").value,y=+$("#ky").value,L=P*(1-d/100),i=r/1200,n=y*12,m=i?L*i/(1-Math.pow(1+i,-n)):L/n;
$("#kpv").textContent="$"+$m(P);$("#kdv").textContent=d+"% ($"+$m(P*d/100)+")";$("#krv").textContent=r+"%";$("#kyv").textContent=y+" years";
$("#kout").textContent="$"+$m(m);$("#ksub").innerHTML=`Loan amount: $${$m(L)}<br>Total repayment: $${$m(m*n)}<br>Total interest: $${$m(m*n-L)}`}
["kp","kd","kr","ky"].forEach(id=>$("#"+id).addEventListener("input",calc));calc();
addEventListener("scroll",()=>{const h=document.documentElement;$("#pb").style.width=(scrollY/Math.max(1,h.scrollHeight-innerHeight)*100)+"%";$("#up").classList.toggle("show",scrollY>700)},{passive:true});
$("#up").onclick=()=>scrollTo({top:0,behavior:"smooth"});
$("#blog").innerHTML=[["Guide","Buying your first home: a simple checklist"],["Advice","Rent or buy? How to decide in 2026"],["Style","Staging a home that sells faster"],["Land","What to check before buying a plot"]].map((b,i)=>`<article class="bl rv"><div class="ph"><img loading="lazy" src="${IMG.blog[i]}" alt="${b[1]}" onerror="this.onerror=null;this.src='${IMG.fb}'"></div><div style="padding:22px"><div class="lbl">${b[0]} · sample</div><h3 style="font-size:24px;line-height:1.2;margin:8px 0 14px">${b[1]}</h3><a href="#contact" class="lbl" style="color:var(--acc);text-decoration:none">Read more →</a></div></article>`).join("");
const root=document.documentElement;
function setTheme(t){root.dataset.theme=t;try{localStorage.setItem("estora-theme",t)}catch(e){}$("#tg").textContent=t=="dark"?"☀ Day":"🌙 Night";$("#tg").setAttribute("aria-pressed",t=="dark")}
let _t=null;try{_t=localStorage.getItem("estora-theme")}catch(e){}
setTheme(_t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));
$("#tg").onclick=()=>setTheme(root.dataset.theme=="dark"?"light":"dark");
addEventListener("hashchange",route);render();route();watch();
