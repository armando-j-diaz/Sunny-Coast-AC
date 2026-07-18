/**
 * Sunny Coast AC — site behavior
 * Placeholders: replace {{PHONE}} and {{MAKE_WEBHOOK_URL}} sitewide when ready.
 * Optional override without editing every link:
 *   window.SUNNYCOAST = { phone: "3055551234", makeWebhook: "https://hook..." }
 */
(function () {
  "use strict";

  var cfg = Object.assign(
    {
      phone: "{{PHONE}}",
      makeWebhook: "{{MAKE_WEBHOOK_URL}}",
    },
    window.SUNNYCOAST || {}
  );

  function phoneReady(p) {
    return p && p.indexOf("{{") === -1 && /\d{7,}/.test(p);
  }

  function digits(p) {
    return String(p).replace(/[^\d+]/g, "");
  }

  function applyPhoneLinks() {
    if (!phoneReady(cfg.phone)) return;
    var tel = "tel:" + digits(cfg.phone);
    var sms = "sms:" + digits(cfg.phone);
    document.querySelectorAll("[data-tel]").forEach(function (el) {
      el.setAttribute("href", tel);
      if (el.textContent.indexOf("{{PHONE}}") !== -1) {
        el.textContent = el.textContent.replace(/\{\{PHONE\}\}/g, cfg.phone);
      }
    });
    document.querySelectorAll("[data-sms]").forEach(function (el) {
      el.setAttribute("href", sms);
    });
    document.body.querySelectorAll("*").forEach(function (el) {
      if (el.children.length === 0 && el.textContent.indexOf("{{PHONE}}") !== -1) {
        el.textContent = el.textContent.replace(/\{\{PHONE\}\}/g, cfg.phone);
      }
    });
  }

  function revealOnScroll() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function heroLoad() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.add("is-ready");
      return;
    }
    requestAnimationFrame(function () {
      document.body.classList.add("is-ready");
    });
  }

  function guideForm() {
    var form = document.getElementById("guide-form");
    if (!form) return;

    var status = document.getElementById("form-status");
    var action = form.getAttribute("action") || "";
    if (cfg.makeWebhook && cfg.makeWebhook.indexOf("{{") === -1) {
      form.setAttribute("action", cfg.makeWebhook);
      action = cfg.makeWebhook;
    }

    form.addEventListener("submit", function (ev) {
      var marketing = form.querySelector('[name="consent_marketing"]');
      var guideConsent = form.querySelector('[name="consent_guide"]');
      if (!guideConsent || !guideConsent.checked) {
        ev.preventDefault();
        showStatus("Check the box to receive your guide.", true);
        return;
      }

      // If webhook not wired yet, prompt to text (do not invent an email)
      if (!action || action.indexOf("{{") !== -1) {
        ev.preventDefault();
        showStatus(
          "Guide delivery isn't wired yet. Text us and ask for the Survival Guide — we'll send it.",
          false
        );
        var smsLink = document.querySelector("[data-sms]");
        if (smsLink && phoneReady(cfg.phone)) {
          window.location.href = smsLink.getAttribute("href");
        }
        return;
      }

      // Fetch POST for Make webhook (JSON) when wired; keep progressive enhancement
      if (window.fetch) {
        ev.preventDefault();
        var payload = {
          name: (form.name.value || "").trim(),
          email: (form.email.value || "").trim(),
          phone: (form.phone.value || "").trim(),
          consent_guide: true,
          consent_marketing: !!(marketing && marketing.checked),
          source: "sunnycoastac.com/guide",
        };
        var btn = form.querySelector('[type="submit"]');
        if (btn) btn.disabled = true;
        fetch(action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then(function (res) {
            if (!res.ok) throw new Error("bad status");
            showStatus("Got it — check your email for the guide. Stay cool.", false);
            form.reset();
          })
          .catch(function () {
            showStatus("Something glitched. Text us and we'll send the guide.", true);
          })
          .finally(function () {
            if (btn) btn.disabled = false;
          });
      }
    });

    function showStatus(msg, isErr) {
      if (!status) return;
      status.hidden = false;
      status.textContent = msg;
      status.classList.toggle("is-error", !!isErr);
    }
  }

  applyPhoneLinks();
  heroLoad();
  revealOnScroll();
  guideForm();
})();
