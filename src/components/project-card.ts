import type { ProjectSummary } from '../models/project';
import { escapeHtml, labelize } from '../utils/html';

export function renderProjectCard(project: ProjectSummary): string {
  const boards = project.controller.boardIds.map(labelize).join(' · ') || 'Board not documented';
  const gmb = project.gmb.state === 'native'
    ? `GMB${project.gmb.protocolVersion ? ` v${project.gmb.protocolVersion}` : ''}`
    : project.gmb.state === 'planned'
      ? 'GMB planned'
      : `GMB ${labelize(project.gmb.state)}`;

  return `
    <article class="project-card">
      <div class="project-card__meta">
        <span class="badge">${escapeHtml(labelize(project.type))}</span>
        <span class="badge badge--muted">${escapeHtml(labelize(project.status.maturity))}</span>
      </div>
      <h2>${escapeHtml(project.name)}</h2>
      <p>${escapeHtml(project.summary)}</p>
      <dl class="project-card__facts">
        <div><dt>Controller</dt><dd>${escapeHtml(boards)}</dd></div>
        <div><dt>GMB</dt><dd>${escapeHtml(gmb)}</dd></div>
      </dl>
      <a class="button button--secondary" href="#/projects/${encodeURIComponent(project.id)}">View project</a>
    </article>
  `;
}
