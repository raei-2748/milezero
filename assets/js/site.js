(function () {
  // Point data-link buttons at their Google Form (or portal) once a link is set in links.js.
  // Until then each button keeps its mailto: fallback from the HTML.
  var links = window.MZ_LINKS || {};
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var url = links[el.getAttribute("data-link")];
    if (url) {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.setAttribute("data-pending", "");
    }
  });

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Distance counter: the real distance scrolled, at the CSS standard of 96 px to the inch.
  var odometer = document.querySelector("[data-odometer]");
  var METRES_PER_PX = 0.0254 / 96;

  // The walker follows your progress through the route, facing the way you scroll.
  var track = document.querySelector(".route-track");
  var walker = track && track.querySelector(".walker");
  var lastProgress = -1;
  var stopTimer;

  function frame() {
    ticking = false;
    if (odometer) odometer.textContent = (window.scrollY * METRES_PER_PX).toFixed(2) + " m";
    if (!walker || !track.offsetWidth) return;
    var route = track.parentElement.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = Math.min(1, Math.max(0, (vh * 0.85 - route.top) / (route.height + vh * 0.35)));
    var x = progress * (track.offsetWidth - walker.offsetWidth);
    walker.style.transform = "translateX(" + x.toFixed(1) + "px)";
    if (lastProgress >= 0 && progress !== lastProgress) {
      walker.classList.toggle("back", progress < lastProgress);
      if (!reduceMotion) {
        walker.classList.add("walking");
        clearTimeout(stopTimer);
        stopTimer = setTimeout(function () { walker.classList.remove("walking"); }, 160);
      }
    }
    lastProgress = progress;
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  }
  if (odometer || walker) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    frame();
  }

  // A spring with Apple's two designer parameters: damping ratio and response (seconds).
  // It keeps its own velocity, so retargeting or grabbing mid-flight never jumps.
  function Spring(damping, response) {
    this.x = 0; this.v = 0; this.target = 0;
    this.k = Math.pow((2 * Math.PI) / response, 2);
    this.c = (4 * Math.PI * damping) / response;
  }
  Spring.prototype.step = function (dt) {
    var a = -this.k * (this.x - this.target) - this.c * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
  };
  Spring.prototype.settled = function () {
    return Math.abs(this.x - this.target) < 0.05 && Math.abs(this.v) < 0.05;
  };

  // The further past the bound, the less the element follows.
  function rubberband(offset, dimension) {
    var c = 0.55;
    return (offset * dimension * c) / (dimension + c * Math.abs(offset));
  }

  // The hero ibis can be grabbed: it tracks the pointer 1:1 from where you grabbed it,
  // resists the further you pull (it's tethered to the start line), and springs home
  // at your release velocity. A quick tap counts toward the five-tap easter egg.
  var ibis = document.querySelector("[data-ibis]");
  if (ibis) {
    // Momentum interaction, so a little bounce: damping 0.75, response 0.45.
    var sx = new Spring(0.75, 0.45), sy = new Spring(0.75, 0.45), sr = new Spring(0.8, 0.4);
    var dragging = false, raf = 0, startX = 0, startY = 0, baseX = 0, baseY = 0, downAt = 0, moved = 0, history = [];
    var size = function () { return Math.max(ibis.getBoundingClientRect().width, 200); };

    var render = function () {
      ibis.style.transform = "translate(" + sx.x.toFixed(2) + "px," + sy.x.toFixed(2) + "px) rotate(" + sr.x.toFixed(2) + "deg)";
    };
    var last = 0;
    var tick = function (t) {
      var dt = Math.min(0.032, (t - (last || t)) / 1000) || 1 / 60;
      last = t;
      // Two half-steps per frame keep the spring stable on slow laptops.
      // While dragging, position follows the pointer exactly; only the lean animates.
      for (var i = 0; i < 2; i++) { if (!dragging) { sx.step(dt / 2); sy.step(dt / 2); } sr.step(dt / 2); }
      render();
      if (!dragging && sx.settled() && sy.settled() && sr.settled()) {
        sx.x = sy.x = sr.x = 0; sx.v = sy.v = sr.v = 0; render(); ibis.style.transform = ""; raf = 0; last = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    var run = function () { if (!raf) raf = requestAnimationFrame(tick); };

    ibis.addEventListener("pointerdown", function (e) {
      if (e.button > 0 || ibis.classList.contains("fly")) return;
      ibis.setPointerCapture(e.pointerId);
      dragging = true;
      ibis.classList.add("grabbed");
      // Start from where the ibis is right now, even mid-bounce.
      baseX = sx.x; baseY = sy.x; sx.v = sy.v = 0;
      startX = e.clientX; startY = e.clientY; downAt = performance.now(); moved = 0;
      history = [{ x: e.clientX, y: e.clientY, t: downAt }];
    });

    ibis.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX, dy = e.clientY - startY, now = performance.now();
      moved = Math.max(moved, Math.hypot(dx, dy));
      var d = size();
      sx.x = rubberband(baseX + dx, d); sy.x = rubberband(baseY + dy, d);
      history.push({ x: e.clientX, y: e.clientY, t: now });
      while (history.length > 2 && now - history[0].t > 80) history.shift();
      // Lean into the direction of travel.
      var h0 = history[0], vx = (e.clientX - h0.x) / Math.max(1, now - h0.t);
      sr.target = Math.max(-10, Math.min(10, vx * 6));
      run();
    });

    var release = function (e) {
      if (!dragging) return;
      dragging = false;
      ibis.classList.remove("grabbed");
      var now = performance.now(), h0 = history[0] || { x: e.clientX, y: e.clientY, t: now };
      var dtm = Math.max(16, now - h0.t);
      if (reduceMotion) {
        sx.x = sy.x = sr.x = 0; sx.v = sy.v = sr.v = 0; sr.target = 0; render(); ibis.style.transform = "";
      } else {
        // Hand the pointer's release velocity to the spring (px/s), damped by the rubber band.
        sx.v = ((e.clientX - h0.x) / dtm) * 1000 * 0.5;
        sy.v = ((e.clientY - h0.y) / dtm) * 1000 * 0.5;
        sx.target = sy.target = sr.target = 0;
        run();
      }
      if (moved < 10 && now - downAt < 350) countTap();
    };
    ibis.addEventListener("pointerup", release);
    ibis.addEventListener("pointercancel", release);

    // Tap the ibis five times and it takes off, then walks back in.
    var taps = [];
    var countTap = function () {
      if (reduceMotion) return;
      var now = Date.now();
      taps = taps.filter(function (t) { return now - t < 2500; });
      taps.push(now);
      if (taps.length >= 5 && !ibis.classList.contains("fly")) {
        taps = [];
        ibis.classList.add("fly");
        setTimeout(function () { ibis.classList.remove("fly"); }, 2700);
      }
    };
  }

  // The drinks-stall mini case. Numbers and bars follow critically damped springs
  // (no overshoot, response 0.35 s), starting from wherever they are on screen.
  var stall = document.querySelector("[data-stall]");
  if (stall) {
    var DEMAND = { 3: 190, 4: 150, 5: 100, 6: 60 }, COST = 300;
    var fig = function (name) { return stall.querySelector('[data-f="' + name + '"]'); };
    var note = stall.querySelector("[data-note]");
    var springs = { sold: new Spring(1, 0.35), revenue: new Spring(1, 0.35), profit: new Spring(1, 0.35) };
    var bars = {};
    [3, 4, 5, 6].forEach(function (p) {
      var row = stall.querySelector('[data-bar="' + p + '"]');
      bars[p] = { row: row, fill: row.querySelector("b"), label: row.querySelector("em"), s: new Spring(1, 0.35) };
    });
    var tried = {}, sraf = 0, slast = 0;
    var money = function (n) { return (n < 0 ? "−$" : "$") + Math.abs(Math.round(n)); };
    var paint = function () {
      fig("sold").textContent = Math.round(springs.sold.x);
      fig("revenue").textContent = money(springs.revenue.x);
      fig("profit").textContent = money(springs.profit.x);
      Object.keys(bars).forEach(function (p) {
        bars[p].fill.style.transform = "scaleX(" + Math.max(0, bars[p].s.x).toFixed(4) + ")";
      });
    };
    var all = function () { return [springs.sold, springs.revenue, springs.profit].concat(Object.keys(bars).map(function (p) { return bars[p].s; })); };
    var stick = function (t) {
      var dt = Math.min(0.032, (t - (slast || t)) / 1000) || 1 / 60;
      slast = t;
      var list = all(), done = true;
      list.forEach(function (sp) { sp.step(dt / 2); sp.step(dt / 2); if (!sp.settled()) done = false; });
      if (done) list.forEach(function (sp) { sp.x = sp.target; sp.v = 0; });
      paint();
      sraf = done ? 0 : requestAnimationFrame(stick);
      if (done) slast = 0;
    };
    var choose = function (price) {
      var sold = DEMAND[price], revenue = sold * price, profit = revenue - COST;
      tried[price] = true;
      springs.sold.target = sold; springs.revenue.target = revenue; springs.profit.target = profit;
      Object.keys(bars).forEach(function (p) {
        var pr = DEMAND[p] * p - COST;
        bars[p].s.target = tried[p] ? pr / 300 : 0;
        bars[p].label.textContent = tried[p] ? money(pr) : "";
        bars[p].row.classList.toggle("on", +p === price);
      });
      var count = Object.keys(tried).length;
      note.textContent = "At $" + price + ", about " + sold + " people buy: " + money(revenue) + " in, minus the $300 you already spent, is " + money(profit) + " profit." +
        (count < 4 ? " Try another price." : " You've tried them all. Which would you pick?");
      if (reduceMotion) { all().forEach(function (sp) { sp.x = sp.target; sp.v = 0; }); paint(); }
      else if (!sraf) sraf = requestAnimationFrame(stick);
    };
    stall.querySelectorAll('input[name="stall-price"]').forEach(function (input) {
      input.addEventListener("change", function () { choose(+input.value); });
    });
  }

  // Reveal panels: the button names what it does, and the panel can reverse mid-way.
  document.querySelectorAll("[data-reveal]").forEach(function (btn) {
    var panel = btn.closest("[data-reveal-panel]");
    btn.addEventListener("click", function () {
      var open = !panel.classList.contains("open");
      panel.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Hide the lesson" : "Show the lesson";
    });
  });
})();
