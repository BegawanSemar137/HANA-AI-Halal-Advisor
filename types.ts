export interface Service {
  id: string;
  title: string; // This will now be a translation key
  icon: React.ReactNode;
}

export interface NewsArticle {
  id: number;
  // Text content will be fetched via translation keys
  imageUrl: string;
  category: string; // This can also be a key
  date: string;
}

export interface Persona {
    id: string;
    name: string; // Translation key
    description: string; // Translation key
    icon: React.ReactNode;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  details: string;
  terms: string;
  expiry: string;
  cta: string;
  videoUrl?: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  producer: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export interface BasketItem extends Product {
  quantity: number;
}