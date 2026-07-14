import { UE } from './ue';

export interface Grade {
  id?: number;
  studentId?: number;
  ueCode?: string;
  ue?: UE;
  valeur: number;
}
