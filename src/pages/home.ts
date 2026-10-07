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
        <h1>Build the instruments. GMB turns them into one orchestra.</h1>
        <p class="gmb-hero__lede">General MIDI Boop is the central orchestration system: it discovers instrument capabilities, assigns and adapts MIDI parts, routes live sources, plays and arranges music, provides instrument-oriented MIDI editing, transcribes audio to MIDI and synchronizes lighting.</p>
        <div class="hero__actions">
          <a class="button" href="#/gmb">Explore General MIDI Boop</a>
          <a class="button button--secondary" href="#/instruments">Browse instruments</a>
        </div>
        <div class="gmb-hero__stats">
          <span><strong>${currentInstruments.length}</strong> current instruments</span>
          <span><strong>${gmbReady}</strong> native GMB</span>
          <span><strong>16</strong> instruments per orchestra</span>
        </div>
      </div>

      <div class="gmb-system" aria-label="General MIDI Boop ecosystem">
        <div class="gmb-system__inputs">
          <span>USB MIDI</span>
          <span>BLE MIDI</span>
          <span>DIN / GPIO</span>
          <span>Network MIDI</span>
          <span>MIDI files</span>
          <span>Audio → MIDI</span>
        </div>
        <div class="gmb-system__arrow">→</div>
        <a class="gmb-core" href="#/gmb">
          <span>GMB</span>
          <strong>General MIDI Boop</strong>
          <small>Discover · Route · Adapt · Arrange · Edit · Perform · Light</small>
        </a>
        <div class="gmb-system__arrow">→</div>
        <div class="gmb-orchestra">
          <strong>Mechanical orchestra</strong>
          <span>${families.map((family) => escapeHtml(labelize(family))).join(' · ') || 'Many instrument families'}</span>
          <span>One local interface</span>
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
      <div><b>2</b><span>Connect a MIDI source</span></div>
      <div><b>3</b><span>GMB discovers capabilities</span></div>
      <div><b>4</b><span>Assign & adapt parts</span></div>
      <div><b>5</b><span>Play, arrange & light the orchestra</span></div>
    </section>
  `;
}
