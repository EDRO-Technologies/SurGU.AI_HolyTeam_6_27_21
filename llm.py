import base64
import json
from pprint import pprint

import httpx
import magic
from openai import OpenAI
from schemaorg.main import Schema

# TODO: сделать свою модель для человека или использовать Schema.org, а то непонятный JSON как-то непонятно


def load_image(path_or_url: str):
    try:
        if path_or_url.startswith("/"):
            with open(path_or_url, "rb") as f:
                content = f.read()
        else:
            content = session.get(path_or_url).read()
        mime = magic.from_buffer(content, mime=True)
        return mime, base64.b64encode(content).decode()
    except OSError:
        try:
            image = base64.b64decode(path_or_url)
            mime = magic.from_buffer(image, mime=True)
            return mime, path_or_url
        except Exception:
            return None, None


client = OpenAI(
    base_url="https://holy-jesus--example-vllm-inference-serve.modal.run/v1",
    api_key="token-d45bbd00-b7ec-443a-ad0f-6e0dda371d75",
)
session = httpx.Client()


def get_data_from_card(image: str):
    mime, image = load_image(image)
    if not mime or not image:
        return None

    response = client.chat.completions.create(
        model="unsloth/gemma-3-12b-it-bnb-4bit",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Тебе будет дана картинка с визиткой. Твоя задача, распознать картинку, и выдать с визитки данные в JSON формате.
Пример:
{"name":"Иванов Иван Иванович","company":"ООО \"Бизнес\"","position":"Исполнительный директор","phone":["+7 (000) 000-00-00"],"address":"109012, г. Москва, Китайгородский проезд, 9 ст7 ","email":["ivan@example.com"],"links":["https://linkedin.com/","https://example.com/"]}
Ты должен взять эти данные с визитки. Если на карточке несколько phone, email или links, то добавь все с визитки.
- В name должно быть Фамилия, Имя и Отчество.
- В company должно быть название компании.
- В position должна быть должность сотрудника.
- В phone должен быть номер телефона, без букв.
- В address должен быть адрес в точности как на визитке.
- В email должен быть почтовый адрес с визитки.
- В links должны отправляться все ссылки с визитной карточки.
Если каких-то полей нету, вставь вместо поля null.
Пиши только сам JSON, и ничего не добавляй.
    """,
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{image}"},
                    },
                ],
            },
        ],
    )

    content = response.choices[0].message.content
    try:
        data: dict = json.loads(
            content.replace("\n", "").replace("```json", "").replace("```", "")
        )
        for key, value in data.copy().items():
            if not value or value == "null":
                data[key] = None
        pprint(data)
        return data
    except Exception:
        return None


def search_and_scrape():
    response = client.chat.completions.create(
        model="unsloth/gemma-3-12b-it-bnb-4bit",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """You have access to functions. If you decide to invoke any of the function(s), you MUST put it in the format of
[func_name1(params_name1=params_value1, params_name2=params_value2...), func_name2(params)]

You SHOULD NOT include any other text in the response if you call a function
[
    {
        "name": "get_product_name_by_PID",
        "description": "Finds the name of a product by its Product ID",
        "parameters": {
            "type": "object",
            "properties": {
                "PID": {
                    "type": "string"
                }
            },
            "required": [
                "PID"
            ]
        }
    }
]""",
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{image}"},
                    },
                ],
            },
        ],
    )


if __name__ == "__main__":
    from pprint import pprint

    pprint(get_data_from_card("/home/user/hell/images/card6.jpg"))
