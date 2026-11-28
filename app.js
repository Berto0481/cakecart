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
let qty = store.get("qty", {}), checked = store.get("checked", {}), have = store.get("have", {}), some = store.get("some", {});
const saveDb = () => { db.savedAt = Date.now(); if (!store.set("db", db)) toast("Couldn’t save on this device. Make a backup in Settings."); };
// ---------- photos: kept in the phone's IndexedDB, which has far more room than the main storage ----------
const Photos = (() => {
  const cache = {}; let dbp = null;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error("No photo storage"));
    const r = indexedDB.open("cakecart-photos", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("p");
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error || new Error("Photo storage unavailable"));
  }));
  const run = async (mode, fn) => { const d = await open(); return new Promise((res, rej) => {
    const t = d.transaction("p", mode); fn(t.objectStore("p")); t.oncomplete = () => res(true); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); };
  return {
    get: id => cache[id] || null,
    all: () => ({...cache}),
    async put(id, url){ await run("readwrite", s => s.put(url, id)); cache[id] = url; },
    async del(id){ try { await run("readwrite", s => s.delete(id)); } catch(e) {} delete cache[id]; },
    async replaceAll(map){ await run("readwrite", s => { s.clear(); for (const [k, v] of Object.entries(map)) s.put(v, k); }); for (const k in cache) delete cache[k]; Object.assign(cache, map); },
    async load(){ await run("readonly", s => { const c = s.openCursor(); c.onsuccess = () => { const cur = c.result; if (cur) { cache[cur.key] = cur.value; cur.continue(); } }; }); }
  };
})();
// Your own photo for a recipe: from photo storage, or (older versions / no IndexedDB) kept inside the recipe
const ownPhoto = id => Photos.get(id) || (db.recipes[id] && db.recipes[id].photo) || null;
// Move photos saved by older versions out of the main storage, so saving stays fast
async function startPhotos(){
  try {
    await Photos.load();
    let moved = 0;
    for (const [id, r] of Object.entries(db.recipes)) if (r.photo) { await Photos.put(id, r.photo); delete r.photo; moved++; }
    if (moved) saveDb();
  } catch(e) {}
  refreshAll();
}
const saveState = () => { store.set("qty", qty); store.set("checked", checked); store.set("have", have); store.set("some", some); };

// Add any built-in recipes or ingredients that are new in an app update, without touching your edits.
function mergeDefaults(){
  db.deleted = db.deleted || {recipes:[], ingredients:[]};
  let added = 0;
  for (const [id, ing] of Object.entries(DEFAULTS.ingredients))
    if (!db.ingredients[id] && !db.deleted.ingredients.includes(id)) { db.ingredients[id] = clone(ing); added++; }
  for (const [id, r] of Object.entries(DEFAULTS.recipes))
    if (!db.recipes[id] && !db.deleted.recipes.includes(id)) { db.recipes[id] = clone(r); added++; }
  for (const [id, r] of Object.entries(DEFAULTS.recipes)) {
    const mine = db.recipes[id];
    if (mine && r.steps && !mine.steps) { mine.steps = clone(r.steps); if (r.source && !mine.source) mine.source = r.source; added++; }
    if (mine && r.nameEs && !mine.nameEs && mine.name === r.name) { mine.nameEs = r.nameEs; added++; }
  }
  // v4: the original brownie recipe uses a 9×9 pan (about 16 brownies), not 9×13 / 24.
  // Only switch it if it's still on the old built-in setting, so your own changes are kept.
  const br = db.recipes["Cheesecake Brownies"];
  if ((db.version || 0) < 4 && br) {
    if (br.size === "9×13 pan") { br.size = "9×9 pan"; added++; }
    if (+br.pieces === 24) { br.pieces = 16; added++; }
  }
  if (br) {
    const s0 = br.steps && br.steps[0], OLD = "Heat the oven to 350°F (175°C). Line the pan with parchment, leaving some hanging over two sides. (The original recipe uses a 9×9\" pan.)";
    if (s0 && s0.t === OLD) { s0.t = DEFAULTS.recipes["Cheesecake Brownies"].steps[0].t; added++; }
  }
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
const CATS = ["Cheesecakes","Brownies","Tiramisu","Other"];

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
function photoFor(id, kind){
  const own = ownPhoto(id); if (own) return own;   // your own photo always wins
  const p = (typeof PHOTOS !== "undefined" && PHOTOS[id]) || {};
  return kind === "hero" ? p.hero : (p.slice || p.whole);
}
function thumb(r, id, kind){
  const src = id && photoFor(id, kind || "whole");
  if (src) return `<div class="thumb photo"><img src="${esc(src)}" alt="${esc(r.name)}" loading="lazy" decoding="async"></div>`;
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
// Gentle reminders at the top of the Cakes tab: back up now and then; on iPhone, install to the Home Screen
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const IS_STANDALONE = !!(navigator.standalone || (window.matchMedia && matchMedia("(display-mode: standalone)").matches));
function renderNudges(){
  const el = $("#nudges"); if (!el) return;
  const now = Date.now(), last = store.get("lastBackup", null), snooze = store.get("bkSnooze", 0);
  const used = (db.orders || []).length > 0 || !!db.savedAt, days = last ? Math.floor((now - last) / 864e5) : null;
  const items = [];
  if (IS_IOS && !IS_STANDALONE && !IS_APP && !store.get("iosTipDone", false))
    items.push(`<div class="nudge"><b>Keep CakeCart on your Home Screen</b><p>Safari can erase a website’s saved data if you don’t open it for 7 days. Apps on the Home Screen are kept. First tap ⚙ and <b>Save a backup file</b>. Then tap Share <span aria-hidden="true">⬆</span> → <b>Add to Home Screen</b>, open CakeCart from there and use <b>Restore</b> to bring your data over.</p>
      <div class="nbtns"><button class="ghostbtn" data-n="ios-backup">Back up first</button><button class="ghostbtn" data-n="ios-done">Got it</button></div></div>`);
  if (used && now > snooze && (days === null || days >= 14))
    items.push(`<div class="nudge"><b>${days === null ? "You haven’t made a backup yet" : `Last backup was ${days} days ago`}</b><p>A backup file keeps your recipes, prices, photos and orders safe if anything happens to this phone.</p>
      <div class="nbtns"><button class="primary" data-n="backup">Back up now</button><button class="ghostbtn" data-n="later">Later</button></div></div>`);
  el.innerHTML = items.join("");
  el.querySelectorAll("[data-n]").forEach(btn => btn.onclick = () => {
    const n = btn.dataset.n;
    if (n === "backup" || n === "ios-backup") openSettings();
    if (n === "later") { store.set("bkSnooze", now + 3 * 864e5); renderNudges(); }
    if (n === "ios-done") { store.set("iosTipDone", true); renderNudges(); }
  });
}
function renderCakes(){
  const q = query.trim().toLowerCase();
  const list = cakeIds().filter(id => { const r = db.recipes[id];
    return (cat==="All" || (cat==="Selected" ? qty[id] : r.cat===cat)) && (!q || (r.name+" "+(r.desc||"")).toLowerCase().includes(q)); });
  const el = $("#cakeList");
  if (!list.length) { el.innerHTML = `<div class="empty">${cat==="Selected"?"No cakes picked yet.":"No cakes match that search."}</div>`; return; }
  el.innerHTML = list.map(id => { const r = db.recipes[id], k = qty[id] || 0;
    return `<div class="cake ${k?"sel":""}" data-id="${esc(id)}">${thumb(r, id, "slice")}
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
function setQty(id, k){ if (k > 0) qty[id] = k; else delete qty[id]; checked = {}; some = {}; saveState(); renderCakes(); updateChrome(); }
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
  const prevQty = {...qty}, prevChecked = {...checked}, prevSome = {...some};
  qty = {}; checked = {}; some = {}; saveState(); if (cat === "Selected") { cat = "All"; renderCats(); } renderCakes(); updateChrome();
  toast(`Cleared ${t} cake${t>1?"s":""}`, "Undo", () => { qty = prevQty; checked = prevChecked; some = prevSome; saveState(); renderCakes(); updateChrome(); });
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
      for (const s of r.sections) for (const it of s.items) add(it.ing, it.amt*f, `${forName} (${r.name.toLowerCase()})`, depth+1);
      return;
    }
    tot[id] = (tot[id]||0) + amt; (used[id] = used[id] || new Set()).add(forName);
  }
  for (const [id, k] of Object.entries(qty)) { const r = db.recipes[id]; if (!r) continue;
    const who = k > 1 ? `${short(r)} ×${k}` : short(r);
    for (const s of r.sections) for (const it of s.items) add(it.ing, it.amt*k, who, 0); }
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
  const rem = id => Math.max(0, tot[id] - (some[id] || 0));
  const covered = id => some[id] > 0 && rem(id) <= tot[id] * 0.005;
  const isHave = id => !!have[id] || covered(id);
  const toBuy = ids.filter(id => !isHave(id)), haveL = ids.filter(isHave);
  let bill = 0; const unpriced = [];
  toBuy.forEach(id => { const b = buy(id, rem(id)); if (b) bill += b.cost; else unpriced.push(ingName(id)); });
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
  const show = id => filter==="all" || (filter==="buy" ? !isHave(id) : isHave(id));
  let any = false;
  for (const a of AISLES) {
    const vis = ids.filter(id => (AISLES.includes(ING(id)?.aisle) ? ING(id).aisle : "Other") === a && show(id)).sort((x,y) => ingName(x).localeCompare(ingName(y)));
    if (!vis.length) continue; any = true;
    h += `<div class="aisle">${esc(a)}</div><div class="card items">` + vis.map(item).join("") + `</div>`;
  }
  if (!any) h += `<div class="card empty">${filter==="have"?"Nothing marked as “Have it” yet.":"Everything’s marked as already at home."}</div>`;
  for (const [n, hm] of Object.entries(homemade)) h += `<p class="small">Includes the ingredients for ${Math.round(hm.amt)} ${esc(hm.unit)} of homemade ${esc(n.toLowerCase())}${hm.yield>0?` (≈ ${r1(hm.amt/hm.yield)} batches)`:""}.</p>`;
  if (unpriced.length) h += `<p class="small">No price yet for: ${unpriced.map(esc).join(", ")}. Add prices in Ingredients to include them.</p>`;
  h += `<p class="small">Totals use your saved prices for the whole packages you buy, before tax. Tap “Have it” on anything already at home, or “Have some” to say how much you have, and the total updates. “Have some” amounts are just for this trip.</p>`;
  body.innerHTML = h; $("#total").textContent = money(bill); $("#uncheck").classList.toggle("idle", !inCart);

  function item(id){
    const hv = isHave(id), part = some[id] > 0 && !have[id], b = buy(id, rem(id)), dn = !!checked[id] && !hv, ing = ING(id) || {};
    return `<div class="item ${dn?"done":""} ${hv?"have":""}" data-id="${esc(id)}">
      <button class="box" aria-label="In the cart" style="${hv?"visibility:hidden":""}"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></button>
      <div class="iinfo">
        <div class="iname">${esc(ingName(id))}${ing.pantry&&!hv?`<span class="tag">check pantry</span>`:""}</div>
        <div class="ineed">Need ${esc(need(id, tot[id]))}</div>
        ${part ? `<div class="ihave">You have ${esc(need(id, some[id]))}${covered(id) ? " · that’s enough" : ` · still need ${esc(need(id, rem(id)))}`}</div>` : ""}
        ${b && !hv ? `<div class="ibuy">Buy ${b.packs} × ${esc(b.lab)}${b.packs>1?` · ${money(b.price)} each`:""}</div>` : ""}
        <div class="ifor"><svg viewBox="0 0 24 24"><path d="M4 18h16M6 18v-6l6-4 6 4v6"/></svg>For ${[...used[id]].map(esc).join(", ")}</div>
      </div>
      <div class="iright">
        ${hv ? `<span class="price na">—</span>` : b ? `<span class="price">${money(b.cost)}</span>` : `<span class="price na">no price</span>`}
        ${part ? "" : `<button class="pill ${have[id]?"yes":""}">${have[id]?"✓ Have it":"Have it"}</button>`}
        ${have[id] ? "" : `<button class="pill some ${part?"yes":""}">${part?"✓ Have some":"Have some"}</button>`}
      </div></div>`;
  }
  body.querySelectorAll(".seg .chip").forEach(c => c.onclick = () => { filter = c.dataset.f; renderList(); });
  body.querySelectorAll(".item").forEach(row => { const id = row.dataset.id;
    const tog = () => { if (have[id]) return; if (checked[id]) delete checked[id]; else checked[id] = true; saveState(); renderList(); };
    row.querySelector(".box").onclick = tog; row.querySelector(".iinfo").onclick = tog;
    const hp = row.querySelector(".pill:not(.some)");
    if (hp) hp.onclick = () => { if (have[id]) delete have[id]; else { have[id] = true; delete checked[id]; delete some[id]; } saveState(); renderList(); };
    const sp = row.querySelector(".pill.some");
    if (sp) sp.onclick = () => haveSome(id, tot[id]);
  });
}
// "Have some": how much of this ingredient is at home right now (just for this shopping trip)
function haveSome(id, needed){
  const ing = ING(id) || {}, p = ing.pkg;
  const opts = [];
  if (id === "Cream cheese (brick)") opts.push(["bricks (8 oz)", 226.8]);
  if (id === "Butter") opts.push(["sticks", 113.4]);
  if (id === "Eggs (large)") opts.push(["eggs", 1]);
  if (id === "Oreo cookies") opts.push(["cookies", 1]);
  if (p && p.size > 0) opts.push([`× ${p.label || "package"}`, p.size]);
  for (const [u, f] of Object.entries(unitsFor(id))) if (!opts.some(o => o[1] === f && o[0].startsWith(u))) opts.push([u, f]);
  const cur = some[id] || 0, first = opts[0];
  const startVal = cur ? r2(cur / first[1]) : "";
  openSheet("Have some", `
    <p class="small" style="margin:0 0 12px"><b style="color:var(--ink);font-size:16px">${esc(ingName(id))}</b><br>This trip needs ${esc(need(id, needed))}.</p>
    <div class="two"><label class="field"><span>How much do you have?</span><input id="s_amt" inputmode="decimal" value="${startVal}" placeholder="0"></label>
      <label class="field"><span>Unit</span><select id="s_unit">${opts.map(([l], i) => `<option value="${i}">${esc(l)}</option>`).join("")}</select></label></div>
    <p class="small" id="s_res" style="margin:0 0 12px"></p>
    <button class="primary" id="s_save">Save</button>
    ${cur ? `<div class="btnrow"><button class="ghostbtn" id="s_clear">Clear, I have none</button></div>` : ""}`, (b, close) => {
    const amt = b.querySelector("#s_amt"), un = b.querySelector("#s_unit"), res = b.querySelector("#s_res");
    const val = () => num(amt.value) * opts[+un.value][1];
    const show = () => { const v = val(), left = Math.max(0, needed - v), bb = buy(id, left);
      res.textContent = !v ? "" : left <= needed*0.005 ? "That covers it, so nothing to buy." :
        `Still need ${need(id, left)}${bb ? ` → buy ${bb.packs} × ${bb.lab} (${money(bb.cost)})` : ""}.`; };
    amt.oninput = show; un.onchange = show; show(); setTimeout(() => amt.focus(), 250);
    b.querySelector("#s_save").onclick = () => { const v = val(); if (v > 0) { some[id] = v; delete checked[id]; } else delete some[id]; saveState(); close(); renderList(); };
    const c = b.querySelector("#s_clear"); if (c) c.onclick = () => { delete some[id]; saveState(); close(); renderList(); };
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
    h += `<button class="cake rcard" data-id="${esc(id)}">${thumb(r, id, "slice")}<div class="cinfo"><h3>${esc(r.name)}</h3><div class="kvs">${line}</div>${miss?`<p class="warn">${miss} ingredient${miss>1?"s":""} without a price</p>`:""}</div><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>`;
  }
  h += `</div>`;
  $("#recipeList").innerHTML = h;
  $("#recipeList").querySelectorAll(".rcard").forEach(b => b.onclick = () => openRecipe(b.dataset.id));
}
function recipeHtml(id){
  const r = db.recipes[id]; if (!r) return "";
  const hero = photoFor(id, "hero");
  let h = hero ? `<div class="hero"><img src="${esc(hero)}" alt="${esc(r.name)}"></div>` : "";
  h += `<div class="rhead ${hero?"withhero":""}">${hero?"":thumb(r, id, "whole")}<div><h2>${esc(r.name)}</h2><p>${esc(r.desc||"")}</p><span class="tag">${esc(r.sub?"Homemade ingredient":r.cat||"Other")}</span></div></div>`;
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
  const steps = r.steps || [];
  h += `<div class="sechead"><button class="linkish" id="editSteps">Steps<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></button></div>`;
  if (steps.length) {
    h += `<button class="primary bakebtn" id="startBake"><svg viewBox="0 0 24 24"><path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3-1-3 0-6 1-8z"/></svg>Start baking</button>
      <div class="card steps">` + steps.map((s, i) => `<div class="step"><span class="snum">${i+1}</span><div>${esc(s.t)}${s.min?`<span class="stimer"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>${fmtMin(s.min)}</span>`:""}</div></div>`).join("") + `</div>`;
  } else h += `<div class="card empty" style="padding:18px">No steps yet. <button class="linkbtn2" id="editSteps2">Add steps</button></div>`;
  if (r.source) h += `<a class="srclink" href="${esc(r.source)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>Original recipe, with the author's full tips</a>`;
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
  body.querySelector("#editSteps").onclick = () => editSteps(id, rerender);
  const es2 = body.querySelector("#editSteps2"); if (es2) es2.onclick = () => editSteps(id, rerender);
  const sb = body.querySelector("#startBake"); if (sb) sb.onclick = () => startBaking(id);
  body.querySelector("#dupRecipe").onclick = () => {
    const nid = newId("r"), c = clone(r); c.name = r.name + " (copy)"; db.recipes[nid] = c; saveDb(); close();
    toast("Recipe duplicated"); setTimeout(() => openRecipe(nid), 250);
  };
  confirmTap(body.querySelector("#delRecipe"), "Tap again to delete", () => {
    const madeOf = Object.entries(db.ingredients).find(([, i]) => i.madeFrom === id);
    if (madeOf && usedIn(madeOf[0]).length) { toast(`Used as ${madeOf[1].name} in other recipes. Remove it there first.`); return; }
    if (madeOf) delete db.ingredients[madeOf[0]];
    delete db.recipes[id]; Photos.del(id); if (DEFAULTS.recipes[id]) db.deleted.recipes.push(id);
    delete qty[id]; saveState(); saveDb(); close(); toast("Recipe deleted");
  });
}
function editRecipeDetails(id, done){
  const r = db.recipes[id], isNew = !r;
  const v = r || {name:"", desc:"", cat:"Cheesecakes"};
  const catOpts = [...CATS, "Homemade ingredient"].map(c => `<option ${((v.sub?"Homemade ingredient":v.cat)===c)?"selected":""}>${c}</option>`).join("");
  openSheet(isNew ? "New recipe" : "Edit details", `
    <label class="field"><span>Name</span><input id="d_name" value="${esc(v.name)}" placeholder="e.g. Mango Cheesecake"></label>
    <label class="field"><span>Name in Spanish <small>(receipts &amp; menu, optional)</small></span><input id="d_namees" value="${esc(v.nameEs||"")}" placeholder="e.g. Cheesecake de mango"></label>
    <label class="field"><span>Short description</span><input id="d_desc" value="${esc(v.desc||"")}" placeholder="Shown under the name"></label>
    <label class="field"><span>Type</span><select id="d_cat">${catOpts}</select></label>
    <div id="d_more"></div>
    <div class="field" id="d_photoF"><span>Your photo <small>(a slice of your own cake, for the app and the menu)</small></span>
      <div class="logorow"><div class="logoprev photoprev" id="d_pprev"></div>
        <div class="logobtns"><label class="ghostbtn filebtn">Choose photo…<input type="file" id="d_photo" accept="image/*"></label>
        <button class="ghostbtn danger" id="d_rmphoto">Remove</button></div></div></div>
    <button class="primary" id="d_save">${isNew?"Create recipe":"Save"}</button>`, (b, close) => {
    let photo = (id && ownPhoto(id)) || "", photoChanged = false;
    const paintP = () => {
      b.querySelector("#d_pprev").innerHTML = photo ? `<img src="${photo}" alt="Your photo">` : `<span>No photo</span>`;
      b.querySelector("#d_rmphoto").style.display = photo ? "" : "none";
      b.querySelector("#d_photoF").style.display = b.querySelector("#d_cat").value === "Homemade ingredient" ? "none" : "";
    };
    b.querySelector("#d_photo").onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { photo = await shrinkImage(f, 900, "image/jpeg", 0.82); photoChanged = true; paintP(); } catch(err) { toast(err.message); }
      e.target.value = "";
    };
    b.querySelector("#d_rmphoto").onclick = () => { photo = ""; photoChanged = true; paintP(); };
    const more = () => {
      const sub = b.querySelector("#d_cat").value === "Homemade ingredient", pan = b.querySelector("#d_cat").value === "Brownies", tira = b.querySelector("#d_cat").value === "Tiramisu";
      b.querySelector("#d_more").innerHTML = sub
        ? `<div class="two"><label class="field"><span>One batch makes</span><input id="d_yield" inputmode="decimal" value="${r2(v.yield||236)}"></label>
           <label class="field"><span>Unit</span><select id="d_yu">${["ml","g","each"].map(u=>`<option ${(v.yieldUnit||"ml")===u?"selected":""}>${u}</option>`).join("")}</select></label></div>
           <p class="small" style="margin:0 0 12px">It becomes an ingredient you can add to other recipes, priced from this recipe.</p>`
        : `<div class="two"><label class="field"><span>Sold as</span><input id="d_size" value="${esc(v.size || (pan?"9×9 pan":tira?"8×8 dish":"9\" cheesecake"))}"></label>
           <label class="field"><span>Cut into</span><input id="d_piece" value="${esc(v.piece || (pan?"brownie":"slice"))}"></label></div>`;
    };
    b.querySelector("#d_cat").onchange = () => { more(); paintP(); }; more(); paintP();
    b.querySelector("#d_save").onclick = async () => {
      const name = b.querySelector("#d_name").value.trim(); if (!name) { toast("Give it a name"); return; }
      const type = b.querySelector("#d_cat").value, sub = type === "Homemade ingredient";
      const rid = id || newId("r");
      const rec = r || {sections:[{title:"Ingredients", items:[]}], markup:3, packaging:0, pieces: type==="Brownies"?16:type==="Tiramisu"?9:12,
        look: LOOKS[Object.keys(db.recipes).length % LOOKS.length]};
      rec.name = name; rec.desc = b.querySelector("#d_desc").value.trim();
      const nes = b.querySelector("#d_namees").value.trim(); if (nes) rec.nameEs = nes; else delete rec.nameEs;
      if (sub) {
        rec.sub = true; rec.cat = "Homemade"; rec.yield = num(b.querySelector("#d_yield").value) || 1; rec.yieldUnit = b.querySelector("#d_yu").value;
        let ingId = Object.keys(db.ingredients).find(k => db.ingredients[k].madeFrom === rid);
        if (!ingId) { ingId = newId("i"); db.ingredients[ingId] = {name, unit: rec.yieldUnit, aisle:"Homemade", madeFrom: rid}; }
        else { db.ingredients[ingId].name = name; db.ingredients[ingId].unit = rec.yieldUnit; }
      } else {
        delete rec.sub; rec.cat = type; rec.per = type === "Brownies" || type === "Tiramisu" ? "pan" : type === "Cheesecakes" ? "cheesecake" : (rec.per && rec.per !== "cheesecake" ? rec.per : "cake");
        rec.size = b.querySelector("#d_size").value.trim(); rec.piece = b.querySelector("#d_piece").value.trim() || "slice";
        if (rec.markup == null) rec.markup = 3; if (rec.pieces == null) rec.pieces = 12; if (rec.packaging == null) rec.packaging = 0;
      }
      db.recipes[rid] = rec;
      if (photoChanged || sub) {
        if (photo && !sub) {
          try { await Photos.put(rid, photo); delete rec.photo; }
          catch(e) { rec.photo = photo; if (!store.set("db", db)) { delete rec.photo; toast("Your phone’s storage for CakeCart is full, so the photo wasn’t saved"); } }
        } else { await Photos.del(rid); delete rec.photo; }
      }
      saveDb(); close(); refreshAll();
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
  const f = [["all",`All (${ids.length})`],["have",`At home (${nHave})`],["noprice",`No price (${nNo})`]];
  $("#ingFilters").innerHTML = f.map(([k,l]) => `<button class="chip ${ifilter===k?"on":""}" data-f="${k}">${l}</button>`).join("");
  $("#ingFilters").querySelectorAll(".chip").forEach(c => c.onclick = () => { ifilter = c.dataset.f; renderIngredients(); });
}
function renderIngredients(){
  renderIngFilters();
  $("#clearHave").classList.toggle("idle", !Object.keys(have).length);
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


// ---------- ORDERS ----------
let hideMoney = store.get("hideMoney", false);
const EYE = '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF = '<svg viewBox="0 0 24 24"><path d="M3 3l18 18M10.6 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
const DOTS = "$•••.••";
const mm = x => hideMoney ? DOTS : money(x);
function paintEye(){ const b = $("#moneyToggle"); if (!b) return; b.innerHTML = (hideMoney ? EYE : EYE_OFF) + `<span>${hideMoney ? "Show" : "Hide"}</span>`; b.classList.toggle("on", hideMoney);
  b.setAttribute("aria-label", hideMoney ? "Show business numbers" : "Hide business numbers"); }
let ofilter = "upcoming", omonth = (() => { const d = new Date(); return [d.getFullYear(), d.getMonth()]; })();
const ORDERS = () => (db.orders = db.orders || []);
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const parseDay = s => { const [y,m,d] = (s||"").split("-").map(Number); return y ? new Date(y, m-1, d) : null; };
const fmtDay = s => { const d = parseDay(s); return d ? d.toLocaleDateString(undefined, {weekday:"short", month:"short", day:"numeric"}) : "No date"; };
const orderTotal = o => o.items.reduce((a, it) => a + num(it.price) * num(it.qty), 0);
const orderCost = o => o.items.reduce((a, it) => a + num(it.cost) * num(it.qty), 0);
// Gifts and samples: you still bake (and shop for) them, but they're not sales, so they stay out of profit
const isFree = o => o.kind === "gift" || o.kind === "sample";
// Payments: paid in full, or a deposit so far; and how they paid
const PAY = {cash:"Cash", ath:"ATH Móvil", card:"Card", other:"Other"}, PAY_ES = {cash:"Efectivo", ath:"ATH Móvil", card:"Tarjeta", other:"Otro"};
const amountPaid = o => isFree(o) ? 0 : o.paid ? orderTotal(o) : Math.min(num(o.deposit), orderTotal(o));
const balanceDue = o => isFree(o) ? 0 : Math.max(0, orderTotal(o) - amountPaid(o));
const KIND_LABEL = {gift: "Gift", sample: "Sample"};
const orderLine = o => o.items.map(it => `${it.qty} × ${(db.recipes[it.recipe]?.name || it.name || "Cake").replace(/ Cheesecake$/,"")}`).join(" · ");
function daysUntil(s){ const d = parseDay(s); if (!d) return null; const t = parseDay(todayStr()); return Math.round((d - t) / 86400000); }
function dueLabel(o){
  if (o.done) return `<span class="badge done">Delivered</span>`;
  const n = daysUntil(o.due); if (n == null) return "";
  if (n < 0) return `<span class="badge late">${-n} day${n<-1?"s":""} late</span>`;
  if (n === 0) return `<span class="badge soon">Today</span>`;
  if (n === 1) return `<span class="badge soon">Tomorrow</span>`;
  return n <= 7 ? `<span class="badge">In ${n} days</span>` : "";
}
function renderOrders(){
  const all = ORDERS(), [y, m] = omonth;
  const inMonth = all.filter(o => { const d = parseDay(o.due); return d && d.getFullYear() === y && d.getMonth() === m; });
  const sold = inMonth.filter(o => !isFree(o)), free = inMonth.filter(isFree);
  const sales = sold.reduce((a,o) => a + orderTotal(o), 0), cost = sold.reduce((a,o) => a + orderCost(o), 0);
  const paid = sold.reduce((a,o) => a + amountPaid(o), 0);
  const freeCakes = free.reduce((a,o) => a + o.items.reduce((b,it) => b + num(it.qty), 0), 0), freeCost = free.reduce((a,o) => a + orderCost(o), 0);
  const cakes = inMonth.reduce((a,o) => a + o.items.reduce((b,it) => b + num(it.qty), 0), 0);
  const monthExp = (db.expenses || []).filter(e => { const d = parseDay(e.date); return d && d.getFullYear() === y && d.getMonth() === m; }).reduce((a, e) => a + num(e.amount), 0);
  const monthName = new Date(y, m, 1).toLocaleDateString(undefined, {month:"long", year:"numeric"});
  const upcoming = all.filter(o => !o.done).sort((a,b) => (a.due||"9").localeCompare(b.due||"9"));
  const list = ofilter === "upcoming" ? upcoming : ofilter === "done" ? all.filter(o => o.done).sort((a,b) => (b.due||"").localeCompare(a.due||"")) : [...all].sort((a,b) => (b.due||"").localeCompare(a.due||""));
  let h = `<div class="card month">
      <div class="mhead"><button class="icon" id="mPrev" aria-label="Previous month"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><b>${esc(monthName)}</b><button class="icon" id="mNext" aria-label="Next month"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button></div>
      <div class="mgrid">
        <div><small>Sales</small><b>${mm(sales)}</b></div>
        <div><small>Costs</small><b>${mm(cost)}</b></div>
        <div><small>Profit</small><b class="hot">${mm(sales - cost)}</b></div>
      </div>
      <div class="msub">${sold.length} order${sold.length===1?"":"s"} · ${cakes - freeCakes} cake${cakes-freeCakes===1?"":"s"} · Paid ${mm(paid)}${sales-paid>0.005?` · <span class="warnc">Unpaid ${mm(sales-paid)}</span>`:""}</div>
      ${free.length ? `<div class="msub freesub">Gifts &amp; samples: ${freeCakes} cake${freeCakes===1?"":"s"} · cost you ${mm(freeCost)} · not counted in profit</div>` : ""}
      ${monthExp ? `<div class="msub">Other expenses ${mm(monthExp)} · <b>after expenses ${mm(sales - cost - monthExp)}</b></div>` : ""}
    </div>`;
  if (upcoming.length) h += `<button class="primary shopbtn" id="shopUpcoming"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11h10.2L20 8H7"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/></svg>Shop for upcoming orders</button>`;
  h += `<div class="btnrow obtns"><button class="ghostbtn" id="openCustomers"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/></svg>Customers</button><button class="ghostbtn" id="openReport"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>Report</button></div>`;
  h += `<div class="seg">
      <button class="chip ${ofilter==="upcoming"?"on":""}" data-f="upcoming">Upcoming (${upcoming.length})</button>
      <button class="chip ${ofilter==="done"?"on":""}" data-f="done">Delivered (${all.length-upcoming.length})</button>
      <button class="chip ${ofilter==="all"?"on":""}" data-f="all">All (${all.length})</button>
    </div>`;
  if (!list.length) h += `<div class="card empty">${all.length ? "Nothing here." : "No orders yet. Tap + to add your first one."}</div>`;
  else h += `<div class="olist">` + list.map(o => { const tot = orderTotal(o), pr = tot - orderCost(o);
    return `<button class="card ocard ${o.done?"isdone":""}" data-id="${esc(o.id)}">
      <div class="otop"><span class="odate">${esc(fmtDay(o.due))}${o.method?` <span class="omethod">· ${o.method==="delivery"?"Delivery":"Pickup"}</span>`:""}</span>${dueLabel(o)}</div>
      <div class="oname">${esc(o.customer || "No name")}</div>
      <div class="oitems">${esc(orderLine(o))}</div>
      <div class="obot">${isFree(o) ? `<span class="badge free">${KIND_LABEL[o.kind]}</span><span class="omoney"><b class="freeb">Free</b><small>cost ${mm(orderCost(o))}</small></span>`
        : `<span class="badge ${o.paid?"paid":num(o.deposit)>0?"deposit":"unpaid"}">${o.paid?`Paid${o.pay?` · ${PAY[o.pay]}`:""}`:num(o.deposit)>0?`Deposit ${mm(amountPaid(o))} · owes ${mm(balanceDue(o))}`:"Not paid"}</span><span class="omoney"><b>${mm(tot)}</b><small>profit ${mm(pr)}</small></span>`}</div>
    </button>`; }).join("") + `</div>`;
  $("#ordersBody").innerHTML = h;
  if ($("#mPrev")) $("#mPrev").onclick = () => { omonth = m === 0 ? [y-1, 11] : [y, m-1]; renderOrders(); };
  if ($("#mNext")) $("#mNext").onclick = () => { omonth = m === 11 ? [y+1, 0] : [y, m+1]; renderOrders(); };
  $("#ordersBody").querySelectorAll(".seg .chip").forEach(c => c.onclick = () => { ofilter = c.dataset.f; renderOrders(); });
  $("#ordersBody").querySelectorAll(".ocard").forEach(c => c.onclick = () => editOrder(c.dataset.id));
  const sb = $("#shopUpcoming"); if (sb) sb.onclick = () => pickShopOrders(upcoming);
  $("#openCustomers").onclick = openCustomers; $("#openReport").onclick = openReport;
  updateOrderBadge(); paintEye();
}
// Choose which upcoming orders to shop for; the next 7 days are ticked to start
function pickShopOrders(upcoming){
  const today = parseDay(todayStr()), within = (o, days) => { const d = parseDay(o.due); return d && (d - today) / 864e5 <= days; };
  const pick = new Set(upcoming.filter(o => within(o, 7)).map(o => o.id));
  if (!pick.size) upcoming.forEach(o => pick.add(o.id));
  const cakesIn = o => o.items.reduce((a, it) => a + num(it.qty), 0);
  openSheet("Shop for orders", `<p class="small" style="margin:0 0 12px">Pick the orders to buy ingredients for. Your Shopping list will be replaced; you can undo.</p>
    <div class="chips shopquick"><button class="chip" data-q="7">Next 7 days</button><button class="chip" data-q="14">Next 14 days</button><button class="chip" data-q="all">All</button></div>
    <div class="pickl" id="sp_list"></div>
    <button class="primary" id="sp_go"></button>`, (b, close) => {
    const paint = () => {
      b.querySelector("#sp_list").innerHTML = upcoming.map(o => `<button class="pickrow ${pick.has(o.id)?"on":""}" data-id="${esc(o.id)}">
        <span class="pickbox" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
        <span class="picktxt"><b>${esc(o.customer || "No name")}</b><small>${esc(fmtDay(o.due))} · ${esc(orderLine(o))}</small></span></button>`).join("");
      b.querySelectorAll(".pickrow").forEach(r => r.onclick = () => { pick.has(r.dataset.id) ? pick.delete(r.dataset.id) : pick.add(r.dataset.id); paint(); });
      const chosen = upcoming.filter(o => pick.has(o.id)), n = chosen.reduce((a, o) => a + cakesIn(o), 0);
      const go = b.querySelector("#sp_go"); go.disabled = !chosen.length;
      go.textContent = chosen.length ? `Make shopping list · ${n} cake${n===1?"":"s"}` : "Pick at least one order";
    };
    b.querySelectorAll("[data-q]").forEach(c => c.onclick = () => { pick.clear(); upcoming.filter(o => c.dataset.q === "all" || within(o, +c.dataset.q)).forEach(o => pick.add(o.id)); paint(); });
    b.querySelector("#sp_go").onclick = () => { const chosen = upcoming.filter(o => pick.has(o.id)); if (!chosen.length) return; close(); shopForOrders(chosen); };
    paint();
  });
}
function shopForOrders(list){
  const prev = {qty:{...qty}, checked:{...checked}, some:{...some}};
  qty = {}; checked = {}; some = {};
  for (const o of list) for (const it of o.items) if (db.recipes[it.recipe] && !db.recipes[it.recipe].sub) qty[it.recipe] = (qty[it.recipe]||0) + num(it.qty);
  saveState(); go("list");
  toast(`Shopping list made from ${list.length} order${list.length>1?"s":""}`, "Undo", () => { qty = prev.qty; checked = prev.checked; some = prev.some; saveState(); refreshAll(); });
}
function editOrder(oid, preset){
  const isNew = !oid, src = isNew ? null : ORDERS().find(o => o.id === oid);
  if (!isNew && !src) return;
  const o = clone(src || {id:newId("o"), customer:"", due:"", items:[], paid:false, done:false, notes:""});
  if (isNew && preset) { o.customer = preset.customer || ""; if (preset.method) o.method = preset.method; if (preset.kind) o.kind = preset.kind;
    for (const it of preset.items || []) { const n = addItem(it.recipe); n.qty = it.qty; o.items.push(n); } }
  const custNote = () => { const id = findCustomer(o.customer), c = id && CUSTOMERS()[id]; return c && c.notes ? `<div class="cnotecard"><b>Notes for ${esc(c.name)}</b>${esc(c.notes)}</div>` : ""; };
  const cakeOpts = sel => cakeIds().map(id => `<option value="${esc(id)}" ${id===sel?"selected":""}>${esc(db.recipes[id].name)}</option>`).join("");
  const body = () => `
    <label class="field"><span>Customer</span><input id="o_cust" value="${esc(o.customer)}" placeholder="e.g. Maria" list="o_custlist" autocomplete="off"></label>
    <datalist id="o_custlist">${Object.values(CUSTOMERS()).map(c => `<option value="${esc(c.name)}"></option>`).join("")}</datalist>
    <div id="o_cnote">${custNote()}</div>
    <label class="field"><span>Due date</span><input id="o_due" type="date" value="${esc(o.due)}"></label>
    <div class="field"><span>How they get it</span><div class="seg2">
      <button type="button" class="chip ${o.method==="pickup"?"on":""}" data-m="pickup">Pickup</button>
      <button type="button" class="chip ${o.method==="delivery"?"on":""}" data-m="delivery">Delivery</button></div></div>
    <div class="field"><span>Type of order</span><div class="seg2 kindseg">
      <button type="button" class="chip ${!isFree(o)?"on":""}" data-k="">Sale</button>
      <button type="button" class="chip ${o.kind==="gift"?"on":""}" data-k="gift">Gift</button>
      <button type="button" class="chip ${o.kind==="sample"?"on":""}" data-k="sample">Sample</button></div>
      ${isFree(o) ? `<p class="small" style="margin:6px 0 0">Not charged. It still goes on your shopping list and reminders, but stays out of sales and profit.</p>` : ""}</div>
    <div class="group"><h4>Cakes</h4>
      ${o.items.length ? "" : `<p class="small" style="margin:0 0 10px">No cakes yet.</p>`}
      ${o.items.map((it, i) => `<div class="oitem" data-i="${i}">
        <select class="o_rec">${cakeOpts(it.recipe)}</select>
        <div class="orow"><div class="stepper sm"><button class="minus" aria-label="One less"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button><output>${it.qty}</output><button class="plus" aria-label="One more"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>
          ${isFree(o) ? `<span class="inl freeinl">Free</span>` : `<span class="inl"><em>$</em>${hideMoney ? `<input class="num o_price masked" value="•••" disabled data-v="${r2(num(it.price))}">` : `<input class="num o_price" inputmode="decimal" value="${r2(num(it.price))}">`}<em>each</em></span>`}
          <button class="icon odel" aria-label="Remove"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
        <p class="small" style="margin:4px 0 0">${isFree(o) ? "" : `Suggested ${mm(pricing(db.recipes[it.recipe]||{sections:[]}).price)} · `}costs you ${mm(num(it.cost))}</p>
      </div>`).join("")}
      <button class="addline" id="o_add"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add a cake</button>
    </div>
    ${isFree(o) ? `<div class="card pricing">
      <div class="prow2 big"><span>Cost to make</span><b>${mm(orderCost(o))}</b></div>
      <div class="prow2"><span>Counted in profit</span><b>No</b></div>
    </div>` : `<div class="card pricing">
      <div class="prow2"><span>Total charged</span><b class="hot">${mm(orderTotal(o))}</b></div>
      <div class="prow2"><span>Your cost</span><b>${mm(orderCost(o))}</b></div>
      <div class="prow2 big"><span>Profit</span><b>${mm(orderTotal(o) - orderCost(o))}</b></div>
    </div>
    <div class="group paygroup"><h4>Payment</h4>
      <label class="toggle"><span>Paid in full</span><button class="switch ${o.paid?"on":""}" id="o_paid" role="switch"></button></label>
      ${o.paid ? "" : `<label class="field"><span>Deposit received <small>(optional)</small></span><div class="inl depinl"><em>$</em>${hideMoney ? `<input class="num masked" id="o_dep" value="•••" disabled data-v="${r2(num(o.deposit))}">` : `<input class="num" id="o_dep" inputmode="decimal" value="${num(o.deposit) > 0 ? r2(num(o.deposit)) : ""}" placeholder="0">`}</div></label>`}
      <div class="field"><span>Paid with</span><div class="seg2 payseg">${Object.entries(PAY).map(([k, v]) => `<button type="button" class="chip ${o.pay===k?"on":""}" data-pay="${k}">${v}</button>`).join("")}</div></div>
      <div class="prow2 big balrow"><span>Balance due</span><b class="${balanceDue(o) > 0.005 ? "warnc" : ""}">${mm(balanceDue(o))}</b></div>
    </div>`}
    <label class="toggle"><span>Delivered<small>Moves it out of Upcoming</small></span><button class="switch ${o.done?"on":""}" id="o_done" role="switch"></button></label>
    <label class="field"><span>Notes <small>(optional)</small></span><input id="o_notes" value="${esc(o.notes||"")}" placeholder="e.g. Happy birthday writing, pickup 3pm"></label>
    <button class="primary" id="o_save">${isNew?"Save order":"Save"}</button>
    <div class="btnrow" ${isFree(o) ? `style="display:none"` : ""}><button class="ghostbtn rcptbtn" id="o_rcpt"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>Receipt for customer</button></div>
    <div class="btnrow"><button class="ghostbtn" id="o_shop">Shopping list for this order</button>${isNew?"":`<button class="ghostbtn danger" id="o_del">Delete order</button>`}</div>`;
  openSheet(isNew ? "New order" : "Order", body(), (b, close, el) => mount(b, close, el), {tall:true, onClose: () => { if (view === "orders") renderOrders(); }});
  function grab(b){
    o.customer = b.querySelector("#o_cust").value.trim(); o.due = b.querySelector("#o_due").value; o.notes = b.querySelector("#o_notes").value.trim();
    b.querySelectorAll(".oitem").forEach(row => { const it = o.items[+row.dataset.i], pi = row.querySelector(".o_price"); if (pi) it.price = num(pi.dataset.v ?? pi.value); });
    const dp = b.querySelector("#o_dep"); if (dp) { const v = num(dp.dataset.v ?? dp.value); if (v > 0) o.deposit = v; else delete o.deposit; }
  }
  function addItem(rid){ const r = db.recipes[rid]; const p = pricing(r); return {recipe: rid, name: r.name, qty: 1, price: Math.round(p.price), cost: r2(p.totalCost)}; }
  function mount(b, close, el){
    const re = () => { grab(b); replaceSheetBody(el, body(), nb => mount(nb, close, el)); };
    // Hide / Show in the order's own header, so prices can be revealed without leaving the order
    const slot = el.querySelector(".sheethead .ghost, .sheethead .eyepill");
    if (slot) {
      const pill = document.createElement("button"); pill.className = "eyepill"; pill.type = "button";
      pill.innerHTML = (hideMoney ? EYE : EYE_OFF) + `<span>${hideMoney ? "Show" : "Hide"}</span>`;
      pill.onclick = () => { grab(b); hideMoney = !hideMoney; store.set("hideMoney", hideMoney); paintEye(); re(); };
      slot.replaceWith(pill);
    }
    b.querySelector("#o_add").onclick = () => { grab(b); const first = cakeIds()[0]; if (!first) return; o.items.push(addItem(first)); re(); };
    b.querySelectorAll(".oitem").forEach(row => { const i = +row.dataset.i, it = o.items[i];
      row.querySelector(".o_rec").onchange = e => { grab(b); const n = addItem(e.target.value); n.qty = it.qty; o.items[i] = n; re(); };
      row.querySelector(".plus").onclick = () => { grab(b); it.qty++; re(); };
      row.querySelector(".minus").onclick = () => { grab(b); if (it.qty > 1) it.qty--; re(); };
      const pin = row.querySelector(".o_price"); if (pin) pin.onchange = () => re();
      row.querySelector(".odel").onclick = () => { grab(b); o.items.splice(i, 1); re(); };
    });
    b.querySelectorAll("[data-m]").forEach(c => c.onclick = () => { o.method = o.method === c.dataset.m ? "" : c.dataset.m;
      b.querySelectorAll("[data-m]").forEach(x => x.classList.toggle("on", x.dataset.m === o.method)); });
    b.querySelectorAll("[data-k]").forEach(c => c.onclick = () => { grab(b); if (c.dataset.k) o.kind = c.dataset.k; else delete o.kind; re(); });
    const pd = b.querySelector("#o_paid"); if (pd) pd.onclick = () => { grab(b); o.paid = !o.paid; re(); };
    const dpi = b.querySelector("#o_dep"); if (dpi) dpi.onchange = () => re();
    b.querySelectorAll("[data-pay]").forEach(c => c.onclick = () => { o.pay = o.pay === c.dataset.pay ? "" : c.dataset.pay; if (!o.pay) delete o.pay;
      b.querySelectorAll("[data-pay]").forEach(x => x.classList.toggle("on", x.dataset.pay === o.pay)); });
    b.querySelector("#o_done").onclick = e => { o.done = !o.done; e.currentTarget.classList.toggle("on", o.done); };
    b.querySelector("#o_cust").oninput = e => { o.customer = e.target.value; b.querySelector("#o_cnote").innerHTML = custNote(); };
    const save = () => { grab(b); if (!o.items.length) { toast("Add at least one cake"); return false; }
      if (!o.created) o.created = todayStr();
      const cid = findOrMakeCustomer(o.customer); if (cid) o.customerId = cid; else delete o.customerId;
      const list = ORDERS(); if (!o.num) o.num = nextOrderNum();
      const k = list.findIndex(x => x.id === o.id); if (k >= 0) list[k] = o; else list.push(o); saveDb(); return true; };
    b.querySelector("#o_save").onclick = () => { if (save()) { close(); syncReminders(); toast(isNew ? "Order saved" : "Saved"); } };
    b.querySelector("#o_shop").onclick = () => { if (save()) { close(); shopForOrders([o]); } };
    b.querySelector("#o_rcpt").onclick = () => { if (save()) openReceipt(o.id); };
    const d = b.querySelector("#o_del"); if (d) confirmTap(d, "Tap again to delete", () => { db.orders = ORDERS().filter(x => x.id !== o.id); saveDb(); close(); syncReminders(); toast("Order deleted"); });
  }
}
// ---------- CUSTOMERS ----------
const CUSTOMERS = () => (db.customers = db.customers || {});
const normName = s => String(s || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ");
function findCustomer(name){ const n = normName(name); if (!n) return null; return Object.keys(CUSTOMERS()).find(id => normName(CUSTOMERS()[id].name) === n) || null; }
function findOrMakeCustomer(name){
  name = String(name || "").trim(); if (!name) return null;
  let id = findCustomer(name); if (!id) { id = newId("c"); CUSTOMERS()[id] = {name, phone:"", notes:""}; }
  return id;
}
// Older data: make customers from the names already on orders, and keep new fields tidy
function migrateDb(){
  db.orders = db.orders || []; CUSTOMERS(); db.expenses = db.expenses || [];
  for (const o of db.orders) if (!o.customerId || !CUSTOMERS()[o.customerId]) { const id = findOrMakeCustomer(o.customer); if (id) o.customerId = id; else delete o.customerId; }
}
const custOrders = cid => ORDERS().filter(o => o.customerId === cid).sort((a, b) => (b.due || "").localeCompare(a.due || ""));
function custStats(cid){
  const os = custOrders(cid), sold = os.filter(o => !isFree(o));
  return {n: os.length, spent: sold.reduce((a, o) => a + orderTotal(o), 0), owes: sold.reduce((a, o) => a + balanceDue(o), 0), last: os[0] && os[0].due};
}
// Phone numbers: digits only; 10-digit numbers (PR/US) get the +1 for WhatsApp
const telDigits = p => String(p || "").replace(/[^\d+]/g, "");
const waLink = p => { let d = String(p || "").replace(/\D/g, ""); if (d.length === 10) d = "1" + d; return d ? `https://wa.me/${d}` : ""; };
function openCustomers(){
  let q = "";
  openSheet("Customers", `
    <label class="search insheet"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="cs_q" type="search" placeholder="Search name or phone" autocomplete="off"></label>
    <div class="pickl" id="cs_list"></div>
    <button class="primary" id="cs_new"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>New customer</button>`, (b, close) => {
    const paint = () => {
      const ids = Object.keys(CUSTOMERS()).filter(id => { const c = CUSTOMERS()[id]; return !q || normName(c.name + " " + (c.phone || "")).includes(normName(q)); })
        .sort((a, b) => { const la = custStats(a).last || "", lb = custStats(b).last || ""; return lb.localeCompare(la) || CUSTOMERS()[a].name.localeCompare(CUSTOMERS()[b].name); });
      b.querySelector("#cs_list").innerHTML = ids.length ? ids.map(id => { const c = CUSTOMERS()[id], s = custStats(id);
        return `<button class="pickrow custrow" data-id="${esc(id)}"><span class="cav" aria-hidden="true">${esc((c.name.trim()[0] || "?").toUpperCase())}</span>
          <span class="picktxt"><b>${esc(c.name)}</b><small>${s.n} order${s.n===1?"":"s"}${s.spent ? ` · ${mm(s.spent)} spent` : ""}${s.last ? ` · last ${esc(fmtDay(s.last))}` : ""}${s.owes > 0.005 ? ` · <span class="warnc">owes ${mm(s.owes)}</span>` : ""}</small>
          ${c.notes ? `<small class="cnote">${esc(c.notes)}</small>` : ""}</span></button>`; }).join("")
        : `<div class="empty">${q ? "No one matches that." : "No customers yet. They’re added automatically when you save an order."}</div>`;
      b.querySelectorAll(".custrow").forEach(r => r.onclick = () => openCustomer(r.dataset.id, paint));
    };
    b.querySelector("#cs_q").oninput = e => { q = e.target.value; paint(); };
    b.querySelector("#cs_new").onclick = () => openCustomer(null, paint);
    paint();
  }, {tall:true});
}
function openCustomer(cid, after){
  const isNew = !cid, c = isNew ? {name:"", phone:"", notes:""} : clone(CUSTOMERS()[cid]);
  const os = isNew ? [] : custOrders(cid), s = isNew ? null : custStats(cid), lastSale = os.find(o => o.items.length);
  openSheet(isNew ? "New customer" : "Customer", `
    <label class="field"><span>Name</span><input id="cu_name" value="${esc(c.name)}" placeholder="e.g. María Rivera"></label>
    <label class="field"><span>Phone <small>(optional)</small></span><input id="cu_phone" type="tel" inputmode="tel" value="${esc(c.phone || "")}" placeholder="787-555-0123"></label>
    <label class="field"><span>Notes <small>(allergies, favorite cake, address…)</small></span><textarea id="cu_notes" rows="3" placeholder="e.g. Allergic to nuts · loves the strawberry">${esc(c.notes || "")}</textarea></label>
    ${!isNew && c.phone ? `<div class="btnrow"><a class="ghostbtn" href="tel:${esc(telDigits(c.phone))}">Call</a><a class="ghostbtn" href="${esc(waLink(c.phone))}" target="_blank" rel="noopener">WhatsApp</a></div>` : ""}
    <button class="primary" id="cu_save">${isNew ? "Save customer" : "Save"}</button>
    ${isNew ? "" : `<div class="btnrow"><button class="ghostbtn" id="cu_order">New order</button>${lastSale ? `<button class="ghostbtn" id="cu_again">Repeat last order</button>` : ""}</div>
    ${s.n ? `<div class="card cstats"><div><small>Orders</small><b>${s.n}</b></div><div><small>Spent</small><b>${mm(s.spent)}</b></div><div><small>Owes</small><b class="${s.owes > 0.005 ? "warnc" : ""}">${mm(s.owes)}</b></div></div>` : ""}
    <div class="group"><h4>Their orders</h4>${os.length ? `<div class="pickl">${os.map(o => `<button class="pickrow corow" data-o="${esc(o.id)}"><span class="picktxt"><b>${esc(fmtDay(o.due) || "No date")}${isFree(o) ? ` · ${KIND_LABEL[o.kind]}` : ""}</b><small>${esc(orderLine(o))}${isFree(o) ? "" : ` · ${mm(orderTotal(o))}`}</small></span></button>`).join("")}</div>` : `<p class="small" style="margin:0">No orders yet.</p>`}</div>
    <button class="ghostbtn danger" id="cu_del" style="width:100%">Delete customer</button>
    <p class="small">Deleting keeps their orders; they just won’t be linked to a saved customer.</p>`}`, (b, close) => {
    const save = () => {
      const name = b.querySelector("#cu_name").value.trim(); if (!name) { toast("Give them a name"); return null; }
      const other = findCustomer(name); if (other && other !== cid) { toast("There’s already a customer with that name"); return null; }
      const id = cid || newId("c");
      CUSTOMERS()[id] = {name, phone: b.querySelector("#cu_phone").value.trim(), notes: b.querySelector("#cu_notes").value.trim()};
      for (const o of ORDERS()) if (o.customerId === id) o.customer = name;
      saveDb(); return id;
    };
    b.querySelector("#cu_save").onclick = () => { if (save()) { close(); if (after) after(); toast("Saved"); if (view === "orders") renderOrders(); } };
    if (!isNew) {
      b.querySelector("#cu_order").onclick = () => { const id = save(); if (!id) return; close(); editOrder(null, {customer: CUSTOMERS()[id].name}); };
      const ag = b.querySelector("#cu_again"); if (ag) ag.onclick = () => { const id = save(); if (!id) return; close();
        editOrder(null, {customer: CUSTOMERS()[id].name, method: lastSale.method || "", kind: lastSale.kind, items: lastSale.items.filter(it => db.recipes[it.recipe]).map(it => ({recipe: it.recipe, qty: it.qty}))}); };
      b.querySelectorAll(".corow").forEach(r => r.onclick = () => editOrder(r.dataset.o));
      confirmTap(b.querySelector("#cu_del"), "Tap again to delete", () => {
        delete CUSTOMERS()[cid]; for (const o of ORDERS()) if (o.customerId === cid) delete o.customerId;
        saveDb(); close(); if (after) after(); toast("Customer deleted"); });
    }
  }, {tall: !isNew});
}
// ---------- BUSINESS REPORT ----------
const EXP_CATS = ["Gas", "Equipment", "Packaging", "Ads", "Other"];
const EXPENSES = () => (db.expenses = db.expenses || []);
const ym = s => String(s || "").slice(0, 7);
function openReport(){
  let period = "month";
  const now = new Date(), thisYm = todayStr().slice(0, 7);
  const monthsBack = n => { const out = []; for (let i = n - 1; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); out.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`); } return out; };
  const inPeriod = day => { if (!day) return false; const k = ym(day);
    if (period === "month") return k === thisYm; if (period === "3m") return monthsBack(3).includes(k);
    if (period === "year") return k.slice(0, 4) === thisYm.slice(0, 4); return true; };
  const body = () => {
    const os = ORDERS().filter(o => inPeriod(o.due || o.created)), sold = os.filter(o => !isFree(o)), free = os.filter(isFree);
    const exps = EXPENSES().filter(e => inPeriod(e.date)).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const sales = sold.reduce((a, o) => a + orderTotal(o), 0), cost = sold.reduce((a, o) => a + orderCost(o), 0);
    const other = exps.reduce((a, e) => a + num(e.amount), 0), paid = sold.reduce((a, o) => a + amountPaid(o), 0);
    const freeCost = free.reduce((a, o) => a + orderCost(o), 0), freeN = free.reduce((a, o) => a + o.items.reduce((b, it) => b + num(it.qty), 0), 0);
    // best sellers
    const by = {};
    for (const o of sold) for (const it of o.items) { const k = it.recipe; by[k] = by[k] || {name: (db.recipes[k] && db.recipes[k].name) || it.name || "Cake", n: 0, rev: 0}; by[k].n += num(it.qty); by[k].rev += num(it.qty) * num(it.price); }
    const best = Object.values(by).sort((a, b) => b.n - a.n || b.rev - a.rev).slice(0, 5);
    // top customers
    const bc = {};
    for (const o of sold) { const k = o.customerId || normName(o.customer); if (!k) continue; bc[k] = bc[k] || {name: o.customer, rev: 0, n: 0}; bc[k].rev += orderTotal(o); bc[k].n++; }
    const topc = Object.values(bc).sort((a, b) => b.rev - a.rev).slice(0, 3);
    // monthly trend
    const months = monthsBack(period === "year" || period === "all" ? 12 : 6).map(k => {
      const mo = ORDERS().filter(o => !isFree(o) && ym(o.due || o.created) === k), s = mo.reduce((a, o) => a + orderTotal(o), 0);
      const p = s - mo.reduce((a, o) => a + orderCost(o), 0) - EXPENSES().filter(e => ym(e.date) === k).reduce((a, e) => a + num(e.amount), 0);
      const [yy, mmn] = k.split("-").map(Number); return {k, label: new Date(yy, mmn - 1, 1).toLocaleDateString(undefined, {month: "short"}), s, p};
    });
    const top = Math.max(1, ...months.map(x => x.s));
    const chip = (k, t) => `<button type="button" class="chip ${period===k?"on":""}" data-p="${k}">${t}</button>`;
    return `<div class="chips repchips">${chip("month","Month")}${chip("3m","3 months")}${chip("year","Year")}${chip("all","All")}</div>
      <div class="card month repsum">
        <div class="mgrid"><div><small>Sales</small><b>${mm(sales)}</b></div><div><small>Cakes cost</small><b>${mm(cost)}</b></div><div><small>Expenses</small><b>${mm(other)}</b></div></div>
        <div class="reptrue"><span>True profit</span><b class="${sales - cost - other < 0 ? "warnc" : "hot"}">${mm(sales - cost - other)}</b></div>
        <div class="msub">${sold.length} sale${sold.length===1?"":"s"} · Collected ${mm(paid)}${sales - paid > 0.005 ? ` · <span class="warnc">Still owed ${mm(sales - paid)}</span>` : ""}</div>
        ${free.length ? `<div class="msub freesub">Gifts &amp; samples: ${freeN} cake${freeN===1?"":"s"} · cost you ${mm(freeCost)} (not in profit)</div>` : ""}
      </div>
      <div class="group"><h4>Month by month</h4>
        <div class="bars">${months.map(x => `<div class="barrow"><span class="bl">${esc(x.label)}</span><span class="bt"><span class="bs" style="width:${Math.max(0, x.s / top * 100).toFixed(1)}%"></span><span class="bp" style="width:${Math.max(0, x.p / top * 100).toFixed(1)}%"></span></span><span class="bv">${x.s ? mm(x.s) : "—"}</span></div>`).join("")}</div>
        <p class="small" style="margin:8px 0 0"><span class="lg lgs"></span>Sales <span class="lg lgp"></span>True profit</p></div>
      <div class="group"><h4>Best sellers</h4>${best.length ? `<ol class="best">${best.map(x => `<li><b>${esc(x.name)}</b><span>${x.n} sold · ${mm(x.rev)}</span></li>`).join("")}</ol>` : `<p class="small" style="margin:0">No sales in this period yet.</p>`}</div>
      ${topc.length ? `<div class="group"><h4>Top customers</h4><ol class="best">${topc.map(x => `<li><b>${esc(x.name || "No name")}</b><span>${x.n} order${x.n===1?"":"s"} · ${mm(x.rev)}</span></li>`).join("")}</ol></div>` : ""}
      <div class="group"><h4>Other expenses</h4>
        <p class="small" style="margin:0 0 10px">Gas, pans, packaging bought in bulk, ads… anything that isn’t already in a cake’s cost.</p>
        ${exps.length ? `<div class="pickl">${exps.map(e => `<div class="pickrow exprow"><span class="picktxt"><b>${esc(e.what || e.cat)}</b><small>${esc(fmtDay(e.date))} · ${esc(e.cat)}</small></span><b class="expamt">${mm(num(e.amount))}</b><button class="icon odel" data-x="${esc(e.id)}" aria-label="Delete expense"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`).join("")}</div>` : ""}
        <div class="expform">
          <div class="two"><label class="field"><span>What</span><input id="ex_what" placeholder="e.g. Gas for deliveries"></label>
          <label class="field"><span>Amount</span><input id="ex_amt" inputmode="decimal" placeholder="0.00"></label></div>
          <div class="two"><label class="field"><span>Date</span><input id="ex_date" type="date" value="${todayStr()}"></label>
          <label class="field"><span>Type</span><select id="ex_cat">${EXP_CATS.map(c => `<option>${c}</option>`).join("")}</select></label></div>
          <button class="ghostbtn" id="ex_add" style="width:100%"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add expense</button>
        </div></div>`;
  };
  openSheet("Business report", body(), (b, close, el) => mount(b, close, el), {tall:true, onClose: () => { if (view === "orders") renderOrders(); }});
  function mount(b, close, el){
    const re = () => replaceSheetBody(el, body(), nb => mount(nb, close, el));
    b.querySelectorAll("[data-p]").forEach(c => c.onclick = () => { period = c.dataset.p; re(); });
    b.querySelector("#ex_add").onclick = () => {
      const amount = num(b.querySelector("#ex_amt").value); if (!(amount > 0)) { toast("Enter the amount"); return; }
      EXPENSES().push({id: newId("x"), date: b.querySelector("#ex_date").value || todayStr(), what: b.querySelector("#ex_what").value.trim(), cat: b.querySelector("#ex_cat").value, amount});
      saveDb(); toast("Expense added"); re();
    };
    b.querySelectorAll("[data-x]").forEach(x => confirmTap(x, "Tap again to delete", () => { db.expenses = EXPENSES().filter(e => e.id !== x.dataset.x); saveDb(); re(); }));
  }
}
function updateOrderBadge(){
  const n = ORDERS().filter(o => !o.done && (daysUntil(o.due) ?? 99) <= 2).length, b = $("#orderBadge");
  if (b) { b.textContent = n; b.classList.toggle("show", !!n); }
}


// ---------- BAKING MODE ----------
function fmtMin(m){ m = num(m); if (m >= 60) { const h = Math.floor(m/60), mm = Math.round(m%60); return `${h} h${mm?` ${mm} min`:""}`; } return `${r1(m)} min`; }
const TIMER_RE = /\s*\((?:timer\s*)?(\d+(?:[.,]\d+)?)\s*(min(?:utes?)?|m|h(?:rs?|ours?)?)\)\s*$/i;
function stepsToText(steps){ return (steps||[]).map(s => s.t + (s.min ? ` (timer ${s.min >= 60 && s.min % 60 === 0 ? (s.min/60)+" h" : s.min+" min"})` : "")).join("\n"); }
function textToSteps(txt){
  return txt.split("\n").map(l => l.trim()).filter(Boolean).map(l => {
    const m = l.match(TIMER_RE); if (!m) return {t: l};
    const v = num(m[1]), u = m[2].toLowerCase(); return {t: l.replace(TIMER_RE, "").trim(), min: u.startsWith("h") ? v*60 : v};
  });
}
function editSteps(id, done){
  const r = db.recipes[id];
  openSheet("Steps", `
    <p class="small" style="margin:0 0 10px">One step per line. To give a step a timer, end it with <b>(timer 50 min)</b> or <b>(timer 6 h)</b>.</p>
    <label class="field"><textarea id="st_txt" rows="14" placeholder="Heat the oven to 325°F.&#10;Bake on the center rack. (timer 50 min)">${esc(stepsToText(r.steps))}</textarea></label>
    <label class="field"><span>Original recipe link <small>(optional)</small></span><input id="st_src" inputmode="url" value="${esc(r.source||"")}" placeholder="https://…"></label>
    <button class="primary" id="st_save">Save steps</button>`, (b, close) => {
    b.querySelector("#st_save").onclick = () => {
      r.steps = textToSteps(b.querySelector("#st_txt").value);
      const src = b.querySelector("#st_src").value.trim(); if (src) r.source = src; else delete r.source;
      saveDb(); close(); done(); toast("Steps saved");
    };
  }, {tall:true});
}
// Timers keep running while you move between steps, and survive closing the app.
let timers = store.get("timers", []), tickT = null, wakeLock = null, alarmT = null;
const saveTimers = () => store.set("timers", timers);
function addTimer(label, min){ const t = {id:newId("t"), label, end: Date.now() + min*60000, min}; timers.push(t); saveTimers(); Native.timerStarted(t); tick(); }
const left = t => Math.max(0, Math.round((t.end - Date.now())/1000));
const clock = s => { const h = Math.floor(s/3600), m = Math.floor(s%3600/60), x = s%60; return (h?h+":"+String(m).padStart(2,"0"):m)+":"+String(x).padStart(2,"0"); };
function beep(){
  try { const C = window.AudioContext || window.webkitAudioContext; if (!C) return; const ac = beep.ac = beep.ac || new C();
    [0, .35, .7].forEach(d => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(.0001, ac.currentTime+d); g.gain.exponentialRampToValueAtTime(.4, ac.currentTime+d+.02); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime+d+.28);
      o.start(ac.currentTime+d); o.stop(ac.currentTime+d+.3); }); } catch(e) {}
}
function tick(){
  clearTimeout(tickT);
  const ringing = timers.filter(t => left(t) === 0 && !t.rang);
  ringing.forEach(t => { t.rang = true; saveTimers(); showAlarm(t); });
  document.querySelectorAll("[data-timer]").forEach(el => { const t = timers.find(x => x.id === el.dataset.timer); if (t) el.querySelector("b").textContent = left(t) ? clock(left(t)) : "Done!"; });
  if (timers.length) tickT = setTimeout(tick, 1000);
}
function showAlarm(t){
  let el = $("#alarm"); if (!el) { el = document.createElement("div"); el.id = "alarm"; document.body.appendChild(el); }
  el.innerHTML = `<div class="alarmbox"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg><div><b>Timer done</b><span>${esc(t.label)}</span></div><button id="alarmOk">OK</button></div>`;
  el.classList.add("show");
  const ring = () => { beep(); try { navigator.vibrate && navigator.vibrate([300,150,300]); } catch(e){} };
  ring(); clearInterval(alarmT); alarmT = setInterval(ring, 2500);
  $("#alarmOk").onclick = () => { clearInterval(alarmT); el.classList.remove("show"); Native.timerGone(t); timers = timers.filter(x => x.id !== t.id); saveTimers(); renderTimers(); };
}
function renderTimers(){
  const bar = $("#bakeTimers"); if (!bar) return;
  bar.innerHTML = timers.map(t => `<button class="tchip ${left(t)?"":"done"}" data-timer="${t.id}"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/></svg><span>${esc(t.label)}</span><b>${left(t)?clock(left(t)):"Done!"}</b><i>×</i></button>`).join("");
  bar.querySelectorAll(".tchip").forEach(c => c.onclick = () => { const t = timers.find(x => x.id === c.dataset.timer); if (t) Native.timerGone(t); timers = timers.filter(x => x.id !== c.dataset.timer); saveTimers(); renderTimers(); });
  bar.style.display = timers.length ? "" : "none"; tick();
}
async function keepAwake(on){
  try { if (on && "wakeLock" in navigator) { wakeLock = await navigator.wakeLock.request("screen"); }
        else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; } } catch(e) {}
}
function startBaking(id){
  const r = db.recipes[id]; if (!r || !(r.steps||[]).length) return;
  let i = Math.min(store.get("bake-"+id, 0), r.steps.length-1), showIng = false; const got = {};
  const el = document.createElement("div"); el.className = "bake"; document.body.appendChild(el);
  keepAwake(true);
  const onVis = () => { if (document.visibilityState === "visible" && el.isConnected) keepAwake(true); };
  document.addEventListener("visibilitychange", onVis);
  const close = () => { keepAwake(false); document.removeEventListener("visibilitychange", onVis); el.remove(); };
  function render(){
    const s = r.steps[i], last = i === r.steps.length - 1;
    el.innerHTML = `
      <header class="bakehead"><button class="icon" id="bkClose" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
        <div><b>${esc(r.name)}</b><small>Step ${i+1} of ${r.steps.length}</small></div><span class="icon ghost"></span></header>
      <div class="track bk"><div class="fill" style="width:${(i+1)/r.steps.length*100}%"></div></div>
      <div id="bakeTimers" class="bktimers"></div>
      <div class="bakebody">
        <button class="ingtoggle" id="bkIng">${showIng?"Hide":"Show"} ingredients <svg viewBox="0 0 24 24"><path d="${showIng?"M6 15l6-6 6 6":"M6 9l6 6 6-6"}"/></svg></button>
        ${showIng ? `<div class="card bkings">${r.sections.map((sec, si) => `<div class="bksec">${esc(sec.title)}</div>` + sec.items.map((it, ii) => { const k = si+"-"+ii;
            return `<button class="bking ${got[k]?"got":""}" data-k="${k}"><span class="box"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></span><span><b>${esc(ingName(it.ing))}</b> ${esc(it.note || fmtAmt(it.ing, it.amt))}</span></button>`; }).join("")).join("")}</div>` : ""}
        <div class="bkstep"><span class="bknum">${i+1}</span><p>${esc(s.t)}</p>
          ${s.min ? `<button class="primary bktimer" id="bkTimer"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>Start ${fmtMin(s.min)} timer</button>${IS_APP ? `<button class="ghostbtn bkclock" id="bkClock">Set in phone's Clock instead</button>` : ""}` : ""}
        </div>
      </div>
      <footer class="bakefoot"><button class="ghostbtn" id="bkPrev" ${i?"":"disabled"}>Back</button><button class="primary" id="bkNext">${last?"Finish":"Next step"}</button></footer>`;
    el.querySelector("#bkClose").onclick = close;
    el.querySelector("#bkIng").onclick = () => { showIng = !showIng; render(); };
    el.querySelectorAll(".bking").forEach(b => b.onclick = () => { got[b.dataset.k] = !got[b.dataset.k]; b.classList.toggle("got", got[b.dataset.k]); });
    el.querySelector("#bkPrev").onclick = () => { if (i) { i--; store.set("bake-"+id, i); render(); } };
    el.querySelector("#bkNext").onclick = () => { if (last) { store.set("bake-"+id, 0); close(); toast(`${r.name}: all steps done`); } else { i++; store.set("bake-"+id, i); render(); el.querySelector(".bakebody").scrollTop = 0; } };
    const cb = el.querySelector("#bkClock"); if (cb) cb.onclick = async () => { const ok = await Native.clockTimer(`${short(r)} · step ${i+1}`, s.min); toast(ok ? `${fmtMin(s.min)} timer set in Clock` : "Couldn’t open the Clock app"); };
    const tb = el.querySelector("#bkTimer"); if (tb) tb.onclick = () => { addTimer(`${short(r)} · step ${i+1}`, s.min); renderTimers(); toast(`${fmtMin(s.min)} timer started`); };
    renderTimers();
  }
  render();
}
if (timers.length) tick();


// Android app: keep order reminders in step with the orders (does nothing on the web)
function remindSettings(){ return store.get("reminders", {on:true, time:"19:00"}); }
function syncReminders(){ if (IS_APP) Native.syncOrders(ORDERS(), remindSettings()); }
// Android app: tell me when a newer version is ready to download (checks GitHub at most every 6 hours)
const APK_URL = "https://github.com/Berto0481/cakecart/releases/download/android/CakeCart.apk";
async function checkUpdate(force){
  if (!IS_APP) return null;
  const mine = await Native.appBuild();
  let latest = store.get("updLatest", 0);
  if (force || Date.now() - store.get("updCheck", 0) > 6 * 36e5) {
    const l = await Native.latestBuild(); if (l) { latest = l; store.set("updLatest", l); store.set("updCheck", Date.now()); }
  }
  const info = {mine, latest, has: !!mine && latest > mine};
  if (info.has && !force && store.get("updToasted", 0) !== latest) {
    store.set("updToasted", latest); toast(`App update ready (build ${latest})`, "Download", () => Native.openUrl(APK_URL));
  }
  return info;
}

// ---------- RECEIPTS ----------
const BIZ = () => (db.business = db.business || {name:"", contact:"", thanks:""});
function nextOrderNum(){ return ORDERS().reduce((a, x) => Math.max(a, num(x.num)), 0) + 1; }
const fmtLong = (s, L) => { const d = parseDay(s); return d ? d.toLocaleDateString(L === "es" ? "es-PR" : undefined, {weekday:"short", month:"short", day:"numeric", year:"numeric"}) : ""; };
// Words on customer receipts and the price menu, in English and Spanish
const RT = {
  en: {conf:"Order confirmation", cust:"Customer", delivery:"Delivery", pickup:"Pickup", ready:"Ready on", tbc:"To be confirmed", ordered:"Ordered",
       each: x => `${x} each`, total:"Total", paid:"Paid in full ✓", deposit:"Deposit received", due: x => `Balance due ${x}`, notes:"Notes", thanks:"Thank you for your order!",
       menu:"Menu", whole:"Whole", per: w => w ? w.charAt(0).toUpperCase() + w.slice(1) : "Slice"},
  es: {conf:"Confirmación de orden", cust:"Cliente", delivery:"Entrega", pickup:"Para recoger", ready:"Lista el", tbc:"Por confirmar", ordered:"Fecha de orden",
       each: x => `${x} c/u`, total:"Total", paid:"Pagado en su totalidad ✓", deposit:"Depósito recibido", due: x => `Balance pendiente ${x}`, notes:"Notas", thanks:"¡Gracias por su orden!",
       menu:"Menú", whole:"Entero", per: w => ({slice:"Porción", brownie:"Brownie"})[String(w||"slice").toLowerCase()] || (w || "Porción")}
};
const rlang = () => BIZ().lang === "es" ? "es" : "en";
const cakeName = (r, fallback, L) => (L === "es" && r && r.nameEs) || (r && r.name) || fallback || "Cake";
// "9\" cheesecake · 12 slices" in either language
function sizeLine(r, L){
  const n = num(r.pieces), w = String(r.piece || "slice");
  if (L !== "es") return [r.size, n ? `${n} ${w}${n === 1 ? "" : "s"}` : ""].filter(Boolean).join(" · ");
  const size = String(r.size || "").replace(/^(\S+)\s+cheesecake$/i, "cheesecake de $1").replace(/^(\S+)\s+(pan|dish)$/i, "molde de $1");
  const pw = ({slice:"porciones", brownie:"brownies"})[w.toLowerCase()] || w;
  return [size, n ? `${n} ${pw}` : ""].filter(Boolean).join(" · ");
}
// A language switch shown above receipts and the menu
const langChips = L => `<div class="seg2 langseg"><button type="button" class="chip ${L==="en"?"on":""}" data-lang="en">English</button><button type="button" class="chip ${L==="es"?"on":""}" data-lang="es">Español</button></div>`;
function hookLang(b, redo){ b.querySelectorAll("[data-lang]").forEach(c => c.onclick = () => { if (c.classList.contains("on")) return; BIZ().lang = c.dataset.lang; saveDb(); redo(); }); }
let logoImg = null;
function loadLogo(){ return logoImg ? Promise.resolve(logoImg) : new Promise(res => { const im = new Image(); im.onload = () => res(logoImg = im); im.onerror = () => res(null); im.src = "icons/icon-192.png"; }); }
function wrap(ctx, text, maxW){
  const words = String(text).split(/\s+/), lines = []; let line = "";
  for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
let bizLogoSrc = null, bizLogoImg = null;
function loadBizLogo(){
  const src = BIZ().logo; if (!src) return Promise.resolve(null);
  if (src === bizLogoSrc && bizLogoImg) return Promise.resolve(bizLogoImg);
  return new Promise(res => { const im = new Image(); im.onload = () => { bizLogoSrc = src; res(bizLogoImg = im); }; im.onerror = () => res(null); im.src = src; });
}
// Shrink an uploaded picture so it fits comfortably in on-phone storage
function shrinkLogo(file){ return shrinkImage(file, 720, "image/webp", 0.9); }
function shrinkImage(file, max, type, q){
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height));
      const c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      let out = c.toDataURL(type, q); if (!out.startsWith("data:" + type)) out = c.toDataURL("image/png");
      res(out);
    };
    im.onerror = () => { URL.revokeObjectURL(url); rej(new Error("That file isn’t a picture this phone can open.")); };
    im.src = url;
  });
}
async function drawReceipt(o){
  try { await Promise.all(["400","700","800"].map(w => document.fonts.load(`${w} 40px Nunito`))); } catch(e) {}
  const biz = BIZ(), bizLogo = await loadBizLogo(), logo = bizLogo ? null : await loadLogo();
  const W = 1080, P = 72, IN = 64, F = "Nunito, system-ui, sans-serif";
  const C = {bg:"#FBF5EB", card:"#FFFFFF", ink:"#2A1A20", muted:"#8C7A80", line:"#F0E4E2", wine:"#8E1B3A", berry:"#C8324F", green:"#2E7D4F", greenbg:"#E3F2E8", amber:"#8A5A00", amberbg:"#FFF1D6"};
  const total = orderTotal(o), Lg = rlang(), T = RT[Lg];
  function layout(ctx, draw){
    let y = P + IN; const L = P + IN, R = W - P - IN, cw = R - L;
    const txt = (s, x, yy, font, color, align = "left") => { if (!draw) return; ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, yy); };
    const rule = yy => { if (draw) { ctx.fillStyle = C.line; ctx.fillRect(L, yy, cw, 3); } };
    // header: the business's own logo, centered, if one was uploaded on this phone
    if (bizLogo) {
      const k = Math.min(380 / bizLogo.width, 380 / bizLogo.height), lw = bizLogo.width * k, lh = bizLogo.height * k;
      if (draw) ctx.drawImage(bizLogo, W/2 - lw/2, y - 20, lw, lh);
      y += lh - 20;
      if (biz.contact) { y += 46; txt(biz.contact, W/2, y, `600 30px ${F}`, C.muted, "center"); }
      y += 50; rule(y); y += 70;
    } else {
    if (draw && logo) { ctx.save(); ctx.beginPath(); ctx.roundRect(L, y, 120, 120, 28); ctx.clip(); ctx.drawImage(logo, L, y, 120, 120); ctx.restore(); }
    ctx.font = `800 52px ${F}`; const name = biz.name || "CakeCart";
    txt(name, L + 148, y + 62, `800 52px ${F}`, C.wine);
    if (biz.contact) txt(biz.contact, L + 148, y + 106, `600 30px ${F}`, C.muted);
    y += 170; rule(y); y += 70;
    }
    txt(T.conf, L, y, `800 46px ${F}`, C.ink);
    txt(`#${String(o.num || "").padStart(4, "0")}`, R, y, `800 34px ${F}`, C.berry, "right");
    y += 64;
    const info = [[T.cust, o.customer || "—"], [o.method === "delivery" ? T.delivery : o.method === "pickup" ? T.pickup : T.ready, fmtLong(o.due, Lg) || T.tbc], [T.ordered, fmtLong(o.created, Lg)]].filter(r => r[1]);
    for (const [k, v] of info) { txt(k, L, y, `700 30px ${F}`, C.muted); txt(v, R, y, `700 32px ${F}`, C.ink, "right"); y += 52; }
    y += 18; rule(y); y += 66;
    // items
    for (const it of o.items) {
      const nm = cakeName(db.recipes[it.recipe], it.name, Lg);
      ctx.font = `700 34px ${F}`;
      const lines = wrap(ctx, `${it.qty} × ${nm}`, cw - 230);
      lines.forEach((ln, i) => txt(ln, L, y + i*44, `700 34px ${F}`, C.ink));
      txt(money(num(it.price) * num(it.qty)), R, y, `800 34px ${F}`, C.ink, "right");
      y += (lines.length - 1) * 44;
      if (num(it.qty) > 1) { y += 40; txt(T.each(money(num(it.price))), L, y, `600 27px ${F}`, C.muted); }
      y += 62;
    }
    rule(y - 14); y += 56;
    txt(T.total, L, y, `800 40px ${F}`, C.ink); txt(money(total), R, y, `800 52px ${F}`, C.berry, "right");
    y += 56;
    // deposit line, then the status pill
    const dep = amountPaid(o), payName = o.pay ? (Lg === "es" ? PAY_ES : PAY)[o.pay] : "";
    if (!o.paid && dep > 0) { txt(T.deposit + (payName ? ` (${payName})` : ""), L, y + 6, `700 30px ${F}`, C.muted); txt(`−${money(dep)}`, R, y + 6, `700 30px ${F}`, C.muted, "right"); y += 34; }
    const st = o.paid ? T.paid + (payName ? ` · ${payName}` : "") : T.due(money(balanceDue(o)));
    ctx.font = `800 30px ${F}`; const sw = ctx.measureText(st).width + 48;
    if (draw) { ctx.fillStyle = o.paid ? C.greenbg : C.amberbg; ctx.beginPath(); ctx.roundRect(R - sw, y, sw, 56, 28); ctx.fill(); }
    txt(st, R - sw/2, y + 38, `800 30px ${F}`, o.paid ? C.green : C.amber, "center");
    y += 56;
    if (o.notes) {
      y += 60; txt(T.notes, L, y, `700 28px ${F}`, C.muted); y += 46;
      ctx.font = `600 31px ${F}`; for (const ln of wrap(ctx, o.notes, cw)) { txt(ln, L, y, `600 31px ${F}`, C.ink); y += 44; }
      y -= 44;
    }
    y += 80; rule(y - 30);
    txt((Lg === "es" ? biz.thanksEs : biz.thanks) || T.thanks, W/2, y + 20, `800 34px ${F}`, C.berry, "center");
    y += 20 + IN;
    return y + P;
  }
  const probe = document.createElement("canvas").getContext("2d");
  const H = Math.ceil(layout(probe, false));
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = C.card; ctx.shadowColor = "rgba(142,27,58,.10)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 10;
  ctx.beginPath(); ctx.roundRect(P, P, W - 2*P, H - 2*P, 44); ctx.fill(); ctx.shadowColor = "transparent";
  layout(ctx, true);
  return cv;
}
async function openReceipt(oid){
  const o = ORDERS().find(x => x.id === oid); if (!o) return;
  if (!o.num) { o.num = nextOrderNum(); saveDb(); }
  const cv = await drawReceipt(o), url = cv.toDataURL("image/png");
  const fname = `Order-${String(o.num).padStart(4,"0")}${o.customer ? "-" + o.customer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9]+/g, "") : ""}.png`;
  openSheet("Receipt", `
    ${langChips(rlang())}
    <img class="receiptimg" src="${url}" alt="Order receipt">
    <button class="primary" id="r_share"><svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>Send to customer</button>
    <div class="btnrow"><button class="ghostbtn" id="r_save">Save image</button><button class="ghostbtn" id="r_biz">Name &amp; logo</button></div>
    <p class="small">Shows the cakes, prices, date and whether it's paid. Your costs and profit are never on it.</p>`, (b, close) => {
    const blob = () => new Promise(res => cv.toBlob(res, "image/png"));
    const saveImg = async () => { const bl = await blob(), a = document.createElement("a"); a.href = URL.createObjectURL(bl); a.download = fname; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); };
    b.querySelector("#r_share").onclick = async () => {
      if (IS_APP) { try { await Native.shareFile(fname, await blob(), "Order confirmation"); } catch(e) { if (!/cancel/i.test(e && e.message || "")) toast("Couldn’t share: " + (e.message || e)); } return; }
      try { const file = new File([await blob()], fname, {type:"image/png"});
        if (navigator.canShare && navigator.canShare({files:[file]})) await navigator.share({files:[file], title:"Order confirmation"});
        else { await saveImg(); toast("Image saved. Attach it in your messaging app."); }
      } catch(e) { if (e && e.name !== "AbortError") { await saveImg().catch(() => {}); toast("Image saved. Attach it in your messaging app."); } }
    };
    b.querySelector("#r_save").onclick = () => (IS_APP ? blob().then(bl => Native.shareFile(fname, bl, "Save receipt")) : saveImg()).catch(e => toast("Couldn’t save: " + (e.message || e)));
    b.querySelector("#r_biz").onclick = () => editBusiness(() => { close(); setTimeout(() => openReceipt(oid), 250); });
    hookLang(b, () => { close(); setTimeout(() => openReceipt(oid), 250); });
  }, {tall:true});
}
// ---------- PRICE MENU (an image to post or send to customers) ----------
const MENU = () => { const m = store.get("menu", {}); m.off = m.off || {}; m.price = m.price || {}; if (m.slicesV !== 2) { m.slices = false; m.slicesV = 2; } m.note = m.note || ""; if (m.samples == null) m.samples = true; if (m.fit == null) m.fit = true; m.per = m.per === 6 ? 6 : 4; return m; };
const menuIds = () => cakeIds();
const fmtP = v => Math.abs(v - Math.round(v)) < 0.005 ? `$${Math.round(v)}` : money(v);
function menuPrice(id, m){ const p = num(m.price[id]); if (p > 0) return p; const c = pricing(db.recipes[id]).price; return c > 0 ? Math.ceil(c) : 0; }
const slicePrice = (r, whole) => num(r.pieces) > 0 && whole > 0 ? Math.ceil(whole / num(r.pieces) * 4) / 4 : 0;
const imgCache = {};
function loadImg(src){ if (!src) return Promise.resolve(null); if (imgCache[src]) return imgCache[src];
  return imgCache[src] = new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }); }
// The photo the menu uses: your own, or (only while testing) the app's sample photo
function menuPhoto(id, m){ const own = ownPhoto(id); if (own) return own; return m.samples ? photoFor(id, "slice") : null; }
// Draws the menu as pages of photo cards (2 across), each page 1080 wide, ready for an Instagram/WhatsApp carousel
async function drawMenu(m){
  try { await Promise.all(["600","700","800"].map(w => document.fonts.load(`${w} 40px Nunito`))); } catch(e) {}
  const biz = BIZ(), bizLogo = await loadBizLogo(), appLogo = bizLogo ? null : await loadLogo(), Lg = rlang(), T = RT[Lg];
  const F = "Nunito, system-ui, sans-serif";
  const C = {bg:"#FBF5EB", card:"#FFFFFF", ink:"#2A1A20", muted:"#8C7A80", line:"#F0E4E2", wine:"#8E1B3A", berry:"#C8324F", blush:"#F9EAEA"};
  const items = menuIds().filter(id => !m.off[id]).map(id => ({id, r: db.recipes[id], whole: menuPrice(id, m), src: menuPhoto(id, m)})).filter(x => x.whole > 0);
  for (const it of items) it.img = await loadImg(it.src);
  const per = m.per, rows = per / 2, pages = Math.max(1, Math.ceil(items.length / per));
  // Photos keep a 4:3 shape so a slice isn't cut off; 6 per page uses a tall story-size page
  const W = 1080, H = per === 6 ? 1920 : 1350, P = 56, GAP = 24;
  const headH = 200, footH = (m.note || biz.contact) ? 104 : 40;
  const TXT = 156, cardW = (W - 2*P - GAP) / 2, room = H - 2*P - headH - footH - 12;
  const photoH = Math.round(Math.min(cardW * 0.75, (room - (rows - 1) * GAP) / rows - TXT)), cardH = photoH + TXT;
  const gridH = rows * cardH + (rows - 1) * GAP, gridTop = P + headH + Math.max(0, (room - gridH) / 2);
  const out = [];
  for (let pg = 0; pg < pages; pg++) {
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    const txt = (s, x, y, font, color, align = "left") => { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, y); };
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    // header: logo, MENU, page number
    if (bizLogo) { const k = Math.min(124 / bizLogo.width, 124 / bizLogo.height); ctx.drawImage(bizLogo, W/2 - bizLogo.width*k/2, P - 18, bizLogo.width*k, bizLogo.height*k); }
    else { if (appLogo) { ctx.save(); ctx.beginPath(); ctx.roundRect(W/2 - 50, P, 100, 100, 24); ctx.clip(); ctx.drawImage(appLogo, W/2 - 50, P, 100, 100); ctx.restore(); }
      txt(biz.name || "CakeCart", W/2, P + 132, `800 30px ${F}`, C.wine, "center"); }
    const ty = P + 160, title = T.menu.toUpperCase();
    txt(title, W/2, ty, `800 38px ${F}`, C.berry, "center");
    ctx.font = `800 38px ${F}`; const tw = ctx.measureText(title).width;
    ctx.fillStyle = C.line; ctx.fillRect(P, ty - 13, (W - 2*P - tw)/2 - 28, 3); ctx.fillRect(W/2 + tw/2 + 28, ty - 13, (W - 2*P - tw)/2 - 28, 3);
    if (pages > 1) txt(`${pg + 1}/${pages}`, W - P, P + 24, `800 26px ${F}`, C.muted, "right");
    // cards
    items.slice(pg * per, pg * per + per).forEach((it, i) => {
      const x = P + (i % 2) * (cardW + GAP), y = gridTop + Math.floor(i / 2) * (cardH + GAP);
      ctx.save(); ctx.shadowColor = "rgba(142,27,58,.10)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6;
      ctx.fillStyle = C.card; ctx.beginPath(); ctx.roundRect(x, y, cardW, cardH, 30); ctx.fill(); ctx.restore();
      // photo, cropped to fill
      ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, cardW, photoH, [30, 30, 0, 0]); ctx.clip();
      if (it.img) {
        const cover = Math.max(cardW / it.img.width, photoH / it.img.height), cw2 = it.img.width * cover, ch2 = it.img.height * cover;
        if (m.fit) {
          // whole photo, centered; the sides get a soft blurred copy so there are no empty bars
          ctx.fillStyle = C.blush; ctx.fillRect(x, y, cardW, photoH);
          if ("filter" in ctx) { ctx.filter = "blur(22px) brightness(1.06)"; ctx.drawImage(it.img, x + (cardW - cw2)/2 - 30, y + (photoH - ch2)/2 - 30, cw2 + 60, ch2 + 60); ctx.filter = "none"; ctx.fillStyle = "rgba(251,245,235,.45)"; ctx.fillRect(x, y, cardW, photoH); }
          const fit = Math.min(cardW / it.img.width, photoH / it.img.height), w = it.img.width * fit, h = it.img.height * fit;
          ctx.drawImage(it.img, x + (cardW - w)/2, y + (photoH - h)/2, w, h);
        } else ctx.drawImage(it.img, x + (cardW - cw2)/2, y + (photoH - ch2)/2, cw2, ch2);
      }
      else { ctx.fillStyle = C.blush; ctx.fillRect(x, y, cardW, photoH);
        const lg = bizLogo || appLogo; if (lg) { const k = Math.min(photoH * .5 / lg.width, photoH * .5 / lg.height); ctx.globalAlpha = .9; ctx.drawImage(lg, x + cardW/2 - lg.width*k/2, y + photoH/2 - lg.height*k/2, lg.width*k, lg.height*k); ctx.globalAlpha = 1; } }
      ctx.restore();
      // name (up to 2 lines), size, prices
      const tx = x + 26, tr = x + cardW - 26; let ny = y + photoH + 42;
      ctx.font = `800 28px ${F}`; let lines = wrap(ctx, cakeName(it.r, "", Lg), cardW - 52);
      if (lines.length > 2) { lines = lines.slice(0, 2); while (ctx.measureText(lines[1] + "…").width > cardW - 52 && lines[1].length) lines[1] = lines[1].slice(0, -1); lines[1] += "…"; }
      if (lines.length === 1) ny += 12;
      lines.forEach((ln, j) => txt(ln, tx, ny + j * 34, `800 28px ${F}`, C.ink));
      const by = y + cardH - 22;
      txt(fmtP(it.whole), tx, by, `800 38px ${F}`, C.berry);
      const sp = m.slices ? slicePrice(it.r, it.whole) : 0;
      txt(sp ? `${T.per(it.r.piece)} ${money(sp)}` : sizeLine(it.r, Lg).split(" · ")[0], tr, by - 2, `700 23px ${F}`, C.muted, "right");
    });
    if (!items.length) txt(Lg === "es" ? "Añade precios para ver el menú" : "Add prices to see your menu", W/2, H/2, `700 32px ${F}`, C.muted, "center");
    // footer
    let fy = H - P - footH + 54;
    if (m.note) { ctx.font = `700 26px ${F}`; txt(wrap(ctx, m.note, W - 2*P)[0], W/2, fy, `700 26px ${F}`, C.ink, "center"); fy += 38; }
    if (biz.contact) txt(biz.contact, W/2, fy, `600 24px ${F}`, C.muted, "center");
    out.push(cv);
  }
  return out;
}
// Share or save a picture: share sheet when the phone allows it, otherwise a download
async function shareImage(cv, fname, title, saveOnly){
  const blob = await new Promise(res => cv.toBlob(res, "image/png"));
  const save = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fname; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); };
  if (IS_APP) { try { await Native.shareFile(fname, blob, title); } catch(e) { if (!/cancel/i.test(e && e.message || "")) toast("Couldn’t share: " + (e.message || e)); } return; }
  if (saveOnly) { save(); toast("Image saved"); return; }
  try { const file = new File([blob], fname, {type:"image/png"});
    if (navigator.canShare && navigator.canShare({files:[file]})) await navigator.share({files:[file], title});
    else { save(); toast("Image saved. Attach it in your messaging app."); }
  } catch(e) { if (e && e.name !== "AbortError") { save(); toast("Image saved. Attach it in your messaging app."); } }
}
async function openMenu(){
  const m = MENU();
  let pages = await drawMenu(m);
  const imgs = () => pages.map((cv, i) => `<img class="receiptimg menupage" src="${cv.toDataURL("image/jpeg", .9)}" alt="Menu page ${i+1}">`).join("");
  const anySample = () => menuIds().some(id => !m.off[id] && !ownPhoto(id) && m.samples && photoFor(id, "slice"));
  openSheet("Price menu", `
    ${langChips(rlang())}
    <div id="mn_warn"></div>
    <div id="mn_pages">${imgs()}</div>
    <button class="primary" id="mn_share"><svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>Share menu</button>
    <div class="btnrow"><button class="ghostbtn" id="mn_save">Save images</button><button class="ghostbtn" id="mn_biz">Name &amp; logo</button></div>
    <div class="group" style="margin-top:18px"><h4>What's on it</h4>
      <div class="field"><span>Cakes per page</span><div class="seg2"><button type="button" class="chip ${m.per===4?"on":""}" data-per="4">4 · for posts</button><button type="button" class="chip ${m.per===6?"on":""}" data-per="6">6 · for stories</button></div></div>
      <label class="toggle"><span>Show slice prices<small>Whole price ÷ slices, rounded up to 25¢</small></span><button class="switch ${m.slices?"on":""}" id="mn_sl" role="switch"></button></label>
      <label class="toggle"><span>Show the whole photo<small>Nothing cut off; off fills the card edge to edge</small></span><button class="switch ${m.fit?"on":""}" id="mn_fit" role="switch"></button></label>
      <label class="toggle"><span>Use sample photos for testing<small>Fills in cakes that don’t have your own photo yet</small></span><button class="switch ${m.samples?"on":""}" id="mn_smp" role="switch"></button></label>
      <label class="field"><span>Note at the bottom <small>(optional)</small></span><input id="mn_note" value="${esc(m.note)}" placeholder="e.g. Order 3 days ahead · Delivery in Ponce"></label>
      <p class="small" style="margin:0 0 8px">Tap a cake to show or hide it. Prices start at your selling price, rounded up to the dollar; type your own to change them. Add your own photos in each recipe’s details.</p>
      <div class="pickl" id="mn_list"></div></div>`, (b, close) => {
    let t = null;
    const save = () => store.set("menu", m);
    const warn = () => { b.querySelector("#mn_warn").innerHTML = anySample() ? `<div class="mnwarn"><b>Testing only.</b> Some cakes show the app’s sample photos (from Sugar Spun Run). Don’t send this to customers until every cake has your own photo.</div>` : ""; };
    const redraw = () => { clearTimeout(t); t = setTimeout(async () => { pages = await drawMenu(m); const box = b.querySelector("#mn_pages"); if (box) box.innerHTML = imgs(); warn(); }, 250); };
    const paintList = () => {
      b.querySelector("#mn_list").innerHTML = menuIds().map(id => { const r = db.recipes[id], on = !m.off[id], auto = pricing(r).price;
        return `<div class="pickrow menurow ${on?"on":""}" data-id="${esc(id)}">
          <button class="pickhit" aria-label="Show or hide ${esc(r.name)}"><span class="pickbox" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
          <span class="picktxt"><b>${esc(r.name)}</b><small>${ownPhoto(id) ? "Your photo ✓" : "No photo of yours yet"} · ${auto > 0 ? `selling ${money(auto)}` : "no price yet"}</small></span></button>
          <label class="mnprice"><span>$</span><input inputmode="decimal" data-p="${esc(id)}" value="${num(m.price[id]) > 0 ? r2(m.price[id]) : ""}" placeholder="${auto > 0 ? Math.ceil(auto) : "0"}" aria-label="Menu price for ${esc(r.name)}"></label></div>`; }).join("");
      b.querySelectorAll(".pickhit").forEach(h => h.onclick = () => { const id = h.parentElement.dataset.id; if (m.off[id]) delete m.off[id]; else m.off[id] = true; save(); h.parentElement.classList.toggle("on", !m.off[id]); redraw(); });
      b.querySelectorAll("[data-p]").forEach(inp => inp.oninput = () => { const v = num(inp.value); if (v > 0) m.price[inp.dataset.p] = v; else delete m.price[inp.dataset.p]; save(); redraw(); });
    };
    paintList(); warn();
    b.querySelectorAll("[data-per]").forEach(c => c.onclick = () => { m.per = +c.dataset.per; b.querySelectorAll("[data-per]").forEach(x => x.classList.toggle("on", x === c)); save(); redraw(); });
    b.querySelector("#mn_sl").onclick = e => { m.slices = !m.slices; e.currentTarget.classList.toggle("on", m.slices); save(); redraw(); };
    b.querySelector("#mn_fit").onclick = e => { m.fit = !m.fit; e.currentTarget.classList.toggle("on", m.fit); save(); redraw(); };
    b.querySelector("#mn_smp").onclick = e => { m.samples = !m.samples; e.currentTarget.classList.toggle("on", m.samples); save(); redraw(); };
    b.querySelector("#mn_note").oninput = e => { m.note = e.target.value; save(); redraw(); };
    const base = () => `${(BIZ().name || "CakeCart").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-")}-${rlang() === "es" ? "Menu-ES" : "Menu"}`;
    const files = async () => Promise.all(pages.map(async (cv, i) => ({name: `${base()}${pages.length > 1 ? "-" + (i+1) : ""}.jpg`, blob: await new Promise(res => cv.toBlob(res, "image/jpeg", .92))})));
    b.querySelector("#mn_share").onclick = async () => { if (anySample()) toast("Heads up: this menu still has sample photos"); shareImages(await files(), rlang() === "es" ? "Menú" : "Menu"); };
    b.querySelector("#mn_save").onclick = async () => shareImages(await files(), "Save menu", true);
    b.querySelector("#mn_biz").onclick = () => editBusiness(() => { close(); setTimeout(openMenu, 250); });
    hookLang(b, () => { close(); setTimeout(openMenu, 250); });
  }, {tall:true});
}
// Share or save several pictures at once (the menu pages)
async function shareImages(list, title, saveOnly){
  const saveAll = () => list.forEach((f, i) => setTimeout(() => { const a = document.createElement("a"); a.href = URL.createObjectURL(f.blob); a.download = f.name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }, i * 400));
  if (IS_APP) { try { await Native.shareFiles(list, title); } catch(e) { if (!/cancel/i.test(e && e.message || "")) toast("Couldn’t share: " + (e.message || e)); } return; }
  if (saveOnly) { saveAll(); toast(list.length > 1 ? `${list.length} images saved` : "Image saved"); return; }
  try { const fs = list.map(f => new File([f.blob], f.name, {type: f.blob.type}));
    if (navigator.canShare && navigator.canShare({files: fs})) await navigator.share({files: fs, title});
    else { saveAll(); toast("Images saved. Attach them in your messaging app."); }
  } catch(e) { if (e && e.name !== "AbortError") { saveAll(); toast("Images saved. Attach them in your messaging app."); } }
}
function editBusiness(done){
  const biz = BIZ();
  openSheet("Your business", `
    <p class="small" style="margin:0 0 12px">Shown at the top and bottom of customer receipts. Saved only on this phone.</p>
    <div class="field"><span>Logo <small>(optional, replaces the name at the top)</small></span>
      <div class="logorow"><div class="logoprev" id="bz_prev"></div>
        <div class="logobtns"><label class="ghostbtn filebtn">Choose logo…<input type="file" id="bz_logo" accept="image/*"></label>
        <button class="ghostbtn danger" id="bz_rmlogo">Remove</button></div></div></div>
    <label class="field"><span>Business name</span><input id="bz_name" value="${esc(biz.name)}" placeholder="CakeCart"></label>
    <label class="field"><span>Contact <small>(phone, Instagram… optional)</small></span><input id="bz_contact" value="${esc(biz.contact)}" placeholder="e.g. 787-555-0123 · @mycheesecakes"></label>
    <label class="field"><span>Thank-you line</span><input id="bz_thanks" value="${esc(biz.thanks)}" placeholder="Thank you for your order!"></label>
    <label class="field"><span>Thank-you line in Spanish</span><input id="bz_thankses" value="${esc(biz.thanksEs||"")}" placeholder="¡Gracias por su orden!"></label>
    <button class="primary" id="bz_save">Save</button>`, (b, close) => {
    let logo = biz.logo || "";
    const paint = () => {
      b.querySelector("#bz_prev").innerHTML = logo ? `<img src="${logo}" alt="Your logo">` : `<span>No logo</span>`;
      b.querySelector("#bz_rmlogo").style.display = logo ? "" : "none";
    };
    paint();
    b.querySelector("#bz_logo").onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { logo = await shrinkLogo(f); paint(); } catch(err) { toast(err.message); }
      e.target.value = "";
    };
    b.querySelector("#bz_rmlogo").onclick = () => { logo = ""; paint(); };
    b.querySelector("#bz_save").onclick = () => {
      if (logo) biz.logo = logo; else delete biz.logo;
      biz.name = b.querySelector("#bz_name").value.trim(); biz.contact = b.querySelector("#bz_contact").value.trim(); biz.thanks = b.querySelector("#bz_thanks").value.trim(); biz.thanksEs = b.querySelector("#bz_thankses").value.trim();
      saveDb(); close(); toast("Saved"); if (done) done();
    };
  });
}

// ---------- SETTINGS: backup / restore / reset ----------
function backupPayload(){
  const photos = {}; for (const id of Object.keys(db.recipes)) { const p = Photos.get(id); if (p) photos[id] = p; }
  return {app:"CakeCart", backupVersion:2, savedAt:new Date().toISOString(), db, have, photos};
}
function openSettings(){
  const last = store.get("lastBackup", null);
  const nR = Object.values(db.recipes).length, nI = Object.values(db.ingredients).filter(i=>!i.madeFrom).length;
  openSheet("Settings & backup", `
    <div class="card note2"><b>Your data lives on this phone.</b> ${nR} recipes and ${nI} ingredients. Make a backup now and then, and before switching phones.<br><span class="small" style="margin:0">${last ? `Last backup: ${new Date(last).toLocaleDateString()}` : "No backup made yet."}</span></div>
    <button class="ghostbtn" id="b_biz" style="width:100%;margin-bottom:14px">Your business name &amp; logo for receipts${BIZ().name?`: ${esc(BIZ().name)}`:""}</button>
    <button class="primary" id="b_save"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>Save a backup file</button>
    <p class="small">Keep the file somewhere safe, like Google Drive or your email. To move your data to another phone, open CakeCart there and use Restore.</p>
    ${IS_APP ? `<div class="group"><h4>App updates</h4><div id="upd"><p class="small" style="margin:0">Checking…</p></div></div>` : ""}
    ${IS_APP ? `<div class="group"><h4>Reminders &amp; alerts</h4>
      <label class="toggle"><span>Remind me about orders<small>The evening before a cake is due</small></span><button class="switch ${remindSettings().on?"on":""}" id="rm_on" role="switch"></button></label>
      <label class="field"><span>Reminder time</span><input type="time" id="rm_time" value="${esc(remindSettings().time)}"></label>
      <div class="btnrow"><button class="ghostbtn" id="rm_test">Send a test</button><button class="ghostbtn" id="rm_batt">Make alerts reliable</button></div>
      <p class="small" style="margin:8px 0 0">Samsung phones can delay alerts to save battery. Tap <b>Make alerts reliable</b>, then <b>Battery</b>, and choose <b>Unrestricted</b>. Baking timers ring even when the app is closed.</p></div>` : ""}
    <div class="group"><h4>Restore from a backup</h4>
      <p class="small" style="margin:0 0 10px">Replaces the recipes, prices, orders and pantry on this phone with the ones in the file.</p>
      <label class="ghostbtn filebtn">Choose backup file…<input type="file" id="b_file"></label></div>
    <div class="group"><h4>Start over</h4>
      <p class="small" style="margin:0 0 10px">Puts back the original recipes and prices from the spreadsheet. Your orders and business details are kept; other changes are lost unless you made a backup.</p>
      <button class="ghostbtn danger" id="b_reset">Reset to original data</button></div>`, (b, close) => {
    b.querySelector("#b_biz").onclick = () => { close(); setTimeout(() => editBusiness(), 250); };
    if (IS_APP) {
      const rs = remindSettings(), keep = () => { store.set("reminders", rs); syncReminders(); };
      b.querySelector("#rm_on").onclick = async e => { rs.on = !rs.on; e.currentTarget.classList.toggle("on", rs.on); if (rs.on && !(await Native.allowed(true))) toast("Allow notifications for CakeCart in your phone settings"); keep(); };
      b.querySelector("#rm_time").onchange = e => { rs.time = e.target.value || "19:00"; keep(); toast("Reminder time saved"); };
      b.querySelector("#rm_test").onclick = async () => toast(await Native.test() ? "A test alert will arrive in 5 seconds" : "Notifications are off. Allow them in your phone settings.");
      b.querySelector("#rm_batt").onclick = () => Native.openAppSettings();
      const paintUpd = async force => {
        const box = b.querySelector("#upd"); if (!box) return;
        const u = await checkUpdate(force); if (!box.isConnected || !u) return;
        box.innerHTML = u.has
          ? `<p class="small" style="margin:0 0 10px">This app is build ${u.mine}. <b>Build ${u.latest} is ready.</b> It installs over this one and keeps your data.</p><button class="primary" id="upd_get">Download update</button>`
          : `<p class="small" style="margin:0 0 10px">This app is build ${u.mine || "?"}. ${u.latest ? "You have the newest version." : "Couldn’t reach GitHub to check."}</p><button class="ghostbtn" id="upd_chk" style="width:100%">Check for updates</button>`;
        const g = box.querySelector("#upd_get"); if (g) g.onclick = () => Native.openUrl(APK_URL);
        const c = box.querySelector("#upd_chk"); if (c) c.onclick = () => { box.innerHTML = `<p class="small" style="margin:0">Checking…</p>`; paintUpd(true); };
      };
      paintUpd(false);
    }
    b.querySelector("#b_save").onclick = async () => {
      const name = `CakeCart-backup-${new Date().toISOString().slice(0,10)}.json`;
      const blob = new Blob([JSON.stringify(backupPayload(), null, 1)], {type:"application/json"});
      if (IS_APP) {
        try { await Native.shareFile(name, blob, "CakeCart backup"); store.set("lastBackup", Date.now()); renderNudges(); Native.syncBackupReminder(Date.now()); toast("Backup ready. Save it to Drive or send it to yourself."); close(); }
        catch(e) { if (!/cancel/i.test(e && e.message || "")) toast("Couldn’t save the backup: " + (e.message || e)); }
        return;
      }
      try {
        const file = new File([blob], name, {type:"application/json"});
        // Some phones (Chrome on Android) refuse to share this kind of file; then save it to Downloads instead.
        let shared = false;
        if (navigator.canShare && navigator.canShare({files:[file]})) {
          try { await navigator.share({files:[file], title:"CakeCart backup"}); shared = true; }
          catch(e) { if (e && e.name === "AbortError") return; }
        }
        if (!shared) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
        store.set("lastBackup", Date.now()); renderNudges(); toast(shared ? "Backup saved" : "Backup saved to your Downloads folder"); close();
      } catch(e) { if (e && e.name !== "AbortError") toast("Couldn’t save the backup: " + (e.message || e)); }
    };
    b.querySelector("#b_file").onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = async () => { try {
          const data = JSON.parse(rd.result);
          if (data.app !== "CakeCart" || !data.db || !data.db.recipes || !data.db.ingredients) throw new Error("This isn’t a CakeCart backup file.");
          db = data.db; have = data.have || {}; checked = {}; mergeDefaults();
          const photos = data.photos || {};
          for (const [id, r] of Object.entries(db.recipes)) if (r.photo) { photos[id] = r.photo; delete r.photo; }
          try { await Photos.replaceAll(photos); } catch(e) { for (const [id, p] of Object.entries(photos)) if (db.recipes[id]) db.recipes[id].photo = p; }
          migrateDb(); cleanQty(); saveDb(); saveState(); close(); refreshAll();
          syncReminders(); toast(`Restored ${Object.keys(db.recipes).length} recipes`);
        } catch(err) { toast(err.message || "Couldn’t read that file."); } };
      rd.readAsText(f);
    };
    confirmTap(b.querySelector("#b_reset"), "Tap again to reset everything", () => {
      const keepOrders = db.orders || [], keepBiz = db.business, keepCust = db.customers || {}, keepExp = db.expenses || []; db = clone(DEFAULTS); if (keepBiz) db.business = keepBiz; db.deleted = {recipes:[], ingredients:[]}; db.orders = keepOrders; db.customers = keepCust; db.expenses = keepExp; migrateDb(); saveDb(); cleanQty(); saveState(); close(); refreshAll(); toast("Back to the original data"); });
  });
}

// ---------- navigation ----------
let view = "cakes";
function refreshAll(){
  cleanQty(); updateChrome();
  if (view === "cakes") { renderNudges(); renderCats(); renderCakes(); }
  if (view === "list") renderList();
  if (view === "recipes") renderRecipes();
  if (view === "ingredients") renderIngredients();
  if (view === "orders") renderOrders();
  updateOrderBadge();
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
$("#newOrder").onclick = () => editOrder(null);
$("#openMenu").onclick = () => openMenu();
$("#moneyToggle").onclick = () => { hideMoney = !hideMoney; store.set("hideMoney", hideMoney); renderOrders();
  toast(hideMoney ? "Amounts hidden" : "Amounts showing"); };
$("#clearHave").onclick = () => {
  const n = Object.keys(have).length; if (!n) return;
  const prev = {...have}; have = {}; saveState(); renderIngredients();
  toast(`Unchecked ${n} item${n>1?"s":""}`, "Undo", () => { have = prev; saveState(); refreshAll(); });
};
$("#openSettings").onclick = openSettings;
$("#clearCakes").onclick = clearCakes;
document.addEventListener("keydown", e => { if (e.key === "Escape" && sheetStack.length) sheetStack[sheetStack.length-1].querySelector(".close").click(); });

migrateDb();
refreshAll();
startPhotos();
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if (IS_APP) { Native.hookBack(); Native.setup().then(() => { syncReminders(); Native.syncBackupReminder(store.get("lastBackup", null)); }); setTimeout(() => checkUpdate(false), 2500); }
if (!IS_APP && "serviceWorker" in navigator && location.protocol.startsWith("http")) {
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
  navigator.serviceWorker.register("sw.js", {updateViaCache: "none"}).then(r => r.update()).catch(() => {});
}
