import { listProjects } from '../services/catalog';

export function renderAboutPage(outlet: HTMLElement): void {
  const projects = listProjects();
  const current = projects.filter((project) => ['instrument', 'controller', 'software'].includes(project.type)).length;
  const references = projects.filter((project) => ['legacy', 'archive'].includes(project.type)).length;

  outlet.innerHTML = `
    <section class="page-intro">
      <p class="eyebrow">Project</p>
      <h1>About GMB HUB</h1>
      <p>GMB HUB is the static front door for General MIDI Boop and the open mechanical MIDI instrument ecosystem around it.</p>
    </section>

    <section class="about-grid">
      <article class="detail-section">
        <p class="eyebrow">Purpose</p>
        <h2>From a MIDI file to a real acoustic instrument</h2>
        <p>Projects in this ecosystem turn acoustic instruments into MIDI-controlled electromechanical systems. GMB HUB brings the firmware, mechanics, electronics, documentation and compatibility information into one consistent catalog.</p>
      </article>
      <article class="detail-section">
        <p class="eyebrow">General MIDI Boop</p>
        <h2>The orchestrator</h2>
        <p>General MIDI Boop is the host-side software layer. Instrument firmware can expose its capabilities so the host can discover what is connected and adapt routing to the available hardware.</p>
        <a href="#/projects/general-midi-boop">Open General MIDI Boop</a>
      </article>
      <article class="detail-section">
        <p class="eyebrow">PlayMode</p>
        <h2>The generic controller path</h2>
        <p>PlayMode GMB is intended for instruments that do not need a dedicated motion engine. It provides a reusable path for servo, solenoid and other straightforward note-actuation designs.</p>
        <a href="#/projects/playmode-gmb">Open PlayMode GMB</a>
      </article>
      <article class="detail-section">
        <p class="eyebrow">Evidence</p>
        <h2>Software and hardware are not the same thing</h2>
        <p>The HUB deliberately separates implemented code, automated tests, bench readiness and real physical validation. Unknown information stays unknown instead of being inferred.</p>
      </article>
    </section>

    <section class="section-block">
      <div class="section-heading"><div><p class="eyebrow">Catalog</p><h2>${current} current projects · ${references} legacy/archive references</h2></div></div>
      <p class="section-lede">Legacy projects remain visible because they can contain proven mechanics, useful wiring patterns or design experiments. When a modern successor exists, the project lineage links both generations.</p>
    </section>

    <section class="detail-section static-policy">
      <p class="eyebrow">Architecture rule</p>
      <h2>Static by design</h2>
      <p>GMB HUB has no application backend. Search, filtering, comparison and build recommendations run locally in the browser from versioned project data. GitHub Actions only validates and builds the static site.</p>
      <div class="architecture-flow" aria-label="Static architecture">
        <span>Project data</span><b>→</b><span>Vite build</span><b>→</b><span>GitHub Pages</span><b>→</b><span>Browser</span>
      </div>
    </section>
  `;
}
