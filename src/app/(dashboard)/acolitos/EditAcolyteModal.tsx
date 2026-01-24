'use client'

import { useState, useMemo } from 'react'
import { Pencil, X, Check } from 'lucide-react'
import { updateAcolyte } from '@/app/actions/users'
import { User, AcolyteLimitations } from '@/domain/entities/User'
import { differenceInYears, parseISO } from 'date-fns'

export default function EditAcolyteModal({ acolyte }: { acolyte: User }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [birthDate, setBirthDate] = useState(acolyte.birth_date || '')

    // Limitations State
    const [selectedDays, setSelectedDays] = useState<string[]>(acolyte.limitations?.days || [])
    const [selectedSundayTimes, setSelectedSundayTimes] = useState<string[]>(acolyte.limitations?.sunday_times || [])

    // Available Options
    const weekDays = [
        { id: 'monday', label: 'Lunes' },
        { id: 'tuesday', label: 'Martes' },
        { id: 'wednesday', label: 'Miércoles' },
        { id: 'thursday', label: 'Jueves' },
        { id: 'friday', label: 'Viernes' },
        { id: 'saturday', label: 'Sábado' },
    ]

    const sundayTimes = ['08:00', '10:00', '12:00', '18:00', '19:30']

    // Calculate Age
    const age = useMemo(() => {
        if (!birthDate) return ''
        try {
            return differenceInYears(new Date(), parseISO(birthDate))
        } catch (e) {
            return ''
        }
    }, [birthDate])

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const toggleSundayTime = (time: string) => {
        setSelectedSundayTimes(prev =>
            prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
        )
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)

        const limitations = {
            days: selectedDays,
            sunday_times: selectedSundayTimes
        }

        formData.append('limitations', JSON.stringify(limitations))

        await updateAcolyte(acolyte.id, formData)
        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-indigo-600 hover:text-indigo-900 mr-4"
            >
                <Pencil className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                    <div
                        className="absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative z-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-xl font-bold text-black">Editar Acólito</h3>
                            <button onClick={() => setIsOpen(false)} className="text-black hover:text-black">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form action={handleSubmit} className="space-y-6">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-black flex items-center text-sm uppercase tracking-wider">
                                    Información Personal
                                </h4>
                                <div>
                                    <label className="block text-sm font-medium text-black">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        defaultValue={acolyte.full_name}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base text-black border p-2.5 bg-gray-50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-black">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            name="birth_date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base text-black border p-2.5 bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black">Edad Calculada</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={age ? `${age} años` : '-'}
                                            className="mt-1 block w-full rounded-md border-transparent shadow-none bg-transparent text-black text-base font-semibold p-2.5"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-black">Rol</label>
                                        <select
                                            name="role"
                                            defaultValue={acolyte.role}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base text-black border p-2.5 bg-gray-50"
                                        >
                                            <option value="acolito">Acólito</option>
                                            <option value="maestro">Maestro</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black">Teléfono</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            defaultValue={acolyte.phone || ''}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base text-black border p-2.5 bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Limitations */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-black flex items-center text-sm uppercase tracking-wider">
                                    Disponibilidad y Limitaciones
                                </h4>

                                <div className="space-y-2">
                                    <p className="text-xs text-black font-medium uppercase">Días disponibles (Lunes - Sábado)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {weekDays.map(day => (
                                            <button
                                                key={day.id}
                                                type="button"
                                                onClick={() => toggleDay(day.id)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedDays.includes(day.id)
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                    : 'bg-white text-black border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs text-black font-medium uppercase">Misas Dominicales Disponibles</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {sundayTimes.map(time => (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => toggleSundayTime(time)}
                                                className={`flex items-center justify-center px-2 py-2 rounded-lg text-sm font-medium border transition-all ${selectedSundayTimes.includes(time)
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-200'
                                                    : 'bg-white text-black border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {selectedSundayTimes.includes(time) && <Check className="w-3 h-3 mr-1" />}
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
