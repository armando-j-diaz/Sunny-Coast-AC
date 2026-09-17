// Run before analytics. Keep the opaque review code out of page URLs/referrers.
(function () {
  'use strict';
  var match = /^#r=([a-f0-9]{16})$/.exec(location.hash);
  var previous = history.state && history.state.scReviewToken;
  var token = match ? match[1] : (/^[a-f0-9]{16}$/.test(previous || '') ? previous : '');
  window.SC_REVIEW_TOKEN = token;
  if (match) {
    try { history.replaceState(Object.assign({}, history.state, { scReviewToken: token }), '', location.pathname + location.search); }
    catch (_) { /* The analytics page_location below also excludes the fragment. */ }
  }
})();
