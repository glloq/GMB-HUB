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

const [schema, categories, boards, actuators] = await Promise.all([
  readJson('schema/project.schema.json'),
  readJson('data/categories.json'),
  readJson('data/boards.json'),
  readJson('data/actuators.json'),
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

if (process.exitCode) process.exit(process.exitCode);
console.log(`GMB HUB data valid: ${projects.length} project record(s), ${boards.length} boards, ${actuators.length} actuator types.`);
