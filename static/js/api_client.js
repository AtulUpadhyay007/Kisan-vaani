/**
 * api_client.js - Unified API Service for Kisan Vaani
 * All frontend workflows (Voice Assistant, Mandi Rates, Weather Alerts,
 * Farm Toolkit, Crop Growth Explorer, IVR Simulator, and Dataset Inspector)
 * execute through these verified REST API endpoints.
 * Includes automatic graceful fallback to client cache when running in offline mode.
 */

class KisanApiClient {
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
    this.isOnline = null;
    this.cachedData = {};
  }

  /**
   * Generic JSON fetcher with error handling
   */
  async fetchJson(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          ...(options.headers || {})
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status} on ${endpoint}`);
      }

      const data = await response.json();
      this.isOnline = true;
      return data;
    } catch (err) {
      console.warn(`[KisanApi] Network request failed for ${endpoint}:`, err.message);
      this.isOnline = false;
      throw err;
    }
  }

  // =========================================================================
  // API WORKFLOW ENDPOINTS
  // =========================================================================

  /**
   * 1. Health & Server Status Workflow
   * GET /api/health
   */
  async getHealth() {
    return this.fetchJson("/api/health");
  }

  /**
   * 2. Grounded Voice & Text Query Workflow
   * POST /api/query
   */
  async query(queryText, lang = "pa") {
    return this.fetchJson("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryText, lang: lang })
    });
  }

  /**
   * 3. Mandi Rates & Arrivals Workflow
   * GET /api/mandis
   */
  async getMandis() {
    try {
      const data = await this.fetchJson("/api/mandis");
      this.cachedData["mandis"] = data;
      return data;
    } catch (err) {
      if (window.VERIFIED_DATA && window.VERIFIED_DATA.mandis) {
        return { prices: window.VERIFIED_DATA.mandis, source: "Offline Client Cache" };
      }
      throw err;
    }
  }

  /**
   * 4. Weather Observations & Advisory Workflow
   * GET /api/weather
   */
  async getWeather() {
    try {
      const data = await this.fetchJson("/api/weather");
      this.cachedData["weather"] = data;
      return data;
    } catch (err) {
      if (window.VERIFIED_DATA && window.VERIFIED_DATA.weather) {
        const w = window.VERIFIED_DATA.weather;
        if (!w.current) {
          w.current = {
            temperature_c: w.temperature_c || 14,
            temp_min_c: w.temp_min_c || 13,
            temp_max_c: w.temp_max_c || 24,
            condition_pa: w.condition_pa || "ਸਵੇਰ ਦੀ ਧੁੰਦ ਤੇ ਕੋਹਰਾ",
            condition_hi: w.condition_hi || "सुबह की धुंध व हल्का कोहरा",
            condition_hinglish: w.condition_hinglish || "Mist / Fog",
            humidity_percent: parseInt(w.humidity) || 82,
            wind_speed_kmh: w.wind_kmh || 4,
            wind_direction: w.wind_direction || "ਪੂਰਬ (East)",
            rain_probability_percent: parseInt(w.rain_probability) || 0,
            rain_probability_pct: parseInt(w.rain_probability) || 0
          };
        }
        return w;
      }
      throw err;
    }
  }

  /**
   * 5. Real-Time Weather Alerts Workflow
   * GET /api/weather_alerts
   */
  async getWeatherAlerts() {
    try {
      return await this.fetchJson("/api/weather_alerts");
    } catch (err) {
      if (window.VERIFIED_DATA && window.VERIFIED_DATA.weather) {
        const w = window.VERIFIED_DATA.weather;
        return {
          location: w.location,
          source: w.source_name,
          last_updated: w.last_updated_pa,
          alerts: w.alerts || {},
          current: w.current || {}
        };
      }
      throw err;
    }
  }

  /**
   * 6. PAU Crop Calendar & Growth Stages Workflow
   * GET /api/crop_calendar
   */
  async getCropCalendar() {
    try {
      const data = await this.fetchJson("/api/crop_calendar");
      this.cachedData["crop_calendar"] = data;
      return data;
    } catch (err) {
      if (window.VERIFIED_DATA && window.VERIFIED_DATA.crop_calendar) {
        return window.VERIFIED_DATA.crop_calendar;
      }
      throw err;
    }
  }

  /**
   * 7. Crop Symptom Guide & Plant Protection Workflow
   * GET /api/crop_symptoms
   */
  async getCropSymptoms() {
    try {
      const data = await this.fetchJson("/api/crop_symptoms");
      this.cachedData["crop_symptoms"] = data;
      return data;
    } catch (err) {
      if (window.VERIFIED_DATA && window.VERIFIED_DATA.crop_symptoms) {
        return window.VERIFIED_DATA.crop_symptoms;
      }
      throw err;
    }
  }

  /**
   * 8. Nearby Amritsar Mandis Directory Workflow
   * GET /api/nearby_mandis
   */
  async getNearbyMandis() {
    try {
      const data = await this.fetchJson("/api/nearby_mandis");
      this.cachedData["nearby_mandis"] = data;
      return data;
    } catch (err) {
      if (window.VERIFIED_DATA && window.VERIFIED_DATA.nearby_mandis) {
        return { mandis: window.VERIFIED_DATA.nearby_mandis };
      }
      throw err;
    }
  }

  /**
   * 9. Produce Quality & AGMARK Standards Workflow
   * GET /api/produce_quality
   */
  async getProduceQuality() {
    try {
      const data = await this.fetchJson("/api/produce_quality");
      this.cachedData["produce_quality"] = data;
      return data;
    } catch (err) {
      if (window.VERIFIED_DATA && window.VERIFIED_DATA.produce_quality) {
        return window.VERIFIED_DATA.produce_quality;
      }
      throw err;
    }
  }

  /**
   * 10. Government Schemes & Subsidies Workflow
   * GET /api/schemes
   */
  async getSchemes() {
    try {
      const data = await this.fetchJson("/api/schemes");
      this.cachedData["schemes"] = data;
      return data;
    } catch (err) {
      if (window.VERIFIED_DATA && window.VERIFIED_DATA.schemes) {
        return { schemes: window.VERIFIED_DATA.schemes };
      }
      throw err;
    }
  }

  /**
   * 11. General PAU Crop Advice Workflow
   * GET /api/crop_advice
   */
  async getCropAdvice() {
    try {
      const data = await this.fetchJson("/api/crop_advice");
      this.cachedData["crop_advice"] = data;
      return data;
    } catch (err) {
      if (window.VERIFIED_DATA && window.VERIFIED_DATA.crop_advice) {
        return { crops: window.VERIFIED_DATA.crop_advice };
      }
      throw err;
    }
  }

  /**
   * 12. Keypad Phone IVR Simulator Workflow
   * POST /api/ivr_digit
   */
  async sendIvrDigit(digit, lang = "pa") {
    return this.fetchJson("/api/ivr_digit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ digit: digit, lang: lang })
    });
  }

  /**
   * 13. Raw Dataset Transparency Inspector Workflow
   * GET /api/raw_dataset/<name>
   */
  async getRawDataset(name) {
    return this.fetchJson(`/api/raw_dataset/${name}`);
  }
}

// Expose globally
window.kisanApi = new KisanApiClient();
