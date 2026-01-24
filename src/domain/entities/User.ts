export type Role = 'admin' | 'maestro' | 'acolito';

export interface User {
    id: string;
    full_name: string;
    role: Role;
    phone?: string;
    birth_date?: string; // ISO date string
    limitations?: AcolyteLimitations;
    created_at: Date;
    availability?: Availability[];
}

export interface AcolyteLimitations {
    days: string[]; // e.g. ["monday", "tuesday"] or ["all_week"]
    sunday_times: string[]; // e.g. ["08:00", "10:00"]
}

export interface Availability {
    id: string;
    user_id: string;
    day_of_week: number; // 0=Sunday
    start_time: string; // HH:mm:ss
    end_time: string;   // HH:mm:ss
    is_unavailable: boolean;
}
