'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/infrastructure/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login Error:', error)
        let message = 'Could not authenticate user'
        if (error.code === 'email_not_confirmed') {
            message = 'Please verify your email before logging in'
        }
        return redirect(`/login?message=${encodeURIComponent(message)}`)
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            }
        }
    })

    if (error) {
        return redirect('/register?message=Could not authenticate user')
    }

    return redirect('/login?message=Check email to continue sign in process')
}
