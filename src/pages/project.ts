import { findProject } from '../services/catalog';
import type { ProjectSummary } from '../models/project';
import { escapeHtml, labelize } from '../utils/html';

function list(items: string[], empty = 'Not documented'): string {
  return items.length ? items.map((item) => `<li>${escapeHtml(labelize(item))}</li>`).join('') : `<li class="muted">${escapeHtml(empty)}</li>`;
}

function yesNo(value: boolean | null): string {
  return value === null ? 'Unknown' : value ? 'Yes' : 'No';
}

function relationLinks(ids: string[]): string {
  if (!ids.length) return '<span class="muted">None documented</span>';
  return ids.map((id) => {
    const related = findProject(id);
    return related
      ? `<a class="relation-link" href="#/projects/${encodeURIComponent(id)}">${escapeHtml(related.name)}</a>`
      : `<span class="relation-link">${escapeHtml(labelize(id))}</span>`;
  }).join('');
}

function resourceLinks(project: ProjectSummary): string {
  const links = [...project.resources, ...project.documentation];
  if (!links.length) return '<p class="muted">No structured resources documented yet.</p>';
  return `<div class="resource-list">${links.map((item) => `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(item.label)}</span><small>${escapeHtml(labelize(item.kind))}</small></a>`).join('')}</div>`;
}

function actuatorRows(project: ProjectSummary): string {
  if (!project.actuators.length) return '<p class="muted">Actuators not documented.</p>';
  return `<div class="spec-list">${project.actuators.map((item) => `
    <div class="spec-row">
      <div><strong>${escapeHtml(labelize(item.typeId))}</strong><span>${escapeHtml(item.role)}</span></div>
      <div>${item.quantity === null ? 'Qty unknown' : `× ${item.quantity}`}${item.driver ? `<small>${escapeHtml(item.driver)}</small>` : ''}</div>
    </div>
  `).join('')}</div>`;
}

function powerRows(project: ProjectSummary): string {
  if (!project.power.supplies.length && !project.power.notes.length) return '<p class="muted">Power requirements not documented.</p>';
  const supplies = project.power.supplies.map((supply) => {
    const electrical = [supply.voltageV === null ? null : `${supply.voltageV} V`, supply.currentA === null ? null : `${supply.currentA} A`].filter(Boolean).join(' · ');
    return `<div class="spec-row"><div><strong>${escapeHtml(supply.label)}</strong>${supply.notes ? `<span>${escapeHtml(supply.notes)}</span>` : ''}</div><div>${escapeHtml(electrical || 'Rating unknown')}</div></div>`;
  }).join('');
  const notes = project.power.notes.length ? `<ul>${project.power.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul>` : '';
  return `<div class="spec-list">${supplies}</div>${notes}`;
}

function projectMedia(project: ProjectSummary): string {
  const items = [
    ...(project.media.thumbnail ? [{ url: project.media.thumbnail, alt: project.name }] : []),
    ...project.media.images.map((image) => ({ url: image.url, alt: image.alt ?? project.name })),
  ];
  const unique = items.filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index).slice(0, 4);
  if (!unique.length) return '';
  return `<section class="project-media" aria-label="Project media">${unique.map((item, index) => `<figure class="project-media__item${index === 0 ? ' project-media__item--hero' : ''}"><img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.alt)}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"></figure>`).join('')}</section>`;
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
  const range = project.capabilities.noteRange ? `${project.capabilities.noteRange.min}–${project.capabilities.noteRange.max}` : 'Unknown';
  const buildSystems = project.firmware.buildSystems.length ? project.firmware.buildSystems.join(' · ') : 'Not documented';
  const manufacture = [
    project.mechanics.requires3dPrinting ? '3D printing' : null,
    project.mechanics.requiresLaserCutting ? 'Laser cutting' : null,
    project.mechanics.requiresCnc ? 'CNC' : null,
    project.mechanics.requiresWoodworking ? 'Woodworking' : null,
  ].filter((value): value is string => Boolean(value));

  outlet.innerHTML = `
    <article class="project-detail">
      <header class="project-hero">
        <div>
          <p class="eyebrow">${escapeHtml(labelize(project.type))}</p>
          <h1>${escapeHtml(project.name)}</h1>
          <p class="hero__lede">${escapeHtml(project.summary)}</p>
          ${project.description ? `<p>${escapeHtml(project.description)}</p>` : ''}
        </div>
        <div class="hero__actions">
          <a class="button" href="${escapeHtml(project.repository.url)}" target="_blank" rel="noreferrer">GitHub repository</a>
          <a class="button button--secondary" href="#/instruments">Back to catalog</a>
        </div>
      </header>

      ${projectMedia(project)}
      ${project.relations.replacedBy.length ? `<section class="replacement-notice"><p class="eyebrow">Recommended newer project</p><div>${relationLinks(project.relations.replacedBy)}</div></section>` : ''}
      ${project.warnings.length ? `<section class="warning-stack">${project.warnings.map((warning) => `<p><strong>Notice</strong> ${escapeHtml(warning)}</p>`).join('')}</section>` : ''}

      <section class="status-grid" aria-label="Project status">
        <div><span>Maturity</span><strong>${escapeHtml(labelize(project.status.maturity))}</strong></div>
        <div><span>Software</span><strong>${escapeHtml(labelize(project.status.software))}</strong></div>
        <div><span>Hardware</span><strong>${escapeHtml(labelize(project.status.hardware))}</strong></div>
        <div><span>Documentation</span><strong>${escapeHtml(labelize(project.status.documentation))}</strong></div>
        <div><span>GMB</span><strong>${escapeHtml(labelize(project.status.gmb))}</strong></div>
      </section>

      <section class="detail-section">
        <p class="eyebrow">Build overview</p>
        <h2>What you can build</h2>
        <div class="detail-grid">
          <section class="detail-card"><h3>Supported instruments</h3><ul>${list(project.supportedInstruments)}</ul></section>
          <section class="detail-card"><h3>Controller boards</h3><ul>${list(project.controller.boardIds)}</ul></section>
          <section class="detail-card"><h3>Manufacturing</h3><ul>${list(manufacture, 'No required manufacturing method documented')}</ul></section>
          <section class="detail-card"><h3>Build difficulty</h3><p>${escapeHtml(project.build.difficulty ? labelize(project.build.difficulty) : 'Unknown')}</p><ul>${list(project.build.tools, 'Required tools not documented')}</ul></section>
        </div>
      </section>

      <section class="detail-section">
        <p class="eyebrow">How it works</p>
        <h2>Mechanical system</h2>
        <p class="section-lede">${escapeHtml(project.mechanics.summary ?? 'Mechanical principle not documented yet.')}</p>
        <div class="fact-strip">
          <div><span>Axes</span><strong>${project.mechanics.axes === null ? 'Unknown' : project.mechanics.axes}</strong></div>
          <div><span>Calibration</span><strong>${yesNo(project.mechanics.calibrationRequired)}</strong></div>
          <div><span>Homing</span><strong>${yesNo(project.mechanics.homingRequired)}</strong></div>
        </div>
        ${project.mechanics.notes.length ? `<ul>${project.mechanics.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul>` : ''}
      </section>

      <section class="two-column-section">
        <div class="detail-section">
          <p class="eyebrow">Actuation</p><h2>Actuators</h2>${actuatorRows(project)}
        </div>
        <div class="detail-section">
          <p class="eyebrow">Electronics</p><h2>Drivers & sensors</h2>
          <h3>Drivers</h3><ul>${list(project.drivers)}</ul>
          <h3>Sensors</h3><ul>${list(project.sensors)}</ul>
        </div>
      </section>

      <section class="detail-section">
        <p class="eyebrow">Electrical</p><h2>Power</h2>${powerRows(project)}
      </section>

      <section class="two-column-section">
        <div class="detail-section">
          <p class="eyebrow">MIDI</p><h2>Connectivity & messages</h2>
          <div class="spec-list">${project.midi.transports.length ? project.midi.transports.map((transport) => `<div class="spec-row"><div><strong>${escapeHtml(labelize(transport.id))}</strong><span>${escapeHtml(labelize(transport.status))}</span></div><div>${escapeHtml(labelize(transport.direction))}</div></div>`).join('') : '<p class="muted">No MIDI transport documented.</p>'}</div>
          <h3>Messages</h3><ul>${list(project.midi.messages)}</ul>
        </div>
        <div class="detail-section">
          <p class="eyebrow">Capabilities</p><h2>Musical limits</h2>
          <div class="fact-strip fact-strip--compact">
            <div><span>MIDI range</span><strong>${escapeHtml(range)}</strong></div>
            <div><span>Polyphony</span><strong>${project.capabilities.polyphony ?? 'Unknown'}</strong></div>
            <div><span>Velocity</span><strong>${yesNo(project.capabilities.velocity)}</strong></div>
            <div><span>Aftertouch</span><strong>${yesNo(project.capabilities.aftertouch)}</strong></div>
            <div><span>Pitch bend</span><strong>${yesNo(project.capabilities.pitchBend)}</strong></div>
          </div>
          ${project.capabilities.supportedCC.length ? `<p><strong>CC:</strong> ${project.capabilities.supportedCC.join(', ')}</p>` : ''}
        </div>
      </section>

      <section class="detail-section gmb-panel">
        <p class="eyebrow">General MIDI Boop</p>
        <h2>${escapeHtml(gmbLabel)}</h2>
        <div class="fact-strip fact-strip--compact">
          <div><span>Discovery</span><strong>${yesNo(project.gmb.automaticDiscovery)}</strong></div>
          <div><span>Descriptor</span><strong>${yesNo(project.gmb.capabilityDescriptor)}</strong></div>
          <div><span>Change notification</span><strong>${yesNo(project.gmb.changeNotification)}</strong></div>
        </div>
        ${project.gmb.notes.length ? `<ul>${project.gmb.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul>` : ''}
      </section>

      <section class="two-column-section">
        <div class="detail-section">
          <p class="eyebrow">Firmware</p><h2>Build & flash</h2>
          <p><strong>Source available:</strong> ${project.firmware.available ? 'Yes' : 'No'}</p>
          <p><strong>Build systems:</strong> ${escapeHtml(buildSystems)}</p>
          <p><strong>Browser flashing:</strong> ${project.flash.supported ? 'Supported' : 'Not published yet'}</p>
        </div>
        <div class="detail-section">
          <p class="eyebrow">Files</p><h2>Resources & documentation</h2>${resourceLinks(project)}
        </div>
      </section>

      <section class="detail-section">
        <p class="eyebrow">Project lineage</p><h2>Related projects</h2>
        <dl class="relations-grid">
          <div><dt>Replaces</dt><dd>${relationLinks(project.relations.replaces)}</dd></div>
          <div><dt>Replaced by</dt><dd>${relationLinks(project.relations.replacedBy)}</dd></div>
          <div><dt>Related</dt><dd>${relationLinks(project.relations.related)}</dd></div>
        </dl>
      </section>
    </article>
  `;
}
