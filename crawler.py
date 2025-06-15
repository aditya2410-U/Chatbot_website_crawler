import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from collections import deque
import time

class SimpleCrawler:
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; SimpleCrawler/1.0; +https://yourdomain.com/bot)"
    }

    def __init__(self, base_url, max_depth=2):
        self.base_url = base_url
        self.domain = urlparse(base_url).netloc
        self.visited = set()
        self.queue = deque([(base_url, 0)])
        self.max_depth = max_depth
        self.data = {}

    def crawl(self):
        while self.queue:
            url, depth = self.queue.popleft()
            if url in self.visited or depth > self.max_depth:
                continue
            print(f"[Depth {depth}] Crawling URL: {url}")
            
            try:
                resp = requests.get(url, headers=self.headers, timeout=5)
                if resp.status_code != 200:
                    print(f"  -> Skipped URL due to status code: {resp.status_code}")
                    continue
                
                soup = BeautifulSoup(resp.text, 'html.parser')
                text = self.extract_text(soup)
                self.data[url] = text
                print(f"  -> Extracted {len(text)} characters of text")
                
                self.visited.add(url)
                links = self.extract_links(soup, url)
                print(f"  -> Found {len(links)} links on this page")
                
                for link in links:
                    if link not in self.visited and urlparse(link).netloc == self.domain:
                        self.queue.append((link, depth + 1))
                
                time.sleep(0.3) 
                
            except requests.exceptions.RequestException as e:
                print(f"Request failed for {url}: {e}")
            except Exception as e:
                print(f"Error crawling {url}: {e}")

    def extract_text(self, soup):
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'img', 'svg', 'video', 'audio']):
            tag.decompose()

        return soup.get_text(separator=' ', strip=True)

    def extract_links(self, soup, base):
        links = set()
        for a in soup.find_all('a', href=True):
            href = urljoin(base, a['href'])
            parsed = urlparse(href)

            if parsed.scheme not in ('http', 'https'):
                continue
            if parsed.netloc != self.domain:
                continue

            if any(href.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.pdf', '.zip', '.exe', '.mp4']):
                continue

            links.add(href.split('#')[0])
        return links
