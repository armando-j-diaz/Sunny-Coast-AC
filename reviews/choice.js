(function () {
  'use strict';
  var token = window.SC_REVIEW_TOKEN || '';
  if (!/^[a-f0-9]{16}$/.test(token)) return; // Generic NFC/QR cards remain untracked.
  var host = location.hostname;
  var prod = host === 'sunnycoastac.com' || host === 'www.sunnycoastac.com';
  var local = ['localhost', '127.0.0.1', '[::1]'].indexOf(host) !== -1;
  var endpoint = prod ? 'https://quotes.sunnycoastac.com/api/review-choice' : '';
  if (local) {
    var override = new URLSearchParams(location.search).get('feedback_api') || '';
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(override)) endpoint = override + '/api/review-choice';
  }
  var status = document.getElementById('review-choice-status');
  var links = document.querySelectorAll('[data-review-choice]');
  var busy = false;
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (busy) return;
      if (!endpoint) { status.hidden = false; status.textContent = 'Preview only. Nothing was sent or saved.'; return; }
      busy = true;
      status.hidden = false; status.textContent = 'Opening…';
      links.forEach(function (x) { x.setAttribute('aria-disabled', 'true'); });
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, 10000);
      fetch(endpoint, { method: 'POST', credentials: 'omit', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: token, choice: link.dataset.reviewChoice }), signal: ctrl.signal })
        .then(function (res) {
          if (res.status === 404) return { expired: true };
          if (!res.ok) throw Error('not saved');
          return res.json();
        }).then(function (out) {
          if (out.expired) { location.assign(link.href); return; }
          if (!out.ok) throw Error('not saved');
          // Fixed destinations; never use an arbitrary returned URL.
          var next = link.dataset.reviewChoice === 'good' ? link.href : '/reviews/feedback/' + (local ? location.search : '') + '#r=' + token;
          location.assign(next);
        }).catch(function () {
          busy = false; links.forEach(function (x) { x.removeAttribute('aria-disabled'); });
          status.textContent = "We couldn't save your choice. Please try again, or call (786) 822-6861.";
        }).finally(function () { clearTimeout(timer); });
    });
  });
})();
