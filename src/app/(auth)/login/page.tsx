import { login } from '../actions'
import Link from 'next/link'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const { message } = await searchParams

    return (
        <div>
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    Iniciara Sesión a Plataforma de Acólitos
                </h2>
                {message && (
                    <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
                        {message}
                    </div>
                )}
            </div>
            <form className="mt-8 space-y-6">
                <div className="-space-y-px rounded-md shadow-sm">
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="relative block w-full rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div>
                    <button
                        formAction={login}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Ingresar
                    </button>
                </div>
                <div className="text-center text-sm">
                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        No tienes una cuenta? Registrate
                    </Link>
                </div>
            </form>
        </div >
    )
}
