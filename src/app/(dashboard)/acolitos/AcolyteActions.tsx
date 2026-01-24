'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteAcolyte } from '@/app/actions/users'
import { User } from '@/domain/entities/User'
import EditAcolyteModal from './EditAcolyteModal'

export default function AcolyteActions({ acolyte }: { acolyte: User }) {
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        if (confirm('¿Estás seguro de que deseas eliminar este acólito?')) {
            setIsDeleting(true)
            await deleteAcolyte(acolyte.id)
            setIsDeleting(false)
        }
    }

    return (
        <div className="flex items-center justify-end">
            <EditAcolyteModal acolyte={acolyte} />
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-900 ml-2"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    )
}
