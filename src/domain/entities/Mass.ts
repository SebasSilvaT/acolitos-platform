export type MassType = 'diaria' | 'dominical' | 'central' | 'especial';
export type AssignmentStatus = 'pendiente' | 'confirmado' | 'rechazado';
export type AttendanceStatus = 'pendiente' | 'presente' | 'ausente' | 'justificado';

export interface Mass {
    id: string;
    date: Date;
    time: string; // HH:mm:ss
    type: MassType;
    assignments?: Assignment[];
}

export interface Assignment {
    id: string;
    mass_id: string;
    acolyte_id: string;
    status: AssignmentStatus;
    attendance_status: AttendanceStatus;
    acolyte?: {
        full_name: string;
    };
}
