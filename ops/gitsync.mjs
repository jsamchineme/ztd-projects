// Moving a project's files between Studio and a computer that runs chats for it (runner/studio-runner.mjs), with git.
// Used by studio-ctl on the server (as the project's user), by the runner on the computer, and by test/mock-ctl.mjs.
//
// A snapshot is a commit of the working tree as it is, uncommitted changes and untracked files included (not ignored
// ones), whose parent is HEAD. It's made with a separate index, so the project's own index and files aren't touched.
// Studio sends the computer a snapshot (as a git bundle, leaving out what the computer already has); the computer
// makes its folder match it, Claude works there, and at the end the computer sends back a snapshot of its folder.
// Studio adds the difference between the two snapshots to the project, and any commits Claude made.
//
// Every function takes git(args, { input, env }) -> { status, stdout (Buffer), stderr }, run in the project folder.
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

const ID = { GIT_AUTHOR_NAME: 'Studio', GIT_AUTHOR_EMAIL: 'studio@localhost', GIT_COMMITTER_NAME: 'Studio', GIT_COMMITTER_EMAIL: 'studio@localhost' };
export const SHA = /^[0-9a-f]{40}$/;
const run = (git, args, opts) => {
  const r = git(args, opts);
  if (r.status !== 0) throw new Error(`git ${args[0]}: ${String(r.stderr || '').trim().split('\n').pop() || 'failed'}`);
  return String(r.stdout).trim();
};
const ok = (git, args, opts) => git(args, opts).status === 0;
const has = (git, sha) => SHA.test(sha || '') && ok(git, ['cat-file', '-e', `${sha}^{commit}`]);
const tmpName = () => randomBytes(6).toString('hex');

// { branch ('' when detached), head, snap }. A project with no commits yet can't be snapshotted.
export function snapshot(git){
  if (!ok(git, ['rev-parse', '-q', '--verify', 'HEAD^{commit}'])) throw new Error('The project has no commits yet. Commit once in Studio first.');
  const head = run(git, ['rev-parse', 'HEAD']);
  const b = git(['symbolic-ref', '--short', '-q', 'HEAD']);
  const branch = b.status === 0 ? String(b.stdout).trim() : '';
  const index = join(run(git, ['rev-parse', '--absolute-git-dir']), `studio-snapshot-${tmpName()}.index`);
  try {
    const env = { GIT_INDEX_FILE: index };
    run(git, ['read-tree', head], { env });
    run(git, ['add', '-A'], { env });
    const tree = run(git, ['write-tree'], { env });
    const snap = run(git, ['commit-tree', tree, '-p', head, '-m', 'Studio snapshot'], { env: ID });
    return { branch, head, snap };
  } finally { rmSync(index, { force: true }); }
}

// A bundle with what's needed for `snap`, leaving out the commits in `have` (and their history) that this repo knows.
// null when there's nothing to send.
export function bundle(git, snap, have = []){
  const known = have.filter(h => has(git, h));
  if (known.includes(snap)) return null;
  const ref = `refs/studio/out-${tmpName()}`;
  run(git, ['update-ref', ref, snap]);
  try {
    const r = git(['bundle', 'create', '-q', '-', ref, ...known.map(h => '^' + h)]);
    if (r.status !== 0){
      if (/empty bundle/i.test(r.stderr)) return null;
      throw new Error(`git bundle: ${String(r.stderr).trim().split('\n').pop()}`);
    }
    return Buffer.from(r.stdout);
  } finally { git(['update-ref', '-d', ref]); }
}

// Adds a bundle's objects to this repo without writing it to a file: the header names what it needs, the rest is a pack.
// Throws if `want` isn't complete afterwards (the repo lacks something the bundle left out).
export function unbundle(git, buf, want){
  const end = buf.indexOf('\n\n');
  if (end < 0 || !/^# v[23] git bundle\n/.test(buf.subarray(0, 20).toString())) throw new Error('Not a git bundle');
  const needs = buf.subarray(0, end).toString().split('\n').filter(l => l.startsWith('-')).map(l => l.slice(1, 41));
  const missing = needs.filter(h => !has(git, h));
  if (missing.length) throw Object.assign(new Error('This copy lacks commits the bundle builds on'), { code: 'missing' });
  run(git, ['index-pack', '--stdin', '--fix-thin'], { input: buf.subarray(end + 2) });
  if (!has(git, want) || !ok(git, ['rev-list', '--quiet', '--objects', want, ...needs.map(h => '^' + h)])) throw new Error('The bundle was incomplete');
}

// Makes the working tree match a snapshot: HEAD (and the branch) at its parent, and its other changes uncommitted.
// Local changes and untracked files go; ignored files (node_modules, .env) stay.
export function restore(git, { branch, head, snap }){
  if (!has(git, snap) || !has(git, head)) throw new Error('The snapshot is missing');
  run(git, branch ? ['checkout', '-q', '-f', '-B', branch, head] : ['checkout', '-q', '-f', '--detach', head]);
  run(git, ['clean', '-fdq']);
  run(git, ['read-tree', '-u', '--reset', snap]);
  run(git, ['reset', '-q']);
  run(git, ['update-ref', 'refs/studio/base', snap]);
}

// The commits a computer has from earlier turns, so Studio can leave them out of the next bundle.
export function known(git){
  return ['HEAD', 'refs/studio/base'].map(r => git(['rev-parse', '-q', '--verify', `${r}^{commit}`])).filter(r => r.status === 0).map(r => String(r.stdout).trim());
}

// Adds what changed between two snapshots (base: what Studio sent; after: the computer's folder after the turn) to
// this working tree, which may have changed meanwhile: a three-way merge of base, the tree as it is now and after,
// with conflict markers where both changed the same lines. Commits Claude made (headAfter) become the project's if
// its HEAD is still where it was (head); otherwise they come in as uncommitted changes. Needs git 2.40 or newer.
// Returns { changed, conflicts: [paths], commits: 'none'|'added'|'as-changes', unapplied: ref|null }.
export function applyBack(git, { base, head, after, headAfter }){
  for (const sha of [base, head, after, headAfter]) if (!has(git, sha)) throw new Error('The changes are incomplete');
  const out = { changed: !ok(git, ['diff', '--quiet', base, after]), conflicts: [], commits: 'none', unapplied: null };
  if (out.changed){
    const nowSnap = snapshot(git).snap;
    let target = after;
    if (ok(git, ['diff', '--quiet', base, nowSnap])) target = `${after}^{tree}`;
    else {
      const r = git(['merge-tree', '--write-tree', '--name-only', '--no-messages', `--merge-base=${base}`, nowSnap, after]);
      const lines = String(r.stdout).split('\n').filter(Boolean);
      if (r.status > 1 || !SHA.test(lines[0] || '')) throw new Error(`git merge-tree: ${String(r.stderr).trim().split('\n').pop() || 'failed'}`);
      target = lines[0];
      out.conflicts = [...new Set(lines.slice(1))];
    }
    const patch = git(['diff', '--binary', '--full-index', nowSnap, target]).stdout;
    if (patch.length && !ok(git, ['apply', '--binary', '--whitespace=nowarn', '-'], { input: patch })){
      // The folder changed while this ran. Keep the computer's work in git, where nothing cleans it up.
      out.unapplied = `refs/studio/unapplied/${after.slice(0, 12)}`;
      run(git, ['update-ref', out.unapplied, after]);
      out.conflicts = [];
      return out;
    }
  }
  if (headAfter !== head){
    const now = run(git, ['rev-parse', 'HEAD']);
    if (now === head && ok(git, ['merge-base', '--is-ancestor', head, headAfter])){ run(git, ['reset', '-q', headAfter]); out.commits = 'added'; }
    else out.commits = 'as-changes';
  }
  return out;
}

// Where Claude Code keeps a session's transcript: <config dir>/projects/<folder, with every other character a dash>/.
export const sessionDir = (claudeDir, cwd) => join(claudeDir, 'projects', cwd.replace(/[^a-zA-Z0-9]/g, '-'));
export const SESSION = /^[0-9a-f-]{36}$/;
