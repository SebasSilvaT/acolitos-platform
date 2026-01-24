import { createClient } from '@/infrastructure/supabase/server'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check if we have a session first
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session) {
        await supabase.auth.signOut()
    }

    return NextResponse.redirect(new URL('/login', req.url), {
        status: 302,
    })
}
