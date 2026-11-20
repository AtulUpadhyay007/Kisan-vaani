"""test_api.py - Complete Test Suite for Kisan Vaani (Punjabi, Hindi, Hinglish)"""
import unittest
from app import app

class KisanVaaniApiTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_health(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["app"], "Kisan Vaani (ਕਿਸਾਨ ਵਾਣੀ / किसान वाणी)")
        self.assertIn("hinglish", data["languages_supported"])
        self.assertTrue(data["zero_hallucination_guarantee"])
        print("\n[OK] Health check passed with 3-language support (Punjabi, Hindi, Hinglish)")

    def test_punjabi_potato(self):
        response = self.client.post('/api/query', json={
            "query": "ਵੱਲ੍ਹਾ ਮੰਡੀ ਵਿੱਚ ਨਵੇਂ ਆਲੂ ਦਾ ਭਾਅ ਕੀ ਹੈ",
            "lang": "pa"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["is_grounded"])
        self.assertIn("950", data["spoken_answer"])
        print("[OK] Punjabi potato query passed in", data["latency_ms"], "ms")

    def test_hindi_potato(self):
        response = self.client.post('/api/query', json={
            "query": "वल्लाह मंडी में नए आलू का भाव क्या है",
            "lang": "hi"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["is_grounded"])
        self.assertIn("950", data["spoken_answer"])
        print("[OK] Hindi potato query passed in", data["latency_ms"], "ms")

    def test_hinglish_potato(self):
        response = self.client.post('/api/query', json={
            "query": "Vallah mandi mein naye aalu ka rate kya hai",
            "lang": "hinglish"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["is_grounded"])
        self.assertIn("950", data["spoken_answer"])
        print("[OK] Hinglish potato query passed in", data["latency_ms"], "ms")

    def test_hinglish_weather_alert(self):
        response = self.client.post('/api/query', json={
            "query": "Kya Amritsar mein aaj koi barish ya weather alert hai",
            "lang": "hinglish"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["is_grounded"])
        self.assertIn("barish", data["spoken_answer"].lower())
        print("[OK] Hinglish weather alert query passed in", data["latency_ms"], "ms")

    def test_hinglish_crop_advice(self):
        response = self.client.post('/api/query', json={
            "query": "Gehu mein pehla pani kab lagayein",
            "lang": "hinglish"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["is_grounded"])
        self.assertIn("21", data["spoken_answer"])
        print("[OK] Hinglish crop advice query passed in", data["latency_ms"], "ms")

    def test_hinglish_nearby_mandi(self):
        response = self.client.post('/api/query', json={
            "query": "Vallah mandi ki distance aur timings kya hain",
            "lang": "hinglish"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["is_grounded"])
        self.assertIn("6", data["spoken_answer"])
        print("[OK] Hinglish nearby mandi query passed in", data["latency_ms"], "ms")

    def test_hinglish_zero_hallucination_refusal(self):
        response = self.client.post('/api/query', json={
            "query": "Kashmir mein badam ka bhav kya hai",
            "lang": "hinglish"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertFalse(data["is_grounded"])
        self.assertIn("verified", data["spoken_answer"].lower())
        print("[OK] Hinglish zero-hallucination refusal passed: is_grounded = False")

    def test_ivr_hinglish(self):
        response = self.client.post('/api/ivr_digit', json={"digit": "1", "lang": "hinglish"})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("950", data["speech"])
        print("[OK] Hinglish IVR Digit 1 passed")

    def test_crop_calendar_endpoint(self):
        response = self.client.get('/api/crop_calendar')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("crops", data)
        self.assertTrue(len(data["crops"]) >= 2)
        print("[OK] Crop calendar endpoint verified")

    def test_crop_symptoms_endpoint(self):
        response = self.client.get('/api/crop_symptoms')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("symptoms", data)
        self.assertIn("disclaimer_pa", data)
        print("[OK] Crop symptoms endpoint with non-diagnostic disclaimer verified")

    def test_produce_quality_endpoint(self):
        response = self.client.get('/api/produce_quality')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("produce", data)
        self.assertTrue(len(data["produce"]) >= 3)
        print("[OK] Produce quality AGMARK standards endpoint verified")

    def test_query_symptom_grounding(self):
        response = self.client.post('/api/query', json={
            "query": "Aalu mein late blight rog ke lakshan aur ilaj",
            "lang": "hinglish"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["is_grounded"])
        self.assertIn("indofil", data["spoken_answer"].lower())
        self.assertTrue("kvk" in data["spoken_answer"].lower() or "kvk" in str(data.get("details", {})).lower() or "0183" in data["spoken_answer"])
        print("[OK] Crop symptom grounding query passed with non-diagnostic advisory")

    def test_query_produce_quality_grounding(self):
        response = self.client.post('/api/query', json={
            "query": "Potato grading aur size quality standard",
            "lang": "hinglish"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["is_grounded"])
        self.assertIn("45mm", data["spoken_answer"])
        print("[OK] Produce quality grounding query passed with AGMARK standards")

    def test_query_crop_calendar_grounding(self):
        response = self.client.post('/api/query', json={
            "query": "Gehu sowing calendar stage aur beej dar",
            "lang": "hinglish"
        })
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["is_grounded"])
        self.assertTrue(any(w in data["spoken_answer"].lower() for w in ["sowing", "buvai", "bijai", "oct", "beej", "seed", "gehu"]))
        print("[OK] Crop calendar grounding query passed in", data["latency_ms"], "ms")

    def test_mandis_endpoint(self):
        response = self.client.get('/api/mandis')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("prices", data)
        self.assertTrue(len(data["prices"]) >= 5)
        print("[OK] Mandis API workflow endpoint verified")

    def test_weather_endpoint(self):
        response = self.client.get('/api/weather')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("current", data)
        self.assertIn("temperature_c", data["current"])
        print("[OK] Weather API workflow endpoint verified")

    def test_weather_alerts_endpoint(self):
        response = self.client.get('/api/weather_alerts')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("alerts", data)
        print("[OK] Weather alerts API workflow endpoint verified")

    def test_schemes_endpoint(self):
        response = self.client.get('/api/schemes')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("schemes", data)
        print("[OK] Schemes API workflow endpoint verified")

    def test_nearby_mandis_endpoint(self):
        response = self.client.get('/api/nearby_mandis')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("mandis", data)
        print("[OK] Nearby mandis API workflow endpoint verified")

    def test_raw_dataset_endpoint(self):
        response = self.client.get('/api/raw_dataset/prices')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("prices", data)
        print("[OK] Raw dataset transparency API workflow endpoint verified")

if __name__ == '__main__':
    unittest.main()
