// Collects every scraped page's markup + script manifest + original body
// class so routes can look them up by folder name instead of hand-writing
// an import per page. (CSS is preloaded globally via <link> tags in
// index.html, not per-page.)
const htmlModules = import.meta.glob('./*/body.html', { eager: true, query: '?raw', import: 'default' });
const scriptModules = import.meta.glob('./*/scripts.json', { eager: true, import: 'default' });
const bodyClassModules = import.meta.glob('./*/bodyClass.json', { eager: true, import: 'default' });

function nameFromPath(p) {
  return p.split('/')[1];
}

export const legacyPages = {};
for (const [p, html] of Object.entries(htmlModules)) {
  legacyPages[nameFromPath(p)] = { html };
}
for (const [p, scripts] of Object.entries(scriptModules)) {
  legacyPages[nameFromPath(p)].scripts = scripts;
}
for (const [p, bodyClass] of Object.entries(bodyClassModules)) {
  legacyPages[nameFromPath(p)].bodyClass = bodyClass;
}

export const getLegacyPage = (name) => legacyPages[name];
