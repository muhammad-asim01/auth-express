'use client'; // Ensure this is a Client Component since we're using hooks

import { ResetPassword } from '@/components/auth/ResetPassword';
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import React from 'react';

function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Redirect to signin if no token is present
  if (!token) {
    redirect('/sign-in');
  }

  return (
    <section className="">
      <ResetPassword token={token} />
    </section>
  );
}

export default ResetPasswordPage;