import { listProjects } from '../services/catalog';
import { escapeHtml, labelize } from '../utils/html';

export function renderFlashPage(outlet: HTMLElement): void {
  const candidates = listProjects().filter((project) =>
    project.firmware.available && project.controller.boardIds.some((board) => board.startsWith('esp32')),
  );
  const ready = candidates.filter((project) => project.flash.supported && project.flash.targets.length > 0);
  const webSerialAvailable = 'serial' in navigator;

  outlet.innerHTML = `
    <section class="page-intro">
      <p class="eyebrow">Browser firmware tools</p>
      <h1>ESP32 Web Flasher</h1>
      <p>GMB HUB will flash supported ESP32 firmware directly from this static GitHub Pages site. No backend or local daemon is required. A project is only marked flashable after versioned binaries, offsets and checksums are published.</p>
    </section>

    <section class="flash-readiness ${webSerialAvailable ? 'flash-readiness--ok' : 'flash-readiness--warning'}">
      <div>
        <p class="eyebrow">Browser capability</p>
        <h2>${webSerialAvailable ? 'Web Serial detected' : 'Web Serial not detected'}</h2>
        <p>${webSerialAvailable
          ? 'This browser exposes the API required for a future direct ESP32 connection.'
          : 'This browser does not currently expose Web Serial to GMB HUB. Firmware downloads and documentation will remain usable.'}</p>
      </div>
      <div class="flash-readiness__metric"><strong>${ready.length}</strong><span>projects with published flash manifests</span></div>
    </section>

    <section class="section-block">
      <div class="section-heading"><div><p class="eyebrow">Firmware inventory</p><h2>ESP32 projects</h2></div></div>
      <div class="flash-project-list">
        ${candidates.length ? candidates.map((project) => {
          const targetBoards = project.controller.boardIds.filter((board) => board.startsWith('esp32')).map(labelize).join(' · ');
          const manifestState = project.flash.supported && project.flash.targets.length
            ? `${project.flash.targets.length} flash target${project.flash.targets.length === 1 ? '' : 's'} published`
            : 'Firmware source available · web manifest not published yet';
          return `
            <article class="flash-project-row">
              <div>
                <p class="eyebrow">${escapeHtml(project.gmb.state === 'native' ? 'GMB project' : 'ESP32 project')}</p>
                <h3><a href="#/projects/${encodeURIComponent(project.id)}">${escapeHtml(project.name)}</a></h3>
                <p>${escapeHtml(targetBoards || 'ESP32 target')}</p>
              </div>
              <div class="flash-project-row__state">
                <strong>${escapeHtml(manifestState)}</strong>
                <span>${project.flash.supported ? 'Ready for flasher integration' : 'Not yet web-flashable'}</span>
              </div>
            </article>
          `;
        }).join('') : '<div class="empty-state"><h2>No ESP32 firmware projects found</h2></div>'}
      </div>
    </section>

    <section class="detail-section">
      <p class="eyebrow">Publication gate</p>
      <h2>What is required before the Flash button appears</h2>
      <ol class="flash-checklist">
        <li>Build the exact supported board environment.</li>
        <li>Collect the real bootloader, partition, application and filesystem binaries when applicable.</li>
        <li>Record the actual flash offsets from that build instead of assuming universal addresses.</li>
        <li>Publish SHA-256 checksums and a versioned static manifest.</li>
        <li>Verify the target chip before writing.</li>
        <li>Only then enable direct browser flashing for that project/board pair.</li>
      </ol>
    </section>
  `;
}
