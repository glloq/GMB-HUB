import { gmbProduct, type GmbFeatureStatus } from '../data/gmb';
import { findProject, listProjects } from '../services/catalog';
import { escapeHtml, labelize } from '../utils/html';

const statusLabel: Record<GmbFeatureStatus, string> = {
  core: 'Core',
  usable: 'Usable',
  partial: 'Partial',
  experimental: 'Experimental',
  'host-dependent': 'Host dependent',
};

function renderFeatureStatus(status: GmbFeatureStatus): string {
  return `<span class="gmb-feature-status gmb-feature-status--${status}">${statusLabel[status]}</span>`;
}

export function renderGmbPage(outlet: HTMLElement): void {
  const project = findProject('general-midi-boop');
  const projects = listProjects();
  const nativeProjects = projects
    .filter((candidate) => candidate.id !== 'general-midi-boop' && candidate.gmb.state === 'native')
    .sort((a, b) => a.name.localeCompare(b.name));
  const integrationProjects = projects
    .filter((candidate) => candidate.id !== 'general-midi-boop' && ['partial', 'planned'].includes(candidate.gmb.state))
    .sort((a, b) => a.name.localeCompare(b.name));
  const screenshots = project?.media.images ?? [];

  outlet.innerHTML = `
    <article class="gmb-page">
      <section class="gmb-product-hero">
        <div class="gmb-product-hero__copy">
          <p class="eyebrow">${escapeHtml(gmbProduct.eyebrow)}</p>
          <h1>${escapeHtml(gmbProduct.title)}</h1>
          <p class="gmb-product-hero__lede">${escapeHtml(gmbProduct.lede)}</p>
          <p class="gmb-product-hero__description">${escapeHtml(gmbProduct.description)}</p>
          <div class="hero__actions">
            <a class="button" href="https://github.com/glloq/General-Midi-Boop" target="_blank" rel="noreferrer">Open repository</a>
            <a class="button button--secondary" href="#/instruments">Compatible instruments</a>
            <a class="button button--ghost" href="#/build">Choose a build</a>
          </div>
        </div>
        <aside class="gmb-product-hero__facts" aria-label="General MIDI Boop key facts">
          ${gmbProduct.facts.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}
        </aside>
      </section>

      <section class="gmb-architecture section-block" aria-labelledby="gmb-architecture-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">System role</p>
            <h2 id="gmb-architecture-title">The coordination layer between music and machines</h2>
          </div>
        </div>
        <div class="gmb-flow" aria-label="MIDI sources through General MIDI Boop to instruments and lighting">
          <div class="gmb-flow__stage">
            <span class="gmb-flow__index">01</span>
            <strong>Sources</strong>
            <div>${gmbProduct.architecture.inputs.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
          </div>
          <span class="gmb-flow__arrow" aria-hidden="true">→</span>
          <div class="gmb-flow__stage gmb-flow__stage--core">
            <span class="gmb-flow__index">02</span>
            <strong>General MIDI Boop</strong>
            <div>${gmbProduct.architecture.core.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
          </div>
          <span class="gmb-flow__arrow" aria-hidden="true">→</span>
          <div class="gmb-flow__stage">
            <span class="gmb-flow__index">03</span>
            <strong>Physical outputs</strong>
            <div>${gmbProduct.architecture.outputs.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
          </div>
        </div>
      </section>

      <section class="section-block" aria-labelledby="gmb-features-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Audited capabilities</p>
            <h2 id="gmb-features-title">What GMB actually does</h2>
          </div>
          <p class="gmb-section-note">Status labels distinguish software capability from host or hardware validation.</p>
        </div>
        <div class="gmb-feature-grid">
          ${gmbProduct.features.map((feature) => `
            <article class="gmb-feature-card">
              <div class="gmb-feature-card__head">
                <h3>${escapeHtml(feature.title)}</h3>
                ${renderFeatureStatus(feature.status)}
              </div>
              <p>${escapeHtml(feature.summary)}</p>
              <ul>${feature.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join('')}</ul>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="section-block gmb-two-column" aria-label="Connectivity and compatibility">
        <div class="gmb-detail-panel">
          <p class="eyebrow">Connectivity</p>
          <h2>MIDI transport matrix</h2>
          <div class="gmb-transport-list">
            ${gmbProduct.transportMatrix.map(([name, status, direction, notes]) => `
              <div class="gmb-transport-row">
                <div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(direction)}</span></div>
                <span class="badge">${escapeHtml(status)}</span>
                <p>${escapeHtml(notes)}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="gmb-detail-panel">
          <p class="eyebrow">GMB ecosystem</p>
          <h2>Native instrument integration</h2>
          <p class="section-lede">These projects currently declare native GMB integration in the HUB catalogue. The list is generated from project metadata rather than copied from a static README list.</p>
          <div class="gmb-compatible-list">
            ${nativeProjects.length > 0
              ? nativeProjects.map((candidate) => `<a href="#/projects/${encodeURIComponent(candidate.id)}"><strong>${escapeHtml(candidate.name)}</strong><span>${escapeHtml(labelize(candidate.type))}</span></a>`).join('')
              : '<p class="muted">No native projects are currently indexed.</p>'}
          </div>
          ${integrationProjects.length > 0 ? `
            <details class="gmb-integration-more">
              <summary>${integrationProjects.length} additional integration / migration projects</summary>
              <div>${integrationProjects.map((candidate) => `<a href="#/projects/${encodeURIComponent(candidate.id)}">${escapeHtml(candidate.name)}</a>`).join('')}</div>
            </details>
          ` : ''}
        </div>
      </section>

      ${screenshots.length > 0 ? `
        <section class="section-block" aria-labelledby="gmb-interface-title">
          <div class="section-heading">
            <div><p class="eyebrow">Interface</p><h2 id="gmb-interface-title">One local UI for the complete orchestra</h2></div>
          </div>
          <div class="gmb-screenshot-grid">
            ${screenshots.slice(0, 3).map((image) => `
              <figure>
                <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt ?? 'General MIDI Boop interface')}" loading="lazy">
                <figcaption>${escapeHtml(image.alt ?? 'General MIDI Boop interface')}</figcaption>
              </figure>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <section class="section-block gmb-audit-notes" aria-labelledby="gmb-status-title">
        <div>
          <p class="eyebrow">Validation context</p>
          <h2 id="gmb-status-title">A broad system, with explicit maturity per subsystem</h2>
        </div>
        <div>
          ${gmbProduct.statusNotes.map((note) => `<p>${escapeHtml(note)}</p>`).join('')}
        </div>
      </section>

      <section class="gmb-final-cta section-block">
        <div>
          <p class="eyebrow">Central project</p>
          <h2>Build instruments separately. Operate them as one orchestra.</h2>
          <p>GMB HUB documents the machines; General MIDI Boop is the software layer that discovers, adapts, coordinates and performs with them.</p>
        </div>
        <div class="hero__actions">
          <a class="button" href="https://github.com/glloq/General-Midi-Boop" target="_blank" rel="noreferrer">General MIDI Boop on GitHub</a>
          <a class="button button--secondary" href="#/instruments">Explore instruments</a>
        </div>
      </section>
    </article>
  `;
}
