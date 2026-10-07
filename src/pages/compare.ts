import type { ProjectSummary } from '../models/project';
import { listProjects } from '../services/catalog';
import { escapeHtml, labelize } from '../utils/html';

function valueOrUnknown(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === '' ? 'Unknown' : String(value);
}

function yesNo(value: boolean | null): string {
  return value === null ? 'Unknown' : value ? 'Yes' : 'No';
}

function row(label: string, selected: ProjectSummary[], value: (project: ProjectSummary) => string): string {
  return `<tr><th scope="row">${escapeHtml(label)}</th>${selected.map((project) => `<td>${escapeHtml(value(project))}</td>`).join('')}</tr>`;
}

export function renderComparePage(outlet: HTMLElement): void {
  const projects = listProjects().filter((project) => ['instrument', 'legacy', 'archive', 'controller'].includes(project.type));

  outlet.innerHTML = `
    <section class="page-intro">
      <p class="eyebrow">Decision support</p>
      <h1>Compare projects</h1>
      <p>Select up to four projects. The comparison uses only the canonical local GMB HUB data; unknown information stays unknown.</p>
    </section>
    <section class="compare-picker">
      <label>Project<select id="compare-project">${projects.map((project) => `<option value="${escapeHtml(project.id)}">${escapeHtml(project.name)}</option>`).join('')}</select></label>
      <button id="compare-add" class="button" type="button">Add project</button>
      <button id="compare-clear" class="button button--secondary" type="button">Clear</button>
    </section>
    <div id="compare-selected" class="selection-chips"></div>
    <section id="compare-output"></section>
  `;

  const select = outlet.querySelector<HTMLSelectElement>('#compare-project');
  const add = outlet.querySelector<HTMLButtonElement>('#compare-add');
  const clear = outlet.querySelector<HTMLButtonElement>('#compare-clear');
  const selectedArea = outlet.querySelector<HTMLElement>('#compare-selected');
  const output = outlet.querySelector<HTMLElement>('#compare-output');
  const selectedIds: string[] = [];

  const render = (): void => {
    if (!selectedArea || !output) return;
    const selected = selectedIds.map((id) => projects.find((project) => project.id === id)).filter((project): project is ProjectSummary => Boolean(project));
    selectedArea.innerHTML = selected.map((project) => `<button class="selection-chip" type="button" data-remove="${escapeHtml(project.id)}">${escapeHtml(project.name)} ×</button>`).join('');
    selectedArea.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach((button) => button.addEventListener('click', () => {
      const id = button.dataset.remove;
      if (!id) return;
      const index = selectedIds.indexOf(id);
      if (index >= 0) selectedIds.splice(index, 1);
      render();
    }));

    if (!selected.length) {
      output.innerHTML = '<div class="empty-state"><h2>No projects selected</h2><p>Add two or more projects to compare their architecture and maturity.</p></div>';
      return;
    }

    output.innerHTML = `
      <div class="comparison-scroll">
        <table class="comparison-table">
          <thead><tr><th>Attribute</th>${selected.map((project) => `<th><a href="#/projects/${encodeURIComponent(project.id)}">${escapeHtml(project.name)}</a></th>`).join('')}</tr></thead>
          <tbody>
            ${row('Generation', selected, (project) => labelize(project.type))}
            ${row('Maturity', selected, (project) => labelize(project.status.maturity))}
            ${row('Hardware evidence', selected, (project) => labelize(project.status.hardware))}
            ${row('GMB', selected, (project) => project.gmb.state === 'native' ? `Native${project.gmb.protocolVersion ? ` v${project.gmb.protocolVersion}` : ''}` : labelize(project.gmb.state))}
            ${row('Instruments', selected, (project) => project.supportedInstruments.map(labelize).join(', ') || 'Unknown')}
            ${row('Boards', selected, (project) => project.controller.boardIds.map(labelize).join(', ') || 'Unknown')}
            ${row('Actuators', selected, (project) => [...new Set(project.actuators.map((item) => labelize(item.typeId)))].join(', ') || 'Unknown')}
            ${row('Axes', selected, (project) => valueOrUnknown(project.mechanics.axes))}
            ${row('Calibration', selected, (project) => yesNo(project.mechanics.calibrationRequired))}
            ${row('Homing', selected, (project) => yesNo(project.mechanics.homingRequired))}
            ${row('Polyphony', selected, (project) => valueOrUnknown(project.capabilities.polyphony))}
            ${row('Velocity', selected, (project) => yesNo(project.capabilities.velocity))}
            ${row('3D printing', selected, (project) => yesNo(project.mechanics.requires3dPrinting))}
            ${row('CNC', selected, (project) => yesNo(project.mechanics.requiresCnc))}
            ${row('Woodworking', selected, (project) => yesNo(project.mechanics.requiresWoodworking))}
            ${row('Browser flash', selected, (project) => project.flash.supported ? 'Supported' : 'Not published')}
          </tbody>
        </table>
      </div>
    `;
  };

  add?.addEventListener('click', () => {
    if (!select || selectedIds.length >= 4 || selectedIds.includes(select.value)) return;
    selectedIds.push(select.value);
    render();
  });
  clear?.addEventListener('click', () => { selectedIds.splice(0, selectedIds.length); render(); });
  render();
}
