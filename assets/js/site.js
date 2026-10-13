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

  // Tap the hero ibis five times and it takes off, then walks back in.
  var ibis = document.querySelector("[data-ibis]");
  if (ibis && !reduceMotion) {
    var taps = [];
    ibis.addEventListener("pointerdown", function () {
      var now = Date.now();
      taps = taps.filter(function (t) { return now - t < 2500; });
      taps.push(now);
      if (taps.length >= 5 && !ibis.classList.contains("fly")) {
        taps = [];
        ibis.classList.add("fly");
        setTimeout(function () { ibis.classList.remove("fly"); }, 2700);
      }
    });
  }
})();
