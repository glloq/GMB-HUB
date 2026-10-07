import { findProject } from '../services/catalog';
import { escapeHtml, labelize } from '../utils/html';

function list(items: string[], empty = 'Not documented'): string {
  return items.length ? items.map((item) => `<li>${escapeHtml(labelize(item))}</li>`).join('') : `<li class="muted">${escapeHtml(empty)}</li>`;
}

export function renderProjectPage(outlet: HTMLElement, params: Record<string, string> = {}): void {
  const project = findProject(params.id ?? '');
  if (!project) {
    outlet.innerHTML = '<section class="empty-state"><p class="eyebrow">404</p><h1>Project not found</h1><a href="#/instruments">Return to catalog</a></section>';
    return;
  }

  const gmbLabel = project.gmb.state === 'native'
    ? `Native${project.gmb.protocolVersion ? ` · protocol v${project.gmb.protocolVersion}` : ''}`
    : labelize(project.gmb.state);

  outlet.innerHTML = `
    <article class="project-detail">
      <header class="project-hero">
        <div>
          <p class="eyebrow">${escapeHtml(labelize(project.type))}</p>
          <h1>${escapeHtml(project.name)}</h1>
          <p class="hero__lede">${escapeHtml(project.summary)}</p>
        </div>
        <div class="hero__actions">
          <a class="button" href="${escapeHtml(project.repository.url)}" target="_blank" rel="noreferrer">GitHub repository</a>
          <a class="button button--secondary" href="#/instruments">Back to catalog</a>
        </div>
      </header>

      <section class="status-grid" aria-label="Project status">
        <div><span>Maturity</span><strong>${escapeHtml(labelize(project.status.maturity))}</strong></div>
        <div><span>Software</span><strong>${escapeHtml(labelize(project.status.software))}</strong></div>
        <div><span>Hardware</span><strong>${escapeHtml(labelize(project.status.hardware))}</strong></div>
        <div><span>GMB</span><strong>${escapeHtml(labelize(project.status.gmb))}</strong></div>
      </section>

      <div class="detail-grid">
        <section class="detail-card"><p class="eyebrow">What it can represent</p><h2>Supported instruments</h2><ul>${list(project.supportedInstruments)}</ul></section>
        <section class="detail-card"><p class="eyebrow">Electronics</p><h2>Controller boards</h2><ul>${list(project.controller.boardIds)}</ul></section>
        <section class="detail-card"><p class="eyebrow">Classification</p><h2>Families</h2><ul>${list(project.families)}</ul></section>
        <section class="detail-card"><p class="eyebrow">General MIDI Boop</p><h2>${escapeHtml(gmbLabel)}</h2><ul>
          <li>Automatic discovery: ${project.gmb.automaticDiscovery === null ? 'Unknown' : project.gmb.automaticDiscovery ? 'Yes' : 'No'}</li>
          <li>Capability descriptor: ${project.gmb.capabilityDescriptor === null ? 'Unknown' : project.gmb.capabilityDescriptor ? 'Yes' : 'No'}</li>
          <li>Change notification: ${project.gmb.changeNotification === null ? 'Unknown' : project.gmb.changeNotification ? 'Yes' : 'No'}</li>
        </ul></section>
      </div>

      ${project.gmb.notes.length ? `<section class="notice"><strong>GMB evidence note</strong><p>${project.gmb.notes.map(escapeHtml).join('<br>')}</p></section>` : ''}
    </article>
  `;
}
