import audit from '../../data/midi-capabilities.json';
import type { MidiCapabilityStatus, MidiFeature, MidiMessageSupport } from '../models/project';

export interface MidiCapabilityAuditEntry {
  messageSupport: MidiMessageSupport;
  supportedCC: number[];
  features: MidiFeature[];
  notes: string[];
}

interface MidiCapabilityAuditFile {
  auditDate: string;
  method: string;
  projects: Record<string, MidiCapabilityAuditEntry>;
}

const capabilityAudit = audit as MidiCapabilityAuditFile;

export function getMidiCapabilityAudit(projectId: string): MidiCapabilityAuditEntry | undefined {
  return capabilityAudit.projects[projectId];
}

export function getMidiCapabilityAuditDate(): string {
  return capabilityAudit.auditDate;
}

export function midiCapabilityLabel(status: MidiCapabilityStatus): string {
  switch (status) {
    case 'supported': return 'Supported';
    case 'unsupported': return 'Unsupported';
    case 'dynamic': return 'Dynamic';
    case 'optional': return 'Optional';
    case 'unknown': return 'Unknown';
  }
}
