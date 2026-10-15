// Notifications: things worth interrupting a person for (a card needs attention or review, a workflow ended, workers gave up).
// Each one goes to open boards as a desktop notification (they poll /api/notifications) and, if set up, by email.
// Email settings live in pipeline/notify.local.json (git-ignored), shared by every board:
//   { "email": { "to": "you@example.com", "user": "sender@gmail.com", "appPassword": "abcd efgh ijkl mnop" } }
// The app password comes from https://myaccount.google.com/apppasswords (needs 2-Step Verification on the Gmail account).
import tls from 'node:tls';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { hostname } from 'node:os';

const KEEP = 100;

export function createNotifier({ root, title, boardUrl }){
  const list = [];
  let next = 1, warned = false;

  function settings(){
    try {
      const e = JSON.parse(readFileSync(join(root, 'notify.local.json'), 'utf8')).email || {};
      if (e.to && e.user && e.appPassword) return e;
    } catch {}
    if (!warned){ warned = true; console.warn('Email notifications are off: add pipeline/notify.local.json (see notify.mjs)'); }
    return null;
  }

  // kind: attention | review | run | workers. card: optional { id, name }. lines: the email body.
  function notify({ kind, subject, body, card, lines = [] }){
    const n = { id: next++, at: new Date().toISOString(), kind, title: subject, body, card: card ? { id: card.id, name: card.name } : null, email: null };
    list.push(n);
    if (list.length > KEEP) list.shift();
    const mail = settings();
    if (mail){
      n.email = 'sending';
      const link = card ? `${boardUrl}/#card-${card.id}` : `${boardUrl}/#workflows`;
      const text = [body, ...lines, '', `Open the board: ${link}`, '', `— ${title}`].join('\n');
      sendMail(mail, `[${title}] ${subject}`, text)
        .then(() => { n.email = 'sent'; })
        .catch(e => { n.email = 'failed'; console.error(`Email "${subject}" failed: ${e.message}`); });
    }
    return n;
  }

  return {
    notify,
    since: after => list.filter(n => n.id > after),
    latest: () => list.length ? list[list.length - 1].id : 0,
    emailReady: () => !!settings(),
    test: () => notify({ kind: 'test', subject: 'Test notification', body: 'Notifications from this board are working.' })
  };
}

// A minimal SMTP client for Gmail (implicit TLS on 465, AUTH PLAIN), so the board needs no mail library.
function sendMail({ user, appPassword, to, host = 'smtp.gmail.com', port = 465 }, subject, text){
  return new Promise((resolve, reject) => {
    const sock = tls.connect({ host, port, servername: host });
    sock.setEncoding('utf8');
    sock.setTimeout(30000, () => sock.destroy(new Error('SMTP timed out')));
    const b64 = s => Buffer.from(s, 'utf8').toString('base64');
    const enc = s => { s = String(s).replace(/[\r\n]+/g, ' '); return /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`; };
    const message = [
      `From: ${enc('Pipeline')} <${user}>`, `To: <${to}>`, `Subject: ${enc(subject)}`, `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@${hostname() || 'pipeline'}>`,
      'MIME-Version: 1.0', 'Content-Type: text/plain; charset=utf-8', 'Content-Transfer-Encoding: base64', '',
      b64(text).replace(/.{1,76}/g, '$&\r\n')
    ].join('\r\n');
    // Each step: what to send once the server's reply has the expected code.
    const steps = [
      [220, 'EHLO pipeline'],
      [250, `AUTH PLAIN ${b64(`\0${user}\0${appPassword.replace(/\s+/g, '')}`)}`],
      [235, `MAIL FROM:<${user}>`],
      [250, `RCPT TO:<${to}>`],
      [250, 'DATA'],
      [354, `${message}\r\n.`],
      [250, 'QUIT']
    ];
    let buf = '', i = 0;
    sock.on('data', d => {
      buf += d;
      // A reply is complete when its last line is "NNN text" (not "NNN-text").
      const lines = buf.split('\r\n'); if (lines.at(-1) !== '') return;
      const last = lines.at(-2) || '';
      if (!/^\d{3} /.test(last)) return;
      buf = '';
      const code = Number(last.slice(0, 3));
      if (i >= steps.length){ sock.end(); return resolve(); }
      const [want, cmd] = steps[i++];
      if (code !== want){ sock.destroy(); return reject(new Error(`SMTP ${last}`)); }
      sock.write(cmd + '\r\n');
    });
    sock.on('error', reject);
    sock.on('close', () => { if (i < steps.length) reject(new Error('SMTP connection closed early')); else resolve(); });
  });
}
