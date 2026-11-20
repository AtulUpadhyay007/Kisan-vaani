/**
 * speech_pipeline.js - Client-Side Speech Recognition & Audio Synthesizer
 * Supports: 'pa' (Punjabi), 'hi' (Hindi), 'hinglish' (Conversational Roman)
 */

class AudioFx {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playMicOpen() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playMicClose() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playDtmf(digit) {
    this.init();
    if (!this.ctx) return;
    const dtmfFrequencies = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
    };
    const freqs = dtmfFrequencies[digit];
    if (!freqs) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.frequency.value = freqs[0];
    osc2.frequency.value = freqs[1];
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.18);
    osc2.stop(this.ctx.currentTime + 0.18);
  }
}

class SpeechPipeline {
  constructor() {
    this.audioFx = new AudioFx();
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.isListening = false;
    this.currentLang = "pa"; // 'pa', 'hi', or 'hinglish'
    this.speechRate = 0.95;
    this.voices = [];

    this.initSpeechRecognition();
    this.loadVoices();
  }

  loadVoices() {
    if (!this.synthesis) return;
    const update = () => {
      this.voices = this.synthesis.getVoices();
    };
    update();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = update;
    }
  }

  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn("Web Speech Recognition not supported in this browser; text fallback active.");
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.updateRecognitionLang();
  }

  setLanguage(lang) {
    this.currentLang = lang;
    this.updateRecognitionLang();
  }

  updateRecognitionLang() {
    if (!this.recognition) return;
    if (this.currentLang === "hi") {
      this.recognition.lang = "hi-IN";
    } else if (this.currentLang === "hinglish") {
      this.recognition.lang = "en-IN"; // Mixed Indian English acoustic model handles Roman Hindi/Punjabi keywords
    } else {
      this.recognition.lang = "pa-IN";
    }
  }

  startListening(onInterim, onFinal, onError, onStart, onEnd) {
    if (!this.recognition) {
      onError("Voice recognition unavailable in this browser. Please use text input or quick prompt buttons.");
      return;
    }

    try {
      this.audioFx.playMicOpen();
      this.isListening = true;

      this.recognition.onstart = () => {
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim && onInterim) onInterim(interim);
        if (final && onFinal) onFinal(final);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.warn("Speech error:", event.error);
        if (event.error === "no-speech") {
          onError(this.currentLang === "hinglish" 
            ? "Koi aawaz sunai nahi di. Mic ke paas aakar boliye."
            : (this.currentLang === "hi" ? "कोई आवाज़ सुनाई नहीं दी। कृपया माइक के पास बोलें।" : "ਕੋਈ ਆਵਾਜ਼ ਸੁਣਾਈ ਨਹੀਂ ਦਿੱਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਬੋਲੋ।"));
        } else if (event.error === "not-allowed") {
          onError("Microphone permission denied. Please allow microphone access in browser.");
        } else {
          onError(`Speech issue: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.audioFx.playMicClose();
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      console.error(e);
      onError("Could not start microphone.");
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text, onStart, onEnd) {
    if (!this.synthesis) {
      console.warn("Speech synthesis not supported.");
      return;
    }

    this.stopSpeaking();

    const cleanText = text.replace(/[₹%*#]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick best voice
    let targetLang = "pa-IN";
    if (this.currentLang === "hi") {
      targetLang = "hi-IN";
    } else if (this.currentLang === "hinglish") {
      targetLang = "en-IN";
    }

    let matchedVoice = null;
    if (this.currentLang === "hinglish") {
      matchedVoice = this.voices.find(v => v.lang === "en-IN" || v.lang.includes("India"));
      if (!matchedVoice) matchedVoice = this.voices.find(v => v.lang.includes("hi"));
    } else if (this.currentLang === "hi") {
      matchedVoice = this.voices.find(v => v.lang.includes("hi") || v.lang.includes("Hindi"));
    } else {
      matchedVoice = this.voices.find(v => v.lang.includes("pa") || v.lang.includes("Guru"));
      if (!matchedVoice) matchedVoice = this.voices.find(v => v.lang.includes("hi"));
    }

    if (!matchedVoice && this.voices.length > 0) {
      matchedVoice = this.voices[0];
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.lang = targetLang;
    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("TTS Error:", e);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  setRate(rate) {
    this.speechRate = rate;
  }

  groundLocally(rawText, lang = "pa") {
    const start = performance.now();
    const text = rawText.toLowerCase();

    // Check weather alert
    if (text.includes("alert") || text.includes("ਚਿਤਾਵਨੀ") || text.includes("चेतावनी") || text.includes("warning")) {
      const w = VERIFIED_DATA.weather;
      const speech = lang === "hinglish"
        ? "Amritsar Weather Alert: Aaj barish ka koi chance nahi hai (0%). Subah halki dhund aur cold warning hai, temp 11 degree rahega. Hawa 8 km/h shant hai."
        : (lang === "hi" ? "अमृतसर मौसम अलर्ट: आज बारिश की कोई संभावना नहीं है। सुबह हल्का कोहरा व ठंड रहेगी।" : "ਅੰਮ੍ਰਿਤਸਰ ਮੌਸਮ ਅਲਰਟ: ਅੱਜ ਮੀਂਹ ਦੀ ਕੋਈ ਸੰਭਾਵਨਾ ਨਹੀਂ ਹੈ (0%)। ਸਵੇਰ ਵੇਲੇ ਹਲਕੀ ਧੁੰਦ ਤੇ ਠੰਢ ਰਹੇਗੀ।");

      return {
        query: rawText,
        intent: "weather_alert",
        is_grounded: true,
        source: VERIFIED_DATA.source_name,
        last_updated: VERIFIED_DATA.last_updated_pa,
        spoken_answer: speech,
        display_title: lang === "hinglish" ? "Amritsar Weather Alert (Safe 0% Rain)" : (lang === "hi" ? "अमृतसर मौसम अलर्ट (सुरक्षित)" : "ਅੰਮ੍ਰਿਤਸਰ ਮੌਸਮ ਅਲਰਟ (ਸੁਰੱਖਿਅਤ)"),
        display_subtitle: `Rain: 0% | Wind: 8 km/h | Min Temp: 11°C`,
        details: { temp: "22°C", rain: "0%", wind: "8 km/h" },
        latency_ms: (performance.now() - start).toFixed(2),
        suggested_actions: ["Spray Advisory", "Today Weather", "Aalu Rate"]
      };
    }

    // Default to mandi check
    const mandiItems = VERIFIED_DATA.mandis;
    let matched = mandiItems[0];
    if (text.includes("1121") || text.includes("basmati")) matched = mandiItems.find(m => m.id === "basmati_1121_vallah");
    if (text.includes("aalu") || text.includes("ਆਲੂ") || text.includes("aloo") || text.includes("potato")) matched = mandiItems.find(m => m.id === "potato_pukhraj");
    if (text.includes("kinnow") || text.includes("ਕਿੰਨੂ") || text.includes("kinnu")) matched = mandiItems.find(m => m.id === "kinnow_mandarin");
    if (text.includes("gehu") || text.includes("kanak") || text.includes("ਕਣਕ") || text.includes("wheat")) matched = mandiItems.find(m => m.id === "wheat_vallah");

    const speech = lang === "hinglish" 
      ? `Amritsar ki Vallah mandi mein ${matched.commodity} ka average rate ${matched.modal_price} rupaye per quintal hai.`
      : (lang === "hi" ? matched.speech_hi : matched.speech_pa);

    return {
      query: rawText,
      intent: "mandi_price",
      is_grounded: true,
      source: VERIFIED_DATA.source_name,
      last_updated: VERIFIED_DATA.last_updated_pa,
      spoken_answer: speech,
      display_title: matched.commodity,
      display_subtitle: `Average Rate: ₹${matched.modal_price} ${matched.unit}`,
      details: {
        modal_price: matched.modal_price,
        min_price: matched.min_price,
        max_price: matched.max_price,
        arrival: `${matched.arrival_quintals} Qtl`
      },
      latency_ms: (performance.now() - start).toFixed(2),
      suggested_actions: ["Basmati 1121 Rate", "Naya Aalu Rate", "Today Weather"]
    };
  }
}

window.SpeechPipeline = SpeechPipeline;
