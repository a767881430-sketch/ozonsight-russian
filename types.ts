export interface ProductInfo {
  category: string;
  identified_features: string[];
  recommended_visual_style: string; // New field for AI to return its choice
}

export interface SellingPoint {
  ru: string;
  zh: string;
}

export interface MarketUSPs {
  top_3_russian_selling_points: SellingPoint[];
  trending_tags: string[];
  product_description: {
    ru: string;
    zh: string;
  };
}

export interface ImagePrompt {
  title: string;
  purpose: string;
  prompt: string;
}

export interface AnalysisResponse {
  product_info: ProductInfo;
  market_usps: MarketUSPs;
  gemini_image_prompts: ImagePrompt[]; // Standard Product Card (3:4) - Studio
  gemini_lifestyle_prompts: ImagePrompt[]; // New: Scene-based Lifestyle (3:4)
  gemini_rich_content_prompts: ImagePrompt[]; // New: A+ Content Banners (Landscape)
  gemini_video_prompts: ImagePrompt[]; // New: Short Video Prompts (9:16)
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type ImageStyle = 'auto' | 'minimalist' | 'lifestyle' | 'tech' | 'home' | 'luxury' | 'custom';
