// The connection to Studio: a WebSocket to /api/phone/socket (lib/phone.mjs in the Studio source). It says hello with
// the phone's token and the last message id it has, so Studio can send what was missed, then gets new messages as they
// happen. It reconnects by itself, and pings every 25 seconds so a dead connection (lost signal) is noticed.
const PING_EVERY = 25000;
const PONG_WITHIN = 10000;
const RETRY = [1000, 2000, 5000, 10000, 20000, 30000];

export function socketUrl(studio){
  return studio.replace(/^http/, 'ws').replace(/\/+$/, '') + '/api/phone/socket';
}

// handlers: onStatus({ state: 'connecting' | 'connected' | 'offline', retryIn?, error? }), onReady(info),
// onMessage(message), onUnpaired(error). getLastId() returns the newest message id the app has (or null);
// getPushToken() where Studio should send pushes (or null), sent after each hello.
export function connect({ studio, token }, { getLastId, getPushToken, onStatus, onReady, onMessage, onUnpaired }){
  let ws = null, stopped = false, attempt = 0, retryTimer = null, pingTimer = null, pongTimer = null;

  const clearTimers = () => { clearTimeout(retryTimer); clearInterval(pingTimer); clearTimeout(pongTimer); };

  function open(){
    clearTimers();
    if (stopped) return;
    onStatus({ state: 'connecting' });
    const sock = ws = new WebSocket(socketUrl(studio));
    sock.onopen = () => {
      sock.send(JSON.stringify({ type: 'hello', token, after: getLastId() }));
      pingTimer = setInterval(() => {
        if (sock.readyState !== WebSocket.OPEN) return;
        sock.send(JSON.stringify({ type: 'ping' }));
        clearTimeout(pongTimer);
        pongTimer = setTimeout(() => sock.close(), PONG_WITHIN);   // no answer: start again
      }, PING_EVERY);
    };
    sock.onmessage = e => {
      clearTimeout(pongTimer);
      let m; try { m = JSON.parse(e.data); } catch { return; }
      if (m.type === 'ready'){
        attempt = 0; onStatus({ state: 'connected' }); onReady(m);
        const push = getPushToken();
        if (push) sock.send(JSON.stringify({ type: 'push-token', token: push }));
      }
      else if (m.type === 'message') onMessage(m);
      else if (m.type === 'unpaired'){ stopped = true; onUnpaired(m.error); }
    };
    sock.onerror = () => {};   // onclose follows
    sock.onclose = () => {
      clearTimers();
      if (ws !== sock || stopped) return;
      const wait = RETRY[Math.min(attempt++, RETRY.length - 1)];
      onStatus({ state: 'offline', retryIn: wait });
      retryTimer = setTimeout(open, wait);
    };
  }
  open();

  return {
    // Reconnect now, e.g. when the app comes back to the front, unless the connection is fine.
    wake(){ if (!stopped && (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING)) { attempt = 0; open(); } },
    // Send a push token got after connecting.
    pushToken(push){ if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'push-token', token: push })); },
    test(){ if (ws?.readyState === WebSocket.OPEN){ ws.send(JSON.stringify({ type: 'test' })); return true; } return false; },
    close(){ stopped = true; clearTimers(); ws?.close(); },
  };
}

// A pairing code from Studio's Account page: "<Studio address>#<token>".
export function parseCode(text){
  const m = /^\s*(https?:\/\/[^\s#]+)#([A-Za-z0-9_-]{20,})\s*$/.exec(String(text || ''));
  return m ? { studio: m[1].replace(/\/+$/, ''), token: m[2] } : null;
}
