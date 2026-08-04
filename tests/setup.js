import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as BlocklyNS from 'blockly';
import 'blockly/blocks';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// ESM namespace objects are non-extensible, so the eval'd scripts below cannot
// attach `Blockly.Blocks[...]` / `Blockly.Daad` directly. Copy the namespace
// into a fresh extensible object that the scripts can mutate.
const Blockly = { ...BlocklyNS };
globalThis.Blockly = Blockly;

const customSrc = fs.readFileSync(
  path.join(root, 'assets/js/blocks/custom.js'),
  'utf8'
);
const generatorSrc = fs.readFileSync(
  path.join(root, 'assets/js/generator/index.js'),
  'utf8'
);

(0, eval)(customSrc);
(0, eval)(generatorSrc);

export function buildWorkspace(state) {
  const ws = new Blockly.Workspace();
  Blockly.serialization.workspaces.load(state, ws);
  return ws;
}

export function codeOf(state) {
  const ws = buildWorkspace(state);
  return Blockly.Daad.workspaceToCode(ws);
}

// --- Block state builders (serialisation v0) -----------------------------
// These produce the {"block": {...}} input-value wrappers expected by Blockly's
// JSON serialiser, so tests stay terse.

export function block(type, opts = {}) {
  const b = { kind: 'block', type };
  if (opts.fields) b.fields = opts.fields;
  if (opts.inputs) b.inputs = opts.inputs;
  if (opts.next) b.next = { block: opts.next };
  if (opts.extraState) b.extraState = opts.extraState;
  return b;
}

export function val(b) {
  return { block: b };
}

export function stmt(b) {
  return { block: b };
}

export function shadow(type, opts = {}) {
  const b = { kind: 'block', type, ...opts };
  return { shadow: b };
}

export function text(str) {
  return val(block('text', { fields: { TEXT: String(str) } }));
}

export function num(n) {
  return val(block('math_number', { fields: { NUM: n } }));
}

export function varGet(name, id) {
  return val(block('variables_get', { fields: { VAR: { id: id || name, name } } }));
}

export function program(blocks, variables) {
  const state = {
    blocks: {
      languageVersion: 0,
      blocks: Array.isArray(blocks) ? blocks : [blocks],
    },
  };
  if (variables) state.variables = variables;
  return state;
}

export function variable(name, id) {
  return { name, id: id || name, type: '' };
}