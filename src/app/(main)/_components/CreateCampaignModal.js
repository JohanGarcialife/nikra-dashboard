"use client";

import { X, Upload } from "lucide-react";
import { useState, useRef } from "react";

/**
 * Componente CreateCampaignModal - Modal para crear nueva campaña
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback al enviar el formulario
 */
export default function CreateCampaignModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    importeMinimo: "",
    cuantiaAcumulable: "",
    reglaParticipacion: "",
    reglaRedondeo: "",
    imagen: null,
    imagenNombre: "",
    basesLegales: null,
    basesLegalesNombre: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo al cambiar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar formato
    const validFormats = ["image/jpeg", "image/jpg", "image/png"];
    if (!validFormats.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        imagen: "Solo se permiten archivos JPG o PNG",
      }));
      return;
    }

    // Validar tamaño (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        imagen: "La imagen no puede superar los 5MB",
      }));
      return;
    }

    // Guardar el archivo para subirlo después
    setImageFile(file);
    
    // Convertir a base64 para preview (opcional)
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imagen: reader.result,
        imagenNombre: file.name,
      }));
      setErrors((prev) => ({ ...prev, imagen: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar formato
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        basesLegales: "Solo se permiten archivos PDF",
      }));
      return;
    }

    // Validar tamaño (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        basesLegales: "El PDF no puede superar los 10MB",
      }));
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        basesLegales: reader.result,
        basesLegalesNombre: file.name,
      }));
      setErrors((prev) => ({ ...prev, basesLegales: "" }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar campos requeridos para el backend
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es requerida";
    }
    if (!formData.fechaFin) {
      newErrors.fechaFin = "La fecha de fin es requerida";
    }
    if (!imageFile && !formData.imagen) {
      newErrors.imagen = "La imagen es requerida";
    }

    // Validar campos del formulario (no se envían al backend pero son parte del formulario)
    if (!formData.importeMinimo) {
      newErrors.importeMinimo = "El importe mínimo es requerido";
    } else if (parseFloat(formData.importeMinimo) <= 0) {
      newErrors.importeMinimo = "El importe debe ser mayor que 0";
    }
    if (!formData.cuantiaAcumulable) {
      newErrors.cuantiaAcumulable = "La cuantía acumulable es requerida";
    } else if (parseFloat(formData.cuantiaAcumulable) < 0) {
      newErrors.cuantiaAcumulable = "La cuantía debe ser mayor o igual a 0";
    }
    if (!formData.reglaParticipacion.trim()) {
      newErrors.reglaParticipacion = "La regla de participación es requerida";
    }
    if (!formData.reglaRedondeo.trim()) {
      newErrors.reglaRedondeo = "La regla de redondeo es requerida";
    }
    if (!formData.basesLegales) {
      newErrors.basesLegales = "Las bases legales son requeridas";
    }

    // Validar fechas
    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      if (fin <= inicio) {
        newErrors.fechaFin = "La fecha de fin debe ser posterior a la de inicio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Llamar a onSubmit pasando formData y el archivo de imagen
      await onSubmit(formData, imageFile);
      
      // Resetear formulario solo si la creación fue exitosa
      setFormData({
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        importeMinimo: "",
        cuantiaAcumulable: "",
        reglaParticipacion: "",
        reglaRedondeo: "",
        imagen: null,
        imagenNombre: "",
        basesLegales: null,
        basesLegalesNombre: "",
        isActive: true,
      });
      setImageFile(null);
      setErrors({});
    } catch (error) {
      // Mostrar error en el formulario
      setErrors((prev) => ({
        ...prev,
        submit: error.response?.data?.message || 'Error al crear la campaña. Por favor, intenta de nuevo.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">
            Crear nueva campaña
          </h2>
          <button
            onClick={onClose}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              {/* Nombre de la campaña */}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Nombre de campaña *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 border ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>

              {/* Descripción de la campaña */}
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows="3"
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="Descripción de la campaña (opcional)"
                />
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fechaInicio"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Fecha inicio *
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2.5 border ${
                      errors.fechaInicio ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  {errors.fechaInicio && (
                    <p className="text-red-500 text-xs mt-1">{errors.fechaInicio}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fechaFin"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Fecha fin *
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2.5 border ${
                      errors.fechaFin ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  {errors.fechaFin && (
                    <p className="text-red-500 text-xs mt-1">{errors.fechaFin}</p>
                  )}
                </div>
              </div>

              {/* Importe mínimo y Cuantía acumulable */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="importeMinimo"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Importe mínimo (€)
                  </label>
                  <input
                    type="number"
                    id="importeMinimo"
                    name="importeMinimo"
                    value={formData.importeMinimo}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.importeMinimo ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.importeMinimo && (
                    <p className="text-red-500 text-xs mt-1">{errors.importeMinimo}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cuantiaAcumulable"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Cuantía acumulable (€)
                  </label>
                  <input
                    type="number"
                    id="cuantiaAcumulable"
                    name="cuantiaAcumulable"
                    value={formData.cuantiaAcumulable}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.cuantiaAcumulable ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.cuantiaAcumulable && (
                    <p className="text-red-500 text-xs mt-1">{errors.cuantiaAcumulable}</p>
                  )}
                </div>
              </div>

              {/* Regla de participación */}
              <div>
                <label
                  htmlFor="reglaParticipacion"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Regla de participación
                </label>
                <input
                  type="text"
                  id="reglaParticipacion"
                  name="reglaParticipacion"
                  value={formData.reglaParticipacion}
                  onChange={handleChange}
                  placeholder="1 cada 20 €"
                  className={`w-full px-4 py-2.5 border ${
                    errors.reglaParticipacion ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
                {errors.reglaParticipacion && (
                  <p className="text-red-500 text-xs mt-1">{errors.reglaParticipacion}</p>
                )}
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              {/* Imagen / Cartel */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Imagen / Cartel (JPG o PNG) *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                  />
                  {formData.imagenNombre ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 truncate">
                        {formData.imagenNombre}
                      </p>
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Cambiar imagen
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isSubmitting}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium inline-flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-4 h-4" />
                      Subir imagen
                    </button>
                  )}
                </div>
                {errors.imagen && (
                  <p className="text-red-500 text-xs mt-1">{errors.imagen}</p>
                )}
              </div>

              {/* Regla de redondeo */}
              <div>
                <label
                  htmlFor="reglaRedondeo"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Regla de redondeo
                </label>
                <input
                  type="text"
                  id="reglaRedondeo"
                  name="reglaRedondeo"
                  value={formData.reglaRedondeo}
                  onChange={handleChange}
                  placeholder="Redondear"
                  className={`w-full px-4 py-2.5 border ${
                    errors.reglaRedondeo ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
                {errors.reglaRedondeo && (
                  <p className="text-red-500 text-xs mt-1">{errors.reglaRedondeo}</p>
                )}
              </div>

              {/* Bases legales */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Bases legales (PDF)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    ref={pdfInputRef}
                    onChange={handlePdfUpload}
                    accept="application/pdf"
                    className="hidden"
                  />
                  <input
                    type="text"
                    readOnly
                    value={formData.basesLegalesNombre || "Seleccionar archivo"}
                    onClick={() => pdfInputRef.current?.click()}
                    placeholder="Seleccionar archivo"
                    className={`w-full px-4 py-2.5 border ${
                      errors.basesLegales ? "border-red-500" : "border-gray-300"
                    } rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                </div>
                {errors.basesLegales && (
                  <p className="text-red-500 text-xs mt-1">{errors.basesLegales}</p>
                )}
              </div>
            </div>
          </div>

          {/* Mensaje de error general */}
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-2.5 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                'Guardar campaña'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

