'use client'
import Link from 'next/link'
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function FirstStep(props) {
    const {setActiveStep} = props

    const validationSchema = Yup.object({
      email: Yup.string().email('Correo inválido').required('Requerido'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`;
        await axios.post(url, { email: values.email });
        // Si la petición es exitosa avanzamos al siguiente paso
        setActiveStep(1);
      } catch (error) {
        console.error('Forgot password error:', error);
        const msg = error?.response?.data?.message || 'Error al enviar el correo';
        alert(msg);
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form>
            <p className='text-base mt-24 mb-12 text-[#133D74]'>
              ¿Has olvidado tu contraseña?
            </p>
            <p className='text-base text-[#133D74]'>
              ¡No te preocupes! eso ocurre, Ingrese la dirección de correo electrónico vinculada con su cuenta.
            </p>

            <div className='w-full mt-16 border border-[#133D74] rounded-lg '>
              <Field 
                id="email"
                name="email"
                type="email"
                className=" text-[#133D74] w-full py-3 px-4 font-sans text-base leading-5 placeholder:text-[#133D74]"
                placeholder="Ingresa tu correo email"
              />
            </div>
            <div className="text-red-500 mt-2">
              <ErrorMessage name="email" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !(isValid && dirty)}
              className='w-full mt-28 border border-[#133D74] text-[#133D74]  py-3 rounded-lg font-sans font-medium text-base disabled:opacity-50'
            >
              Enviar código
            </button>

            <div className='w-full flex justify-center items-center mt-56 '>
              <Link href="/login">
                <p className=' text-sm text-[#133D74]'>¿Recuerdas la contraseña? <span className='opacity-30 font-semibold italic'>Ingresar</span></p>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
