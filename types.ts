// ENUMS & TYPES 

export const Priority = {
  STAT: "STAT",
  URGENT: "URGENT",
  ROUTINE: "ROUTINE"
} as const;

export type PriorityType = (typeof Priority)[keyof typeof Priority];

export type SampleType = "BLOOD" | "URINE" | "TISSUE";
export type Speciality = SampleType | "GENERAL";

// --- INPUT ---

export interface LabData {
  samples: Sample[];
  technicians: Technician[];
  equipment: Equipment[];
}

export interface Sample {
  id: string;
  type: SampleType;
  priority: PriorityType;
  analysisTime: number;
  arrivalTime: string;
  patientId: string;
}

export interface Technician {
  id: string;
  name: string;
  speciality: Speciality;
  startTime: string;
  endTime: string;
}

export  interface Equipment {
  id: string;
  name: string;
  type: SampleType;
  available: boolean;
}

// --- OUTPUT ---

export interface ScheduleEntry {
  sampleId: string;
  technicianId: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  priority: PriorityType;
}

export interface Metrics {
  totalTime: number;
  efficiency: number;
  conflicts: number;
}

// --- FUNCTION ---

export interface PlanningResult {
  schedule: ScheduleEntry[];
  metrics: Metrics;
}


