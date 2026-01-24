import { IMassRepository } from '../../domain/repositories/interfaces';

export class RegisterAttendance {
    constructor(
        private massRepo: IMassRepository
    ) { }

    async execute(massId: string, acolyteId: string, status: 'presente' | 'ausente') {
        // Logic to update attendance
        // In real app, we update the assignment status
        console.log(`Marking attendance for ${acolyteId} at mass ${massId}: ${status}`);
        // await this.massRepo.updateAssignmentStatus(...)
    }
}
