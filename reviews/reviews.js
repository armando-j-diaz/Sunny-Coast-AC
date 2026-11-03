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


  // 2026-11-02: thank-you card after the private form. (A small, low-key Google review line is
  // ready in sunnycoast/2026-11-02/review-booking/preview/; Armando will say when to add it.)
  function showDone(first) {
    var card = form.closest(".feedback-card") || form.parentNode;
    if (!document.getElementById("fb-done-css")) {
      var st = document.createElement("style"); st.id = "fb-done-css";
      st.textContent = ".fb-done{padding:1.75rem 1.5rem;text-align:left}.fb-done h2{margin:0 0 .5rem;color:var(--navy);font-size:1.5rem}" +
        ".fb-done .fb-check{display:inline-flex;width:2.25rem;height:2.25rem;border-radius:50%;background:var(--navy);color:#fff;align-items:center;justify-content:center;font-weight:800;margin-bottom:.75rem}" +
        ".fb-done p{margin:.5rem 0;line-height:1.5}.fb-done .fb-next{margin-top:1rem}";
      document.head.appendChild(st);
    }
    card.innerHTML = '<div class="fb-done" role="status"><span class="fb-check" aria-hidden="true">&#10003;</span>' +
      '<h2>Thank you' + (first ? ', ' + first.replace(/[<>&"]/g, "") : '') + '. We got your message.</h2>' +
      '<p>Someone from our team will reach out soon to make this right. We read every message, and we want to fix this with you.</p>' +
      '<p class="fb-next">If it is urgent, call or text us at <a href="tel:+17868226861">(786) 822-6861</a>.</p></div>';
    window.scrollTo(0, Math.max(0, card.getBoundingClientRect().top + window.pageYOffset - 120)); // clear the sticky header
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
    // 2026-11-02: phone is required (the team follows up in the texts app). 10 US digits, a leading 1 is OK.
    var phoneEl = form.elements.namedItem("phone");
    var digits = phoneEl.value.replace(/\D/g, "");
    if (digits.length === 11 && digits.charAt(0) === "1") digits = digits.slice(1);
    phoneEl.setCustomValidity(digits.length === 10 ? "" : "Please enter a 10-digit phone number.");
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

    if (window.SC_REVIEW_TOKEN) payload.review_token = window.SC_REVIEW_TOKEN;

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
          showDone(String(payload.name || "").trim().split(/\s+/)[0]);
          return;
        }
        if (r.status === 400) {
          show("Please check your name, email, phone, and message, then try again.", true);
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
