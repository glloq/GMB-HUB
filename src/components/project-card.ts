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
    ? `<div class="project-card__media"><img src="${escapeHtml(project.media.thumbnail)}" alt="" loading="lazy" decoding="async"></div>`
    : `<div class="project-card__media project-card__media--placeholder" aria-hidden="true"><span>${escapeHtml(project.name.slice(0, 2).toUpperCase())}</span></div>`;
  const family = project.families[0] ?? 'generic';

  return `
    <a class="project-card" data-family="${escapeHtml(family)}" data-gmb="${escapeHtml(project.gmb.state)}" href="#/projects/${encodeURIComponent(project.id)}" aria-label="Open ${escapeHtml(project.name)}">
      ${thumbnail}
      <div class="project-card__body">
        <div class="project-card__heading">
          <h2>${escapeHtml(project.name)}</h2>
          <span class="badge badge--gmb">${escapeHtml(gmb)}</span>
        </div>
        <p class="project-card__summary">${escapeHtml(project.summary)}</p>
        <div class="project-card__capabilities" aria-label="Hardware and MIDI">
          <div class="capability-chips">${renderBoardBadges(project.controller.boardIds, true)}</div>
          <div class="capability-chips">${renderMidiInputBadges(project.midi.transports, true)}</div>
        </div>
        <div class="project-card__footer">
          <span>${escapeHtml(labelize(family))}</span>
          <span>${escapeHtml(labelize(project.status.maturity))}</span>
        </div>
      </div>
    </a>
  `;
}
