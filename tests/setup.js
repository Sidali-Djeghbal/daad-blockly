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