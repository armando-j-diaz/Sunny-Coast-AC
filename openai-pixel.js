/* OpenAI Ads measurement for public Sunny Coast pages. */
(function (w, d) {
  "use strict";
  if (w.oaiq) return;
  var q = function () { q.q.push(arguments); };
  q.q = [];
  w.oaiq = q;
  var js = d.createElement("script");
  js.async = true;
  js.src = "https://bzrcdn.openai.com/sdk/oaiq.min.js";
  d.head.appendChild(js);
  q("init", { pixelId: "XiU7RbsNqVnFPaqN72Y5vv" });

  w.SunnyCoastAds = {
    leadCreated: function () { q("measure", "lead_created", { type: "customer_action" }); }
  };

  if (w.location.pathname === "/booked/") {
    // A short guard prevents refreshes from counting the same booking twice.
    var key = "sunnycoast_openai_booking_event_at";
    var now = Date.now();
    var last = Number(w.sessionStorage.getItem(key) || 0);
    if (!last || now - last > 30 * 60 * 1000) {
      w.sessionStorage.setItem(key, String(now));
      q("measure", "appointment_scheduled", { type: "customer_action" });
    }
  }
})(window, document);
