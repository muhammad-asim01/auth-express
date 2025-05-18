import { SignInComponent } from '@/components/auth/Signin'
import { SignupComponent } from '@/components/auth/Signup'
import React from 'react'

function SignPage() {
    return (
        <section className=''>
            <SignInComponent></SignInComponent>
        </section>
    )
}

export default SignPage