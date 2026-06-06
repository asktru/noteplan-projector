# Projector for NotePlan

Set a note's **type** (project / area / plain note) and **status** with a single command for [NotePlan](https://noteplan.co), and have its sidebar **icon** and **icon-color** styled automatically to match. A lightweight cosmetics layer for the project/area frontmatter used by the Clarity and Weekly Review plugins.

## Features

- **One-step type & status** — quick commands instead of editing frontmatter by hand
- **Automatic icon + color** — `icon` and `icon-color` are set from the type + status combination
- **Plays nicely** — uses the same `type` / `status` frontmatter that Clarity and Weekly Review read
- **Clean clearing** — making a note a plain note removes the icon, color, and status
- **No window, no settings, no dependencies** — pure frontmatter commands; works on the note open in the editor

## Commands

All commands act on the note currently open in the editor.

**Type:**

| Command | Effect |
|---|---|
| `Set type: Project` | `type: project` + styles for the current status |
| `Set type: Area` | `type: area` + styles for the current status |
| `Set type: Note` | `type: note`; clears `icon`, `icon-color`, and `status` |

**Status:**

| Command | Effect |
|---|---|
| `Set status: Active` | removes the `status` field (active is the default) |
| `Set status: Working` | `status: working` |
| `Set status: Paused` | `status: paused` |
| `Set status: Someday` | `status: someday` |
| `Set status: Completed` | `status: completed` |
| `Set status: Canceled` | `status: canceled` |

## Type + Status → icon / icon-color

**Project** (all statuses):

| status | icon | icon-color |
|---|---|---|
| active *(no status)* | `circle` | `sky-600` |
| working | `circle-play` | `amber-400` |
| paused | `circle-pause` | `indigo-700` |
| someday | `circle-stop` | `gray-700` |
| completed | `circle-check` | `lime-700` |
| canceled | `circle-xmark` | `gray-500` |

**Area** (active / paused / someday):

| status | icon | icon-color |
|---|---|---|
| active *(no status)* | `box-open` | `amber-700` |
| paused | `box-archive` | `amber-900` |
| someday | `box-archive` | `gray-700` |

## How It Works

- Type and status are stored in the note's YAML frontmatter (`type:` and `status:`).
- **Active** is represented by the *absence* of a `status:` field.
- Setting a type keeps the current status (and vice versa), then recomputes `icon` / `icon-color` from the table above.
- **Undefined combinations** (e.g. an area set to *completed*, or a note with no project/area type) still get the `status` written, but the `icon` / `icon-color` are **left unchanged** — Projector never guesses an icon it wasn't given.
- `Set type: Note` clears `icon`, `icon-color`, and `status`, leaving a plain note.

## Installation

1. Copy the `asktru.Projector` folder into your NotePlan plugins directory:
   ```
   ~/Library/Containers/co.noteplan.NotePlan*/Data/Library/Application Support/co.noteplan.NotePlan*/Plugins/
   ```
2. Restart NotePlan.
3. The commands appear in the Command Bar under **🎬 Projector**.

## License

MIT
