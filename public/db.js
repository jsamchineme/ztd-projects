// Tiny IndexedDB layer shared by the page and the service worker. Everything lives on the phone.
(function (g) {
  const open = () => new Promise((resolve, reject) => {
    const req = indexedDB.open('didit', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore('tasks', { keyPath: 'id' });
      db.createObjectStore('done', { keyPath: 'key' });
      db.createObjectStore('meta', { keyPath: 'k' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  let dbp;
  const db = () => (dbp ||= open());
  const run = async (store, mode, fn) => {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(store, mode);
      const r = fn(tx.objectStore(store));
      tx.oncomplete = () => resolve(r && 'result' in r ? r.result : undefined);
      tx.onerror = () => reject(tx.error);
    });
  };
  g.DB = {
    all: store => run(store, 'readonly', s => s.getAll()),
    get: (store, key) => run(store, 'readonly', s => s.get(key)),
    put: (store, val) => run(store, 'readwrite', s => s.put(val)),
    del: (store, key) => run(store, 'readwrite', s => s.delete(key)),
    clear: store => run(store, 'readwrite', s => s.clear()),
    meta: async k => (await run('meta', 'readonly', s => s.get(k)))?.v,
    setMeta: (k, v) => run('meta', 'readwrite', s => s.put({ k, v })),
  };
})(self);
