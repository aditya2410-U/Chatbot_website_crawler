import requests
from dotenv import load_dotenv
import os

def call_gemini_api(context, prompt):
    # Reload env vars so new keys are picked up without manually restarting uvicorn
    load_dotenv(override=True)
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}
    data = {
        "contents": [
            {"role": "user", "parts": [{"text": f"Context: {context}\n\nQuestion: {prompt}"}]}
        ]
    }
    
    response = requests.post(url, headers=headers, params=params, json=data)
    
    if response.status_code == 429:
        return "🤖 **[Dummy Response]**\n\nYour Gemini API Key has hit its rate limit or quota (Error 429), or is invalid. I am providing this dummy response so you can test the UI!\n\nPlease replace the `GEMINI_API_KEY` in your `.env` file with a fresh one from [Google AI Studio](https://aistudio.google.com/app/apikey) to get real answers."
        
    response.raise_for_status()
    return response.json()["candidates"][0]["content"]["parts"][0]["text"]