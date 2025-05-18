'use client'
import { logOut } from '@/requests/api/auth.req'
import { access } from 'fs'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { CircleUser } from 'lucide-react'
import { useAuth } from '@/context/authContext'
import { useTheme } from "next-themes"

function Header() {
    const router = useRouter()
    const { setTheme } = useTheme()
    const { isAuthenticated, setIsAuthenticated } = useAuth()

    const handleLogout = async () => {
        const response = await logOut()
        if (response.success) {
            localStorage.removeItem('accessToken')
            router.push('/sign-in')
            toast.success(response.message, {
                description: response.message,
            })
            setIsAuthenticated(false)
        }
        if (response.error) {
            toast.error(response.message, {
                description: response.message,
            })
        }
    }

    return (
        <header>
            <div className="flex items-center p-4 bg-gray-800 text-white">
                <h1 className="text-2xl font-bold">Auth Express</h1>
                <nav className='flex item-center ml-auto'>
                    <ul className="flex space-x-4 items-center">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/about" className="hover:underline">About</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>

                    <div className='flex items-center '>
                        {isAuthenticated ?
                            <div className='flex items-center space-x-1'>
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
                                    onClick={() => handleLogout()}
                                >Logout</button>
                                <span className='ml-2'>
                                    <CircleUser size={24} onClick={() => router.push('/profile')} />
                                </span>
                            </div>
                            :
                            <div>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => router.push('/sign-in')}
                                >Sign In</button>
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
                                    onClick={() => router.push('/sign-up')}
                                >Sign Up</button>
                            </div>
                        }
                    </div>
                </nav>

            </div>
        </header>
    )
}

export default Header