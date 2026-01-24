'use server'

import { createClient } from '@/infrastructure/supabase/server'
import { cookies } from 'next/headers'
import { Mass } from '@/domain/entities/Mass'
import { User } from '@/domain/entities/User'
import { revalidatePath } from 'next/cache'
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns'

export interface MassWithAssignments extends Omit<Mass, 'assignments' | 'date'> {
    date: string // Supabase returns string
    assignments: {
        id: string
        user: User
        status: string
        attendance_status: string
    }[]
}


export async function getWeeklySchedule(date: Date) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
    const end = endOfWeek(date, { weekStartsOn: 1 })

    const startDateStr = format(start, 'yyyy-MM-dd')
    const endDateStr = format(end, 'yyyy-MM-dd')

    // 1. Fetch masses
    const { data: masses, error: massesError } = await supabase
        .from('masses')
        .select('*')
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

    if (massesError) {
        console.error('Error fetching masses:', massesError)
        return []
    }

    if (!masses || masses.length === 0) return []

    const massIds = masses.map(m => m.id)

    // 2. Fetch assignments
    const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*, user:users(*)')
        .in('mass_id', massIds)

    if (assignmentsError) {
        // If the table doesn't exist, this error will happen
        console.error('Error fetching assignments:', assignmentsError)
        // Return without assignments gracefully to avoid crashing page
        return masses.map(m => ({
            ...m,
            assignments: []
        })) as MassWithAssignments[]
    }

    // 3. Combine
    const schedule: MassWithAssignments[] = masses.map(m => ({
        ...m,
        assignments: assignments
            .filter(a => a.mass_id === m.id)
            .map(a => ({
                id: a.id,
                user: a.user,
                status: a.status,
                attendance_status: a.attendance_status
            }))
    }))

    return schedule
}

export async function saveScheduleAssignment(massId: string, userIds: string[]) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // 1. Remove existing assignments for this mass
    const { error: deleteError } = await supabase
        .from('assignments')
        .delete()
        .eq('mass_id', massId)

    if (deleteError) {
        throw new Error('Failed to clear existing assignments')
    }

    if (userIds.length === 0) {
        revalidatePath('/dashboard/horarios')
        return
    }

    // 2. Insert new assignments
    const toInsert = userIds.map(uid => ({
        mass_id: massId,
        user_id: uid
    }))

    const { error: insertError } = await supabase
        .from('assignments')
        .insert(toInsert)

    if (insertError) {
        console.error('Insert error', insertError)
        throw new Error('Failed to save assignments')
    }

    revalidatePath('/dashboard/horarios')
}

export async function generateRandomScheduleAction(
    startDateStr: string,
    includeCentralRandom: boolean,
    centralTime?: string // only if not random
) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // 1. Fetch data
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'acolito')

    if (usersError || !users) throw new Error('Failed to fetch users')

    const date = new Date(startDateStr)
    const start = startOfWeek(date, { weekStartsOn: 1 })
    const end = endOfWeek(date, { weekStartsOn: 1 })

    // Fetch masses WITH timezone safety in mind
    // UTC dates vs local dates in DB can be tricky. We use YYYY-MM-DD comparision
    let { data: masses } = await supabase
        .from('masses')
        .select('*')
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'))

    // Auto-seed: If no masses exist, create the standard schedule
    if (!masses || masses.length === 0) {
        const standardSchedule: any[] = []

        // Mon-Sat: 7 PM
        for (let i = 0; i <= 5; i++) {
            const day = addDays(start, i)
            standardSchedule.push({
                date: format(day, 'yyyy-MM-dd'),
                time: '19:00:00',
                type: 'diaria'
            })
        }

        // Sunday: 8am, 10am, 12pm, 6pm, 7:30pm
        const sunday = addDays(start, 6)
        const sundayDate = format(sunday, 'yyyy-MM-dd')
        const sundayTimes = ['08:00:00', '10:00:00', '12:00:00', '18:00:00', '19:30:00']

        sundayTimes.forEach(time => {
            standardSchedule.push({
                date: sundayDate,
                time,
                type: 'dominical'
            })
        })

        const { error: insertError } = await supabase
            .from('masses')
            .insert(standardSchedule)

        if (insertError) {
            console.error('Error seeding masses', insertError)
            throw new Error('Failed to seed standard masses')
        }

        // Refetch to get IDs
        const { data: refreshedMasses } = await supabase
            .from('masses')
            .select('*')
            .gte('date', format(start, 'yyyy-MM-dd'))
            .lte('date', format(end, 'yyyy-MM-dd'))

        masses = refreshedMasses || []
    }

    if (!masses || masses.length === 0) return { success: false, message: "No se pudieron crear misas para esta semana" }

    // 2. Clear existing assignments for this week
    const massIds = masses.map(m => m.id)
    await supabase.from('assignments').delete().in('mass_id', massIds)

    // 3. Identify masses
    const sundayMasses = masses.filter(m => {
        // Safe day check using string date
        const d = new Date(m.date + 'T12:00:00')
        return d.getDay() === 0
    })

    const weekdayMasses = masses.filter(m => !sundayMasses.includes(m))

    // 4. Central Mass Logic
    let centralMassId: string | null = null

    // Reset all Sunday masses to 'dominical' first
    const sundayMassIds = sundayMasses.map(m => m.id)
    if (sundayMassIds.length > 0) {
        await supabase.from('masses').update({ type: 'dominical' }).in('id', sundayMassIds).eq('type', 'central')
    }

    // Identify Central Mass based on config
    if (includeCentralRandom) {
        const candidates = sundayMasses.filter(m => ['10:00', '12:00', '18:00'].some(t => m.time.startsWith(t)))
        if (candidates.length > 0) {
            const random = candidates[Math.floor(Math.random() * candidates.length)]
            centralMassId = random.id
        }
    } else if (centralTime) {
        const match = sundayMasses.find(m => m.time.startsWith(centralTime))
        if (!match && sundayMasses.length > 0) {
            const fallback = sundayMasses.find(m => m.time.startsWith('18:00'))
            if (fallback) centralMassId = fallback.id
        } else if (match) {
            centralMassId = match.id
        }
    }

    // Update the chosen mass to be 'central'
    if (centralMassId) {
        await supabase.from('masses').update({ type: 'central' }).eq('id', centralMassId)
    }

    // 5. Assignment Logic
    const assignmentsToInsert: { mass_id: string, user_id: string }[] = []

    // Helper to check availability
    const isAvailable = (user: User, date: Date, time: string, isCentral: boolean) => {
        if (isCentral) return true
        // If limitations object is missing, assume strictly NO availability if implementing strict rules, 
        // OR assume FULL availability if legacy. 
        // Based on user "Respetar disponibilidad", usually strict is better.
        // However, if we migrated existing users without limitations, they might never get assigned.
        // Let's stick to: No limitations object -> Available. 
        if (!user.limitations) return true

        const dayName = format(date, 'EEEE').toLowerCase()
        if (dayName === 'sunday') {
            const times = user.limitations.sunday_times || []
            // STRICT CHECK: Empty array means NO availability on Sunday
            if (times.length === 0) return false
            return times.some(t => time.startsWith(t))
        } else {
            const days = user.limitations.days || []
            // STRICT CHECK: Empty array means NO availability on weekdays
            if (days.length === 0) return false
            return days.includes(dayName)
        }
    }

    // Helper to shuffle array
    const shuffle = <T>(array: T[]) => array.sort(() => Math.random() - 0.5)

    // -- ASSIGN CENTRAL MASS --
    if (centralMassId) {
        users.forEach(u => {
            assignmentsToInsert.push({ mass_id: centralMassId!, user_id: u.id })
        })
    }

    // -- ASSIGN OTHER SUNDAY MASSES EQUITABLY --
    const distributableSundayMasses = sundayMasses.filter(m => m.id !== centralMassId)
    distributableSundayMasses.sort((a, b) => a.time.localeCompare(b.time))

    if (distributableSundayMasses.length > 0) {
        const shuffledUsers = shuffle([...users])
        let massIndex = 0
        shuffledUsers.forEach(user => {
            for (let i = 0; i < distributableSundayMasses.length; i++) {
                const targetIndex = (massIndex + i) % distributableSundayMasses.length
                const mass = distributableSundayMasses[targetIndex]
                const d = new Date(mass.date + 'T12:00:00')
                if (isAvailable(user, d, mass.time, false)) {
                    assignmentsToInsert.push({ mass_id: mass.id, user_id: user.id })
                    massIndex = (targetIndex + 1) % distributableSundayMasses.length
                    break;
                }
            }
        })
    }

    // -- ASSIGN WEEKDAY MASSES --
    weekdayMasses.forEach(m => {
        const d = new Date(m.date + 'T12:00:00')
        const dailyPool = users.filter(u => isAvailable(u, d, m.time, false))
        const shuffledPool = shuffle([...dailyPool])
        if (shuffledPool[0]) assignmentsToInsert.push({ mass_id: m.id, user_id: shuffledPool[0].id })
        if (shuffledPool[1]) assignmentsToInsert.push({ mass_id: m.id, user_id: shuffledPool[1].id })
    })

    // 6. Execute Insert
    if (assignmentsToInsert.length > 0) {
        const { error } = await supabase.from('assignments').insert(assignmentsToInsert)
        if (error) {
            console.error('Assignments insert error', error)
            throw new Error('Failed to save generated assignments. Please ensure the assignments table exists.')
        }
    }

    revalidatePath('/dashboard/horarios')
    return { success: true }
}
