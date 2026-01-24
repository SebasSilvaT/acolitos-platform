import { Calendar, Users, Activity, ArrowUpRight } from 'lucide-react'
import { getMasses } from '@/app/actions/masses'
import { getAcolytes } from '@/app/actions/users'
import { getEvents, getNotices, getWeeklyAttendanceRate, getMassesPerformedThisWeek } from '@/app/actions/dashboard'
import CreateEventModal from './CreateEventModal'
import CreateNoticeModal from './CreateNoticeModal'

export default async function DashboardPage() {
    const masses = await getMasses()
    const acolytes = await getAcolytes()
    const events = await getEvents()
    const notices = await getNotices()
    const weeklyAttendance = await getWeeklyAttendanceRate()
    const weeklyMassesPerformed = await getMassesPerformedThisWeek()

    const now = new Date()
    // Filter for Upcoming Central Mass
    const upcomingCentralMasses = masses.filter(m =>
        m.type === 'central' && new Date(m.date + 'T' + m.time) >= now
    )
    const nextCentralMass = upcomingCentralMasses.length > 0 ? upcomingCentralMasses[0] : null

    // Stats
    const totalAcolytes = acolytes.length

    // Next Central Mass Display String
    let nextMassValue = "Sin programar"
    let nextMassTrend = "-"
    if (nextCentralMass) {
        const d = new Date(nextCentralMass.date + 'T' + nextCentralMass.time)
        const daysDiff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24))

        nextMassValue = `${d.toLocaleDateString('es-ES', { weekday: 'long' })} ${nextCentralMass.time}`
        nextMassTrend = daysDiff === 0 ? "Hoy" : `En ${daysDiff} días`
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Panel General</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Bienvenido de vuelta, gestiona tu parroquia eficientemente.</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Próxima misa central"
                    value={nextMassValue}
                    icon={Calendar}
                    trend={nextMassTrend}
                    color="indigo"
                />
                <StatCard
                    title="Acólitos Activos"
                    value={totalAcolytes.toString()}
                    icon={Users}
                    trend="Total registrados"
                    color="emerald"
                />
                <StatCard
                    title="Asistencia Promedio"
                    value={weeklyAttendance}
                    icon={Activity}
                    trend="Esta semana"
                    color="blue"
                />
                <StatCard
                    title="Misas Realizadas"
                    value={weeklyMassesPerformed}
                    icon={ArrowUpRight}
                    trend="Esta semana"
                    color="purple"
                />
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Próximos Eventos</h3>
                        <CreateEventModal />
                    </div>
                    <div className="space-y-4">
                        {events.length === 0 ? (
                            <p className="text-gray-500 text-sm">No hay eventos próximos.</p>
                        ) : (
                            events.slice(0, 5).map((event) => (
                                <div key={event.id} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-zinc-700">
                                    <div className="w-2 h-12 bg-indigo-500 rounded-full mr-4"></div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{event.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {event.time && <span className="mr-2 font-medium text-indigo-600 dark:text-indigo-400">{event.time}</span>}
                                            {new Date(event.date_start).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        {event.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{event.description}</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Avisos</h3>
                        <CreateNoticeModal />
                    </div>
                    <div className="space-y-3">
                        {notices.length === 0 ? (
                            <p className="text-gray-500 text-sm">No hay avisos publicados.</p>
                        ) : (
                            notices.slice(0, 3).map((notice) => (
                                <div key={notice.id} className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-100 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-sm">
                                    <p className="font-semibold mb-1">{notice.title}</p>
                                    <p>{notice.description}</p>
                                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-2 text-right">{new Date(notice.created_at).toLocaleDateString('es-ES')}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
    const colorClasses: any = {
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    }

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 capitalize">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="text-emerald-600 font-medium mr-2">{trend}</span>
            </div>
        </div>
    )
}
