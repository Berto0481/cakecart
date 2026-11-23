/* CakeCart: pick cakes → combined shopping list with whole-package prices */
const CARAMEL = "Caramel Sauce", CARAMEL_YIELD = 236;

// Card text, category and slice colours: [description, category, tile bg, top, filling, crust, garnish]
const META = {
  "Apple Pie Cheesecake":["Spiced apples and an oat crumble","Cheesecakes","#FBEBD9","#C98A4B","#F5DFA9","#B9783F"],
  "Blueberry Cheesecake":["Blueberries baked in, blueberry topping","Cheesecakes","#ECE8F7","#4A3A8C","#F8E8C4","#C08548","#6A59B8"],
  "Cheesecake Brownies":["Fudgy brownies with a cheesecake layer","Brownies","#F3E6DE","#F8EBCF","#5A3424","#3D2117"],
  "Chocolate Cheesecake":["Dark chocolate on an Oreo crust","Cheesecakes","#F1E4DE","#4A2A1F","#7A4A35","#2B1B16"],
  "Cinnamon Roll Cheesecake":["Cinnamon swirl, glaze and whipped cream","Cheesecakes","#FBEBD9","#FFF6E8","#F4D8A8","#B9783F","#A0612F"],
  "Key Lime Cheesecake":["Tangy key lime curd on top","Cheesecakes","#EEF5DC","#C9E08A","#F3F0C4","#C08548","#7FB13A"],
  "New York Cheesecake":["Tall and classic, sour cream topping","Cheesecakes","#FBF0DC","#FFF8EC","#F8E7B9","#C08548"],
  "Oreo Cheesecake":["Cookies and cream with ganache","Cheesecakes","#EFEDEB","#3A2B2B","#F2EFEA","#2B2222","#3A2B2B"],
  "Peanut Butter Cheesecake":["Peanut butter, Oreo crust, ganache","Cheesecakes","#F7E8D5","#4A2A1F","#E7B979","#2B2222"],
  "Pumpkin Cheesecake":["Pumpkin spice with cinnamon cream","Cheesecakes","#FCE6D5","#FFF6E8","#E9944A","#C08548"],
  "Raspberry Cheesecake":["Swirled with raspberry sauce","Cheesecakes","#FBE3EA","#D23C64","#F8E7C8","#C08548","#C8324F"],
  "Regular Cheesecake":["The classic, graham cracker crust","Cheesecakes","#FBF0DC","#FFF8EC","#F8E7B0","#C08548"],
  "Salted Caramel Cheesecake":["Caramel swirl and flaky sea salt","Cheesecakes","#FBEAD6","#C77B30","#F6E2B3","#B9783F"],
  "Strawberry Cheesecake":["Fresh strawberry sauce on top","Cheesecakes","#FCE4E6","#E0485F","#F8E7C8","#C08548","#E0485F"],
  "Turtle Cheesecake":["Caramel, chocolate and pecans","Cheesecakes","#F5E6D8","#8A4F22","#F4DDB0","#3D2117","#6B3F1E"]
};
const cakes = Object.keys(D.recipes).filter(n => n !== CARAMEL).sort();
const short = n => n.replace(/ Cheesecake$/,"");

const AISLE = {
 "Dairy & eggs":["Cream cheese (brick)","Eggs (large)","Butter","Sour cream","Heavy cream","Milk"],
 "Produce":["Strawberries","Blueberries","Raspberries","Apples","Lemon juice","Key lime juice"],
 "Baking aisle":["Graham cracker crumbs","Sugar (white)","Brown sugar","Powdered sugar","Flour (all-purpose)","Cornstarch","Baking soda","Cocoa powder (unsweetened)","Semisweet/dark chocolate","Chocolate chips (semisweet)","Vanilla extract","Light corn syrup","Pumpkin puree","Old fashioned oats","Pecans","Walnuts"],
 "Cookies, spreads & coffee":["Oreo cookies","Peanut butter (creamy)","Instant coffee"],
 "Spices":["Ground cinnamon","Pumpkin pie spice","Salt","Flaky sea salt"]
};
const PANTRY = new Set(["Salt","Flour (all-purpose)","Cornstarch","Ground cinnamon","Vanilla extract","Sugar (white)","Milk","Baking soda","Pumpkin pie spice","Flaky sea salt","Instant coffee"]);
const LABEL = {"Lemon juice":"Lemons","Key lime juice":"Key limes / key lime juice","Eggs (large)":"Eggs, large","Cream cheese (brick)":"Cream cheese","Graham cracker crumbs":"Graham crackers"};
const TSP = {"Ground cinnamon":2.6,"Pumpkin pie spice":2.6,"Salt":6,"Baking soda":4.8,"Instant coffee":2,"Cornstarch":2.7,"Flaky sea salt":2};
const label = n => LABEL[n] || n;
const r1 = x => Math.round(x*10)/10, ceil = Math.ceil;
const money = x => "$" + x.toFixed(2);
const oz = g => g >= 454 ? `${r1(g/453.6)} lb` : `${Math.round(g/28.35)} oz`;

// What you need, in kitchen terms
function need(n, v){
  const u = D.units[n] || "";
  switch(n){
    case "Eggs (large)": return `${ceil(v)} eggs`;
    case "Cream cheese (brick)": return `${ceil(v/226.8-0.02)} bricks (8 oz)`;
    case "Butter": return `${r1(v/113.4)} sticks · ${Math.round(v)} g`;
    case "Oreo cookies": return `${ceil(v)} cookies`;
    case "Lemon juice": return `${r1(v/14.8)} Tbsp juice (≈ ${ceil(v/30)} lemon${ceil(v/30)>1?"s":""})`;
    case "Key lime juice": return `${r1(v/236.6)} cups juice`;
    case "Vanilla extract": case "Light corn syrup": case "Milk":
      return v < 15 ? `${r1(v/4.93)} tsp` : `${r1(v/14.8)} Tbsp`;
    case "Heavy cream": return `${r1(v/236.6)} cups · ${Math.round(v)} ml`;
  }
  if (TSP[n]) { const t = v/TSP[n]; return t >= 3 ? `${r1(t/3)} Tbsp` : `${r1(t)} tsp`; }
  if (u === "g") return `${v>=100?Math.round(v):r1(v)} g · ${oz(v)}`;
  if (u === "ml") return `${Math.round(v)} ml · ${r1(v/236.6)} cups`;
  return `${r1(v)} ${u}`;
}
// Whole packages, at your store price
function buy(n, v){
  const p = D.pkgs[n]; if(!p) return null;
  const [size, price, lab] = p;
  const packs = Math.max(1, ceil(v/size - 0.03));
  return {packs, cost: packs*price, price, lab};
}

// ---------- state ----------
const store = {
  get(k, d){ try { return JSON.parse(localStorage.getItem("cakecart-"+k)) ?? d; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem("cakecart-"+k, JSON.stringify(v)); } catch(e){} }
};
let qty = store.get("qty", {}), checked = store.get("checked", {}), have = store.get("have", {});
let cat = "All", query = "", filter = "all", pquery = "";
const save = () => { store.set("qty", qty); store.set("checked", checked); store.set("have", have); };
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

// ---------- cakes screen ----------
function slice(m){
  const [, , , top, fill, crust, garnish] = m;
  return `<svg viewBox="0 0 64 64">
    <path d="M8 27 L25 13 L57 31 Z" fill="${top}" stroke="rgba(0,0,0,.08)"/>
    <path d="M8 27 L57 31 L57 37 L8 33 Z" fill="${top}" filter="brightness(.92)"/>
    <path d="M8 33 L57 37 L57 49 L8 45 Z" fill="${fill}"/>
    <path d="M8 45 L57 49 L57 55 L8 51 Z" fill="${crust}"/>
    <path d="M8 27 L57 31 L57 55 L8 51 Z" fill="none" stroke="rgba(0,0,0,.10)"/>
    ${garnish ? `<circle cx="30" cy="20" r="6" fill="${garnish}"/><circle cx="28" cy="18" r="1.6" fill="rgba(255,255,255,.55)"/>` : ""}
  </svg>`;
}
function renderCats(){
  const cats = ["All","Cheesecakes","Brownies","Selected"];
  $("#cats").innerHTML = cats.map(c => `<button class="chip ${c===cat?"on":""}" data-c="${c}">${c}</button>`).join("");
  $("#cats").querySelectorAll(".chip").forEach(b => b.onclick = () => { cat = b.dataset.c; renderCats(); renderCakes(); });
}
function renderCakes(){
  const q = query.trim().toLowerCase();
  const list = cakes.filter(n => (cat==="All" || (cat==="Selected" ? qty[n] : META[n]?.[1]===cat)) && (!q || n.toLowerCase().includes(q) || (META[n]?.[0]||"").toLowerCase().includes(q)));
  const el = $("#cakeList");
  if (!list.length) { el.innerHTML = `<div class="empty">${cat==="Selected"?"No cakes picked yet.":"No cakes match that search."}</div>`; return; }
  el.innerHTML = list.map(n => {
    const m = META[n] || ["", "Other", "#F6EEE6", "#FFF8EC", "#F8E7B0", "#C08548"], k = qty[n] || 0;
    return `<div class="cake ${k?"sel":""}" data-n="${esc(n)}">
      <div class="thumb" style="background:${m[2]}">${slice(m)}</div>
      <div class="cinfo"><h3>${esc(n)}</h3><p>${esc(m[0])}${/Brownies/.test(n)?" · per 9×13 pan":""}</p></div>
      <div class="stepper">
        <button class="minus" aria-label="One less" ${k?"":"disabled"}><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
        <output>${k}</output>
        <button class="plus" aria-label="One more"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
      </div></div>`;
  }).join("");
  el.querySelectorAll(".cake").forEach(row => {
    const n = row.dataset.n;
    row.querySelector(".plus").onclick = () => setQty(n, (qty[n]||0)+1);
    row.querySelector(".minus").onclick = () => setQty(n, (qty[n]||0)-1);
  });
}
function setQty(n, k){
  if (k > 0) qty[n] = k; else delete qty[n];
  checked = {}; save(); renderCakes(); updateChrome();
}
function totalCakes(){ return Object.values(qty).reduce((a,b)=>a+b,0); }
function updateChrome(){
  const t = totalCakes();
  $("#cta").classList.toggle("hide", !t);
  $("#ctaText").textContent = t ? `Make shopping list · ${t} selected` : "Make shopping list";
  const b = $("#listBadge"); b.textContent = t; b.classList.toggle("show", !!t);
}

// ---------- shopping list ----------
function compute(){
  const tot = {}, used = {}; let caramel = 0;
  const add = (i, v, c) => { tot[i] = (tot[i]||0) + v; (used[i] = used[i] || new Set()).add(c); };
  for (const [c, k] of Object.entries(qty)) for (const [i, a] of D.recipes[c] || []) {
    if (i === "Caramel sauce") { caramel += a*k; continue; }
    add(i, a*k, short(c));
  }
  if (caramel) for (const [i, a] of D.recipes[CARAMEL]) add(i, a*caramel/CARAMEL_YIELD, "Caramel sauce");
  return {tot, used, caramel};
}
function renderList(){
  const body = $("#listBody"), t = totalCakes();
  if (!t) {
    body.innerHTML = `<div class="card empty" style="padding:36px 20px">Pick some cakes first.<br><br><button class="chip on" data-go="cakes">Choose cakes</button></div>`;
    body.querySelector("[data-go]").onclick = () => go("cakes");
    $("#totalbar").style.display = "none"; return;
  }
  $("#totalbar").style.display = "";
  const {tot, used, caramel} = compute();
  const names = Object.keys(tot);
  const toBuy = names.filter(n => !have[n]), haveL = names.filter(n => have[n]);
  let bill = 0, unpriced = [];
  toBuy.forEach(n => { const b = buy(n, tot[n]); if (b) bill += b.cost; else unpriced.push(label(n)); });
  const inCart = toBuy.filter(n => checked[n]).length;
  const pct = toBuy.length ? Math.round(inCart/toBuy.length*100) : 100;

  let h = `<div class="card stats">
      <div class="stat"><svg viewBox="0 0 24 24"><path d="M3 17h18M5 17V9l7-4 7 4v8"/><path d="M9 13h6"/></svg><div><b>${t}</b><small>${t>1?"Cakes":"Cake"}</small></div></div>
      <div class="stat"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11h10.2L20 8H7"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/></svg><div><b>${toBuy.length}</b><small>To buy</small></div></div>
      <div class="stat"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/></svg><div><b>~$${Math.round(bill)}</b><small>Est. total</small></div></div>
    </div>
    <div class="order"><b>Order:</b> ${Object.entries(qty).map(([n,k]) => `${k} × ${esc(short(n))}`).join(" · ")}</div>
    <div class="card progress"><div class="row"><span>In the cart: <b>${inCart}</b> of <b>${toBuy.length}</b></span><span>${pct}%</span></div><div class="track"><div class="fill" style="width:${pct}%"></div></div></div>
    <div class="seg">
      <button class="chip ${filter==="all"?"on":""}" data-f="all">All (${names.length})</button>
      <button class="chip ${filter==="buy"?"on":""}" data-f="buy">To Buy (${toBuy.length})</button>
      <button class="chip ${filter==="have"?"on":""}" data-f="have">Have It (${haveL.length})</button>
    </div>`;
  const show = n => filter==="all" || (filter==="buy" ? !have[n] : have[n]);
  const placed = new Set();
  const groups = Object.entries(AISLE).map(([a, l]) => [a, l.filter(n => tot[n])]);
  groups.forEach(([, l]) => l.forEach(n => placed.add(n)));
  const rest = names.filter(n => !placed.has(n));
  if (rest.length) groups.push(["Other", rest]);
  let any = false;
  for (const [a, l] of groups) {
    const vis = l.filter(show); if (!vis.length) continue; any = true;
    h += `<div class="aisle">${a}</div><div class="card items">` + vis.map(n => item(n)).join("") + `</div>`;
  }
  if (!any) h += `<div class="card empty">${filter==="have"?"Nothing marked as “Have it” yet.":"Everything’s marked as already at home."}</div>`;
  if (caramel) h += `<p class="small">Includes ingredients for ${Math.round(caramel)} ml of homemade caramel sauce (≈ ${r1(caramel/CARAMEL_YIELD)} batches).</p>`;
  if (unpriced.length) h += `<p class="small">No price yet for: ${unpriced.map(esc).join(", ")}. These aren’t in the total.</p>`;
  h += `<p class="small">Prices are your shelf prices from ${D.priceDate}, before tax, for the whole packages you buy. Tap “Have it” on anything already at home to take it off the total.</p>`;
  body.innerHTML = h;
  $("#total").textContent = money(bill);

  function item(n){
    const b = buy(n, tot[n]), hv = !!have[n], dn = !!checked[n] && !hv;
    return `<div class="item ${dn?"done":""} ${hv?"have":""}" data-n="${esc(n)}">
      <button class="box" aria-label="In the cart" style="${hv?"visibility:hidden":""}"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></button>
      <div class="iinfo">
        <div class="iname">${esc(label(n))}${PANTRY.has(n)&&!hv?`<span class="tag">check pantry</span>`:""}</div>
        <div class="ineed">Need ${esc(need(n, tot[n]))}</div>
        <div class="ibuy">${b ? `Buy ${b.packs} × ${esc(b.lab)}${b.packs>1?` · ${money(b.price)} each`:""}` : `For ${[...used[n]].map(esc).join(", ")}`}</div>
      </div>
      <div class="iright">
        ${hv ? `<span class="price na">—</span>` : b ? `<span class="price">${money(b.cost)}</span>` : `<span class="price na">no price</span>`}
        <button class="pill ${hv?"yes":""}">${hv?"✓ Have it":"Have it"}</button>
      </div></div>`;
  }
  body.querySelectorAll(".seg .chip").forEach(c => c.onclick = () => { filter = c.dataset.f; renderList(); });
  body.querySelectorAll(".item").forEach(row => {
    const n = row.dataset.n;
    row.querySelector(".box").onclick = () => { if (checked[n]) delete checked[n]; else checked[n] = true; save(); renderList(); };
    row.querySelector(".iinfo").onclick = () => { if (have[n]) return; if (checked[n]) delete checked[n]; else checked[n] = true; save(); renderList(); };
    row.querySelector(".pill").onclick = () => { if (have[n]) delete have[n]; else { have[n] = true; delete checked[n]; } save(); renderList(); renderPantry(); };
  });
}

// ---------- pantry ----------
function allIngredients(){
  const s = new Set();
  for (const r of Object.values(D.recipes)) for (const [i] of r) if (i !== "Caramel sauce") s.add(i);
  return [...s].sort((a,b) => label(a).localeCompare(label(b)));
}
function renderPantry(){
  const q = pquery.trim().toLowerCase();
  const list = allIngredients().filter(n => !q || label(n).toLowerCase().includes(q));
  $("#pantryList").innerHTML = list.length ? list.map(n => `<div class="prow" data-n="${esc(n)}"><span>${esc(label(n))}</span><button class="switch ${have[n]?"on":""}" role="switch" aria-checked="${!!have[n]}" aria-label="Have ${esc(label(n))}"></button></div>`).join("")
    : `<div class="empty">No ingredients match.</div>`;
  $("#pantryList").querySelectorAll(".prow").forEach(r => {
    const n = r.dataset.n;
    r.onclick = () => { if (have[n]) delete have[n]; else { have[n] = true; delete checked[n]; } save(); renderPantry(); };
  });
}

// ---------- navigation ----------
function go(v){
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === v));
  document.querySelectorAll(".tabbar button").forEach(b => b.classList.toggle("on", b.dataset.go === v));
  if (v === "list") renderList();
  if (v === "pantry") renderPantry();
  if (v === "cakes") renderCakes();
  window.scrollTo(0, 0);
}
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
$("#make").onclick = () => go("list");
$("#uncheck").onclick = () => { checked = {}; save(); renderList(); };
$("#q").oninput = e => { query = e.target.value; renderCakes(); };
$("#pq").oninput = e => { pquery = e.target.value; renderPantry(); };

renderCats(); renderCakes(); updateChrome();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
