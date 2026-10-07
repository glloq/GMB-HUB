import { renderProjectCard } from '../components/project-card';
import type { ProjectSummary } from '../models/project';
import { listProjects } from '../services/catalog';
import { escapeHtml, labelize } from '../utils/html';

function unique(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function options(values: string[], placeholder: string): string {
  return [`<option value="">${escapeHtml(placeholder)}</option>`, ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(labelize(value))}</option>`)].join('');
}

export function renderBuildPage(outlet: HTMLElement): void {
  const projects = listProjects().filter((project) => ['instrument', 'legacy'].includes(project.type));
  const families = unique(projects.flatMap((project) => project.families));
  const boards = unique(projects.flatMap((project) => project.controller.boardIds));
  const actuators = unique(projects.flatMap((project) => project.actuators.map((item) => item.typeId)));

  outlet.innerHTML = `
    <section class="page-intro">
      <p class="eyebrow">Choose a project</p>
      <h1>Build assistant</h1>
      <p>This assistant runs entirely in your browser. Required constraints are applied first; preferences only rank the remaining projects. Missing specifications are never guessed.</p>
    </section>

    <section class="build-assistant">
      <label>Required instrument family<select id="build-family">${options(families, 'Any family')}</select></label>
      <label>Preferred controller<select id="build-board">${options(boards, 'Any controller')}</select></label>
      <label>Preferred actuator<select id="build-actuator">${options(actuators, 'Any actuator')}</select></label>
      <label class="check-field"><input id="build-gmb" type="checkbox"> Prefer native GMB integration</label>
      <label class="check-field"><input id="build-modern" type="checkbox" checked> Prefer current-generation projects</label>
      <label class="check-field"><input id="build-tested" type="checkbox"> Require physical hardware evidence</label>
      <button id="build-run" class="button" type="button">Find projects</button>
      <button id="build-reset" class="button button--secondary" type="button">Reset</button>
    </section>

    <section class="section-block">
      <div class="section-heading"><div><p class="eyebrow">Recommendations</p><h2 id="build-heading">Best matches</h2></div></div>
      <div id="build-results" class="project-grid"></div>
    </section>
  `;

  const family = outlet.querySelector<HTMLSelectElement>('#build-family');
  const board = outlet.querySelector<HTMLSelectElement>('#build-board');
  const actuator = outlet.querySelector<HTMLSelectElement>('#build-actuator');
  const gmb = outlet.querySelector<HTMLInputElement>('#build-gmb');
  const modern = outlet.querySelector<HTMLInputElement>('#build-modern');
  const tested = outlet.querySelector<HTMLInputElement>('#build-tested');
  const run = outlet.querySelector<HTMLButtonElement>('#build-run');
  const reset = outlet.querySelector<HTMLButtonElement>('#build-reset');
  const results = outlet.querySelector<HTMLElement>('#build-results');
  const heading = outlet.querySelector<HTMLElement>('#build-heading');

  const passesRequirements = (project: ProjectSummary): boolean => {
    if (family?.value && !project.families.includes(family.value)) return false;
    if (tested?.checked && !['tested', 'partial'].includes(project.status.hardware)) return false;
    return true;
  };

  const score = (project: ProjectSummary): number => {
    let value = 0;
    if (board?.value) value += project.controller.boardIds.includes(board.value) ? 8 : 0;
    if (actuator?.value) value += project.actuators.some((item) => item.typeId === actuator.value) ? 8 : 0;
    if (gmb?.checked) value += project.gmb.state === 'native' ? 10 : project.gmb.state === 'planned' ? 1 : 0;
    if (modern?.checked) value += project.type === 'instrument' ? 6 : 0;
    if (project.status.maturity === 'validated') value += 4;
    if (project.status.maturity === 'hardware-tested') value += 3;
    if (project.status.maturity === 'bench-ready') value += 2;
    if (project.status.documentation === 'documented') value += 1;
    return value;
  };

  const render = (): void => {
    if (!results || !heading) return;
    const ranked = projects
      .filter(passesRequirements)
      .map((project) => ({ project, score: score(project) }))
      .sort((a, b) => b.score - a.score || a.project.name.localeCompare(b.project.name))
      .slice(0, 8);

    heading.textContent = ranked.length ? `${ranked.length} best matches` : 'No suitable match';
    results.innerHTML = ranked.length
      ? ranked.map(({ project, score: projectScore }) => `<div class="ranked-project"><div class="match-score">Match score ${projectScore}</div>${renderProjectCard(project)}</div>`).join('')
      : '<div class="empty-state"><h2>No matching project</h2><p>No catalog entry satisfies all required constraints. Relax a requirement or browse the full catalog.</p><a class="button button--secondary" href="#/instruments">Open catalog</a></div>';
  };

  run?.addEventListener('click', render);
  reset?.addEventListener('click', () => {
    if (family) family.value = '';
    if (board) board.value = '';
    if (actuator) actuator.value = '';
    if (gmb) gmb.checked = false;
    if (modern) modern.checked = true;
    if (tested) tested.checked = false;
    render();
  });
  render();
}
