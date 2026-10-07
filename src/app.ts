import { renderRoute } from './router';

const navItems = [
  ['Home', '#/'],
  ['Instruments', '#/instruments'],
  ['Software', '#/software'],
  ['Build', '#/build'],
  ['Compare', '#/compare'],
  ['Flash', '#/flash'],
  ['About', '#/about'],
] as const;

export function mountApp(root: HTMLDivElement | null): void {
  if (!root) throw new Error('Missing #app root element');

  root.innerHTML = `
    <header class="site-header">
      <a class="brand" href="#/" aria-label="GMB HUB home">GMB HUB</a>
      <nav aria-label="Primary navigation">
        ${navItems.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
      </nav>
    </header>
    <main id="main-content" class="page-shell" tabindex="-1"></main>
    <footer class="site-footer">Static by design · GitHub Pages · No backend</footer>
  `;

  const outlet = root.querySelector<HTMLElement>('#main-content');
  const refresh = () => renderRoute(outlet, window.location.hash);
  window.addEventListener('hashchange', refresh);
  refresh();
}
