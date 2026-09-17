(function () {
  "use strict";

  var form = document.getElementById("feedback-form");
  if (!form) return;

  // Private complaints go to the Ops worker's dedicated receiver. Never to the sales/quote webhook.
  var PROD_ENDPOINT = "https://quotes.sunnycoastac.com/api/feedback";
  var host = window.location.hostname;
  var isProd = host === "sunnycoastac.com" || host === "www.sunnycoastac.com";
  var isLocal = ["localhost", "127.0.0.1", "[::1]"].indexOf(host) !== -1;

  // Local previews never reach production. To test against `wrangler dev`, open
  // /reviews/feedback/?feedback_api=http://127.0.0.1:8787 (local addresses only).
  var endpoint = "";
  if (isProd) {
    endpoint = PROD_ENDPOINT;
  } else if (isLocal) {
    var override = new URLSearchParams(window.location.search).get("feedback_api") || "";
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(override)) endpoint = override + "/api/feedback";
  }

  var submit = form.querySelector('[type="submit"]');
  var status = document.getElementById("feedback-status");
  var idleLabel = "Send feedback";
  var submissionId = "";
  var sending = false;

  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = new Uint8Array(16);
    crypto.getRandomValues(b);
    b[6] = (b[6] & 15) | 64;
    b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join("");
    return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
  }

  function show(text, isError) {
    status.hidden = false;
    status.textContent = text;
    status.classList.toggle("is-error", !!isError);
  }

  function field(name) {
    var el = form.elements.namedItem(name);
    return el ? String(el.value || "") : "";
  }

  if (!endpoint && !isLocal) {
    submit.disabled = true;
    submit.textContent = "Feedback form unavailable";
    show("This form is not available here. Please call (786) 822-6861 or email admin@sunnycoastac.com.", true);
    return;
  }
  submit.disabled = false;
  submit.textContent = idleLabel;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (sending) return;
    ["name", "email", "message"].forEach(function (name) {
      var el = form.elements.namedItem(name);
      el.setCustomValidity(el.value.trim() ? "" : "Please fill out this field.");
    });
    if (!form.reportValidity()) return;

    if (!endpoint) {
      show("Local preview: nothing was sent or saved. Add ?feedback_api=http://127.0.0.1:8787 to test with a local worker.");
      return;
    }

    // One ID per message. Kept until the team has it, so a retry never creates a duplicate.
    if (!submissionId) submissionId = newId();
    var payload = {
      submission_id: submissionId,
      name: field("name"),
      email: field("email"),
      phone: field("phone"),
      message: field("message"),
      company_website: field("company_website"),
      form_loaded_at: field("form_loaded_at")
    };

    sending = true;
    submit.disabled = true;
    submit.textContent = "Sending…";
    status.hidden = true;

    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);

    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "omit",
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { status: res.status, data: data };
        });
      })
      .then(function (r) {
        if (r.status === 200 && r.data && r.data.ok) {
          form.reset();
          submissionId = "";
          var loaded = form.elements.namedItem("form_loaded_at");
          if (loaded) loaded.value = String(Date.now());
          show("Thank you for letting us know. Our team will review your message and follow up.");
          return;
        }
        if (r.status === 400) {
          show("Please check your name, email, and message, then try again.", true);
        } else if (r.status === 429) {
          show("We received several messages from this connection. Please call (786) 822-6861 or email admin@sunnycoastac.com.", true);
        } else {
          show("We couldn't send your message. Your text is still here. Please try again, or call (786) 822-6861.", true);
        }
      })
      .catch(function () {
        show("We couldn't send your message. Your text is still here. Please try again, or call (786) 822-6861.", true);
      })
      .then(function () {
        clearTimeout(timer);
        sending = false;
        submit.disabled = false;
        submit.textContent = idleLabel;
      });
  });

  form.addEventListener("input", function (event) {
    if (event.target.setCustomValidity) event.target.setCustomValidity("");
    if (!sending) status.hidden = true;
  });
})();
