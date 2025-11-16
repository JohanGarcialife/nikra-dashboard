import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function FourthStep(props) {
    const {setActiveStep} = props
  return (
    <div>
        <div className='flex w-full items-center justify-center mt-32'>

 <Image
                width={120}
                height={180}
                src={`/Success.png`} 
                alt="Logo"
              />
        </div>
           <p className='text-base my-24 text-center px-24 text-[#133D74]'>
        ¡Contraseña cambiada! Tu contraseña ha sido cambiada exitosamente.
      </p>
      <Link href="/login">
        <button  className='w-full mt-28 border border-[#133D74] text-[#133D74]  py-3 rounded-lg font-sans font-medium text-base'>
   Regresar al inicio
</button>
      </Link>
    </div>
  )
}
