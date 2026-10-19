// A project's task board: BOARD.md in its repo, so Claude edits it in chats like any other file and it travels with
// the code. `## ` headings are columns, `- ` lines under them tasks, and lines indented under a task its notes.
// Text before the first column, and lines in a column that aren't tasks, are kept as they are.
export const BOARD_FILE = 'BOARD.md';
export const DEFAULT_COLUMNS = ['To do', 'In progress', 'Done'];
const MAX_COLUMNS = 12, MAX_TASKS = 500, MAX_TEXT = 500, MAX_NOTES = 4000, MAX_BYTES = 200000;

// -> { preamble, columns: [{ name, intro, tasks: [{ text, notes }] }] }
export function parseBoard(md){
  const preamble = [], columns = [];
  let col = null, task = null, blanks = 0;
  for (const raw of String(md || '').replace(/\r/g, '').split('\n')){
    const line = raw.replace(/\s+$/, '');
    let m;
    if ((m = /^##\s+(.*)$/.exec(line))){ col = { name: m[1].trim(), intro: [], tasks: [] }; columns.push(col); task = null; continue; }
    if (!col){ preamble.push(line); continue; }
    if ((m = /^[-*+]\s+(?:\[[ xX]\]\s+)?(.*)$/.exec(line))){ task = { text: m[1].trim(), notes: [] }; col.tasks.push(task); blanks = 0; continue; }
    if (!line){ if (task) blanks++; else col.intro.push(''); continue; }
    if (task && /^\s/.test(line)){
      if (task.notes.length) for (; blanks; blanks--) task.notes.push('');
      blanks = 0;
      task.notes.push(line.replace(/^( {1,4}|\t)/, ''));
      continue;
    }
    task = null; col.intro.push(line);
  }
  const text = lines => lines.join('\n').trim();
  return {
    preamble: text(preamble),
    columns: columns.length ? columns.map(c => ({ name: c.name, intro: text(c.intro), tasks: c.tasks.map(t => ({ text: t.text, notes: text(t.notes) })) }))
      : DEFAULT_COLUMNS.map(name => ({ name, intro: '', tasks: [] }))
  };
}

export function renderBoard(board){
  const out = [board.preamble || '# Board', ''];
  for (const c of board.columns){
    out.push(`## ${c.name}`);
    if (c.intro) out.push(c.intro);
    for (const t of c.tasks){
      out.push(`- ${t.text}`);
      if (t.notes) for (const n of t.notes.split('\n')) out.push(n.trim() ? '  ' + n : '');
    }
    out.push('');
  }
  return out.join('\n').replace(/\n+$/, '\n');
}

// A board sent by the browser, checked and tidied before it's written.
export function cleanBoard(b){
  const bad = msg => { throw Object.assign(new Error(msg), { status: 400 }); };
  const one = (s, max) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
  const many = (s, max) => String(s ?? '').replace(/\r/g, '').trim().slice(0, max);
  if (!b || !Array.isArray(b.columns) || !b.columns.length) bad('A board needs at least one column.');
  if (b.columns.length > MAX_COLUMNS) bad(`A board can have at most ${MAX_COLUMNS} columns.`);
  const board = {
    preamble: many(b.preamble, 4000),
    columns: b.columns.map(c => {
      const name = one(c?.name, 60);
      if (!name) bad('Every column needs a name.');
      const tasks = Array.isArray(c.tasks) ? c.tasks : [];
      if (tasks.length > MAX_TASKS) bad(`A column can hold at most ${MAX_TASKS} tasks.`);
      return { name, intro: many(c.intro, 4000), tasks: tasks.map(t => ({ text: one(t?.text, MAX_TEXT), notes: many(t?.notes, MAX_NOTES) })).filter(t => t.text) };
    })
  };
  if (Buffer.byteLength(renderBoard(board)) > MAX_BYTES) bad('The board is too big. Move finished tasks somewhere else first.');
  return board;
}
