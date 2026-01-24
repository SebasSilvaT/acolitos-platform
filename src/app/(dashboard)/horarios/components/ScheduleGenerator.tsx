'use client'

import React, { useState } from 'react'
import { startOfWeek, format } from 'date-fns'
import { Wand2, Edit3, Loader2 } from 'lucide-react'
import { generateRandomScheduleAction } from '@/app/actions/schedule'

interface ScheduleGeneratorProps {
    currentDate: Date
    onGenerate?: () => void
}

export default function ScheduleGenerator({ currentDate, onGenerate }: ScheduleGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Config state
    const [centralMode, setCentralMode] = useState<'random' | 'manual'>('random')
    const [manualCentralTime, setManualCentralTime] = useState('18:00')

    const dateStr = format(currentDate, 'yyyy-MM-dd')

    const handleGenerate = async () => {
        setIsLoading(true)
        try {
            const res = await generateRandomScheduleAction(
                dateStr,
                centralMode === 'random',
                centralMode === 'manual' ? manualCentralTime : undefined
            )
            // Ideally check res.success
            setIsOpen(false)
            if (onGenerate) onGenerate()
            // Could add toast here
        } catch (e) {
            console.error(e)
            alert('Error al generar horario')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <div className="flex gap-2">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow hover:shadow-lg transition-all text-sm font-bold"
                >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generar Horario Aleatorio
                </button>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h3 className="text-lg font-bold flex items-center text-white">
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generar Horario Aleatorio
                    </h3>
                    <p className="text-white/90 text-sm mt-1">
                        Configura las reglas para la generación automática.
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Central Mass Config */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-black block">
                            Misa Central (Domingo)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setCentralMode('random')}
                                className={`p-3 rounded-lg border text-left transition-all ${centralMode === 'random'
                                    ? 'border-indigo-600 bg-indigo-50 text-black ring-2 ring-indigo-500'
                                    : 'border-gray-300 hover:bg-gray-50 text-black'
                                    }`}
                            >
                                <span className="block font-bold text-sm">Aleatoria</span>
                                <span className="text-xs text-black block mt-1">Entre 10am, 12pm, 6pm</span>
                            </button>

                            <button
                                onClick={() => setCentralMode('manual')}
                                className={`p-3 rounded-lg border text-left transition-all ${centralMode === 'manual'
                                    ? 'border-indigo-600 bg-indigo-50 text-black ring-2 ring-indigo-500'
                                    : 'border-gray-300 hover:bg-gray-50 text-black'
                                    }`}
                            >
                                <span className="block font-bold text-sm">Manual</span>
                                <span className="text-xs text-black block mt-1">Elegir hora fija</span>
                            </button>
                        </div>

                        {centralMode === 'manual' && (
                            <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-xs font-bold text-black mb-1 block">Seleccionar hora:</label>
                                <select
                                    value={manualCentralTime}
                                    onChange={(e) => setManualCentralTime(e.target.value)}
                                    className="w-full border-gray-400 rounded-md shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 text-black font-medium"
                                >
                                    <option value="08:00">8:00 A.M.</option>
                                    <option value="10:00">10:00 A.M.</option>
                                    <option value="12:00">12:00 P.M.</option>
                                    <option value="18:00">6:00 P.M.</option>
                                    <option value="19:30">7:30 P.M.</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg text-xs text-black border border-blue-200">
                        <strong>Nota:</strong> Se asignarán acólitos equitativamente en los horarios de semana y domingo (excluyendo la misa central).
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-black text-sm font-bold hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isLoading ? 'Generando...' : 'Confirmar y Generar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
