'use client'
import React, { useState } from 'react'
import FirstStep from './_components/FirstStep'
import SecondStep from './_components/SecondStep'
import ThirdStep from './_components/ThirdStep'
import FourthStep from './_components/FourthStep'

export default function page() {
const [activeStep, setActiveStep] = useState(0)
const [code, setCode] = useState(null)
  return (
    <div className='w-full max-w-full min-h-screen '>
{activeStep === 0 && <FirstStep setActiveStep={setActiveStep} />}
{activeStep === 1 && <SecondStep setActiveStep={setActiveStep} setCode={setCode} />}
{activeStep === 2 && <ThirdStep setActiveStep={setActiveStep} code={code} />}
{activeStep === 3 && <FourthStep setActiveStep={setActiveStep} />}
    </div>
  )
}
