'use server'

import { createClient } from '@/infrastructure/supabase/server'
import { cookies } from 'next/headers'
import { User } from '@/domain/entities/User'
import { revalidatePath } from 'next/cache'

export async function getAcolytes(search?: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    let query = supabase
        .from('users')
        .select('*')
        // .eq('role', 'acolito') // Showing all roles now that we can edit them
        .order('full_name', { ascending: true })

    if (search) {
        query = query.ilike('full_name', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching acolytes:', error)
        return []
    }

    return data as User[]
}

export async function createAcolyte(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const birth_date = formData.get('birth_date') as string
    const limitationsStr = formData.get('limitations') as string

    // Insert into public.users.
    const { error } = await supabase
        .from('users')
        .insert([
            {
                full_name,
                phone,
                role: 'acolito',
                birth_date: birth_date || null,
                limitations: limitationsStr ? JSON.parse(limitationsStr) : undefined
            }
        ])

    if (error) {
        console.error('Error creating acolyte:', error)
        throw new Error('Failed to create acolyte')
    }

    revalidatePath('/dashboard/acolitos')
}

export async function updateAcolyte(id: string, formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const role = formData.get('role') as string
    const birth_date = formData.get('birth_date') as string
    const limitationsStr = formData.get('limitations') as string

    const updates: any = {
        full_name,
        phone,
        role,
    }

    if (birth_date) updates.birth_date = birth_date
    if (limitationsStr) updates.limitations = JSON.parse(limitationsStr)

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()

    if (error) {
        console.error('Error updating acolyte:', error)
        throw new Error('Failed to update acolyte')
    }

    if (!data || data.length === 0) {
        console.warn('Update operation returned no data. Check if ID exists or RLS policies.', id)
    }

    revalidatePath('/dashboard/acolitos')
}

export async function deleteAcolyte(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting acolyte:', error)
        throw new Error('Failed to delete acolyte')
    }

    revalidatePath('/dashboard/acolitos')
}
