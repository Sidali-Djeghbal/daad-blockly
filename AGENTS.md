# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Project

`daad-blockly` — Arabic (RTL) visual programming desktop app built with Electron
and Google Blockly. Generates code for the Daad language and runs it via a
bundled `bin/daad` interpreter.

The app uses **plain-script globals**, not ES modules: `Blockly` is a window
global injected by the UMD scripts loaded in `index.html`; the renderer, custom
blocks, and generator attach properties to that global (`Blockly.Blocks[...]`,
`Blockly.Daad = Daad`). Do **not** convert these files to ES modules without
also updating `index.html` and the test setup.

## Commands

- `npm start` — launch the Electron app.
- `npm run dev` — launch with DevTools open (`--dev`).
- `npm test` — run the Vitest suite once (exit code reflects pass/fail).
- `npm run test:watch` — run Vitest in watch mode.
- `npm run lint` — ESLint, warn-level output, exit 0 on success.
- `npm run lint:fix` — ESLint with auto-fix.
- `npm run dist[:linux|:win|:mac]` — package installers via electron-builder.

## Testing

Tests live in `tests/` and use **Vitest + jsdom**. The setup file
(`tests/setup.js`) imports Blockly as ESM, copies the namespace into an
extensible global (the ESM namespace is non-extensible, so the eval'd script
files can mutate `Blockly.Blocks` / `Blockly.Daad`), then `eval`s the real
`assets/js/blocks/custom.js` and `assets/js/generator/index.js` against that
global. Tests buildBlockly JSON state and assert `Blockly.Daad.workspaceToCode`.

Helpers exported from `tests/setup.js`:

- `block(type, { fields, inputs, next, extraState })` — build a block node.
- `val(b)` / `stmt(b)` — wrap a block as a value / statement input (`{ block: b }`).
- `text(str)` / `num(n)` — shorthand value blocks.
- `program(blocks, variables)` — wrap into a top-level serialisation state.
- `variable(name, id)` — declare a workspace variable (`{ name, id, type: '' }`).
- `codeOf(state)` — load a state into a headless workspace and return generator
  code (convenience over `buildWorkspace` + `workspaceToCode`).

When adding a generator handler in `assets/js/generator/index.js`, add a test
under `tests/generator.<category>.test.js`. Real-variable blocks use a
`FieldVariable` (needs `{ id, name }` + a declared workspace variable); the
custom `daad_augmented_assign` block uses a plain text field — just a string.

CI (`.github/workflows/ci.yml`) runs `npm run lint` and `npm test` on push/PR.
Releases are produced by `.github/workflows/release.yml` on `v*` tags.

## Style

- Single quotes, semicolons (enforced by ESLint).
- ESLint is warn-only (`no-undef` is off because `Blockly` is a runtime global;
  `no-unused-vars` is a warning).
- Run `npm run lint` after source edits; tests must stay green.

## Generator gotchas

- Arabic **procedure** names get mangled by Blockly's `Names` database into
  `_XX_XX` hex sequences; that is real behaviour. Tests use ASCII names.
- Arabic **variable** names are preserved because the Daad generator overrides
  `getVariableName` to return the raw variable name from the variable map.
- `controls_if` mutator extra-state keys are `{ elseIfCount, hasElse }`
  (not `elseifCount`/`elseCount`). `lists_create_with` and `text_join` use
  `{ itemCount: n }`.
- Generator orders add parentheses when the inner block's precedence is looser
  than the requested order, so tests sometimes see double parens like
  `اذا ((a == b)):` — that is the actual generated output, not a bug.
- `daad_dict` returns the ITEMS field verbatim (no `{}` wrapping) — a known gap
  versus the README table; tests assert the real behaviour.