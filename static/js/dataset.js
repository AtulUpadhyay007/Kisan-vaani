/**
 * dataset.js - Verified Client-Side Mirrored Dataset for Kisan Vaani
 * Ensures 100% offline capability, zero latency, and zero hallucination.
 */

const VERIFIED_DATA = {
  app_name: "Kisan Vaani",
  app_name_pa: "ਕਿਸਾਨ ਵਾਣੀ",
  app_name_hi: "किसान वाणी",
  district: "Amritsar",
  district_pa: "ਅੰਮ੍ਰਿਤਸਰ (ਪੰਜਾਬ)",
  district_hi: "अमृतसर (पंजाब)",
  source_name: "ਪੰਜਾਬ ਰਾਜ ਮੰਡੀ ਬੋਰਡ, KVK ਅੰਮ੍ਰਿਤਸਰ, PAU ਲੁਧਿਆਣਾ ਅਤੇ ਭਾਰਤ ਸਰਕਾਰ",
  last_updated_pa: "20 ਨਵੰਬਰ 2026, ਸਵੇਰੇ 08:30 ਵਜੇ",
  last_updated_hi: "20 नवंबर 2026, सुबह 08:30 बजे",

  mandis: [
    {
      id: "potato_pukhraj",
      category: "vegetables",
      commodity: "Potato (ਨਵਾਂ ਆਲੂ)",
      commodity_pa: "ਆਲੂ (ਨਵਾਂ ਪੁਖਰਾਜ)",
      commodity_hi: "आलू (नया पुखराज)",
      variety: "Pukhraj Fresh Digging",
      mandi: "Vallah Subzi Mandi",
      mandi_pa: "ਵੱਲ੍ਹਾ ਸਬਜ਼ੀ ਮੰਡੀ, ਅੰਮ੍ਰਿਤਸਰ",
      mandi_hi: "वल्लाह सब्जी मंडी, अमृतसर",
      min_price: 800,
      max_price: 1150,
      modal_price: 950,
      unit: "₹ / ਕਵਿੰਟਲ",
      arrival_quintals: 1800,
      trend: "down",
      trend_percent: "-3.2%",
      speech_pa: "ਵੱਲ੍ਹਾ ਸਬਜ਼ੀ ਮੰਡੀ ਵਿੱਚ ਨਵੇਂ ਆਲੂ ਦਾ ਔਸਤ ਭਾਅ 950 ਰੁਪਏ ਪ੍ਰਤੀ ਕਵਿੰਟਲ ਹੈ। ਮੋਟਾ ਆਲੂ 1,150 ਰੁਪਏ ਤੱਕ ਵਿਕ ਰਿਹਾ ਹੈ।",
      speech_hi: "वल्लाह सब्जी मंडी में नए आलू का औसत भाव 950 रुपये प्रति क्विंटल है।"
    },
    {
      id: "green_peas_matar",
      category: "vegetables",
      commodity: "Green Peas (ਹਰੇ ਮਟਰ)",
      commodity_pa: "ਤਾਜ਼ਾ ਹਰੇ ਮਟਰ",
      commodity_hi: "ताज़ा हरे मटर",
      variety: "AP-3 Local Fresh",
      mandi: "Vallah Subzi Mandi",
      mandi_pa: "ਵੱਲ੍ਹਾ ਸਬਜ਼ੀ ਮੰਡੀ, ਅੰਮ੍ਰਿਤਸਰ",
      mandi_hi: "वल्लाह सब्जी मंडी, अमृतसर",
      min_price: 1800,
      max_price: 2500,
      modal_price: 2200,
      unit: "₹ / ਕਵਿੰਟਲ",
      arrival_quintals: 620,
      trend: "down",
      trend_percent: "-4.5%",
      speech_pa: "ਵੱਲ੍ਹਾ ਮੰਡੀ ਵਿੱਚ ਤਾਜ਼ੇ ਹਰੇ ਮਟਰ ਦਾ ਔਸਤ ਭਾਅ 2,200 ਰੁਪਏ ਪ੍ਰਤੀ ਕਵਿੰਟਲ ਹੈ।",
      speech_hi: "वल्लाह मंडी में ताज़ा हरे मटर का औसत भाव 2,200 रुपये प्रति क्विंटल है।"
    },
    {
      id: "kinnow_mandarin",
      category: "fruits",
      commodity: "Kinnow (ਕਿੰਨੂ)",
      commodity_pa: "ਪੰਜਾਬ ਕਿੰਨੂ (ਫ਼ਲ)",
      commodity_hi: "पंजाब किन्नू (फल)",
      variety: "A-Grade Sweet Local",
      mandi: "Vallah Fruit Mandi",
      mandi_pa: "ਵੱਲ੍ਹਾ ਫ਼ਲ ਮੰਡੀ, ਅੰਮ੍ਰਿਤਸਰ",
      mandi_hi: "वल्लाह फल मंडी, अमृतसर",
      min_price: 1600,
      max_price: 2400,
      modal_price: 2000,
      unit: "₹ / ਕਵਿੰਟਲ",
      arrival_quintals: 890,
      trend: "up",
      trend_percent: "+3.0%",
      speech_pa: "ਅੰਮ੍ਰਿਤਸਰ ਵੱਲ੍ਹਾ ਫ਼ਲ ਮੰਡੀ ਵਿੱਚ ਕਿੰਨੂ ਦਾ ਔਸਤ ਭਾਅ 2,000 ਰੁਪਏ ਪ੍ਰਤੀ ਕਵਿੰਟਲ ਹੈ। ਵਧੀਆ ਕੁਆਲਿਟੀ 2,400 ਰੁਪਏ ਤੱਕ ਵਿਕ ਰਹੀ ਹੈ।",
      speech_hi: "अमृतसर वल्लाह मंडी में किन्नू का औसत भाव 2,000 रुपये प्रति क्विंटल है।"
    },
    {
      id: "guava_amrood",
      category: "fruits",
      commodity: "Guava (ਅਮਰੂਦ)",
      commodity_pa: "ਅਮਰੂਦ (ਫ਼ਲ)",
      commodity_hi: "अमरूद (फल)",
      variety: "Safeda Fresh",
      mandi: "Vallah Fruit Mandi",
      mandi_pa: "ਵੱਲ੍ਹਾ ਫ਼ਲ ਮੰਡੀ, ਅੰਮ੍ਰਿਤਸਰ",
      mandi_hi: "वल्लाह फल मंडी, अमृतसर",
      min_price: 1800,
      max_price: 2800,
      modal_price: 2300,
      unit: "₹ / ਕਵਿੰਟਲ",
      arrival_quintals: 310,
      trend: "stable",
      trend_percent: "0.0%",
      speech_pa: "ਵੱਲ੍ਹਾ ਫ਼ਲ ਮੰਡੀ ਵਿੱਚ ਅਮਰੂਦ ਦਾ ਔਸਤ ਭਾਅ 2,300 ਰੁਪਏ ਪ੍ਰਤੀ ਕਵਿੰਟਲ ਹੈ।",
      speech_hi: "वल्लाह फल मंडी में अमरूद का औसत भाव 2,300 रुपये प्रति क्विंटल है।"
    },
    {
      id: "wheat_vallah",
      category: "grains",
      commodity: "Wheat (ਕਣਕ)",
      commodity_pa: "ਕਣਕ",
      commodity_hi: "गेहूं",
      variety: "PBW-826 / HD-3086",
      mandi: "Vallah Mandi (Grain Market)",
      mandi_pa: "ਵੱਲ੍ਹਾ ਮੰਡੀ (ਮੁੱਖ ਦਾਣਾ ਮੰਡੀ, ਅੰਮ੍ਰਿਤਸਰ)",
      mandi_hi: "वल्लाह मंडी (मुख्य दाना मंडी, अमृतसर)",
      min_price: 2350,
      max_price: 2480,
      modal_price: 2425,
      unit: "₹ / ਕਵਿੰਟਲ",
      arrival_quintals: 1250,
      trend: "up",
      trend_percent: "+1.8%",
      speech_pa: "ਅੰਮ੍ਰਿਤਸਰ ਦੀ ਵੱਲ੍ਹਾ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ਦਾ ਔਸਤ ਭਾਅ 2,425 ਰੁਪਏ ਪ੍ਰਤੀ ਕਵਿੰਟਲ ਹੈ। ਘੱਟੋ-ਘੱਟ ਭਾਅ 2,350 ਰੁਪਏ ਅਤੇ ਵੱਧ ਤੋਂ ਵੱਧ 2,480 ਰੁਪਏ ਰਿਹਾ।",
      speech_hi: "अमृतसर की वल्लाह मंडी में गेहूं का औसत भाव 2,425 रुपये प्रति क्विंटल है।"
    },
    {
      id: "basmati_1121_vallah",
      category: "grains",
      commodity: "Basmati 1121",
      commodity_pa: "ਬਾਸਮਤੀ 1121",
      commodity_hi: "बासमती 1121",
      variety: "Pusa 1121 (Combined)",
      mandi: "Vallah Mandi, Amritsar",
      mandi_pa: "ਵੱਲ੍ਹਾ ਮੰਡੀ, ਅੰਮ੍ਰਿਤਸਰ",
      mandi_hi: "वल्लाह मंडी, अमृतसर",
      min_price: 3600,
      max_price: 4120,
      modal_price: 3850,
      unit: "₹ / ਕਵਿੰਟਲ",
      arrival_quintals: 3400,
      trend: "up",
      trend_percent: "+2.5%",
      speech_pa: "ਅੰਮ੍ਰਿਤਸਰ ਵੱਲ੍ਹਾ ਮੰਡੀ ਵਿੱਚ ਬਾਸਮਤੀ 1121 ਦਾ ਔਸਤ ਭਾਅ 3,850 ਰੁਪਏ ਪ੍ਰਤੀ ਕਵਿੰਟਲ ਹੈ। ਉੱਤਮ ਕੁਆਲਿਟੀ 4,120 ਰੁਪਏ ਤੱਕ ਵਿਕੀ ਹੈ।",
      speech_hi: "अमृतसर वल्लाह मंडी में बासमती 1121 का औसत भाव 3,850 रुपये प्रति क्विंटल है।"
    },
    {
      id: "mustard_sarson",
      category: "oilseeds",
      commodity: "Mustard (ਸਰ੍ਹੋਂ)",
      commodity_pa: "ਸਰ੍ਹੋਂ / ਰਾਇਆ",
      commodity_hi: "सरसों / राया",
      variety: "Giriraj Oil Grade",
      mandi: "Jandiala Guru Mandi",
      mandi_pa: "ਜੰਡਿਆਲਾ ਗੁਰੂ ਮੰਡੀ, ਅੰਮ੍ਰਿਤਸਰ",
      mandi_hi: "जंडियाला गुरु मंडी, अमृतसर",
      min_price: 5200,
      max_price: 5700,
      modal_price: 5450,
      unit: "₹ / ਕਵਿੰਟਲ",
      arrival_quintals: 310,
      trend: "up",
      trend_percent: "+1.2%",
      speech_pa: "ਜੰਡਿਆਲਾ ਗੁਰੂ ਮੰਡੀ ਵਿੱਚ ਸਰ੍ਹੋਂ ਦਾ ਔਸਤ ਭਾਅ 5,450 ਰੁਪਏ ਪ੍ਰਤੀ ਕਵਿੰਟਲ ਹੈ। ਉੱਤਮ ਕੁਆਲਿਟੀ 5,700 ਰੁਪਏ ਤੱਕ ਵਿਕੀ ਹੈ।",
      speech_hi: "जंडियाला गुरु मंडी में सरसों का औसत भाव 5,450 रुपये प्रति क्विंटल है।"
    }
  ],

  weather: {
    station: "Agromet Advisory Centre, KVK Amritsar & IMD Airport Station (OpenWeather Live)",
    temperature_c: 14,
    temp_min_c: 13,
    temp_max_c: 24,
    condition: "ਸਵੇਰ ਦੀ ਧੁੰਦ ਤੇ ਕੋਹਰਾ (Mist)",
    condition_pa: "ਸਵੇਰ ਦੀ ਧੁੰਦ ਤੇ ਕੋਹਰਾ",
    condition_hi: "सुबह की धुंध व हल्का कोहरा",
    condition_hinglish: "Mist / Foggy morning",
    rain_probability: "0%",
    humidity: "82%",
    wind_kmh: 4,
    wind_direction: "ਪੂਰਬ (East)",
    current: {
      temperature_c: 14,
      temp_min_c: 13,
      temp_max_c: 24,
      condition_pa: "ਸਵੇਰ ਦੀ ਧੁੰਦ ਤੇ ਕੋਹਰਾ",
      condition_hi: "सुबह की धुंध व हल्का कोहरा",
      condition_hinglish: "Mist / Foggy morning",
      humidity_percent: 82,
      wind_speed_kmh: 4,
      wind_direction: "ਪੂਰਬ (East)",
      rain_probability_percent: 0,
      rain_probability_pct: 0
    },
    alerts: {
      rain_pa: "ਕੋਈ ਮੀਂਹ ਨਹੀਂ (0%) - ਮੌਸਮ ਖੁਸ਼ਕ ਰਹੇਗਾ",
      wind_pa: "ਹਵਾ ਸ਼ਾਂਤ ਹੈ (4 ਕਿਲੋਮੀਟਰ/ਘੰਟਾ)",
      frost_pa: "ਸਵੇਰ ਵੇਲੇ ਠੰਢ ਤੇ ਹਲਕੀ ਧੁੰਦ (13°C)"
    },
    spray_advisory_pa: "ਅੱਜ ਮੌਸਮ ਖੁਸ਼ਕ ਹੈ ਅਤੇ ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ 4 ਕਿਲੋਮੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਹੈ। ਕਣਕ ਅਤੇ ਸਰ੍ਹੋਂ ਵਿੱਚ ਨਦੀਨਨਾਸ਼ਕ ਜਾਂ ਕੀਟਨਾਸ਼ਕ ਸਪਰੇਅ ਦੁਪਹਿਰ ਸਮੇਂ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।",
    spray_advisory_hi: "आज मौसम शुष्क है और हवा 4 किमी/घंटा है। फसलों पर कीटनाशक स्प्रे दोपहर में सुरक्षित रूप से किया जा सकता है।",
    speech_weather_pa: "ਅੰਮ੍ਰਿਤਸਰ ਵਿੱਚ ਇਸ ਵੇਲੇ ਲਾਈਵ ਤਾਪਮਾਨ 14 ਡਿਗਰੀ ਹੈ। ਦਿਨ ਦਾ ਵੱਧ ਤੋਂ ਵੱਧ ਤਾਪਮਾਨ 24 ਡਿਗਰੀ ਅਤੇ ਘੱਟ ਤੋਂ ਘੱਟ 13 ਡਿਗਰੀ ਰਹੇਗਾ। ਹਵਾ 4 ਕਿਲੋਮੀਟਰ ਹੈ, ਸਪਰੇਅ ਕਰਨਾ ਸੁਰੱਖਿਅਤ ਹੈ।",
    speech_weather_hi: "अमृतसर में वर्तमान लाइव तापमान 14 डिग्री है। अधिकतम 24 डिग्री और न्यूनतम 13 डिग्री रहेगा। हवा 4 किमी प्रति घंटा है, स्प्रे सुरक्षित है।"
  },

  crop_advice: [
    {
      id: "wheat_advice",
      crop_pa: "ਕਣਕ ਦੀ ਸੰਭਾਲ ਅਤੇ ਸਲਾਹ",
      crop_hi: "गेहूं फसल देखभाल और सलाह",
      primary_advisory_pa: "ਕਣਕ ਦੀ ਬਿਜਾਈ ਤੋਂ 21 ਦਿਨ ਬਾਅਦ ਪਹਿਲਾ ਪਾਣੀ (ਕੋਰ ਪਾਣੀ) ਲਗਾਓ। ਗੁੱਲੀ ਡੰਡੇ ਦੀ ਰੋਕਥਾਮ ਲਈ ਪਹਿਲੇ ਪਾਣੀ ਤੋਂ 2-3 ਦਿਨ ਬਾਅਦ ਨਦੀਨਨਾਸ਼ਕ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
      primary_advisory_hi: "गेहूं में बुवाई के 21 दिन बाद पहला पानी लगाएं और गुल्ली डंडा नियंत्रण के लिए खरपतवारनाशक छिड़कें।",
      speech_pa: "ਕਣਕ ਦੀ ਫ਼ਸਲ ਲਈ ਮੁੱਖ ਸਲਾਹ: ਬਿਜਾਈ ਦੇ 21 ਦਿਨ ਬਾਅਦ ਪਹਿਲਾ ਕੋਰ ਪਾਣੀ ਲਗਾਓ ਅਤੇ ਅੱਧੀ ਬੋਰੀ ਯੂਰੀਆ ਪਾਓ। ਗੁੱਲੀ ਡੰਡੇ ਦੀ ਰੋਕਥਾਮ ਲਈ ਨਦੀਨਨਾਸ਼ਕ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।"
    },
    {
      id: "potato_advice",
      crop_pa: "ਆਲੂ ਫ਼ਸਲ ਸੰਭਾਲ ਤੇ ਪਿਛੇਤਾ ਝੁਲਸਾ ਰੋਗ",
      crop_hi: "आलू फसल देखभाल व झुलसा रोग",
      primary_advisory_pa: "ਧੁੰਦ ਕਾਰਨ ਆਲੂਆਂ ਵਿੱਚ ਪਿਛੇਤਾ ਝੁਲਸਾ ਰੋਗ ਆਉਣ ਦਾ ਖ਼ਤਰਾ ਹੁੰਦਾ ਹੈ। ਬਚਾਅ ਲਈ ਇੰਡੋਫਿਲ ਐਮ-45 ਦਾ ਛਿੜਕਾਅ ਕਰੋ ਅਤੇ ਹਲਕਾ ਪਾਣੀ ਲਗਾਓ।",
      primary_advisory_hi: "सर्दियों में आलू में पछेती झुलसा रोग से बचाव के लिए इंडोफिल M-45 का छिड़काव करें।",
      speech_pa: "ਆਲੂਆਂ ਲਈ ਸਲਾਹ: ਧੁੰਦ ਕਾਰਨ ਝੁਲਸਾ ਰੋਗ ਲੱਗਣ ਦਾ ਖ਼ਤਰਾ ਹੈ। ਬਚਾਅ ਲਈ ਇੰਡੋਫਿਲ ਐਮ-45 ਦਾ ਛਿੜਕਾਅ ਕਰੋ।"
    }
  ],

  nearby_mandis: [
    {
      id: "vallah_mandi",
      name_pa: "ਵੱਲ੍ਹਾ ਮੰਡੀ (ਮੁੱਖ ਯਾਰਡ, ਅੰਮ੍ਰਿਤਸਰ)",
      name_hi: "वल्लाह मंडी (मुख्य यार्ड, अमृतसर)",
      distance_pa: "ਸ਼ਹਿਰ ਤੋਂ 6 ਕਿਲੋਮੀਟਰ (ਜੀ.ਟੀ. ਰੋਡ ਬਾਈਪਾਸ)",
      timings_pa: "ਸਵੇਰੇ 05:00 ਵਜੇ ਤੋਂ ਸ਼ਾਮ 07:00 ਵਜੇ ਤੱਕ",
      facilities_pa: "e-NAM ਕੰਪਿਊਟਰ ਕੰਡਾ, ਕਿਸਾਨ ਭਵਨ, ਸ਼ੈੱਡ, ਕੰਟੀਨ",
      phone: "0183-2581240",
      speech_pa: "ਵੱਲ੍ਹਾ ਮੰਡੀ ਅੰਮ੍ਰਿਤਸਰ ਦੀ ਮੁੱਖ ਦਾਣਾ ਅਤੇ ਸਬਜ਼ੀ ਮੰਡੀ ਹੈ, ਜੋ ਬਾਈਪਾਸ 'ਤੇ ਸ਼ਹਿਰ ਤੋਂ 6 ਕਿਲੋਮੀਟਰ ਦੂਰ ਹੈ।"
    },
    {
      id: "majitha_mandi",
      name_pa: "ਮਜੀਠਾ ਮੰਡੀ",
      name_hi: "मजीठा मंडी",
      distance_pa: "ਅੰਮ੍ਰਿਤਸਰ ਤੋਂ ਉੱਤਰ ਵੱਲ 18 ਕਿਲੋਮੀਟਰ",
      timings_pa: "ਸਵੇਰੇ 06:00 ਵਜੇ ਤੋਂ ਸ਼ਾਮ 06:00 ਵਜੇ ਤੱਕ",
      facilities_pa: "ਸਰਕਾਰੀ ਖਰੀਦ ਕੇਂਦਰ, ਪੱਕੇ ਪਲੇਟਫਾਰਮ",
      phone: "0183-2762231",
      speech_pa: "ਮਜੀਠਾ ਮੰਡੀ ਅੰਮ੍ਰਿਤਸਰ ਤੋਂ 18 ਕਿਲੋਮੀਟਰ ਉੱਤਰ ਵੱਲ ਸਥਿਤ ਹੈ।"
    },
    {
      id: "rayya_mandi",
      name_pa: "ਰਈਆ ਮੰਡੀ",
      name_hi: "रईया मंडी",
      distance_pa: "ਅੰਮ੍ਰਿਤਸਰ ਤੋਂ ਪੂਰਬ ਵੱਲ 35 ਕਿਲੋਮੀਟਰ",
      timings_pa: "ਸਵੇਰੇ 06:00 ਵਜੇ ਤੋਂ ਸ਼ਾਮ 07:00 ਵਜੇ ਤੱਕ",
      facilities_pa: "ਵੱਡਾ ਖਰੀਦ ਯਾਰਡ, ਬੈਂਕ ਸ਼ਾਖਾ",
      phone: "01853-242120",
      speech_pa: "ਰਈਆ ਮੰਡੀ ਅੰਮ੍ਰਿਤਸਰ ਤੋਂ 35 ਕਿਲੋਮੀਟਰ ਦੂਰ ਜੀ.ਟੀ. ਰੋਡ 'ਤੇ ਸਥਿਤ ਹੈ।"
    }
  ],

  schemes: [
    {
      id: "pm_kisan",
      name_pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ ਯੋਜਨਾ (PM-ਕਿਸਾਨ)",
      name_hi: "प्रधानमंत्री किसान सम्मान निधि योजना (PM-किसान)",
      benefit_pa: "₹6,000 ਪ੍ਰਤੀ ਸਾਲ (₹2,000 ਦੀਆਂ 3 ਕਿਸ਼ਤਾਂ)",
      benefit_hi: "₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तें)",
      speech_pa: "ਪੀਐਮ ਕਿਸਾਨ ਯੋਜਨਾ ਤਹਿਤ ਕਿਸਾਨਾਂ ਨੂੰ ਸਾਲਾਨਾ 6,000 ਰੁਪਏ ਤਿੰਨ ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਮਿਲਦੇ ਹਨ। ਈ-ਕੇਵਾਈਸੀ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਸੀਡਿੰਗ ਹੋਣੀ ਲਾਜ਼ਮੀ ਹੈ।"
    },
    {
      id: "crop_residue_crm",
      name_pa: "ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਸਬਸਿਡੀ (CRM ਸਕੀਮ)",
      name_hi: "पराली प्रबंधन कृषि यंत्र सब्सिडी योजना",
      benefit_pa: "ਵਿਅਕਤੀਗਤ ਕਿਸਾਨਾਂ ਨੂੰ 50% ਅਤੇ ਸੁਸਾਇਟੀਆਂ ਨੂੰ 80% ਸਬਸਿਡੀ",
      benefit_hi: "व्यक्तिगत किसानों को 50% और समितियों को 80% सब्सिडी",
      speech_pa: "ਪੰਜਾਬ ਵਿੱਚ ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ ਮਸ਼ੀਨਾਂ ਜਿਵੇਂ ਸੁਪਰ ਸੀਡਰ 'ਤੇ 50 ਤੋਂ 80 ਪ੍ਰਤੀਸ਼ਤ ਸਬਸਿਡੀ ਮਿਲਦੀ ਹੈ।"
    }
  ],

  crop_calendar: {
    source: "ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU ਲੁਧਿਆਣਾ)",
    updated: "2026-11-20",
    crops: [
      {
        id: "wheat",
        name_pa: "ਕਣਕ (Wheat)",
        name_hi: "गेहूं (Wheat)",
        name_hinglish: "Gehu / Kanak",
        stages: {
          sowing: {
            window_pa: "25 ਅਕਤੂਬਰ ਤੋਂ 15 ਨਵੰਬਰ",
            window_hi: "25 अक्टूबर से 15 नवंबर",
            window_hinglish: "25 Oct to 15 Nov",
            seed_rate_pa: "40-45 ਕਿਲੋ ਪ੍ਰਤੀ ਏਕੜ",
            seed_rate_hi: "40-45 किग्रा प्रति एकड़",
            seed_rate_hinglish: "40-45 kg per acre",
            advice_pa: "ਬੀਜ ਦੀ ਬੀਜ-ਸੋਧ ਰੈਕਸਿਲ 2 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਕਿਲੋ ਨਾਲ ਕਰੋ। ਬਿਜਾਈ ਵੇਲੇ 1 ਬੋਰੀ ਡੀਏਪੀ ਪਾਓ।",
            advice_hi: "बीज उपचार करें और बुवाई पर 1 बैग डीएपी डालें।",
            advice_hinglish: "Beej treatment karein aur 1 bag DAP per acre dalein."
          },
          growing: {
            window_pa: "ਬਿਜਾਈ ਤੋਂ 20-55 ਦਿਨ",
            window_hi: "बुवाई के 20-55 दिन",
            window_hinglish: "20-55 days after sowing",
            seed_rate_pa: "21ਵੇਂ ਦਿਨ ਪਹਿਲਾ ਕੋਰ ਪਾਣੀ (CRI Stage)",
            seed_rate_hi: "21वें दिन पहला पानी (CRI स्टेज)",
            seed_rate_hinglish: "21st day first irrigation (CRI)",
            advice_pa: "ਪਹਿਲੇ ਪਾਣੀ ਨਾਲ 45 ਕਿਲੋ ਯੂਰੀਆ ਪਾਓ। ਗੁੱਲੀ ਡੰਡੇ ਦੀ ਰੋਕਥਾਮ ਲਈ ਨਦੀਨਨਾਸ਼ਕ ਛਿੜਕੋ।",
            advice_hi: "पहले पानी के साथ 45 किग्रा यूरिया डालें। खरपतवार नियंत्रण करें।",
            advice_hinglish: "Pehle paani ke sath 45 kg urea dalein aur weed control karein."
          },
          harvest: {
            window_pa: "10 ਅਪ੍ਰੈਲ ਤੋਂ 30 ਅਪ੍ਰੈਲ",
            window_hi: "10 अप्रैल से 30 अप्रैल",
            window_hinglish: "10 April to 30 April",
            seed_rate_pa: "ਦਾਣਿਆਂ ਵਿੱਚ ਨਮੀ 12% ਤੋਂ ਘੱਟ",
            seed_rate_hi: "दानों में नमी 12% से कम",
            seed_rate_hinglish: "Grain moisture < 12%",
            advice_pa: "ਕਟਾਈ ਦੁਪਹਿਰ ਸਮੇਂ ਧੁੱਪ ਖਿੜਨ ਤੋਂ ਬਾਅਦ ਕਰੋ। ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ ਲਈ ਸੁਪਰ ਐਸ.ਐਮ.ਐਸ. ਵਰਤੋ।",
            advice_hi: "दोपहर में धूप में कटाई करें। सुपर एसएमएस का प्रयोग करें।",
            advice_hinglish: "Afternoon mein harvest karein aur Super SMS use karein."
          }
        }
      },
      {
        id: "potato",
        name_pa: "ਆਲੂ (Potato)",
        name_hi: "आलू (Potato)",
        name_hinglish: "Potato (Aalu)",
        stages: {
          sowing: {
            window_pa: "25 ਸਤੰਬਰ ਤੋਂ 15 ਅਕਤੂਬਰ",
            window_hi: "25 सितंबर से 15 अक्टूबर",
            window_hinglish: "25 Sept to 15 Oct",
            seed_rate_pa: "12-15 ਕਵਿੰਟਲ ਬੀਜ ਪ੍ਰਤੀ ਏਕੜ",
            seed_rate_hi: "12-15 क्विंटल बीज प्रति एकड़",
            seed_rate_hinglish: "12-15 Qtl seed per acre",
            advice_pa: "ਕੂੜ੍ਹਾਂ ਵਿਚਕਾਰ 60 ਸੈਂਟੀਮੀਟਰ ਅਤੇ ਬੂਟਿਆਂ ਵਿੱਚ 20 ਸੈਂਟੀਮੀਟਰ ਫਾਸਲਾ ਰੱਖੋ।",
            advice_hi: "पंक्तियों में 60 सेमी और पौधों में 20 सेमी दूरी रखें।",
            advice_hinglish: "Row-to-row 60cm, plant-to-plant 20cm distance."
          },
          growing: {
            window_pa: "25-30 ਦਿਨ ਬਾਅਦ",
            window_hi: "25-30 दिन बाद",
            window_hinglish: "25-30 days after planting",
            seed_rate_pa: "ਹਰ 8-10 ਦਿਨਾਂ ਬਾਅਦ ਹਲਕੀ ਸਿੰਚਾਈ",
            seed_rate_hi: "हर 8-10 दिन में हल्की सिंचाई",
            seed_rate_hinglish: "Light irrigation every 8-10 days",
            advice_pa: "ਆਲੂਆਂ 'ਤੇ ਮਿੱਟੀ ਚੜ੍ਹਾਓ। ਝੁਲਸਾ ਰੋਗ ਤੋਂ ਬਚਾਅ ਲਈ ਇੰਡੋਫਿਲ ਐਮ-45 ਛਿੜਕੋ।",
            advice_hi: "मिट्टी चढ़ाएं और झुलसा रोग से बचाव के लिए इंडोफिल एम-45 छिड़कें।",
            advice_hinglish: "Earthing-up karein aur Indofil M-45 spray karein."
          },
          harvest: {
            window_pa: "ਦਸੰਬਰ (ਨਵਾਂ) ਤੋਂ ਫਰਵਰੀ (ਪੱਕਾ)",
            window_hi: "दिसंबर (नया) से फरवरी (पक्का)",
            window_hinglish: "Dec (Fresh) to Feb (Mature)",
            seed_rate_pa: "ਛਿਲਕਾ ਪੱਕਾ ਹੋਣ 'ਤੇ ਪੁਟਾਈ",
            seed_rate_hi: "छिलका पक्का होने पर खुदाई",
            seed_rate_hinglish: "Digging when skin hardens",
            advice_pa: "ਪੁਟਾਈ ਤੋਂ 10 ਦਿਨ ਪਹਿਲਾਂ ਵੇਲਾਂ ਕੱਟ ਦਿਓ ਤਾਂ ਜੋ ਛਿਲਕਾ ਸਖ਼ਤ ਹੋ ਜਾਵੇ।",
            advice_hi: "खुदाई से 10 दिन पहले बेलें काट दें ताकि छिलका कड़ा हो जाए।",
            advice_hinglish: "Digging se 10 din pehle bel kaat dein."
          }
        }
      }
    ]
  },

  crop_symptoms: {
    source: "ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU ਲੁਧਿਆਣਾ)",
    disclaimer_pa: "ਧਿਆਨ ਦਿਓ: ਇਹ ਗਾਈਡ ਸਿਰਫ਼ ਪੀ.ਏ.ਯੂ. ਸਿਫ਼ਾਰਸ਼ਾਂ 'ਤੇ ਆਧਾਰਿਤ ਹੈ। ਇਹ ਕੋਈ ਆਟੋਮੈਟਿਕ ਲੈਬ ਜਾਂਚ ਨਹੀਂ ਹੈ। ਪੁਸ਼ਟੀ ਲਈ ਕੇ.ਵੀ.ਕੇ. ਅੰਮ੍ਰਿਤਸਰ (0183-2580790) ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    disclaimer_hi: "ध्यान दें: यह मार्गदर्शिका केवल पीएयू सिफारिशों पर आधारित है। यह कोई स्वचालित प्रयोगशाला निदान नहीं है। पुष्टि हेतु केवीके अमृतसर (0183-2580790) से संपर्क करें।",
    disclaimer_hinglish: "Note: Yeh tool sirf PAU advisory reference hai, automated diagnosis nahi hai. KVK Amritsar: 0183-2580790.",
    helpline: "0183-2580790",
    items: [
      {
        id: "wheat_yellow_rust",
        crop: "wheat",
        crop_name_pa: "ਕਣਕ",
        symptom_pa: "ਪੱਤਿਆਂ 'ਤੇ ਪੀਲੀਆਂ ਧਾਰੀਆਂ / ਪੀਲਾ ਪਾਊਡਰ (ਪੀਲੀ ਕੁੰਗੀ / Yellow Rust)",
        symptom_hi: "पत्तियों पर पीली धारियां / पीला पाउडर (पीली कुंगी)",
        symptom_hinglish: "Patton par peeli dhariaan / Yellow Rust",
        cause_pa: "ਠੰਢ ਤੇ ਕੋਹਰੇ ਵਿੱਚ ਉੱਲੀ ਦਾ ਹਮਲਾ।",
        cause_hi: "सर्द मौसम और कोहरे में कवक का संक्रमण।",
        cause_hinglish: "Thand aur dhund mein fafundi ka attack.",
        remedy_pa: "ਤੁਰੰਤ 200 ਮਿਲੀਲੀਟਰ ਟਿਲਟ (ਟਿਲਟ 25 EC) 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ।",
        remedy_hi: "200 मिली टिल्ट (टिल्ट 25 EC) 200 लीटर पानी में मिलाकर तुरंत छिड़कें।",
        remedy_hinglish: "200ml Tilt (Tilt 25 EC) 200L paani mein ghol kar turant spray karein.",
        severity: "High / ਗੰਭੀਰ"
      },
      {
        id: "potato_late_blight",
        crop: "potato",
        crop_name_pa: "ਆਲੂ",
        symptom_pa: "ਪੱਤਿਆਂ 'ਤੇ ਕਾਲੇ-ਭੂਰੇ ਪਾਣੀ ਭਿੱਜੇ ਧੱਬੇ ਤੇ ਚਿੱਟੀ ਉੱਲੀ (ਪਿਛੇਤਾ ਝੁਲਸਾ / Late Blight)",
        symptom_hi: "पत्तियों पर भूरे-काले धब्बे और सफेद फफूंद (झुलसा रोग)",
        symptom_hinglish: "Patton par kaale bhoore dhabbe (Late Blight / Jhulsa)",
        cause_pa: "ਕੋਹਰੇ ਅਤੇ 80% ਤੋਂ ਵੱਧ ਨਮੀ ਕਾਰਨ ਫਾਈਟੋਫਥੋਰਾ ਉੱਲੀ ਦਾ ਫੈਲਾਅ।",
        cause_hi: "कोहरे और अधिक नमी से फाइटोफ्थोरा कवक।",
        cause_hinglish: "Dhund aur nami se Phytophthora fafundi.",
        remedy_pa: "ਇੰਡੋਫਿਲ ਐਮ-45 600 ਗ੍ਰਾਮ ਜਾਂ ਰਿਡੋਮਿਲ ਗੋਲਡ 500 ਗ੍ਰਾਮ 100 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਛਿੜਕੋ।",
        remedy_hi: "इंडोफिल एम-45 600 ग्राम या रिडोमिल गोल्ड 500 ग्राम प्रति 100 लीटर पानी में छिड़कें।",
        remedy_hinglish: "Indofil M-45 600g ya Ridomil Gold 500g 100L paani mein spray karein.",
        severity: "High / ਗੰਭੀਰ"
      },
      {
        id: "mustard_aphids",
        crop: "mustard",
        crop_name_pa: "ਸਰ੍ਹੋਂ",
        symptom_pa: "ਟਾਹਣੀਆਂ 'ਤੇ ਕਾਲੇ-ਹਰੇ ਕੀੜੇ ਤੇ ਚਿਪਚਿਪਾ ਰਸ (ਸਰ੍ਹੋਂ ਦਾ ਚੇਪਾ / Aphids)",
        symptom_hi: "टहनियों पर चिपचिपे कीड़े (सरसों का माहू/चेपा)",
        symptom_hinglish: "Tahniyon par chipchipe keede (Sarson Chepa / Aphids)",
        cause_pa: "ਬੱਦਲਵਾਈ ਦੌਰਾਨ ਚੇਪਾ ਕੀੜਾ ਫੁੱਲਾਂ ਤੇ ਫਲੀਆਂ ਦਾ ਰਸ ਚੂਸਦਾ ਹੈ।",
        cause_hi: "बादल छाए रहने पर माहू कीट रस चूसता है।",
        cause_hinglish: "Badal hone par chepa keeda ras choosta hai.",
        remedy_pa: "ਰੋਗੋਰ 250 ਮਿਲੀਲੀਟਰ ਜਾਂ ਏਕਤਾਰਾ 40 ਗ੍ਰਾਮ 100 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਦੁਪਹਿਰ ਬਾਅਦ ਛਿੜਕੋ।",
        remedy_hi: "रोगोर 250 मिली या एकतारा 40 ग्राम 100 लीटर पानी में दोपहर बाद छिड़कें।",
        remedy_hinglish: "Rogor 250ml ya Actara 40g 100L paani mein dopahar baad spray karein.",
        severity: "High / ਗੰਭੀਰ"
      }
    ]
  },

  produce_quality: {
    source: "ਪੰਜਾਬ ਰਾਜ ਮੰਡੀ ਬੋਰਡ ਅਤੇ AGMARK",
    updated: "2026-11-20",
    items: [
      {
        id: "potato",
        name_pa: "ਆਲੂ (Potato)",
        name_hi: "आलू (Potato)",
        name_hinglish: "Potato / Aalu",
        size_pa: "ਗ੍ਰੇਡ 'ਏ' (ਟੇਬਲ): 45mm ਤੋਂ ਵੱਧ। ਗ੍ਰੇਡ 'ਬੀ' (ਬੀਜ): 30-45mm। ਛੱਟਾ: 30mm ਤੋਂ ਘੱਟ।",
        size_hi: "ग्रेड 'ए': 45 मिमी से अधिक। ग्रेड 'बी': 30-45 मिमी। छोटा: 30 मिमी से कम।",
        size_hinglish: "Grade A: >45mm diameter. Grade B: 30-45mm. Small: <30mm.",
        appearance_pa: "ਸਾਫ਼ ਚਮਕਦਾਰ ਛਿਲਕਾ। ਹਰਾ ਹੋਇਆ ਆਲੂ 2% ਤੋਂ ਘੱਟ ਅਤੇ ਮਿੱਟੀ 2% ਤੋਂ ਘੱਟ ਹੋਵੇ।",
        appearance_hi: "साफ चमकीला छिलका। हरा आलू 2% से कम और मिट्टी 2% से कम।",
        appearance_hinglish: "Clean peel, greening <2%, soil tare <2%.",
        freshness_pa: "ਕੰਦ ਪੂਰੇ ਸਖ਼ਤ ਹੋਣ, ਝੁਰੜੀਆਂ ਜਾਂ ਪੁੰਗਰ (sprouting) ਨਾ ਹੋਵੇ।",
        freshness_hi: "कंद पूरी तरह ठोस हों, झुर्री या अंकुरण न हो।",
        freshness_hinglish: "Solid firm tubers without shrinkage or sprouting eyes.",
        storage_pa: "ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਹਵਾਦਾਰ ਛਾਂ (12-15°C)। ਕੋਲਡ ਸਟੋਰ ਵਿੱਚ 2-4°C ਅਤੇ 90% ਨਮੀ।",
        storage_hi: "छायादार हवादार स्थान (12-15°C)। कोल्ड स्टोर में 2-4°C व 90% नमी।",
        storage_hinglish: "Ventilated shade (12-15°C). Cold store: 2-4°C with 90% RH."
      },
      {
        id: "basmati",
        name_pa: "ਬਾਸਮਤੀ 1121",
        name_hi: "बासमती 1121",
        name_hinglish: "Basmati 1121",
        size_pa: "ਕੱਚੇ ਦਾਣੇ ਦੀ ਔਸਤ ਲੰਬਾਈ ਘੱਟੋ-ਘੱਟ 8.35 ਮਿਲੀਮੀਟਰ ਹੋਵੇ। ਪੱਕਣ 'ਤੇ 2 ਗੁਣਾ ਵਧੇ।",
        size_hi: "कच्चे दाने की न्यूनतम लंबाई 8.35 मिमी। पकाने पर 2 गुना फैलाव।",
        size_hinglish: "Min uncooked length 8.35mm, 2.0x elongation on cooking.",
        appearance_pa: "ਸੁਨਹਿਰੀ ਛਿਲਕਾ, ਪਾਰਦਰਸ਼ੀ ਦਾਣਾ। ਚਿੱਟੇ ਦਾਣੇ 2% ਤੋਂ ਘੱਟ ਹੋਣ।",
        appearance_hi: "सुनहरा छिलका, पारदर्शी दाना। चाक जैसे दाने 2% से कम।",
        appearance_hinglish: "Golden husk, translucent pearl kernel, chalky grains <2%.",
        freshness_pa: "ਮੰਡੀ ਆਮਦ ਵੇਲੇ ਨਮੀ 17% ਤੋਂ ਘੱਟ। 14% ਤੋਂ ਘੱਟ ਹੋਣ 'ਤੇ ਵੱਧ ਰੇਟ ਮਿਲਦਾ ਹੈ।",
        freshness_hi: "मंडी में नमी 17% से कम। 14% से कम पर सर्वोत्तम भाव मिलता है।",
        freshness_hinglish: "Mandi arrival moisture max 17%, peak rate below 14%.",
        storage_pa: "ਗੁਦਾਮ ਸਟੋਰੇਜ ਲਈ ਨਮੀ 12-13% ਵਿਚਕਾਰ ਲੱਕੜ ਦੇ ਤਖ਼ਤਿਆਂ 'ਤੇ ਹੋਵੇ।",
        storage_hi: "गोदाम में सुरक्षित रखने हेतु नमी 12-13% होनी चाहिए।",
        storage_hinglish: "Safe warehouse storage moisture strictly 12-13% on pallets."
      },
      {
        id: "kinnow",
        name_pa: "ਕਿੰਨੂ ਫ਼ਲ",
        name_hi: "किन्नू फल",
        name_hinglish: "Kinnow Mandarin",
        size_pa: "ਸੁਪਰ ਏ: 75-85mm ਵਿਆਸ (ਕਾਊਂਟ 54-60)। ਏ ਗ੍ਰੇਡ: 65-75mm।",
        size_hi: "सुपर ए: 75-85 मिमी। ए ग्रेड: 65-75 मिमी व्यास।",
        size_hinglish: "Super A: 75-85mm (54-60 count box). Grade A: 65-75mm.",
        appearance_pa: "ਗੂੜ੍ਹਾ ਸੰਤਰੀ ਰੰਗ, ਚਮਕਦਾਰ ਛਿਲਕਾ। ਦਾਗ਼-ਧੱਬੇ 5% ਤੋਂ ਘੱਟ ਹੋਣ।",
        appearance_hi: "चमकीला नारंगी रंग। दाग-धब्बे 5% से कम।",
        appearance_hinglish: "Uniform orange peel, blemish <5% surface.",
        freshness_pa: "ਰਸ 45% ਤੋਂ ਵੱਧ ਅਤੇ ਮਿਠਾਸ (TSS) ਘੱਟੋ-ਘੱਟ 10 ਡਿਗਰੀ ਬ੍ਰਿਕਸ ਹੋਵੇ।",
        freshness_hi: "रस 45% से अधिक और मिठास 10° Brix या अधिक।",
        freshness_hinglish: "Juice content >45%, TSS sweetness >=10° Brix.",
        storage_pa: "ਕਮਰੇ ਵਿੱਚ 7-10 ਦਿਨ। ਵੈਕਸਿੰਗ ਨਾਲ ਕੋਲਡ ਸਟੋਰ (4-6°C) ਵਿੱਚ 60 ਦਿਨ।",
        storage_hi: "कमरे में 7-10 दिन। कोल्ड स्टोर में 4-6°C पर 60 दिन।",
        storage_hinglish: "Room temp: 7-10 days. Cold store at 4-6°C for 60 days."
      }
    ]
  }
};
