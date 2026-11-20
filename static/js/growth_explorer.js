/**
 * growth_explorer.js - Crop Growth Explorer for Kisan Vaani
 * Interactive field visual with Sowing, Growing, and Harvest stages.
 * Labeled clearly as decorative/illustrative art.
 * Returns stage-specific advice strictly grounded in verified PAU records.
 */

class CropGrowthExplorer {
  constructor(options = {}) {
    this.container = document.getElementById("crop-growth-container");
    this.currentCrop = "wheat";
    this.currentStage = "growing"; // 'sowing', 'growing', 'harvest'
    this.currentLang = options.lang || "pa";
    this.onAskAdvice = options.onAskAdvice || function() {};
    
    this.cropStagesData = {
      wheat: {
        name_pa: "ਕਣਕ (Wheat)",
        name_hi: "गेहूं (Wheat)",
        name_hinglish: "Gehu / Kanak",
        stages: {
          sowing: {
            title_pa: "ਬਿਜਾਈ ਪੜਾਅ (Sowing Stage)",
            title_hi: "बुवाई चरण (Sowing Stage)",
            title_hinglish: "Sowing Stage (Buwai)",
            timing_pa: "25 ਅਕਤੂਬਰ ਤੋਂ 15 ਨਵੰਬਰ",
            timing_hi: "25 अक्टूबर से 15 नवंबर",
            timing_hinglish: "25 Oct to 15 Nov",
            visual_desc_pa: "ਨਰਮ ਪੁੰਗਰਦਾ ਪੌਦਾ (ਕੱਲਾ) ਜ਼ਮੀਨ ਵਿੱਚੋਂ ਨਿਕਲਦਾ ਹੋਇਆ",
            advice_query: "ਕਣਕ ਬਿਜਾਈ ਅਤੇ ਬੀਜ ਸੋਧ ਦੀ ਸਲਾਹ",
            highlights_pa: "ਬੀਜ ਦੀ ਮਾਤਰਾ: 40-45 ਕਿਲੋ/ਏਕੜ। ਰੈਕਸਿਲ 2 ਗ੍ਰਾਮ ਨਾਲ ਬੀਜ-ਸੋਧ ਕਰੋ। ਬਿਜਾਈ ਵੇਲੇ 1 ਬੋਰੀ ਡੀ.ਏ.ਪੀ. ਪਾਓ।",
            highlights_hi: "बीज दर: 40-45 किग्रा/एकड़। बीजोपचार करें। 1 बैग डीएपी डालें।",
            highlights_hinglish: "Seed rate: 40-45 kg/acre. Seed treatment with Raxil. 1 bag DAP per acre."
          },
          growing: {
            title_pa: "ਵਿਕਾਸ ਤੇ ਫੁਟਾਰਾ (Growing / Tillering)",
            title_hi: "बढ़वार व फुटाव (Tillering)",
            title_hinglish: "Growing / Tillering Stage",
            timing_pa: "ਬਿਜਾਈ ਤੋਂ 20 ਤੋਂ 55 ਦਿਨ",
            timing_hi: "बुवाई के 20 से 55 दिन",
            timing_hinglish: "20 to 55 days after sowing",
            visual_desc_pa: "ਹਰੀ ਭਰੀ ਕਣਕ ਦੇ ਬੂਟੇ ਅਤੇ ਫੁਟਾਰਾ (CRI ਸਟੇਜ)",
            advice_query: "ਕਣਕ ਪਹਿਲਾ ਕੋਰ ਪਾਣੀ ਅਤੇ ਯੂਰੀਆ ਸਲਾਹ",
            highlights_pa: "21ਵੇਂ ਦਿਨ ਪਹਿਲਾ ਕੋਰ ਪਾਣੀ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ। ਪਾਣੀ ਨਾਲ 45 ਕਿਲੋ ਯੂਰੀਆ ਪਾਓ। ਗੁੱਲੀ ਡੰਡੇ ਦੀ ਰੋਕਥਾਮ ਕਰੋ।",
            highlights_hi: "21वें दिन पहला पानी (CRI) लगाएं। 45 किग्रा यूरिया डालें। गुल्ली डंडा नियंत्रण करें।",
            highlights_hinglish: "First irrigation at 21 days (CRI stage) is critical. Apply 45 kg urea."
          },
          harvest: {
            title_pa: "ਪੱਕਣ ਤੇ ਕਟਾਈ (Harvesting Stage)",
            title_hi: "पकने और कटाई (Harvesting)",
            title_hinglish: "Harvesting Stage (Katai)",
            timing_pa: "10 ਅਪ੍ਰੈਲ ਤੋਂ 30 ਅਪ੍ਰੈਲ",
            timing_hi: "10 अप्रैल से 30 अप्रैल",
            timing_hinglish: "10 April to 30 April",
            visual_desc_pa: "ਸੁਨਹਿਰੀ ਪੱਕੇ ਸਿੱਟੇ (ਸੁੱਕੇ ਦਾਣੇ <12% ਨਮੀ)",
            advice_query: "ਕਣਕ ਕਟਾਈ ਅਤੇ ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ",
            highlights_pa: "ਨਮੀ 12% ਤੋਂ ਘੱਟ ਹੋਣ 'ਤੇ ਦੁਪਹਿਰ ਸਮੇਂ ਕੰਬਾਈਨ ਨਾਲ ਕਟਾਈ ਕਰੋ। ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ ਲਈ ਸੁਪਰ ਐਸ.ਐਮ.ਐਸ. ਵਰਤੋ।",
            highlights_hi: "नमी 12% से कम होने पर दोपहर में कटाई करें। सुपर एसएमएस लगाएं।",
            highlights_hinglish: "Harvest when moisture <12% during sunny afternoon. Use Super SMS."
          }
        }
      },
      potato: {
        name_pa: "ਆਲੂ (Potato)",
        name_hi: "आलू (Potato)",
        name_hinglish: "Potato (Aalu)",
        stages: {
          sowing: {
            title_pa: "ਬਿਜਾਈ / ਲਵਾਈ (Planting)",
            title_hi: "बुवाई / रोपाई (Planting)",
            title_hinglish: "Planting Stage",
            timing_pa: "25 ਸਤੰਬਰ ਤੋਂ 15 ਅਕਤੂਬਰ",
            timing_hi: "25 सितंबर से 15 अक्टूबर",
            timing_hinglish: "25 Sept to 15 Oct",
            visual_desc_pa: "ਖੇਤ ਵਿੱਚ ਕੂੜ੍ਹਾਂ ਉੱਤੇ ਆਲੂ ਦੇ ਬੀਜ ਲਗਾਏ ਗਏ",
            advice_query: "ਆਲੂ ਬਿਜਾਈ ਅਤੇ ਬੀਜ ਮਾਤਰਾ",
            highlights_pa: "12-15 ਕਵਿੰਟਲ ਬੀਜ ਪ੍ਰਤੀ ਏਕੜ। ਕੂੜ੍ਹਾਂ ਵਿੱਚ 60 ਸੈ.ਮੀ. ਅਤੇ ਬੂਟਿਆਂ ਵਿੱਚ 20 ਸੈ.ਮੀ. ਫਾਸਲਾ।",
            highlights_hi: "12-15 क्विंटल बीज प्रति एकड़। पंक्तियों में 60 सेमी दूरी।",
            highlights_hinglish: "12-15 Qtl seed per acre. 60cm row spacing."
          },
          growing: {
            title_pa: "ਵਿਕਾਸ ਤੇ ਮਿੱਟੀ ਚੜ੍ਹਾਉਣਾ (Earthing-up)",
            title_hi: "बढ़वार व मिट्टी चढ़ाना",
            title_hinglish: "Growing & Earthing-up",
            timing_pa: "ਬਿਜਾਈ ਤੋਂ 25-30 ਦਿਨ ਬਾਅਦ",
            timing_hi: "बुवाई के 25-30 दिन बाद",
            timing_hinglish: "25-30 days after planting",
            visual_desc_pa: "ਹਰੀਆਂ ਵੇਲਾਂ ਅਤੇ ਝੁਲਸਾ ਰੋਗ ਤੋਂ ਬਚਾਅ ਸਪਰੇਅ",
            advice_query: "ਆਲੂ ਝੁਲਸਾ ਰੋਗ ਅਤੇ ਮਿੱਟੀ ਚੜ੍ਹਾਉਣਾ",
            highlights_pa: "ਆਲੂਆਂ 'ਤੇ ਮਿੱਟੀ ਚੜ੍ਹਾਓ। ਧੁੰਦ ਦੌਰਾਨ ਪਿਛੇਤਾ ਝੁਲਸਾ ਰੋਕਣ ਲਈ ਇੰਡੋਫਿਲ ਐਮ-45 ਛਿੜਕੋ।",
            highlights_hi: "मिट्टी चढ़ाएं और झुलसा रोग से बचाव हेतु इंडोफिल एम-45 छिड़कें।",
            highlights_hinglish: "Earthing-up tubers. Spray Indofil M-45 to protect against late blight."
          },
          harvest: {
            title_pa: "ਪੁਟਾਈ (Digging / Harvesting)",
            title_hi: "खुदाई व तुड़ाई (Harvesting)",
            title_hinglish: "Digging Stage",
            timing_pa: "ਦਸੰਬਰ (ਨਵਾਂ ਆਲੂ) ਤੋਂ ਫਰਵਰੀ (ਪੱਕਾ)",
            timing_hi: "दिसंबर से फरवरी",
            timing_hinglish: "Dec (Fresh) to Feb (Mature)",
            visual_desc_pa: "ਸਖ਼ਤ ਛਿਲਕੇ ਵਾਲੇ ਆਲੂ ਜ਼ਮੀਨ ਵਿੱਚੋਂ ਪੁੱਟੇ ਗਏ",
            advice_query: "ਆਲੂ ਪੁਟਾਈ ਅਤੇ ਕੋਲਡ ਸਟੋਰ ਸੰਭਾਲ",
            highlights_pa: "ਪੁਟਾਈ ਤੋਂ 10 ਦਿਨ ਪਹਿਲਾਂ ਵੇਲਾਂ ਕੱਟੋ। ਛਿਲਕਾ ਸਖ਼ਤ ਹੋਣ 'ਤੇ ਪੁਟਾਈ ਕਰੋ। ਧੁੱਪ ਵਿੱਚ ਜ਼ਿਆਦਾ ਦੇਰ ਨਾ ਰੱਖੋ।",
            highlights_hi: "खुदाई से पहले बेलें काटें। छिलका कड़ा होने पर निकालें।",
            highlights_hinglish: "Cut haulms 10 days before digging to cure peel. Store in shade."
          }
        }
      }
    };
  }

  setLanguage(lang) {
    this.currentLang = lang;
    this.render();
  }

  init() {
    this.render();
  }

  setCrop(cropId) {
    if (this.cropStagesData[cropId]) {
      this.currentCrop = cropId;
      this.render();
    }
  }

  setStage(stageId) {
    this.currentStage = stageId;
    this.render();
  }

  render() {
    if (!this.container) return;

    const cropObj = this.cropStagesData[this.currentCrop] || this.cropStagesData.wheat;
    const stageObj = cropObj.stages[this.currentStage] || cropObj.stages.growing;

    const titleText = stageObj[`title_${this.currentLang}`] || stageObj.title_pa;
    const timingText = stageObj[`timing_${this.currentLang}`] || stageObj.timing_pa;
    const highlights = stageObj[`highlights_${this.currentLang}`] || stageObj.highlights_pa;

    // SVG illustrations based on current stage
    let svgGraphic = "";
    if (this.currentStage === "sowing") {
      svgGraphic = `
        <g class="stage-sowing-art">
          <!-- Soil bed -->
          <path d="M10 170 Q 150 155 300 170 T 590 165 L 590 220 L 10 220 Z" fill="#78350F" opacity="0.9" />
          <path d="M10 185 Q 200 175 400 185 T 590 180 L 590 220 L 10 220 Z" fill="#451A03" />
          <!-- Seed shell in ground -->
          <ellipse cx="300" cy="180" rx="14" ry="9" fill="#92400E" stroke="#F59E0B" stroke-width="2" />
          <!-- Sprouting root down -->
          <path d="M300 186 Q 305 200 300 215 M 298 198 Q 285 208 280 215" stroke="#FDE68A" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <!-- Green seedling shoot up -->
          <path d="M300 174 Q 300 145 300 120" stroke="#16A34A" stroke-width="4.5" fill="none" stroke-linecap="round" class="growth-anim-stem" />
          <!-- Two green cotyledon leaves -->
          <path d="M300 130 C 270 120 260 100 280 95 C 295 105 298 120 300 130 Z" fill="#22C55E" stroke="#15803D" stroke-width="1.5" class="growth-anim-leaf-left" />
          <path d="M300 130 C 330 120 340 100 320 95 C 305 105 302 120 300 130 Z" fill="#4ADE80" stroke="#15803D" stroke-width="1.5" class="growth-anim-leaf-right" />
          <!-- Dewdrop on leaf -->
          <circle cx="282" cy="100" r="3" fill="#67E8F9" opacity="0.8" />
          <!-- Stage badge text inside SVG -->
          <rect x="230" y="20" width="140" height="26" rx="13" fill="#1E3A8A" opacity="0.85" />
          <text x="300" y="37" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">1. ਬਿਜਾਈ / SOWING</text>
        </g>
      `;
    } else if (this.currentStage === "growing") {
      svgGraphic = `
        <g class="stage-growing-art">
          <!-- Soil bed -->
          <path d="M10 170 Q 150 160 300 170 T 590 165 L 590 220 L 10 220 Z" fill="#78350F" opacity="0.9" />
          <path d="M10 185 Q 200 175 400 185 T 590 180 L 590 220 L 10 220 Z" fill="#451A03" />
          <!-- Rich root network -->
          <path d="M300 175 Q 310 195 305 215 M 300 175 Q 280 195 270 215 M 300 175 Q 330 195 340 215" stroke="#FDE68A" stroke-width="2" fill="none" />
          <!-- Central wheat stalk -->
          <path d="M300 172 Q 295 120 300 65" stroke="#15803D" stroke-width="5" fill="none" stroke-linecap="round" />
          <!-- Multiple tillering side stalks -->
          <path d="M300 172 Q 280 130 260 85" stroke="#16A34A" stroke-width="4" fill="none" stroke-linecap="round" />
          <path d="M300 172 Q 320 130 340 85" stroke="#16A34A" stroke-width="4" fill="none" stroke-linecap="round" />
          <!-- Lush broad green leaves -->
          <path d="M298 120 Q 240 110 220 125 Q 255 135 298 130 Z" fill="#22C55E" />
          <path d="M302 110 Q 360 100 380 115 Q 345 125 302 120 Z" fill="#15803D" />
          <path d="M296 90 Q 250 75 240 90 Q 270 100 296 95 Z" fill="#4ADE80" />
          <path d="M304 80 Q 350 65 360 80 Q 330 90 304 85 Z" fill="#22C55E" />
          <!-- Irrigation moisture ripple -->
          <ellipse cx="300" cy="172" rx="55" ry="8" fill="#38BDF8" opacity="0.35" />
          <!-- Stage badge text inside SVG -->
          <rect x="220" y="20" width="160" height="26" rx="13" fill="#0D9488" opacity="0.9" />
          <text x="300" y="37" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">2. ਫੁਟਾਰਾ / GROWING (CRI)</text>
        </g>
      `;
    } else {
      // harvest
      svgGraphic = `
        <g class="stage-harvest-art">
          <!-- Soil bed -->
          <path d="M10 170 Q 150 160 300 170 T 590 165 L 590 220 L 10 220 Z" fill="#78350F" opacity="0.9" />
          <path d="M10 185 Q 200 175 400 185 T 590 180 L 590 220 L 10 220 Z" fill="#451A03" />
          <!-- Golden stalks -->
          <path d="M300 172 Q 295 110 300 70" stroke="#D97706" stroke-width="5" fill="none" />
          <path d="M300 172 Q 275 120 265 80" stroke="#B45309" stroke-width="4" fill="none" />
          <path d="M300 172 Q 325 120 335 80" stroke="#B45309" stroke-width="4" fill="none" />
          <!-- Heavy Golden Earheads (Ripe Grain) -->
          <ellipse cx="300" cy="55" rx="12" ry="24" fill="#F59E0B" stroke="#D97706" stroke-width="2" />
          <ellipse cx="262" cy="65" rx="10" ry="20" fill="#FBBF24" stroke="#D97706" stroke-width="2" transform="rotate(-15 262 65)" />
          <ellipse cx="338" cy="65" rx="10" ry="10" fill="#FBBF24" stroke="#D97706" stroke-width="2" transform="rotate(15 338 65)" />
          <!-- Swaying golden awns (barbs) -->
          <path d="M300 35 L 295 10 M 304 40 L 315 15 M 296 40 L 285 15" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" />
          <path d="M260 48 L 245 25 M 265 48 L 260 25" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" />
          <path d="M340 48 L 355 25 M 335 48 L 340 25" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" />
          <!-- Golden sunlight gleam -->
          <circle cx="300" cy="55" r="35" fill="#FEF08A" opacity="0.25" />
          <!-- Stage badge text inside SVG -->
          <rect x="220" y="20" width="160" height="26" rx="13" fill="#D97706" opacity="0.9" />
          <text x="300" y="37" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">3. ਕਟਾਈ / HARVEST (GOLDEN)</text>
        </g>
      `;
    }

    this.container.innerHTML = `
      <div class="crop-explorer-card">
        <!-- Explorer Header -->
        <div class="explorer-card-header">
          <div class="explorer-brand">
            <span class="explorer-icon">🌾</span>
            <div>
              <h3 class="explorer-title">
                ${this.currentLang === 'hinglish' ? 'Crop Growth Explorer' : (this.currentLang === 'hi' ? 'फसल विकास व बढ़वार चक्र' : 'ਫ਼ਸਲ ਵਿਕਾਸ ਤੇ ਵਾਧਾ ਚੱਕਰ')}
              </h3>
              <span class="explorer-subtitle">
                ${cropObj[`name_${this.currentLang}`] || cropObj.name_pa} • PAU Ludhiana Verified
              </span>
            </div>
          </div>
          <div class="illustrative-badge" title="This SVG illustration is decorative art, advice is grounded in PAU records">
            🎨 ${this.currentLang === 'hinglish' ? 'Illustrative Art (Decorative)' : (this.currentLang === 'hi' ? 'कलात्मक चित्र (संकेतक)' : 'ਕਲਾਤਮਕ ਚਿੱਤਰ (ਸੰਕੇਤਕ)')}
          </div>
        </div>

        <!-- Crop Selector Tabs -->
        <div class="growth-crop-selector">
          <button class="growth-crop-btn ${this.currentCrop === 'wheat' ? 'active' : ''}" data-crop="wheat">
            🌾 ${this.currentLang === 'hinglish' ? 'Wheat' : (this.currentLang === 'hi' ? 'गेहूं' : 'ਕਣਕ')}
          </button>
          <button class="growth-crop-btn ${this.currentCrop === 'potato' ? 'active' : ''}" data-crop="potato">
            🥔 ${this.currentLang === 'hinglish' ? 'Potato' : (this.currentLang === 'hi' ? 'आलू' : 'ਆਲੂ')}
          </button>
        </div>

        <!-- 3 Growth Stages Navigation Pills -->
        <div class="growth-stage-pills">
          <button class="stage-pill ${this.currentStage === 'sowing' ? 'active' : ''}" data-stage="sowing">
            <span class="pill-num">1</span>
            <span>${this.currentLang === 'hinglish' ? 'Sowing' : (this.currentLang === 'hi' ? 'बुवाई' : 'ਬਿਜਾਈ')}</span>
          </button>
          <button class="stage-pill ${this.currentStage === 'growing' ? 'active' : ''}" data-stage="growing">
            <span class="pill-num">2</span>
            <span>${this.currentLang === 'hinglish' ? 'Growing / Tillering' : (this.currentLang === 'hi' ? 'फुटाव व बढ़वार' : 'ਵਿਕਾਸ ਤੇ ਫੁਟਾਰਾ')}</span>
          </button>
          <button class="stage-pill ${this.currentStage === 'harvest' ? 'active' : ''}" data-stage="harvest">
            <span class="pill-num">3</span>
            <span>${this.currentLang === 'hinglish' ? 'Harvest' : (this.currentLang === 'hi' ? 'कटाई' : 'ਕਟਾਈ')}</span>
          </button>
        </div>

        <!-- Animated Stage Field Canvas -->
        <div class="field-art-stage">
          <svg viewBox="0 0 600 230" preserveAspectRatio="xMidYMid meet" class="growth-svg-canvas">
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#BAE6FD" />
                <stop offset="60%" stop-color="#E0F2FE" />
                <stop offset="100%" stop-color="#FEF3C7" />
              </linearGradient>
            </defs>
            <!-- Sky background -->
            <rect x="0" y="0" width="600" height="230" fill="url(#skyGrad)" />
            <!-- Soft sun in sky -->
            <circle cx="500" cy="50" r="32" fill="#FDE047" opacity="0.8" />
            <circle cx="500" cy="50" r="48" fill="#FDE047" opacity="0.25" />
            <!-- Gentle hills in background -->
            <path d="M0 150 Q 180 110 350 145 T 600 135 L 600 230 L 0 230 Z" fill="#86EFAC" opacity="0.5" />
            <!-- Active Stage Illustration -->
            ${svgGraphic}
          </svg>
        </div>

        <!-- Stage Verified Information & Advice Action -->
        <div class="stage-info-banner">
          <div class="stage-info-header">
            <div>
              <h4 class="stage-info-title">${titleText}</h4>
              <span class="stage-info-timing">📅 ${timingText}</span>
            </div>
            <button id="btn-request-stage-advice" class="btn-stage-advice" title="Ask Voice Assistant for this stage advice">
              <span>🔊</span> <span>${this.currentLang === 'hinglish' ? 'Get Stage Advice' : (this.currentLang === 'hi' ? 'इस चरण की सलाह सुनें' : 'ਇਸ ਸਟੇਜ ਦੀ ਸਲਾਹ ਲਵੋ')}</span>
            </button>
          </div>
          <p class="stage-info-body">
            <strong>${this.currentLang === 'hinglish' ? 'PAU Advisory:' : (this.currentLang === 'hi' ? 'PAU सिफारिश:' : 'PAU ਸਿਫ਼ਾਰਸ਼:')}</strong> ${highlights}
          </p>
        </div>
      </div>
    `;

    // Bind Event Listeners
    this.container.querySelectorAll(".growth-crop-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setCrop(btn.dataset.crop);
      });
    });

    this.container.querySelectorAll(".stage-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setStage(btn.dataset.stage);
      });
    });

    const adviceBtn = this.container.querySelector("#btn-request-stage-advice");
    if (adviceBtn) {
      adviceBtn.addEventListener("click", () => {
        const query = stageObj.advice_query || `${cropObj.name_pa} ${this.currentStage} ਸਲਾਹ`;
        this.onAskAdvice(query);
      });
    }
  }
}

// Global expose
window.CropGrowthExplorer = CropGrowthExplorer;