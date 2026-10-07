import { renderProjectCard } from '../components/project-card';
import { listProjects } from '../services/catalog';
import { escapeHtml, labelize } from '../utils/html';

export function renderHomePage(outlet: HTMLElement): void {
  const projects = listProjects();
  const instruments = projects.filter((project) => project.type === 'instrument');
  const currentInstruments = instruments
    .filter((project) => !['concept', 'legacy', 'archived'].includes(project.status.maturity));
  const gmbReady = currentInstruments.filter((project) => project.gmb.state === 'native').length;
  const families = [...new Set(currentInstruments.flatMap((project) => project.families))]
    .filter((family) => family !== 'software' && family !== 'generic')
    .slice(0, 8);

  outlet.innerHTML = `
    <section class="gmb-hero">
      <div class="gmb-hero__copy">
        <p class="eyebrow">General MIDI Boop ecosystem</p>
        <h1>One simple system for a complete mechanical MIDI orchestra.</h1>
        <p class="gmb-hero__lede">Choose an instrument, build it, connect it to GMB and let the orchestra handle routing, capabilities and playback.</p>
        <div class="hero__actions">
          <a class="button" href="#/instruments">Browse instruments</a>
          <a class="button button--secondary" href="#/software">Open GMB</a>
          <a class="button button--ghost" href="#/build">Choose a build</a>
        </div>
        <div class="gmb-hero__stats">
          <span><strong>${currentInstruments.length}</strong> current instruments</span>
          <span><strong>${gmbReady}</strong> native GMB</span>
        </div>
      </div>

      <div class="gmb-system" aria-label="General MIDI Boop ecosystem">
        <div class="gmb-system__inputs">
          ${families.map((family) => `<span>${escapeHtml(labelize(family))}</span>`).join('')}
        </div>
        <div class="gmb-system__arrow">→</div>
        <a class="gmb-core" href="#/projects/general-midi-boop">
          <span>GMB</span>
          <strong>General MIDI Boop</strong>
          <small>Detect · Route · Adapt · Play</small>
        </a>
        <div class="gmb-system__arrow">→</div>
        <div class="gmb-orchestra">
          <strong>Orchestra</strong>
          <span>One interface</span>
          <span>Many instruments</span>
        </div>
      </div>
    </section>

    <section class="section-block instrument-module-section">
      <div class="section-heading">
        <div><p class="eyebrow">Available modules</p><h2>Instruments for the GMB orchestra</h2></div>
        <a href="#/instruments">All projects</a>
      </div>
      <div class="project-grid project-grid--compact">${currentInstruments.slice(0, 12).map(renderProjectCard).join('')}</div>
    </section>

    <section class="gmb-workflow section-block" aria-label="GMB workflow">
      <div><b>1</b><span>Build an instrument</span></div>
      <div><b>2</b><span>Connect MIDI</span></div>
      <div><b>3</b><span>GMB detects capabilities</span></div>
      <div><b>4</b><span>Play the orchestra</span></div>
    </section>
  `;
}
