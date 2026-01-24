'use client'

import { useState, ReactNode } from 'react'
import { Plus, X } from 'lucide-react'
import { createNotice } from '@/app/actions/dashboard'

export default function CreateNoticeModal({ trigger }: { trigger?: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        await createNotice(formData)
        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {trigger || (
                    <button
                        className="text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 text-sm rounded-lg font-medium transition-colors flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar Aviso
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-left" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Nuevo Aviso</h3>
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
                                    placeholder="Ej. Mantenimiento del Sistema"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-black"
                                    placeholder="Escribe el aviso aquí..."
                                />
                            </div>

                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50"
                                >
                                    {isLoading ? 'Publicar Aviso' : 'Publicar Aviso'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
