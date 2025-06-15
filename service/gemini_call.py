import requests
from dotenv import load_dotenv
import os

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def call_gemini_api(context, prompt):
    # Change v1beta to v1
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}
    data = {
        "contents": [
            {"role": "user", "parts": [{"text": f"Context: {context}\n\nQuestion: {prompt}"}]}
        ]
    }
    response = requests.post(url, headers=headers, params=params, json=data)
    response.raise_for_status()
    return response.json()["candidates"][0]["content"]["parts"][0]["text"]