export type ProjectType = 'instrument' | 'controller' | 'software' | 'utility' | 'legacy' | 'archive';
export type Maturity = 'concept' | 'software-ready' | 'bench-ready' | 'hardware-tested' | 'validated' | 'legacy' | 'archived';
export type EvidenceStatus = 'unknown' | 'planned' | 'implemented' | 'tested' | 'not-tested' | 'partial' | 'documented';
export type GmbState = 'native' | 'partial' | 'planned' | 'legacy' | 'none' | 'unknown';

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
  gmb: {
    state: GmbState;
    protocolVersion: number | null;
    automaticDiscovery: boolean | null;
    capabilityDescriptor: boolean | null;
    changeNotification: boolean | null;
    notes: string[];
  };
  relations: { replaces: string[]; replacedBy: string[]; related: string[] };
}
