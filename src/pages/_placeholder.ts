export function renderPlaceholder(outlet: HTMLElement, eyebrow: string, title: string, description: string): void {
  document.title = `${title} — GMB HUB`;
  outlet.innerHTML = `
    <section class="placeholder">
      <p class="eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      <p>${description}</p>
      <p class="stage-note">Skeleton only — implementation is scheduled for the next phase.</p>
    </section>
  `;
}
