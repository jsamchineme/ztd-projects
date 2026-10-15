// Serves Mapboard and bridges "Generate with Claude" to the local Claude Code CLI,
// so generation uses whatever account `claude` is logged in with.
// Usage: node server.mjs [port]   (env: CLAUDE_BIN, CLAUDE_MODEL)
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.argv[2] || process.env.PORT || 4380);
const HOST = '127.0.0.1';
const ROOT = dirname(fileURLToPath(import.meta.url));
const CLAUDE = process.env.CLAUDE_BIN || 'claude';
const MODEL = process.env.CLAUDE_MODEL || 'sonnet';
const TIMEOUT_MS = 180000;

const COLORS = ['graphite', 'butter', 'apricot', 'rose', 'lilac', 'sky', 'mint'];
const SCHEMA = {
  type: 'object',
  required: ['name', 'title', 'sections', 'links'],
  properties: {
    name: { type: 'string', description: 'Short board name, 2-5 words' },
    title: { type: 'string', description: 'Heading shown at the top of the board' },
    subtitle: { type: 'string', description: 'One sentence under the heading' },
    sections: {
      type: 'array', minItems: 1, maxItems: 9,
      items: {
        type: 'object', required: ['id', 'title', 'color', 'items'],
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          color: { enum: COLORS },
          items: {
            type: 'array', minItems: 1, maxItems: 8,
            items: {
              type: 'object', required: ['id', 'text'],
              properties: {
                id: { type: 'string' },
                text: { type: 'string', description: 'At most ~90 characters' },
                color: { enum: COLORS },
                shape: { enum: ['note', 'rect', 'ellipse', 'diamond'] }
              }
            }
          }
        }
      }
    },
    links: {
      type: 'array',
      items: {
        type: 'object', required: ['from', 'to'],
        properties: {
          from: { type: 'string', description: 'A section id or item id' },
          to: { type: 'string', description: 'A section id or item id' },
          label: { type: 'string' },
          dashed: { type: 'boolean' }
        }
      }
    }
  }
};

const SYSTEM = `You design boards for Mapboard, a whiteboard of sticky notes grouped into frames.
Turn the user's request into a clear, useful board: sections become frames (laid out left to right, three per row,
so order them in reading order), and each section's items become sticky notes inside it.
Write concrete, specific content, not placeholders. Keep each item short (under ~90 characters).
Colors: butter, apricot, rose, lilac, sky, mint, graphite. Use rose for risks or warnings, mint for outcomes,
butter for ideas or actions. Use shape "diamond" only for decisions and "ellipse" for start/end points.
Add links only where flow or dependency matters (usually between sections); ids must match a section or item id.`;

const EDIT_ITEM = {
  type: 'object', required: ['id', 'text'],
  properties: {
    id: { type: 'string', description: 'A new unique id, e.g. "n1"' },
    text: { type: 'string', description: 'At most ~90 characters' },
    color: { enum: COLORS },
    shape: { enum: ['note', 'rect', 'ellipse', 'diamond'] }
  }
};
const EDIT_SCHEMA = {
  type: 'object',
  required: ['summary', 'add_sections', 'add_items', 'update_items', 'delete_items', 'add_links', 'delete_links'],
  properties: {
    summary: { type: 'string', description: 'One short sentence telling the user what you changed' },
    rename_board: { type: 'string', description: 'Only if the user asked to rename the board' },
    add_sections: {
      type: 'array', maxItems: 6, description: 'New frames, each with its own notes. Placed automatically below the existing board.',
      items: {
        type: 'object', required: ['id', 'title', 'color', 'items'],
        properties: { id: { type: 'string' }, title: { type: 'string' }, color: { enum: COLORS }, items: { type: 'array', maxItems: 8, items: EDIT_ITEM } }
      }
    },
    add_items: {
      type: 'array', maxItems: 24, description: 'New notes inside an EXISTING section',
      items: { ...EDIT_ITEM, required: ['id', 'section', 'text'], properties: { ...EDIT_ITEM.properties, section: { type: 'string', description: 'Existing section id' } } }
    },
    update_items: {
      type: 'array', description: 'Change the text or color of existing items or sections (a section\'s text is its title)',
      items: { type: 'object', required: ['id'], properties: { id: { type: 'string' }, text: { type: 'string' }, color: { enum: COLORS } } }
    },
    delete_items: { type: 'array', items: { type: 'string' }, description: 'Existing item ids to remove. Removing a section also removes the notes inside it.' },
    add_links: {
      type: 'array', description: 'Connectors between existing ids or ids you created above',
      items: { type: 'object', required: ['from', 'to'], properties: { from: { type: 'string' }, to: { type: 'string' }, label: { type: 'string' }, dashed: { type: 'boolean' } } }
    },
    delete_links: { type: 'array', items: { type: 'string' }, description: 'Existing link ids to remove' }
  }
};

const EDIT_SYSTEM = `You edit boards in Mapboard, a whiteboard of sticky notes grouped into sections (frames).
You receive the current board as JSON and a request. Reply only with the changes needed to fulfil it; leave everything else alone.
- To add a new topic, use add_sections. To add notes to an existing section, use add_items with that section's id.
- To reword, recolour or retitle, use update_items. Never delete and re-add something just to change it.
- Only delete when the user asks for removal, replacement or consolidation.
- If "selected" ids are given, the user is most likely talking about those items ("this", "these", "here").
- Refer to existing things only by the ids in the board JSON. New items need new unique ids.
Write concrete, specific content, not placeholders. Keep each note under ~90 characters.
Colors: butter, apricot, rose, lilac, sky, mint, graphite. Use rose for risks or warnings, mint for outcomes, butter for ideas or actions.
Use shape "diamond" only for decisions and "ellipse" for start/end points. If the request can't be done, make no changes and explain in summary.`;

function runClaude(input, schema, system){
  return new Promise((resolve, reject) => {
    const args = ['-p', '--output-format', 'json', '--json-schema', JSON.stringify(schema), '--system-prompt', system,
      '--tools', '', '--strict-mcp-config', '--no-session-persistence', '--model', MODEL];
    let child;
    try { child = spawn(CLAUDE, args, { cwd: tmpdir(), stdio: ['pipe', 'pipe', 'pipe'] }); }
    catch (e){ return reject(new Error(`Couldn't start "${CLAUDE}": ${e.message}`)); }
    let out = '', err = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error('Claude took too long to answer.')); }, TIMEOUT_MS);
    child.stdout.on('data', d => out += d);
    child.stderr.on('data', d => err += d);
    child.on('error', e => { clearTimeout(timer); reject(new Error(e.code === 'ENOENT' ? `Claude Code CLI not found ("${CLAUDE}"). Install it and run "claude" once to log in.` : e.message)); });
    child.on('close', code => {
      clearTimeout(timer);
      let res = null;
      try { res = JSON.parse(out); } catch {}
      if (res && !res.is_error && res.structured_output) return resolve(res.structured_output);
      const msg = (res && res.result) || err.trim() || `claude exited with code ${code}`;
      reject(new Error(msg.slice(0, 400)));
    });
    child.stdin.end(input);
  });
}

const generate = prompt => runClaude(prompt, SCHEMA, SYSTEM);
const editBoard = (prompt, board, selected) => runClaude(
  `Current board:\n${JSON.stringify(board)}\n\n` + (selected.length ? `Selected ids: ${JSON.stringify(selected)}\n\n` : '') + `Request: ${prompt}`,
  EDIT_SCHEMA, EDIT_SYSTEM);

function send(res, status, body, type = 'application/json'){
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

// Only this page may call the API: blocks other websites (and DNS rebinding) from spending your Claude usage.
const allowedHosts = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`, `[::1]:${PORT}`]);
const sameOrigin = req => allowedHosts.has(req.headers.host) &&
  (!req.headers.origin || req.headers.origin === `http://${req.headers.host}`);

function readBody(req, limit = 20000){
  return new Promise((resolve, reject) => {
    let s = '';
    req.on('data', d => { s += d; if (s.length > limit){ reject(new Error('Prompt is too long.')); req.destroy(); } });
    req.on('end', () => resolve(s));
    req.on('error', reject);
  });
}

let busy = false;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}`);
  if (url.pathname.startsWith('/api/')){
    if (!sameOrigin(req)) return send(res, 403, { error: 'Forbidden' });
    if (url.pathname === '/api/health' && req.method === 'GET') return send(res, 200, { ok: true, model: MODEL });
    const isEdit = url.pathname === '/api/edit';
    if ((url.pathname === '/api/generate' || isEdit) && req.method === 'POST'){
      if (!(req.headers['content-type'] || '').startsWith('application/json')) return send(res, 415, { error: 'Expected JSON' });
      if (busy) return send(res, 429, { error: 'Claude is already working on a request. Try again in a moment.' });
      busy = true;
      try {
        const { prompt, board, selected } = JSON.parse(await readBody(req, isEdit ? 400000 : 20000) || '{}');
        if (typeof prompt !== 'string' || !prompt.trim()) return send(res, 400, { error: isEdit ? 'Say what you want to change.' : 'Describe the board you want.' });
        if (isEdit){
          if (!board || typeof board !== 'object') return send(res, 400, { error: 'Missing board.' });
          console.log(`Editing "${String(board.name || '').slice(0, 40)}": ${prompt.trim().slice(0, 80)}`);
          send(res, 200, { changes: await editBoard(prompt.trim(), board, Array.isArray(selected) ? selected.slice(0, 200) : []) });
        } else {
          console.log(`Generating: ${prompt.trim().slice(0, 80)}`);
          send(res, 200, { board: await generate(prompt.trim()) });
        }
      } catch (e){ console.error(e.message); send(res, 502, { error: e.message }); }
      finally { busy = false; }
      return;
    }
    return send(res, 404, { error: 'Not found' });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', 'text/plain');
  if (url.pathname !== '/' && url.pathname !== '/index.html') return send(res, 404, 'Not found', 'text/plain');
  try { send(res, 200, await readFile(join(ROOT, 'index.html')), 'text/html; charset=utf-8'); }
  catch { send(res, 500, 'index.html is missing', 'text/plain'); }
});

server.on('error', e => {
  console.error(e.code === 'EADDRINUSE' ? `Port ${PORT} is already in use. Stop the other server or run: make start PORT=7001` : e.message);
  process.exit(1);
});
server.listen(PORT, HOST, () => {
  // Browsers try ::1 first for "localhost". Claim it too, or another app holding the port on IPv6 (like macOS AirPlay on 5000/7000) answers instead.
  const v6 = http.createServer(server.listeners('request')[0]);
  v6.on('error', () => {}).listen(PORT, '::1');
  console.log(`Mapboard is running at http://localhost:${PORT}  (press Ctrl+C to stop)`);
  console.log(`Generate with Claude uses the local "${CLAUDE}" CLI (model: ${MODEL}).`);
});
