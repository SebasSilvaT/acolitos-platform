'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteMass } from '@/app/actions/masses'

export default function MassActions({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        if (confirm('¿Estás seguro de que deseas eliminar esta misa?')) {
            setIsDeleting(true)
            await deleteMass(id)
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-600 transition-colors p-1"
            title="Eliminar Misa"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    )
}
