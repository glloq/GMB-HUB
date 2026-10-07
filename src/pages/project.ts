import { renderPlaceholder } from './_placeholder';
export const renderProjectPage = (outlet: HTMLElement, params: Record<string, string> = {}) => renderPlaceholder(outlet, 'Project', params.id ?? 'Project', 'Generic project pages will be generated from data rather than project-specific code.');
