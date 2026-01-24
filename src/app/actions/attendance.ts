'use server'

import { createClient } from '@/infrastructure/supabase/server'
import { cookies } from 'next/headers'
import { AttendanceStatus } from '@/domain/entities/Mass'
import { revalidatePath } from 'next/cache'

export async function updateAttendance(assignmentId: string, status: AttendanceStatus) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
        .from('assignments')
        .update({ attendance_status: status })
        .eq('id', assignmentId)

    if (error) {
        console.error('Error updating attendance:', error)
        throw new Error('Failed to update attendance')
    }

    revalidatePath('/asistencia')
}
