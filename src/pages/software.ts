import { renderProjectCard } from '../components/project-card';
import { listProjects } from '../services/catalog';

export function renderSoftwarePage(outlet: HTMLElement): void {
  const projects = listProjects();
  const software = projects.filter((project) => project.type === 'software' && project.id !== 'general-midi-boop');
  const controllers = projects.filter((project) => project.type === 'controller');

  outlet.innerHTML = `
    <section class="page-intro">
      <p class="eyebrow">GMB ecosystem</p>
      <h1>Orchestration software & generic controllers</h1>
      <p>General MIDI Boop is the central control layer of the ecosystem. Generic controllers then make it possible to connect new mechanical instrument designs to the same orchestration model.</p>
    </section>

    <section class="gmb-software-feature">
      <div>
        <p class="eyebrow">Central system</p>
        <h2>General MIDI Boop</h2>
        <p>Discover instruments, resolve capabilities, assign and adapt musical parts, route MIDI, play live, build loops and arrangements, edit MIDI, transcribe audio and synchronize lighting from one local Raspberry Pi interface.</p>
      </div>
      <div class="gmb-software-feature__actions">
        <a class="button" href="#/gmb">Explore the complete GMB system</a>
        <a class="button button--secondary" href="https://github.com/glloq/General-Midi-Boop" target="_blank" rel="noreferrer">Repository</a>
      </div>
    </section>

    ${software.length > 0 ? `<section class="section-block"><div class="section-heading"><h2>Other software</h2></div><div class="project-grid project-grid--compact">${software.map(renderProjectCard).join('')}</div></section>` : ''}
    <section class="section-block"><div class="section-heading"><div><p class="eyebrow">Extend the orchestra</p><h2>Generic instrument controllers</h2></div></div><div class="project-grid project-grid--compact">${controllers.map(renderProjectCard).join('')}</div></section>
  `;
}
