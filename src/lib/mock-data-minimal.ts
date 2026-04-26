import * as Models from "./schema/models";

export const sectors: Models.SectorDefinition[] = [
  { id: 'cgp', name: 'Coordenação Geral e Administração', sigla: 'CGP', color: 'slate', icon: 'ShieldCheck', description: 'Gestão de recursos e contratos' },
];

export const taskTriggers: Models.TaskTrigger[] = [];
export const taskStatuses: Models.TaskStatus[] = [];
export const taskTypes: Models.TaskType[] = [];

export enum UserRole {
  COORDINATOR = 'coordinator',
}

export type User = {
  id: string;
  name: string;
  userRole: UserRole;
  permissions: any;
};

export const teamMembers: User[] = [];

export interface StrategicPlanMonth {
  id: string;
  monthName: string;
  sector: string;
  tasks: any[];
}

export const strategicPlanning: StrategicPlanMonth[] = [];
export const sectorActivities: any[] = [];
export const projectObjectives: any[] = [];
export const projectTasks: any[] = [];
export const news: any[] = [];
export const communityEvents: any[] = [];
export const fairs: any[] = [];
export const authoralMaterials: any[] = [];
export const projectUpdates: any[] = [];
export const bastidoresItems: any[] = [];
export const teamEvents: any[] = [];
export const librasOriginals: any[] = [];
export const librasShorts: any[] = [];
export const librasDocs: any[] = [];
export const librasGlossary: any[] = [];
export const scientificFragments: any[] = [];
