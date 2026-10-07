import { renderProjectCard } from '../components/project-card';
import { listProjects } from '../services/catalog';

export function renderHomePage(outlet: HTMLElement): void {
  const projects = listProjects();
  const instruments = projects.filter((project) => project.type === 'instrument');
  const controllers = projects.filter((project) => project.type === 'controller');
  const software = projects.filter((project) => project.type === 'software');
  const featured = instruments
    .filter((project) => !['concept', 'legacy', 'archived'].includes(project.status.maturity))
    .slice(0, 6);

  outlet.innerHTML = `
    <section class="hero">
      <p class="eyebrow">Open mechanical MIDI ecosystem</p>
      <h1>Build real instruments controlled by MIDI.</h1>
      <p class="hero__lede">GMB HUB brings together the firmware, mechanics, electronics and General MIDI Boop compatibility needed to understand and build robotic acoustic instruments.</p>
      <div class="hero__actions">
        <a class="button" href="#/instruments">Explore instruments</a>
        <a class="button button--secondary" href="#/software">General MIDI Boop</a>
        <a class="button button--ghost" href="#/build">Build your own</a>
      </div>
      <div class="stats" aria-label="Catalog summary">
        <div><strong>${instruments.length}</strong><span>instrument projects</span></div>
        <div><strong>${controllers.length}</strong><span>generic controllers</span></div>
        <div><strong>${software.length}</strong><span>software projects</span></div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <div><p class="eyebrow">Start here</p><h2>Featured instrument architectures</h2></div>
        <a href="#/instruments">View all instruments</a>
      </div>
      <div class="project-grid">${featured.map(renderProjectCard).join('')}</div>
    </section>

    <section class="steps section-block">
      <p class="eyebrow">Workflow</p>
      <h2>Choose → Build → Flash → Configure → Connect → Play</h2>
      <p>GMB HUB is intentionally static and data-driven. Firmware flashing will also remain browser-side when enabled.</p>
    </section>
  `;
}
