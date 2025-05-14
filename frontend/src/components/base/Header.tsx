'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

function Header() {
    const router = useRouter()
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
                onClick={()=> router.push('/sign-in')}
                >Login</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2">Sign Up</button>
            </div>
        </div>
    </header>
  )
}

export default Header