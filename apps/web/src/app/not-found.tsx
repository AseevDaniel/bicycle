/**
 * Root 404 page — exported as 404.html for static hosting.
 *
 * When a route is missing its locale prefix (e.g. /bicycle/listings instead
 * of /bicycle/en/listings), the host serves this file. The inline script runs
 * synchronously and redirects to /bicycle/en + path before anything renders.
 *
 * Works for all current and future routes — no per-route fix needed.
 */
export default function GlobalNotFound() {
  const locales = ['en', 'es', 'de', 'fr', 'ru', 'uk']
  const basePath = '/bicycle'

  const script = `
;(function () {
  var LOCALES = ${JSON.stringify(locales)};
  var BASE = '${basePath}';
  var path = location.pathname.startsWith(BASE)
    ? location.pathname.slice(BASE.length)
    : location.pathname;
  var first = path.split('/').filter(Boolean)[0] || '';
  if (LOCALES.indexOf(first) === -1) {
    location.replace(BASE + '/en' + (path || '/'));
  }
})();
`.trim()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Redirecting…</title>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </head>
      <body />
    </html>
  )
}
