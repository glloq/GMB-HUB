import { describe, expect, it } from 'vitest';
import type { ProjectSummary } from '../models/project';
import { passesBuildRequirements, scoreBuildProject, type BuildPreferences } from './build-recommendations';

function project(overrides: Partial<ProjectSummary> = {}): ProjectSummary {
  const base: ProjectSummary = {
    id: 'test-project',
    name: 'Test Project',
    shortName: null,
    type: 'instrument',
    summary: 'Test project',
    description: null,
    repository: { owner: 'glloq', name: 'test', url: 'https://github.com/glloq/test', visibility: 'public' },
    status: { maturity: 'bench-ready', software: 'tested', hardware: 'not-tested', documentation: 'documented', gmb: 'implemented' },
    families: ['wind'],
    supportedInstruments: ['flute'],
    controller: { boardIds: ['esp32-s3'], notes: [] },
    midi: { transports: [], messages: [] },
    gmb: { state: 'native', protocolVersion: 2, automaticDiscovery: true, capabilityDescriptor: true, changeNotification: true, notes: [] },
    mechanics: { summary: null, axes: null, requires3dPrinting: null, requiresLaserCutting: null, requiresCnc: null, requiresWoodworking: null, calibrationRequired: true, homingRequired: false, notes: [] },
    actuators: [{ typeId: 'servo', quantity: 1, role: 'Actuation' }],
    drivers: [],
    sensors: [],
    power: { supplies: [], notes: [] },
    capabilities: { noteRange: null, polyphony: 1, velocity: true, aftertouch: false, pitchBend: false, supportedCC: [] },
    build: { difficulty: null, estimatedCost: null, estimatedBuildTimeHours: null, tools: [] },
    resources: [],
    documentation: [],
    firmware: { available: true, buildSystems: ['PlatformIO'], sourcePath: '.', environments: [] },
    flash: { supported: false, targets: [] },
    postFlash: { localUrl: null, setupSsidPattern: null, steps: [] },
    media: { thumbnail: null, images: [], videos: [] },
    relations: { replaces: [], replacedBy: [], related: [] },
    license: null,
    warnings: [],
  };
  return { ...base, ...overrides };
}

const defaults: BuildPreferences = {
  family: '',
  board: '',
  actuator: '',
  preferNativeGmb: false,
  preferModern: true,
  requireHardwareEvidence: false,
};

describe('build recommendation rules', () => {
  it('treats selected family as a hard requirement', () => {
    expect(passesBuildRequirements(project(), { ...defaults, family: 'wind' })).toBe(true);
    expect(passesBuildRequirements(project(), { ...defaults, family: 'percussion' })).toBe(false);
  });

  it('requires physical evidence when requested', () => {
    expect(passesBuildRequirements(project(), { ...defaults, requireHardwareEvidence: true })).toBe(false);
    const tested = project({ status: { maturity: 'validated', software: 'tested', hardware: 'tested', documentation: 'documented', gmb: 'implemented' } });
    expect(passesBuildRequirements(tested, { ...defaults, requireHardwareEvidence: true })).toBe(true);
  });

  it('ranks matching board, actuator and native GMB higher', () => {
    const preferred = { ...defaults, board: 'esp32-s3', actuator: 'servo', preferNativeGmb: true };
    const matching = scoreBuildProject(project(), preferred);
    const legacy = project({ type: 'legacy', controller: { boardIds: ['arduino-leonardo'], notes: [] }, actuators: [{ typeId: 'solenoid', quantity: 1, role: 'Actuation' }], gmb: { state: 'none', protocolVersion: null, automaticDiscovery: false, capabilityDescriptor: false, changeNotification: false, notes: [] } });
    expect(matching).toBeGreaterThan(scoreBuildProject(legacy, preferred));
  });
});
