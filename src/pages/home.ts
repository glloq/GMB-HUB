import { renderProjectCard } from '../components/project-card';
import { listProjects } from '../services/catalog';
import { escapeHtml, labelize } from '../utils/html';

export function renderHomePage(outlet: HTMLElement): void {
  const projects = listProjects();
  const instruments = projects.filter((project) => project.type === 'instrument');
  const currentInstruments = instruments
    .filter((project) => !['concept', 'legacy', 'archived'].includes(project.status.maturity));
  const gmbReady = currentInstruments.filter((project) => project.gmb.state === 'native').length;
  const familyCounts = new Map<string, number>();

  for (const project of currentInstruments) {
    for (const family of project.families) {
      if (family === 'software' || family === 'generic') continue;
      familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
    }
  }

  const families = [...familyCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8);

  outlet.innerHTML = `
    <section class="home-hero">
      <div class="home-hero__copy">
        <p class="eyebrow">General MIDI Boop ecosystem</p>
        <h1>Mechanical MIDI instruments, one orchestra.</h1>
        <p>Discover the instruments, see what each one can actually play, and understand how General MIDI Boop connects them together.</p>
        <div class="hero__actions">
          <a class="button" href="#/instruments">Explore instruments</a>
          <a class="button button--secondary" href="#/gmb">How GMB works</a>
        </div>
      </div>

      <a class="home-gmb-card" href="#/gmb" aria-label="Explore General MIDI Boop">
        <span class="home-gmb-card__label">Core system</span>
        <strong>GMB</strong>
        <p>Discover · Route · Adapt · Arrange · Perform</p>
        <div>
          <span>${gmbReady} native GMB instruments</span>
          <span>Up to 16 instruments</span>
        </div>
      </a>
    </section>

    <section class="home-flow" aria-label="GMB ecosystem flow">
      <div><span>1</span><strong>MIDI sources</strong><small>USB · BLE · DIN · Network · Files</small></div>
      <i aria-hidden="true">→</i>
      <div class="home-flow__core"><span>2</span><strong>General MIDI Boop</strong><small>Discovery · assignment · adaptation</small></div>
      <i aria-hidden="true">→</i>
      <div><span>3</span><strong>Mechanical instruments</strong><small>One synchronized orchestra</small></div>
    </section>

    <section class="home-section">
      <div class="section-heading">
        <div><p class="eyebrow">Browse by family</p><h2>Choose an instrument type</h2></div>
      </div>
      <nav class="family-rail" aria-label="Instrument families">
        ${families.map(([family, count]) => `<a href="#/instruments?family=${encodeURIComponent(family)}" data-family="${escapeHtml(family)}"><strong>${escapeHtml(labelize(family))}</strong><span>${count}</span></a>`).join('')}
        <a class="family-rail__all" href="#/instruments"><strong>All instruments</strong><span>${currentInstruments.length}</span></a>
      </nav>
    </section>

    <section class="home-section instrument-module-section">
      <div class="section-heading">
        <div><p class="eyebrow">Current projects</p><h2>Explore the instruments</h2></div>
        <a href="#/instruments">View all</a>
      </div>
      <div class="project-grid project-grid--compact">${currentInstruments.slice(0, 8).map(renderProjectCard).join('')}</div>
    </section>
  `;
}
