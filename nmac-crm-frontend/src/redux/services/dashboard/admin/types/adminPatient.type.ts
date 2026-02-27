export interface Agent {
    id: string;
    name: string;
}
export interface Patient {
    id: string;
    name: string;
    phone: string;
    last_visit_type: string;
    last_visit_date: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    assignedTo: string;
    status: 'assigned' | 'unassigned';
    agent: Agent;
}

export interface AdminSummary {
    total_patients: number;
    assigned_patients: number;
    unassigned_patients: number;
    patients: Patient[];
}