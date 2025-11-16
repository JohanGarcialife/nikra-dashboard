'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '@/store/auth';
import apiClient from '@/lib/axios';

export default function Login() {
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleLogin = async (values, { setSubmitting } = {}) => {
    setSubmitting?.(true);
    setLoading(true);
    setSubmitError('');

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;
      const response = await apiClient.post(
        url,
        { email: values.email, password: values.password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Asumimos que el backend devuelve { token, user } o similar
      const token = response?.data?.token || response?.data?.accessToken || null;
      const user = response?.data?.user || { email: values.email };

      if (token) {
        document.cookie = `token=${encodeURIComponent(token)}; path=/`;
      } else {
        // fallback mínimo si no hay token
        document.cookie = `token=${encodeURIComponent(values.email)}; path=/`;
      }

      login(user);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setSubmitError(
        error?.response?.data?.message ||
        error?.message ||
        'Error al iniciar sesión. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
      setSubmitting?.(false);
    }
  };

  return (
    <div className='w-full flex min-h-screen'>
      <div className='w-1/2 flex flex-col justify-center items-center p-8'>
       <h2 className='text-4xl font-bold mb-6 text-primary'>Iniciar Sesión</h2>
       <p className='text-primary text-base'>Bienvenido al Panel de administración del CCA de Ceuta</p>
       <div className='w-full px-40'>
         <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <Form className="w-full">
          <label className="text-primary my-0 mx-0 mb-2 font-sans font-medium text-sm block px-2 mt-5"> 
            Correo electrónico
          </label>
          <Field 
            id="email" 
            name="email"
            type="email" 
              className="rounded-2xl border border-gray-200 text-[rgba(54,69,79)] w-full py-3 px-4 font-sans text-base  leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="ejemplo@gmail.com" 
          />
          <ErrorMessage name="email" component="div" className="text-red-500" />

          <label className="text-primary my-0 mx-0 mb-2 font-sans font-medium text-sm block px-2 mt-5">
            Contraseña
          </label>
          <Field 
            id="password"
            name="password"
            type="password" 
            className="rounded-2xl border border-gray-200 text-[rgba(54,69,79)] w-full py-3 px-4 font-sans text-base  leading-5 box-border placeholder:text-[rgba(54,69,79,0.5)] [&:-internal-autofill-selected]:!bg-[#d3d3d3]" 
            placeholder="Contraseña" 
          />
          <ErrorMessage name="password" component="div" className="text-red-500" />

          <button 
            type="submit"
            disabled={loading}
            className="mt-5 mb-2 w-full h-full font-sans p-5 font-medium text-lg bg-primary  border-none rounded-2xl cursor-pointer transition duration-300 relative disabled:opacity-60" 
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold text-white pointer-events-none">
              {loading ? 'Ingresando...' : 'Acceder'}
            </span>
          </button>
        </Form>
      </Formik>
       </div>
      </div>

      {/* Right column: contenedor relative para que la Image con fill haga de fondo */}
      <div className='w-1/2 relative'>
        <Image
          src="/BackgroundLogin.png"
          alt="Background Login"
          fill
          className="object-cover z-0 rounded-bl-[120px] "
          priority
        />

        {/* Contenido encima del fondo */}
        <div className="relative flex w-full justify-center z-10 p-8">
         <Image
          src="/Logo.png"
          alt="Logo"
          width={400}
          height={400}
          // className="object-cover z-0 rounded-bl-[120px] "
          priority
        />
        </div>
      </div>
    </div>
  )
}
