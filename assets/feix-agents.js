/* Feix Agents vitrin — scripted stock-agent demo (self-contained; canlı LLM demo = sonraki adım).
   Amaç: "izler → uyarır → taslak hazırlar → SEN onaylarsın" (günlük-etki + kontrol). */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  var chat, approve, running = false;
  function add(cls, html) { var m = el("div", "msg " + cls, html); chat.appendChild(m); chat.scrollTop = chat.scrollHeight; return m; }

  async function typing(ms) { var t = add("a", "<span class='muted'>...</span>"); await sleep(ms); t.remove(); }

  async function run() {
    if (running) return; running = true;
    chat.innerHTML = ""; approve.innerHTML = "";
    await typing(700);
    add("a", "Hi. I keep an eye on your stock. Right now, 2 items are running low:" +
      "<div class='list'>Flour (T65): <b>8 kg</b> left <span class='muted'>· threshold 15 kg</span><br>" +
      "Butter: <b>3 kg</b> left <span class='muted'>· threshold 10 kg</span></div>");
    await sleep(900); await typing(650);
    add("a", "Want me to prepare the supplier order?");
    var yes = el("button", "btn btn-primary btn-sm", "Yes, prepare it");
    var no = el("button", "btn btn-ghost btn-sm", "Not now");
    approve.appendChild(yes); approve.appendChild(no);
    yes.addEventListener("click", async function () {
      approve.innerHTML = ""; add("u", "Yes, prepare it");
      await sleep(500); await typing(800);
      add("a", "Done. Draft order for Metro:" +
        "<div class='list'>Flour T65 &times; 25 kg<br>Butter &times; 10 kg<br><span class='muted'>estimated ~ 180 EUR</span></div>");
      await sleep(700); await typing(600);
      add("a", "<span class='warn'>I'll send it to you for a final okay before it goes out.</span> Nothing is ordered without you.");
      running = false;
    });
    no.addEventListener("click", function () { approve.innerHTML = ""; add("u", "Not now"); add("a", "No problem. I'll keep watching and flag you if it gets urgent."); running = false; });
    running = false;
  }

  document.addEventListener("DOMContentLoaded", function () {
    chat = $("#chat"); approve = $("#approve");
    var start = $("#demo-start");
    if (start) start.addEventListener("click", run);
    // auto-run once when demo scrolls into view
    var demo = $("#demo");
    if (demo && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { run(); io.disconnect(); } });
      }, { threshold: .5 });
      io.observe(demo);
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("#theme-toggle")) return;
    var root = document.documentElement, cur = root.getAttribute("data-theme");
    root.setAttribute("data-theme", cur === "dark" ? "light" : (cur === "light" ? "dark" : (matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark")));
  });
})();
