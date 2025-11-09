from fastapi import FastAPI, Request
from pydantic import BaseModel

from llm import get_data_from_card

app = FastAPI(prefix="/api", docs_url="/")


class BusinessCardImages(BaseModel):
    images: list[str]


@app.post("/recognize")
def process_business_card(cards: BusinessCardImages):
    results = []
    for image in cards.images:
        result = get_data_from_card(image)
        if result is None:
            continue
        result["phone"] = (
            None if "phone" not in result or not result["phone"] else result["phone"][0]
        )
        result["email"] = (
            None
            if "email" not in result or not result["email"]
            else (
                result["email"][0] if type(result["email"]) is list else result["email"]
            )
        )
        result["website"] = (
            None if "links" not in result or not result["links"] else result["links"][0]
        )
        results.append(result)
    return {"cards": results}
