/**
 * Sunny Coast AC — site behavior
 * Placeholders left: {{MAKE_WEBHOOK_URL}}
 * Phone set: 7866671180 / (786) 667-1180
 * Optional override:
 *   window.SUNNYCOAST = {
 *     phone: "7866671180",
 *     makeWebhook: "https://hook...",
 *     vslSrc: "assets/vsl.mp4"
 *   }
 */
(function () {
  "use strict";

  var cfg = Object.assign(
    {
      phone: "7866671180",
      makeWebhook: "{{MAKE_WEBHOOK_URL}}",
      vslSrc: "assets/vsl.mp4",
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

  function webhookAction(form) {
    var action = form.getAttribute("action") || "";
    if (cfg.makeWebhook && cfg.makeWebhook.indexOf("{{") === -1) {
      form.setAttribute("action", cfg.makeWebhook);
      return cfg.makeWebhook;
    }
    return action;
  }

  function guideForm() {
    var form = document.getElementById("guide-form");
    if (!form) return;

    var status = document.getElementById("form-status");
    var action = webhookAction(form);

    form.addEventListener("submit", function (ev) {
      var marketing = form.querySelector('[name="consent_marketing"]');
      var guideConsent = form.querySelector('[name="consent_guide"]');
      if (!guideConsent || !guideConsent.checked) {
        ev.preventDefault();
        showStatus(status, "Check the box to receive your guide.", true);
        return;
      }

      if (!action || action.indexOf("{{") !== -1) {
        ev.preventDefault();
        showStatus(
          status,
          "Guide delivery isn't wired yet. Call us and ask for the Survival Guide.",
          false
        );
        return;
      }

      if (!window.fetch) return;
      ev.preventDefault();
      postJSON(
        action,
        {
          name: (form.name.value || "").trim(),
          email: (form.email.value || "").trim(),
          phone: (form.phone.value || "").trim(),
          consent_guide: true,
          consent_marketing: !!(marketing && marketing.checked),
          source: "sunnycoastac.com/guide",
        },
        form,
        status,
        "Got it — check your email for the guide. Stay cool.",
        "Something glitched. Call us and we'll send the guide."
      );
    });
  }

  function bookForm() {
    var form = document.getElementById("appointment-form");
    if (!form) return;

    var status = document.getElementById("book-status");
    var action = webhookAction(form);

    form.addEventListener("submit", function (ev) {
      var consent = form.querySelector('[name="consent_contact"]');
      if (!consent || !consent.checked) {
        ev.preventDefault();
        showStatus(status, "Check the contact agreement box to continue.", true);
        return;
      }

      var phone = (form.phone.value || "").trim();
      var first = (form.first_name.value || "").trim();
      var last = (form.last_name.value || "").trim();
      if (!phone || !first || !last) {
        ev.preventDefault();
        showStatus(status, "Phone, first name, and last name are required.", true);
        return;
      }

      var sms = form.querySelector('[name="consent_sms"]');
      var payload = {
        phone: phone,
        first_name: first,
        last_name: last,
        consent_sms: !!(sms && sms.checked),
        consent_contact: true,
        source: "sunnycoastac.com/book",
        intent: "schedule_appointment",
      };

      if (!action || action.indexOf("{{") !== -1) {
        ev.preventDefault();
        showStatus(
          status,
          "Got it locally — webhook isn't wired yet. We'll still call once Make is connected. For now, call us if it's urgent.",
          false
        );
        try {
          var leads = JSON.parse(localStorage.getItem("sunnycoast_leads") || "[]");
          leads.push(Object.assign({ at: new Date().toISOString() }, payload));
          localStorage.setItem("sunnycoast_leads", JSON.stringify(leads));
        } catch (e) {}
        form.reset();
        return;
      }

      if (!window.fetch) return;
      ev.preventDefault();
      postJSON(
        action,
        payload,
        form,
        status,
        "You're in — we'll call you soon to lock in a time. Stay cool.",
        "Something glitched. Call us and we'll get you on the calendar."
      );
    });
  }

  function postJSON(url, payload, form, status, okMsg, errMsg) {
    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.disabled = true;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("bad status");
        showStatus(status, okMsg, false);
        form.reset();
      })
      .catch(function () {
        showStatus(status, errMsg, true);
      })
      .finally(function () {
        if (btn) btn.disabled = false;
      });
  }

  function showStatus(status, msg, isErr) {
    if (!status) return;
    status.hidden = false;
    status.textContent = msg;
    status.classList.toggle("is-error", !!isErr);
  }

  /**
   * VSL behavior (Hormozi-style):
   * - Autoplay muted on load
   * - Click/tap: restart from 0 WITH sound
   */
  function vslPlayer() {
    var video = document.getElementById("vsl-video");
    var tap = document.getElementById("vsl-tap");
    var player = document.getElementById("vsl-player");
    var fallback = document.getElementById("vsl-fallback");
    if (!video || !player) return;

    if (cfg.vslSrc) {
      var source = video.querySelector("source");
      if (source) source.setAttribute("src", cfg.vslSrc);
      video.load();
    }

    var hasSoundUnlocked = false;

    function tryMuteAutoplay() {
      video.muted = true;
      video.loop = true;
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          if (tap) tap.classList.add("is-visible");
        });
      }
    }

    video.addEventListener("error", function () {
      if (fallback) fallback.hidden = false;
      if (tap) tap.hidden = true;
      video.style.display = "none";
    });

    // If source 404s, some browsers fire error on source; check after load attempt
    video.addEventListener("loadeddata", function () {
      if (fallback) fallback.hidden = true;
      tryMuteAutoplay();
    });

    function unlockWithSound(ev) {
      if (ev) ev.preventDefault();
      hasSoundUnlocked = true;
      video.currentTime = 0;
      video.muted = false;
      video.loop = false;
      player.classList.add("is-playing-sound");
      if (tap) tap.classList.remove("is-visible");
      video.play().catch(function () {});
    }

    if (tap) {
      tap.addEventListener("click", unlockWithSound);
    }
    video.addEventListener("click", function (ev) {
      unlockWithSound(ev);
    });

    // Initial attempt
    tryMuteAutoplay();

    // Prefer-reduced-motion: don't autoplay
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      if (tap) {
        tap.classList.add("is-visible");
        tap.querySelector(".vsl-tap-label").textContent = "Play video";
      }
    }

    // Expose for debugging
    window.__sunnyVsl = { video: video, unlock: unlockWithSound };
  }

  applyPhoneLinks();
  heroLoad();
  revealOnScroll();
  guideForm();
  bookForm();
  vslPlayer();
})();
