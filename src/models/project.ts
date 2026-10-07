export type ProjectType = 'instrument' | 'controller' | 'software' | 'utility' | 'legacy' | 'archive';
export type Maturity = 'concept' | 'software-ready' | 'bench-ready' | 'hardware-tested' | 'validated' | 'legacy' | 'archived';
export type EvidenceStatus = 'unknown' | 'planned' | 'implemented' | 'tested' | 'not-tested' | 'partial' | 'documented';

export interface ProjectSummary {
  id: string;
  name: string;
  type: ProjectType;
  summary: string;
  status: {
    maturity: Maturity;
    software: EvidenceStatus;
    hardware: EvidenceStatus;
    documentation: EvidenceStatus;
    gmb: EvidenceStatus;
  };
}
