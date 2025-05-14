import { SignInComponent } from '@/components/auth/Signin'
import { SignupComponent } from '@/components/auth/Signup'
import React from 'react'

function SignPage() {
    return (
        <section className='flex justify-center items-center min-h-screen'>
            <SignInComponent></SignInComponent>
        </section>
    )
}

export default SignPage