export type ProjectType = 'instrument' | 'controller' | 'software' | 'utility' | 'legacy' | 'archive';
export type Maturity = 'concept' | 'software-ready' | 'bench-ready' | 'hardware-tested' | 'validated' | 'legacy' | 'archived';
export type EvidenceStatus = 'unknown' | 'planned' | 'implemented' | 'tested' | 'not-tested' | 'partial' | 'documented';
export type GmbState = 'native' | 'partial' | 'planned' | 'legacy' | 'none' | 'unknown';
export type MidiCapabilityStatus = 'supported' | 'unsupported' | 'dynamic' | 'optional' | 'unknown';

export interface ProjectLink {
  kind: string;
  label: string;
  url: string;
  notes?: string | null;
}

export interface MidiTransport {
  id: string;
  status: 'unknown' | 'planned' | 'implemented' | 'experimental' | 'legacy' | 'unsupported';
  direction: 'input' | 'output' | 'bidirectional' | 'unknown';
  notes?: string | null;
}

export interface MidiMessageSupport {
  noteOn?: MidiCapabilityStatus;
  noteOff?: MidiCapabilityStatus;
  controlChange?: MidiCapabilityStatus;
  programChange?: MidiCapabilityStatus;
  pitchBend?: MidiCapabilityStatus;
  channelAftertouch?: MidiCapabilityStatus;
  polyAftertouch?: MidiCapabilityStatus;
  clock?: MidiCapabilityStatus;
  start?: MidiCapabilityStatus;
  continue?: MidiCapabilityStatus;
  stop?: MidiCapabilityStatus;
  systemReset?: MidiCapabilityStatus;
}

export interface MidiFeature {
  id: string;
  label: string;
  status: MidiCapabilityStatus;
  notes?: string | null;
}

export interface ActuatorSpec {
  typeId: string;
  quantity: number | null;
  role: string;
  driver?: string | null;
  notes?: string | null;
}

export interface ProjectSummary {
  id: string;
  name: string;
  shortName: string | null;
  type: ProjectType;
  summary: string;
  description: string | null;
  repository: {
    owner: string;
    name: string;
    url: string;
    visibility: 'public' | 'private' | 'unknown';
  };
  status: {
    maturity: Maturity;
    software: EvidenceStatus;
    hardware: EvidenceStatus;
    documentation: EvidenceStatus;
    gmb: EvidenceStatus;
  };
  families: string[];
  supportedInstruments: string[];
  controller: { boardIds: string[]; notes: string[] };
  midi: {
    transports: MidiTransport[];
    messages: string[];
    messageSupport?: MidiMessageSupport;
    features?: MidiFeature[];
  };
  gmb: {
    state: GmbState;
    protocolVersion: number | null;
    automaticDiscovery: boolean | null;
    capabilityDescriptor: boolean | null;
    changeNotification: boolean | null;
    notes: string[];
  };
  mechanics: {
    summary: string | null;
    axes: number | null;
    requires3dPrinting: boolean | null;
    requiresLaserCutting: boolean | null;
    requiresCnc: boolean | null;
    requiresWoodworking: boolean | null;
    calibrationRequired: boolean | null;
    homingRequired: boolean | null;
    notes: string[];
  };
  actuators: ActuatorSpec[];
  drivers: string[];
  sensors: string[];
  power: {
    supplies: Array<{ label: string; voltageV: number | null; currentA: number | null; notes?: string | null }>;
    notes: string[];
  };
  capabilities: {
    noteRange: { min: number; max: number } | null;
    polyphony: number | null;
    velocity: boolean | null;
    aftertouch: boolean | null;
    pitchBend: boolean | null;
    supportedCC: number[];
  };
  build: {
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
    estimatedCost: { currency: string; min: number | null; max: number | null; notes?: string | null } | null;
    estimatedBuildTimeHours: { min: number | null; max: number | null } | null;
    tools: string[];
  };
  resources: ProjectLink[];
  documentation: ProjectLink[];
  firmware: {
    available: boolean;
    buildSystems: string[];
    sourcePath: string | null;
    environments: string[];
  };
  flash: {
    supported: boolean;
    targets: Array<{
      id: string;
      boardId: string;
      chip: string;
      buildEnvironment: string | null;
      version: string | null;
      files: Array<{ path: string; address: string; sha256: string | null }>;
    }>;
  };
  postFlash: {
    localUrl: string | null;
    setupSsidPattern: string | null;
    steps: string[];
  };
  media: {
    thumbnail: string | null;
    images: Array<{ url: string; alt?: string | null; source?: string | null; provenance?: string | null }>;
    videos: Array<{ url: string; alt?: string | null; source?: string | null; provenance?: string | null }>;
  };
  relations: { replaces: string[]; replacedBy: string[]; related: string[] };
  license: string | null;
  warnings: string[];
}
