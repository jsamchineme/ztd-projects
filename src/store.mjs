// Mail data access: threads, messages, labels, drafts, attachments, search.
// All synchronous (node:sqlite). Threading + labels + FTS handled here.
import { db } from './db.mjs';
import { id, now, json, snippet, htmlToText, addrListToText } from './util.mjs';

const q = (sql) => db.prepare(sql);
const SYSTEM_LABELS = [
  ['inbox', 'Inbox', null], ['sent', 'Sent', null], ['drafts', 'Drafts', null],
  ['trash', 'Trash', null], ['spam', 'Spam', null], ['archive', 'Archive', null],
];

function tx(fn) {
  db.exec('BEGIN');
  try { const r = fn(); db.exec('COMMIT'); return r; }
  catch (e) { db.exec('ROLLBACK'); throw e; }
}

export function ensureSystemLabels(userId) {
  for (const [system, name] of SYSTEM_LABELS) {
    const ex = q('SELECT id FROM labels WHERE user_id=? AND system=?').get(userId, system);
    if (!ex) q('INSERT INTO labels (id,user_id,name,color,system,created_at) VALUES (?,?,?,?,?,?)')
      .run(id(), userId, name, null, system, now());
  }
}
function labelId(userId, systemOrId) {
  const row = q('SELECT id FROM labels WHERE user_id=? AND (system=? OR id=?)').get(userId, systemOrId, systemOrId);
  return row?.id || null;
}
function addLabel(threadId, lid) {
  if (!lid) return;
  q('INSERT OR IGNORE INTO thread_labels (thread_id,label_id) VALUES (?,?)').run(threadId, lid);
}
function removeLabel(threadId, lid) {
  if (!lid) return;
  q('DELETE FROM thread_labels WHERE thread_id=? AND label_id=?').run(threadId, lid);
}
function threadLabels(threadId) {
  return q(`SELECT l.id,l.name,l.color,l.system FROM thread_labels tl
            JOIN labels l ON l.id=tl.label_id WHERE tl.thread_id=?`).all(threadId);
}

// ---------------- labels ----------------
export function listLabels(userId) {
  return q('SELECT id,name,color,system FROM labels WHERE user_id=? ORDER BY (system IS NULL), name').all(userId);
}
export function createLabel(userId, { name, color = '#64748b' }) {
  const lid = id();
  q('INSERT INTO labels (id,user_id,name,color,system,created_at) VALUES (?,?,?,?,NULL,?)')
    .run(lid, userId, name, color, now());
  return lid;
}
export function deleteLabel(userId, lid) {
  const l = q('SELECT system FROM labels WHERE id=? AND user_id=?').get(lid, userId);
  if (!l || l.system) throw { status: 400, message: 'Cannot delete that label' };
  q('DELETE FROM thread_labels WHERE label_id=?').run(lid);
  q('DELETE FROM labels WHERE id=?').run(lid);
}

// ---------------- insert messages ----------------
function newThread(userId, subject, ts) {
  const tid = id();
  q('INSERT INTO threads (id,user_id,subject,snippet,last_at,unread,starred,created_at) VALUES (?,?,?,?,?,0,0,?)')
    .run(tid, userId, subject || '(no subject)', '', ts, ts);
  return tid;
}
function findThreadByRefs(userId, inReplyTo, references) {
  const ids = [inReplyTo, ...(references || [])].filter(Boolean);
  for (const mid of ids) {
    const r = q('SELECT thread_id FROM messages WHERE user_id=? AND message_id=? LIMIT 1').get(userId, mid);
    if (r) return r.thread_id;
  }
  return null;
}
function ftsInsert(m) {
  q('INSERT INTO messages_fts (message_id,thread_id,user_id,subject,from_text,to_text,body) VALUES (?,?,?,?,?,?,?)')
    .run(m.id, m.thread_id, m.user_id, m.subject || '', `${m.from_name || ''} ${m.from_addr || ''}`,
      m.to_text || '', m.body_text || '');
}
function insertAttachments(messageId, atts = []) {
  for (const a of atts) {
    q(`INSERT INTO attachments (id,message_id,filename,content_type,size,content_id,disposition,resend_attachment_id,storage_path,created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`)
      .run(id(), messageId, a.filename || null, a.content_type || null, a.size || null,
        a.content_id || null, a.disposition || a.content_disposition || null,
        a.id || a.resend_attachment_id || null, a.storage_path || null, now());
  }
}

// parsed: {resendId, messageId, inReplyTo, references[], from:{name,addr}, to[], cc[], bcc[],
//          subject, html, text, headers, receivedFor[], attachments[], date}
export function insertIncomingMessage(userId, p) {
  return tx(() => {
    ensureSystemLabels(userId);
    const ts = p.date || now();
    let threadId = findThreadByRefs(userId, p.inReplyTo, p.references);
    const isNew = !threadId;
    if (!threadId) threadId = newThread(userId, p.subject, ts);
    const body = p.text || htmlToText(p.html || '');
    const mid = id();
    const toText = addrListToText(p.to);
    q(`INSERT INTO messages (id,user_id,thread_id,resend_id,direction,message_id,in_reply_to,references_ids,
         from_name,from_addr,to_json,cc_json,bcc_json,subject,text_body,html_body,snippet,headers_json,
         has_attachments,unread,created_at,sort_at)
       VALUES (?,?,?,?,'in',?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?)`)
      .run(mid, userId, threadId, p.resendId || null, p.messageId || null, p.inReplyTo || null,
        (p.references || []).join(' '), p.from?.name || '', p.from?.addr || '',
        json.stringify(p.to || []), json.stringify(p.cc || []), json.stringify(p.bcc || []),
        p.subject || '', p.text || '', p.html || '', snippet(body), json.stringify(p.headers || {}),
        (p.attachments?.length ? 1 : 0), ts, ts);
    insertAttachments(mid, p.attachments);
    ftsInsert({ id: mid, thread_id: threadId, user_id: userId, subject: p.subject, from_name: p.from?.name, from_addr: p.from?.addr, to_text: toText, body_text: body });
    q('UPDATE threads SET last_at=?, snippet=?, unread=1, subject=COALESCE(NULLIF(subject,\'\'),?) WHERE id=?')
      .run(ts, snippet(body), p.subject || '(no subject)', threadId);
    addLabel(threadId, labelId(userId, 'inbox'));
    return { messageId: mid, threadId, isNewThread: isNew };
  });
}

// msg: {threadId?, inReplyTo?, from:{name,addr}, to[], cc[], bcc[], subject, html, text, messageId?, resendId?, attachments?}
export function insertOutgoingMessage(userId, m) {
  return tx(() => {
    ensureSystemLabels(userId);
    const ts = now();
    let threadId = m.threadId || findThreadByRefs(userId, m.inReplyTo, m.references);
    if (!threadId) threadId = newThread(userId, m.subject, ts);
    const body = m.text || htmlToText(m.html || '');
    const mid = id();
    const toText = addrListToText(m.to);
    q(`INSERT INTO messages (id,user_id,thread_id,resend_id,direction,message_id,in_reply_to,references_ids,
         from_name,from_addr,to_json,cc_json,bcc_json,subject,text_body,html_body,snippet,headers_json,
         has_attachments,unread,created_at,sort_at)
       VALUES (?,?,?,?,'out',?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,?,?)`)
      .run(mid, userId, threadId, m.resendId || null, m.messageId || null, m.inReplyTo || null,
        (m.references || []).join(' '), m.from?.name || '', m.from?.addr || '',
        json.stringify(m.to || []), json.stringify(m.cc || []), json.stringify(m.bcc || []),
        m.subject || '', m.text || '', m.html || '', snippet(body), json.stringify(m.headers || {}),
        (m.attachments?.length ? 1 : 0), ts, ts);
    insertAttachments(mid, m.attachments);
    ftsInsert({ id: mid, thread_id: threadId, user_id: userId, subject: m.subject, from_name: m.from?.name, from_addr: m.from?.addr, to_text: toText, body_text: body });
    q('UPDATE threads SET last_at=?, snippet=?, subject=COALESCE(NULLIF(subject,\'\'),?) WHERE id=?')
      .run(ts, snippet(body), m.subject || '(no subject)', threadId);
    addLabel(threadId, labelId(userId, 'sent'));
    return { messageId: mid, threadId };
  });
}

// ---------------- thread queries ----------------
function summarize(row) {
  const last = q(`SELECT from_name,from_addr,has_attachments FROM messages WHERE thread_id=? ORDER BY sort_at DESC LIMIT 1`).get(row.id) || {};
  const anyAtt = q('SELECT COUNT(*) c FROM messages WHERE thread_id=? AND has_attachments=1').get(row.id).c > 0;
  const count = q('SELECT COUNT(*) c FROM messages WHERE thread_id=?').get(row.id).c;
  return {
    id: row.id, subject: row.subject, snippet: row.snippet, last_at: row.last_at,
    unread: !!row.unread, starred: !!row.starred, count,
    from: last.from_name || last.from_addr || '',
    from_addr: last.from_addr || '',
    has_attachments: anyAtt,
    labels: threadLabels(row.id),
  };
}

export function listThreads(userId, { label = 'inbox', q: text, starred, unread, limit = 50, offset = 0 } = {}) {
  if (text) return search(userId, text, { limit });
  const lid = labelId(userId, label);
  const where = ['t.user_id = ?'];
  const args = [userId];
  if (lid) { where.push('tl.label_id = ?'); args.push(lid); }
  if (starred) where.push('t.starred = 1');
  if (unread) where.push('t.unread = 1');
  const sql = `SELECT DISTINCT t.* FROM threads t
     ${lid ? 'JOIN thread_labels tl ON tl.thread_id = t.id' : ''}
     WHERE ${where.join(' AND ')}
     ORDER BY t.last_at DESC LIMIT ? OFFSET ?`;
  args.push(limit, offset);
  return q(sql).all(...args).map(summarize);
}

export function getThread(userId, threadId) {
  const t = q('SELECT * FROM threads WHERE id=? AND user_id=?').get(threadId, userId);
  if (!t) return null;
  const msgs = q('SELECT * FROM messages WHERE thread_id=? ORDER BY sort_at ASC').all(threadId);
  const messages = msgs.map(m => ({
    id: m.id, direction: m.direction, from: { name: m.from_name, addr: m.from_addr },
    to: json.parse(m.to_json, []), cc: json.parse(m.cc_json, []), bcc: json.parse(m.bcc_json, []),
    subject: m.subject, text: m.text_body, html: m.html_body, snippet: m.snippet,
    unread: !!m.unread, created_at: m.created_at, message_id: m.message_id,
    has_attachments: !!m.has_attachments,
    attachments: q('SELECT id,filename,content_type,size,content_id,disposition FROM attachments WHERE message_id=?').all(m.id),
  }));
  return { thread: { ...t, starred: !!t.starred, unread: !!t.unread, labels: threadLabels(t.id) }, messages };
}

// ---------------- thread actions ----------------
export function setThreadLabels(userId, threadId, { add = [], remove = [] } = {}) {
  const t = q('SELECT id FROM threads WHERE id=? AND user_id=?').get(threadId, userId);
  if (!t) throw { status: 404, message: 'Thread not found' };
  for (const name of add) addLabel(threadId, labelId(userId, name));
  for (const name of remove) removeLabel(threadId, labelId(userId, name));
}
export function starThread(userId, threadId, starred) {
  q('UPDATE threads SET starred=? WHERE id=? AND user_id=?').run(starred ? 1 : 0, threadId, userId);
}
export function markThreadRead(userId, threadId, read) {
  const t = q('SELECT id FROM threads WHERE id=? AND user_id=?').get(threadId, userId);
  if (!t) return;
  q('UPDATE messages SET unread=? WHERE thread_id=?').run(read ? 0 : 1, threadId);
  q('UPDATE threads SET unread=? WHERE id=?').run(read ? 0 : 1, threadId);
}
export function trashThread(userId, threadId) {
  setThreadLabels(userId, threadId, { add: ['trash'], remove: ['inbox', 'spam', 'archive'] });
}
export function archiveThread(userId, threadId) {
  setThreadLabels(userId, threadId, { add: ['archive'], remove: ['inbox'] });
}
export function spamThread(userId, threadId) {
  setThreadLabels(userId, threadId, { add: ['spam'], remove: ['inbox'] });
}

// ---------------- search ----------------
export function search(userId, query, { limit = 50 } = {}) {
  const ops = { from: null, to: null, subject: null, hasAttachment: false };
  const terms = [];
  for (const tok of String(query).split(/\s+/).filter(Boolean)) {
    const m = tok.match(/^(from|to|subject|has):(.+)$/i);
    if (m) {
      const key = m[1].toLowerCase(), val = m[2];
      if (key === 'from') ops.from = val.toLowerCase();
      else if (key === 'to') ops.to = val.toLowerCase();
      else if (key === 'subject') ops.subject = val;
      else if (key === 'has' && /attach/i.test(val)) ops.hasAttachment = true;
    } else terms.push(tok);
  }
  // FTS match string (quote terms to avoid syntax errors)
  const ftsExpr = [
    ...terms.map(t => `"${t.replace(/"/g, '')}"`),
    ops.from ? `from_text:"${ops.from.replace(/"/g, '')}"` : '',
    ops.to ? `to_text:"${ops.to.replace(/"/g, '')}"` : '',
    ops.subject ? `subject:"${ops.subject.replace(/"/g, '')}"` : '',
  ].filter(Boolean).join(' AND ');

  let threadIds;
  if (ftsExpr) {
    const rows = q(`SELECT DISTINCT thread_id FROM messages_fts WHERE user_id=? AND messages_fts MATCH ? LIMIT ?`)
      .all(userId, ftsExpr, limit * 4);
    threadIds = rows.map(r => r.thread_id);
  } else {
    threadIds = q('SELECT id FROM threads WHERE user_id=? ORDER BY last_at DESC LIMIT ?').all(userId, limit * 4).map(r => r.id);
  }
  if (ops.hasAttachment) {
    threadIds = threadIds.filter(tid => q('SELECT COUNT(*) c FROM messages WHERE thread_id=? AND has_attachments=1').get(tid).c > 0);
  }
  const seen = new Set();
  const out = [];
  for (const tid of threadIds) {
    if (seen.has(tid)) continue; seen.add(tid);
    const t = q('SELECT * FROM threads WHERE id=? AND user_id=?').get(tid, userId);
    if (t) out.push(summarize(t));
    if (out.length >= limit) break;
  }
  out.sort((a, b) => (a.last_at < b.last_at ? 1 : -1));
  return out;
}

// ---------------- drafts ----------------
export function listDrafts(userId) {
  return q('SELECT * FROM drafts WHERE user_id=? ORDER BY updated_at DESC').all(userId).map(d => ({
    id: d.id, threadId: d.thread_id, to: json.parse(d.to_json, []), cc: json.parse(d.cc_json, []),
    bcc: json.parse(d.bcc_json, []), subject: d.subject, text: d.text_body, html: d.html_body,
    inReplyTo: d.in_reply_to, updated_at: d.updated_at,
  }));
}
export function getDraft(userId, draftId) {
  const d = q('SELECT * FROM drafts WHERE id=? AND user_id=?').get(draftId, userId);
  if (!d) return null;
  return { id: d.id, threadId: d.thread_id, to: json.parse(d.to_json, []), cc: json.parse(d.cc_json, []),
    bcc: json.parse(d.bcc_json, []), subject: d.subject, text: d.text_body, html: d.html_body, inReplyTo: d.in_reply_to };
}
export function saveDraft(userId, d) {
  const ts = now();
  if (d.id && q('SELECT id FROM drafts WHERE id=? AND user_id=?').get(d.id, userId)) {
    q(`UPDATE drafts SET thread_id=?,to_json=?,cc_json=?,bcc_json=?,subject=?,text_body=?,html_body=?,in_reply_to=?,updated_at=?
       WHERE id=? AND user_id=?`)
      .run(d.threadId || null, json.stringify(d.to || []), json.stringify(d.cc || []), json.stringify(d.bcc || []),
        d.subject || '', d.text || '', d.html || '', d.inReplyTo || null, ts, d.id, userId);
    return d.id;
  }
  const did = id();
  q(`INSERT INTO drafts (id,user_id,thread_id,to_json,cc_json,bcc_json,subject,text_body,html_body,in_reply_to,updated_at,created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(did, userId, d.threadId || null, json.stringify(d.to || []), json.stringify(d.cc || []),
      json.stringify(d.bcc || []), d.subject || '', d.text || '', d.html || '', d.inReplyTo || null, ts, ts);
  return did;
}
export function deleteDraft(userId, draftId) {
  q('DELETE FROM drafts WHERE id=? AND user_id=?').run(draftId, userId);
}

// ---------------- attachments ----------------
export function getAttachment(userId, attId) {
  return q(`SELECT a.* FROM attachments a JOIN messages m ON m.id=a.message_id
            WHERE a.id=? AND m.user_id=?`).get(attId, userId) || null;
}

// ---------------- counts ----------------
export function countsByLabel(userId) {
  const out = {};
  const labels = q('SELECT id,name,color,system FROM labels WHERE user_id=?').all(userId);
  for (const l of labels) {
    const total = q('SELECT COUNT(*) c FROM thread_labels WHERE label_id=?').get(l.id).c;
    const unread = q(`SELECT COUNT(*) c FROM thread_labels tl JOIN threads t ON t.id=tl.thread_id
                      WHERE tl.label_id=? AND t.unread=1`).get(l.id).c;
    out[l.system || l.id] = { total, unread, id: l.id, name: l.name, color: l.color, system: l.system };
  }
  return out;
}

export const store = {
  ensureSystemLabels, listThreads, getThread, insertIncomingMessage, insertOutgoingMessage,
  setThreadLabels, starThread, markThreadRead, trashThread, archiveThread, spamThread,
  listLabels, createLabel, deleteLabel, search, listDrafts, getDraft, saveDraft, deleteDraft,
  getAttachment, countsByLabel,
};
