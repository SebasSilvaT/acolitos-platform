'use client'

import { useState, ReactNode } from 'react'
import { Plus, X } from 'lucide-react'
import { createEvent } from '@/app/actions/dashboard'

export default function CreateEventModal({ trigger }: { trigger?: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        await createEvent(formData)
        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {trigger || (
                    <button
                        className="bg-indigo-600 text-white px-3 py-1 text-sm rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar Evento
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-left" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Nuevo Evento</h3>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-black"
                                    placeholder="Ej. Reunión de Acólitos"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hora</label>
                                    <input
                                        type="time"
                                        name="time"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-black"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-black"
                                    placeholder="Detalles del evento..."
                                />
                            </div>

                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50"
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar Evento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
