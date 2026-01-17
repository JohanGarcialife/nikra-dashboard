'use client'

/**
 * Caché simple para almacenar campañas y evitar múltiples consultas
 * Implementa el patrón Singleton para mantener una única instancia
 */
class CampaignsCache {
  constructor() {
    this.campaigns = null;
    this.loadingPromise = null;
    this.lastFetch = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutos en milisegundos
  }

  /**
   * Verificar si el caché es válido
   * @returns {boolean} - true si el caché es válido, false si necesita actualizarse
   */
  isValid() {
    if (!this.campaigns || !this.lastFetch) {
      return false;
    }
    const now = Date.now();
    return (now - this.lastFetch) < this.cacheExpiry;
  }

  /**
   * Obtener campañas del caché si son válidas
   * @returns {Array|null} - Array de campañas o null si el caché no es válido
   */
  get() {
    if (this.isValid()) {
      return this.campaigns;
    }
    return null;
  }

  /**
   * Establecer campañas en el caché
   * @param {Array} campaigns - Array de campañas a almacenar
   */
  set(campaigns) {
    this.campaigns = campaigns;
    this.lastFetch = Date.now();
  }

  /**
   * Limpiar el caché
   */
  clear() {
    this.campaigns = null;
    this.lastFetch = null;
    this.loadingPromise = null;
  }

  /**
   * Obtener la promesa de carga en curso (si existe)
   * @returns {Promise|null} - Promesa de carga o null
   */
  getLoadingPromise() {
    return this.loadingPromise;
  }

  /**
   * Establecer la promesa de carga en curso
   * @param {Promise} promise - Promesa de carga
   */
  setLoadingPromise(promise) {
    this.loadingPromise = promise;
  }

  /**
   * Limpiar la promesa de carga
   */
  clearLoadingPromise() {
    this.loadingPromise = null;
  }
}

// Instancia única del caché (Singleton)
const campaignsCache = new CampaignsCache();

export default campaignsCache;
