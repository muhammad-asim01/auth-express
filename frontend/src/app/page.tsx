import React from 'react'
import { QrCodeModal } from '@/components/2fa/QrCodeModal'
import { Signup } from '@/components/auth/Signup'

function page() {
  return (
    <div>
      <QrCodeModal />
      <Signup />
    </div>
  )
}

export default page