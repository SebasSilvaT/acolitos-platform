import { ClipboardList, CheckCircle2, XCircle, CalendarDays, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { getWeeklySchedule } from '@/app/actions/schedule'
import { addWeeks, subWeeks } from 'date-fns'
import Link from 'next/link'
import AttendanceItem from './components/AttendanceItem'

interface PageProps {
    searchParams: Promise<{ date?: string }>
}

export default async function AsistenciaPage(props: PageProps) {
    const searchParams = await props.searchParams
    const dateParam = searchParams.date
    const today = new Date()
    const viewDate = dateParam ? new Date(dateParam) : today

    // Navigation dates
    const prevWeek = subWeeks(viewDate, 1).toISOString().split('T')[0]
    const nextWeek = addWeeks(viewDate, 1).toISOString().split('T')[0]

    // 1. Fetch data for the current week (or selected week)
    const weeklySchedule = await getWeeklySchedule(viewDate)

    // 2. Calculate Stats
    let totalAssignments = 0
    let totalPresent = 0
    let totalUnjustifiedAbsence = 0

    weeklySchedule.forEach(mass => {
        mass.assignments.forEach(assignment => {
            totalAssignments++
            if (assignment.attendance_status === 'presente') {
                totalPresent++
            }
            if (assignment.attendance_status === 'ausente') {
                totalUnjustifiedAbsence++
            }
        })
    })

    // Group masses by date
    const groupedMasses: Record<string, typeof weeklySchedule> = {}
    weeklySchedule.forEach(mass => {
        if (!groupedMasses[mass.date]) {
            groupedMasses[mass.date] = []
        }
        groupedMasses[mass.date].push(mass)
    })

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Registro de Asistencia</h1>
                    <p className="text-gray-500 mt-1">Controla la participación en las misas y eventos.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Filtrar por fecha:</span>
                    <div className="flex bg-white border border-gray-300 rounded-lg p-1">
                        <Link href={`/asistencia?date=${prevWeek}`} className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <span className="px-3 py-1 text-sm font-bold flex items-center text-gray-700 capitalize">
                            Semana del {viewDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </span>
                        <Link href={`/asistencia?date=${nextWeek}`} className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold">
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Asistencia Semanal</p>
                            <h3 className="text-xl font-bold text-gray-900">{totalPresent}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-50 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Ausencias Injustificadas</p>
                            <h3 className="text-xl font-bold text-gray-900">{totalUnjustifiedAbsence}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <ClipboardList className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Registros</p>
                            <h3 className="text-xl font-bold text-gray-900">{totalAssignments}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de misas por semana</h3>

                {Object.keys(groupedMasses).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No hay misas asignadas para esta semana.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedMasses).map(([date, masses]) => (
                            <div key={date}>
                                <h4 className="text-md font-semibold text-gray-700 mb-2 border-b pb-1">
                                    {new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acólitos Asignados</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {masses.map((mass) => (
                                                <tr key={mass.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                        {mass.time}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mass.type === 'dominical' ? 'bg-indigo-100 text-indigo-800' :
                                                            mass.type === 'central' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                            {mass.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {mass.assignments.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {mass.assignments.map(a => (
                                                                    <AttendanceItem
                                                                        key={a.id}
                                                                        assignmentId={a.id}
                                                                        userName={a.user.full_name}
                                                                        currentStatus={a.attendance_status || 'pendiente'}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 italic">Sin asignaciones</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
