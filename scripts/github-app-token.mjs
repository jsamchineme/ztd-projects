// Prints a short-lived (1 hour) GitHub App installation token for ZTD-Devs/ztdoffice.
// Config: ~/.config/ztdoffice-gh/app.json {"appId": "5390642", "owner": "ZTD-Devs", "repo": "ztdoffice"}
// and ~/.config/ztdoffice-gh/app.pem (the App private key). Folder chmod 700, files 600.
// Used by git as a credential helper; the token is never written to disk.
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
const dir = (process.env.ZTD_GH_DIR || `${process.env.HOME}/.config/ztdoffice-gh`) + '/';
const cfg = JSON.parse(readFileSync(dir + 'app.json', 'utf8'));
const key = readFileSync(dir + 'app.pem', 'utf8');
const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iat: now - 60, exp: now + 540, iss: String(cfg.appId) })}`;
const jwt = `${unsigned}.${createSign('RSA-SHA256').update(unsigned).sign(key, 'base64url')}`;
const gh = async (path, method = 'GET', body) => {
  const r = await fetch('https://api.github.com' + path, { method, headers: { Authorization: `Bearer ${jwt}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }, body: body && JSON.stringify(body) });
  if (!r.ok) { console.error(`GitHub ${r.status} on ${path}: ${(await r.text()).slice(0, 200)}`); process.exit(1); }
  return r.json();
};
const inst = await gh(`/repos/${cfg.owner}/${cfg.repo}/installation`);
const tok = await gh(`/app/installations/${inst.id}/access_tokens`, 'POST', { repositories: [cfg.repo] });
process.stdout.write(tok.token);

// Setup on a new machine (Mac, new Studio):
//   1. GitHub → ZTD-Devs → Settings → GitHub Apps → ztd-devs-studio → Generate a private key.
//      Save it as ~/.config/ztdoffice-gh/app.pem (never paste it into chat or commit it).
//   2. Create ~/.config/ztdoffice-gh/app.json as above.
//   3. In the repo: git remote set-url origin https://github.com/ZTD-Devs/ztdoffice.git
//      git config credential.https://github.com.helper \
//        '!f() { test "$1" = get || exit 0; echo username=x-access-token; echo "password=$(node scripts/github-app-token.mjs)"; }; f'
//   4. Delete the App private key of any machine that no longer needs it (App settings → Private keys).
