export interface CardData {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface BusinessCard extends CardData {
  id: string;
  imageUrl: string;
}

export enum View {
  UPLOAD = "upload",
  PROCESSING = "processing",
  REVIEW = "review",
  LIBRARY = "library",
}
