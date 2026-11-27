// CakeCart: extras for the Android app.
// In a browser (including the iPhone version) IS_APP is false and every function here quietly does nothing,
// so the web app behaves exactly as before.
const IS_APP = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const NP = IS_APP ? (window.Capacitor.Plugins || {}) : {};

const Native = (() => {
  const LN = () => NP.LocalNotifications, FS = () => NP.Filesystem, SH = () => NP.Share, CLOCK = () => NP.CakeClock;
  // Notification ids must be whole numbers; turn our text ids into stable numbers.
  const numId = s => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h) % 2000000000 + 1; };
  let ready = null;

  function setup(){
    if (!IS_APP) return Promise.resolve(false);
    if (ready) return ready;
    ready = (async () => {
      try {
        await LN().createChannel({id:"timers", name:"Baking timers", description:"Rings when a baking timer finishes", importance:5, visibility:1, vibration:true, sound:"default"});
        await LN().createChannel({id:"orders", name:"Order reminders", description:"Cakes due soon", importance:4, visibility:1, vibration:true});
        await LN().createChannel({id:"general", name:"Reminders", description:"Backup reminders", importance:3, visibility:1});
        LN().addListener("localNotificationActionPerformed", e => {
          const x = (e && e.notification && e.notification.extra) || {};
          if (x.kind === "order" && typeof go === "function") go("orders");
          if (x.kind === "backup" && typeof openSettings === "function") openSettings();
        });
      } catch(e) {}
      return true;
    })();
    return ready;
  }

  async function allowed(ask){
    if (!IS_APP) return false;
    await setup();
    try {
      let p = await LN().checkPermissions();
      if (p.display !== "granted" && ask) p = await LN().requestPermissions();
      return p.display === "granted";
    } catch(e) { return false; }
  }

  async function schedule(list){
    if (!list.length || !(await allowed(true))) return false;
    try { await LN().schedule({notifications: list}); return true; } catch(e) { return false; }
  }
  async function cancel(ids){
    if (!IS_APP || !ids.length) return;
    try { await LN().cancel({notifications: ids.map(id => ({id}))}); } catch(e) {}
  }
  async function pendingOf(kind){
    try { const r = await LN().getPending(); return (r.notifications || []).filter(n => n.extra && n.extra.kind === kind); } catch(e) { return []; }
  }

  return {
    setup, allowed, numId,

    // ---- baking timers ----
    timerStarted(t){
      if (!IS_APP) return;
      schedule([{id: numId(t.id), title: "Timer done", body: t.label, channelId: "timers",
        schedule: {at: new Date(t.end), allowWhileIdle: true}, extra: {kind: "timer", tid: t.id}}]);
    },
    timerGone(t){ if (IS_APP) cancel([numId(t.id)]); },

    // Hand a timer to the phone's own Clock app
    async clockTimer(label, min){
      if (!IS_APP || !CLOCK()) return false;
      try { await CLOCK().setTimer({seconds: Math.round(min * 60), label}); return true; } catch(e) { return false; }
    },
    // ---- updates: compare this app's build number with the newest one on GitHub ----
    async appBuild(){ try { const i = await NP.App.getInfo(); return +i.build || 0; } catch(e) { return 0; } },
    async latestBuild(){
      try {
        const r = await fetch("https://api.github.com/repos/Berto0481/cakecart/releases/tags/android", {cache: "no-store"});
        if (!r.ok) return 0;
        const m = /build (\d+)/.exec((await r.json()).name || ""); return m ? +m[1] : 0;
      } catch(e) { return 0; }
    },
    openUrl(url){ if (IS_APP && CLOCK()) CLOCK().openUrl({url}).catch(() => {}); },
    openAppSettings(){ if (IS_APP && CLOCK()) CLOCK().openAppSettings().catch(() => {}); },

    // ---- order reminders: one notification per due day, the evening before ----
    async syncOrders(orders, settings){
      if (!IS_APP) return;
      await setup();
      const old = await pendingOf("order");
      await cancel(old.map(n => n.id));
      if (!settings || settings.on === false) return;
      const [hh, mmn] = String(settings.time || "19:00").split(":").map(Number);
      const byDay = {};
      for (const o of orders) { if (!o.done && o.due) (byDay[o.due] = byDay[o.due] || []).push(o); }
      const list = [];
      for (const [day, os] of Object.entries(byDay)) {
        const [y, m, d] = day.split("-").map(Number);
        const at = new Date(y, m - 1, d - 1, hh || 0, mmn || 0);
        if (at.getTime() <= Date.now() + 30000) continue;
        const lines = os.map(o => {
          const cakes = o.items.map(it => (it.qty > 1 ? it.qty + " × " : "") + (it.name || "Cake")).join(", ");
          const how = o.method === "delivery" ? " (delivery)" : o.method === "pickup" ? " (pickup)" : "";
          return `${cakes}${o.customer ? " for " + o.customer : ""}${how}`;
        });
        const n = os.reduce((a, o) => a + o.items.reduce((b, it) => b + (+it.qty || 0), 0), 0);
        list.push({id: numId("order-" + day), channelId: "orders", title: `Tomorrow: ${n} cake${n === 1 ? "" : "s"} due`,
          body: lines.join(" · "), largeBody: lines.join("\n"),
          schedule: {at, allowWhileIdle: true}, extra: {kind: "order", day}});
      }
      if (list.length) await schedule(list);
    },

    // ---- backup reminder: a nudge if no backup is made for 3 weeks ----
    async syncBackupReminder(lastBackup){
      if (!IS_APP) return;
      await setup();
      const id = numId("backup");
      await cancel([id]);
      const at = new Date((lastBackup || Date.now()) + 21 * 864e5);
      if (at.getTime() < Date.now() + 60000) at.setTime(Date.now() + 864e5);
      at.setHours(18, 0, 0, 0);
      if (!(await allowed(false))) return;
      try { await LN().schedule({notifications: [{id, channelId: "general", title: "Time for a CakeCart backup",
        body: "It's been 3 weeks. Tap to save a backup of your recipes and orders.", schedule: {at, allowWhileIdle: true}, extra: {kind: "backup"}}]}); } catch(e) {}
    },

    async test(){
      return schedule([{id: numId("test-" + Date.now()), channelId: "timers", title: "CakeCart test", body: "Notifications are working.",
        schedule: {at: new Date(Date.now() + 5000), allowWhileIdle: true}, extra: {kind: "test"}}]);
    },

    // ---- files: the app can't use the browser's share/download, so it writes the file then opens the share sheet ----
    async shareFile(name, blob, title){
      const data = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(blob); });
      const w = await FS().writeFile({path: name, data, directory: "CACHE"});
      await SH().share({title, files: [w.uri], dialogTitle: title});
    },

    async shareFiles(list, title){
      const uris = [];
      for (const f of list) {
        const data = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(f.blob); });
        uris.push((await FS().writeFile({path: f.name, data, directory: "CACHE"})).uri);
      }
      await SH().share({title, files: uris, dialogTitle: title});
    },

    // ---- Android back button: closes the top-most thing, then leaves the app ----
    hookBack(){
      if (!IS_APP || !NP.App) return;
      NP.App.addListener("backButton", () => {
        const alarmOk = document.querySelector("#alarm.show #alarmOk"); if (alarmOk) { alarmOk.click(); return; }
        const sheets = document.querySelectorAll(".sheetwrap.open"); if (sheets.length) { sheets[sheets.length - 1].querySelector(".close").click(); return; }
        const bake = document.querySelector(".bake #bkClose"); if (bake) { bake.click(); return; }
        NP.App.minimizeApp();
      });
      // Coming back to the app: refresh reminders in case days have passed
      NP.App.addListener("resume", () => { if (typeof syncReminders === "function") syncReminders(); if (typeof checkUpdate === "function") checkUpdate(false); });
    }
  };
})();
