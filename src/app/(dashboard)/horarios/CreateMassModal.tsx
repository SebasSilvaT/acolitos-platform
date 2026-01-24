'use client'

import { useState, ReactNode } from 'react'
import { Plus, X } from 'lucide-react'
import { createMass } from '@/app/actions/masses'

export default function CreateMassModal({ trigger }: { trigger?: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        await createMass(formData)
        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {trigger || (
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Misa
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-left" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-black">Nueva Misa</h3>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-black hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black">Fecha</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black">Hora</label>
                                <input
                                    type="time"
                                    name="time"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black">Tipo</label>
                                <select
                                    name="type"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                >
                                    <option value="dominical">Dominical</option>
                                    <option value="diaria">Diaria</option>
                                    <option value="central">Central</option>
                                    <option value="especial">Especial</option>
                                </select>
                            </div>

                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50"
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar Misa'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
