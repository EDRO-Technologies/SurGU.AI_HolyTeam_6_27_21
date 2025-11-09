import { CardData } from "../types";

interface ApiResponse {
  cards: CardData[];
}

export const parseBusinessCardImages = async (
  base64Images: string[],
): Promise<CardData[]> => {
  try {
    const response = await fetch("/api/recognize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: base64Images }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody}`,
      );
    }

    const data: ApiResponse = await response.json();

    if (!data.cards || !Array.isArray(data.cards)) {
      throw new Error("Invalid API response format: 'cards' array not found.");
    }

    return data.cards.map((card) => ({
      name: card.name || "",
      title: card.position || "",
      company: card.company || "",
      phone: card.phone || "",
      email: card.email || "",
      website: card.website || "",
      address: card.address || "",
    }));
  } catch (error) {
    console.error("Error calling recognize API:", error);
    throw new Error(
      "Не удалось извлечь данные из изображений визитных карточек.",
    );
  }
};
