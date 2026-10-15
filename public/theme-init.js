// Applies the saved light/night choice before the page paints, so there is no flash.
// Kept as a separate file (not inline in index.html) so the site can use a strict
// Content-Security-Policy without allowing inline scripts.
(function () {
  try {
    var saved = localStorage.getItem('soft-compass-theme')
    document.documentElement.dataset.theme = saved === 'dark' ? 'dark' : 'light'
  } catch {
    document.documentElement.dataset.theme = 'light'
  }
})()
