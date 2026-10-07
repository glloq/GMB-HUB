import type { ProjectSummary } from '../models/project';
import { escapeHtml, labelize } from '../utils/html';
import { renderBoardBadges, renderMidiInputBadges } from './capability-badges';

export function renderProjectCard(project: ProjectSummary): string {
  const gmb = project.gmb.state === 'native'
    ? `GMB${project.gmb.protocolVersion ? ` v${project.gmb.protocolVersion}` : ''}`
    : project.gmb.state === 'planned'
      ? 'GMB planned'
      : project.gmb.state === 'none'
        ? 'Standalone'
        : `GMB ${labelize(project.gmb.state)}`;
  const thumbnail = project.media.thumbnail
    ? `<div class="project-card__media"><img src="${escapeHtml(project.media.thumbnail)}" alt="${escapeHtml(project.name)}" loading="lazy" decoding="async"></div>`
    : `<div class="project-card__media project-card__media--placeholder" aria-hidden="true"><span>${escapeHtml(project.name.slice(0, 2).toUpperCase())}</span></div>`;

  return `
    <article class="project-card">
      <a class="project-card__media-link" href="#/projects/${encodeURIComponent(project.id)}" aria-label="Open ${escapeHtml(project.name)}">
        ${thumbnail}
      </a>
      <div class="project-card__body">
        <div class="project-card__heading">
          <h2><a href="#/projects/${encodeURIComponent(project.id)}">${escapeHtml(project.name)}</a></h2>
          <span class="badge badge--gmb">${escapeHtml(gmb)}</span>
        </div>
        <p class="project-card__summary">${escapeHtml(project.summary)}</p>
        <div class="project-card__capabilities">
          <span class="capability-group__label">HW</span>
          <div class="capability-chips">${renderBoardBadges(project.controller.boardIds, true)}</div>
          <span class="capability-group__label">MIDI</span>
          <div class="capability-chips">${renderMidiInputBadges(project.midi.transports, true)}</div>
        </div>
        <div class="project-card__footer">
          <span class="project-card__status">${escapeHtml(labelize(project.status.maturity))}</span>
          <a class="project-card__repo" href="${escapeHtml(project.repository.url)}" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </div>
    </article>
  `;
}
