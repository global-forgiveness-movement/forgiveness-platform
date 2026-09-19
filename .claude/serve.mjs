import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.pdf':'application/pdf',
  '.woff2':'font/woff2', '.woff':'font/woff', '.ico':'image/x-icon' };

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ''));
    try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); } catch {}
    const body = await readFile(f);
    res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) { res.writeHead(404, {'content-type':'text/plain'}); res.end('404 ' + req.url); }
}).listen(8765, () => console.log('serving', ROOT, 'on http://localhost:8765'));
