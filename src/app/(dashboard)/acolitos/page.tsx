import { Users, Filter } from 'lucide-react'
import { getAcolytes } from '@/app/actions/users'
import CreateAcolyteModal from './CreateAcolyteModal'
import AcolyteSearch from './AcolyteSearch'
import AcolyteActions from './AcolyteActions'

export default async function AcolitosPage({
    searchParams,
}: {
    searchParams: Promise<{
        search?: string
    }>
}) {
    const params = await searchParams
    const query = params?.search || ''
    const acolytes = await getAcolytes(query)

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Gestión de Acólitos</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Administra el equipo de servicio del altar.</p>
                </div>
                <CreateAcolyteModal />
            </header>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <AcolyteSearch />
                <div className="flex gap-2">
                    <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                {acolytes.length === 0 ? (
                    <div className="p-6 text-center text-black py-12">
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No se encontraron acólitos</h3>
                        <p className="mt-1">Intenta ajustar tu búsqueda o agrega un nuevo acólito.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                        <thead className="bg-gray-50 dark:bg-zinc-950/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Edad</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                            {acolytes.map((acolyte) => {
                                let age = '-'
                                if (acolyte.birth_date) {
                                    try {
                                        age = String(Math.floor((new Date().getTime() - new Date(acolyte.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
                                    } catch (e) {
                                        // ignore invalid date
                                    }
                                }

                                return (
                                    <tr key={acolyte.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                                    {acolyte.full_name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{acolyte.full_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {age !== '-' ? `${age} años` : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${acolyte.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                acolyte.role === 'maestro' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {acolyte.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <AcolyteActions acolyte={acolyte} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
