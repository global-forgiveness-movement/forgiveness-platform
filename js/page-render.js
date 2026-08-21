/* Renders an editor-created page at its own URL. Loaded by 404.html, which
   GitHub Pages serves for any address that has no committed file — so a page
   Kate builds in /admin exists at yoursite/<slug>/ with no deploy at all. */

export async function renderCustomPage(slug, root) {
  const { getPage } = await import('./content.js');
  const page = await getPage(slug);
  if (!page) return false;

  document.title = `${page.title} — Global Forgiveness Movement`;
  document.querySelectorAll('body > *').forEach((n) => n.remove());
  document.querySelectorAll('style').forEach((n) => n.remove());

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = root + 'css/site.css';
  document.head.append(css);

  const { renderBlocks } = await import('./blocks.js');
  const main = document.createElement('main');
  main.innerHTML = renderBlocks(page.blocks, root);
  document.body.append(main);

  await import('./site.js'); // gate + shared header/nav/footer
  return true;
}
