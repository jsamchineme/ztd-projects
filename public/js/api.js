// Fetch wrapper. All mutating calls carry X-Requested-With: fetch (CSRF). Throws {status,message} on !ok.
async function request(method, path, body) {
  const opts = { method, headers: { 'X-Requested-With': 'fetch' }, credentials: 'same-origin' };
  if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const res = await fetch(path, opts);
  let data = null;
  const text = await res.text();
  if (text) { try { data = JSON.parse(text); } catch { data = text; } }
  if (!res.ok) throw { status: res.status, message: (data && data.error) || `HTTP ${res.status}`, data };
  return data;
}

export const api = {
  get: (p) => request('GET', p),
  post: (p, b) => request('POST', p, b ?? {}),
  patch: (p, b) => request('PATCH', p, b ?? {}),
  del: (p, b) => request('DELETE', p, b ?? {}),
};
export default api;
