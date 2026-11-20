"""
speech_processor.py - Handles Punjabi & Hindi speech noise, phonetic normalization,
filler word stripping, and intent & entity extraction for Kisan Vaani.
"""

import json
import os
import re
from typing import Dict, Any, Tuple, Optional, List

class SpeechProcessor:
    def __init__(self, dict_path: Optional[str] = None):
        if dict_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            dict_path = os.path.join(base_dir, "data", "punjabi_dictionary.json")
        
        with open(dict_path, "r", encoding="utf-8") as f:
            self.dict_data = json.load(f)
            
        self.fillers = self.dict_data.get("fillers", [])
        self.intent_keywords = self.dict_data.get("intent_keywords", {})
        self.commodity_synonyms = self.dict_data.get("commodity_synonyms", {})
        self.mandi_synonyms = self.dict_data.get("mandi_synonyms", {})

    def clean_text(self, text: str) -> str:
        """Strip punctuation, excessive whitespace, and lower-case Latin characters."""
        if not text:
            return ""
        cleaned = re.sub(r'[^\w\s\u0A00-\u0A7F\u0900-\u097F]', ' ', text)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip().lower()
        return cleaned

    def remove_fillers(self, text: str) -> str:
        """Remove polite and conversational Punjabi/Hindi filler phrases."""
        cleaned = self.clean_text(text)
        for filler in self.fillers:
            filler_clean = self.clean_text(filler)
            if filler_clean:
                pattern = r'(?i)\b' + re.escape(filler_clean) + r'\b'
                cleaned = re.sub(pattern, ' ', cleaned)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned

    def detect_intent(self, text: str) -> Tuple[str, float]:
        """
        Determines the intent from normalized speech.
        Returns: (intent_name, confidence)
        """
        cleaned = self.clean_text(text)
        if not cleaned:
            return ("empty", 0.0)

        # 1. Weather Alert intent
        for kw in self.intent_keywords.get("weather_alert", []):
            if kw.lower() in cleaned:
                return ("weather_alert", 0.96)

        # 2. Crop Symptom intent
        for kw in self.intent_keywords.get("crop_symptom", []):
            if kw.lower() in cleaned:
                return ("crop_symptom", 0.95)

        # 3. Produce Quality intent
        for kw in self.intent_keywords.get("produce_quality", []):
            if kw.lower() in cleaned:
                return ("produce_quality", 0.94)

        # 4. Crop Calendar intent
        for kw in self.intent_keywords.get("crop_calendar", []):
            if kw.lower() in cleaned:
                return ("crop_calendar", 0.93)

        # 5. Crop Advice intent
        for kw in self.intent_keywords.get("crop_advice", []):
            if kw.lower() in cleaned:
                return ("crop_advice", 0.94)

        # 3. Nearby Mandis intent
        for kw in self.intent_keywords.get("nearby_mandis", []):
            if kw.lower() in cleaned:
                return ("nearby_mandis", 0.94)

        # 4. Spray Advisory intent
        for kw in self.intent_keywords.get("spray_advisory", []):
            if kw.lower() in cleaned:
                return ("spray_advisory", 0.95)

        # 5. Weather intent
        for kw in self.intent_keywords.get("weather", []):
            if kw.lower() in cleaned:
                return ("weather", 0.92)

        # 6. Scheme intent
        for kw in self.intent_keywords.get("scheme", []):
            if kw.lower() in cleaned:
                return ("scheme", 0.90)

        # 7. Mandi Price intent
        for kw in self.intent_keywords.get("mandi_price", []):
            if kw.lower() in cleaned:
                return ("mandi_price", 0.90)

        # Check if text mentions a commodity directly (e.g. "ਕਣਕ", "ਕਿੰਨੂ", "ਆਲੂ")
        for key, synonyms in self.commodity_synonyms.items():
            for syn in synonyms:
                if syn.lower() in cleaned:
                    return ("mandi_price", 0.88)

        # Check if text mentions a mandi directly (e.g. "ਵੱਲ੍ਹਾ ਮੰਡੀ", "ਰਈਆ")
        for key, synonyms in self.mandi_synonyms.items():
            for syn in synonyms:
                if syn.lower() in cleaned:
                    return ("nearby_mandis", 0.82)

        return ("unknown", 0.20)

    def extract_commodity(self, text: str) -> Optional[str]:
        """Matches commodity from synonyms, handling noise and phonetic variants."""
        cleaned = self.clean_text(text)
        
        if "1121" in cleaned or "ਗਿਆਰਾਂ" in cleaned or "ਯਾਰਾਂ" in cleaned:
            return "basmati_1121"
        if "1509" in cleaned or "ਪੰਦਰਾਂ" in cleaned:
            return "basmati_1509"

        for commodity_key, synonyms in self.commodity_synonyms.items():
            for syn in synonyms:
                if syn.lower() in cleaned:
                    return commodity_key
        return None

    def extract_mandi(self, text: str) -> Optional[str]:
        """Matches Amritsar mandi from text."""
        cleaned = self.clean_text(text)
        for mandi_key, synonyms in self.mandi_synonyms.items():
            for syn in synonyms:
                if syn.lower() in cleaned:
                    return mandi_key
        return None

    def extract_scheme_keyword(self, text: str) -> Optional[str]:
        """Identifies specific government scheme from text."""
        cleaned = self.clean_text(text)
        if any(w in cleaned for w in ["ਪੀਐਮ ਕਿਸਾਨ", "ਸਨਮਾਨ ਨਿਧੀ", "ਕਿਸ਼ਤ", "2000", "6000", "pm kisan", "pmkisan"]):
            return "pm_kisan"
        if any(w in cleaned for w in ["ਪਰਾਲੀ", "ਸੀਡਰ", "ਸੁਪਰ ਸੀਡਰ", "ਹੈਪੀ ਸੀਡਰ", "ਮਸ਼ੀਨਰੀ", "parali", "crm"]):
            return "crop_residue_crm"
        if any(w in cleaned for w in ["ਬੀਮਾ", "ਫਸਲ ਬੀਮਾ", "ਨੁਕਸਾਨ", "bima", "fasal bima", "insurance"]):
            return "pm_fasal_bima"
        if any(w in cleaned for w in ["ਸੋਲਰ", "ਟਿਊਬਵੈੱਲ", "ਪੰਪ", "solar", "tubewell", "kusum"]):
            return "solar_pump_kusum"
        if any(w in cleaned for w in ["ਕਰਜ਼ਾ", "ਲੋਨ", "ਕੇਸੀਸੀ", "ਕ੍ਰੈਡਿਟ ਕਾਰਡ", "kcc", "loan"]):
            return "kcc_credit_card"
        if any(w in cleaned for w in ["ਬੀਜ", "ਬੀਅ", "ਕਣਕ ਦਾ ਬੀਜ", "punseed", "seed"]):
            return "certified_seed_subsidy"
        return None

    def process(self, raw_speech: str) -> Dict[str, Any]:
        """
        End-to-end processing of noisy speech text.
        """
        cleaned = self.clean_text(raw_speech)
        filtered = self.remove_fillers(raw_speech)
        intent, confidence = self.detect_intent(raw_speech)
        commodity = self.extract_commodity(raw_speech)
        mandi = self.extract_mandi(raw_speech)
        scheme_id = self.extract_scheme_keyword(raw_speech)

        return {
            "raw_speech": raw_speech,
            "cleaned_speech": cleaned,
            "noise_filtered": filtered,
            "intent": intent,
            "confidence": confidence,
            "extracted_entities": {
                "commodity": commodity,
                "mandi": mandi,
                "scheme_id": scheme_id
            }
        }
