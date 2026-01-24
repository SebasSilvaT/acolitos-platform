'use client'

import React, { useState } from 'react'
import { Check, X, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react'
import { updateAttendance } from '@/app/actions/attendance'
import { AttendanceStatus } from '@/domain/entities/Mass'

interface AttendanceItemProps {
    assignmentId: string
    userName: string
    currentStatus: string
}

export default function AttendanceItem({ assignmentId, userName, currentStatus }: AttendanceItemProps) {
    const [status, setStatus] = useState<string>(currentStatus)
    const [isLoading, setIsLoading] = useState(false)

    const handleUpdate = async (newStatus: AttendanceStatus) => {
        setIsLoading(true)
        try {
            await updateAttendance(assignmentId, newStatus)
            setStatus(newStatus)
        } catch (error) {
            console.error('Failed to update status', error)
            alert('Error al actualizar el estado')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded-md opacity-75">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-gray-500 text-sm">{userName}</span>
            </div>
        )
    }

    // Default view: Show status buttons if 'pendiente'
    if (status === 'pendiente') {
        return (
            <div className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                <span className="text-gray-700 text-sm font-medium mr-2">{userName}</span>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => handleUpdate('presente')}
                        className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Marcar Asistencia"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleUpdate('justificado')}
                        className="p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                        title="Justificar Falta"
                    >
                        <ShieldCheck className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleUpdate('ausente')}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Marcar Falta Injustificada"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )
    }

    // Confirmed views
    let colorClass = 'text-gray-700 bg-gray-100'
    let icon = null

    if (status === 'presente') {
        colorClass = 'text-green-700 bg-green-50 border-green-200'
        icon = <Check className="w-3 h-3 mr-1" />
    } else if (status === 'ausente') {
        colorClass = 'text-red-700 bg-red-50 border-red-200'
        icon = <X className="w-3 h-3 mr-1" />
    } else if (status === 'justificado') {
        colorClass = 'text-yellow-700 bg-yellow-50 border-yellow-200'
        icon = <ShieldCheck className="w-3 h-3 mr-1" />
    }

    return (
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-sm font-medium group relative ${colorClass}`}>
            {icon}
            <span>{userName}</span>
            {/* Hover to reset - subtle */}
            <button
                onClick={() => handleUpdate('pendiente')}
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 bg-white rounded-full shadow-sm text-gray-400 hover:text-indigo-600 border border-gray-200"
                title="Restablecer estado"
            >
                <RefreshCw className="w-3 h-3" />
            </button>
        </div>
    )
}
