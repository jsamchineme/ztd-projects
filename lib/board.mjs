// A project's task board: BOARD.md in its repo, so Claude edits it in chats like any other file and it travels with
// the code. `## ` headings are columns, `### ` headings group tasks within a column, `- ` lines are tasks, and lines
// indented under a task are its notes. Other lines are kept: before the first column as the preamble, in a column
// before its first group or task as its intro, and in a group as its text (owners, dependencies and the like).
export const BOARD_FILE = 'BOARD.md';
export const DEFAULT_COLUMNS = ['To do', 'In progress', 'Done'];
const MAX_COLUMNS = 12, MAX_TASKS = 500, MAX_GROUPS = 100, MAX_TEXT = 500, MAX_NOTES = 4000, MAX_BYTES = 200000;

// -> { preamble, columns: [{ name, intro, groups: [{ title, text, tasks: [{ text, notes }] }] }] }
// A column's tasks outside any `### ` group are in its first group, whose title is ''.
export function parseBoard(md){
  const preamble = [], columns = [];
  let col = null, group = null, task = null, blanks = 0;
  for (const raw of String(md || '').replace(/\r/g, '').split('\n')){
    const line = raw.replace(/\s+$/, '');
    let m;
    if ((m = /^##\s+(.*)$/.exec(line))){ col = { name: m[1].trim(), intro: [], groups: [] }; columns.push(col); group = task = null; continue; }
    if (!col){ preamble.push(line); continue; }
    if ((m = /^#{3,6}\s+(.*)$/.exec(line))){ group = { title: m[1].trim(), text: [], tasks: [] }; col.groups.push(group); task = null; continue; }
    if ((m = /^[-*+]\s+(?:\[[ xX]\]\s+)?(.*)$/.exec(line))){
      if (!group){ group = { title: '', text: [], tasks: [] }; col.groups.push(group); }
      task = { text: m[1].trim(), notes: [] }; group.tasks.push(task); blanks = 0;
      continue;
    }
    if (!line){ if (task) blanks++; else (group ? group.text : col.intro).push(''); continue; }
    if (task && /^\s/.test(line)){
      if (task.notes.length) for (; blanks; blanks--) task.notes.push('');
      blanks = 0;
      task.notes.push(line.replace(/^( {1,4}|\t)/, ''));
      continue;
    }
    task = null; (group ? group.text : col.intro).push(line);
  }
  const text = lines => lines.join('\n').trim();
  return tidy({
    preamble: text(preamble),
    columns: columns.length ? columns.map(c => ({ name: c.name, intro: text(c.intro),
      groups: c.groups.map(g => ({ title: g.title, text: text(g.text), tasks: g.tasks.map(t => ({ text: t.text, notes: text(t.notes) })) })) }))
      : DEFAULT_COLUMNS.map(name => ({ name, intro: '', groups: [] }))
  });
}

// Every column starts with its untitled group (empty if it has no loose tasks), and groups with nothing in them go.
function tidy(board){
  for (const c of board.columns){
    const loose = c.groups.filter(g => !g.title);
    c.intro = [c.intro, ...loose.map(g => g.text)].filter(Boolean).join('\n\n');   // read back as the intro anyway
    c.groups = [{ title: '', text: '', tasks: loose.flatMap(g => g.tasks) },
      ...c.groups.filter(g => g.title && (g.tasks.length || g.text))];
  }
  return board;
}

export function renderBoard(board){
  const out = [board.preamble || '# Board', ''];
  for (const c of board.columns){
    out.push(`## ${c.name}`);
    if (c.intro) out.push(c.intro);
    for (const g of c.groups){
      if (g.title) out.push('', `### ${g.title}`);
      if (g.text) out.push(g.text);
      for (const t of g.tasks){
        out.push(`- ${t.text}`);
        if (t.notes) for (const n of t.notes.split('\n')) out.push(n.trim() ? '  ' + n : '');
      }
    }
    out.push('');
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\n+$/, '\n');
}

// A board sent by the browser, checked and tidied before it's written.
export function cleanBoard(b){
  const bad = msg => { throw Object.assign(new Error(msg), { status: 400 }); };
  const one = (s, max) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
  const many = (s, max) => String(s ?? '').replace(/\r/g, '').trim().slice(0, max);
  // Unindented lines that would read back as a heading or a task are escaped, so they stay plain text.
  const plain = (s, max, re = /^(#{1,6}\s|[-*+]\s)/gm) => many(s, max).replace(re, '\\$1');
  if (!b || !Array.isArray(b.columns) || !b.columns.length) bad('A board needs at least one column.');
  if (b.columns.length > MAX_COLUMNS) bad(`A board can have at most ${MAX_COLUMNS} columns.`);
  const board = {
    preamble: plain(b.preamble, 4000, /^(#{2,6}\s)/gm),
    columns: b.columns.map(c => {
      const name = one(c?.name, 60);
      if (!name) bad('Every column needs a name.');
      const groups = Array.isArray(c.groups) ? c.groups : [];
      if (groups.length > MAX_GROUPS) bad(`A column can have at most ${MAX_GROUPS} groups.`);
      if (groups.reduce((n, g) => n + (Array.isArray(g?.tasks) ? g.tasks.length : 0), 0) > MAX_TASKS) bad(`A column can hold at most ${MAX_TASKS} tasks.`);
      return { name, intro: plain(c.intro, 4000), groups: groups.map(g => ({ title: one(g?.title, 200), text: plain(g?.text, 4000),
        tasks: (Array.isArray(g?.tasks) ? g.tasks : []).map(t => ({ text: one(t?.text, MAX_TEXT), notes: many(t?.notes, MAX_NOTES) })).filter(t => t.text) })) };
    })
  };
  if (Buffer.byteLength(renderBoard(board)) > MAX_BYTES) bad('The board is too big. Move finished tasks somewhere else first.');
  return tidy(board);
}
