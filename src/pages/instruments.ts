import { getMidiInputTransports } from '../components/capability-badges';
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

function initialFamily(): string {
  const [, rawQuery = ''] = window.location.hash.split('?');
  return new URLSearchParams(rawQuery).get('family') ?? '';
}

export function renderInstrumentsPage(outlet: HTMLElement): void {
  const projects = listProjects().filter((project) => ['instrument', 'legacy', 'archive'].includes(project.type));
  const types = unique(projects.map((project) => project.type));
  const families = unique(projects.flatMap((project) => project.families).filter((family) => family !== 'software' && family !== 'generic'));
  const boards = unique(projects.flatMap((project) => project.controller.boardIds));
  const midiInputs = unique(projects.flatMap((project) => getMidiInputTransports(project.midi.transports).map((transport) => transport.id)));
  const maturities = unique(projects.map((project) => project.status.maturity));
  const gmbStates = unique(projects.map((project) => project.gmb.state));
  let selectedFamily = families.includes(initialFamily()) ? initialFamily() : '';

  outlet.innerHTML = `
    <section class="catalog-head">
      <div>
        <p class="eyebrow">GMB orchestra</p>
        <h1>Instruments</h1>
        <p>Pick a family, open an instrument, then dive into its hardware and MIDI capabilities only when you need them.</p>
      </div>
      <label class="catalog-search"><span>Search</span><input id="catalog-search" type="search" placeholder="Flute, guitar, ESP32…" autocomplete="off"></label>
    </section>

    <nav class="family-filter" aria-label="Filter by instrument family">
      <button type="button" data-family="" class="${selectedFamily ? '' : 'is-active'}">All</button>
      ${families.map((family) => `<button type="button" data-family="${escapeHtml(family)}" class="${selectedFamily === family ? 'is-active' : ''}">${escapeHtml(labelize(family))}</button>`).join('')}
    </nav>

    <details class="filter-drawer">
      <summary>More filters</summary>
      <div class="filter-drawer__grid">
        <label>Generation<select id="catalog-type">${optionList(types, 'All generations')}</select></label>
        <label>Controller<select id="catalog-board">${optionList(boards, 'All controllers')}</select></label>
        <label>MIDI input<select id="catalog-midi">${optionList(midiInputs, 'All MIDI inputs')}</select></label>
        <label>GMB<select id="catalog-gmb">${optionList(gmbStates, 'All GMB states')}</select></label>
        <label>Maturity<select id="catalog-maturity">${optionList(maturities, 'All maturity levels')}</select></label>
        <button class="text-button filter-reset" id="catalog-reset" type="button">Reset all</button>
      </div>
    </details>

    <div class="results-bar"><strong id="catalog-count"></strong></div>
    <section id="catalog-results" class="project-grid project-grid--compact" aria-live="polite"></section>
  `;

  const results = outlet.querySelector<HTMLElement>('#catalog-results');
  const count = outlet.querySelector<HTMLElement>('#catalog-count');
  const search = outlet.querySelector<HTMLInputElement>('#catalog-search');
  const type = outlet.querySelector<HTMLSelectElement>('#catalog-type');
  const board = outlet.querySelector<HTMLSelectElement>('#catalog-board');
  const midi = outlet.querySelector<HTMLSelectElement>('#catalog-midi');
  const gmb = outlet.querySelector<HTMLSelectElement>('#catalog-gmb');
  const maturity = outlet.querySelector<HTMLSelectElement>('#catalog-maturity');
  const reset = outlet.querySelector<HTMLButtonElement>('#catalog-reset');
  const familyButtons = [...outlet.querySelectorAll<HTMLButtonElement>('.family-filter button')];

  const applyFilters = (): void => {
    if (!results || !count || !search || !type || !board || !midi || !gmb || !maturity) return;
    const query = search.value.trim().toLowerCase();
    const visible = projects.filter((project: ProjectSummary) => {
      const projectMidiInputs = getMidiInputTransports(project.midi.transports).map((transport) => transport.id);
      const haystack = [
        project.name,
        project.summary,
        ...project.supportedInstruments,
        ...project.families,
        ...project.controller.boardIds,
        ...projectMidiInputs,
      ].join(' ').toLowerCase();
      return (!query || haystack.includes(query))
        && (!selectedFamily || project.families.includes(selectedFamily))
        && (!type.value || project.type === type.value)
        && (!board.value || project.controller.boardIds.includes(board.value))
        && (!midi.value || projectMidiInputs.includes(midi.value))
        && (!gmb.value || project.gmb.state === gmb.value)
        && (!maturity.value || project.status.maturity === maturity.value);
    });

    count.textContent = `${visible.length} instrument${visible.length === 1 ? '' : 's'}`;
    results.innerHTML = visible.length
      ? visible.map(renderProjectCard).join('')
      : '<div class="empty-state"><h2>No matching instrument</h2><p>Try another family or clear the advanced filters.</p></div>';
  };

  familyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedFamily = button.dataset.family ?? '';
      familyButtons.forEach((candidate) => candidate.classList.toggle('is-active', candidate === button));
      applyFilters();
    });
  });

  [search, type, board, midi, gmb, maturity].forEach((control) => {
    control?.addEventListener(control instanceof HTMLInputElement ? 'input' : 'change', applyFilters);
  });

  reset?.addEventListener('click', () => {
    if (search) search.value = '';
    selectedFamily = '';
    [type, board, midi, gmb, maturity].forEach((control) => { if (control) control.value = ''; });
    familyButtons.forEach((button) => button.classList.toggle('is-active', (button.dataset.family ?? '') === ''));
    applyFilters();
  });

  applyFilters();
}
