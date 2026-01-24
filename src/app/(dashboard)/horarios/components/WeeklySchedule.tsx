'use client'

import React, { useState } from 'react'
import { format, isSameDay, parseISO, startOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { MassWithAssignments } from '@/app/actions/schedule'
import { User } from '@/domain/entities/User'
import { Plus, X, User as UserIcon } from 'lucide-react'
import { saveScheduleAssignment } from '@/app/actions/schedule'

interface WeeklyScheduleProps {
    schedule: MassWithAssignments[]
    startDate: Date
    acolytes: User[]
}

export default function WeeklySchedule({ schedule, startDate, acolytes }: WeeklyScheduleProps) {
    const weekStart = startOfWeek(startDate, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 6 }).map((_, i) => addDays(weekStart, i))
    const sunday = addDays(weekStart, 6)

    // Group masses by date
    const massesByDate: Record<string, MassWithAssignments[]> = {}
    schedule.forEach(m => {
        // Ensure we handle both string and Date objects for the date property
        const dateObj = typeof m.date === 'string' ? parseISO(m.date) : m.date
        const dateKey = format(dateObj, 'yyyy-MM-dd')
        if (!massesByDate[dateKey]) massesByDate[dateKey] = []
        massesByDate[dateKey].push(m)
    })

    const sundayMasses = massesByDate[format(sunday, 'yyyy-MM-dd')] || []

    // Sort Sunday masses by time
    sundayMasses.sort((a, b) => a.time.localeCompare(b.time))

    return (
        <div className="space-y-8 print:space-y-4">
            {/* Header / Week Title */}
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 text-center border-2 border-indigo-900 dark:border-indigo-500 font-extrabold text-black dark:text-white uppercase tracking-wide">
                SEMANA DEL {format(weekStart, "dd", { locale: es })} AL {format(addDays(weekStart, 5), "dd 'DE' MMMM 'DEL' yyyy", { locale: es }).toUpperCase()}
            </div>

            {/* Weekly Grid (Mon-Sat) */}
            <div className="grid grid-cols-1 md:grid-cols-6 border-2 border-indigo-900 dark:border-indigo-500">
                {weekDays.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd')
                    const dayMasses = massesByDate[dateKey] || []

                    return (
                        <div key={dateKey} className="flex flex-col border-r last:border-r-0 border-indigo-900 dark:border-indigo-500 min-h-[200px]">
                            {/* Day Header */}
                            <div className="bg-indigo-50 dark:bg-indigo-950 p-2 text-center border-b border-indigo-900 dark:border-indigo-500 font-bold text-black dark:text-gray-100 uppercase text-sm">
                                {format(day, 'EEEE', { locale: es })}
                            </div>

                            {/* Content */}
                            <div className="p-2 flex-grow bg-white dark:bg-zinc-800/50">
                                {dayMasses.map(mass => (
                                    <MassSlot
                                        key={mass.id}
                                        mass={mass}
                                        acolytes={acolytes}
                                        isSunday={false}
                                    />
                                ))}
                                {dayMasses.length === 0 && (
                                    <div className="text-black dark:text-gray-400 text-xs text-center italic mt-4">Sin misa</div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Sunday Header */}
            <div className="bg-indigo-200 dark:bg-indigo-800 p-2 text-center border-2 border-indigo-900 dark:border-indigo-500 font-extrabold text-black dark:text-white uppercase mt-8 tracking-wide">
                DOMINGO {format(sunday, "dd 'DE' MMMM 'DEL' yyyy", { locale: es }).toUpperCase()}
            </div>

            {/* Sunday Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 border-2 border-indigo-900 dark:border-indigo-500">
                {['08:00', '10:00', '12:00', '18:00', '19:30'].map((timeSlot) => {
                    // Simple logic to find mass near this slot
                    const mass = sundayMasses.find(m => m.time.startsWith(timeSlot.substring(0, 5)))

                    return (
                        <div key={timeSlot} className="flex flex-col border-r last:border-r-0 border-indigo-900 dark:border-indigo-500 min-h-[250px]">
                            <div className="bg-indigo-50 dark:bg-indigo-950 p-2 text-center border-b border-indigo-900 dark:border-indigo-500 font-bold text-black dark:text-gray-100 uppercase text-sm">
                                {timeSlot} {parseInt(timeSlot) >= 12 ? 'P.M.' : 'A.M.'}
                            </div>
                            <div className="p-2 flex-grow bg-white dark:bg-zinc-800/50 relative">
                                {mass ? (
                                    <MassSlot
                                        mass={mass}
                                        acolytes={acolytes}
                                        isSunday={true}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-black dark:text-gray-400 italic">
                                        No programada
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 text-center border-2 border-t-0 border-indigo-900 dark:border-indigo-500 font-bold text-black dark:text-gray-200 text-sm uppercase">
                ASISTIR CON PUNTUALIDAD. 30 MINUTOS ANTES DE CADA MISA DE SEMANA O DOMINGO
            </div>
        </div>
    )
}

function MassSlot({ mass, acolytes, isSunday }: { mass: MassWithAssignments, acolytes: User[], isSunday: boolean }) {
    const [isEditing, setIsEditing] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>(mass.assignments.map(a => a.user.id))
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        await saveScheduleAssignment(mass.id, selectedIds)
        setIsSaving(false)
        setIsEditing(false)
    }

    const toggleSelection = (userId: string) => {
        if (selectedIds.includes(userId)) {
            setSelectedIds(selectedIds.filter(id => id !== userId))
        } else {
            setSelectedIds([...selectedIds, userId])
        }
    }

    // Determine specific styling based on Sunday or Weekday
    const containerClass = isSunday
        ? "flex flex-col gap-1 items-center text-center"
        : "flex flex-col gap-1 text-left"

    return (
        <div className="mb-4 last:mb-0">
            {!isEditing ? (
                <div className="group relative">
                    <div className={containerClass}>
                        {mass.type === 'central' ? (
                            <span className="text-red-700 dark:text-red-400 font-extrabold text-sm uppercase block py-2 border-b-2 border-red-200 dark:border-red-800">
                                MISA CENTRAL
                            </span>
                        ) : mass.assignments.length > 0 ? (
                            mass.assignments.map(a => (
                                <div key={a.id} className="text-sm font-bold text-black dark:text-gray-200 uppercase leading-snug">
                                    {a.user.full_name}
                                </div>
                            ))
                        ) : (
                            <span className="text-xs text-red-500 font-bold">-- Sin Asignar --</span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute -top-2 -right-2 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-black dark:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-gray-300 dark:border-zinc-500 z-10"
                        title="Editar asignación"
                    >
                        <UserIcon className="w-3 h-3" />
                    </button>
                </div>
            ) : (
                <div className="absolute z-50 bg-white dark:bg-zinc-800 border border-gray-400 dark:border-zinc-600 shadow-xl rounded-lg p-3 w-64 -ml-2 mt-1 left-0 md:left-auto">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-xs uppercase text-black dark:text-white">Asignar Acólitos</h4>
                        <button onClick={() => setIsEditing(false)}><X className="w-4 h-4 text-black dark:text-gray-400" /></button>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1 mb-2">
                        {acolytes.map(user => (
                            <label key={user.id} className="flex items-center space-x-2 text-sm p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(user.id)}
                                    onChange={() => toggleSelection(user.id)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 border-gray-400"
                                />
                                <span className="text-black dark:text-gray-200 font-medium">{user.full_name}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50 font-bold"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
