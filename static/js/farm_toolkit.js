/**
 * farm_toolkit.js - Tabbed Farm Toolkit for Kisan Vaani
 * 1. Crop Calendar (Verified PAU Growth Stages)
 * 2. Crop Symptom Guide (Non-diagnostic reference + KVK Amritsar helpline)
 * 3. Mandi Explorer (Area/Mandi browse with verified market yards & contacts)
 * 4. Produce Quality Guide (AGMARK & Mandi Board standards)
 * 5. Sales & Purchase Ledger (Local browser storage, totals, delete, CSV export)
 */

class FarmToolkit {
  constructor(options = {}) {
    this.container = document.getElementById("farm-toolkit-container");
    this.currentTab = "calendar"; // 'calendar', 'symptoms', 'mandis', 'quality', 'ledger'
    this.currentLang = options.lang || "pa";
    this.onAskQuery = options.onAskQuery || function() {};
    
    // Ledger local storage setup
    this.storageKey = "kisan_vaani_ledger_v1";
    this.ledgerEntries = this.loadLedger();

    // Filters state
    this.selectedCalendarCrop = "wheat";
    this.selectedCalendarStage = "sowing";
    this.selectedSymptomCrop = "all";
    this.selectedQualityProduce = "potato";
    this.selectedQualityTopic = "size";
    this.mandiSearchTerm = "";
  }

  setLanguage(lang) {
    this.currentLang = lang;
    this.render();
  }

  init() {
    this.apiCropCalendar = null;
    this.apiCropSymptoms = null;
    this.apiNearbyMandis = null;
    this.apiProduceQuality = null;
    this.apiSchemes = null;
    this.render();
    this.loadFromApi();
  }

  async loadFromApi() {
    if (!window.kisanApi) return;
    try {
      const [cal, symp, mandis, qual, schemes] = await Promise.allSettled([
        window.kisanApi.getCropCalendar(),
        window.kisanApi.getCropSymptoms(),
        window.kisanApi.getNearbyMandis(),
        window.kisanApi.getProduceQuality(),
        window.kisanApi.getSchemes()
      ]);

      if (cal.status === "fulfilled" && cal.value) this.apiCropCalendar = cal.value;
      if (symp.status === "fulfilled" && symp.value) this.apiCropSymptoms = symp.value;
      if (mandis.status === "fulfilled" && mandis.value && mandis.value.mandis) this.apiNearbyMandis = mandis.value.mandis;
      if (qual.status === "fulfilled" && qual.value) this.apiProduceQuality = qual.value;
      if (schemes.status === "fulfilled" && schemes.value && schemes.value.schemes) this.apiSchemes = schemes.value.schemes;

      this.render();
    } catch (e) {
      console.warn("[FarmToolkit] Live API sync note:", e);
    }
  }

  loadLedger() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn("Could not read localStorage for ledger:", e);
    }
    // Realistic initial verified demo records for Amritsar farmers
    return [
      {
        id: "leg_1",
        type: "sale",
        crop: "Potato (ਨਵਾਂ ਪੁਖਰਾਜ ਆਲੂ)",
        quantity: 40,
        unit: "ਕਵਿੰਟਲ (Qtl)",
        rate: 950,
        total: 38000,
        date: "2026-11-20",
        party: "ਵੱਲ੍ਹਾ ਮੰਡੀ (ਆੜ੍ਹਤੀ ਮਹਿੰਦਰ ਸਿੰਘ)",
        notes: "A-grade 45mm table potato"
      },
      {
        id: "leg_2",
        type: "purchase",
        crop: "DAP Fertilizer (ਡੀ.ਏ.ਪੀ. ਖਾਦ)",
        quantity: 5,
        unit: "ਬੋਰੀ (50kg Bag)",
        rate: 1350,
        total: 6750,
        date: "2026-11-18",
        party: "ਸਹਿਕਾਰੀ ਸਭਾ ਮਜੀਠਾ",
        notes: "Gehu sowing basal application"
      }
    ];
  }

  saveLedger() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.ledgerEntries));
    } catch (e) {
      console.warn("Could not save ledger to localStorage:", e);
    }
  }

  addLedgerEntry(entry) {
    this.ledgerEntries.unshift(entry);
    this.saveLedger();
    this.render();
  }

  deleteLedgerEntry(id) {
    this.ledgerEntries = this.ledgerEntries.filter(e => e.id !== id);
    this.saveLedger();
    this.render();
  }

  exportCSV() {
    if (this.ledgerEntries.length === 0) {
      alert(this.currentLang === 'hinglish' ? 'Ledger is empty! No transactions to export.' : 'ਵਹੀ-ਖਾਤਾ ਖ਼ਾਲੀ ਹੈ! ਐਕਸਪੋਰਟ ਕਰਨ ਲਈ ਕੋਈ ਲੈਣ-ਦੇਣ ਨਹੀਂ ਹੈ।');
      return;
    }

    const headers = ["ID", "Type", "Crop/Item", "Quantity", "Unit", "Rate (Rs)", "Total Amount (Rs)", "Date", "Mandi/Party", "Notes"];
    const rows = this.ledgerEntries.map(e => [
      `"${e.id}"`,
      `"${e.type.toUpperCase()}"`,
      `"${e.crop.replace(/"/g, '""')}"`,
      e.quantity,
      `"${e.unit}"`,
      e.rate,
      e.total,
      `"${e.date}"`,
      `"${(e.party || '').replace(/"/g, '""')}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kisan_vaani_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="toolkit-wrapper-card">
        <!-- Farm Toolkit Navigation Tabs -->
        <div class="toolkit-nav-bar">
          <button class="toolkit-nav-btn ${this.currentTab === 'calendar' ? 'active' : ''}" data-tab="calendar">
            📅 ${this.currentLang === 'hinglish' ? 'Crop Calendar' : (this.currentLang === 'hi' ? 'फसल कैलेंडर' : 'ਫ਼ਸਲ ਕੈਲੰਡਰ')}
          </button>
          <button class="toolkit-nav-btn ${this.currentTab === 'symptoms' ? 'active' : ''}" data-tab="symptoms">
            🔬 ${this.currentLang === 'hinglish' ? 'Symptom Guide' : (this.currentLang === 'hi' ? 'लक्षण निर्देशिका' : 'ਲੱਛਣ ਗਾਈਡ')}
          </button>
          <button class="toolkit-nav-btn ${this.currentTab === 'mandis' ? 'active' : ''}" data-tab="mandis">
            📍 ${this.currentLang === 'hinglish' ? 'Mandi Explorer' : (this.currentLang === 'hi' ? 'मंडी विवरण' : 'ਮੰਡੀ ਐਕਸਪਲੋਰਰ')}
          </button>
          <button class="toolkit-nav-btn ${this.currentTab === 'quality' ? 'active' : ''}" data-tab="quality">
            ⭐ ${this.currentLang === 'hinglish' ? 'Quality Guide' : (this.currentLang === 'hi' ? 'गुणवत्ता मानक' : 'ਗੁਣਵੱਤਾ ਮਾਪਦੰਡ')}
          </button>
          <button class="toolkit-nav-btn ${this.currentTab === 'ledger' ? 'active' : ''}" data-tab="ledger">
            📒 ${this.currentLang === 'hinglish' ? 'Ledger Khata' : (this.currentLang === 'hi' ? 'बही-खाता' : 'ਵਹੀ-ਖਾਤਾ / ਲੇਜ਼ਰ')}
          </button>
        </div>

        <!-- Tab Body Container -->
        <div class="toolkit-content-body">
          ${this.renderActiveTabContent()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderActiveTabContent() {
    switch (this.currentTab) {
      case "calendar":
        return this.renderCalendarTab();
      case "symptoms":
        return this.renderSymptomsTab();
      case "mandis":
        return this.renderMandisTab();
      case "quality":
        return this.renderQualityTab();
      case "ledger":
        return this.renderLedgerTab();
      default:
        return this.renderCalendarTab();
    }
  }

  // 1. CROP CALENDAR TAB
  renderCalendarTab() {
    const calendarData = this.apiCropCalendar || (window.VERIFIED_DATA && window.VERIFIED_DATA.crop_calendar) || {};
    const crops = calendarData.crops || [];
    const currentCropObj = crops.find(c => c.id === this.selectedCalendarCrop) || crops[0] || {};
    const currentStageObj = (currentCropObj.stages && currentCropObj.stages[this.selectedCalendarStage]) || {};

    const cropName = currentCropObj[`name_${this.currentLang}`] || currentCropObj.name_pa || "ਕਣਕ";
    const windowText = currentStageObj[`window_${this.currentLang}`] || currentStageObj.window_pa || "ਢੁਕਵਾਂ ਸਮਾਂ";
    const seedRate = currentStageObj[`seed_rate_${this.currentLang}`] || currentStageObj.seed_rate_pa || "";
    const advice = currentStageObj[`advice_${this.currentLang}`] || currentStageObj.advice_pa || "";

    return `
      <div class="toolkit-panel-content">
        <div class="panel-header-row">
          <div>
            <h4 class="toolkit-panel-title">📅 ${this.currentLang === 'hinglish' ? 'PAU Crop Calendar & Growth Stages' : (this.currentLang === 'hi' ? 'पीएयू फसल कैलेंडर और चरण' : 'ਪੀ.ਏ.ਯੂ. ਫ਼ਸਲ ਕੈਲੰਡਰ ਅਤੇ ਵਿਕਾਸ ਪੜਾਅ')}</h4>
            <span class="toolkit-panel-sub">ਸਰੋਤ: ${calendarData.source || 'PAU ਲੁਧਿਆਣਾ'} • ਅੰਮ੍ਰਿਤਸਰ ਹਾੜੀ-ਸਾਉਣੀ</span>
          </div>
          <button class="btn-toolkit-listen" id="btn-listen-calendar">
            🔊 ${this.currentLang === 'hinglish' ? 'Listen Calendar' : 'ਕੈਲੰਡਰ ਸੁਣੋ'}
          </button>
        </div>

        <div class="toolkit-filter-bar">
          <div class="filter-group">
            <label>${this.currentLang === 'hinglish' ? 'Select Crop:' : (this.currentLang === 'hi' ? 'फसल चुनें:' : 'ਫ਼ਸਲ ਚੁਣੋ:')}</label>
            <select id="cal-crop-select" class="toolkit-select">
              <option value="wheat" ${this.selectedCalendarCrop === 'wheat' ? 'selected' : ''}>🌾 ਕਣਕ (Wheat)</option>
              <option value="potato" ${this.selectedCalendarCrop === 'potato' ? 'selected' : ''}>🥔 ਆਲੂ (Potato)</option>
            </select>
          </div>

          <div class="filter-group">
            <label>${this.currentLang === 'hinglish' ? 'Growth Stage:' : (this.currentLang === 'hi' ? 'विकास चरण:' : 'ਵਿਕਾਸ ਪੜਾਅ:')}</label>
            <div class="stage-button-group">
              <button class="stage-select-btn ${this.selectedCalendarStage === 'sowing' ? 'active' : ''}" data-cal-stage="sowing">
                1. ਬਿਜਾਈ (Sowing)
              </button>
              <button class="stage-select-btn ${this.selectedCalendarStage === 'growing' ? 'active' : ''}" data-cal-stage="growing">
                2. ਫੁਟਾਰਾ (Growing)
              </button>
              <button class="stage-select-btn ${this.selectedCalendarStage === 'harvest' ? 'active' : ''}" data-cal-stage="harvest">
                3. ਕਟਾਈ (Harvest)
              </button>
            </div>
          </div>
        </div>

        <div class="calendar-detail-card">
          <div class="cal-card-top">
            <span class="cal-crop-badge">${cropName}</span>
            <span class="cal-window-badge">📅 ${windowText}</span>
          </div>
          <div class="cal-metrics-grid">
            <div class="cal-metric-box">
              <span class="cal-metric-label">${this.currentLang === 'hinglish' ? 'Seed Rate / Irrigation' : 'ਬੀਜ ਮਾਤਰਾ / ਸਿੰਚਾਈ'}</span>
              <span class="cal-metric-val">${seedRate}</span>
            </div>
            <div class="cal-metric-box">
              <span class="cal-metric-label">${this.currentLang === 'hinglish' ? 'Station / Source' : 'ਖੇਤੀ ਯੂਨੀਵਰਸਿਟੀ'}</span>
              <span class="cal-metric-val">PAU Ludhiana (KVK)</span>
            </div>
          </div>
          <div class="cal-advisory-box">
            <strong>${this.currentLang === 'hinglish' ? 'Recommended Field Operations:' : 'ਖੇਤੀ ਕਾਰਜ ਤੇ ਸਿਫ਼ਾਰਸ਼:'}</strong>
            <p>${advice}</p>
          </div>
        </div>
      </div>
    `;
  }

  // 2. CROP SYMPTOM GUIDE TAB
  renderSymptomsTab() {
    const symptomData = this.apiCropSymptoms || (window.VERIFIED_DATA && window.VERIFIED_DATA.crop_symptoms) || {};
    const items = symptomData.items || [];
    const disclaimer = symptomData[`disclaimer_${this.currentLang}`] || symptomData.disclaimer_pa || "";

    const filteredItems = this.selectedSymptomCrop === "all" 
      ? items 
      : items.filter(i => i.crop === this.selectedSymptomCrop);

    return `
      <div class="toolkit-panel-content">
        <!-- MANDATORY NON-DIAGNOSTIC NOTICE BANNER -->
        <div class="non-diagnostic-alert-banner">
          <div class="alert-icon-col">⚠️</div>
          <div class="alert-text-col">
            <strong>${this.currentLang === 'hinglish' ? 'Non-Diagnostic Advisory Notice:' : (this.currentLang === 'hi' ? 'गैर-नैदानिक परामर्श सूचना:' : 'ਮਹੱਤਵਪੂਰਨ ਸੂਚਨਾ - ਗੈਰ-ਲੈਬ ਮਾਰਗਦਰਸ਼ਨ:') }</strong>
            <p>${disclaimer}</p>
            <div class="helpline-action-row">
              <a href="tel:01832580790" class="btn-helpline-call">
                📞 KVK Amritsar: 0183-2580790
              </a>
              <a href="tel:18001801551" class="btn-helpline-call btn-helpline-secondary">
                📞 Toll-Free Helpline: 1800-180-1551
              </a>
            </div>
          </div>
        </div>

        <div class="panel-header-row">
          <div>
            <h4 class="toolkit-panel-title">🔬 ${this.currentLang === 'hinglish' ? 'Crop Symptom Reference Guide' : (this.currentLang === 'hi' ? 'फसल लक्षण व कीट निर्देशिका' : 'ਫ਼ਸਲ ਲੱਛਣ ਤੇ ਕੀਟ-ਰੋਗ ਗਾਈਡ')}</h4>
            <span class="toolkit-panel-sub">Verified PAU Plant Protection Handbook</span>
          </div>
          <div class="filter-group">
            <select id="symp-crop-select" class="toolkit-select">
              <option value="all" ${this.selectedSymptomCrop === 'all' ? 'selected' : ''}>ਸਾਰੀਆਂ ਫ਼ਸਲਾਂ (All Crops)</option>
              <option value="wheat" ${this.selectedSymptomCrop === 'wheat' ? 'selected' : ''}>🌾 ਕਣਕ (Wheat)</option>
              <option value="potato" ${this.selectedSymptomCrop === 'potato' ? 'selected' : ''}>🥔 ਆਲੂ (Potato)</option>
              <option value="mustard" ${this.selectedSymptomCrop === 'mustard' ? 'selected' : ''}>🌱 ਸਰ੍ਹੋਂ (Mustard)</option>
            </select>
          </div>
        </div>

        <div class="symptoms-card-grid">
          ${filteredItems.length === 0 ? `
            <div class="empty-state-box">
              <p>ਇਸ ਫ਼ਸਲ ਲਈ ਕੋਈ ਪ੍ਰਮਾਣਿਤ ਲੱਛਣ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਕੇ.ਵੀ.ਕੇ. ਅੰਮ੍ਰਿਤਸਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।</p>
            </div>
          ` : filteredItems.map(item => `
            <div class="symptom-card" data-query="${item.crop_name_pa} ${item.symptom_pa}">
              <div class="symptom-card-header">
                <span class="symptom-crop-tag">${item.crop_name_pa}</span>
                <span class="severity-badge ${item.severity.toLowerCase().includes('high') ? 'sev-high' : 'sev-med'}">
                  ${item.severity}
                </span>
              </div>
              <h4 class="symptom-title">${item[`symptom_${this.currentLang}`] || item.symptom_pa}</h4>
              <div class="symptom-cause-row">
                <strong>${this.currentLang === 'hi' ? 'संभावित कारण:' : (this.currentLang === 'hinglish' ? 'Possible Cause:' : 'ਸੰਭਾਵੀ ਕਾਰਨ:')}</strong> ${item[`cause_${this.currentLang}`] || item.cause_pa}
              </div>
              <div class="symptom-remedy-box">
                <strong>${this.currentLang === 'hi' ? 'अनुशंसित उपचार (PAU):' : (this.currentLang === 'hinglish' ? 'Recommended Remedy (PAU):' : 'ਸਿਫ਼ਾਰਸ਼ ਉਪਚਾਰ (PAU):')}</strong>
                <p>${item[`remedy_${this.currentLang}`] || item.remedy_pa}</p>
              </div>
              <button class="btn-ask-symptom" data-query="${item.crop_name_pa} ${item[`symptom_${this.currentLang}`] || item.symptom_pa}">
                <span>🔊</span> <span>${this.currentLang === 'hi' ? 'सुनें और पूछें' : (this.currentLang === 'hinglish' ? 'Listen & Ask' : 'ਸੁਣੋ ਤੇ ਪੁੱਛੋ')}</span>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 3. MANDI EXPLORER TAB
  renderMandisTab() {
    const mandis = this.apiNearbyMandis || (window.VERIFIED_DATA && window.VERIFIED_DATA.nearby_mandis) || [];
    const term = this.mandiSearchTerm.toLowerCase();
    const filtered = mandis.filter(m => 
      (m.name_pa && m.name_pa.toLowerCase().includes(term)) || 
      (m.name_hi && m.name_hi.toLowerCase().includes(term)) ||
      (m.name_en && m.name_en.toLowerCase().includes(term)) ||
      (m.id && m.id.toLowerCase().includes(term))
    );

    const isHi = this.currentLang === 'hi';
    const isHinglish = this.currentLang === 'hinglish';

    const searchPlaceholder = isHinglish ? 'Search mandi (e.g. Vallah, Majitha)...' : (isHi ? 'मंडी खोजें (उदा. वल्लाह, मजीठा)...' : 'ਮੰਡੀ ਦਾ ਨਾਮ ਲੱਭੋ (ਜਿਵੇਂ ਵੱਲ੍ਹਾ, ਮਜੀਠਾ)...');
    const noticeText = isHi 
      ? 'ℹ️ <strong>सूचना (Notice):</strong> इस प्रोटोटाइप में कोई लाइव जीपीएस ट्रैकिंग या लोकेशन ट्रैकिंग नहीं है। सभी आंकड़े पंजाब मंडी बोर्ड व अमृतसर मार्केट कमेटियों द्वारा सत्यापित हैं।'
      : (isHinglish 
        ? 'ℹ️ <strong>Notice:</strong> Prototype uses verified records from Punjab Mandi Board. No live GPS or real-time tracking is implemented.'
        : 'ℹ️ <strong>ਸੂਚਨਾ (Notice):</strong> ਇਸ ਪ੍ਰੋਟੋਟਾਈਪ ਵਿੱਚ ਕੋਈ ਲਾਈਵ GPS ਟਰੈਕਿੰਗ ਜਾਂ ਮੈਪ ਕੁਨੈਕਸ਼ਨ ਨਹੀਂ ਹੈ। ਸਾਰੀ ਜਾਣਕਾਰੀ ਅੰਮ੍ਰਿਤਸਰ ਮਾਰਕਿਟ ਕਮੇਟੀਆਂ ਅਤੇ ਪੰਜਾਬ ਮੰਡੀ ਬੋਰਡ ਦੇ ਪ੍ਰਮਾਣਿਤ ਰਿਕਾਰਡ \'ਤੇ ਆਧਾਰਿਤ ਹੈ।');

    const emptyText = isHi 
      ? 'कोई मंडी नहीं मिली। वल्लाह, मजीठा या रईया मंडी खोजें।'
      : (isHinglish ? 'No mandis found matching search term.' : 'ਕੋਈ ਮੰਡੀ ਨਹੀਂ ਮਿਲੀ। ਵੱਲ੍ਹਾ, ਮਜੀਠਾ ਜਾਂ ਰਈਆ ਮੰਡੀ ਸਰਚ ਕਰੋ।');

    return `
      <div class="toolkit-panel-content">
        <div class="panel-header-row">
          <div>
            <h4 class="toolkit-panel-title">📍 ${isHinglish ? 'Amritsar District Mandis Explorer' : (isHi ? 'अमृतसर जिला मंडियां' : 'ਅੰਮ੍ਰਿਤਸਰ ਜ਼ਿਲ੍ਹਾ ਮੰਡੀਆਂ ਐਕਸਪਲੋਰਰ')}</h4>
            <span class="toolkit-panel-sub">Verified Punjab State Agricultural Marketing Board Yards</span>
          </div>
          <div class="mandi-search-box">
            <input type="text" id="mandi-explorer-search" placeholder="${searchPlaceholder}" value="${this.mandiSearchTerm}">
          </div>
        </div>

        <!-- TRANSPARENT NOTICE: NO FAKE LIVE GPS CLAIM -->
        <div class="mandi-disclaimer-note">
          ${noticeText}
        </div>

        <div class="mandis-card-grid">
          ${filtered.length === 0 ? `
            <div class="empty-state-box">
              <p>${emptyText}</p>
            </div>
          ` : filtered.map(m => {
            const mName = m[`name_${this.currentLang}`] || m.name_pa;
            const mDist = m[`distance_text_${this.currentLang}`] || m.distance_text_pa || m.distance_pa;
            const mTime = m[`timings_${this.currentLang}`] || m.timings_pa;
            const mFac = m[`facilities_${this.currentLang}`] || m.facilities_pa;
            const timingsLabel = isHi ? 'खुलने का समय (Timings):' : (isHinglish ? 'Timings:' : 'ਖੁੱਲ੍ਹਣ ਦਾ ਸਮਾਂ (Timings):');
            const contactLabel = isHi ? 'संपर्क फोन (Contact):' : (isHinglish ? 'Contact Phone:' : 'ਸੰਪਰਕ ਫ਼ੋਨ (Contact):');
            const facLabel = isHi ? 'उपलब्ध सुविधाएं (Facilities):' : (isHinglish ? 'Available Facilities:' : 'ਉਪਲਬਧ ਸਹੂਲਤਾਂ (Facilities):');
            const btnText = isHi ? 'दूरी व समय सुनें' : (isHinglish ? 'Listen Distance & Time' : 'ਦੂਰੀ ਤੇ ਸਮਾਂ ਸੁਣੋ');

            return `
            <div class="mandi-explorer-card">
              <div class="mandi-card-topbar">
                <h4 class="m-title">${mName}</h4>
                <span class="m-distance">📍 ${mDist}</span>
              </div>
              <div class="m-details-grid">
                <div>
                  <span class="m-label">${timingsLabel}</span>
                  <span class="m-val">${mTime}</span>
                </div>
                <div>
                  <span class="m-label">${contactLabel}</span>
                  <span class="m-val"><a href="tel:${m.phone || m.contact_phone}">${m.phone || m.contact_phone}</a></span>
                </div>
              </div>
              <div class="m-facilities-box">
                <strong>${facLabel}</strong>
                <p>${mFac}</p>
              </div>
              <div class="mandi-card-actions">
                <button class="btn-ask-mandi" data-query="${m.name_pa || mName} ਦੀ ਦੂਰੀ ਅਤੇ ਸਮਾਂ">
                  <span>🔊</span> <span>${btnText}</span>
                </button>
              </div>
            </div>
          `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // 4. PRODUCE QUALITY GUIDE TAB
  renderQualityTab() {
    const qualityData = this.apiProduceQuality || (window.VERIFIED_DATA && window.VERIFIED_DATA.produce_quality) || {};
    const items = qualityData.items || [];
    const currentProduce = items.find(p => p.id === this.selectedQualityProduce) || items[0] || {};

    const isHi = this.currentLang === 'hi';
    const isHinglish = this.currentLang === 'hinglish';

    const produceName = currentProduce[`name_${this.currentLang}`] || currentProduce.name_pa || "";
    const sizeSpec = currentProduce[`size_${this.currentLang}`] || currentProduce.size_pa || "";
    const appSpec = currentProduce[`appearance_${this.currentLang}`] || currentProduce.appearance_pa || "";
    const freshSpec = currentProduce[`freshness_${this.currentLang}`] || currentProduce.freshness_pa || "";
    const storeSpec = currentProduce[`storage_${this.currentLang}`] || currentProduce.storage_pa || "";

    const listenBtnText = isHinglish ? 'Listen Standards' : (isHi ? 'गुणवत्ता मानक सुनें' : 'ਗੁਣਵੱਤਾ ਮਾਪਦੰਡ ਸੁਣੋ');
    const potatoPill = isHi ? '🥔 आलू (Potato)' : (isHinglish ? '🥔 Potato' : '🥔 ਆਲੂ (Potato)');
    const basmatiPill = isHi ? '🍚 बासमती 1121' : (isHinglish ? '🍚 Basmati 1121' : '🍚 ਬਾਸਮਤੀ 1121');
    const kinnowPill = isHi ? '🍊 किन्नू (Kinnow)' : (isHinglish ? '🍊 Kinnow' : '🍊 ਕਿੰਨੂ (Kinnow)');

    const sizeHeading = isHi ? 'आकार व ग्रेड (Size & Diameter)' : (isHinglish ? 'Size & Diameter' : 'ਅਕਾਰ ਤੇ ਗ੍ਰੇਡ (Size & Diameter)');
    const appHeading = isHi ? 'रंग-रूप व शुद्धता (Appearance & Purity)' : (isHinglish ? 'Appearance & Purity' : 'ਰੰਗ-ਰੂਪ ਤੇ ਦਿੱਖ (Appearance & Purity)');
    const freshHeading = isHi ? 'ताज़गी व नमी (Moisture & Freshness)' : (isHinglish ? 'Moisture & Freshness' : 'ਤਾਜ਼ਗੀ ਤੇ ਨਮੀ ਮਾਤਰਾ (Moisture & Freshness)');
    const storeHeading = isHi ? 'सुरक्षित भंडारण व कोल्ड स्टोर (Safe Storage)' : (isHinglish ? 'Safe Storage & Handling' : 'ਸੰਭਾਲ ਤੇ ਕੋਲਡ ਸਟੋਰ (Safe Storage)');

    return `
      <div class="toolkit-panel-content">
        <div class="panel-header-row">
          <div>
            <h4 class="toolkit-panel-title">⭐ ${isHinglish ? 'Produce Quality & Grading Standards' : (isHi ? 'उपज गुणवत्ता व ग्रेडिंग मानक' : 'ਫ਼ਸਲ ਕੁਆਲਿਟੀ ਅਤੇ ਮੰਡੀ ਗ੍ਰੇਡਿੰਗ ਮਾਪਦੰਡ')}</h4>
            <span class="toolkit-panel-sub">Source: ${qualityData.source || 'Punjab Mandi Board & AGMARK'} • 20 Nov 2026</span>
          </div>
          <button class="btn-toolkit-listen" id="btn-listen-quality">
            🔊 ${listenBtnText}
          </button>
        </div>

        <!-- Produce selection pills -->
        <div class="produce-quality-pills">
          <button class="prod-pill ${this.selectedQualityProduce === 'potato' ? 'active' : ''}" data-prod="potato">
            ${potatoPill}
          </button>
          <button class="prod-pill ${this.selectedQualityProduce === 'basmati' ? 'active' : ''}" data-prod="basmati">
            ${basmatiPill}
          </button>
          <button class="prod-pill ${this.selectedQualityProduce === 'kinnow' ? 'active' : ''}" data-prod="kinnow">
            ${kinnowPill}
          </button>
        </div>

        <div class="quality-aspects-grid">
          <div class="quality-spec-card">
            <div class="spec-header">
              <span class="spec-icon">📏</span>
              <h5>${sizeHeading}</h5>
            </div>
            <p>${sizeSpec}</p>
          </div>

          <div class="quality-spec-card">
            <div class="spec-header">
              <span class="spec-icon">✨</span>
              <h5>${appHeading}</h5>
            </div>
            <p>${appSpec}</p>
          </div>

          <div class="quality-spec-card">
            <div class="spec-header">
              <span class="spec-icon">💧</span>
              <h5>${freshHeading}</h5>
            </div>
            <p>${freshSpec}</p>
          </div>

          <div class="quality-spec-card">
            <div class="spec-header">
              <span class="spec-icon">❄️</span>
              <h5>${storeHeading}</h5>
            </div>
            <p>${storeSpec}</p>
          </div>
        </div>
      </div>
    `;
  }

  // 5. SALES AND PURCHASE LEDGER TAB
  renderLedgerTab() {
    let totalSales = 0;
    let totalPurchases = 0;

    this.ledgerEntries.forEach(entry => {
      if (entry.type === "sale") {
        totalSales += Number(entry.total) || 0;
      } else {
        totalPurchases += Number(entry.total) || 0;
      }
    });

    const netBalance = totalSales - totalPurchases;

    const isHi = this.currentLang === 'hi';
    const isHinglish = this.currentLang === 'hinglish';

    const bannerText = isHi
      ? 'ℹ️ <strong>बही-खाता सूचना:</strong> यह प्रोटोटाइप आपके सभी लेन-देन केवल इसी ब्राउज़र (Local Storage) में सुरक्षित रखता है। यह किसी बाहरी सर्वर पर सिंक या बैकअप नहीं होता। अपना रिकॉर्ड सुरक्षित रखने के लिए CSV एक्सपोर्ट का उपयोग करें।'
      : (isHinglish
        ? 'ℹ️ <strong>Ledger Notice:</strong> This prototype saves your sales & purchase records only locally in this browser (Local Storage). No records are synced or backed up to any cloud server. Use CSV Export to save your data.'
        : 'ℹ️ <strong>ਵਹੀ-ਖਾਤਾ ਸੂਚਨਾ:</strong> ਇਹ ਪ੍ਰੋਟੋਟਾਈਪ ਤੁਹਾਡੇ ਸਾਰੇ ਲੈਣ-ਦੇਣ ਸਿਰਫ਼ ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ (Local Storage) ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰੱਖਦਾ ਹੈ। ਇਹ ਕਿਸੇ ਕਲਾਉਡ ਸਰਵਰ \'ਤੇ ਬੈਕਅੱਪ ਨਹੀਂ ਹੁੰਦਾ। ਆਪਣਾ ਰਿਕਾਰਡ ਸੰਭਾਲਣ ਲਈ CSV ਐਕਸਪੋਰਟ ਬਟਨ ਵਰਤੋ।');

    const totalSalesLabel = isHi ? 'कुल बिक्री (Total Sales)' : (isHinglish ? 'Total Sales' : 'ਕੁੱਲ ਵਿਕਰੀ (Total Sales)');
    const totalPurchasesLabel = isHi ? 'कुल खरीद (Total Purchases)' : (isHinglish ? 'Total Purchases' : 'ਕੁੱਲ ਖਰੀਦ (Total Purchases)');
    const netBalanceLabel = isHi ? 'शुद्ध बचत (Net Balance)' : (isHinglish ? 'Net Balance' : 'ਸ਼ੁੱਧ ਬੱਚਤ (Net Balance)');

    const formTitle = isHi ? '➕ नया लेन-देन दर्ज करें (New Transaction)' : (isHinglish ? '➕ Add New Transaction' : '➕ ਨਵਾਂ ਲੈਣ-ਦੇਣ ਦਰਜ ਕਰੋ (New Transaction)');
    const typeLabel = isHi ? 'प्रकार (Type):' : (isHinglish ? 'Type:' : 'ਕਿਸਮ (Type):');
    const saleOpt = isHi ? 'बिक्री (Sale)' : (isHinglish ? 'Sale (Becha)' : 'ਵਿਕਰੀ (Sale / ਵੇਚਿਆ)');
    const purchaseOpt = isHi ? 'खरीद (Purchase)' : (isHinglish ? 'Purchase (Kharida)' : 'ਖਰੀਦ (Purchase / ਖਰੀਦਿਆ)');

    const cropLabel = isHi ? 'फसल / वस्तु (Crop / Item):' : (isHinglish ? 'Crop / Commodity:' : 'ਫ਼ਸਲ / ਵਸਤੂ (Crop / Item):');
    const cropPlaceholder = isHi ? 'उदा. नया आलू, गेहूं, बासमती, खाद' : (isHinglish ? 'e.g. Naya Aalu, Gehu, Basmati' : 'ਜਿਵੇਂ ਨਵਾਂ ਆਲੂ, ਕਣਕ, ਬਾਸਮਤੀ, ਖਾਦ');

    const qtyLabel = isHi ? 'मात्रा (Quantity):' : (isHinglish ? 'Quantity:' : 'ਮਾਤਰਾ (Quantity):');
    const unitLabel = isHi ? 'इकाई (Unit):' : (isHinglish ? 'Unit:' : 'ਇਕਾਈ (Unit):');

    const qtlOpt = isHi ? 'क्विंटल (Qtl)' : (isHinglish ? 'Quintal (Qtl)' : 'ਕਵਿੰਟਲ (Qtl)');
    const bagOpt = isHi ? 'बोरी (50kg Bag)' : (isHinglish ? 'Bag (50kg)' : 'ਬੋਰੀ (50kg Bag)');
    const kgOpt = isHi ? 'किलो (Kg)' : (isHinglish ? 'Kilogram (Kg)' : 'ਕਿਲੋ (Kg)');
    const boxOpt = isHi ? 'पेटी (Box)' : (isHinglish ? 'Box (Peti)' : 'ਪੇਟੀ (Box)');

    const rateLabel = isHi ? 'भाव / दर (₹ प्रति इकाई):' : (isHinglish ? 'Rate (₹ per unit):' : 'ਭਾਅ / ਰੇਟ (₹ per unit):');
    const dateLabel = isHi ? 'दिनांक (Date):' : (isHinglish ? 'Date:' : 'ਮਿਤੀ (Date):');
    const partyLabel = isHi ? 'मंडी / आढ़ती / खरीदार (वैकल्पिक):' : (isHinglish ? 'Mandi / Buyer (Optional):' : 'ਮੰਡੀ / ਵਪਾਰੀ / ਆੜ੍ਹਤੀ (Mandi / Counterparty - Optional):');
    const partyPlaceholder = isHi ? 'उदा. वल्लाह मंडी, आढ़ती का नाम' : (isHinglish ? 'e.g. Vallah Mandi, Trader Name' : 'ਜਿਵੇਂ ਵੱਲ੍ਹਾ ਮੰਡੀ, ਆੜ੍ਹਤੀ ਨਾਮ');
    const submitBtn = isHi ? '➕ खाते में जोड़ें (Save Entry)' : (isHinglish ? '➕ Save Transaction' : '➕ ਖਾਤੇ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ (Save Entry)');

    const tableTitle = isHi ? `सुरक्षित रिकॉर्ड (${this.ledgerEntries.length})` : (isHinglish ? `Saved Records (${this.ledgerEntries.length})` : `ਸੁਰੱਖਿਅਤ ਇੰਦਰਾਜ (Saved Records: ${this.ledgerEntries.length})`);
    const exportCsvBtn = isHi ? '📥 CSV फाइल निर्यात (Export CSV)' : (isHinglish ? '📥 Export CSV File' : '📥 CSV ਫਾਈਲ ਐਕਸਪੋਰਟ (Export CSV)');

    const thType = isHi ? 'प्रकार' : (isHinglish ? 'Type' : 'ਕਿਸਮ');
    const thCrop = isHi ? 'फसल' : (isHinglish ? 'Crop' : 'ਫ਼ਸਲ / ਵਸਤੂ');
    const thQty = isHi ? 'मात्रा व इकाई' : (isHinglish ? 'Qty & Unit' : 'ਮਾਤਰਾ ਤੇ ਇਕਾਈ');
    const thRate = isHi ? 'भाव (₹)' : (isHinglish ? 'Rate (₹)' : 'ਰੇਟ (₹)');
    const thTotal = isHi ? 'कुल राशि (₹)' : (isHinglish ? 'Total (₹)' : 'ਕੁੱਲ ਰਕਮ (₹)');
    const thDate = isHi ? 'दिनांक' : (isHinglish ? 'Date' : 'ਮਿਤੀ');
    const thParty = isHi ? 'मंडी / आढ़ती' : (isHinglish ? 'Mandi / Trader' : 'ਮੰਡੀ / ਆੜ੍ਹਤੀ');
    const thAction = isHi ? 'कार्रवाई' : (isHinglish ? 'Action' : 'ਕਾਰਵਾਈ');
    const deleteBtnText = isHi ? '🗑️ हटाएं' : (isHinglish ? '🗑️ Delete' : '🗑️ ਹਟਾਓ');

    const emptyText = isHi
      ? 'बही-खाता खाली है। ऊपर दिए गए फॉर्म से अपनी बिक्री या खरीद जोड़ें।'
      : (isHinglish
        ? 'Ledger is empty. Use the form above to record sales or purchases.'
        : 'ਵਹੀ-ਖਾਤੇ ਵਿੱਚ ਕੋਈ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ। ਉੱਪਰ ਵਾਲੇ ਫਾਰਮ ਰਾਹੀਂ ਆਪਣੀ ਵਿਕਰੀ ਜਾਂ ਖਰੀਦ ਦਰਜ ਕਰੋ।');

    return `
      <div class="toolkit-panel-content">
        <!-- LOCAL STORAGE NOTICE BANNER -->
        <div class="ledger-storage-banner">
          ${bannerText}
        </div>

        <!-- Ledger Financial Summary Cards -->
        <div class="ledger-summary-row">
          <div class="ledger-stat-card stat-sales">
            <span class="stat-label">${totalSalesLabel}</span>
            <span class="stat-amount">₹${totalSales.toLocaleString('en-IN')}</span>
          </div>
          <div class="ledger-stat-card stat-purchases">
            <span class="stat-label">${totalPurchasesLabel}</span>
            <span class="stat-amount">₹${totalPurchases.toLocaleString('en-IN')}</span>
          </div>
          <div class="ledger-stat-card stat-balance ${netBalance >= 0 ? 'bal-positive' : 'bal-negative'}">
            <span class="stat-label">${netBalanceLabel}</span>
            <span class="stat-amount">${netBalance >= 0 ? '+' : ''}₹${netBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <!-- New Transaction Input Form -->
        <div class="ledger-form-card">
          <h5 class="form-title">${formTitle}</h5>
          <form id="ledger-add-form" class="ledger-grid-form">
            <div class="form-col">
              <label>${typeLabel}</label>
              <select id="leg-type" class="form-input">
                <option value="sale">${saleOpt}</option>
                <option value="purchase">${purchaseOpt}</option>
              </select>
            </div>

            <div class="form-col">
              <label>${cropLabel}</label>
              <input type="text" id="leg-crop" class="form-input" placeholder="${cropPlaceholder}" required>
            </div>

            <div class="form-col">
              <label>${qtyLabel}</label>
              <input type="number" step="0.1" id="leg-qty" class="form-input" placeholder="e.g. 50" required>
            </div>

            <div class="form-col">
              <label>${unitLabel}</label>
              <select id="leg-unit" class="form-input">
                <option value="ਕਵਿੰਟਲ (Qtl)">${qtlOpt}</option>
                <option value="ਬੋਰੀ (Bag 50kg)">${bagOpt}</option>
                <option value="ਕਿਲੋ (Kg)">${kgOpt}</option>
                <option value="ਪੇਟੀ (Box)">${boxOpt}</option>
              </select>
            </div>

            <div class="form-col">
              <label>${rateLabel}</label>
              <input type="number" step="0.5" id="leg-rate" class="form-input" placeholder="e.g. 950" required>
            </div>

            <div class="form-col">
              <label>${dateLabel}</label>
              <input type="date" id="leg-date" class="form-input" value="${new Date().toISOString().slice(0, 10)}" required>
            </div>

            <div class="form-col" style="grid-column: span 2;">
              <label>${partyLabel}</label>
              <input type="text" id="leg-party" class="form-input" placeholder="${partyPlaceholder}">
            </div>

            <div class="form-actions-col" style="grid-column: span 2;">
              <button type="submit" class="btn-ledger-add">
                ${submitBtn}
              </button>
            </div>
          </form>
        </div>

        <!-- Entries Table & CSV Export Action -->
        <div class="ledger-table-header">
          <h5>${tableTitle}</h5>
          <button id="btn-export-csv" class="btn-export-csv" title="Download CSV Spreadsheet">
            ${exportCsvBtn}
          </button>
        </div>

        <div class="ledger-table-responsive">
          ${this.ledgerEntries.length === 0 ? `
            <div class="empty-state-box">
              <p>${emptyText}</p>
            </div>
          ` : `
            <table class="ledger-data-table">
              <thead>
                <tr>
                  <th>${thType}</th>
                  <th>${thCrop}</th>
                  <th>${thQty}</th>
                  <th>${thRate}</th>
                  <th>${thTotal}</th>
                  <th>${thDate}</th>
                  <th>${thParty}</th>
                  <th>${thAction}</th>
                </tr>
              </thead>
              <tbody>
                ${this.ledgerEntries.map(e => `
                  <tr>
                    <td>
                      <span class="ledger-tag ${e.type === 'sale' ? 'tag-sale' : 'tag-purchase'}">
                        ${e.type === 'sale' ? (isHi ? 'बिक्री (Sale)' : (isHinglish ? 'Sale' : 'ਵਿਕਰੀ (Sale)')) : (isHi ? 'खरीद (Buy)' : (isHinglish ? 'Buy' : 'ਖਰੀਦ (Buy)'))}
                      </span>
                    </td>
                    <td><strong>${e.crop}</strong></td>
                    <td>${e.quantity} ${e.unit}</td>
                    <td>₹${e.rate}</td>
                    <td><strong style="color: ${e.type === 'sale' ? '#059669' : '#1E3A8A'};">₹${Number(e.total).toLocaleString('en-IN')}</strong></td>
                    <td>${e.date}</td>
                    <td>${e.party || '-'}</td>
                    <td>
                      <button class="btn-delete-entry" data-id="${e.id}" title="Delete Entry">
                        ${deleteBtnText}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Navigation Tabs
    this.container.querySelectorAll(".toolkit-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentTab = btn.dataset.tab;
        this.render();
      });
    });

    // Calendar Tab Events
    const calCropSelect = this.container.querySelector("#cal-crop-select");
    if (calCropSelect) {
      calCropSelect.addEventListener("change", (e) => {
        this.selectedCalendarCrop = e.target.value;
        this.render();
      });
    }

    this.container.querySelectorAll(".stage-select-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedCalendarStage = btn.dataset.calStage;
        this.render();
      });
    });

    const listenCalBtn = this.container.querySelector("#btn-listen-calendar");
    if (listenCalBtn) {
      listenCalBtn.addEventListener("click", () => {
        const cropObj = VERIFIED_DATA.crop_calendar.crops.find(c => c.id === this.selectedCalendarCrop);
        const name = cropObj ? cropObj.name_pa : "ਕਣਕ";
        this.onAskQuery(`${name} ਕੈਲੰਡਰ ਅਤੇ ਬਿਜਾਈ ਸਮਾਂ`);
      });
    }

    // Symptoms Tab Events
    const sympSelect = this.container.querySelector("#symp-crop-select");
    if (sympSelect) {
      sympSelect.addEventListener("change", (e) => {
        this.selectedSymptomCrop = e.target.value;
        this.render();
      });
    }

    this.container.querySelectorAll(".btn-ask-symptom").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.onAskQuery(btn.dataset.query);
      });
    });

    // Mandi Explorer Events
    const mandiSearch = this.container.querySelector("#mandi-explorer-search");
    if (mandiSearch) {
      mandiSearch.addEventListener("input", (e) => {
        this.mandiSearchTerm = e.target.value;
        this.render();
      });
    }

    this.container.querySelectorAll(".btn-ask-mandi").forEach(btn => {
      btn.addEventListener("click", () => {
        this.onAskQuery(btn.dataset.query);
      });
    });

    // Quality Tab Events
    this.container.querySelectorAll(".prod-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedQualityProduce = btn.dataset.prod;
        this.render();
      });
    });

    const listenQualityBtn = this.container.querySelector("#btn-listen-quality");
    if (listenQualityBtn) {
      listenQualityBtn.addEventListener("click", () => {
        const item = VERIFIED_DATA.produce_quality.items.find(i => i.id === this.selectedQualityProduce);
        const name = item ? item.name_pa : "ਆਲੂ";
        this.onAskQuery(`${name} ਗ੍ਰੇਡਿੰਗ ਅਤੇ ਕੁਆਲਿਟੀ ਮਾਪਦੰਡ`);
      });
    }

    // Ledger Form Events
    const addForm = this.container.querySelector("#ledger-add-form");
    if (addForm) {
      addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = this.container.querySelector("#leg-type").value;
        const crop = this.container.querySelector("#leg-crop").value.trim();
        const qty = parseFloat(this.container.querySelector("#leg-qty").value) || 0;
        const unit = this.container.querySelector("#leg-unit").value;
        const rate = parseFloat(this.container.querySelector("#leg-rate").value) || 0;
        const date = this.container.querySelector("#leg-date").value;
        const party = this.container.querySelector("#leg-party").value.trim();

        if (!crop || qty <= 0 || rate <= 0) {
          alert("ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੀ ਜਾਣਕਾਰੀ ਸਹੀ ਭਰੋ।");
          return;
        }

        const total = Math.round(qty * rate);
        const newEntry = {
          id: "leg_" + Date.now(),
          type,
          crop,
          quantity: qty,
          unit,
          rate,
          total,
          date,
          party
        };

        this.addLedgerEntry(newEntry);
      });
    }

    // Ledger Delete Buttons
    this.container.querySelectorAll(".btn-delete-entry").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (confirm("ਕੀ ਤੁਸੀਂ ਇਹ ਐਂਟਰੀ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?")) {
          this.deleteLedgerEntry(id);
        }
      });
    });

    // Export CSV
    const exportBtn = this.container.querySelector("#btn-export-csv");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.exportCSV();
      });
    }
  }
}

// Global expose
window.FarmToolkit = FarmToolkit;