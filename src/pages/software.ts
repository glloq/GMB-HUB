import { renderProjectCard } from '../components/project-card';
import { listProjects } from '../services/catalog';

export function renderSoftwarePage(outlet: HTMLElement): void {
  const projects = listProjects();
  const software = projects.filter((project) => project.type === 'software');
  const controllers = projects.filter((project) => project.type === 'controller');

  outlet.innerHTML = `
    <section class="page-intro">
      <p class="eyebrow">GMB ecosystem</p>
      <h1>Core system & controllers</h1>
      <p>General MIDI Boop is the orchestra controller. Generic controllers extend the same ecosystem to new mechanical instruments.</p>
    </section>
    <section class="section-block"><div class="section-heading"><h2>GMB core</h2></div><div class="project-grid project-grid--compact">${software.map(renderProjectCard).join('')}</div></section>
    <section class="section-block"><div class="section-heading"><h2>Generic instrument controllers</h2></div><div class="project-grid project-grid--compact">${controllers.map(renderProjectCard).join('')}</div></section>
  `;
}
