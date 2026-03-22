import requests

url = 'http://localhost:8000/crawl'
headers = {
    'sec-ch-ua-platform': '"Windows"',
    'Referer': 'http://localhost:5173/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
}
data = {
    'url': 'https://fastapi.tiangolo.com/', 
    'max_depth': 1
}

print("Sending request...")
response = requests.post(url, json=data, headers=headers)
print("Status:", response.status_code)
try:
    print("Response JSON:", response.json())
except Exception as e:
    print("Response text:", response.text)
