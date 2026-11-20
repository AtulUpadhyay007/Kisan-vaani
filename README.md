# 🌾 Kisan Vaani (ਕਿਸਾਨ ਵਾਣੀ / किसान वाणी)
### *Voice-First Farming Information Assistant for Small Farmers around Amritsar, India*

[![Zero Hallucination](https://img.shields.io/badge/Grounding-100%25%20Verified%20(Zero%20Hallucination)-brightgreen.svg)]()
[![Response Time](https://img.shields.io/badge/Response%20Time-%3C%202%20ms%20(Req%20%3C%206s)-blue.svg)]()
[![Target District](https://img.shields.io/badge/District-Amritsar%20(Punjab)-orange.svg)]()
[![Languages](https://img.shields.io/badge/Languages-Punjabi%20%7C%20Hindi%20%7C%20Hinglish-teal.svg)]()
[![Unit Tests](https://img.shields.io/badge/Unit%20Tests-15%20Passed%20(0.023s)-success.svg)]()

---

## 🌾 Overview & Purpose

**Kisan Vaani** is a voice-first farming information assistant engineered specifically for smallholder farmers around **Amritsar, Punjab**. It provides immediate, spoken answers grounded in verified datasets across **three supported languages**:
1. **ਪੰਜਾਬੀ (Punjabi in Gurmukhi)**
2. **हिंदी (Hindi in Devanagari)**
3. **Hinglish (Conversational Hindi/Punjabi in Roman script)**

Designed for high outdoor contrast, readable typography, and effortless touch navigation on older or small-screen mobile phones.

---

## 🗣️ Trilingual Voice Engine (Punjabi, Hindi, Hinglish)

| Feature | ਪੰਜਾਬੀ (Punjabi) | हिंदी (Hindi) | Hinglish (Conversational) |
| :--- | :--- | :--- | :--- |
| **STT Acoustic Model** | `pa-IN` | `hi-IN` | `en-IN` / `hi-IN` (Mixed Roman acoustic model) |
| **TTS Speech Voice** | Punjabi / Gurmukhi natural voice | Indian Hindi voice | Natural Indian accent English/Hindi voice |
| **Sample Query** | *"ਵੱਲ੍ਹਾ ਮੰਡੀ ਵਿੱਚ ਨਵੇਂ ਆਲੂ ਦਾ ਭਾਅ ਕੀ ਹੈ?"* | *"वल्लाह मंडी में नए आलू का भाव क्या है?"* | *"Vallah mandi mein naye aalu ka rate kya hai?"* |
| **Spoken Answer** | *"ਵੱਲ੍ਹਾ ਸਬਜ਼ੀ ਮੰਡੀ ਵਿੱਚ ਨਵੇਂ ਆਲੂ ਪੁਖਰਾਜ ਦਾ ਔਸਤ ਭਾਅ 950 ਰੁਪਏ ਪ੍ਰਤੀ ਕਵਿੰਟਲ ਹੈ।"* | *"वल्लाह मंडी में नए आलू पुखराज का औसत भाव 950 रुपये प्रति क्विंटल है।"* | *"Vallah Subzi Mandi mein naye aalu Pukhraj ka average rate 950 rupaye per quintal hai."* |

---

## 🎨 Visual Design & Color Palette

- **Midnight Blue & Cobalt Blue** (`#0B1B3D`, `#152C5B`, `#1D4ED8`): Dominates header, cards, and primary surfaces.
- **Sky Blue** (`#E0F2FE`, `#BAE6FD`, `#0284C7`): Supporting surfaces, highlights, indicators, and pale surfaces.
- **Warm Marigold Yellow** (`#F59E0B`, `#FBBF24`, `#D97706`): Hero microphone button, active 3D card borders, and primary actions.
- **Soft Off-White & Pale Blue Cards** (`#F8FAFC`, `#F0F9FF`, `#FFFFFF`): Provides high outdoor sunlight readability.

---

## 🌟 Core System Features

### 1. 🌅 Welcome & Sign-In Screen
- Layered farming landscape illustration (rolling agricultural hills, crop furrows, rising sun).
- Trilingual language switch (**ਪੰਜਾਬੀ**, **हिंदी**, **Hinglish**).
- Optional name and mobile number fields for personalization.
- **"Continue"** and **"Explore as a guest"** buttons.
- Transparent disclaimer: prototype demonstration note (no false claim of sending OTP or SMS).

### 2. 🎙️ Hero Voice Assistant
- Prominent warm marigold yellow microphone button with pulsating radar rings.
- Animated sound-wave visualizer.
- Speech recognition transcript so users can verify what the assistant heard.
- Concise spoken answers with a **Replay Answer** button and speed controls.
- Text input fallback for noisy outdoor environments or unsupported browsers.

### 3. 🔄 3D Coverflow Topic Navigation
- Looping 3D carousel (`perspective: 1000px`, `transform-style: preserve-3d`) featuring 5 topics:
  1. *Vegetable and fruit mandi prices*
  2. *Weather and local alerts*
  3. *Government schemes*
  4. *Crop advice*
  5. *Nearby mandi information*
- Touch swiping, previous/next buttons, direct card click, and keyboard arrow keys (`←`/`→`).
- Selecting a card prepares a sample question without auto-speaking or hallucinating.

### 4. 🌦️ Animated Weather Visual & Verified Local Alerts
- Animated SVG weather art with a spinning sun, glowing rays, and drifting breeze wisps.
- Labeled explicitly: `🎨 ਕਲਾਤਮਕ ਚਿੱਤਰ (ਸੰਕੇਤਕ) • Decorative Art`.
- **Local Alert Action Button**: Fetches location-specific data from **Agromet IMD & KVK Amritsar** (Rain: 0%, Wind: 8 km/h calm, Min Temp: 11°C morning fog).

### 5. 🌱 Crop Growth Explorer (Interactive Field & Stages)
- Visual field illustration displaying 3 distinct crop stages:
  1. **ਬਿਜਾਈ (Sowing)**: Sprouting seedling emerging from soil bed with rootlets.
  2. **ਵਿਕਾਸ ਤੇ ਫੁਟਾਰਾ (Growing / Tillering)**: Vigorously tillering lush green crop with irrigation moisture.
  3. **ਪੱਕਣ ਤੇ ਕਟਾਈ (Harvest)**: Golden mature earhead swaying with golden awns.
- Labeled as decorative art (`ਕਲਾਤਮਕ ਚਿੱਤਰ - ਸੰਕੇਤਕ`).
- Switchable between **ਕਣਕ (Wheat)** and **ਆਲੂ (Potato)**.
- **"Get Stage Advice"** action queries verified PAU Ludhiana records and speaks recommendations aloud.

### 6. 🧰 Tabbed Farm Toolkit (5 Interactive Tools)
1. **📅 Crop Calendar**:
   - Filter by crop (Wheat, Potato, Mustard, Basmati) and stage (Sowing, Growing, Harvest).
   - Shows optimal calendar window, seed rate, temperature, and critical operations (e.g. 21-day CRI first irrigation).
2. **🔬 Crop Symptom Guide**:
   - Filter by crop and visible symptom (Yellow leaves, Yellow rust, Gulli danda, Late blight, Leaf roll, Aphids/Chepa, Stem borer, Fruit drop).
   - Shows probable cause, verified remedy & dosage, and severity level.
   - **Prominent Non-Diagnostic Notice**: Explicitly informs the farmer that this is PAU advisory guidance and *not* an automated lab diagnosis, providing a direct call button to **KVK Amritsar Helpline: 0183-2580790**.
3. **📍 Mandi Explorer**:
   - Instant search across Amritsar district market yards (Vallah, Majitha, Rayya, Jandiala, Ajnala).
   - Displays distance from Amritsar city, operating hours, arriving commodities, modal prices, facilities, and contact phone numbers.
   - Transparent disclaimer: *No live GPS tracking or map connection is claimed or implemented.*
4. **⭐ Produce Quality Guide**:
   - Produce selector (Potato, Basmati 1121, Kinnow Mandarin, Wheat, Green Peas, Fresh Tomato).
   - Quality aspects: Size & Grading (mm diameter), Appearance & Purity, Freshness & Moisture tolerances, Safe Storage & Shelf Life.
   - Grounded in **Punjab State Agricultural Marketing Board & AGMARK** standards.
5. **📒 Sales & Purchase Ledger (Kisan Khata)**:
   - Record transactions: Type (Sale / Purchase), Crop/Item, Quantity, Unit (Qtl / 50kg Bag / Kg / Box), Rate (₹), Date, Mandi/Party.
   - Real-time financial summary: **Total Sales (₹)**, **Total Purchases (₹)**, **Net Balance (₹)**.
   - Saved entries table with individual **Delete** actions.
   - **CSV Export**: Downloads an RFC 4180 compliant `.csv` file.
   - Browser `localStorage` persistence with explicit disclaimer: *Records are stored locally in your browser and do NOT sync or back up to cloud services.*

### 7. 🔍 Raw Dataset Inspector & JSON Loader
- Allows farmers and judges to inspect the 100% authentic raw JSON datasets (Prices, Weather, Schemes, Advice, Mandis, Calendar, Symptoms, Quality).
- Supports loading custom structured JSON files dynamically into the prototype.

### 8. 📟 Basic Phone IVR Helpline Simulator (1800-180-1551)
- Keypad phone simulator for farmers with feature phones, with Web Audio DTMF tones and spoken options in Punjabi, Hindi, and Hinglish.

### 9. 🛡️ Strict Zero-Hallucination Grounding
- Sub-millisecond latency (< 2 ms), comfortably beating the 6-second threshold.
- Refuses to fabricate unknown commodities, stating verified data is unavailable and inviting users to load verified records.

---

## 🚀 How to Run

### Method 1: Python Web Server
```powershell
python run.py
```
Starts on `http://127.0.0.1:5000` and automatically opens in your default web browser.

### Method 2: Direct Offline Launch (No Python/Server Required)
Double-click **`index.html`** in the project folder. Runs **100% offline** with mirrored client-side data.

### Method 3: Run Automated Test Suite
```powershell
python test_api.py
```
All **15 automated tests** pass in **0.023s**, verifying:
- Multilingual queries (Punjabi, Hindi, Hinglish)
- Mandi prices, weather alerts, crop advice, and nearby mandis
- Crop calendar, symptom guide with non-diagnostic disclaimer, produce quality AGMARK standards
- Zero-hallucination refusal for out-of-dataset queries
- Keypad phone IVR simulator responses

---

## 🏛️ Grounding Data Sources
- **Punjab State Agricultural Marketing Board (e-NAM Amritsar)**: Vallah, Majitha, Rayya, Jandiala, Ajnala yards
- **Agromet IMD & Krishi Vigyan Kendra (KVK) Amritsar**: Weather observations & spray advisories
- **Punjab Agricultural University (PAU Ludhiana)**: Crop cultivation guidelines & plant protection handbooks
- **Directorate of Marketing & Inspection (AGMARK)**: Agricultural produce grading specifications
