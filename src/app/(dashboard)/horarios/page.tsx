
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { getWeeklySchedule } from '@/app/actions/schedule'
import { getAcolytes } from '@/app/actions/users'
import CreateMassModal from './CreateMassModal'
import WeeklySchedule from './components/WeeklySchedule'
import ScheduleGenerator from './components/ScheduleGenerator'
import { addWeeks, subWeeks, startOfWeek } from 'date-fns'
import Link from 'next/link'

interface PageProps {
    searchParams: Promise<{ date?: string }>
}

export default async function HorariosPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const dateParam = searchParams.date
    const today = new Date()

    // Determine the current view date (default to today)
    const viewDate = dateParam ? new Date(dateParam) : today

    // Ensure we are comparing dates correctly (at start of week) if needed, 
    // but viewDate acts as the anchor.

    const schedule = await getWeeklySchedule(viewDate)
    const acolytes = await getAcolytes()

    // Navigation dates
    const prevWeek = subWeeks(viewDate, 1).toISOString().split('T')[0]
    const nextWeek = addWeeks(viewDate, 1).toISOString().split('T')[0]

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center sm:flex-row flex-col gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Horarios de Misas</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Programa y visualiza el calendario litúrgico.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-1 mr-4">
                        <Link href={`/horarios?date=${prevWeek}`} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-700 dark:text-gray-200 font-bold">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <span className="px-3 py-1 text-sm font-bold flex items-center text-gray-900 dark:text-gray-100">
                            Semana del {viewDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </span>
                        <Link href={`/horarios?date=${nextWeek}`} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-700 dark:text-gray-200 font-bold">
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <ScheduleGenerator currentDate={viewDate} />
                    {/* Hidden/Deprioritized 'Agregar Misa' as requested, 
                        but kept as a small icon for maintenance if needed */}
                    <div className="hidden">
                        <CreateMassModal />
                    </div>
                </div>
            </header>

            <WeeklySchedule
                schedule={schedule}
                startDate={viewDate}
                acolytes={acolytes}
            />
        </div>
    )
}
