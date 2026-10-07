import type { ProjectSummary } from '../models/project';
import { escapeHtml, labelize } from '../utils/html';
import { renderBoardBadges, renderMidiInputBadges } from './capability-badges';

export function renderProjectCard(project: ProjectSummary): string {
  const gmb = project.gmb.state === 'native'
    ? `GMB${project.gmb.protocolVersion ? ` v${project.gmb.protocolVersion}` : ''}`
    : project.gmb.state === 'planned'
      ? 'GMB planned'
      : `GMB ${labelize(project.gmb.state)}`;
  const thumbnail = project.media.thumbnail
    ? `<div class="project-card__media"><img src="${escapeHtml(project.media.thumbnail)}" alt="${escapeHtml(project.name)}" loading="lazy" decoding="async"></div>`
    : `<div class="project-card__media project-card__media--placeholder" aria-hidden="true"><span>${escapeHtml(project.name.slice(0, 2).toUpperCase())}</span></div>`;

  return `
    <article class="project-card">
      ${thumbnail}
      <div class="project-card__body">
        <div class="project-card__meta">
          <span class="badge">${escapeHtml(labelize(project.type))}</span>
          <span class="badge badge--muted">${escapeHtml(labelize(project.status.maturity))}</span>
          <span class="badge badge--gmb">${escapeHtml(gmb)}</span>
        </div>
        <h2>${escapeHtml(project.name)}</h2>
        <p class="project-card__summary">${escapeHtml(project.summary)}</p>
        <div class="project-card__capabilities">
          <div class="capability-group capability-group--compact">
            <span class="capability-group__label">Boards</span>
            <div class="capability-chips">${renderBoardBadges(project.controller.boardIds, true)}</div>
          </div>
          <div class="capability-group capability-group--compact">
            <span class="capability-group__label">MIDI in</span>
            <div class="capability-chips">${renderMidiInputBadges(project.midi.transports, true)}</div>
          </div>
        </div>
        <a class="button button--secondary project-card__action" href="#/projects/${encodeURIComponent(project.id)}">View project</a>
      </div>
    </article>
  `;
}
