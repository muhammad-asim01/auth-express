import { SignInComponent } from '@/components/auth/Signin'
import { SignupComponent } from '@/components/auth/Signup'
import React from 'react'

function SignPage() {
    return (
        <section className=''>
            <SignupComponent></SignupComponent>
        </section>
    )
}

export default SignPage