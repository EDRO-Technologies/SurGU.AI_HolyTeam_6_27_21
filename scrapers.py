from pprint import pprint
from urllib.parse import quote_plus

import httpx

client = httpx.Client()  # В идеале потом использовать одного клиента на всё приложение


def search(query: str) -> dict:
    response = client.get(
        f"http://localhost:8888/search?q={quote_plus(query)}&format=json"
    )
    return response.json()


def scrape(url: str) -> dict:
    response = client.get(f"http://localhost:3000/api/article?url={quote_plus(url)}")
    return response.json()


if __name__ == "__main__":
    pprint(search("Hello world"))
    pprint(scrape("https://example.com/"))
