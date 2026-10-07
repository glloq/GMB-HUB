import type { ProjectSummary } from '../models/project';

export interface BuildPreferences {
  family: string;
  board: string;
  actuator: string;
  preferNativeGmb: boolean;
  preferModern: boolean;
  requireHardwareEvidence: boolean;
}

export function passesBuildRequirements(project: ProjectSummary, preferences: BuildPreferences): boolean {
  if (preferences.family && !project.families.includes(preferences.family)) return false;
  if (preferences.requireHardwareEvidence && !['tested', 'partial'].includes(project.status.hardware)) return false;
  return true;
}

export function scoreBuildProject(project: ProjectSummary, preferences: BuildPreferences): number {
  let score = 0;
  if (preferences.board && project.controller.boardIds.includes(preferences.board)) score += 8;
  if (preferences.actuator && project.actuators.some((item) => item.typeId === preferences.actuator)) score += 8;
  if (preferences.preferNativeGmb) score += project.gmb.state === 'native' ? 10 : project.gmb.state === 'planned' ? 1 : 0;
  if (preferences.preferModern && project.type === 'instrument') score += 6;
  if (project.status.maturity === 'validated') score += 4;
  if (project.status.maturity === 'hardware-tested') score += 3;
  if (project.status.maturity === 'bench-ready') score += 2;
  if (project.status.documentation === 'documented') score += 1;
  return score;
}
