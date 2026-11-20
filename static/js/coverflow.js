/**
 * coverflow.js - 3D Coverflow Topic Navigation for Kisan Vaani
 * Supports: 'pa' (Punjabi), 'hi' (Hindi), 'hinglish' (Conversational Roman)
 */

class TopicCoverflow {
  constructor(options = {}) {
    this.container = document.getElementById(options.containerId || "coverflow-container");
    this.stage = document.getElementById(options.stageId || "coverflow-stage");
    this.prevBtn = document.getElementById(options.prevBtnId || "coverflow-prev");
    this.nextBtn = document.getElementById(options.nextBtnId || "coverflow-next");
    this.dotsContainer = document.getElementById(options.dotsContainerId || "coverflow-dots");
    this.activeTopicText = document.getElementById(options.activeTopicTextId || "coverflow-active-text");
    this.prepQuestionText = document.getElementById(options.prepQuestionTextId || "coverflow-prep-question");
    this.askPrepBtn = document.getElementById(options.askPrepBtnId || "coverflow-ask-btn");
    this.onSelectQuestion = options.onSelectQuestion || null;

    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;

    // 5 Official Topics with Punjabi, Hindi, and Hinglish
    this.topics = [
      {
        id: "veg_fruits",
        icon: "🥦",
        title_pa: "ਸਬਜ਼ੀਆਂ ਅਤੇ ਫ਼ਲਾਂ ਦੇ ਭਾਅ",
        title_hi: "सब्जियों और फलों के मंडी भाव",
        title_hinglish: "Sabziyon aur Phalon ke Bhav",
        subtitle_pa: "ਨਵਾਂ ਆਲੂ, ਕਿੰਨੂ, ਹਰੇ ਮਟਰ, ਪਿਆਜ਼, ਗਾਜਰ",
        subtitle_hi: "नया आलू, किन्नू, ताज़ा मटर, प्याज, गाजर",
        subtitle_hinglish: "Naya aalu, Punjab kinnow, hare matar, pyaz",
        sample_q_pa: "ਵੱਲ੍ਹਾ ਮੰਡੀ ਵਿੱਚ ਨਵੇਂ ਆਲੂ ਅਤੇ ਕਿੰਨੂ ਦਾ ਭਾਅ ਕੀ ਹੈ?",
        sample_q_hi: "वल्लाह मंडी में नए आलू और किन्नू का भाव क्या है?",
        sample_q_hinglish: "Vallah mandi mein naye aalu aur kinnow ka rate kya hai?"
      },
      {
        id: "weather_alerts",
        icon: "🌦️",
        title_pa: "ਮੌਸਮ ਅਤੇ ਸਥਾਨਕ ਅਲਰਟ",
        title_hi: "मौसम और स्थानीय अलर्ट",
        title_hinglish: "Mausam aur Local Alerts",
        subtitle_pa: "ਮੀਂਹ, ਤੇਜ਼ ਹਵਾ ਅਤੇ ਸਵੇਰ ਦੀ ਠੰਢ/ਧੁੰਦ ਚਿਤਾਵਨੀ",
        subtitle_hi: "बारिश, तेज हवा और कोहरा/शीत अलर्ट",
        subtitle_hinglish: "Barish, hawa aur subah ki dhund alert",
        sample_q_pa: "ਕੀ ਅੰਮ੍ਰਿਤਸਰ ਵਿੱਚ ਅੱਜ ਕੋਈ ਮੌਸਮ ਜਾਂ ਮੀਂਹ ਦਾ ਅਲਰਟ ਹੈ?",
        sample_q_hi: "क्या अमृतसर में आज कोई मौसम या बारिश का अलर्ट है?",
        sample_q_hinglish: "Kya Amritsar mein aaj koi barish ya weather alert hai?"
      },
      {
        id: "govt_schemes",
        icon: "📜",
        title_pa: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਤੇ ਸਬਸਿਡੀਆਂ",
        title_hi: "सरकारी योजनाएं और सब्सिडी",
        title_hinglish: "Sarkari Schemes aur Subsidy",
        subtitle_pa: "ਪੀਐਮ ਕਿਸਾਨ ₹6000, ਪਰਾਲੀ ਮਸ਼ੀਨਰੀ, ਸੋਲਰ ਪੰਪ",
        subtitle_hi: "पीएम किसान, पराली मशीनरी, सोलर पंप सब्सिडी",
        subtitle_hinglish: "PM Kisan 6000, Super Seeder, Solar pump",
        sample_q_pa: "ਪੀਐਮ ਕਿਸਾਨ ਯੋਜਨਾ ਦੀ ਅਗਲੀ ਕਿਸ਼ਤ ਅਤੇ ਨਿਯਮ ਕੀ ਹਨ?",
        sample_q_hi: "पीएम किसान योजना की अगली किस्त और नियम क्या हैं?",
        sample_q_hinglish: "PM Kisan yojana ki agli kist ke niyam kya hain?"
      },
      {
        id: "crop_advice",
        icon: "🌾",
        title_pa: "ਫ਼ਸਲ ਸੰਭਾਲ ਤੇ ਰੋਗ ਸਲਾਹ",
        title_hi: "फसल देखभाल और रोग सलाह",
        title_hinglish: "Crop Advice aur Rog Salah",
        subtitle_pa: "ਕਣਕ ਕੋਰ ਪਾਣੀ, ਆਲੂ ਝੁਲਸਾ ਰੋਗ, ਸਰ੍ਹੋਂ ਤੇਲਾ",
        subtitle_hi: "गेहूं पहला पानी, आलू झुलसा, सरसों चेपा",
        subtitle_hinglish: "Gehu pehla pani, aalu late blight rog",
        sample_q_pa: "ਕਣਕ ਦੀ ਬਿਜਾਈ ਤੋਂ ਬਾਅਦ ਪਹਿਲਾ ਕੋਰ ਪਾਣੀ ਕਦੋਂ ਲਗਾਈਏ?",
        sample_q_hi: "गेहूं की बुवाई के बाद पहला पानी कब लगाना चाहिए?",
        sample_q_hinglish: "Gehu ki buwai ke baad pehla kor paani kab lagana chahiye?"
      },
      {
        id: "nearby_mandis",
        icon: "📍",
        title_pa: "ਨੇੜਲੀਆਂ ਮੰਡੀਆਂ ਤੇ ਸਹੂਲਤਾਂ",
        title_hi: "नजदीकी मंडियां और सुविधाएं",
        title_hinglish: "Nearby Mandis aur Suvidhayein",
        subtitle_pa: "ਵੱਲ੍ਹਾ, ਮਜੀਠਾ, ਰਈਆ, ਜੰਡਿਆਲਾ ਦੂਰੀ ਤੇ ਸਮਾਂ",
        subtitle_hi: "वल्लाह, मजीठा, रईया दूरी और सुविधाएं",
        subtitle_hinglish: "Vallah, Majitha, Rayya distance aur timings",
        sample_q_pa: "ਅੰਮ੍ਰਿਤਸਰ ਦੀ ਵੱਲ੍ਹਾ ਮੰਡੀ ਦੀ ਦੂਰੀ ਅਤੇ ਸਹੂਲਤਾਂ ਕੀ ਹਨ?",
        sample_q_hi: "अमृतसर की वल्लाह मंडी की दूरी और सुविधाएं क्या हैं?",
        sample_q_hinglish: "Amritsar Vallah mandi ki distance aur timings kya hain?"
      }
    ];

    this.currentLang = "pa";
    this.init();
  }

  init() {
    this.renderCards();
    this.renderDots();
    this.update3DPositions();
    this.bindEvents();
  }

  setLanguage(lang) {
    this.currentLang = lang;
    this.renderCards();
    this.updateActiveDetails();
  }

  renderCards() {
    if (!this.stage) return;
    this.stage.innerHTML = "";

    this.topics.forEach((topic, idx) => {
      const card = document.createElement("div");
      card.className = "coverflow-card";
      card.dataset.index = idx;
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      const title = topic[`title_${this.currentLang}`] || topic.title_pa;
      const subtitle = topic[`subtitle_${this.currentLang}`] || topic.subtitle_pa;

      const topicTag = this.currentLang === "hi" ? `विषय ${idx + 1} / 5` : (this.currentLang === "hinglish" ? `Topic ${idx + 1} / 5` : `ਵਿਸ਼ਾ ${idx + 1} / 5`);
      const tapText = this.currentLang === "hi" ? `चुनने के लिए टैप करें 👆` : (this.currentLang === "hinglish" ? `Tap to Select 👆` : `ਚੁਣਨ ਲਈ ਟੈਪ ਕਰੋ 👆`);

      card.setAttribute("aria-label", title);

      card.innerHTML = `
        <div class="card-glass-shine"></div>
        <div class="card-icon-bubble">${topic.icon}</div>
        <div class="card-body-content">
          <span class="card-topic-tag">${topicTag}</span>
          <h3 class="card-title">${title}</h3>
          <p class="card-subtitle">${subtitle}</p>
        </div>
        <div class="card-footer-tap">
          <span>${tapText}</span>
        </div>
      `;

      card.addEventListener("click", () => this.goToIndex(idx));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.goToIndex(idx);
        }
      });

      this.stage.appendChild(card);
    });
  }

  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = "";

    this.topics.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `coverflow-dot ${idx === this.currentIndex ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to topic ${idx + 1}`);
      dot.addEventListener("click", () => this.goToIndex(idx));
      this.dotsContainer.appendChild(dot);
    });
  }

  bindEvents() {
    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.next());

    if (this.stage) {
      this.stage.addEventListener("touchstart", (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.stage.addEventListener("touchend", (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    if (this.askPrepBtn) {
      this.askPrepBtn.addEventListener("click", () => {
        const topic = this.topics[this.currentIndex];
        const sample = topic[`sample_q_${this.currentLang}`] || topic.sample_q_pa;
        if (this.onSelectQuestion && sample) {
          this.onSelectQuestion(sample);
        }
      });
    }

    window.addEventListener("keydown", (e) => {
      if (document.activeElement && document.activeElement.classList.contains("coverflow-card")) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.prev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          this.next();
        }
      }
    });
  }

  handleSwipe() {
    const diff = this.touchEndX - this.touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.topics.length) % this.topics.length;
    this.update3DPositions();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.topics.length;
    this.update3DPositions();
  }

  goToIndex(idx) {
    this.currentIndex = idx;
    this.update3DPositions();
  }

  update3DPositions() {
    const cards = this.stage ? this.stage.querySelectorAll(".coverflow-card") : [];
    const total = cards.length;

    cards.forEach((card, idx) => {
      let offset = idx - this.currentIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      card.classList.remove("active", "prev", "next", "hidden-far");

      if (offset === 0) {
        card.classList.add("active");
        card.style.transform = `translateX(0) translateZ(120px) rotateY(0deg) scale(1.05)`;
        card.style.zIndex = "10";
        card.style.opacity = "1";
        card.style.filter = "none";
      } else if (offset === 1) {
        card.classList.add("next");
        card.style.transform = `translateX(150px) translateZ(-50px) rotateY(-36deg) scale(0.85)`;
        card.style.zIndex = "8";
        card.style.opacity = "0.78";
        card.style.filter = "brightness(0.9)";
      } else if (offset === -1) {
        card.classList.add("prev");
        card.style.transform = `translateX(-150px) translateZ(-50px) rotateY(36deg) scale(0.85)`;
        card.style.zIndex = "8";
        card.style.opacity = "0.78";
        card.style.filter = "brightness(0.9)";
      } else if (offset > 1) {
        card.classList.add("hidden-far");
        card.style.transform = `translateX(230px) translateZ(-120px) rotateY(-45deg) scale(0.7)`;
        card.style.zIndex = "5";
        card.style.opacity = "0.35";
      } else {
        card.classList.add("hidden-far");
        card.style.transform = `translateX(-230px) translateZ(-120px) rotateY(45deg) scale(0.7)`;
        card.style.zIndex = "5";
        card.style.opacity = "0.35";
      }
    });

    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll(".coverflow-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === this.currentIndex);
      });
    }

    this.updateActiveDetails();
  }

  updateActiveDetails() {
    const topic = this.topics[this.currentIndex];
    const title = topic[`title_${this.currentLang}`] || topic.title_pa;
    const sample = topic[`sample_q_${this.currentLang}`] || topic.sample_q_pa;

    if (this.activeTopicText) {
      this.activeTopicText.textContent = `${topic.icon} ${title}`;
    }

    if (this.prepQuestionText) {
      this.prepQuestionText.textContent = `"${sample}"`;
    }
  }
}

window.TopicCoverflow = TopicCoverflow;
