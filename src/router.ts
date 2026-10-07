import { renderFlashPage } from './pages/flash';
import { renderGmbPage } from './pages/gmb';
import { renderHomePage } from './pages/home';
import { renderInstrumentsPage } from './pages/instruments';
import { renderProjectPage } from './pages/project';

type Renderer = (outlet: HTMLElement, params?: Record<string, string>) => void;

const routes: Array<{ pattern: RegExp; render: Renderer; keys?: string[] }> = [
  { pattern: /^#\/?$/, render: renderHomePage },
  { pattern: /^#\/gmb\/?$/, render: renderGmbPage },
  { pattern: /^#\/projects\/general-midi-boop\/?$/, render: renderGmbPage },
  { pattern: /^#\/instruments(?:\?[^#]*)?\/?$/, render: renderInstrumentsPage },
  { pattern: /^#\/instruments\/([^/?]+)\/?$/, render: renderProjectPage, keys: ['id'] },
  { pattern: /^#\/projects\/([^/?]+)\/?$/, render: renderProjectPage, keys: ['id'] },
  { pattern: /^#\/flash\/?$/, render: renderFlashPage },
];

export function renderRoute(outlet: HTMLElement | null, hash: string): void {
  if (!outlet) return;
  const normalized = hash || '#/';

  for (const route of routes) {
    const match = normalized.match(route.pattern);
    if (!match) continue;
    const params = Object.fromEntries((route.keys ?? []).map((key, index) => [key, decodeURIComponent(match[index + 1] ?? '')]));
    route.render(outlet, params);
    outlet.focus({ preventScroll: true });
    return;
  }

  outlet.innerHTML = '<section class="empty-state"><p class="eyebrow">404</p><h1>Page not found</h1><a href="#/">Return home</a></section>';
}
