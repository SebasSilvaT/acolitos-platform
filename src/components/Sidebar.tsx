"use client"

import * as React from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Users, ClipboardList, Home, Menu, X, LogOut } from 'lucide-react'
import { ThemeToggle } from "./ThemeToggle"

export function Sidebar({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()

    const links = [
        { href: "/dashboard", icon: Home, label: "Resumen" },
        { href: "/horarios", icon: Calendar, label: "Horarios" },
        { href: "/acolitos", icon: Users, label: "Acólitos" },
        { href: "/asistencia", icon: ClipboardList, label: "Asistencia" },
    ]

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-950 transition-colors duration-300">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 z-50">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Acolitos Web</span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out
                    lg:relative lg:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 hidden lg:block">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Acolitos Web</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-16 lg:mt-0 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center p-3 rounded-lg transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                        : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 space-y-4 bg-gray-50/50 dark:bg-zinc-900/50 lg:bg-transparent">
                    <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-zinc-950 rounded-lg border border-gray-100 dark:border-zinc-800">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Modo Oscuro</span>
                        <div className="relative">
                            <ThemeToggle />
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="w-full flex items-center p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/20"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 w-full min-h-screen">
                {children}
            </main>
        </div>
    )
}
