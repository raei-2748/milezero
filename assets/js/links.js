/*
 * Mile Zero — form and document links, all in one place.
 *
 * To connect a form, paste its URL between the quotes below.
 * While a value is empty, every button using it keeps its fallback link
 * (an email to hello@milezeronetwork.org, or the toolkit request section).
 */
var MILEZERO_LINKS = {
  register: "",     // Google Form: team registration
  toolkit: "",      // Google Form: Starter Toolkit request
  network: "",      // Google Form: join the Mile Zero Network
  ambassador: "",   // Google Form: ambassador expression of interest
  startguide: "",   // Shared Google Doc: Start guide (open to everyone)
  teacherpager: ""  // Shared Google Doc: Teacher one-pager (open to everyone)
};

(function () {
  var els = document.querySelectorAll("[data-link]");
  for (var i = 0; i < els.length; i++) {
    var url = MILEZERO_LINKS[els[i].getAttribute("data-link")];
    if (url) {
      els[i].setAttribute("href", url);
      els[i].setAttribute("rel", "noopener");
    }
  }
})();
