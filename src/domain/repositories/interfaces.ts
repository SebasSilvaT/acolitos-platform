import { User } from '../entities/User';
import { Mass } from '../entities/Mass';

export interface IUserRepository {
    getById(id: string): Promise<User | null>;
    getAllByRole(role: string): Promise<User[]>;
    update(user: Partial<User>): Promise<User>;
}

export interface IMassRepository {
    getUpcoming(limit?: number): Promise<Mass[]>;
    create(mass: Omit<Mass, 'id' | 'assignments'>): Promise<Mass>;
    assignAcolyte(massId: string, acolyteId: string): Promise<void>;
}
