import { renderProjectCard } from '../components/project-card';
import type { ProjectSummary } from '../models/project';
import { listProjects } from '../services/catalog';
import { escapeHtml, labelize } from '../utils/html';

function unique(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function optionList(values: string[], placeholder: string): string {
  return [`<option value="">${escapeHtml(placeholder)}</option>`, ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(labelize(value))}</option>`)].join('');
}

export function renderInstrumentsPage(outlet: HTMLElement): void {
  const projects = listProjects().filter((project) => project.type === 'instrument');
  const families = unique(projects.flatMap((project) => project.families));
  const boards = unique(projects.flatMap((project) => project.controller.boardIds));
  const maturities = unique(projects.map((project) => project.status.maturity));
  const gmbStates = unique(projects.map((project) => project.gmb.state));

  outlet.innerHTML = `
    <section class="page-intro">
      <p class="eyebrow">Catalog</p>
      <h1>Mechanical MIDI instruments</h1>
      <p>Browse projects by musical family, controller, GMB integration and maturity. Unknown values are intentionally left unknown rather than guessed.</p>
    </section>

    <section class="filters" aria-label="Catalog filters">
      <label>Search<input id="catalog-search" type="search" placeholder="Flute, guitar, ESP32…" autocomplete="off"></label>
      <label>Family<select id="catalog-family">${optionList(families, 'All families')}</select></label>
      <label>Controller<select id="catalog-board">${optionList(boards, 'All controllers')}</select></label>
      <label>GMB<select id="catalog-gmb">${optionList(gmbStates, 'All GMB states')}</select></label>
      <label>Maturity<select id="catalog-maturity">${optionList(maturities, 'All maturity levels')}</select></label>
    </section>

    <div class="results-bar"><strong id="catalog-count"></strong><button class="text-button" id="catalog-reset" type="button">Reset filters</button></div>
    <section id="catalog-results" class="project-grid" aria-live="polite"></section>
  `;

  const results = outlet.querySelector<HTMLElement>('#catalog-results');
  const count = outlet.querySelector<HTMLElement>('#catalog-count');
  const search = outlet.querySelector<HTMLInputElement>('#catalog-search');
  const family = outlet.querySelector<HTMLSelectElement>('#catalog-family');
  const board = outlet.querySelector<HTMLSelectElement>('#catalog-board');
  const gmb = outlet.querySelector<HTMLSelectElement>('#catalog-gmb');
  const maturity = outlet.querySelector<HTMLSelectElement>('#catalog-maturity');
  const reset = outlet.querySelector<HTMLButtonElement>('#catalog-reset');

  const applyFilters = (): void => {
    if (!results || !count || !search || !family || !board || !gmb || !maturity) return;
    const query = search.value.trim().toLowerCase();
    const visible = projects.filter((project: ProjectSummary) => {
      const haystack = [project.name, project.summary, ...project.supportedInstruments, ...project.families, ...project.controller.boardIds].join(' ').toLowerCase();
      return (!query || haystack.includes(query))
        && (!family.value || project.families.includes(family.value))
        && (!board.value || project.controller.boardIds.includes(board.value))
        && (!gmb.value || project.gmb.state === gmb.value)
        && (!maturity.value || project.status.maturity === maturity.value);
    });

    count.textContent = `${visible.length} project${visible.length === 1 ? '' : 's'}`;
    results.innerHTML = visible.length
      ? visible.map(renderProjectCard).join('')
      : '<div class="empty-state"><h2>No matching project</h2><p>Try removing one or more filters.</p></div>';
  };

  [search, family, board, gmb, maturity].forEach((control) => {
    control?.addEventListener(control instanceof HTMLInputElement ? 'input' : 'change', applyFilters);
  });
  reset?.addEventListener('click', () => {
    if (search) search.value = '';
    [family, board, gmb, maturity].forEach((control) => { if (control) control.value = ''; });
    applyFilters();
  });
  applyFilters();
}
