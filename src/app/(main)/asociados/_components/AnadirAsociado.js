"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import { createAssociate, uploadAssociateImage } from "@/lib/associatesService";

// Esquema de validación con Yup, ajustado a los campos del formulario original
const validationSchema = Yup.object({
  nombre: Yup.string().required("El nombre comercial es obligatorio"),
  // Los nombres de los campos deben coincidir con los 'name' en InputField
  categoria: Yup.string(),
  contacto: Yup.string(),
  direccion_publica: Yup.string(),
  maps_url: Yup.string().url("Debe ser una URL de Google Maps válida"),
  web_texto: Yup.string(),
  web_url: Yup.string().url("Debe ser una URL web válida"),
  descripcion: Yup.string(),
  facebook_url: Yup.string().url("Debe ser una URL de Facebook válida"),
  instagram_url: Yup.string().url("Debe ser una URL de Instagram válida"),
  responsable: Yup.string(),
  telefono_interno: Yup.string(),
  email_interno: Yup.string().email("Debe ser un email válido"),
  cif_nif: Yup.string(),
  razon_social: Yup.string(),
  direccion_fiscal: Yup.string(),
});

// El componente InputField original, pero adaptado para Formik
const InputField = ({ name, label, placeholder, multiline = false }) => {
  return (
    <div className="mb-3">
      <label className="block text-[#1e2a5e] font-bold italic text-sm mb-1.5">
        {label}
      </label>
      <Field
        name={name}
        as={multiline ? "textarea" : "input"}
        rows={multiline ? 3 : undefined}
        placeholder={placeholder}
        className="w-full px-4 py-2 text-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#004e92] focus:ring-1 focus:ring-[#004e92] resize-none"
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );
};

const AnadirAsociado = ({ onClose, onSubmitSuccess }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const initialValues = {
      nombre: "",
      categoria: "",
      contacto: "",
      direccion_publica: "",
      maps_url: "",
      web_texto: "",
      web_url: "",
      descripcion: "",
      facebook_url: "",
      instagram_url: "",
      responsable: "",
      telefono_interno: "",
      email_interno: "",
      cif_nif: "",
      razon_social: "",
      direccion_fiscal: "",
      activo: true,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError(null);
    if (!imageFile) {
      setSubmitError("Por favor, selecciona un logo para el comercio.");
      setSubmitting(false);
      return;
    }

    try {
      const uploadResponse = await uploadAssociateImage(imageFile);
      const imageName = uploadResponse.filename;

      // Mapea los valores del formulario al body del request que espera la API
      const associateData = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        telefono: values.contacto, // El campo 'contacto' del form se mapea a 'telefono'
        direccion: values.direccion_publica, // El campo 'direccion_publica' se mapea a 'direccion'
        maps_url: values.maps_url,
        web_texto: values.web_texto,
        web_url: values.web_url,
        // Combina las URLs de redes sociales como pide el ejemplo del request body
        rrss_texto: "Instagram | Facebook",
        rrss_url: values.instagram_url || values.facebook_url,
        imagen: imageName,
        activo: values.activo,
      };

      await createAssociate(associateData);
      
      alert("Asociado creado exitosamente");
      if (onSubmitSuccess) onSubmitSuccess();
      onClose();

    } catch (error) {
      console.error("Error al crear el asociado:", error);
      setSubmitError(error.response?.data?.message || error.message || "Ocurrió un error al guardar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Contenedor del modal, es un componente de contenido que se superpone a su padre
    <div className="w-full h-full flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-6xl rounded-none md:rounded-lg shadow-none md:shadow-lg p-6 relative max-h-[95vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-[#004e92] hover:bg-blue-50 rounded transition-colors z-10"
        >
          <X size={32} strokeWidth={2.5} />
        </button>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <h1 className="text-3xl font-bold text-[#004e92] italic mb-6 pr-12">
                Ficha de comercio 
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* COLUMNA IZQUIERDA: Exactamente como en el diseño original */}
                <div>
                  <h2 className="text-xl font-bold text-[#004e92] italic mb-4">
                    Información pública
                  </h2>
                  <div className="border border-gray-200 rounded-2xl p-6 h-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center">
                         {imagePreview ? (
                          <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <span className="text-xs text-gray-400 text-center p-2">Subir logo</span>
                        )}
                      </div>
                      <label htmlFor="imageUpload" className="cursor-pointer px-6 py-2 bg-[#004e92] hover:bg-[#003b70] text-white font-bold italic rounded-lg shadow transition-colors">
                        Subir logo
                      </label>
                      <input id="imageUpload" name="imagen" type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                    </div>

                    <div className="space-y-1">
                      <InputField name="nombre" label="Nombre comercial" />
                      <InputField name="categoria" label="Categoría" />
                      <InputField name="contacto" label="Contacto" />
                      <InputField name="direccion_publica" label="Dirección (texto visible)" />
                      <InputField name="maps_url" label="Dirección (Google Maps URL)" />
                      <InputField name="web_texto" label="Página web (texto visible)" />
                      <InputField name="web_url" label="Página web (URL)" />
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA: Exactamente como en el diseño original */}
                <div className="flex flex-col gap-6 pt-10 lg:pt-0">
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <InputField name="descripcion" label="Descripción" multiline />
                    <InputField name="facebook_url" label="Facebook URL" />
                    <InputField name="instagram_url" label="Instagram URL" />
                  </div>
                  <h2 className="text-xl font-bold text-[#004e92] italic mt-2">
                    Información interna
                  </h2>
                  <div className="border border-gray-200 rounded-2xl p-6 flex-grow">
                    <InputField name="responsable" label="Responsable" />
                    <InputField name="telefono_interno" label="Télefono interno" />
                    <InputField name="email_interno" label="Email interno" />
                    <InputField name="cif_nif" label="CIF / NIF" />
                    <InputField name="razon_social" label="Razón social" />
                    <InputField name="direccion_fiscal" label="Dirección fiscal" />
                  </div>
                </div>
              </div>
              
              {submitError && <div className="text-red-600 text-center mt-4 font-semibold">{submitError}</div>}

              {/* FOOTER: Exactamente como en el diseño original */}
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-6">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-40 py-3 bg-[#004e92] hover:bg-[#003b70] text-white font-bold italic rounded-lg shadow transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" className="w-full sm:w-40 py-3 bg-[#f7eac8] hover:bg-[#ebdcb0] text-[#d99030] font-bold italic rounded-lg transition-colors">
                  Bloquear
                </button>
                <button type="button" className="w-full sm:w-40 py-3 bg-[#fcdcdc] hover:bg-[#f5caca] text-[#cf4a4a] font-bold italic rounded-lg transition-colors">
                  Eliminar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AnadirAsociado;