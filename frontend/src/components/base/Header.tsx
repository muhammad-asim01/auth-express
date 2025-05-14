'use client'
import { logOut } from '@/requests/api/auth.req'
import { access } from 'fs'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

function Header() {
    const router = useRouter()
    
    const handleLogout = async () => {
        const response = await logOut()
        console.log(response)
        if (response.success) {
            localStorage.removeItem('accessToken')
            router.push('/sign-in')
            toast.success(response.message, {
                description: response.message,
            })
        }
        if (response.error) {
            toast.error(response.message, {
                description: response.message,
            })
        }
    }
    return (
        <header>
            <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
                <h1 className="text-2xl font-bold">Auth Express</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/about" className="hover:underline">About</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>

                </nav>
                <div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => router.push('/sign-in')}
                    >Sign In</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
                        onClick={() => router.push('/sign-up')}
                    >Sign Up</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
                        onClick={() => handleLogout()}
                    >Logout</button>
                </div>
            </div>
        </header>
    )
}

export default Header