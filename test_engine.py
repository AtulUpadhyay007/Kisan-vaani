"""test_engine.py - Test suite for Mandi Grounder"""
import sys
from engine.grounder import MandiGrounder

def run_tests():
    grounder = MandiGrounder()
    tests = [
        "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ ਭਾਈ ਜੀ ਮੈਨੂੰ ਕਣਕ ਦਾ ਭਾਅ ਦੱਸੋ ਵੱਲ੍ਹਾ ਮੰਡੀ ਵਿੱਚ",
        "1121 ਬਾਸਮਤੀ ਦਾ ਕੀ ਰੇਟ ਚੱਲ ਰਿਹਾ",
        "ਅੱਜ ਅੰਮ੍ਰਿਤਸਰ ਵਿੱਚ ਮੀਂਹ ਪਵੇਗਾ ਕਿ ਨਹੀਂ",
        "ਕੀ ਅੱਜ ਦਵਾਈ ਸਪਰੇਅ ਕਰ ਸਕਦੇ ਹਾਂ",
        "ਪੀਐਮ ਕਿਸਾਨ ਵਾਲੇ 2000 ਰੁਪਏ ਕਿਵੇਂ ਮਿਲਣਗੇ",
        "ਸ਼ਿਮਲਾ ਵਿੱਚ ਸੇਬ ਦਾ ਭਾਅ ਕੀ ਹੈ"
    ]
    
    print("================ MANDI SAATHI GROUNDING TESTS ================")
    for q in tests:
        res = grounder.query(q)
        print(f"\n[QUERY]: {q}")
        print(f"-> Intent: {res['intent']} (Confidence: {res['confidence']})")
        print(f"-> Is Grounded: {res['is_grounded']}")
        print(f"-> Latency: {res['latency_ms']} ms (Goal: < 6000 ms)")
        print(f"-> Source: {res['source']}")
        print(f"-> Spoken Answer: {res['spoken_answer']}")
        print("-" * 50)

if __name__ == "__main__":
    run_tests()
