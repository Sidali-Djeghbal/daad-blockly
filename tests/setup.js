import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Blockly from 'blockly';
import 'blockly/blocks';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

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