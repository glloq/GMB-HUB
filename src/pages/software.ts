import { renderProjectCard } from '../components/project-card';
import { listProjects } from '../services/catalog';

export function renderSoftwarePage(outlet: HTMLElement): void {
  const projects = listProjects();
  const software = projects.filter((project) => project.type === 'software');
  const controllers = projects.filter((project) => project.type === 'controller');

  outlet.innerHTML = `
    <section class="page-intro">
      <p class="eyebrow">Ecosystem</p>
      <h1>Software & generic controllers</h1>
      <p>General MIDI Boop orchestrates the ensemble. Generic controllers such as PlayMode let builders create new mechanical instruments without maintaining a dedicated firmware for every simple actuator layout.</p>
    </section>
    <section class="section-block"><div class="section-heading"><h2>Software</h2></div><div class="project-grid">${software.map(renderProjectCard).join('')}</div></section>
    <section class="section-block"><div class="section-heading"><h2>Generic controllers</h2></div><div class="project-grid">${controllers.map(renderProjectCard).join('')}</div></section>
  `;
}
