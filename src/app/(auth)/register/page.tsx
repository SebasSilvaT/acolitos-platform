import { signup } from '../actions'
import Link from 'next/link'

export default function RegisterPage() {
    return (
        <div>
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    Crea tu cuenta
                </h2>
            </div>
            <form className="mt-8 space-y-6">
                <div className="-space-y-px rounded-md shadow-sm">
                    <div>
                        <label htmlFor="full-name" className="sr-only">
                            Nombre completo
                        </label>
                        <input
                            id="full-name"
                            name="full_name"
                            type="text"
                            required
                            className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Nombre completo"
                        />
                    </div>
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Correo electrónico
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="relative block w-full border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Correo electrónico"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="relative block w-full rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Contraseña"
                        />
                    </div>
                </div>

                <div>
                    <button
                        formAction={signup}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Ingresar
                    </button>
                </div>
                <div className="text-center text-sm">
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Ya tienes una cuenta? Iniciar sesión
                    </Link>
                </div>
            </form>
        </div>
    )
}
