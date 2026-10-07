import type { ProjectSummary } from '../models/project';

const projectModules = import.meta.glob('../../data/projects/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, ProjectSummary>;

export function listProjects(): ProjectSummary[] {
  return Object.values(projectModules).sort((a, b) => a.name.localeCompare(b.name));
}

export function findProject(id: string): ProjectSummary | undefined {
  return listProjects().find((project) => project.id === id);
}
