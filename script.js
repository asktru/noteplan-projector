// asktru.Projector — set a note's type (project/area/note) and status,
// styling NotePlan's `icon` and `icon-color` frontmatter to match.

// type + status → { icon, color }. "active" status is represented by no `status`
// field. Areas only define active/paused/someday; other (type,status) combos are
// left unstyled (the command still writes the status, but icon/color are kept).
var STYLES = {
  project: {
    active:    { icon: 'circle',       color: 'sky-600' },
    working:   { icon: 'circle-play',  color: 'amber-400' },
    paused:    { icon: 'circle-pause', color: 'indigo-700' },
    someday:   { icon: 'circle-stop',  color: 'gray-700' },
    completed: { icon: 'circle-check', color: 'lime-700' },
    canceled:  { icon: 'circle-xmark', color: 'gray-500' },
  },
  area: {
    active:  { icon: 'box-open',    color: 'amber-700' },
    paused:  { icon: 'box-archive', color: 'amber-900' },
    someday: { icon: 'box-archive', color: 'gray-700' },
  },
};

// Read the current frontmatter key/value pairs (first --- … --- block).
function readFrontmatter(note) {
  var fm = {};
  var lines = (note.content || '').split('\n');
  if (lines[0] !== '---') return fm;
  for (var i = 1; i < lines.length; i++) {
    if (lines[i] === '---') break;
    var c = lines[i].indexOf(':');
    if (c > 0) fm[lines[i].slice(0, c).trim()] = lines[i].slice(c + 1).trim();
  }
  return fm;
}

// Apply a set of frontmatter changes (value === null removes the key), preserving
// the body and any other frontmatter keys. Creates a frontmatter block if absent.
function applyFrontmatterUpdates(note, updates) {
  var lines = (note.content || '').split('\n');
  var hasFm = lines[0] === '---';
  var endIdx = -1;
  if (hasFm) {
    for (var i = 1; i < lines.length; i++) { if (lines[i] === '---') { endIdx = i; break; } }
    if (endIdx < 0) hasFm = false;
  }
  var fmLines = hasFm ? lines.slice(1, endIdx) : [];
  var body = hasFm ? lines.slice(endIdx + 1) : lines.slice(0);

  function keyOf(l) { var c = l.indexOf(':'); return c > 0 ? l.slice(0, c).trim() : null; }

  var keys = Object.keys(updates);
  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    var val = updates[key];
    var found = -1;
    for (var j = 0; j < fmLines.length; j++) { if (keyOf(fmLines[j]) === key) { found = j; break; } }
    if (val === null || val === undefined) {
      if (found >= 0) fmLines.splice(found, 1);
    } else if (found >= 0) {
      fmLines[found] = key + ': ' + val;
    } else {
      fmLines.push(key + ': ' + val);
    }
  }

  if (fmLines.length > 0) {
    note.content = ['---'].concat(fmLines, ['---'], body).join('\n');
  } else {
    note.content = body.join('\n');
  }
}

// Core: set the effective type/status on the note and style icon/icon-color.
function applyProjectorStyle(note, newType, newStatus) {
  var fm = readFrontmatter(note);
  var type = (newType !== undefined && newType !== null) ? newType : (fm.type || '');
  var status = (newStatus !== undefined) ? newStatus : (fm.status || 'active');

  var updates = {};

  if (type === 'note') {
    // Plain note: keep type marker, clear the project cosmetics + status.
    updates.type = 'note';
    updates.status = null;
    updates.icon = null;
    updates['icon-color'] = null;
    applyFrontmatterUpdates(note, updates);
    DataStore.updateCache(note, true);
    return;
  }

  if (type === 'project' || type === 'area') updates.type = type;

  // "active" → no status field; otherwise write it.
  var statusKey = (!status || status === 'active') ? 'active' : status;
  updates.status = (statusKey === 'active') ? null : statusKey;

  // Style if this (type, status) is defined; otherwise leave icon/color as-is.
  var style = STYLES[type] && STYLES[type][statusKey];
  if (style) {
    updates.icon = style.icon;
    updates['icon-color'] = style.color;
  }

  applyFrontmatterUpdates(note, updates);
  DataStore.updateCache(note, true);
}

async function runOnEditorNote(apply, title) {
  var note = Editor && Editor.note;
  if (!note) {
    await CommandBar.prompt(title, 'Open a note in the editor first.');
    return;
  }
  apply(note);
}

// ── Type commands (keep current status) ──
function setTypeProject() { return runOnEditorNote(function (n) { applyProjectorStyle(n, 'project', undefined); }, 'Set type'); }
function setTypeArea()    { return runOnEditorNote(function (n) { applyProjectorStyle(n, 'area', undefined); }, 'Set type'); }
function setTypeNote()    { return runOnEditorNote(function (n) { applyProjectorStyle(n, 'note', undefined); }, 'Set type'); }

// ── Status commands (keep current type) ──
function setStatusActive()    { return runOnEditorNote(function (n) { applyProjectorStyle(n, undefined, 'active'); }, 'Set status'); }
function setStatusWorking()   { return runOnEditorNote(function (n) { applyProjectorStyle(n, undefined, 'working'); }, 'Set status'); }
function setStatusPaused()    { return runOnEditorNote(function (n) { applyProjectorStyle(n, undefined, 'paused'); }, 'Set status'); }
function setStatusSomeday()   { return runOnEditorNote(function (n) { applyProjectorStyle(n, undefined, 'someday'); }, 'Set status'); }
function setStatusCompleted() { return runOnEditorNote(function (n) { applyProjectorStyle(n, undefined, 'completed'); }, 'Set status'); }
function setStatusCanceled()  { return runOnEditorNote(function (n) { applyProjectorStyle(n, undefined, 'canceled'); }, 'Set status'); }

globalThis.setTypeProject = setTypeProject;
globalThis.setTypeArea = setTypeArea;
globalThis.setTypeNote = setTypeNote;
globalThis.setStatusActive = setStatusActive;
globalThis.setStatusWorking = setStatusWorking;
globalThis.setStatusPaused = setStatusPaused;
globalThis.setStatusSomeday = setStatusSomeday;
globalThis.setStatusCompleted = setStatusCompleted;
globalThis.setStatusCanceled = setStatusCanceled;
