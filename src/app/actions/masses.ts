'use server'

import { createClient } from '@/infrastructure/supabase/server'
import { cookies } from 'next/headers'
import { Mass } from '@/domain/entities/Mass'
import { revalidatePath } from 'next/cache'

export async function getMasses() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
        .from('masses')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true })

    if (error) {
        console.error('Error fetching masses:', error)
        return []
    }

    return data as Mass[]
}

export async function createMass(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const type = formData.get('type') as string

    const { error } = await supabase
        .from('masses')
        .insert([
            { date, time, type }
        ])

    if (error) {
        console.error('Error creating mass:', error)
        throw new Error('Failed to create mass')
    }

    revalidatePath('/dashboard/horarios')
}

export async function deleteMass(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
        .from('masses')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting mass:', error)
        throw new Error('Failed to delete mass')
    }

    revalidatePath('/dashboard/horarios')
}
