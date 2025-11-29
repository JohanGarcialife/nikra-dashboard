"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import { getAssociateById, updateAssociate, uploadAssociateImage } from "@/lib/associatesService";

// Validation schema remains the same
const validationSchema = Yup.object({
  nombre: Yup.string().required("El nombre comercial es obligatorio"),
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

const InputField = ({ name, label, placeholder, multiline = false }) => (
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

const EditarAsociado = ({ associateId, onClose, onSubmitSuccess }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitError, setSubmitError] = useState(null);
console.log(initialValues);

  useEffect(() => {
    if (associateId) {
      const fetchAssociate = async () => {
        try {
          const associate = await getAssociateById(associateId);
          // Mapea la data de la API a la estructura del formulario
          setInitialValues({
            nombre: associate.nombre || "",
            categoria: associate.categoria || "",
            contacto: associate.phone || "",
            direccion_publica: associate.direccion || "",
            maps_url: associate.maps_url || "",
            web_texto: associate.web_texto || "",
            web_url: associate.web_url || "",
            descripcion: associate.descripcion || "",
            facebook_url: associate.facebook_url || "",
            instagram_url: associate.instagram_url || "",
            responsable: associate.responsable || "",
            telefono_interno: associate.telefono_interno || "",
            email_interno: associate.internal_contact?.email || "",
            cif_nif: associate.cif_nif || "",
            razon_social: associate.razon_social|| "",
            direccion_fiscal: associate.direccion_fiscal || "",
            activo: associate.activo,
            imagen: associate.imagen, // guardamos el nombre de la imagen existente
          });
          if(associate.image) {
            setImagePreview(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/associate/${associate.image}`);
          }
        } catch (error) {
          console.error("Error fetching associate data:", error);
          setSubmitError("No se pudieron cargar los datos del asociado.");
        }
      };
      fetchAssociate();
    }
  }, [associateId]);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError(null);
    let imageName = values.imagen; // Start with the existing image name

    try {
      // 1. Si se seleccionó un nuevo archivo, súbelo
      if (imageFile) {
        const uploadResponse = await uploadAssociateImage(imageFile);
        imageName = uploadResponse.filename;
      }
      
      // 2. Mapea los valores del formulario al body del request que espera la API
      const associateData = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        telefono: values.contacto,
        direccion: values.direccion_publica,
        maps_url: values.maps_url,
        web_texto: values.web_texto,
        web_url: values.web_url,
        rrss_texto: "Instagram | Facebook",
        rrss_url: values.instagram_url || values.facebook_url,
        imagen: imageName,
        activo: values.activo,
      };

      // 3. Actualizar asociado
      await updateAssociate(associateId, associateData);
      
      alert("Asociado actualizado exitosamente");
      if (onSubmitSuccess) onSubmitSuccess();
      onClose();

    } catch (error) {
      console.error("Error al actualizar el asociado:", error);
      setSubmitError(error.response?.data?.message || error.message || "Ocurrió un error al guardar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-lg shadow-xl">Cargando datos del asociado...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-6xl rounded-none md:rounded-lg shadow-none md:shadow-lg p-6 relative max-h-[95vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-1 text-[#004e92] hover:bg-blue-50 rounded transition-colors z-10">
          <X size={32} strokeWidth={2.5} />
        </button>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize // Permite que el formulario se reinicie cuando initialValues cambia
        >
          {({ isSubmitting }) => (
            <Form>
              <h1 className="text-3xl font-bold text-[#004e92] italic mb-6 pr-12">
                Editar ficha de comercio 
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* COLUMNA IZQUIERDA */}
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
                          <span className="text-xs text-gray-400 text-center p-2">Sin logo</span>
                        )}
                      </div>
                      <label htmlFor="imageUpload" className="cursor-pointer px-6 py-2 bg-[#004e92] hover:bg-[#003b70] text-white font-bold italic rounded-lg shadow transition-colors">
                        Cambiar logo
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

                {/* COLUMNA DERECHA */}
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

              {/* FOOTER */}
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-6">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-40 py-3 bg-[#004e92] hover:bg-[#003b70] text-white font-bold italic rounded-lg shadow transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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

export default EditarAsociado;