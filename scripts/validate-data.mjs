import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
const ids = (records, label) => {
  const seen = new Set();
  for (const record of records) {
    if (!record?.id || seen.has(record.id)) throw new Error(`${label}: missing or duplicate id: ${record?.id ?? '<missing>'}`);
    seen.add(record.id);
  }
  return seen;
};

const [schema, categories, boards, actuators, midiAudit] = await Promise.all([
  readJson('schema/project.schema.json'),
  readJson('data/categories.json'),
  readJson('data/boards.json'),
  readJson('data/actuators.json'),
  readJson('data/midi-capabilities.json'),
]);

const categoryIds = ids(categories, 'categories');
const boardIds = ids(boards, 'boards');
const actuatorIds = ids(actuators, 'actuators');

const ajv = new Ajv2020({ allErrors: true, strict: false, formats: false });
const validate = ajv.compile(schema);
const projectsDir = path.join(root, 'data/projects');
const files = (await readdir(projectsDir)).filter((file) => file.endsWith('.json')).sort();
const projects = [];

for (const file of files) {
  const project = JSON.parse(await readFile(path.join(projectsDir, file), 'utf8'));
  if (!validate(project)) {
    console.error(`Invalid project: ${file}`);
    console.error(validate.errors);
    process.exitCode = 1;
    continue;
  }
  if (`${project.id}.json` !== file) throw new Error(`${file}: filename must match project id ${project.id}`);
  for (const family of project.families ?? []) if (!categoryIds.has(family)) throw new Error(`${file}: unknown family ${family}`);
  for (const board of project.controller?.boardIds ?? []) if (!boardIds.has(board)) throw new Error(`${file}: unknown board ${board}`);
  for (const actuator of project.actuators ?? []) if (!actuatorIds.has(actuator.typeId)) throw new Error(`${file}: unknown actuator ${actuator.typeId}`);
  for (const target of project.flash?.targets ?? []) if (!boardIds.has(target.boardId)) throw new Error(`${file}: flash target uses unknown board ${target.boardId}`);
  projects.push(project);
}

const projectIds = ids(projects, 'projects');
for (const project of projects) {
  for (const relation of ['replaces', 'replacedBy', 'related']) {
    for (const target of project.relations?.[relation] ?? []) {
      if (!projectIds.has(target)) throw new Error(`${project.id}: ${relation} references missing project ${target}`);
    }
  }
}

const midiStatuses = new Set(['supported', 'unsupported', 'dynamic', 'optional', 'unknown']);
const midiMessageKeys = new Set([
  'noteOn', 'noteOff', 'controlChange', 'programChange', 'pitchBend',
  'channelAftertouch', 'polyAftertouch', 'clock', 'start', 'continue', 'stop', 'systemReset',
]);
const auditedProjects = Object.entries(midiAudit.projects ?? {});
for (const [projectId, audit] of auditedProjects) {
  if (!projectIds.has(projectId)) throw new Error(`midi-capabilities: unknown project ${projectId}`);
  if (!audit || typeof audit !== 'object') throw new Error(`midi-capabilities: ${projectId} must be an object`);
  for (const [message, status] of Object.entries(audit.messageSupport ?? {})) {
    if (!midiMessageKeys.has(message)) throw new Error(`midi-capabilities: ${projectId} unknown MIDI message key ${message}`);
    if (!midiStatuses.has(status)) throw new Error(`midi-capabilities: ${projectId}.${message} invalid status ${status}`);
  }
  const ccSeen = new Set();
  for (const cc of audit.supportedCC ?? []) {
    if (!Number.isInteger(cc) || cc < 0 || cc > 127) throw new Error(`midi-capabilities: ${projectId} invalid CC ${cc}`);
    if (ccSeen.has(cc)) throw new Error(`midi-capabilities: ${projectId} duplicate CC ${cc}`);
    ccSeen.add(cc);
  }
  const featureIds = new Set();
  for (const feature of audit.features ?? []) {
    if (!feature?.id || !feature?.label) throw new Error(`midi-capabilities: ${projectId} feature requires id and label`);
    if (featureIds.has(feature.id)) throw new Error(`midi-capabilities: ${projectId} duplicate feature ${feature.id}`);
    if (!midiStatuses.has(feature.status)) throw new Error(`midi-capabilities: ${projectId}.${feature.id} invalid status ${feature.status}`);
    featureIds.add(feature.id);
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log(`GMB HUB data valid: ${projects.length} project record(s), ${boards.length} boards, ${actuators.length} actuator types, ${auditedProjects.length} audited MIDI profiles.`);
