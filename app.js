/* CakeCart: recipes, ingredient prices, cake pricing and shopping list, all saved on this device. */

// ---------- storage ----------
const store = {
  get(k, d){ try { const v = localStorage.getItem("cakecart-"+k); return v == null ? d : JSON.parse(v); } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem("cakecart-"+k, JSON.stringify(v)); return true; } catch(e){ return false; } }
};
const clone = o => JSON.parse(JSON.stringify(o));

let db = store.get("db", null);
if (!db || !db.recipes || !db.ingredients) db = clone(DEFAULTS);
mergeDefaults();
let qty = store.get("qty", {}), checked = store.get("checked", {}), have = store.get("have", {});
const saveDb = () => { db.savedAt = Date.now(); if (!store.set("db", db)) toast("Couldn’t save on this device. Make a backup in Settings."); };
const saveState = () => { store.set("qty", qty); store.set("checked", checked); store.set("have", have); };

// Add any built-in recipes or ingredients that are new in an app update, without touching your edits.
function mergeDefaults(){
  db.deleted = db.deleted || {recipes:[], ingredients:[]};
  let added = 0;
  for (const [id, ing] of Object.entries(DEFAULTS.ingredients))
    if (!db.ingredients[id] && !db.deleted.ingredients.includes(id)) { db.ingredients[id] = clone(ing); added++; }
  for (const [id, r] of Object.entries(DEFAULTS.recipes))
    if (!db.recipes[id] && !db.deleted.recipes.includes(id)) { db.recipes[id] = clone(r); added++; }
  if (added || db.version !== DEFAULTS.version) { db.version = DEFAULTS.version; store.set("db", db); }
}

// ---------- helpers ----------
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const r1 = x => Math.round(x*10)/10, r2 = x => Math.round(x*100)/100, ceil = Math.ceil;
const money = x => (x < 0 ? "−$" : "$") + Math.abs(x).toFixed(2);
const num = v => { const n = parseFloat(String(v).replace(",", ".")); return isFinite(n) ? n : 0; };
const oz = g => g >= 454 ? `${r1(g/453.592)} lb` : `${Math.round(g/28.35)} oz`;
const ING = id => db.ingredients[id];
const ingName = id => ING(id)?.name || id;
const short = r => r.name.replace(/ Cheesecake$/,"");
const newId = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
const AISLES = ["Dairy & eggs","Produce","Baking aisle","Cookies, spreads & coffee","Spices","Other"];
const CATS = ["Cheesecakes","Brownies","Other"];

// Units: amounts are stored in g, ml or each; these let you type in kitchen units.
const UNITS = {
  g:   {g:1, kg:1000, oz:28.3495, lb:453.592},
  ml:  {ml:1, l:1000, tsp:4.92892, Tbsp:14.7868, cup:236.588, "fl oz":29.5735},
  each:{each:1}
};
function unitsFor(id){
  const ing = ING(id); if (!ing) return {g:1};
  const u = {...(UNITS[ing.unit] || {[ing.unit]:1})};
  if (ing.unit === "g" && ing.tsp) { u.tsp = ing.tsp; u.Tbsp = ing.tsp*3; }
  return u;
}
function fmtAmt(id, v){
  const ing = ING(id); if (!ing) return r1(v);
  if (ing.unit === "each") return `${r1(v)}`;
  if (ing.unit === "g" && ing.tsp && v < ing.tsp*9) { const t = v/ing.tsp; return t >= 3 ? `${r1(t/3)} Tbsp` : `${r1(t)} tsp`; }
  return `${v >= 100 ? Math.round(v) : r1(v)} ${ing.unit}`;
}

// ---------- costing ----------
function unitCost(id, seen = new Set()){
  const ing = ING(id); if (!ing) return null;
  if (ing.madeFrom) {
    const r = db.recipes[ing.madeFrom]; if (!r || seen.has(id) || !(r.yield > 0)) return null;
    seen.add(id); return recipeCost(r, seen).total / r.yield;
  }
  return ing.pkg && ing.pkg.size > 0 && ing.pkg.price >= 0 ? ing.pkg.price / ing.pkg.size : null;
}
function recipeCost(r, seen = new Set()){
  let total = 0; const missing = new Set();
  for (const s of r.sections) for (const it of s.items) {
    const c = unitCost(it.ing, new Set(seen));
    if (c == null) missing.add(it.ing); else total += c * it.amt;
  }
  return {total, missing:[...missing]};
}
function pricing(r){
  const c = recipeCost(r), pack = num(r.packaging), totalCost = c.total + pack;
  const price = totalCost * num(r.markup), per = num(r.pieces) > 0 ? price / num(r.pieces) : 0;
  return {ing:c.total, missing:c.missing, pack, totalCost, price, profit: price - totalCost, per};
}
const usedIn = id => Object.values(db.recipes).filter(r => r.sections.some(s => s.items.some(i => i.ing === id)));

// Whole packages at your store price
function buy(id, v){
  const p = ING(id)?.pkg; if (!p || !(p.size > 0)) return null;
  const packs = Math.max(1, ceil(v/p.size - 0.03));
  return {packs, cost: packs*p.price, price: p.price, lab: p.label || "package"};
}
// What you need, in kitchen terms
function need(id, v){
  const ing = ING(id) || {}, u = ing.unit;
  switch(id){
    case "Eggs (large)": return `${ceil(v)} eggs`;
    case "Cream cheese (brick)": return `${ceil(v/226.8-0.02)} bricks (8 oz)`;
    case "Butter": return `${r1(v/113.4)} sticks · ${Math.round(v)} g`;
    case "Oreo cookies": return `${ceil(v)} cookies`;
    case "Lemon juice": return `${r1(v/14.8)} Tbsp juice (≈ ${ceil(v/30)} lemon${ceil(v/30)>1?"s":""})`;
  }
  if (ing.tsp && v < ing.tsp*9) return fmtAmt(id, v);
  if (u === "g") return `${v>=100?Math.round(v):r1(v)} g · ${oz(v)}`;
  if (u === "ml") return v < 15 ? `${r1(v/4.93)} tsp` : `${Math.round(v)} ml · ${r1(v/236.6)} cups`;
  if (u === "each") return `${ceil(v)}`;
  return `${r1(v)} ${u||""}`;
}

// ---------- cake thumbnails ----------
const LOOKS = [["#FBF0DC","#FFF8EC","#F8E7B0","#C08548"],["#FCE4E6","#E0485F","#F8E7C8","#C08548","#E0485F"],["#F1E4DE","#4A2A1F","#7A4A35","#2B1B16"],["#ECE8F7","#4A3A8C","#F8E8C4","#C08548","#6A59B8"],["#EEF5DC","#C9E08A","#F3F0C4","#C08548","#7FB13A"],["#FBEAD6","#C77B30","#F6E2B3","#B9783F"]];
function thumb(r){
  const [bg, top, fill, crust, garnish] = r.look || LOOKS[0];
  return `<div class="thumb" style="background:${bg}"><svg viewBox="0 0 64 64">
    <path d="M8 27 L25 13 L57 31 Z" fill="${top}" stroke="rgba(0,0,0,.08)"/>
    <path d="M8 27 L57 31 L57 37 L8 33 Z" fill="${top}" filter="brightness(.92)"/>
    <path d="M8 33 L57 37 L57 49 L8 45 Z" fill="${fill}"/>
    <path d="M8 45 L57 49 L57 55 L8 51 Z" fill="${crust}"/>
    <path d="M8 27 L57 31 L57 55 L8 51 Z" fill="none" stroke="rgba(0,0,0,.10)"/>
    ${garnish ? `<circle cx="30" cy="20" r="6" fill="${garnish}"/><circle cx="28" cy="18" r="1.6" fill="rgba(255,255,255,.55)"/>` : ""}
  </svg></div>`;
}

// ---------- toast + sheets ----------
let toastT;
function toast(msg, actionLabel, action){
  const t = $("#toast"); t.innerHTML = esc(msg) + (actionLabel ? ` <button class="toastbtn">${esc(actionLabel)}</button>` : "");
  t.classList.toggle("act", !!actionLabel); t.classList.add("show"); clearTimeout(toastT);
  if (actionLabel) t.querySelector(".toastbtn").onclick = () => { t.classList.remove("show"); action(); };
  toastT = setTimeout(() => t.classList.remove("show"), actionLabel ? 5000 : 2600);
}
const sheetStack = [];
function openSheet(title, bodyHtml, mount, opts = {}){
  const el = document.createElement("div");
  el.className = "sheetwrap";
  el.innerHTML = `<div class="scrim"></div><div class="sheet ${opts.tall?"tall":""}" role="dialog" aria-label="${esc(title)}">
    <div class="sheethead"><button class="icon close" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><h3>${esc(title)}</h3><span class="icon ghost"></span></div>
    <div class="sheetbody">${bodyHtml}</div></div>`;
  $("#sheets").appendChild(el); sheetStack.push(el);
  const close = () => closeSheet(el, opts.onClose);
  el.querySelector(".scrim").onclick = close; el.querySelector(".close").onclick = close;
  requestAnimationFrame(() => el.classList.add("open"));
  if (mount) mount(el.querySelector(".sheetbody"), close, el);
  return el;
}
function closeSheet(el, onClose){
  el.classList.remove("open"); const i = sheetStack.indexOf(el); if (i >= 0) sheetStack.splice(i, 1);
  setTimeout(() => el.remove(), 220); if (onClose) onClose();
}
function replaceSheetBody(el, html, mount){ const b = el.querySelector(".sheetbody"); const y = b.scrollTop; b.innerHTML = html; if (mount) mount(b); b.scrollTop = y; }
// Two-tap confirm for anything destructive
function confirmTap(btn, label, action){
  btn.onclick = () => {
    if (btn.dataset.armed) { action(); return; }
    btn.dataset.armed = "1"; const old = btn.textContent; btn.textContent = label; btn.classList.add("armed");
    setTimeout(() => { if (btn.isConnected) { delete btn.dataset.armed; btn.textContent = old; btn.classList.remove("armed"); } }, 3500);
  };
}

// ---------- CAKES ----------
let cat = "All", query = "";
const cakeIds = () => Object.keys(db.recipes).filter(id => !db.recipes[id].sub).sort((a,b) => db.recipes[a].name.localeCompare(db.recipes[b].name));
function renderCats(){
  const cats = ["All", ...CATS.filter(c => cakeIds().some(id => db.recipes[id].cat === c)), "Selected"];
  $("#cats").innerHTML = cats.map(c => `<button class="chip ${c===cat?"on":""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  $("#cats").querySelectorAll(".chip").forEach(b => b.onclick = () => { cat = b.dataset.c; renderCats(); renderCakes(); });
}
function renderCakes(){
  const q = query.trim().toLowerCase();
  const list = cakeIds().filter(id => { const r = db.recipes[id];
    return (cat==="All" || (cat==="Selected" ? qty[id] : r.cat===cat)) && (!q || (r.name+" "+(r.desc||"")).toLowerCase().includes(q)); });
  const el = $("#cakeList");
  if (!list.length) { el.innerHTML = `<div class="empty">${cat==="Selected"?"No cakes picked yet.":"No cakes match that search."}</div>`; return; }
  el.innerHTML = list.map(id => { const r = db.recipes[id], k = qty[id] || 0;
    return `<div class="cake ${k?"sel":""}" data-id="${esc(id)}">${thumb(r)}
      <div class="cinfo"><h3>${esc(r.name)}</h3><p>${esc(r.desc||"")}${r.per==="pan"?" · per pan":""}</p></div>
      <div class="stepper">
        <button class="minus" aria-label="One less" ${k?"":"disabled"}><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
        <output>${k}</output>
        <button class="plus" aria-label="One more"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
      </div></div>`; }).join("");
  el.querySelectorAll(".cake").forEach(row => { const id = row.dataset.id;
    row.querySelector(".plus").onclick = () => setQty(id, (qty[id]||0)+1);
    row.querySelector(".minus").onclick = () => setQty(id, (qty[id]||0)-1); });
}
function setQty(id, k){ if (k > 0) qty[id] = k; else delete qty[id]; checked = {}; saveState(); renderCakes(); updateChrome(); }
function cleanQty(){ for (const id of Object.keys(qty)) if (!db.recipes[id] || db.recipes[id].sub) delete qty[id]; }
const totalCakes = () => Object.values(qty).reduce((a,b)=>a+b,0);
function updateChrome(){
  const t = totalCakes();
  $("#cta").classList.toggle("hide", !t);
  $("#ctaText").textContent = t ? `Make shopping list · ${t} selected` : "Make shopping list";
  const b = $("#listBadge"); b.textContent = t; b.classList.toggle("show", !!t);
  $("#clearCakes").classList.toggle("idle", !t);
}
function clearCakes(){
  const t = totalCakes(); if (!t) return;
  const prevQty = {...qty}, prevChecked = {...checked};
  qty = {}; checked = {}; saveState(); if (cat === "Selected") { cat = "All"; renderCats(); } renderCakes(); updateChrome();
  toast(`Cleared ${t} cake${t>1?"s":""}`, "Undo", () => { qty = prevQty; checked = prevChecked; saveState(); renderCakes(); updateChrome(); });
}

// ---------- SHOPPING LIST ----------
let filter = "all";
function compute(){
  const tot = {}, used = {}; let homemade = {};
  function add(id, amt, forName, depth){
    const ing = ING(id);
    if (ing?.madeFrom && db.recipes[ing.madeFrom] && depth < 4) {
      const r = db.recipes[ing.madeFrom]; const hm = homemade[r.name] = homemade[r.name] || {amt:0, unit:r.yieldUnit||ing.unit, yield:r.yield}; hm.amt += amt;
      const f = r.yield > 0 ? amt / r.yield : 0;
      for (const s of r.sections) for (const it of s.items) add(it.ing, it.amt*f, r.name, depth+1);
      return;
    }
    tot[id] = (tot[id]||0) + amt; (used[id] = used[id] || new Set()).add(forName);
  }
  for (const [id, k] of Object.entries(qty)) { const r = db.recipes[id]; if (!r) continue;
    for (const s of r.sections) for (const it of s.items) add(it.ing, it.amt*k, short(r), 0); }
  return {tot, used, homemade};
}
function renderList(){
  const body = $("#listBody"), t = totalCakes();
  if (!t) {
    body.innerHTML = `<div class="card empty" style="padding:36px 20px">Pick some cakes first.<br><br><button class="chip on" id="goCakes">Choose cakes</button></div>`;
    $("#goCakes").onclick = () => go("cakes"); $("#totalbar").style.display = "none"; $("#uncheck").classList.add("idle"); return;
  }
  $("#totalbar").style.display = "";
  const {tot, used, homemade} = compute(), ids = Object.keys(tot);
  const toBuy = ids.filter(id => !have[id]), haveL = ids.filter(id => have[id]);
  let bill = 0; const unpriced = [];
  toBuy.forEach(id => { const b = buy(id, tot[id]); if (b) bill += b.cost; else unpriced.push(ingName(id)); });
  const inCart = toBuy.filter(id => checked[id]).length, pct = toBuy.length ? Math.round(inCart/toBuy.length*100) : 100;
  let h = `<div class="card stats">
      <div class="stat"><svg viewBox="0 0 24 24"><path d="M3 17h18M5 17V9l7-4 7 4v8"/><path d="M9 13h6"/></svg><div><b>${t}</b><small>${t>1?"Cakes":"Cake"}</small></div></div>
      <div class="stat"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11h10.2L20 8H7"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/></svg><div><b>${toBuy.length}</b><small>To buy</small></div></div>
      <div class="stat"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/></svg><div><b>~$${Math.round(bill)}</b><small>Est. total</small></div></div>
    </div>
    <div class="order"><b>Order:</b> ${Object.entries(qty).filter(([id])=>db.recipes[id]).map(([id,k]) => `${k} × ${esc(short(db.recipes[id]))}`).join(" · ")}</div>
    <div class="card progress"><div class="row"><span>In the cart: <b>${inCart}</b> of <b>${toBuy.length}</b></span><span>${pct}%</span></div><div class="track"><div class="fill" style="width:${pct}%"></div></div></div>
    <div class="seg">
      <button class="chip ${filter==="all"?"on":""}" data-f="all">All (${ids.length})</button>
      <button class="chip ${filter==="buy"?"on":""}" data-f="buy">To Buy (${toBuy.length})</button>
      <button class="chip ${filter==="have"?"on":""}" data-f="have">Have It (${haveL.length})</button>
    </div>`;
  const show = id => filter==="all" || (filter==="buy" ? !have[id] : have[id]);
  let any = false;
  for (const a of AISLES) {
    const vis = ids.filter(id => (AISLES.includes(ING(id)?.aisle) ? ING(id).aisle : "Other") === a && show(id)).sort((x,y) => ingName(x).localeCompare(ingName(y)));
    if (!vis.length) continue; any = true;
    h += `<div class="aisle">${esc(a)}</div><div class="card items">` + vis.map(item).join("") + `</div>`;
  }
  if (!any) h += `<div class="card empty">${filter==="have"?"Nothing marked as “Have it” yet.":"Everything’s marked as already at home."}</div>`;
  for (const [n, hm] of Object.entries(homemade)) h += `<p class="small">Includes the ingredients for ${Math.round(hm.amt)} ${esc(hm.unit)} of homemade ${esc(n.toLowerCase())}${hm.yield>0?` (≈ ${r1(hm.amt/hm.yield)} batches)`:""}.</p>`;
  if (unpriced.length) h += `<p class="small">No price yet for: ${unpriced.map(esc).join(", ")}. Add prices in Ingredients to include them.</p>`;
  h += `<p class="small">Totals use your saved prices for the whole packages you buy, before tax. Tap “Have it” on anything already at home to take it off the total.</p>`;
  body.innerHTML = h; $("#total").textContent = money(bill); $("#uncheck").classList.toggle("idle", !inCart);

  function item(id){
    const b = buy(id, tot[id]), hv = !!have[id], dn = !!checked[id] && !hv, ing = ING(id) || {};
    return `<div class="item ${dn?"done":""} ${hv?"have":""}" data-id="${esc(id)}">
      <button class="box" aria-label="In the cart" style="${hv?"visibility:hidden":""}"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></button>
      <div class="iinfo">
        <div class="iname">${esc(ingName(id))}${ing.pantry&&!hv?`<span class="tag">check pantry</span>`:""}</div>
        <div class="ineed">Need ${esc(need(id, tot[id]))}</div>
        <div class="ibuy">${b ? `Buy ${b.packs} × ${esc(b.lab)}${b.packs>1?` · ${money(b.price)} each`:""}` : `For ${[...used[id]].map(esc).join(", ")}`}</div>
      </div>
      <div class="iright">
        ${hv ? `<span class="price na">—</span>` : b ? `<span class="price">${money(b.cost)}</span>` : `<span class="price na">no price</span>`}
        <button class="pill ${hv?"yes":""}">${hv?"✓ Have it":"Have it"}</button>
      </div></div>`;
  }
  body.querySelectorAll(".seg .chip").forEach(c => c.onclick = () => { filter = c.dataset.f; renderList(); });
  body.querySelectorAll(".item").forEach(row => { const id = row.dataset.id;
    const tog = () => { if (have[id]) return; if (checked[id]) delete checked[id]; else checked[id] = true; saveState(); renderList(); };
    row.querySelector(".box").onclick = tog; row.querySelector(".iinfo").onclick = tog;
    row.querySelector(".pill").onclick = () => { if (have[id]) delete have[id]; else { have[id] = true; delete checked[id]; } saveState(); renderList(); };
  });
}

// ---------- RECIPES ----------
let rquery = "";
function renderRecipes(){
  const q = rquery.trim().toLowerCase();
  const ids = Object.keys(db.recipes).filter(id => !q || (db.recipes[id].name+" "+(db.recipes[id].desc||"")).toLowerCase().includes(q))
    .sort((a,b) => (db.recipes[a].sub?1:0)-(db.recipes[b].sub?1:0) || db.recipes[a].name.localeCompare(db.recipes[b].name));
  if (!ids.length) { $("#recipeList").innerHTML = `<div class="empty">No recipes match.</div>`; return; }
  let h = "", inHome = false;
  h += `<div class="cakelist">`;
  for (const id of ids) {
    const r = db.recipes[id];
    if (r.sub && !inHome) { inHome = true; h += `</div><div class="aisle">Homemade ingredients</div><div class="cakelist">`; }
    let line;
    if (r.sub) { const c = recipeCost(r); line = `<span class="kv">Batch <b>${money(c.total)}</b></span><span class="kv">Per ${esc(r.yieldUnit||"unit")} <b>$${(r.yield>0?c.total/r.yield:0).toFixed(4)}</b></span>`; }
    else { const p = pricing(r); line = `<span class="kv">Cost <b>${money(p.totalCost)}</b></span><span class="kv">Sell <b class="hot">${money(p.price)}</b></span><span class="kv">Per ${esc(r.piece||"slice")} <b>${money(p.per)}</b></span>`; }
    const miss = recipeCost(r).missing.length;
    h += `<button class="cake rcard" data-id="${esc(id)}">${thumb(r)}<div class="cinfo"><h3>${esc(r.name)}</h3><div class="kvs">${line}</div>${miss?`<p class="warn">${miss} ingredient${miss>1?"s":""} without a price</p>`:""}</div><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>`;
  }
  h += `</div>`;
  $("#recipeList").innerHTML = h;
  $("#recipeList").querySelectorAll(".rcard").forEach(b => b.onclick = () => openRecipe(b.dataset.id));
}
function recipeHtml(id){
  const r = db.recipes[id]; if (!r) return "";
  let h = `<div class="rhead">${thumb(r)}<div><h2>${esc(r.name)}</h2><p>${esc(r.desc||"")}</p><span class="tag">${esc(r.sub?"Homemade ingredient":r.cat||"Other")}</span></div></div>`;
  if (r.sub) {
    const c = recipeCost(r), per = r.yield > 0 ? c.total / r.yield : 0;
    const users = Object.values(db.ingredients).filter(i => i.madeFrom === id).flatMap(i => usedIn(Object.keys(db.ingredients).find(k => db.ingredients[k] === i))).map(x => x.name);
    h += `<div class="card pricing">
      <div class="prow2"><span>Cost of one batch</span><b>${money(c.total)}</b></div>
      <div class="prow2"><span>One batch makes</span><span class="inl"><input class="num" id="f_yield" inputmode="decimal" value="${r2(r.yield||0)}"><em>${esc(r.yieldUnit||"ml")}</em></span></div>
      <div class="prow2 big"><span>Cost per ${esc(r.yieldUnit||"ml")}</span><b>$${per.toFixed(4)}</b></div>
      ${users.length?`<p class="small" style="margin:8px 0 0">Used in ${[...new Set(users)].map(esc).join(", ")}.</p>`:""}
    </div>`;
  } else {
    const p = pricing(r);
    h += `<div class="card pricing">
      <div class="prow2"><span>Ingredients</span><b>${money(p.ing)}</b></div>
      <div class="prow2"><span>Packaging &amp; other<small>Box, board, oven energy…</small></span><span class="inl"><em>$</em><input class="num" id="f_pack" inputmode="decimal" value="${r2(num(r.packaging))}"></span></div>
      <div class="prow2 line"><span>Total cost</span><b>${money(p.totalCost)}</b></div>
      <div class="prow2"><span>Markup<small>Price = cost × markup</small></span><span class="inl"><input class="num" id="f_markup" inputmode="decimal" value="${r2(num(r.markup))}"><em>×</em></span></div>
      <div class="prow2 big"><span>Suggested price<small>Whole ${esc(r.size||r.per||"cake")}</small></span><b class="hot">${money(p.price)}</b></div>
      <div class="prow2"><span>Profit</span><b>${money(p.profit)}</b></div>
      <div class="prow2"><span>${esc((r.piece||"slice").replace(/^./,c=>c.toUpperCase()))}s</span><span class="inl"><input class="num" id="f_pieces" inputmode="numeric" value="${num(r.pieces)}"></span></div>
      <div class="prow2 big"><span>Price per ${esc(r.piece||"slice")}</span><b class="hot">${money(p.per)}</b></div>
    </div>`;
    if (p.missing.length) h += `<p class="warn pad">No price yet for ${p.missing.map(ingName).map(esc).join(", ")}, so the cost above is low.</p>`;
  }
  r.sections.forEach((s, si) => {
    h += `<div class="sechead"><button class="linkish" data-sec="${si}">${esc(s.title)}<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></button></div><div class="card items">`;
    s.items.forEach((it, ii) => {
      const c = unitCost(it.ing), cost = c == null ? null : c*it.amt;
      h += `<button class="line" data-s="${si}" data-i="${ii}"><div class="iinfo"><div class="iname">${esc(ingName(it.ing))}</div><div class="ineed">${esc(it.note||"")}</div></div>
        <div class="iright"><span class="amt">${esc(fmtAmt(it.ing, it.amt))}</span>${cost==null?`<span class="price na">no price</span>`:`<span class="price sm">${money(cost)}</span>`}</div></button>`;
    });
    h += `<button class="addline" data-add="${si}"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add ingredient</button></div>`;
  });
  h += `<div class="btnrow"><button class="ghostbtn" id="addSec">+ Add section</button><button class="ghostbtn" id="editDetails">Edit details</button></div>
    <div class="btnrow"><button class="ghostbtn" id="dupRecipe">Duplicate</button><button class="ghostbtn danger" id="delRecipe">Delete recipe</button></div>`;
  return h;
}
function openRecipe(id){
  const r = db.recipes[id]; if (!r) return;
  openSheet(r.sub ? "Homemade ingredient" : "Recipe", recipeHtml(id), (body, close, el) => mountRecipe(id, body, close, el), {tall:true, onClose: refreshAll});
}
function mountRecipe(id, body, close, el){
  const r = db.recipes[id], rerender = () => replaceSheetBody(el, recipeHtml(id), b => mountRecipe(id, b, close, el));
  const bindNum = (sel, key) => { const i = body.querySelector(sel); if (!i) return;
    i.onchange = () => { r[key] = num(i.value); saveDb(); rerender(); }; };
  bindNum("#f_pack","packaging"); bindNum("#f_markup","markup"); bindNum("#f_pieces","pieces"); bindNum("#f_yield","yield");
  body.querySelectorAll(".line").forEach(b => b.onclick = () => editLine(id, +b.dataset.s, +b.dataset.i, rerender));
  body.querySelectorAll("[data-add]").forEach(b => b.onclick = () => editLine(id, +b.dataset.add, -1, rerender));
  body.querySelectorAll("[data-sec]").forEach(b => b.onclick = () => editSection(id, +b.dataset.sec, rerender));
  body.querySelector("#addSec").onclick = () => editSection(id, -1, rerender);
  body.querySelector("#editDetails").onclick = () => editRecipeDetails(id, rerender);
  body.querySelector("#dupRecipe").onclick = () => {
    const nid = newId("r"), c = clone(r); c.name = r.name + " (copy)"; db.recipes[nid] = c; saveDb(); close();
    toast("Recipe duplicated"); setTimeout(() => openRecipe(nid), 250);
  };
  confirmTap(body.querySelector("#delRecipe"), "Tap again to delete", () => {
    const madeOf = Object.entries(db.ingredients).find(([, i]) => i.madeFrom === id);
    if (madeOf && usedIn(madeOf[0]).length) { toast(`Used as ${madeOf[1].name} in other recipes. Remove it there first.`); return; }
    if (madeOf) delete db.ingredients[madeOf[0]];
    delete db.recipes[id]; if (DEFAULTS.recipes[id]) db.deleted.recipes.push(id);
    delete qty[id]; saveState(); saveDb(); close(); toast("Recipe deleted");
  });
}
function editRecipeDetails(id, done){
  const r = db.recipes[id], isNew = !r;
  const v = r || {name:"", desc:"", cat:"Cheesecakes"};
  const catOpts = [...CATS, "Homemade ingredient"].map(c => `<option ${((v.sub?"Homemade ingredient":v.cat)===c)?"selected":""}>${c}</option>`).join("");
  openSheet(isNew ? "New recipe" : "Edit details", `
    <label class="field"><span>Name</span><input id="d_name" value="${esc(v.name)}" placeholder="e.g. Mango Cheesecake"></label>
    <label class="field"><span>Short description</span><input id="d_desc" value="${esc(v.desc||"")}" placeholder="Shown under the name"></label>
    <label class="field"><span>Type</span><select id="d_cat">${catOpts}</select></label>
    <div id="d_more"></div>
    <button class="primary" id="d_save">${isNew?"Create recipe":"Save"}</button>`, (b, close) => {
    const more = () => {
      const sub = b.querySelector("#d_cat").value === "Homemade ingredient", pan = b.querySelector("#d_cat").value === "Brownies";
      b.querySelector("#d_more").innerHTML = sub
        ? `<div class="two"><label class="field"><span>One batch makes</span><input id="d_yield" inputmode="decimal" value="${r2(v.yield||236)}"></label>
           <label class="field"><span>Unit</span><select id="d_yu">${["ml","g","each"].map(u=>`<option ${(v.yieldUnit||"ml")===u?"selected":""}>${u}</option>`).join("")}</select></label></div>
           <p class="small" style="margin:0 0 12px">It becomes an ingredient you can add to other recipes, priced from this recipe.</p>`
        : `<div class="two"><label class="field"><span>Sold as</span><input id="d_size" value="${esc(v.size || (pan?"9×13 pan":"9\" cheesecake"))}"></label>
           <label class="field"><span>Cut into</span><input id="d_piece" value="${esc(v.piece || (pan?"brownie":"slice"))}"></label></div>`;
    };
    b.querySelector("#d_cat").onchange = more; more();
    b.querySelector("#d_save").onclick = () => {
      const name = b.querySelector("#d_name").value.trim(); if (!name) { toast("Give it a name"); return; }
      const type = b.querySelector("#d_cat").value, sub = type === "Homemade ingredient";
      const rid = id || newId("r");
      const rec = r || {sections:[{title:"Ingredients", items:[]}], markup:3, packaging:0, pieces: type==="Brownies"?24:12,
        look: LOOKS[Object.keys(db.recipes).length % LOOKS.length]};
      rec.name = name; rec.desc = b.querySelector("#d_desc").value.trim();
      if (sub) {
        rec.sub = true; rec.cat = "Homemade"; rec.yield = num(b.querySelector("#d_yield").value) || 1; rec.yieldUnit = b.querySelector("#d_yu").value;
        let ingId = Object.keys(db.ingredients).find(k => db.ingredients[k].madeFrom === rid);
        if (!ingId) { ingId = newId("i"); db.ingredients[ingId] = {name, unit: rec.yieldUnit, aisle:"Homemade", madeFrom: rid}; }
        else { db.ingredients[ingId].name = name; db.ingredients[ingId].unit = rec.yieldUnit; }
      } else {
        delete rec.sub; rec.cat = type; rec.per = type === "Brownies" ? "pan" : "cheesecake";
        rec.size = b.querySelector("#d_size").value.trim(); rec.piece = b.querySelector("#d_piece").value.trim() || "slice";
        if (rec.markup == null) rec.markup = 3; if (rec.pieces == null) rec.pieces = 12; if (rec.packaging == null) rec.packaging = 0;
      }
      db.recipes[rid] = rec; saveDb(); close();
      if (isNew) setTimeout(() => openRecipe(rid), 250); else if (done) done();
    };
  });
}
function editSection(id, si, done){
  const r = db.recipes[id], s = r.sections[si], isNew = si < 0;
  openSheet(isNew ? "New section" : "Section", `
    <label class="field"><span>Section name</span><input id="s_name" value="${esc(s?.title||"")}" placeholder="e.g. Crust, Filling, Topping"></label>
    <button class="primary" id="s_save">${isNew?"Add section":"Save"}</button>
    ${isNew?"":`<div class="btnrow">${si>0?`<button class="ghostbtn" id="s_up">Move up</button>`:""}<button class="ghostbtn danger" id="s_del">Delete section</button></div>`}`, (b, close) => {
    b.querySelector("#s_save").onclick = () => { const t = b.querySelector("#s_name").value.trim() || "Ingredients";
      if (isNew) r.sections.push({title:t, items:[]}); else s.title = t; saveDb(); close(); done(); };
    if (!isNew) {
      const up = b.querySelector("#s_up"); if (up) up.onclick = () => { r.sections.splice(si-1, 0, r.sections.splice(si,1)[0]); saveDb(); close(); done(); };
      confirmTap(b.querySelector("#s_del"), s.items.length ? `Delete with ${s.items.length} ingredient${s.items.length>1?"s":""}?` : "Tap again to delete", () => {
        r.sections.splice(si, 1); if (!r.sections.length) r.sections.push({title:"Ingredients", items:[]}); saveDb(); close(); done(); });
    }
  });
}
function ingOptions(sel, excludeRecipe){
  const ids = Object.keys(db.ingredients).filter(k => db.ingredients[k].madeFrom !== excludeRecipe).sort((a,b) => ingName(a).localeCompare(ingName(b)));
  return `<option value="">Choose…</option>` + ids.map(k => `<option value="${esc(k)}" ${k===sel?"selected":""}>${esc(ingName(k))}</option>`).join("") + `<option value="__new">+ New ingredient…</option>`;
}
function unitOptions(id, chosen){ return Object.keys(unitsFor(id)).map(u => `<option ${u===chosen?"selected":""}>${u}</option>`).join(""); }
function editLine(id, si, ii, done){
  const r = db.recipes[id], isNew = ii < 0, it = isNew ? {ing:"", amt:0, note:""} : r.sections[si].items[ii];
  let cur = it.ing;
  openSheet(isNew ? "Add ingredient" : "Edit ingredient", `
    <label class="field"><span>Ingredient</span><select id="l_ing">${ingOptions(cur, id)}</select></label>
    <div class="two"><label class="field"><span>Amount</span><input id="l_amt" inputmode="decimal" value="${isNew?"":r2(it.amt)}" placeholder="0"></label>
    <label class="field"><span>Unit</span><select id="l_unit"></select></label></div>
    <label class="field"><span>As written in the recipe <small>(optional)</small></span><input id="l_note" value="${esc(it.note||"")}" placeholder="e.g. 1 ½ cups, softened"></label>
    <p class="small" id="l_cost" style="margin:0 0 12px"></p>
    <button class="primary" id="l_save">${isNew?"Add":"Save"}</button>
    ${isNew?"":`<div class="btnrow"><button class="ghostbtn danger" id="l_del">Remove from recipe</button></div>`}`, (b, close) => {
    const sel = b.querySelector("#l_ing"), amt = b.querySelector("#l_amt"), un = b.querySelector("#l_unit"), costEl = b.querySelector("#l_cost");
    const base = () => ING(cur)?.unit || "g";
    const setUnits = () => { un.innerHTML = unitOptions(cur, base()); };
    const showCost = () => { if (!cur) { costEl.textContent = ""; return; }
      const f = unitsFor(cur)[un.value] || 1, v = num(amt.value)*f, c = unitCost(cur);
      costEl.textContent = c == null ? `${ingName(cur)} has no price yet. Add one in Ingredients.` : `= ${fmtAmt(cur, v)} · costs ${money(c*v)}`; };
    setUnits(); showCost();
    sel.onchange = () => {
      if (sel.value === "__new") { sel.value = cur || ""; editIngredient(null, nid => { cur = nid; sel.innerHTML = ingOptions(cur, id); setUnits(); showCost(); }); return; }
      cur = sel.value; setUnits(); showCost(); };
    amt.oninput = showCost; un.onchange = showCost;
    b.querySelector("#l_save").onclick = () => {
      if (!cur) { toast("Choose an ingredient"); return; }
      const v = num(amt.value) * (unitsFor(cur)[un.value] || 1); if (!(v > 0)) { toast("Enter an amount"); return; }
      const line = {ing: cur, amt: Math.round(v*1000)/1000, note: b.querySelector("#l_note").value.trim()};
      if (isNew) r.sections[si].items.push(line); else r.sections[si].items[ii] = line;
      saveDb(); close(); done();
    };
    if (!isNew) confirmTap(b.querySelector("#l_del"), "Tap again to remove", () => { r.sections[si].items.splice(ii, 1); saveDb(); close(); done(); });
  });
}

// ---------- INGREDIENTS ----------
let iquery = "", ifilter = "all";
function renderIngFilters(){
  const ids = Object.keys(db.ingredients).filter(k => !db.ingredients[k].madeFrom);
  const nHave = ids.filter(k => have[k]).length, nNo = ids.filter(k => unitCost(k) == null).length;
  const f = [["all",`All (${ids.length})`],["have",`Have at home (${nHave})`],["noprice",`No price (${nNo})`]];
  $("#ingFilters").innerHTML = f.map(([k,l]) => `<button class="chip ${ifilter===k?"on":""}" data-f="${k}">${l}</button>`).join("");
  $("#ingFilters").querySelectorAll(".chip").forEach(c => c.onclick = () => { ifilter = c.dataset.f; renderIngredients(); });
}
function renderIngredients(){
  renderIngFilters();
  const q = iquery.trim().toLowerCase();
  const ids = Object.keys(db.ingredients).filter(k => { const i = db.ingredients[k]; if (i.madeFrom) return false;
    if (ifilter==="have" && !have[k]) return false; if (ifilter==="noprice" && unitCost(k) != null) return false;
    return !q || i.name.toLowerCase().includes(q); }).sort((a,b) => ingName(a).localeCompare(ingName(b)));
  if (!ids.length) { $("#ingList").innerHTML = `<div class="card empty">${ifilter==="noprice"?"Every ingredient has a price.":"No ingredients match."}</div>`; return; }
  $("#ingList").innerHTML = `<div class="card items">` + ids.map(k => { const i = db.ingredients[k], c = unitCost(k);
    return `<div class="item ing" data-id="${esc(k)}"><div class="iinfo">
      <div class="iname">${esc(i.name)}</div>
      <div class="ineed">${i.pkg ? `${esc(i.pkg.label||"Package")} · <b class="hotc">${money(i.pkg.price)}</b>` : `<span class="warnc">No price yet</span>`}</div>
      <div class="ibuy">${c==null?"":`$${c.toFixed(4)} per ${esc(i.unit)}`}${i.pkg?.note?` · ${esc(i.pkg.note)}`:""}</div></div>
      <div class="iright"><span class="mini">Have</span><button class="switch ${have[k]?"on":""}" role="switch" aria-checked="${!!have[k]}" aria-label="Have ${esc(i.name)} at home"></button></div></div>`; }).join("") + `</div>`;
  $("#ingList").querySelectorAll(".item").forEach(row => { const k = row.dataset.id;
    row.querySelector(".iinfo").onclick = () => editIngredient(k);
    row.querySelector(".switch").onclick = () => { if (have[k]) delete have[k]; else { have[k] = true; delete checked[k]; } saveState(); renderIngredients(); };
  });
}
function editIngredient(id, onCreate){
  const isNew = !id, i = isNew ? {name:"", unit:"g", aisle:"Baking aisle", pantry:false} : db.ingredients[id];
  const used = isNew ? [] : usedIn(id);
  const p = i.pkg || {}, shown = p.shown && unitsFor(id||"")[p.shown] ? p.shown : (i.unit === "each" ? "each" : i.unit);
  const sizeVal = p.size ? r2(p.size / ((isNew ? UNITS[i.unit] : unitsFor(id))[shown] || 1)) : "";
  openSheet(isNew ? "New ingredient" : "Ingredient", `
    <label class="field"><span>Name</span><input id="i_name" value="${esc(i.name)}" placeholder="e.g. Mango puree"></label>
    <div class="two">
      <label class="field"><span>Measured in</span><select id="i_unit" ${used.length?"disabled":""}>${[["g","grams (g)"],["ml","milliliters (ml)"],["each","count (each)"]].map(([u,l])=>`<option value="${u}" ${i.unit===u?"selected":""}>${l}</option>`).join("")}</select></label>
      <label class="field"><span>Store aisle</span><select id="i_aisle">${AISLES.map(a=>`<option ${i.aisle===a?"selected":""}>${a}</option>`).join("")}</select></label>
    </div>
    ${used.length?`<p class="small" style="margin:-6px 0 12px">The unit can’t change while recipes use it.</p>`:""}
    <div class="group"><h4>What you buy</h4>
      <label class="field"><span>Package <small>(name, brand, size)</small></span><input id="i_label" value="${esc(p.label||"")}" placeholder="e.g. Daisy 16 oz tub"></label>
      <div class="two"><label class="field"><span>Package size</span><input id="i_size" inputmode="decimal" value="${sizeVal}" placeholder="0"></label>
        <label class="field"><span>Unit</span><select id="i_sunit"></select></label></div>
      <div class="two"><label class="field"><span>Price</span><input id="i_price" inputmode="decimal" value="${p.price!=null?r2(p.price):""}" placeholder="$0.00"></label>
        <label class="field"><span>Where / when <small>(optional)</small></span><input id="i_note" value="${esc(p.note||"")}" placeholder="e.g. Walmart, Nov 22"></label></div>
      <p class="small" id="i_cpu" style="margin:0"></p>
      ${p.hint?`<p class="small" style="margin:6px 0 0">${esc(p.hint)}</p>`:""}
    </div>
    <label class="toggle"><span>Usually in the pantry<small>Shows a “check pantry” reminder on the list</small></span><button class="switch ${i.pantry?"on":""}" id="i_pantry" role="switch"></button></label>
    ${isNew?"":`<label class="toggle"><span>Have it at home now<small>Leaves it off your shopping total</small></span><button class="switch ${have[id]?"on":""}" id="i_have" role="switch"></button></label>`}
    <button class="primary" id="i_save">${isNew?"Add ingredient":"Save"}</button>
    ${isNew?"":`<p class="small">${used.length?`Used in ${used.map(x=>esc(x.name)).join(", ")}.`:"Not used in any recipe."}</p>
      <div class="btnrow"><button class="ghostbtn danger" id="i_del">Delete ingredient</button></div>`}`, (b, close) => {
    const unitSel = b.querySelector("#i_unit"), su = b.querySelector("#i_sunit"), size = b.querySelector("#i_size"), price = b.querySelector("#i_price"), cpu = b.querySelector("#i_cpu");
    let pantry = !!i.pantry, hv = !isNew && !!have[id];
    const units = () => { const u = {...(UNITS[unitSel.value]||{})}; if (unitSel.value === "g" && i.tsp) { u.tsp = i.tsp; u.Tbsp = i.tsp*3; } return u; };
    const fillUnits = keep => { const u = units(); const want = keep && u[keep] ? keep : Object.keys(u)[0]; su.innerHTML = Object.keys(u).map(x => `<option ${x===want?"selected":""}>${x}</option>`).join(""); };
    const showCpu = () => { const s = num(size.value)*(units()[su.value]||1), pr = num(price.value);
      cpu.textContent = s > 0 && price.value !== "" ? `= ${r2(s)} ${unitSel.value} · $${(pr/s).toFixed(4)} per ${unitSel.value}` : "Add a size and price to include it in costs and totals."; };
    fillUnits(shown); showCpu();
    unitSel.onchange = () => { fillUnits(); showCpu(); }; su.onchange = showCpu; size.oninput = showCpu; price.oninput = showCpu;
    b.querySelector("#i_pantry").onclick = e => { pantry = !pantry; e.currentTarget.classList.toggle("on", pantry); };
    const hb = b.querySelector("#i_have"); if (hb) hb.onclick = e => { hv = !hv; e.currentTarget.classList.toggle("on", hv); };
    b.querySelector("#i_save").onclick = () => {
      const name = b.querySelector("#i_name").value.trim(); if (!name) { toast("Give it a name"); return; }
      const k = id || (db.ingredients[name] ? newId("i") : name);
      const s = num(size.value) * (units()[su.value] || 1), pr = price.value.trim() === "" ? null : num(price.value);
      const rec = isNew ? {} : db.ingredients[id];
      rec.name = name; rec.unit = unitSel.value; rec.aisle = b.querySelector("#i_aisle").value; rec.pantry = pantry;
      if (s > 0 && pr != null) rec.pkg = {...(rec.pkg||{}), size: s, price: pr, label: b.querySelector("#i_label").value.trim(), note: b.querySelector("#i_note").value.trim(), shown: su.value};
      else if (s <= 0 && pr == null && !b.querySelector("#i_label").value.trim()) delete rec.pkg;
      else { toast("Enter both a package size and a price"); return; }
      db.ingredients[k] = rec;
      if (!isNew) { if (hv) { have[k] = true; delete checked[k]; } else delete have[k]; saveState(); }
      saveDb(); close(); refreshAll(); toast(isNew ? "Ingredient added" : "Saved");
      if (onCreate) onCreate(k);
    };
    if (!isNew) confirmTap(b.querySelector("#i_del"), used.length ? "Remove it from the recipes first" : "Tap again to delete", () => {
      if (usedIn(id).length) return;
      delete db.ingredients[id]; if (DEFAULTS.ingredients[id]) db.deleted.ingredients.push(id); delete have[id]; delete checked[id];
      saveState(); saveDb(); close(); refreshAll(); toast("Ingredient deleted"); });
  });
}

// ---------- SETTINGS: backup / restore / reset ----------
function backupPayload(){ return {app:"CakeCart", backupVersion:1, savedAt:new Date().toISOString(), db, have}; }
function openSettings(){
  const last = store.get("lastBackup", null);
  const nR = Object.values(db.recipes).length, nI = Object.values(db.ingredients).filter(i=>!i.madeFrom).length;
  openSheet("Settings & backup", `
    <div class="card note2"><b>Your data lives on this phone.</b> ${nR} recipes and ${nI} ingredients. Make a backup now and then, and before switching phones.<br><span class="small" style="margin:0">${last ? `Last backup: ${new Date(last).toLocaleDateString()}` : "No backup made yet."}</span></div>
    <button class="primary" id="b_save"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>Save a backup file</button>
    <p class="small">Keep the file somewhere safe, like Google Drive or your email. To move your data to another phone, open CakeCart there and use Restore.</p>
    <div class="group"><h4>Restore from a backup</h4>
      <p class="small" style="margin:0 0 10px">Replaces the recipes, prices and pantry on this phone with the ones in the file.</p>
      <label class="ghostbtn filebtn">Choose backup file…<input type="file" id="b_file" accept=".json,application/json"></label></div>
    <div class="group"><h4>Start over</h4>
      <p class="small" style="margin:0 0 10px">Puts back the original recipes and prices from the spreadsheet. Your changes are lost unless you made a backup.</p>
      <button class="ghostbtn danger" id="b_reset">Reset to original data</button></div>`, (b, close) => {
    b.querySelector("#b_save").onclick = async () => {
      const name = `CakeCart-backup-${new Date().toISOString().slice(0,10)}.json`;
      const blob = new Blob([JSON.stringify(backupPayload(), null, 1)], {type:"application/json"});
      try {
        const file = new File([blob], name, {type:"application/json"});
        if (navigator.canShare && navigator.canShare({files:[file]})) { await navigator.share({files:[file], title:"CakeCart backup"}); }
        else { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
        store.set("lastBackup", Date.now()); toast("Backup saved"); close();
      } catch(e) { if (e && e.name !== "AbortError") toast("Couldn’t save the backup: " + (e.message || e)); }
    };
    b.querySelector("#b_file").onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try {
          const data = JSON.parse(rd.result);
          if (data.app !== "CakeCart" || !data.db || !data.db.recipes || !data.db.ingredients) throw new Error("This isn’t a CakeCart backup file.");
          db = data.db; have = data.have || {}; checked = {}; mergeDefaults(); cleanQty(); saveDb(); saveState(); close(); refreshAll();
          toast(`Restored ${Object.keys(db.recipes).length} recipes`);
        } catch(err) { toast(err.message || "Couldn’t read that file."); } };
      rd.readAsText(f);
    };
    confirmTap(b.querySelector("#b_reset"), "Tap again to reset everything", () => {
      db = clone(DEFAULTS); db.deleted = {recipes:[], ingredients:[]}; saveDb(); cleanQty(); saveState(); close(); refreshAll(); toast("Back to the original data"); });
  });
}

// ---------- navigation ----------
let view = "cakes";
function refreshAll(){
  cleanQty(); updateChrome();
  if (view === "cakes") { renderCats(); renderCakes(); }
  if (view === "list") renderList();
  if (view === "recipes") renderRecipes();
  if (view === "ingredients") renderIngredients();
}
function go(v){
  view = v;
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === v));
  document.querySelectorAll(".tabbar button").forEach(b => b.classList.toggle("on", b.dataset.go === v));
  refreshAll(); window.scrollTo(0, 0);
}
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
$("#make").onclick = () => go("list");
$("#uncheck").onclick = () => { checked = {}; saveState(); renderList(); };
$("#q").oninput = e => { query = e.target.value; renderCakes(); };
$("#rq").oninput = e => { rquery = e.target.value; renderRecipes(); };
$("#iq").oninput = e => { iquery = e.target.value; renderIngredients(); };
$("#newRecipe").onclick = () => editRecipeDetails(null);
$("#newIng").onclick = () => editIngredient(null);
$("#openSettings").onclick = openSettings;
$("#clearCakes").onclick = clearCakes;
document.addEventListener("keydown", e => { if (e.key === "Escape" && sheetStack.length) sheetStack[sheetStack.length-1].querySelector(".close").click(); });

refreshAll();
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
