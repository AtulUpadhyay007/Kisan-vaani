/**
 * ivr_simulator.js - Basic Phone / Feature Phone Helpline Simulator (IVR 1800-180-1551)
 * Enables farmers or judges to experience the basic button-phone helpline.
 */

class IvrSimulator {
  constructor(speechPipeline) {
    this.pipeline = speechPipeline;
    this.isOpen = false;
    this.isInCall = false;
    this.currentDialed = "";
    this.callTimer = null;
    this.callDurationSec = 0;
    this.ivrMenuLang = "pa"; // 'pa', 'hi', or 'hinglish'
  }

  setLanguage(lang) {
    this.ivrMenuLang = lang;
    if (!this.isInCall && this.screenEl) {
      if (lang === "hi") {
        this.screenEl.textContent = "कॉल शुरू करने के लिए [Call] दबाएं।";
      } else if (lang === "hinglish") {
        this.screenEl.textContent = "Call shuru karne ke liye [Call] button press karein.";
      } else {
        this.screenEl.textContent = "ਕਾਲ ਸ਼ੁਰੂ ਕਰਨ ਲਈ [Call] ਦਬਾਓ।";
      }
    }

    const keySubs = {
      "1": { pa: "ਮੰਡੀ ਭਾਅ", hi: "मंडी भाव", hinglish: "Mandi Bhav" },
      "2": { pa: "ਮੌਸਮ", hi: "मौसम", hinglish: "Weather" },
      "3": { pa: "ਸਕੀਮਾਂ", hi: "योजनाएं", hinglish: "Schemes" },
      "4": { pa: "ਫ਼ਸਲ ਸਲਾਹ", hi: "फसल सलाह", hinglish: "Crop Care" },
      "5": { pa: "ਮੰਡੀਆਂ", hi: "मंडियां", hinglish: "Mandis" },
      "6": { pa: "MNO", hi: "MNO", hinglish: "MNO" },
      "7": { pa: "PQRS", hi: "PQRS", hinglish: "PQRS" },
      "8": { pa: "TUV", hi: "TUV", hinglish: "TUV" },
      "9": { pa: "WXYZ", hi: "WXYZ", hinglish: "WXYZ" },
      "*": { pa: "ਭਾਸ਼ਾ", hi: "भाषा", hinglish: "Language" },
      "0": { pa: "ਮੀਨੂ", hi: "मेनू", hinglish: "Menu" },
      "#": { pa: "ਅਧਿਕਾਰੀ", hi: "अधिकारी", hinglish: "Officer" }
    };

    document.querySelectorAll(".keypad-key").forEach(k => {
      const digit = k.dataset.key;
      const sub = k.querySelector(".key-sub");
      if (sub && keySubs[digit]) {
        sub.textContent = keySubs[digit][lang] || keySubs[digit].pa;
      }
    });

    if (this.callBtn) {
      this.callBtn.textContent = lang === "hi" ? "📞 कॉल (Call)" : (lang === "hinglish" ? "📞 Call" : "📞 ਕਾਲ (Call)");
    }
    if (this.hangupBtn) {
      this.hangupBtn.textContent = lang === "hi" ? "🛑 समाप्त (End)" : (lang === "hinglish" ? "🛑 End" : "🛑 ਕੱਟੋ (End)");
    }
    const closeBtn = document.getElementById("btn-close-ivr");
    if (closeBtn) {
      closeBtn.textContent = lang === "hi" ? "✕ बंद करें (Close)" : (lang === "hinglish" ? "✕ Close" : "✕ ਬੰਦ ਕਰੋ (Close)");
    }
  }

  init() {
    this.modal = document.getElementById("ivr-modal");
    this.screenEl = document.getElementById("phone-screen-text");
    this.timerEl = document.getElementById("phone-call-timer");
    this.statusEl = document.getElementById("phone-call-status");
    this.dialedEl = document.getElementById("phone-dialed-number");
    this.callBtn = document.getElementById("phone-btn-call");
    this.hangupBtn = document.getElementById("phone-btn-hangup");

    this.bindEvents();
  }

  bindEvents() {
    // Keypad button clicks
    document.querySelectorAll(".keypad-key").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const digit = btn.dataset.key;
        this.handleDigitPress(digit);
      });
    });

    if (this.callBtn) {
      this.callBtn.addEventListener("click", () => this.startCall());
    }

    if (this.hangupBtn) {
      this.hangupBtn.addEventListener("click", () => this.endCall());
    }

    const openBtn = document.getElementById("btn-open-ivr");
    if (openBtn) {
      openBtn.addEventListener("click", () => this.openModal());
    }

    const closeBtn = document.getElementById("btn-close-ivr");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }
  }

  openModal() {
    if (this.modal) {
      this.modal.classList.add("active");
      this.isOpen = true;
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove("active");
      this.isOpen = false;
      this.endCall();
    }
  }

  startCall() {
    if (this.isInCall) return;
    this.isInCall = true;
    this.callDurationSec = 0;
    this.pipeline.audioFx.playMicOpen();

    const isHi = this.ivrMenuLang === "hi";
    const isHinglish = this.ivrMenuLang === "hinglish";

    if (this.statusEl) {
      this.statusEl.textContent = isHi ? "कॉल जुड़ रही है... (Connecting)" : (isHinglish ? "Call connecting..." : "ਕਾਲ ਜੁੜ ਰਹੀ ਹੈ... (Connecting)");
    }
    if (this.dialedEl) {
      this.dialedEl.textContent = isHi ? "1800-180-1551 (टोल-फ्री)" : (isHinglish ? "1800-180-1551 (Toll-Free)" : "1800-180-1551 (ਟੋਲ-ਫ੍ਰੀ)");
    }

    setTimeout(() => {
      if (!this.isInCall) return;
      if (this.statusEl) {
        this.statusEl.textContent = isHi ? "कॉल चल रही है (Call Connected)" : (isHinglish ? "Call Connected (00:00)" : "ਕਾਲ ਚੱਲ ਰਹੀ ਹੈ (Call Connected)");
      }
      this.startTimer();

      const welcomePa = "ਕਿਸਾਨ ਮੰਡੀ ਸਾਥੀ ਹੈਲਪਲਾਈਨ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਅੰਮ੍ਰਿਤਸਰ ਮੰਡੀ ਭਾਅ ਲਈ 1 ਦਬਾਓ। ਅੱਜ ਦੇ ਮੌਸਮ ਲਈ 2 ਦਬਾਓ। ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲਈ 3 ਦਬਾਓ। ਸਪਰੇਅ ਸਲਾਹ ਲਈ 4 ਦਬਾਓ।";
      const welcomeHi = "किसान मंडी साथी हेल्पलाइन में आपका स्वागत है। अमृतसर मंडी भाव के लिए 1 दबाएं। मौसम के लिए 2 दबाएं। सरकारी योजनाओं के लिए 3 दबाएं। स्प्रे सलाह के लिए 4 दबाएं।";
      const welcomeHinglish = "Kisan Mandi Saathi helpline mein aapka swagat hai. Amritsar mandi bhav ke liye 1 dabayein. Mausam ke liye 2 dabayein. Schemes ke liye 3 dabayein. Spray advice ke liye 4 dabayein.";

      const welcomeText = isHi ? welcomeHi : (isHinglish ? welcomeHinglish : welcomePa);
      const menuTitle = isHi ? "मुख्य मेनू (Main Menu)" : (isHinglish ? "Main Menu (Options)" : "ਮੁੱਖ ਮੀਨੂ (Main Menu)");
      this.updateScreen(welcomeText, menuTitle);
      this.pipeline.speak(welcomeText);
    }, 1200);
  }

  endCall() {
    if (!this.isInCall) return;
    this.isInCall = false;
    clearInterval(this.callTimer);
    this.pipeline.stopSpeaking();
    this.pipeline.audioFx.playMicClose();

    const isHi = this.ivrMenuLang === "hi";
    const isHinglish = this.ivrMenuLang === "hinglish";

    if (this.statusEl) {
      this.statusEl.textContent = isHi ? "कॉल समाप्त (Call Ended)" : (isHinglish ? "Call Ended" : "ਕਾਲ ਸਮਾਪਤ (Call Ended)");
    }
    if (this.screenEl) {
      this.screenEl.textContent = isHi ? "कॉल समाप्त हो गई है। दोबारा शुरू करने के लिए हरा बटन दबाएं।" : (isHinglish ? "Call kat chuki hai. Dobara sunne ke liye Call press karein." : "ਕਾਲ ਕੱਟ ਦਿੱਤੀ ਗਈ ਹੈ। ਦੁਬਾਰਾ ਸੁਣਨ ਲਈ ਹਰਾ ਬਟਨ ਦਬਾਓ।");
    }
    if (this.timerEl) this.timerEl.textContent = "00:00";
  }

  startTimer() {
    clearInterval(this.callTimer);
    this.callTimer = setInterval(() => {
      this.callDurationSec++;
      const mins = String(Math.floor(this.callDurationSec / 60)).padStart(2, "0");
      const secs = String(this.callDurationSec % 60).padStart(2, "0");
      if (this.timerEl) this.timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  handleDigitPress(digit) {
    this.pipeline.audioFx.playDtmf(digit);

    if (!this.isInCall) {
      if (this.dialedEl) {
        if (this.dialedEl.textContent.includes("ਟੋਲ-ਫ੍ਰੀ") || this.dialedEl.textContent.includes("टोल-फ्री") || this.dialedEl.textContent.includes("Toll-Free")) this.dialedEl.textContent = "";
        this.dialedEl.textContent += digit;
      }
      return;
    }

    const isHi = this.ivrMenuLang === "hi";
    const isHinglish = this.ivrMenuLang === "hinglish";
    const waitMsg = isHi ? `बटन [${digit}] दबाया गया... जानकारी लोड हो रही है...` : (isHinglish ? `Button [${digit}] pressed... Loading...` : `ਬਟਨ [${digit}] ਦਬਾਇਆ ਗਿਆ... ਜਾਣਕਾਰੀ ਲੋਡ ਹੋ ਰਹੀ ਹੈ...`);
    const waitTitle = isHi ? `दबाया: ${digit}` : (isHinglish ? `Pressed: ${digit}` : `ਦਬਾਇਆ: ${digit}`);

    // Inside active call
    this.updateScreen(waitMsg, waitTitle);

    // Try backend API workflow via kisanApi
    const apiCall = (window.kisanApi) 
      ? window.kisanApi.sendIvrDigit(digit, this.ivrMenuLang)
      : fetch("/api/ivr_digit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ digit: digit, lang: this.ivrMenuLang })
        }).then(r => r.json());

    apiCall
      .then(data => {
        this.updateScreen(data.speech, data.title);
        this.pipeline.speak(data.speech);
      })
      .catch(() => {
        // Graceful offline fallback
        this.handleLocalIvr(digit);
      });
  }

  handleLocalIvr(digit) {
    const isHi = this.ivrMenuLang === "hi";
    const isHinglish = this.ivrMenuLang === "hinglish";
    if (digit === "1") {
      let speech = "ਅੰਮ੍ਰਿਤਸਰ ਮੰਡੀ ਭਾਅ: ਕਣਕ 2,425 ਰੁਪਏ, ਬਾਸਮਤੀ 1121 3,850 ਰੁਪਏ, ਨਵਾਂ ਆਲੂ 950 ਰੁਪਏ, ਅਤੇ ਸਰ੍ਹੋਂ 5,450 ਰੁਪਏ ਪ੍ਰਤੀ ਕਵਿੰਟਲ ਹੈ। ਦੁਬਾਰਾ ਸੁਣਨ ਲਈ 1 ਦਬਾਓ।";
      let title = "ਮੰਡੀ ਭਾਅ (Mandi Rates)";
      if (isHi) {
        speech = "अमृतसर मंडी भाव: गेहूं 2,425 रुपये, बासमती 1121 3,850 रुपये, नया आलू 950 रुपये, और सरसों 5,450 रुपये प्रति क्विंटल है। दोबारा सुनने के लिए 1 दबाएं।";
        title = "मंडी भाव (Mandi Rates)";
      } else if (isHinglish) {
        speech = "Amritsar mandi bhav: Gehu 2,425 rupaye, Basmati 1121 3,850 rupaye, Naya aalu 950 rupaye, aur Sarson 5,450 rupaye per quintal hai. Dobara sunne ke liye 1 dabayein.";
        title = "Mandi Bhav (Mandi Rates)";
      }
      this.updateScreen(speech, title);
      this.pipeline.speak(speech);
    } else if (digit === "2") {
      let speech = "ਅੰਮ੍ਰਿਤਸਰ ਮੌਸਮ: ਅੱਜ ਮੌਸਮ ਖੁਸ਼ਕ ਅਤੇ ਸਾਫ਼ ਰਹੇਗਾ। ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਜ਼ੀਰੋ ਪ੍ਰਤੀਸ਼ਤ ਹੈ। ਤਾਪਮਾਨ 14 ਡਿਗਰੀ ਅਤੇ ਹਵਾ 4 ਕਿਲੋਮੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਹੈ।";
      let title = "ਮੌਸਮ (Weather)";
      if (isHi) {
        speech = "अमृतसर मौसम: आज मौसम शुष्क और साफ रहेगा। बारिश की संभावना शून्य है। तापमान 14 डिग्री और हवा 4 किमी प्रति घंटा है।";
        title = "मौसम (Weather)";
      } else if (isHinglish) {
        speech = "Amritsar mausam: Aaj mausam sukha aur saaf rahega. Barish ka zero chance hai. Taapmaan 14 degree aur hawa 4 km/h hai.";
        title = "Mausam (Weather)";
      }
      this.updateScreen(speech, title);
      this.pipeline.speak(speech);
    } else if (digit === "3") {
      let speech = "ਸਰਕਾਰੀ ਸਕੀਮਾਂ: ਪੀਐਮ ਕਿਸਾਨ ਤਹਿਤ 6,000 ਰੁਪਏ ਸਾਲਾਨਾ ਮਿਲਦੇ ਹਨ। ਪਰਾਲੀ ਮਸ਼ੀਨਰੀ 'ਤੇ 50 ਤੋਂ 80 ਪ੍ਰਤੀਸ਼ਤ ਅਤੇ ਸੋਲਰ ਪੰਪ 'ਤੇ 60 ਪ੍ਰਤੀਸ਼ਤ ਸਬਸਿਡੀ ਉਪਲਬਧ ਹੈ।";
      let title = "ਸਰਕਾਰੀ ਸਕੀਮਾਂ (Govt Schemes)";
      if (isHi) {
        speech = "सरकारी योजनाएं: पीएम किसान के तहत 6,000 रुपये सालाना मिलते हैं। पराली मशीनरी पर 50 से 80 प्रतिशत और सोलर पंप पर 60 प्रतिशत सब्सिडी उपलब्ध है।";
        title = "सरकारी योजनाएं (Govt Schemes)";
      } else if (isHinglish) {
        speech = "Sarkari schemes: PM-Kisan ke tahat 6,000 rupaye saalana milte hain. Parali machine par 50 se 80 percent subsidy available hai.";
        title = "Government Schemes";
      }
      this.updateScreen(speech, title);
      this.pipeline.speak(speech);
    } else if (digit === "4") {
      let speech = "ਸਪਰੇਅ ਸਲਾਹ: ਅੱਜ ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ 4 ਕਿਲੋਮੀਟਰ ਹੈ। ਕਣਕ ਅਤੇ ਸਰ੍ਹੋਂ 'ਤੇ ਸਪਰੇਅ ਕਰਨਾ ਸੁਰੱਖਿਅਤ ਹੈ। ਕਣਕ ਵਿੱਚ 21 ਦਿਨ ਬਾਅਦ ਪਹਿਲਾ ਪਾਣੀ ਲਗਾਓ।";
      let title = "ਸਪਰੇਅ ਸਲਾਹ (Spray Advice)";
      if (isHi) {
        speech = "स्प्रे सलाह: आज हवा की गति 4 किमी है। फसलों पर कीटनाशक स्प्रे करना सुरक्षित है। गेहूं में 21 दिन बाद पहला पानी लगाएं।";
        title = "स्प्रे सलाह (Spray Advice)";
      } else if (isHinglish) {
        speech = "Spray advice: Aaj hawa 4 km/h hai. Fasal par weedicide ya nutrient spray karna safe hai. Gehu mein 21 din baad pehla kor paani lagayein.";
        title = "Crop Spray Advisory";
      }
      this.updateScreen(speech, title);
      this.pipeline.speak(speech);
    } else {
      let speech = "ਮੰਡੀ ਭਾਅ ਲਈ 1, ਮੌਸਮ ਲਈ 2, ਸਕੀਮਾਂ ਲਈ 3, ਸਪਰੇਅ ਸਲਾਹ ਲਈ 4 ਦਬਾਓ।";
      let title = "ਮੁੱਖ ਮੀਨੂ (Main Menu)";
      if (isHi) {
        speech = "मंडी भाव के लिए 1, मौसम के लिए 2, योजनाओं के लिए 3, स्प्रे सलाह के लिए 4 दबाएं।";
        title = "मुख्य मेनू (Main Menu)";
      } else if (isHinglish) {
        speech = "Mandi bhav ke liye 1, mausam ke liye 2, schemes ke liye 3, spray advice ke liye 4 dabayein.";
        title = "Main Menu";
      }
      this.updateScreen(speech, title);
      this.pipeline.speak(speech);
    }
  }

  updateScreen(text, header) {
    if (this.screenEl) {
      this.screenEl.innerHTML = `<strong>${header || ""}</strong><br>${text}`;
    }
  }
}

window.IvrSimulator = IvrSimulator;
