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

type Theme = 'system' | 'light' | 'dark';
const themeOrder: Theme[] = ['system', 'light', 'dark'];

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem('gmb-hub-theme');
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
}

function applyTheme(theme: Theme): void {
  if (theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  try {
    if (theme === 'system') localStorage.removeItem('gmb-hub-theme');
    else localStorage.setItem('gmb-hub-theme', theme);
  } catch {
    // Local storage can be unavailable in hardened/private browser contexts.
  }
}

export function mountApp(root: HTMLDivElement | null): void {
  if (!root) throw new Error('Missing #app root element');

  let theme = readTheme();
  applyTheme(theme);

  root.innerHTML = `
    <header class="site-header">
      <a class="brand" href="#/" aria-label="GMB HUB home">GMB HUB</a>
      <div class="header-actions">
        <nav aria-label="Primary navigation">
          ${navItems.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
        </nav>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Change color theme">Theme: ${theme}</button>
      </div>
    </header>
    <main id="main-content" class="page-shell" tabindex="-1"></main>
    <footer class="site-footer">Static by design · GitHub Pages · No backend</footer>
  `;

  const themeToggle = root.querySelector<HTMLButtonElement>('#theme-toggle');
  themeToggle?.addEventListener('click', () => {
    theme = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length] ?? 'system';
    applyTheme(theme);
    themeToggle.textContent = `Theme: ${theme}`;
  });

  const outlet = root.querySelector<HTMLElement>('#main-content');
  const refresh = () => renderRoute(outlet, window.location.hash);
  window.addEventListener('hashchange', refresh);
  refresh();
}
