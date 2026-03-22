# ThinkAI Crawler

An AI-powered website crawler that crawls any URL, chunks the content, generates semantic embeddings, and lets you chat with the site using Gemini 2.0.

## Architecture

```
URL → SimpleCrawler → MongoDB (crawled_data)
              ↓
      HuggingFace Embeddings
              ↓
      MongoDB (site_chunks)
              ↓
   Cosine Similarity Search
              ↓
        Gemini 2.0 Flash
              ↓
        Chat Response
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB (local: `mongodb://localhost:27017`) **or** MongoDB Atlas (free tier)
- A HuggingFace account with an API token
- A Google AI Studio API key (Gemini)

---

## Setup & Running

### 1. Clone & set up the backend

```bash
cd Chatbot_website_crawler

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate          # Windows
# source venv/bin/activate       # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure environment variables

Copy the template and fill in your keys:

```bash
# Create .env in the project root
```

**.env contents:**
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=thinkai_crawler

GEMINI_API_KEY=your_google_ai_studio_key_here
HF_TOKEN=your_huggingface_token_here

# Optional: restrict CORS in production (comma-separated)
# ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### 3. Initialize MongoDB indexes

Run once before first start (creates indexes for fast queries):

```bash
python init_mongo.py
```

Expected output:
```
✅ MongoDB indexes created successfully.
   Database: thinkai_crawler
   Collections: crawl_sessions, crawled_data, site_chunks
```

### 4. Start the backend

```bash
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` to see the interactive API documentation.

---

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/crawl` | Crawl a website and generate embeddings |
| `POST` | `/chat` | Chat with a previously crawled session |

### POST /crawl
```json
{
  "url": "https://example.com",
  "max_depth": 2
}
```
Returns: `{ "crawl_session_id": "...", "crawled_urls_count": 10 }`

### POST /chat
```json
{
  "session_id": "mongodb-object-id-string",
  "prompt": "What is this website about?"
}
```
Returns: `{ "answer": "..." }`

---

## Docker (Backend only)

```bash
docker build -t thinkai-crawler .
docker run -p 8000:8000 --env-file .env thinkai-crawler
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | FastAPI, Python 3.12 |
| Database | MongoDB (motor async driver) |
| Embeddings | HuggingFace sentence-transformers/all-mpnet-base-v2 |
| AI Chat | Google Gemini 2.0 Flash |
| Crawling | BeautifulSoup4, requests |
