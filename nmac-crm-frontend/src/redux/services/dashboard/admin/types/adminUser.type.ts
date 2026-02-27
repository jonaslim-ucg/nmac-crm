export type Role = 'AGENT' | 'MANAGER' | 'ADMIN';

export interface ApiUser {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  image: string | null;
  role: Role;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
  groups: {
    id: number;
    name: string;
  }[];
  patient_assigned: number | null;
  permissions: any[];
}
