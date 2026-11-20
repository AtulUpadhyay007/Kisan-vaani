/**
 * app.js - Main Application Controller for Kisan Vaani
 * Supports: Punjabi (pa), Hindi (hi), and Hinglish (hinglish)
 */

document.addEventListener("DOMContentLoaded", () => {
  const pipeline = new SpeechPipeline();
  const ivr = new IvrSimulator(pipeline);
  ivr.init();

  // App State
  let currentLang = "pa"; // 'pa', 'hi', or 'hinglish'
  let currentUser = { name: "ਕਿਸਾਨ ਵੀਰ", phone: "", isGuest: true };
  let lastSpokenText = "";

  // Welcome Screen Elements
  const welcomeScreen = document.getElementById("welcome-screen");
  const welcomeNameInput = document.getElementById("welcome-name");
  const welcomePhoneInput = document.getElementById("welcome-phone");
  const welcomeBtnContinue = document.getElementById("welcome-btn-continue");
  const welcomeBtnGuest = document.getElementById("welcome-btn-guest");
  const welcomeLangPa = document.getElementById("welcome-lang-pa");
  const welcomeLangHi = document.getElementById("welcome-lang-hi");
  const welcomeLangHinglish = document.getElementById("welcome-lang-hinglish");

  // Dashboard Elements
  const headerUserTag = document.getElementById("header-user-tag");
  const micBtn = document.getElementById("hero-mic-btn");
  const micStatusLabel = document.getElementById("mic-status-label");
  const micHintText = document.getElementById("mic-hint-text");
  const micWaveAnim = document.getElementById("mic-wave-container");
  const transcriptCard = document.getElementById("transcript-card");
  const transcriptText = document.getElementById("transcript-text");
  const answerCard = document.getElementById("answer-card");
  const answerTitle = document.getElementById("answer-title");
  const answerSubtitle = document.getElementById("answer-subtitle");
  const answerText = document.getElementById("answer-text");
  const answerSource = document.getElementById("answer-source");
  const answerTime = document.getElementById("answer-time");
  const answerLatency = document.getElementById("answer-latency");
  const answerDetails = document.getElementById("answer-details");
  const replayBtn = document.getElementById("btn-replay-audio");
  const stopAudioBtn = document.getElementById("btn-stop-audio");
  const speakingBadge = document.getElementById("speaking-indicator");

  // Language buttons on dashboard
  const langPaBtn = document.getElementById("btn-lang-pa");
  const langHiBtn = document.getElementById("btn-lang-hi");
  const langHinglishBtn = document.getElementById("btn-lang-hinglish");

  // Settings & Theme Elements (Top Right Corner)
  const btnOpenSettings = document.getElementById("btn-open-settings");
  const settingsModal = document.getElementById("settings-modal");
  const btnCloseSettings = document.getElementById("btn-close-settings");
  const themeBtnLight = document.getElementById("theme-btn-light");
  const themeBtnDark = document.getElementById("theme-btn-dark");
  const settingsUserName = document.getElementById("settings-user-name");
  const settingsUserPhone = document.getElementById("settings-user-phone");
  const btnSettingsLogout = document.getElementById("btn-settings-logout");

  // Profile View Elements (Nav Tab 5)
  const profileDisplayName = document.getElementById("profile-display-name");
  const profileDisplayPhone = document.getElementById("profile-display-phone");
  const btnProfileInspectDatasets = document.getElementById("btn-profile-inspect-datasets");
  const profileThemeLight = document.getElementById("profile-theme-light");
  const profileThemeDark = document.getElementById("profile-theme-dark");
  const profileLangPa = document.getElementById("profile-lang-pa");
  const profileLangHi = document.getElementById("profile-lang-hi");
  const profileLangHinglish = document.getElementById("profile-lang-hinglish");
  const btnProfileLogout = document.getElementById("btn-profile-logout");

  // Theme Management (Light Mode / Dark Mode)
  let currentTheme = localStorage.getItem("kisan_vaani_theme") || "light";

  function applyTheme(theme) {
    currentTheme = theme;
    try {
      localStorage.setItem("kisan_vaani_theme", theme);
    } catch (e) {}

    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      if (themeBtnDark) themeBtnDark.classList.add("active");
      if (themeBtnLight) themeBtnLight.classList.remove("active");
      if (profileThemeDark) profileThemeDark.classList.add("active");
      if (profileThemeLight) profileThemeLight.classList.remove("active");
    } else {
      document.body.classList.remove("dark-mode");
      if (themeBtnLight) themeBtnLight.classList.add("active");
      if (themeBtnDark) themeBtnDark.classList.remove("active");
      if (profileThemeLight) profileThemeLight.classList.add("active");
      if (profileThemeDark) profileThemeDark.classList.remove("active");
    }
  }

  applyTheme(currentTheme);

  // Restore Saved User Profile from LocalStorage
  try {
    const savedUser = localStorage.getItem("kisan_vaani_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.name) {
        currentUser = parsed;
        if (headerUserTag) {
          headerUserTag.innerHTML = `👤 ${currentUser.name} ${currentUser.isGuest ? (currentLang === 'hinglish' ? '(Guest)' : '(ਮਹਿਮਾਨ)') : ''}`;
        }
        if (welcomeScreen) welcomeScreen.classList.add("hidden");
      }
    }
  } catch (e) {}

  // Text input fallback
  const textQueryInput = document.getElementById("text-query-input");
  const textQuerySubmit = document.getElementById("text-query-submit");

  // Initialize 3D Coverflow Topic Navigation
  const coverflow = new TopicCoverflow({
    onSelectQuestion: (question) => {
      handleUserQuery(question);
    }
  });

  // Initialize Crop Growth Explorer
  const growthExplorer = new CropGrowthExplorer({
    lang: currentLang,
    onAskAdvice: (query) => {
      handleUserQuery(query);
    }
  });
  growthExplorer.init();

  // Initialize Farm Toolkit (Calendar, Symptoms, Mandis, Quality, Ledger)
  const farmToolkit = new FarmToolkit({
    lang: currentLang,
    onAskQuery: (query) => {
      handleUserQuery(query);
    }
  });
  farmToolkit.init();

  // Welcome Screen Logic
  function enterApp(name, phone, isGuest) {
    let defaultName = "ਕਿਸਾਨ ਵੀਰ";
    if (currentLang === "hi") defaultName = "किसान साथी";
    if (currentLang === "hinglish") defaultName = "Kisan Saathi";

    currentUser = {
      name: name.trim() || defaultName,
      phone: phone.trim(),
      isGuest: isGuest
    };

    try {
      localStorage.setItem("kisan_vaani_user", JSON.stringify(currentUser));
    } catch (e) {}

    updateSettingsUserDisplay();

    if (headerUserTag) {
      headerUserTag.innerHTML = `👤 ${currentUser.name} ${isGuest ? (currentLang === 'hinglish' ? '(Guest)' : '(ਮਹਿਮਾਨ)') : ''}`;
    }

    if (welcomeScreen) {
      welcomeScreen.classList.add("hidden");
    }

    let greeting = `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ${currentUser.name} ਜੀ! ਕਿਸਾਨ ਵਾਣੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਮਾਈਕ ਦਬਾ ਕੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ।`;
    if (currentLang === "hi") {
      greeting = `नमस्ते ${currentUser.name}! किसान वाणी में आपका स्वागत है। माइक दबाकर कोई भी प्रश्न पूछें।`;
    } else if (currentLang === "hinglish") {
      greeting = `Namaste ${currentUser.name}! Kisan Vaani mein aapka swagat hai. Mic press karke koi bhi question poochhein.`;
    }

    renderAnswer({
      display_title: currentLang === "hinglish" ? "Welcome to Kisan Vaani" : (currentLang === "hi" ? "किसान वाणी में स्वागत है" : "ਕਿਸਾਨ ਵਾਣੀ ਵਿੱਚ ਸਵਾਗਤ ਹੈ"),
      display_subtitle: currentLang === "hinglish" ? "Amritsar Farmers Voice Assistant" : (currentLang === "hi" ? "अमृतसर किसानों का आवाज़ी सहायक" : "ਅੰਮ੍ਰਿਤਸਰ ਕਿਸਾਨਾਂ ਦਾ ਆਵਾਜ਼ੀ ਸਹਾਇਕ"),
      spoken_answer: greeting,
      source: "Kisan Vaani",
      last_updated: "20 Nov 2026",
      latency_ms: "0.8",
      details: {}
    });
  }

  if (welcomeBtnContinue) {
    welcomeBtnContinue.addEventListener("click", () => {
      const name = welcomeNameInput ? welcomeNameInput.value : "";
      const phone = welcomePhoneInput ? welcomePhoneInput.value : "";
      enterApp(name, phone, false);
    });
  }

  if (welcomeBtnGuest) {
    welcomeBtnGuest.addEventListener("click", () => {
      enterApp("", "", true);
    });
  }

  if (headerUserTag) {
    headerUserTag.addEventListener("click", () => {
      switchView("view-profile");
    });
  }

  // Welcome Screen Language Selection
  function updateWelcomeLangButtons(lang) {
    [welcomeLangPa, welcomeLangHi, welcomeLangHinglish].forEach(b => {
      if (b) b.classList.remove("active");
    });
    if (lang === "pa" && welcomeLangPa) welcomeLangPa.classList.add("active");
    if (lang === "hi" && welcomeLangHi) welcomeLangHi.classList.add("active");
    if (lang === "hinglish" && welcomeLangHinglish) welcomeLangHinglish.classList.add("active");
  }

  if (welcomeLangPa) welcomeLangPa.addEventListener("click", () => setLanguage("pa"));
  if (welcomeLangHi) welcomeLangHi.addEventListener("click", () => setLanguage("hi"));
  if (welcomeLangHinglish) welcomeLangHinglish.addEventListener("click", () => setLanguage("hinglish"));

  // =========================================================================
  // COMPLETE 3-LANGUAGE LOCALIZATION ENGINE (PUNJABI, HINDI, HINGLISH)
  // =========================================================================
  const UI_TRANSLATIONS = {
    pa: {
      welcome: {
        title: "ਕਿਸਾਨ ਬਾਣੀ (Kisan Vaani)",
        subtitle: "ਅੰਮ੍ਰਿਤਸਰ ਅਤੇ ਮਾਝਾ ਖੇਤਰ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਪੰਜਾਬੀ ਅਤੇ ਹਿੰਦੀ ਬੋਲਣ ਵਾਲੀ ਆਵਾਜ਼ੀ ਹੈਲਪਲਾਈਨ",
        nameLabel: "ਤੁਹਾਡਾ ਨਾਮ (ਵਿਕਲਪਿਕ ਨਾਮ):",
        namePlaceholder: "ਜਿਵੇਂ ਹਰਪ੍ਰੀਤ ਸਿੰਘ ਜਾਂ ਆਪਣਾ ਨਾਮ ਲਿਖੋ...",
        phoneLabel: "ਮੋਬਾਈਲ ਨੰਬਰ (ਵਿਕਲਪਿਕ ਨੰਬਰ):",
        phonePlaceholder: "ਜਿਵੇਂ 9876543210 (ਸਿਰਫ਼ ਡੈਮੋ ਲਈ)...",
        continueBtn: "ਅੱਗੇ ਵਧੋ (Continue) ➔",
        guestBtn: "ਮਹਿਮਾਨ ਵਜੋਂ ਵਰਤੋ (Explore as Guest)",
        noticeText: "ℹ️ <strong>ਪ੍ਰੋਟੋਟਾਈਪ ਨੋਟ:</strong> ਇਹ ਅੰਮ੍ਰਿਤਸਰ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਇੱਕ ਇੰਟਰਐਕਟਿਵ ਡੈਮੋ ਪ੍ਰੋਟੋਟਾਈਪ ਹੈ। ਕੋਈ ਅਸਲ SMS ਜਾਂ OTP ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ। ਤੁਹਾਡਾ ਨਾਮ ਅਤੇ ਨੰਬਰ ਸਿਰਫ਼ ਇਸੇ ਬ੍ਰਾਊਜ਼ਰ ਡਿਵਾਈਸ 'ਤੇ ਰਹਿੰਦਾ ਹੈ।"
      },
      header: {
        districtLabel: "📍 ਜ਼ਿਲ੍ਹਾ: ",
        districtVal: "ਅੰਮ੍ਰਿਤਸਰ ਮੰਡੀਆਂ (Amritsar Mandis)",
        inspectBtn: "🔍 ਡਾਟਾਸੈੱਟ ਨਿਰੀਖਣ",
        groundedPill: "✓ 100% ਪ੍ਰਮਾਣਿਤ",
        weatherPill: "🌡️ 14°C (Mist)"
      },
      home: {
        micStatus: "ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ",
        micHint: "ਫ਼ਲ, ਸਬਜ਼ੀ ਭਾਅ, ਮੌਸਮ ਅਲਰਟ, ਫ਼ਸਲ ਸਲਾਹ ਜਾਂ ਸਕੀਮ ਪੁੱਛੋ",
        transcriptLabel: "Speech Heard (ਤੁਹਾਡੀ ਆਵਾਜ਼)",
        transcriptStatus: "✓ ਕਿਰਿਆਸ਼ੀਲ (Active)",
        groundedBadge: "✓ 100% ਪ੍ਰਮਾਣਿਤ ਡਾਟਾ (Zero Hallucination)",
        speakingDot: "Speaking...",
        infoTitle: "ਜਾਣਕਾਰੀ (Information)",
        answerPlaceholder: "ਜਵਾਬ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗਾ...",
        replayBtn: "<span>🔊</span> <span>ਦੁਬਾਰਾ ਸੁਣੋ (Replay Answer)</span>",
        coverflowTitle: "🔄 3D ਵਿਸ਼ਾ ਕੈਰੋਸਲ",
        coverflowAskBtn: "ਪੁੱਛੋ ➔",
        quickPromptsLabel: "⚡ ਆਮ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ (ਜਲਦੀ ਜਵਾਬ ਲਈ ਟੈਪ ਕਰੋ):",
        promptChips: [
          { text: "ਨਵਾਂ ਆਲੂ ਰੇਟ?", query: "ਨਵਾਂ ਆਲੂ ਪੁਖਰਾਜ ਭਾਅ ਵੱਲ੍ਹਾ ਮੰਡੀ" },
          { text: "ਕਿੰਨੂ ਫ਼ਲ ਦਾ ਭਾਅ?", query: "ਪੰਜਾਬ ਕਿੰਨੂ ਫ਼ਲ ਦਾ ਰੇਟ" },
          { text: "ਹਰੇ ਮਟਰ ਦਾ ਭਾਅ?", query: "ਹਰੇ ਮਟਰ ਦਾ ਭਾਅ" },
          { text: "ਬਾਸਮਤੀ 1121?", query: "ਬਾਸਮਤੀ 1121 ਰੇਟ" },
          { text: "ਕਣਕ ਪਹਿਲਾ ਪਾਣੀ?", query: "ਕਣਕ ਕੋਰ ਪਾਣੀ ਸਲਾਹ" },
          { text: "ਵੱਲ੍ਹਾ ਮੰਡੀ ਦੂਰੀ ਤੇ ਸਮਾਂ?", query: "ਵੱਲ੍ਹਾ ਮੰਡੀ ਦੀ ਦੂਰੀ ਅਤੇ ਸਮਾਂ" },
          { text: "ਪੀਐੱਮ ਕਿਸਾਨ ₹6000?", query: "ਪੀ ਐਮ ਕਿਸਾਨ ਕਿਸ਼ਤ" }
        ],
        textFallbackLabel: "⌨️ ਲਿਖ ਕੇ ਪੁੱਛੋ (Text Input Fallback)",
        textQueryPlaceholder: "ਜਾਂ ਇੱਥੇ ਲਿਖ ਕੇ ਪੁੱਛੋ (ਜਿਵੇਂ ਨਵਾਂ ਆਲੂ ਭਾਅ, ਕਣਕ ਰੇਟ)...",
        textQuerySubmit: "ਪੁੱਛੋ ➔",
        ivrBannerTitle: "📟 ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਸਾਦਾ ਕੀਪੈਡ ਫ਼ੋਨ ਹੈ? ਟੋਲ-ਫ਼੍ਰੀ 1800-180-1551",
        ivrBannerSub: "ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਕੀਪੈਡ ਮੋਬਾਈਲ 'ਤੇ ਆਵਾਜ਼ੀ ਹੈਲਪਲਾਈਨ ਚਲਾਓ",
        ivrBannerBtn: "ਫ਼ੋਨ ਕੀਪੈਡ ਚਲਾਓ"
      },
      weather: {
        viewTitle: "🌦️ ਮੌਸਮ ਅਤੇ ਖੇਤੀ ਅਲਰਟ (Weather & Alerts)",
        brandTitle: "ਅੰਮ੍ਰਿਤਸਰ ਮੌਸਮ ਅਤੇ ਖੇਤੀ ਅਲਰਟ",
        brandSub: "ਐਗਰੋਮੈਟ IMD ਸਟੇਸ਼ਨ ਅਤੇ ਕੇਵੀਕੇ ਅੰਮ੍ਰਿਤਸਰ",
        artBadge: "🎨 ਕਲਾਤਮਕ ਚਿੱਤਰ (ਸੰਕੇਤਕ) • Decorative Art",
        tempRange: "(ਘੱਟੋ-ਘੱਟ 13°C, ਵੱਧ ਤੋਂ ਵੱਧ 24°C)",
        condition: "ਸਵੇਰ ਦੀ ਧੁੰਦ ਤੇ ਕੋਹਰਾ • ਮੀਂਹ ਸੰਭਾਵਨਾ: 0% • ਹਵਾ: 4 km/h ਸ਼ਾਂਤ",
        statusBadge: "ਸੁਰੱਖਿਅਤ ਸਥਿਤੀ",
        alertBtn: "<span>⚠️</span> <span>ਸਥਾਨਕ ਮੌਸਮ ਅਲਰਟ ਜਾਂਚੋ (Check Local Alert)</span>",
        chips: [
          { text: "🌧️ ਮੀਂਹ ਅਲਰਟ?", query: "ਕੀ ਅੰਮ੍ਰਿਤਸਰ ਵਿੱਚ ਅੱਜ ਮੀਂਹ ਪਵੇਗਾ" },
          { text: "💨 ਹਵਾ ਤੇ ਸਪਰੇਅ ਚਿਤਾਵਨੀ?", query: "ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ ਅਤੇ ਸਪਰੇਅ ਚਿਤਾਵਨੀ" },
          { text: "🌫️ ਧੁੰਦ ਤੇ ਕੋਰਾ ਅਲਰਟ?", query: "ਧੁੰਦ ਅਤੇ ਕੋਰੇ ਦੀ ਸਥਿਤੀ" }
        ],
        source: "ਸਰੋਤ: Agromet IMD & KVK Amritsar",
        time: "ਅੱਪਡੇਟ: 20 Nov 2026, 07:00 AM",
        stationCard: `
          <h4>📍 ਅੰਮ੍ਰਿਤਸਰ (ਐਗਰੋਮੈਟ ਸਟੇਸ਼ਨ ਤੇ IMD ਨਾਗ ਕਲਾਂ)</h4>
          <span class="info-highlight">ਤਾਪਮਾਨ: 14°C (ਘੱਟੋ-ਘੱਟ 13°C, ਵੱਧ ਤੋਂ ਵੱਧ 24°C) • ਨਮੀ: 82%</span>
          <p>ਮੌਸਮ ਬਿਲਕੁਲ ਸਾਫ਼ ਅਤੇ ਸਵੇਰੇ ਹਲਕੀ ਧੁੰਦ ਹੈ। ਮੀਂਹ ਦੀ ਜ਼ੀਰੋ ਸੰਭਾਵਨਾ ਹੈ (0%)। ਹਵਾ 4 km/h ਸ਼ਾਂਤ ਹੈ। ਅਗਲੇ 3 ਦਿਨਾਂ ਤੱਕ ਖੁਸ਼ਕ ਮੌਸਮ ਰਹੇਗਾ।</p>
          <p><strong>🚜 ਕੀਟਨਾਸ਼ਕ ਸਪਰੇਅ ਸਲਾਹ:</strong> ਹਵਾ ਸ਼ਾਂਤ ਹੋਣ ਕਾਰਨ ਕਣਕ ਅਤੇ ਸਰ੍ਹੋਂ ਵਿੱਚ ਨਦੀਨ-ਨਾਸ਼ਕ ਜਾਂ ਪੌਸ਼ਟਿਕ ਸਪਰੇਅ ਦੁਪਹਿਰ ਵੇਲੇ ਬਿਲਕੁਲ ਸੁਰੱਖਿਅਤ ਹੈ।</p>
        `,
        irrigationCard: `
          <h4>💧 ਸਿੰਚਾਈ ਸਲਾਹ (PAU KVK)</h4>
          <span class="info-highlight">ਨਮੀ ਦੀ ਸਥਿਤੀ: ਉੱਤਮ (Optimum)</span>
          <p>ਮੀਂਹ ਦੀ ਕੋਈ ਸੰਭਾਵਨਾ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਆਲੂ ਅਤੇ ਸਬਜ਼ੀਆਂ ਵਿੱਚ ਲੋੜ ਅਨੁਸਾਰ ਹਲਕੀ ਸਿੰਚਾਈ ਕਰਦੇ ਰਹੋ। ਰਾਤ ਨੂੰ ਠੰਡ ਤੋਂ ਬਚਾਅ ਲਈ ਖੇਤ ਵਿੱਚ ਨਮੀ ਬਣਾਈ ਰੱਖੋ।</p>
        `
      },
      toolkit: {
        viewTitle: "🧰 ਕਿਸਾਨ ਟੂਲਕਿੱਟ ਅਤੇ ਫ਼ਸਲ ਸਟੇਜਾਂ (Farm Toolkit)",
        wheatCard: `
          <h4>🌾 ਕਣਕ ਫ਼ਸਲ ਸੰਭਾਲ (PAU ਸਲਾਹ)</h4>
          <span class="info-highlight">ਪਹਿਲਾ ਕੋਰ ਪਾਣੀ: 21 ਦਿਨਾਂ ਬਾਅਦ (CRI ਸਟੇਜ)</span>
          <p>ਗੁੱਲੀ ਡੰਡੇ ਦੀ ਰੋਕਥਾਮ ਲਈ ਪਹਿਲੇ ਪਾਣੀ ਤੋਂ ਬਾਅਦ ਸਿਫ਼ਾਰਿਸ਼ ਕੀਤਾ ਨਦੀਨ-ਨਾਸ਼ਕ ਸਪਰੇਅ ਕਰੋ। ਅੱਧੀ ਬੋਰੀ ਯੂਰੀਆ ਪ੍ਰਤੀ ਏਕੜ ਪਹਿਲੇ ਪਾਣੀ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂ ਤੁਰੰਤ ਬਾਅਦ ਪਾਓ।</p>
        `,
        potatoCard: `
          <h4>🥔 ਆਲੂ ਪਿਛੇਤਾ ਝੁਲਸਾ ਰੋਗ (Late Blight) ਬਚਾਅ</h4>
          <span class="info-highlight">ਧੁੰਦ ਅਤੇ ਠੰਡ ਚਿਤਾਵਨੀ</span>
          <p>ਆਲੂ ਨੂੰ ਪਿਛੇਤੇ ਝੁਲਸੇ ਰੋਗ ਤੋਂ ਬਚਾਉਣ ਲਈ ਇੰਡੋਫਿਲ ਐਮ-45 (2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ) ਸਪਰੇਅ ਕਰੋ ਅਤੇ ਹਲਕੀ ਸਿੰਚਾਈ ਰੱਖੋ ਤਾਂ ਜੋ ਠੰਡ ਤੇ ਪਾਲੇ ਦਾ ਅਸਰ ਘੱਟ ਹੋਵੇ।</p>
        `
      },
      mandi: {
        viewTitle: "📊 ਮੰਡੀ ਭਾਅ ਅਤੇ ਬਜ਼ਾਰ (Mandi Rates & Directory)",
        searchPlaceholder: "ਸਬਜ਼ੀ, ਫ਼ਲ ਜਾਂ ਮੰਡੀ ਲੱਭੋ (ਜਿਵੇਂ ਆਲੂ, ਕਿੰਨੂ, ਕਣਕ, ਵੱਲਾ)...",
        directoryHeading: "📍 ਅੰਮ੍ਰਿਤਸਰ ਮੰਡੀਆਂ ਦਾ ਵੇਰਵਾ (Markets Directory)",
        directoryCards: `
          <div class="info-card">
            <h4>📍 ਵੱਲ੍ਹਾ ਮੰਡੀ (ਅੰਮ੍ਰਿਤਸਰ ਮੁੱਖ ਯਾਰਡ)</h4>
            <span class="info-highlight">ਦੂਰੀ: ਸ਼ਹਿਰ ਤੋਂ 6 ਕਿਲੋਮੀਟਰ (ਜੀ.ਟੀ. ਰੋਡ ਬਾਈਪਾਸ)</span>
            <p><strong>ਸਮਾਂ:</strong> ਸਵੇਰੇ 05:00 - ਸ਼ਾਮ 07:00 ਵਜੇ</p>
            <p><strong>ਵਿਸ਼ੇਸ਼ਤਾ:</strong> ਸਬਜ਼ੀ ਅਤੇ ਫ਼ਲ ਥੋਕ ਕੇਂਦਰ, ਨਵਾਂ ਆਲੂ ਆਮਦ, ਕਿੰਨੂ ਵਪਾਰ</p>
            <p><strong>ਸਹੂਲਤਾਂ:</strong> ਈ-ਨਾਮ (e-NAM) ਕੰਪਿਊਟਰਾਈਜ਼ਡ ਕੰਡਾ, ਕਿਸਾਨ ਭਵਨ ਰੈਸਟ ਹਾਊਸ, ਕੰਟੀਨ, ਕਵਰਡ ਸ਼ੈੱਡ</p>
            <p><strong>ਸਕੱਤਰ ਫ਼ੋਨ:</strong> 0183-2581240</p>
          </div>
          <div class="info-card">
            <h4>📍 ਭਗਤਾਂਵਾਲਾ ਮੰਡੀ (ਅਨਾਜ ਮੰਡੀ)</h4>
            <span class="info-highlight">ਦੂਰੀ: ਸ਼੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਤੋਂ 3.5 ਕਿਲੋਮੀਟਰ ਦੱਖਣ</span>
            <p><strong>ਵਿਸ਼ੇਸ਼ਤਾ:</strong> ਬਾਸਮਤੀ (1121, 1509), ਕਣਕ ਸਰਕਾਰੀ ਖ਼ਰੀਦ ਕੇਂਦਰ</p>
            <p><strong>ਫ਼ੋਨ:</strong> 0183-2582100</p>
          </div>
          <div class="info-card">
            <h4>📍 ਮਜੀਠਾ ਮੰਡੀ</h4>
            <span class="info-highlight">ਦੂਰੀ: ਅੰਮ੍ਰਿਤਸਰ ਤੋਂ 18 ਕਿਲੋਮੀਟਰ ਉੱਤਰ</span>
            <p><strong>ਆਮਦ:</strong> ਪੀਆਰ-126 ਝੋਨਾ, ਕਣਕ, ਮੌਸਮੀ ਸਬਜ਼ੀਆਂ</p>
            <p><strong>ਫ਼ੋਨ:</strong> 0183-2762231</p>
          </div>
          <div class="info-card">
            <h4>📍 ਮਹਿਤਾ ਚੌਕ ਅਤੇ ਜੰਡਿਆਲਾ ਗੁਰੂ ਮੰਡੀਆਂ</h4>
            <span class="info-highlight">ਦੂਰੀ: 25 ਕਿਲੋਮੀਟਰ ਅਤੇ 15 ਕਿਲੋਮੀਟਰ ਪੂਰਬ</span>
            <p><strong>ਆਮਦ:</strong> ਕਣਕ, ਝੋਨਾ, ਗੋਭੀ, ਮਟਰ, ਹਰੀਆਂ ਸਬਜ਼ੀਆਂ</p>
            <p><strong>ਫ਼ੋਨ:</strong> 0183-2784110 / 0183-2589020</p>
          </div>
        `,
        schemesHeading: "📜 ਕਿਸਾਨ ਭਲਾਈ ਸਕੀਮਾਂ (Government Schemes)",
        schemesCards: `
          <div class="info-card">
            <h4>ਪੀਐੱਮ-ਕਿਸਾਨ ਸੰਮਾਨ ਨਿਧੀ (PM-Kisan)</h4>
            <span class="info-highlight">₹6,000 ਸਾਲਾਨਾ (₹2,000 ਦੀਆਂ 3 ਕਿਸ਼ਤਾਂ)</span>
            <p>ਸਾਰੇ ਜ਼ਮੀਨ ਮਾਲਕ ਕਿਸਾਨ। ਈ-ਕੇਵਾਈਸੀ ਅਤੇ ਆਧਾਰ ਲਿੰਕ ਲਾਜ਼ਮੀ। ਹੈਲਪਲਾਈਨ: 155261</p>
          </div>
          <div class="info-card">
            <h4>ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ ਮਸ਼ੀਨਰੀ (CRM) ਸਬਸਿਡੀ</h4>
            <span class="info-highlight">50% ਤੋਂ 80% ਸਬਸਿਡੀ</span>
            <p>ਸੁਪਰ ਸੀਡਰ, ਹੈਪੀ ਸੀਡਰ, ਬੇਲਰ ਮਸ਼ੀਨ 'ਤੇ ਸਬਸਿਡੀ। ਪੋਰਟਲ: agrimachinerypb.com</p>
          </div>
          <div class="info-card">
            <h4>ਪੰਜਾਬ ਫ਼ਸਲ ਰਾਹਤ / ਮੁਆਵਜ਼ਾ ਸਕੀਮ</h4>
            <span class="info-highlight">ਕੁਦਰਤੀ ਆਫ਼ਤ ਮੁਆਵਜ਼ਾ ₹15,000 ਪ੍ਰਤੀ ਏਕੜ ਤੱਕ</span>
            <p>ਗੜੇਮਾਰੀ, ਹੜ੍ਹ ਜਾਂ ਬੇਮੌਸਮੀ ਭਾਰੀ ਮੀਂਹ ਦੇ ਨੁਕਸਾਨ 'ਤੇ ਮੁਆਵਜ਼ਾ। ਕੇਵੀਕੇ ਅੰਮ੍ਰਿਤਸਰ: 0183-2580790</p>
          </div>
        `
      },
      profile: {
        viewTitle: "👤 ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਾਂ (Profile & Settings)",
        cardTitle: "ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ (Your Profile)",
        inspectBtn: "🔍 ਸਾਰੇ 7 ਪ੍ਰਮਾਣਿਤ ਡਾਟਾਸੈੱਟ ਦੇਖੋ",
        themeLabel: "🎨 ਡਿਸਪਲੇ ਥੀਮ (Display Theme)",
        themeLight: "ਲਾਈਟ ਮੋਡ (Light)",
        themeDark: "ਡਾਰਕ ਮੋਡ (Dark)",
        themeHint: "ਖੇਤ ਵਿੱਚ ਰਾਤ ਵੇਲੇ ਵਰਤਣ ਲਈ ਡਾਰਕ ਮੋਡ ਚੁਣੋ (Eye-friendly at night)।",
        langLabel: "🌐 ਭਾਸ਼ਾ ਚੁਣੋ (Choose Language)",
        langHint: "ਸਾਰੀ ਜਾਣਕਾਰੀ ਅਤੇ ਆਵਾਜ਼ ਚੁਣੀ ਗਈ ਭਾਸ਼ਾ ਵਿੱਚ ਬਦਲ ਜਾਵੇਗੀ।",
        privacyTitle: "ਸੁਰੱਖਿਆ ਅਤੇ ਪ੍ਰਾਈਵੇਸੀ (Privacy & Safety)",
        privacyDesc: "ਕਿਸਾਨ ਬਾਣੀ ਕਿਸੇ ਵੀ ਬਾਹਰੀ ਸਰਵਰ 'ਤੇ ਤੁਹਾਡਾ ਡਾਟਾ ਨਹੀਂ ਭੇਜਦੀ। ਤੁਹਾਡਾ ਵਹੀ-ਖਾਤਾ (Sales Ledger) ਅਤੇ ਸੈਟਿੰਗਾਂ ਸਿਰਫ਼ ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸਥਾਨਕ (Local Storage) ਤੌਰ 'ਤੇ ਸੁਰੱਖਿਅਤ ਹਨ।",
        accountLabel: "🚪 ਖਾਤਾ ਅਤੇ ਸੈਸ਼ਨ (Account & Session)",
        logoutBtn: "ਲੌਗ ਆਉਟ ਕਰੋ (Logout)",
        logoutHint: "ਲੌਗ ਆਉਟ ਕਰਨ ਨਾਲ ਤੁਸੀਂ ਨਵੇਂ ਨਾਮ ਜਾਂ ਮੋਬਾਈਲ ਨੰਬਰ ਨਾਲ ਦੁਬਾਰਾ ਦਾਖਲ ਹੋ ਸਕਦੇ ਹੋ।"
      },
      settings: {
        title: "ਸੈਟਿੰਗਾਂ (Settings)",
        themeLabel: "🌓 <span>ਡਿਸਪਲੇ ਮੋਡ (Theme / Mode)</span>",
        themeLight: "ਲਾਈਟ ਮੋਡ (Light)",
        themeDark: "ਡਾਰਕ ਮੋਡ (Dark)",
        themeHint: "ਖੇਤ ਵਿੱਚ ਰਾਤ ਵੇਲੇ ਵਰਤਣ ਲਈ ਡਾਰਕ ਮੋਡ ਚੁਣੋ (Eye-friendly at night)",
        langLabel: "🌐 <span>ਭਾਸ਼ਾ ਚੋਣ (Language)</span>",
        langHint: "ਸਾਰੀ ਜਾਣਕਾਰੀ ਅਤੇ ਆਵਾਜ਼ ਚੁਣੀ ਗਈ ਭਾਸ਼ਾ ਵਿੱਚ ਬਦਲ ਜਾਵੇਗੀ।",
        accountLabel: "👤 <span>ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ (Account)</span>",
        logoutBtn: "ਲੌਗ ਆਉਟ ਕਰੋ (Logout)",
        logoutHint: "ਲੌਗ ਆਉਟ ਕਰਨ ਨਾਲ ਤੁਸੀਂ ਨਵੇਂ ਨਾਮ ਜਾਂ ਮੋਬਾਈਲ ਨੰਬਰ ਨਾਲ ਦੁਬਾਰਾ ਦਾਖਲ ਹੋ ਸਕਦੇ ਹੋ।"
      },
      bNav: {
        home: "AI ਹੋਮ",
        weather: "ਮੌਸਮ",
        toolkit: "ਟੂਲਕਿੱਟ",
        mandi: "ਮੰਡੀ ਭਾਅ",
        profile: "ਪ੍ਰੋਫਾਈਲ"
      },
      footer: {
        brand: "🌾 ਕਿਸਾਨ ਬਾਣੀ (Kisan Vaani) • Zero Hallucination Guarantee",
        credits: "ਪੰਜਾਬ ਰਾਜ ਮੰਡੀ ਬੋਰਡ, IMD ਐਗਰੋਮੈਟ ਅਤੇ PAU KVK ਅੰਮ੍ਰਿਤਸਰ ਪ੍ਰਮਾਣਿਤ"
      }
    },
    hi: {
      welcome: {
        title: "किसान वाणी (Kisan Vaani)",
        subtitle: "अमृतसर और माझा क्षेत्र के किसानों के लिए हिंदी और पंजाबी बोलने वाली वॉयस हेल्पलाइन",
        nameLabel: "आपका नाम (वैकल्पिक नाम):",
        namePlaceholder: "उदा. हरप्रीत सिंह या अपना नाम लिखें...",
        phoneLabel: "मोबाइल नंबर (वैकल्पिक नंबर):",
        phonePlaceholder: "उदा. 9876543210 (केवल डेमो हेतु)...",
        continueBtn: "आगे बढ़ें (Continue) ➔",
        guestBtn: "अतिथि के रूप में देखें (Explore as Guest)",
        noticeText: "ℹ️ <strong>प्रोटोटाइप नोट:</strong> यह अमृतसर के किसानों के लिए एक इंटरैक्टिव डेमो प्रोटोटाइप है। कोई वास्तविक SMS या OTP नहीं भेजा जाता। आपका नाम और नंबर केवल इसी ब्राउज़र में सुरक्षित रहता है।"
      },
      header: {
        districtLabel: "📍 ज़िला: ",
        districtVal: "अमृतसर मंडियां (Amritsar Mandis)",
        inspectBtn: "🔍 डेटासेट निरीक्षण",
        groundedPill: "✓ 100% सत्यापित",
        weatherPill: "🌡️ 14°C (कोहरा)"
      },
      home: {
        micStatus: "माइक दबाकर बोलें",
        micHint: "फल, सब्जी भाव, मौसम अलर्ट, फसल सलाह या योजना पूछें",
        transcriptLabel: "सुनी गई आवाज (Speech Heard)",
        transcriptStatus: "✓ सक्रिय (Active)",
        groundedBadge: "✓ 100% सत्यापित डेटा (Zero Hallucination)",
        speakingDot: "Speaking...",
        infoTitle: "जानकारी (Information)",
        answerPlaceholder: "उत्तर यहाँ दिखाई देगा...",
        replayBtn: "<span>🔊</span> <span>दोबारा सुनें (Replay Answer)</span>",
        coverflowTitle: "🔄 3D विषय हिंडोला (Carousel)",
        coverflowAskBtn: "पूछें ➔",
        quickPromptsLabel: "⚡ मुख्य सवाल (त्वरित उत्तर हेतु टैप करें):",
        promptChips: [
          { text: "नया आलू भाव?", query: "नया आलू पुखराज भाव वल्लाह मंडी" },
          { text: "किन्नू फल भाव?", query: "पंजाब किन्नू फल का ताजा भाव" },
          { text: "हरे मटर का भाव?", query: "हरे मटर का मंडी भाव क्या है" },
          { text: "बासमती 1121 भाव?", query: "बासमती 1121 का मंडी भाव" },
          { text: "गेहूं पहला पानी?", query: "गेहूं में पहला कोर पानी कब लगाएं" },
          { text: "वल्लाह मंडी दूरी व समय?", query: "वल्लाह मंडी की दूरी और समय क्या है" },
          { text: "पीएम किसान ₹6000?", query: "पीएम किसान सम्मान निधि किस्त" }
        ],
        textFallbackLabel: "⌨️ लिखकर पूछें (Text Input Fallback)",
        textQueryPlaceholder: "या यहाँ लिखकर पूछें (उदा. नया आलू भाव, गेहूं रेट)...",
        textQuerySubmit: "पूछें ➔",
        ivrBannerTitle: "📟 क्या आपके पास साधारण कीपैड फोन है? टोल-फ्री 1800-180-1551",
        ivrBannerSub: "बिना इंटरनेट कीपैड मोबाइल पर वॉयस हेल्पलाइन चलाएं",
        ivrBannerBtn: "फोन कीपैड चलाएं"
      },
      weather: {
        viewTitle: "🌦️ मौसम और कृषि अलर्ट (Weather & Alerts)",
        brandTitle: "अमृतसर मौसम और कृषि अलर्ट",
        brandSub: "एग्रोमेट IMD स्टेशन एवं केवीके अमृतसर",
        artBadge: "🎨 कलात्मक चित्र (सांकेतिक) • Decorative Art",
        tempRange: "(न्यूनतम 13°C, अधिकतम 24°C)",
        condition: "सुबह की धुंध व कोहरा • बारिश की संभावना: 0% • हवा: 4 km/h शांत",
        statusBadge: "सुरक्षित स्थिति",
        alertBtn: "<span>⚠️</span> <span>स्थानीय मौसम अलर्ट जांचें (Check Local Alert)</span>",
        chips: [
          { text: "🌧️ बारिश अलर्ट?", query: "क्या अमृतसर में आज बारिश होगी" },
          { text: "💨 हवा व स्प्रे चेतावनी?", query: "हवा की गति और कीटनाशक स्प्रे चेतावनी" },
          { text: "🌫️ धुंध व कोहरा अलर्ट?", query: "धुंध और कोहरे की स्थिति क्या है" }
        ],
        source: "स्रोत: Agromet IMD एवं KVK अमृतसर",
        time: "अपडेट: 20 Nov 2026, 07:00 AM",
        stationCard: `
          <h4>📍 अमृतसर (एग्रोमेट स्टेशन एवं IMD नाग कलां)</h4>
          <span class="info-highlight">तापमान: 14°C (न्यूनतम 13°C, अधिकतम 24°C) • नमी: 82%</span>
          <p>मौसम बिल्कुल साफ और सुबह हल्का कोहरा/धुंध है। बारिश की शून्य संभावना है (0%)। हवा 4 किमी/घंटा शांत है। अगले 3 दिनों तक मौसम शुष्क रहेगा।</p>
          <p><strong>🚜 कीटनाशक स्प्रे सलाह:</strong> हवा शांत होने के कारण गेहूं और सरसों में खरपतवारनाशक या पोषक तत्व स्प्रे दोपहर के समय पूरी तरह सुरक्षित है।</p>
        `,
        irrigationCard: `
          <h4>💧 सिंचाई सलाह (PAU KVK)</h4>
          <span class="info-highlight">नमी की स्थिति: उत्तम (Optimum)</span>
          <p>बारिश की संभावना नहीं है, इसलिए आलू और सब्जियों में आवश्यकतानुसार हल्की सिंचाई करते रहें। रात में ठंड से बचाव के लिए खेत में नमी बनाए रखें।</p>
        `
      },
      toolkit: {
        viewTitle: "🧰 किसान टूलकिट और फसल चरण (Farm Toolkit)",
        wheatCard: `
          <h4>🌾 गेहूं फसल देखभाल (PAU सलाह)</h4>
          <span class="info-highlight">पहला कोर पानी: 21 दिन बाद (CRI स्टेज)</span>
          <p>गुल्ली डंडा की रोकथाम के लिए पहले पानी के बाद अनुशंसित खरपतवारनाशक स्प्रे करें। आधी बोरी यूरिया प्रति एकड़ पहले पानी से पहले या तुरंत बाद डालें।</p>
        `,
        potatoCard: `
          <h4>🥔 आलू झुलसा रोग (Late Blight) से बचाव</h4>
          <span class="info-highlight">कोहरा व ठंड की चेतावनी</span>
          <p>आलू को पछेती झुलसा रोग से बचाने के लिए इंडोफिल एम-45 (2.5 ग्राम/लीटर) स्प्रे करें और हल्की सिंचाई रखें ताकि ठंड और पाले का असर कम हो।</p>
        `
      },
      mandi: {
        viewTitle: "📊 मंडी भाव और बाज़ार (Mandi Rates & Directory)",
        searchPlaceholder: "सब्जी, फल या मंडी खोजें (उदा. आलू, किन्नू, गेहूं, वल्लाह)...",
        directoryHeading: "📍 अमृतसर मंडियों की जानकारी (Markets Directory)",
        directoryCards: `
          <div class="info-card">
            <h4>📍 वल्लाह मंडी (अमृतसर मुख्य यार्ड)</h4>
            <span class="info-highlight">दूरी: शहर से 6 किमी (जीटी रोड बाईपास)</span>
            <p><strong>समय:</strong> सुबह 05:00 - शाम 07:00 बजे</p>
            <p><strong>विशेषता:</strong> सब्जी और फल थोक केंद्र, नया आलू आवक, किन्नू वितरण</p>
            <p><strong>सुविधाएं:</strong> ई-नाम (e-NAM) इलेक्ट्रॉनिक कांटा, किसान भवन विश्राम गृह, कैंटीन, शेड</p>
            <p><strong>सचिव फोन:</strong> 0183-2581240</p>
          </div>
          <div class="info-card">
            <h4>📍 भगतांवाला मंडी (अनाज यार्ड)</h4>
            <span class="info-highlight">दूरी: स्वर्ण मंदिर से 3.5 किमी दक्षिण</span>
            <p><strong>विशेषता:</strong> बासमती (1121, 1509), गेहूं खरीद</p>
            <p><strong>फोन:</strong> 0183-2582100</p>
          </div>
          <div class="info-card">
            <h4>📍 मजीठा मंडी</h4>
            <span class="info-highlight">दूरी: अमृतसर से 18 किमी उत्तर</span>
            <p><strong>आवक:</strong> पीआर-126 धान, गेहूं, मौसमी सब्जियां</p>
            <p><strong>फोन:</strong> 0183-2762231</p>
          </div>
          <div class="info-card">
            <h4>📍 मेहता चौक एवं जंडियाला गुरु मंडियां</h4>
            <span class="info-highlight">दूरी: 25 किमी एवं 15 किमी पूर्व</span>
            <p><strong>आवक:</strong> गेहूं, धान, गोभी, मटर, हरी सब्जियां</p>
            <p><strong>फोन:</strong> 0183-2784110 / 0183-2589020</p>
          </div>
        `,
        schemesHeading: "📜 सरकारी योजनाएं (Government Schemes)",
        schemesCards: `
          <div class="info-card">
            <h4>पीएम-किसान सम्मान निधि (PM-Kisan)</h4>
            <span class="info-highlight">₹6,000 सालाना (₹2,000 की 3 किस्तें)</span>
            <p>सभी भूमिधारक किसान। ई-केवाईसी और बैंक आधार सीडिंग अनिवार्य। हेल्पलाइन: 155261</p>
          </div>
          <div class="info-card">
            <h4>पराली प्रबंधन मशीनरी (CRM) सब्सिडी</h4>
            <span class="info-highlight">50% से 80% सब्सिडी</span>
            <p>सुपर सीडर, हैप्पी सीडर, बेलर पर सब्सिडी। पोर्टल: agrimachinerypb.com</p>
          </div>
          <div class="info-card">
            <h4>पंजाब फसल राहत / आपदा मुआवजा</h4>
            <span class="info-highlight">आपदा मुआवजा ₹15,000 प्रति एकड़ तक</span>
            <p>ओलावृष्टि, बाढ़ या बेमौसम भारी बारिश से नुकसान पर मुआवजा। केवीके अमृतसर: 0183-2580790</p>
          </div>
        `
      },
      profile: {
        viewTitle: "👤 किसान प्रोफाइल और सेटिंग्स (Profile & Settings)",
        cardTitle: "आपकी प्रोफाइल (Your Profile)",
        inspectBtn: "🔍 सभी 7 सत्यापित डेटासेट देखें",
        themeLabel: "🎨 डिस्प्ले मोड (Theme)",
        themeLight: "लाइट मोड (Light)",
        themeDark: "डार्क मोड (Dark)",
        themeHint: "खेत में रात के समय उपयोग के लिए डार्क मोड चुनें (Eye-friendly at night)।",
        langLabel: "🌐 भाषा चयन (Choose Language)",
        langHint: "आवाज और स्क्रीन टेक्स्ट चुनी गई भाषा में तुरंत बदल जाएगी।",
        privacyTitle: "सुरक्षा और प्राइवेसी (Privacy & Safety)",
        privacyDesc: "किसान वाणी किसी भी बाहरी सर्वर पर आपका व्यक्तिगत डेटा नहीं भेजती। आपका बही-खाता (Sales Ledger) और सेटिंग्स केवल आपके ब्राउज़र में सुरक्षित हैं।",
        accountLabel: "🚪 खाता और सत्र (Account & Session)",
        logoutBtn: "लॉग आउट करें (Logout)",
        logoutHint: "लॉग आउट करने पर आप वापस वेलकम स्क्रीन पर चले जाएंगे।"
      },
      settings: {
        title: "सेटिंग्स (Settings)",
        themeLabel: "🌓 <span>डिस्प्ले मोड (Theme)</span>",
        themeLight: "लाइट मोड (Light)",
        themeDark: "डार्क मोड (Dark)",
        themeHint: "खेत में रात के समय उपयोग के लिए डार्क मोड चुनें (Eye-friendly at night)",
        langLabel: "🌐 <span>भाषा चयन (Language)</span>",
        langHint: "सभी जानकारी व आवाज चुनी गई भाषा में बदल जाएगी।",
        accountLabel: "👤 <span>किसान प्रोफाइल (Account)</span>",
        logoutBtn: "लॉग आउट करें (Logout)",
        logoutHint: "लॉग आउट करने पर आप नए नाम या नंबर से दोबारा साइन-इन कर सकते हैं।"
      },
      bNav: {
        home: "AI होम",
        weather: "मौसम",
        toolkit: "टूलकिट",
        mandi: "मंडी भाव",
        profile: "प्रोफाइल"
      },
      footer: {
        brand: "🌾 किसान वाणी (Kisan Vaani) • Zero Hallucination Guarantee",
        credits: "पंजाब राज्य मंडी बोर्ड, IMD एग्रोमेट एवं PAU KVK अमृतसर द्वारा सत्यापित"
      }
    },
    hinglish: {
      welcome: {
        title: "Kisan Vaani (ਕਿਸਾਨ ਬਾਣੀ)",
        subtitle: "Amritsar & Majha belt kisanon ke liye Punjabi, Hindi & Hinglish voice helpline",
        nameLabel: "Aapka Naam (Optional / ਵਿਕਲਪਿਕ ਨਾਮ):",
        namePlaceholder: "e.g. Harpreet Singh ya apna naam likhein...",
        phoneLabel: "Mobile Number (Optional / ਵਿਕਲਪਿਕ ਨੰਬਰ):",
        phonePlaceholder: "e.g. 9876543210 (Demo only)...",
        continueBtn: "Aage Badhein (Continue) ➔",
        guestBtn: "Guest Bankar Dekhein (Explore as Guest)",
        noticeText: "ℹ️ <strong>Prototype Note:</strong> Yeh Amritsar kisanon ke liye ek interactive demo prototype hai. Koi real SMS ya OTP nahi bheja jata. Aapka record isi browser par securely save rehta hai."
      },
      header: {
        districtLabel: "📍 District: ",
        districtVal: "Amritsar Mandis (Punjab)",
        inspectBtn: "🔍 Inspect Datasets",
        groundedPill: "✓ 100% Grounded",
        weatherPill: "🌡️ 14°C (Mist)"
      },
      home: {
        micStatus: "Mic press karke bolein",
        micHint: "Sabzi, fruit rate, mausam alert ya crop advice poochhein",
        transcriptLabel: "Speech Heard (Aapki Awaaz)",
        transcriptStatus: "✓ Active",
        groundedBadge: "✓ 100% Grounded (Zero Hallucination)",
        speakingDot: "Speaking...",
        infoTitle: "Information (Jankaari)",
        answerPlaceholder: "Answer will appear here...",
        replayBtn: "<span>🔊</span> <span>Replay Answer (Dobara Suno)</span>",
        coverflowTitle: "🔄 3D Topic Carousel",
        coverflowAskBtn: "Poochhein ➔",
        quickPromptsLabel: "⚡ Quick Prompts (Tap for Instant Answer):",
        promptChips: [
          { text: "Naya Aalu Rate?", query: "Naya aalu pukhraj rate Vallah mandi" },
          { text: "Kinnow Fruit Bhav?", query: "Punjab kinnow phal rate" },
          { text: "Hare Matar Rate?", query: "Hare matar ka rate kya hai" },
          { text: "Basmati 1121?", query: "Basmati 1121 mandi rate" },
          { text: "Gehu Pehla Paani?", query: "Gehu kor paani sinchai advice" },
          { text: "Vallah Mandi Distance?", query: "Vallah mandi distance timing" },
          { text: "PM Kisan ₹6000?", query: "PM kisan samman nidhi kist" }
        ],
        textFallbackLabel: "⌨️ Type Karke Poochhein (Text Fallback)",
        textQueryPlaceholder: "Ya yahan type karein (e.g. naya aalu bhav, gehu rate)...",
        textQuerySubmit: "Send ➔",
        ivrBannerTitle: "📟 Sadha Keypad Phone Hai? Toll-Free 1800-180-1551",
        ivrBannerSub: "Bina internet feature phone par voice helpline try karein",
        ivrBannerBtn: "Call Simulator"
      },
      weather: {
        viewTitle: "🌦️ Mausam & Alerts (Weather & Advisories)",
        brandTitle: "Amritsar Mausam & Krishi Alert",
        brandSub: "Agromet IMD Station & KVK Amritsar",
        artBadge: "🎨 Decorative Art (Illustrative Only)",
        tempRange: "(Min 13°C, Max 24°C)",
        condition: "Subah ki dhundh • Barish chance: 0% • Hawa: 4 km/h calm",
        statusBadge: "Safe Condition",
        alertBtn: "<span>⚠️</span> <span>Local Mausam Alert Check Karein</span>",
        chips: [
          { text: "🌧️ Barish Alert?", query: "Kya Amritsar mein aaj barish hogi" },
          { text: "💨 Hawa & Spray Warning?", query: "Hawa ki raftaar aur spray warning" },
          { text: "🌫️ Dhund / Fog Alert?", query: "Dhund aur fog alert status" }
        ],
        source: "Source: Agromet IMD & KVK Amritsar",
        time: "Updated: 20 Nov 2026, 07:00 AM",
        stationCard: `
          <h4>📍 Amritsar (Agromet Station & IMD Nag Kalan)</h4>
          <span class="info-highlight">Temperature: 14°C (Min 13°C, Max 24°C) • Humidity: 82%</span>
          <p>Mausam bilkul saaf aur subah halki mist/dhund hai. Barish ka zero chance hai (0%). Hawa 4 km/h calm hai. Agle 3 din tak sukha mausam rahega.</p>
          <p><strong>🚜 Spray Advisory:</strong> Hawa shant hone ke chalte gehu aur sarson mein weedicide / nutrient spray dopahar ke waqt bilkul safe hai.</p>
        `,
        irrigationCard: `
          <h4>💧 Sinchai / Irrigation Advisory (PAU)</h4>
          <span class="info-highlight">Moisture Condition: Optimum</span>
          <p>Barish ki sambhavna nahi hai, isliye aalu aur sabziyon mein zaroorat anusar halki sinchai karte rahein. Raat mein thand se bachav ke liye khet mein nami banaye rakhein.</p>
        `
      },
      toolkit: {
        viewTitle: "🧰 Farm Toolkit & Fasal Stages",
        wheatCard: `
          <h4>🌾 Gehu / Kanak Crop Care (PAU Advisory)</h4>
          <span class="info-highlight">Pehla Kor Paani: 21 din baad (CRI Stage)</span>
          <p>Gulli danda (Phalaris minor) rokne ke liye pehle paani ke baad sifarish shuda weedicide spray karein. Aadhi bori urea per acre pehle paani se pehle ya turant baad daalein.</p>
        `,
        potatoCard: `
          <h4>🥔 Aalu Late Blight Protection</h4>
          <span class="info-highlight">Fog aur cold warning</span>
          <p>Aalu ko late blight se bachane ke liye Indofil M-45 (2.5 g/L) spray karein aur halki sinchai rakhein taaki thand aur paley ka asar kam ho.</p>
        `
      },
      mandi: {
        viewTitle: "📊 Mandi Bhav & Bazaar Directory",
        searchPlaceholder: "Search sabzi, fruit or mandi (e.g. Aalu, Kinnow, Gehu)...",
        directoryHeading: "📍 Amritsar Mandi Directory & Markets",
        directoryCards: `
          <div class="info-card">
            <h4>📍 Vallah Mandi (Amritsar Main Yard)</h4>
            <span class="info-highlight">Distance: 6 km from City (GT Road Bypass)</span>
            <p><strong>Timings:</strong> 05:00 AM - 07:00 PM</p>
            <p><strong>Specialty:</strong> Subzi aur phal wholesale hub, Naya Aalu arrivals, Kinnow distribution</p>
            <p><strong>Facilities:</strong> e-NAM electronic weighing scale, Kisan Bhawan rest house, canteen, covered sheds</p>
            <p><strong>Secretary Phone:</strong> 0183-2581240</p>
          </div>
          <div class="info-card">
            <h4>📍 Bhagtanwala Mandi (Grain Yard)</h4>
            <span class="info-highlight">Distance: 3.5 km South of Golden Temple</span>
            <p><strong>Specialty:</strong> Basmati (1121, 1509), Gehu procurement</p>
            <p><strong>Phone:</strong> 0183-2582100</p>
          </div>
          <div class="info-card">
            <h4>📍 Majitha Mandi</h4>
            <span class="info-highlight">Distance: 18 km North from Amritsar</span>
            <p><strong>Arrivals:</strong> PR-126 Paddy, Wheat, Vegetables</p>
            <p><strong>Phone:</strong> 0183-2762231</p>
          </div>
          <div class="info-card">
            <h4>📍 Mehta Chowk & Jandiala Guru Mandis</h4>
            <span class="info-highlight">Distance: 25 km & 15 km East</span>
            <p><strong>Arrivals:</strong> Wheat, Paddy, Seasonal Vegetables, Gobhi, Matar</p>
            <p><strong>Phone:</strong> 0183-2784110 / 0183-2589020</p>
          </div>
        `,
        schemesHeading: "📜 Government Schemes & Subsidies",
        schemesCards: `
          <div class="info-card">
            <h4>PM-Kisan Samman Nidhi</h4>
            <span class="info-highlight">₹6,000 per year (3 installments of ₹2,000)</span>
            <p>All landholding farmers. e-KYC and land seeding required. Helpline: 155261</p>
          </div>
          <div class="info-card">
            <h4>Crop Residue Management (CRM) Subsidy</h4>
            <span class="info-highlight">50% to 80% Subsidy</span>
            <p>Subsidy on Super Seeder, Happy Seeder, Baler. Portal: agrimachinerypb.com</p>
          </div>
          <div class="info-card">
            <h4>Punjab Fasal Bima / Relief Scheme</h4>
            <span class="info-highlight">Disaster Compensation up to ₹15,000/acre</span>
            <p>Hailstorm, flood, or unseasonal heavy rain damage compensation. KVK Amritsar: 0183-2580790</p>
          </div>
        `
      },
      profile: {
        viewTitle: "👤 Kisan Profile & Settings",
        cardTitle: "Aapki Profile (Your Profile)",
        inspectBtn: "🔍 Inspect All 7 Verified Datasets",
        themeLabel: "🎨 Display Theme (Light / Dark)",
        themeLight: "Light Mode",
        themeDark: "Dark Mode",
        themeHint: "Night time use ke liye dark mode select karein.",
        langLabel: "🌐 Language Selection",
        langHint: "Voice recognition aur screen text chosen language mein switch hogi.",
        privacyTitle: "Suraksha aur Privacy (Privacy & Safety)",
        privacyDesc: "Kisan Vaani kisi bhi external server par aapka private data share nahi karti. Aapka ledger aur settings aapke local browser mein hi save rehte hain.",
        accountLabel: "🚪 Account & Session",
        logoutBtn: "Logout Karein",
        logoutHint: "Logout karke aap naye name ya phone se sign-in kar sakte hain."
      },
      settings: {
        title: "Settings (Aapki Pasand)",
        themeLabel: "🌓 <span>Display Theme (Light / Dark)</span>",
        themeLight: "Light Mode",
        themeDark: "Dark Mode",
        themeHint: "Night time use ke liye dark mode select karein",
        langLabel: "🌐 <span>Language Selection</span>",
        langHint: "Sabhi information aur voice audio chosen language mein switch hogi.",
        accountLabel: "👤 <span>Farmer Profile (Account)</span>",
        logoutBtn: "Logout Karein",
        logoutHint: "Logout karke aap naye name ya phone number se continue kar sakte hain."
      },
      bNav: {
        home: "AI Home",
        weather: "Mausam",
        toolkit: "Toolkit",
        mandi: "Mandi Bhav",
        profile: "Profile"
      },
      footer: {
        brand: "🌾 Kisan Vaani • Zero Hallucination Guarantee",
        credits: "Punjab State Mandi Board, IMD Agromet & PAU KVK Amritsar Verified"
      }
    }
  };

  function applyFullLocalization(lang) {
    const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.pa;

    // 1. Welcome Screen
    const welcomeTitle = document.getElementById("welcome-title");
    if (welcomeTitle) welcomeTitle.textContent = t.welcome.title;
    const welcomeSub = document.getElementById("welcome-subtitle");
    if (welcomeSub) welcomeSub.textContent = t.welcome.subtitle;
    const welcomeNameLabel = document.getElementById("welcome-name-label");
    if (welcomeNameLabel) welcomeNameLabel.textContent = t.welcome.nameLabel;
    if (welcomeNameInput) welcomeNameInput.placeholder = t.welcome.namePlaceholder;
    const welcomePhoneLabel = document.getElementById("welcome-phone-label");
    if (welcomePhoneLabel) welcomePhoneLabel.textContent = t.welcome.phoneLabel;
    if (welcomePhoneInput) welcomePhoneInput.placeholder = t.welcome.phonePlaceholder;
    if (welcomeBtnContinue) welcomeBtnContinue.textContent = t.welcome.continueBtn;
    if (welcomeBtnGuest) welcomeBtnGuest.textContent = t.welcome.guestBtn;
    const welcomeNotice = document.getElementById("welcome-notice-text");
    if (welcomeNotice) welcomeNotice.innerHTML = t.welcome.noticeText;

    // 2. Header Bar
    const headerDistrictLabel = document.getElementById("header-district-label");
    if (headerDistrictLabel) headerDistrictLabel.textContent = t.header.districtLabel;
    const headerDistrictVal = document.getElementById("header-district-val");
    if (headerDistrictVal) headerDistrictVal.textContent = t.header.districtVal;
    const btnInspect = document.getElementById("btn-inspect-dataset");
    if (btnInspect) btnInspect.textContent = t.header.inspectBtn;
    const headerGroundedPill = document.getElementById("header-grounded-pill");
    if (headerGroundedPill) headerGroundedPill.textContent = t.header.groundedPill;

    // 3. Home View
    if (micStatusLabel) micStatusLabel.textContent = t.home.micStatus;
    if (micHintText) micHintText.textContent = t.home.micHint;
    const transcriptHeaderLabel = document.getElementById("transcript-header-label");
    if (transcriptHeaderLabel) transcriptHeaderLabel.textContent = t.home.transcriptLabel;
    const transcriptStatus = document.getElementById("transcript-status");
    if (transcriptStatus) transcriptStatus.textContent = t.home.transcriptStatus;
    const groundedBadgeText = document.getElementById("grounded-badge-text");
    if (groundedBadgeText) groundedBadgeText.textContent = t.home.groundedBadge;
    const btnReplayText = document.getElementById("btn-replay-text");
    if (btnReplayText) btnReplayText.textContent = (lang === "pa" ? "ਦੁਬਾਰਾ ਸੁਣੋ (Replay Answer)" : (lang === "hi" ? "दोबारा सुनें (Replay Answer)" : "Replay Answer (Dobara Suno)"));
    const coverflowTitleTag = document.getElementById("coverflow-title-tag");
    if (coverflowTitleTag) coverflowTitleTag.textContent = t.home.coverflowTitle;
    const coverflowAskBtn = document.getElementById("coverflow-ask-btn");
    if (coverflowAskBtn) coverflowAskBtn.textContent = t.home.coverflowAskBtn;
    const quickPromptsLabel = document.getElementById("quick-prompts-label");
    if (quickPromptsLabel) quickPromptsLabel.textContent = t.home.quickPromptsLabel;

    // Quick Prompt Chips
    t.home.promptChips.forEach((chip, i) => {
      const chipEl = document.getElementById(`prompt-chip-${i + 1}`);
      if (chipEl) {
        chipEl.dataset.query = chip.query;
        const spanText = chipEl.querySelector("span:last-child");
        if (spanText) spanText.textContent = chip.text;
      }
    });

    const textFallbackLabel = document.getElementById("text-fallback-label");
    if (textFallbackLabel) textFallbackLabel.textContent = t.home.textFallbackLabel;
    if (textQueryInput) textQueryInput.placeholder = t.home.textQueryPlaceholder;
    const textQuerySubmit = document.getElementById("text-query-submit");
    if (textQuerySubmit) textQuerySubmit.textContent = t.home.textQuerySubmit;

    const ivrBannerTitle = document.getElementById("ivr-banner-title");
    if (ivrBannerTitle) ivrBannerTitle.textContent = t.home.ivrBannerTitle;
    const ivrBannerSub = document.getElementById("ivr-banner-sub");
    if (ivrBannerSub) ivrBannerSub.textContent = t.home.ivrBannerSub;
    const btnOpenIvr = document.getElementById("btn-open-ivr");
    if (btnOpenIvr) btnOpenIvr.textContent = t.home.ivrBannerBtn;

    // 4. Weather View
    const viewWeatherTitle = document.getElementById("view-weather-title");
    if (viewWeatherTitle) viewWeatherTitle.textContent = t.weather.viewTitle;
    const weatherBrandTitle = document.getElementById("weather-brand-title");
    if (weatherBrandTitle) weatherBrandTitle.textContent = t.weather.brandTitle;
    const weatherBrandSub = document.getElementById("weather-brand-sub");
    if (weatherBrandSub) weatherBrandSub.textContent = t.weather.brandSub;
    const weatherArtBadge = document.getElementById("weather-art-badge");
    if (weatherArtBadge) weatherArtBadge.textContent = t.weather.artBadge;
    const weatherTempRange = document.getElementById("weather-temp-range");
    if (weatherTempRange) weatherTempRange.textContent = t.weather.tempRange;
    const weatherCondition = document.getElementById("weather-condition-text");
    if (weatherCondition) weatherCondition.textContent = t.weather.condition;
    const weatherStatusBadge = document.getElementById("weather-status-badge");
    if (weatherStatusBadge) weatherStatusBadge.textContent = t.weather.statusBadge;
    const btnWeatherAlert = document.getElementById("btn-weather-local-alert");
    if (btnWeatherAlert) btnWeatherAlert.innerHTML = t.weather.alertBtn;

    t.weather.chips.forEach((c, idx) => {
      const chipEl = document.getElementById(`weather-chip-${idx + 1}`);
      if (chipEl) {
        chipEl.textContent = c.text;
        chipEl.dataset.query = c.query;
      }
    });

    const weatherSource = document.getElementById("weather-meta-source");
    if (weatherSource) weatherSource.textContent = t.weather.source;
    const weatherTime = document.getElementById("weather-meta-time");
    if (weatherTime) weatherTime.textContent = t.weather.time;

    const stationCard = document.getElementById("weather-station-card");
    if (stationCard) stationCard.innerHTML = t.weather.stationCard;
    const irrigationCard = document.getElementById("weather-irrigation-card");
    if (irrigationCard) irrigationCard.innerHTML = t.weather.irrigationCard;

    // 5. Farm Toolkit View
    const viewToolkitTitle = document.getElementById("view-toolkit-title");
    if (viewToolkitTitle) viewToolkitTitle.textContent = t.toolkit.viewTitle;
    const wheatCard = document.getElementById("toolkit-wheat-card");
    if (wheatCard) wheatCard.innerHTML = t.toolkit.wheatCard;
    const potatoCard = document.getElementById("toolkit-potato-card");
    if (potatoCard) potatoCard.innerHTML = t.toolkit.potatoCard;

    // 6. Mandi View
    const viewMandiTitle = document.getElementById("view-mandi-title");
    if (viewMandiTitle) viewMandiTitle.textContent = t.mandi.viewTitle;
    const mandiSearchInput = document.getElementById("mandi-search-input");
    if (mandiSearchInput) mandiSearchInput.placeholder = t.mandi.searchPlaceholder;
    const mandiDirHeading = document.getElementById("mandi-directory-heading");
    if (mandiDirHeading) mandiDirHeading.textContent = t.mandi.directoryHeading;
    const mandiDirCards = document.getElementById("mandi-directory-cards");
    if (mandiDirCards) mandiDirCards.innerHTML = t.mandi.directoryCards;
    const schemesHeading = document.getElementById("schemes-heading");
    if (schemesHeading) schemesHeading.textContent = t.mandi.schemesHeading;
    const schemesCards = document.getElementById("schemes-cards");
    if (schemesCards) schemesCards.innerHTML = t.mandi.schemesCards;

    // 7. Profile View
    const viewProfileTitle = document.getElementById("view-profile-title");
    if (viewProfileTitle) viewProfileTitle.textContent = t.profile.viewTitle;
    const profileCardTitle = document.getElementById("profile-card-title");
    if (profileCardTitle) profileCardTitle.textContent = t.profile.cardTitle;
    const btnProfileInspect = document.getElementById("btn-profile-inspect-datasets");
    if (btnProfileInspect) btnProfileInspect.textContent = t.profile.inspectBtn;
    const profileThemeLabel = document.getElementById("profile-theme-label");
    if (profileThemeLabel) profileThemeLabel.textContent = t.profile.themeLabel;
    const profileThemeLightText = document.getElementById("profile-theme-light-text");
    if (profileThemeLightText) profileThemeLightText.textContent = t.profile.themeLight;
    const profileThemeDarkText = document.getElementById("profile-theme-dark-text");
    if (profileThemeDarkText) profileThemeDarkText.textContent = t.profile.themeDark;
    const profileThemeHint = document.getElementById("profile-theme-hint");
    if (profileThemeHint) profileThemeHint.textContent = t.profile.themeHint;
    const profileLangLabel = document.getElementById("profile-lang-label");
    if (profileLangLabel) profileLangLabel.textContent = t.profile.langLabel;
    const profileLangHint = document.getElementById("profile-lang-hint");
    if (profileLangHint) profileLangHint.textContent = t.profile.langHint;
    const profilePrivacyTitle = document.getElementById("profile-privacy-title");
    if (profilePrivacyTitle) profilePrivacyTitle.textContent = t.profile.privacyTitle;
    const profilePrivacyDesc = document.getElementById("profile-privacy-desc");
    if (profilePrivacyDesc) profilePrivacyDesc.textContent = t.profile.privacyDesc;
    const profileAccountLabel = document.getElementById("profile-account-label");
    if (profileAccountLabel) profileAccountLabel.textContent = t.profile.accountLabel;
    const profileLogoutBtnText = document.getElementById("profile-logout-btn-text");
    if (profileLogoutBtnText) profileLogoutBtnText.textContent = t.profile.logoutBtn;
    const profileLogoutHint = document.getElementById("profile-logout-hint");
    if (profileLogoutHint) profileLogoutHint.textContent = t.profile.logoutHint;

    // 8. Settings Modal
    const settingsTitle = document.getElementById("settings-title-label");
    if (settingsTitle) settingsTitle.textContent = t.settings.title;
    const settingThemeLabel = document.getElementById("setting-theme-label");
    if (settingThemeLabel) settingThemeLabel.innerHTML = t.settings.themeLabel;
    const themeLightText = document.getElementById("theme-light-text");
    if (themeLightText) themeLightText.textContent = t.settings.themeLight;
    const themeDarkText = document.getElementById("theme-dark-text");
    if (themeDarkText) themeDarkText.textContent = t.settings.themeDark;
    const themeHintText = document.getElementById("theme-hint-text");
    if (themeHintText) themeHintText.textContent = t.settings.themeHint;
    const settingLangLabel = document.getElementById("setting-lang-label");
    if (settingLangLabel) settingLangLabel.innerHTML = t.settings.langLabel;
    const langHintText = document.getElementById("lang-hint-text");
    if (langHintText) langHintText.textContent = t.settings.langHint;
    const settingAccountLabel = document.getElementById("setting-account-label");
    if (settingAccountLabel) settingAccountLabel.innerHTML = t.settings.accountLabel;
    const logoutBtnText = document.getElementById("logout-btn-text");
    if (logoutBtnText) logoutBtnText.textContent = t.settings.logoutBtn;
    const logoutHintText = document.getElementById("logout-hint-text");
    if (logoutHintText) logoutHintText.textContent = t.settings.logoutHint;

    // 9. Bottom Navigation
    const bNavHome = document.getElementById("b-nav-home");
    if (bNavHome) bNavHome.textContent = t.bNav.home;
    const bNavWeather = document.getElementById("b-nav-weather");
    if (bNavWeather) bNavWeather.textContent = t.bNav.weather;
    const bNavToolkit = document.getElementById("b-nav-toolkit");
    if (bNavToolkit) bNavToolkit.textContent = t.bNav.toolkit;
    const bNavMandi = document.getElementById("b-nav-mandi");
    if (bNavMandi) bNavMandi.textContent = t.bNav.mandi;
    const bNavProfile = document.getElementById("b-nav-profile");
    if (bNavProfile) bNavProfile.textContent = t.bNav.profile;

    // 10. Footer
    const footerBrand = document.getElementById("footer-brand");
    if (footerBrand) footerBrand.textContent = t.footer.brand;
    const footerCredits = document.getElementById("footer-credits");
    if (footerCredits) footerCredits.textContent = t.footer.credits;

    // Sub-components updates
    pipeline.setLanguage(lang);
    if (ivr && ivr.setLanguage) ivr.setLanguage(lang);
    if (coverflow && coverflow.setLanguage) coverflow.setLanguage(lang);
    if (growthExplorer && growthExplorer.setLanguage) growthExplorer.setLanguage(lang);
    if (farmToolkit && farmToolkit.setLanguage) farmToolkit.setLanguage(lang);
    renderMandiList();
    if (typeof applyWeatherLocalization === "function") {
      applyWeatherLocalization(lang);
    }
  }

  // Dashboard Language Selection
  function setLanguage(lang) {
    currentLang = lang;
    applyFullLocalization(lang);

    [langPaBtn, langHiBtn, langHinglishBtn].forEach(b => {
      if (b) {
        if (b.dataset && b.dataset.lang === lang) b.classList.add("active");
        else b.classList.remove("active");
      }
    });

    [profileLangPa, profileLangHi, profileLangHinglish].forEach(b => {
      if (b) {
        if (b.dataset.lang === lang) b.classList.add("active");
        else b.classList.remove("active");
      }
    });

    updateWelcomeLangButtons(lang);
    updateSettingsUserDisplay();
    updateSettingsLangButtons(lang);
  }

  if (langPaBtn) langPaBtn.addEventListener("click", () => setLanguage("pa"));
  if (langHiBtn) langHiBtn.addEventListener("click", () => setLanguage("hi"));
  if (langHinglishBtn) langHinglishBtn.addEventListener("click", () => setLanguage("hinglish"));

  // Settings Helper Functions
  function updateSettingsUserDisplay() {
    const defaultName = currentLang === "hinglish" ? "Kisan Saathi" : (currentLang === "hi" ? "किसान साथी" : "ਕਿਸਾਨ ਵੀਰ");
    const nameStr = currentUser.name || defaultName;
    let phoneStr = "";
    if (currentUser.isGuest) {
      phoneStr = currentLang === "hinglish" ? "Guest Mode (ਮਹਿਮਾਨ)" : (currentLang === "hi" ? "अतिथि सत्र (Guest)" : "ਮਹਿਮਾਨ ਮੋਡ (Guest)");
    } else {
      phoneStr = currentUser.phone ? `📱 ${currentUser.phone}` : (currentLang === "hinglish" ? "Verified Profile" : "ਪ੍ਰਮਾਣਿਤ ਖਾਤਾ");
    }

    if (settingsUserName) settingsUserName.textContent = nameStr;
    if (settingsUserPhone) settingsUserPhone.textContent = phoneStr;
    if (profileDisplayName) profileDisplayName.textContent = nameStr;
    if (profileDisplayPhone) profileDisplayPhone.textContent = phoneStr;
  }

  function updateSettingsLangButtons(lang) {
    document.querySelectorAll(".settings-lang-btn").forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function openSettings() {
    if (settingsModal) {
      updateSettingsUserDisplay();
      updateSettingsLangButtons(currentLang);
      settingsModal.classList.remove("hidden");
    }
  }

  function closeSettings() {
    if (settingsModal) {
      settingsModal.classList.add("hidden");
    }
  }

  if (btnOpenSettings) {
    btnOpenSettings.addEventListener("click", openSettings);
  }

  if (btnCloseSettings) {
    btnCloseSettings.addEventListener("click", closeSettings);
  }

  if (settingsModal) {
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        closeSettings();
      }
    });
  }

  // Theme switch listeners in settings
  if (themeBtnLight) {
    themeBtnLight.addEventListener("click", () => applyTheme("light"));
  }
  if (themeBtnDark) {
    themeBtnDark.addEventListener("click", () => applyTheme("dark"));
  }

  // Settings language buttons
  document.querySelectorAll(".settings-lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.dataset.lang;
      setLanguage(selectedLang);
    });
  });

  // Shared Logout Logic
  function logoutUser() {
    try {
      localStorage.removeItem("kisan_vaani_user");
    } catch (e) {}

    let defaultName = "ਕਿਸਾਨ ਵੀਰ";
    if (currentLang === "hi") defaultName = "किसान साथी";
    if (currentLang === "hinglish") defaultName = "Kisan Saathi";

    currentUser = { name: defaultName, phone: "", isGuest: true };

    if (welcomeNameInput) welcomeNameInput.value = "";
    if (welcomePhoneInput) welcomePhoneInput.value = "";
    if (headerUserTag) headerUserTag.innerHTML = `👤 ${defaultName}`;

    closeSettings();
    updateSettingsUserDisplay();
    switchView("view-home");

    if (welcomeScreen) {
      welcomeScreen.classList.remove("hidden");
    }

    let logoutMsg = "ਤੁਸੀਂ ਸਫ਼ਲਤਾਪੂਰਵਕ ਲੌਗ ਆਉਟ ਹੋ ਗਏ ਹੋ।";
    if (currentLang === "hi") logoutMsg = "आप सफलतापूर्वक लॉग आउट हो गए हैं।";
    else if (currentLang === "hinglish") logoutMsg = "Aap successfully logout ho gaye hain.";

    pipeline.speak(logoutMsg);
  }

  if (btnSettingsLogout) {
    btnSettingsLogout.addEventListener("click", logoutUser);
  }
  if (btnProfileLogout) {
    btnProfileLogout.addEventListener("click", logoutUser);
  }

  // Weather Alert Request Chips
  document.querySelectorAll(".alert-req-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.dataset.query;
      if (q) handleUserQuery(q);
    });
  });

  // Quick Prompt Chips
  document.querySelectorAll(".prompt-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const query = chip.dataset.query;
      if (query) handleUserQuery(query);
    });
  });

  // Hero Microphone Click
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      if (pipeline.isListening) {
        pipeline.stopListening();
        setMicState("idle");
      } else {
        startVoiceRecording();
      }
    });
  }

  function startVoiceRecording() {
    setMicState("listening");
    transcriptCard.classList.remove("hidden");
    let listeningMsg = "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ ਜੀ";
    if (currentLang === "hi") listeningMsg = "सुन रहा हूँ... बोलिए";
    if (currentLang === "hinglish") listeningMsg = "Sun raha hoon... bolein";

    transcriptText.textContent = listeningMsg;

    pipeline.startListening(
      (interim) => {
        transcriptText.textContent = interim;
      },
      (finalText) => {
        transcriptText.textContent = finalText;
        handleUserQuery(finalText);
      },
      (err) => {
        setMicState("idle");
        transcriptText.textContent = err;
      },
      () => setMicState("listening"),
      () => {
        if (!transcriptText.textContent.includes("ਸੁਣ ਰਿਹਾ") && !transcriptText.textContent.includes("सुन रहा") && !transcriptText.textContent.includes("Sun raha")) {
          setMicState("idle");
        }
      }
    );
  }

  function setMicState(state) {
    if (!micBtn) return;
    micBtn.classList.remove("state-idle", "state-listening", "state-processing", "state-speaking");
    micBtn.classList.add(`state-${state}`);

    if (state === "listening") {
      micStatusLabel.textContent = currentLang === "hinglish" ? "Listening... (Bolein)" : (currentLang === "hi" ? "सुन रहा हूँ... (बोलिए)" : "ਸੁਣ ਰਿਹਾ ਹਾਂ... (ਬੋਲੋ)");
      if (micWaveAnim) micWaveAnim.classList.remove("hidden");
    } else if (state === "processing") {
      micStatusLabel.textContent = currentLang === "hinglish" ? "Verified answer searching..." : (currentLang === "hi" ? "सत्यापित उत्तर खोजा जा रहा है..." : "ਪ੍ਰਮਾਣਿਤ ਜਵਾਬ ਲੱਭਿਆ ਜਾ ਰਿਹਾ ਹੈ...");
      if (micWaveAnim) micWaveAnim.classList.add("hidden");
    } else if (state === "speaking") {
      micStatusLabel.textContent = currentLang === "hinglish" ? "Speaking..." : (currentLang === "hi" ? "बोल रहा हूँ..." : "ਬੋਲ ਰਿਹਾ ਹਾਂ...");
      if (micWaveAnim) micWaveAnim.classList.add("hidden");
    } else {
      micStatusLabel.textContent = currentLang === "hinglish" ? "Mic press karke bolein" : (currentLang === "hi" ? "माइक दबाकर बोलें" : "ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ");
      if (micWaveAnim) micWaveAnim.classList.add("hidden");
    }
  }

  async function handleUserQuery(query) {
    if (!query || !query.trim()) return;

    switchView("view-home");
    setMicState("processing");
    transcriptCard.classList.remove("hidden");
    transcriptText.textContent = query;

    try {
      const data = window.kisanApi 
        ? await window.kisanApi.query(query, currentLang)
        : await fetch("/api/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: query, lang: currentLang })
          }).then(r => {
            if (!r.ok) throw new Error("Backend query failed");
            return r.json();
          });

      renderAnswer(data);
    } catch (err) {
      console.warn("Backend unavailable, using client-side grounded pipeline:", err);
      const offlineData = pipeline.groundLocally(query, currentLang);
      renderAnswer(offlineData);
    }
  }

  function renderAnswer(data) {
    lastSpokenText = data.spoken_answer;

    answerCard.classList.remove("hidden");
    answerTitle.textContent = data.display_title || "ਸੂਚਨਾ (Information)";
    answerSubtitle.textContent = data.display_subtitle || "";
    answerText.textContent = data.spoken_answer;
    answerSource.textContent = data.ai_engine 
      ? `Source: ${data.source || "Punjab Mandi Board"} [${data.ai_engine}]`
      : `Source: ${data.source || "Punjab Mandi Board"}`;
    answerTime.textContent = `Updated: ${data.last_updated || "20 Nov 2026"}`;
    answerLatency.textContent = `Latency: ${data.latency_ms || 1.1} ms (<6s)`;

    renderDetails(data.details);

    setMicState("speaking");
    if (speakingBadge) speakingBadge.classList.remove("hidden");

    pipeline.speak(
      data.spoken_answer,
      () => {
        setMicState("speaking");
        if (speakingBadge) speakingBadge.classList.remove("hidden");
      },
      () => {
        setMicState("idle");
        if (speakingBadge) speakingBadge.classList.add("hidden");
      }
    );

    answerCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderDetails(details) {
    if (!answerDetails) return;
    answerDetails.innerHTML = "";
    if (!details || Object.keys(details).length === 0) return;

    if (details.modal_price) {
      const modalLabel = currentLang === "hinglish" ? "Modal Rate" : (currentLang === "hi" ? "औसत भाव" : "ਔਸਤ ਭਾਅ");
      const minLabel = currentLang === "hinglish" ? "Min Rate" : (currentLang === "hi" ? "न्यूनतम" : "ਘੱਟੋ-ਘੱਟ");
      const maxLabel = currentLang === "hinglish" ? "Max Rate" : (currentLang === "hi" ? "अधिकतम" : "ਵੱਧ ਤੋਂ ਵੱਧ");
      const arrivalLabel = currentLang === "hinglish" ? "Arrival" : (currentLang === "hi" ? "आवक" : "ਆਮਦ");

      answerDetails.innerHTML = `
        <div class="detail-badge badge-modal">
          <span class="badge-label">${modalLabel}</span>
          <span class="badge-value">₹${details.modal_price}</span>
        </div>
        <div class="detail-badge">
          <span class="badge-label">${minLabel}</span>
          <span class="badge-value">₹${details.min_price}</span>
        </div>
        <div class="detail-badge">
          <span class="badge-label">${maxLabel}</span>
          <span class="badge-value">₹${details.max_price}</span>
        </div>
        <div class="detail-badge">
          <span class="badge-label">${arrivalLabel}</span>
          <span class="badge-value">${details.arrival_quintals || details.arrival || "ਉਪਲਬਧ"} Qtl</span>
        </div>
      `;
    } else if (details.temperature_c || details.temp) {
      answerDetails.innerHTML = `
        <div class="detail-badge badge-modal">
          <span class="badge-label">Temperature</span>
          <span class="badge-value">${details.temperature_c || details.temp}°C</span>
        </div>
        <div class="detail-badge">
          <span class="badge-label">Rain Chance</span>
          <span class="badge-value">${details.rain_probability || details.rain || "0%"}</span>
        </div>
        <div class="detail-badge">
          <span class="badge-label">Wind Speed</span>
          <span class="badge-value">${details.wind || "8 km/h"}</span>
        </div>
      `;
    } else if (details.distance) {
      answerDetails.innerHTML = `
        <div class="detail-badge badge-modal">
          <span class="badge-label">Distance</span>
          <span class="badge-value">${details.distance}</span>
        </div>
        <div class="detail-badge">
          <span class="badge-label">Timings</span>
          <span class="badge-value">${details.timings || "05:00 AM - 07:00 PM"}</span>
        </div>
        <div class="detail-badge" style="grid-column: span 2;">
          <span class="badge-label">Facilities</span>
          <span style="font-size: 13px; font-weight: 700; color: var(--midnight-blue);">${details.facilities}</span>
        </div>
      `;
    } else if (details.advisory) {
      answerDetails.innerHTML = `
        <div class="detail-badge" style="grid-column: span 2; background: var(--sky-pale);">
          <span class="badge-label">Advisory</span>
          <span style="font-size: 14px; font-weight: 700; color: var(--midnight-blue);">${details.advisory}</span>
        </div>
      `;
    } else if (details.symptom || details.cause) {
      answerDetails.innerHTML = `
        <div class="detail-badge" style="grid-column: span 2; background: #FFFBEB; border-color: #FCD34D;">
          <span class="badge-label" style="color: #92400E;">PAU Plant Protection Advisory (${details.severity || 'Medium'})</span>
          <span style="font-size: 13px; font-weight: 700; color: #78350F; display: block; margin-top: 2px;">${details.guidance || details.cause}</span>
          <span style="font-size: 11px; color: #B45309; display: block; margin-top: 4px;">📞 Helpline: ${details.helpline || '0183-2580790'}</span>
        </div>
      `;
    } else if (details.size_standard || details.produce) {
      answerDetails.innerHTML = `
        <div class="detail-badge badge-modal">
          <span class="badge-label">Grading Spec</span>
          <span class="badge-value">${details.size_metric || "AGMARK"}</span>
        </div>
        <div class="detail-badge" style="grid-column: span 2; background: var(--sky-pale);">
          <span class="badge-label">Standards</span>
          <span style="font-size: 13px; font-weight: 700; color: var(--midnight-blue);">${details.size_standard}</span>
        </div>
      `;
    } else if (details.sowing_window) {
      answerDetails.innerHTML = `
        <div class="detail-badge badge-modal">
          <span class="badge-label">Sowing Window</span>
          <span class="badge-value">${details.sowing_window}</span>
        </div>
        <div class="detail-badge">
          <span class="badge-label">Seed Rate</span>
          <span class="badge-value">${details.seed_rate}</span>
        </div>
      `;
    }
  }

  // Audio Controls
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      if (lastSpokenText) {
        pipeline.speak(
          lastSpokenText,
          () => {
            setMicState("speaking");
            if (speakingBadge) speakingBadge.classList.remove("hidden");
          },
          () => {
            setMicState("idle");
            if (speakingBadge) speakingBadge.classList.add("hidden");
          }
        );
      }
    });
  }

  if (stopAudioBtn) {
    stopAudioBtn.addEventListener("click", () => {
      pipeline.stopSpeaking();
      setMicState("idle");
      if (speakingBadge) speakingBadge.classList.add("hidden");
    });
  }

  if (textQuerySubmit) {
    textQuerySubmit.addEventListener("click", () => {
      if (textQueryInput && textQueryInput.value) {
        handleUserQuery(textQueryInput.value);
        textQueryInput.value = "";
      }
    });
  }

  if (textQueryInput) {
    textQueryInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && textQueryInput.value) {
        handleUserQuery(textQueryInput.value);
        textQueryInput.value = "";
      }
    });
  }

  // View Router for Bottom Navigation Menu
  function switchView(viewId) {
    document.querySelectorAll(".app-view").forEach(v => {
      v.classList.remove("active");
    });
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add("active");
    }

    document.querySelectorAll(".bottom-nav-item").forEach(item => {
      if (item.getAttribute("data-view") === viewId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (viewId === "view-mandi") {
      loadMandiPricesFromApi();
    }
  }

  // Bottom Navigation Click Handlers
  document.querySelectorAll(".bottom-nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const viewId = btn.getAttribute("data-view");
      if (viewId) switchView(viewId);
    });
  });

  // Profile View Event Handlers
  if (profileThemeLight) {
    profileThemeLight.addEventListener("click", () => applyTheme("light"));
  }
  if (profileThemeDark) {
    profileThemeDark.addEventListener("click", () => applyTheme("dark"));
  }

  if (profileLangPa) profileLangPa.addEventListener("click", () => setLanguage("pa"));
  if (profileLangHi) profileLangHi.addEventListener("click", () => setLanguage("hi"));
  if (profileLangHinglish) profileLangHinglish.addEventListener("click", () => setLanguage("hinglish"));

  if (btnProfileInspectDatasets && datasetModal) {
    btnProfileInspectDatasets.addEventListener("click", () => {
      datasetModal.classList.remove("hidden");
      if (datasetSelect) showDatasetView(datasetSelect.value);
    });
  }

  // Live Mandi Prices State from API
  let liveApiMandiPrices = null;

  async function loadMandiPricesFromApi() {
    if (window.kisanApi) {
      try {
        const data = await window.kisanApi.getMandis();
        if (data && data.prices) {
          liveApiMandiPrices = data.prices;
        }
      } catch (e) {
        console.warn("[MandiAPI] Using cached records:", e);
      }
    }
    if (!liveApiMandiPrices) {
      liveApiMandiPrices = (window.VERIFIED_DATA && window.VERIFIED_DATA.mandis) || [];
    }
    renderMandiList();
  }

  // Render Mandi List with optional live search filtering
  function renderMandiList(filterTerm = "") {
    const listEl = document.getElementById("mandi-rates-grid");
    if (!listEl) return;
    listEl.innerHTML = "";

    const rawPrices = liveApiMandiPrices || (window.VERIFIED_DATA && window.VERIFIED_DATA.mandis) || [];
    const term = (filterTerm || "").toLowerCase().trim();
    const items = rawPrices.filter(item => {
      if (!term) return true;
      const cEn = (item.commodity || "").toLowerCase();
      const cPa = (item.commodity_pa || "").toLowerCase();
      const cHi = (item.commodity_hi || "").toLowerCase();
      const mEn = (item.mandi || "").toLowerCase();
      const mPa = (item.mandi_pa || "").toLowerCase();
      const mHi = (item.mandi_hi || "").toLowerCase();
      return cEn.includes(term) || cPa.includes(term) || cHi.includes(term) ||
             mEn.includes(term) || mPa.includes(term) || mHi.includes(term);
    });

    if (items.length === 0) {
      listEl.innerHTML = `
        <div style="grid-column: 1/-1; padding: 24px; text-align: center; color: var(--text-muted); font-size: 14px;">
          ਕੋਈ ਮਿਲਦਾ ਜੁਲਦਾ ਭਾਅ ਨਹੀਂ ਮਿਲਿਆ (No matching commodity found).
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "mandi-rate-card";
      let name = item.commodity_pa;
      let mandi = item.mandi_pa;

      if (currentLang === "hi") {
        name = item.commodity_hi;
        mandi = item.mandi_hi;
      } else if (currentLang === "hinglish") {
        name = item.commodity;
        mandi = item.mandi;
      }

      card.innerHTML = `
        <div class="mandi-card-header">
          <div>
            <h4 class="crop-name">${name}</h4>
            <span class="mandi-location">📍 ${mandi}</span>
          </div>
          <button class="btn-listen-crop" title="Listen">🔊</button>
        </div>
        <div class="mandi-prices-row">
          <div class="price-box modal-box">
            <span class="p-label">${currentLang === 'hinglish' ? 'Modal Rate' : (currentLang === 'hi' ? 'औसत भाव' : 'ਔਸਤ ਭਾਅ')}</span>
            <span class="p-value">₹${item.modal_price}</span>
          </div>
          <div class="price-box">
            <span class="p-label">${currentLang === 'hinglish' ? 'Min' : (currentLang === 'hi' ? 'न्यूनतम' : 'ਘੱਟੋ-ਘੱਟ')}</span>
            <span class="p-value">₹${item.min_price}</span>
          </div>
          <div class="price-box">
            <span class="p-label">${currentLang === 'hinglish' ? 'Max' : (currentLang === 'hi' ? 'अधिकतम' : 'ਵੱਧ ਤੋਂ ਵੱਧ')}</span>
            <span class="p-value">₹${item.max_price}</span>
          </div>
        </div>
        <div class="mandi-card-footer">
          <span>Arrival: ${item.arrival_quintals} Qtl</span>
          <span style="color: #059669; font-weight: 700;">${item.trend_percent}</span>
        </div>
      `;

      card.querySelector(".btn-listen-crop").addEventListener("click", (e) => {
        e.stopPropagation();
        handleUserQuery(`${name} ka bhav`);
      });

      card.addEventListener("click", () => {
        handleUserQuery(`${name} ka bhav`);
      });

      listEl.appendChild(card);
    });
  }

  const mandiSearchInput = document.getElementById("mandi-search-input");
  if (mandiSearchInput) {
    mandiSearchInput.addEventListener("input", (e) => {
      renderMandiList(e.target.value);
    });
  }

  loadMandiPricesFromApi();

  // Weather Visual Alert Button
  const weatherAlertBtn = document.getElementById("btn-weather-local-alert");
  if (weatherAlertBtn) {
    weatherAlertBtn.addEventListener("click", () => {
      handleUserQuery("ਅੰਮ੍ਰਿਤਸਰ ਮੌਸਮ ਅਲਰਟ ਅਤੇ ਚਿਤਾਵਨੀ");
    });
  }

  // Dataset Inspector Modal
  const btnInspectDataset = document.getElementById("btn-inspect-dataset");
  const datasetModal = document.getElementById("dataset-modal");
  const btnCloseDatasetModal = document.getElementById("btn-close-dataset-modal");
  const datasetSelect = document.getElementById("dataset-inspect-select");
  const datasetCodeView = document.getElementById("dataset-code-view");
  const datasetMetaText = document.getElementById("dataset-inspect-meta");
  const datasetUploadInput = document.getElementById("dataset-upload-input");

  async function showDatasetView(datasetKey) {
    if (!datasetCodeView) return;
    datasetCodeView.textContent = "Loading live API dataset from backend...";

    if (window.kisanApi) {
      try {
        const data = await window.kisanApi.getRawDataset(datasetKey);
        datasetCodeView.textContent = JSON.stringify(data, null, 2);
        if (datasetMetaText) {
          datasetMetaText.textContent = `Live API Dataset: ${datasetKey} • Source: Verified Amritsar DB`;
        }
        return;
      } catch (err) {
        console.warn("[DatasetAPI] Live dataset fetch fallback:", err);
      }
    }

    let dataToShow = null;
    let metaDesc = "";

    switch (datasetKey) {
      case "prices":
        dataToShow = VERIFIED_DATA.mandis;
        metaDesc = `Mandi Prices (${dataToShow.length} items) • Source: Punjab Mandi Board (e-NAM)`;
        break;
      case "weather":
        dataToShow = VERIFIED_DATA.weather;
        metaDesc = `Weather & Spray Advisory • Source: Agromet IMD & KVK Amritsar`;
        break;
      case "schemes":
        dataToShow = VERIFIED_DATA.schemes;
        metaDesc = `Govt Schemes (${dataToShow.length} items) • Source: Ministry of Agriculture & Govt of Punjab`;
        break;
      case "crop_advice":
        dataToShow = VERIFIED_DATA.crop_advice;
        metaDesc = `PAU Crop Advice (${dataToShow.length} items) • Source: PAU Ludhiana / KVK Amritsar`;
        break;
      case "nearby_mandis":
        dataToShow = VERIFIED_DATA.nearby_mandis;
        metaDesc = `Amritsar Mandis Directory (${dataToShow.length} yards) • Source: Punjab State Mandi Board`;
        break;
      case "crop_calendar":
        dataToShow = VERIFIED_DATA.crop_calendar;
        metaDesc = `PAU Crop Calendar & Sowing Windows • Source: PAU Ludhiana`;
        break;
      case "crop_symptoms":
        dataToShow = VERIFIED_DATA.crop_symptoms;
        metaDesc = `PAU Plant Protection & Symptom Guide • Source: PAU Ludhiana`;
        break;
      case "produce_quality":
        dataToShow = VERIFIED_DATA.produce_quality;
        metaDesc = `AGMARK & Mandi Board Grading Standards • Source: Punjab Mandi Board`;
        break;
      default:
        dataToShow = VERIFIED_DATA;
        metaDesc = `All Kisan Vaani Verified Datasets`;
    }

    datasetCodeView.textContent = JSON.stringify(dataToShow, null, 2);
    if (datasetMetaText) datasetMetaText.textContent = metaDesc;
  }

  if (btnInspectDataset && datasetModal) {
    btnInspectDataset.addEventListener("click", () => {
      datasetModal.classList.remove("hidden");
      if (datasetSelect) showDatasetView(datasetSelect.value);
    });
  }

  if (btnCloseDatasetModal && datasetModal) {
    btnCloseDatasetModal.addEventListener("click", () => {
      datasetModal.classList.add("hidden");
    });
  }

  if (datasetSelect) {
    datasetSelect.addEventListener("change", (e) => {
      showDatasetView(e.target.value);
    });
  }


  // Live Weather API Workflow
  let liveApiWeatherData = null;

  function applyWeatherLocalization(lang) {
    if (!liveApiWeatherData || !liveApiWeatherData.current) return;
    const cur = liveApiWeatherData.current;
    const weatherData = liveApiWeatherData;

    const tempBadge = document.querySelector(".weather-temp-badge span:first-child");
    const minMaxSpan = document.getElementById("weather-temp-range");
    const condSpan = document.getElementById("weather-condition-text");
    const metaSpan = document.querySelector(".alert-meta-time");
    const statusBadge = document.getElementById("weather-status-badge");
    const stationCard = document.getElementById("weather-station-card");

    if (tempBadge) tempBadge.textContent = `${cur.temperature_c}°C`;
    if (minMaxSpan) {
      if (lang === "hi") {
        minMaxSpan.textContent = `(न्यूनतम ${cur.temp_min_c}°C, अधिकतम ${cur.temp_max_c}°C)`;
      } else if (lang === "hinglish") {
        minMaxSpan.textContent = `(Min ${cur.temp_min_c}°C, Max ${cur.temp_max_c}°C)`;
      } else {
        minMaxSpan.textContent = `(ਘੱਟੋ-ਘੱਟ ${cur.temp_min_c}°C, ਵੱਧ ਤੋਂ ਵੱਧ ${cur.temp_max_c}°C)`;
      }
    }

    const headerWeatherPill = document.getElementById("header-weather-pill");
    if (headerWeatherPill) {
      const condName = lang === "hi" ? (cur.condition_hi || "कोहरा") : (lang === "hinglish" ? (cur.condition_hinglish || "Mist") : (cur.condition_pa || "ਧੁੰਦ"));
      headerWeatherPill.textContent = `🌡️ ${cur.temperature_c}°C (${condName})`;
      headerWeatherPill.title = `Live Weather: ${cur.temperature_c}°C | Humidity: ${cur.humidity_percent}% | ${weatherData.provider || 'Live OpenWeather API'}`;
    }

    const rainChance = cur.rain_probability_percent !== undefined ? cur.rain_probability_percent : (cur.rain_probability_pct || 0);
    if (condSpan) {
      if (lang === "hi") {
        condSpan.textContent = `${cur.condition_hi || cur.condition} • बारिश की संभावना: ${rainChance}% • हवा: ${cur.wind_speed_kmh} km/h शांत`;
      } else if (lang === "hinglish") {
        condSpan.textContent = `${cur.condition_hinglish || cur.condition} • Rain chance: ${rainChance}% • Wind: ${cur.wind_speed_kmh} km/h calm`;
      } else {
        condSpan.textContent = `${cur.condition_pa || cur.condition} • ਮੀਂਹ ਸੰਭਾਵਨਾ: ${rainChance}% • ਹਵਾ: ${cur.wind_speed_kmh} km/h ਸ਼ਾਂਤ`;
      }
    }

    if (statusBadge) {
      const isSafe = (weatherData.spray_advisory && weatherData.spray_advisory.status === "SAFE") || cur.wind_speed_kmh <= 15;
      if (lang === "hi") {
        statusBadge.textContent = isSafe ? "सुरक्षित स्थिति" : "चेतावनी";
      } else if (lang === "hinglish") {
        statusBadge.textContent = isSafe ? "Safe Condition" : "Weather Alert";
      } else {
        statusBadge.textContent = isSafe ? "ਸੁਰੱਖਿਅਤ ਸਥਿਤੀ" : "ਚਿਤਾਵਨੀ";
      }
      statusBadge.style.background = isSafe ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)";
      statusBadge.style.color = isSafe ? "#A7F3D0" : "#FECACA";
    }

    if (metaSpan) {
      const prov = weatherData.provider ? ` • 🛰️ ${weatherData.provider}` : '';
      if (lang === "hi") {
        metaSpan.innerHTML = `<span>स्रोत: ${weatherData.source_name || 'Agromet IMD एवं KVK अमृतसर'}${prov}</span> <span>अपडेट: ${weatherData.last_updated_hi || weatherData.last_updated}</span>`;
      } else if (lang === "hinglish") {
        metaSpan.innerHTML = `<span>Source: ${weatherData.source_name || 'Agromet IMD & KVK Amritsar'}${prov}</span> <span>Updated: ${weatherData.last_updated_hinglish || weatherData.last_updated}</span>`;
      } else {
        metaSpan.innerHTML = `<span>ਸਰੋਤ: ${weatherData.source_name || 'Agromet IMD & KVK Amritsar'}${prov}</span> <span>ਅੱਪਡੇਟ: ${weatherData.last_updated_pa || weatherData.last_updated}</span>`;
      }
    }

    if (stationCard) {
      if (lang === "hi") {
        stationCard.innerHTML = `
          <h4>📍 ${weatherData.location_hi || 'अमृतसर'} (${weatherData.station || 'एग्रोमेट मौसम केंद्र'})</h4>
          <span class="info-highlight">तापमान: ${cur.temperature_c}°C (न्यूनतम ${cur.temp_min_c}°C, अधिकतम ${cur.temp_max_c}°C) • नमी: ${cur.humidity_percent}%</span>
          <p>${weatherData.alerts && weatherData.alerts.rain ? weatherData.alerts.rain.speech_hi : 'मौसम शुष्क और साफ रहेगा।'}</p>
          <p><strong>🚜 कीटनाशक स्प्रे सलाह:</strong> ${(weatherData.spray_advisory && weatherData.spray_advisory.advisory_hi) || 'हवा शांत है, दोपहर में स्प्रे सुरक्षित है।'}</p>
        `;
      } else if (lang === "hinglish") {
        stationCard.innerHTML = `
          <h4>📍 ${weatherData.location_hinglish || 'Amritsar'} (${weatherData.station || 'Real-Time Weather Station'})</h4>
          <span class="info-highlight">Temperature: ${cur.temperature_c}°C (Min ${cur.temp_min_c}°C, Max ${cur.temp_max_c}°C) • Humidity: ${cur.humidity_percent}%</span>
          <p>${weatherData.alerts && weatherData.alerts.rain ? weatherData.alerts.rain.speech_hinglish : 'Mausam sukha aur saaf rahega.'}</p>
          <p><strong>🚜 Spray Advisory:</strong> ${(weatherData.spray_advisory && weatherData.spray_advisory.advisory_hinglish) || 'Hawa shant hai, spray safe hai.'}</p>
        `;
      } else {
        stationCard.innerHTML = `
          <h4>📍 ${weatherData.location_pa || 'ਅੰਮ੍ਰਿਤਸਰ'} (${weatherData.station || 'ਐਗਰੋਮੈਟ ਮੌਸਮ ਕੇਂਦਰ'})</h4>
          <span class="info-highlight">ਤਾਪਮਾਨ: ${cur.temperature_c}°C (ਘੱਟੋ-ਘੱਟ ${cur.temp_min_c}°C, ਵੱਧ ਤੋਂ ਵੱਧ ${cur.temp_max_c}°C) • ਨਮੀ: ${cur.humidity_percent}%</span>
          <p>${weatherData.alerts && weatherData.alerts.rain ? weatherData.alerts.rain.speech_pa : 'ਮੌਸਮ ਖੁਸ਼ਕ ਅਤੇ ਸਾਫ਼ ਰਹੇਗਾ।'}</p>
          <p><strong>🚜 ਕੀਟਨਾਸ਼ਕ ਸਪਰੇਅ ਸਲਾਹ:</strong> ${(weatherData.spray_advisory && weatherData.spray_advisory.advisory_pa) || 'ਹਵਾ ਸ਼ਾਂਤ ਹੈ, ਦੁਪਹਿਰ ਵੇਲੇ ਸਪਰੇਅ ਸੁਰੱਖਿਅਤ ਹੈ।'}</p>
        `;
      }
    }
  }

  async function loadWeatherFromApi() {
    if (!window.kisanApi) return;
    try {
      const weatherData = await window.kisanApi.getWeather();
      if (weatherData && weatherData.current) {
        liveApiWeatherData = weatherData;
        applyWeatherLocalization(currentLang);
      }
    } catch (e) {
      console.warn("[WeatherAPI] Using static observations:", e);
    }
  }

  // System Health & Environment Status Workflow
  async function checkApiHealth() {
    if (!window.kisanApi) return;
    try {
      const health = await window.kisanApi.getHealth();
      const pill = document.querySelector(".header-district-bar .verified-pill:last-child");
      if (pill) {
        const aiBadge = health.gemini_api_configured ? "✨ Gemini AI Online" : "⚡ Local Rule Engine";
        pill.innerHTML = `🟢 Live API • ${aiBadge} • ${health.verified_records.mandi_prices} Mandis`;
        pill.title = `Environment: ${health.environment || 'development'} | District: ${health.district} | Zero Hallucination: True`;
      }
    } catch (e) {
      console.warn("[HealthAPI] Running in offline client mode:", e);
    }
  }

  // Trigger Live Workflows on Application Startup
  checkApiHealth();
  loadWeatherFromApi();
  loadMandiPricesFromApi();
  setLanguage(currentLang);

  // Allow uploading a custom structured JSON dataset file
  if (datasetUploadInput) {
    datasetUploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (datasetCodeView) {
            datasetCodeView.textContent = JSON.stringify(parsed, null, 2);
          }
          if (datasetMetaText) {
            datasetMetaText.textContent = `✓ Uploaded JSON: "${file.name}" (${(file.size/1024).toFixed(1)} KB)`;
          }
          alert(currentLang === 'hinglish' ? 'Structured JSON dataset loaded successfully!' : 'ਡਾਟਾਸੈੱਟ ਫਾਈਲ ਸਫ਼ਲਤਾਪੂਰਵਕ ਲੋਡ ਕੀਤੀ ਗਈ ਹੈ!');
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    });
  }
});
