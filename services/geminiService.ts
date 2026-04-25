import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, ImageStyle } from "../types";

const SYSTEM_INSTRUCTION = `
Role: You are a Tier-1 Visual Director for Russian E-commerce (Ozon, Wildberries) with 10+ years of experience in Conversion Rate Optimization (CRO).

Objective: Analyze product images + user context + visual style strategy to generate actionable, high-conversion visual assets. 
Output a JSON with:
1.  **Product Info**: Category, features, and the AI-RECOMMENDED VISUAL STYLE (in Chinese).
2.  **Market USPs**: Localized selling points for Russia (in Russian & Chinese), focusing on practical benefits (warmth, durability, speed) valued by Russian consumers.
3.  **Main Card Prompts (3:4, Total 6)**:
    - 3 Prompts following the "Visual Engineering" template for **Studio/Flat-lay** (Clean background).
    - 3 Prompts following the "Visual Engineering" template for **Lifestyle/In-Use Scenes** (Context-rich, environmental).
4.  **Rich Content Prompts (16:9)**: 4 prompts following the "Brand Storytelling" template.
5.  **Video Prompts (9:16)**: 2 prompts optimized for Ozon Moments/Shorts (video generation).

---
### CRITICAL DESIGN CONSTRAINTS (MANDATORY)
1. **PRODUCT INTEGRITY**: You MUST preserve the exact form, shape, and physical identity of the product provided in the input image. NEVER alter the product shape, or change its core features. Focus ONLY on changing the environment, lighting, and composition around the product.
2. **BACKGROUND FLEXIBILITY**: You MUST ensure the 'Main Card' set is DIVERSE.
   - You MUST also follow the PLATFORM & CONTENT CONSTRAINTS: Focus EXCLUSIVELY on OZON platform requirements. STRICTLY EXCLUDE any Wildberries (WB) related tags, branding, or specific terminology. AVOID any prohibited words.
   - Do NOT default only to white studio backgrounds.
   - Alternate between:
       - Professional Studio / Flat-lay (clean, high-quality, product-focused).
       - Lifestyle / In-Use Scene (product being used in a relevant setting: kitchen, street, gym, living room).
   - Ensure the ratio of Studio : Lifestyle is roughly 1:1.

---
### PROMPT FORMATTING REVOLUTION (CRITICAL)

You must generate prompts in **ENGLISH** following a strict "Visual Engineering" template.
The prompt must describe the visual elements in brackets \`[ ]\` and include specific Russian text instructions for the layout.

**TEMPLATE FOR MAIN CARD (3:4) - "Ozon Infographic Style":**
"1:Format: Vertical 3:4. Subject: [DETAILED_PRODUCT_PLACEMENT]. Background: [SCENE_DESC]. Lighting: [LIGHTING_DESC]. Atmosphere: [ATMOSPHERE_DETAILS]. Russian Infographic Layout: Header: '[RUSSIAN_TITLE]'. Sub-header: '[SUB_HEADER]'. Features: '[USP_1]', '[USP_2]'. Badge: '[PROMO_TEXT]'. Style: [STYLE_DESC]."

**PRIME EXAMPLES (FOLLOW THIS EXACT STRUCTURE PRECISLEY STARTING WITH THE NUMBER INDICATOR):**
1. "1:Format: Vertical 3:4. Subject: All components from the source image neatly arranged in a professional flat-lay. Background: Clean light grey textured surface with soft shadows. Lighting: Even softbox lighting. Atmosphere: Professional and organized. Russian Infographic Layout: Header: 'ПОЛНЫЙ КОМПЛЕКТ 11-в-1'. Sub-header: 'Для идеальной чистоты'. Features: '2 насадки', '3 салфетки', 'Держатель'. Badge: 'ВЫГОДНАЯ ПОКУПКА'. Style: Clean catalog photography, high contrast."
2. "2:Format: Vertical 3:4. Subject: Extreme close-up of the orange 180-degree rotation button and the pivoting head. Background: Blurred window frame. Lighting: Soft studio lighting to highlight plastic texture and mechanical detail. Atmosphere: Technical and reliable. Russian Infographic Layout: Header: 'ЛЮБОЙ УГОЛ'. Sub-header: 'Вращение на 180 градусов'. Features: A curved orange arrow indicating movement. Badge: ''. Style: Sharp focus, macro photography, 8K render."

*(Note: Increment the prepended number for each prompt (e.g. 1:Format, 2:Format, 3:Format...)*

**TEMPLATE FOR RICH CONTENT (16:9) - "Brand Storytelling Banner":**
"**Format: Landscape 16:9.** **Subject**: Product placed naturally in a [WIDE_SCENE_DESC]. **Context**: Show the product *in use* or in its ideal environment. **Lighting**: [LIGHTING_MOOD] creating a [EMOTIONAL_VIBE] (e.g., 'Cozy winter evening', 'Fresh summer morning'). **Composition**: [COMPOSITION_RULE] (e.g., Rule of thirds). **Negative Space**: Leave [NEGATIVE_SPACE_DESC] for text overlay. **Russian Text**: Large, cinematic title '[RUSSIAN_SCENARIO_TITLE]' with elegant typography. **Style**: Magazine editorial quality, depth of field, color graded, storytelling visual."

**TEMPLATE FOR VIDEO (9:16) - "Shorts/Moments Dynamic Video":**
"**Format: Video 9:16.** **Subject**: [PRODUCT_MOVEMENT_DESC]. **Action**: [ACTION_DESC] (e.g., 'Slow motion water splash', '360 degree smooth rotation', 'Model putting on the item'). **Camera**: [CAMERA_MOVE_DESC]. **Environment**: [DYNAMIC_SCENE_DESC] that matches the product vibe. **Russian Text Overlay**: Pop-up text '[RUSSIAN_HOOK_TEXT]' synced with the action in the first 2 seconds. **Style**: High-definition, 60fps, social media viral style, energetic editing."

**FILLING RULES:**
1.  **[Brackets]**: Fill these with rich, descriptive **ENGLISH** adjectives and nouns based on the **Selected Style**.
    *   *Realism check*: Avoid "dreamy" or "abstract" unless the style demands it. Prefer "concrete", "tactile" descriptions (e.g., "rough concrete texture", "soft knitted wool", "sleek matte metal").
2.  **[RUSSIAN_TEXT]**: Insert REAL, CORRECT **Russian** marketing copy relevant to the product features (translate features to Russian).
    *   *Tone*: Direct, benefit-oriented. (e.g., instead of "Great Quality", use "Прочный материал" (Durable material)).
    *   *Keywords*: "ХИТ" (Hit), "СКИДКА" (Discount), "TOP" (Top), "ORIGINAL", "NEW".
3.  **Realism**: Ensure the description enforces photorealism.

### STYLE STRATEGY:
If the user selects "AUTO" style:
1.  First, analyze the product.
2.  Select the **SINGLE BEST** style from the list below.
3.  Fill the \`recommended_visual_style\` field.
4.  Generate all prompts based on that chosen style logic (Scene/Lighting/Colors).

**STYLE GUIDELINES (Reference):**
*   **Minimalist Studio**: "Solid pastel or white background", "hard shadows", "clean lines", "geometric props". Best for: Gadgets, Cosmetics.
*   **Outdoor Lifestyle**: "Natural environment (forest, street, park)", "sunlight/dappled light", "shallow depth of field". Best for: Apparel, Sports.
*   **Cozy Home**: "Interior setting (living room, bedroom)", "warm tungsten light", "soft fabrics", "lived-in feel". Best for: Home goods, Decor.
*   **Tech / Industrial**: "Dark background", "concrete/metal surfaces", "cool blue/purple neon", "high contrast". Best for: Tools, Hardware, Gaming.
*   **Luxury**: "Dark velvet/silk/marble", "golden spotlight", "elegant reflections", "minimal text". Best for: Jewelry, Perfume, High-end fashion.
*   **Custom Style**: Strictly follow user input.

---

Constraints:
- Output valid JSON.
- **Prompts must be in ENGLISH.**
- **Russian text strings inside the prompt must be in Cyrillic.**
- **Title and Purpose fields must be in CHINESE.**
- **NO CARTOON / NO ILLUSTRATION STYLES unless explicitly requested.**
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    product_info: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING, description: "Product category in Chinese" },
        identified_features: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key visual features in Chinese" },
        recommended_visual_style: { type: Type.STRING, description: "The visual style applied to the prompts (e.g., '户外生活风格', '极简科技风格') in Chinese." },
      },
      required: ["category", "identified_features", "recommended_visual_style"],
    },
    market_usps: {
      type: Type.OBJECT,
      properties: {
        top_3_russian_selling_points: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              ru: { type: Type.STRING },
              zh: { type: Type.STRING },
            },
            required: ["ru", "zh"],
          },
        },
        trending_tags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "15-20 popular Russian OZON-specific hashtags for this product. EXCLUDE ANY Wildberries (WB) related tags. STRICTLY AVOID prohibited words as specified in the user context. Must be in Russian."
        },
        product_description: {
          type: Type.OBJECT,
          properties: {
             ru: { type: Type.STRING, description: "A highly optimized Russian product description for Ozon/WB. Engage customers and use trending keywords." },
             zh: { type: Type.STRING, description: "Chinese translation of the description." }
          },
          required: ["ru", "zh"]
        }
      },
      required: ["top_3_russian_selling_points", "trending_tags", "product_description"],
    },
    gemini_image_prompts: {
      type: Type.ARRAY,
      description: "Generate exactly 3 detailed prompts for the Main Product Card (Vertical 3:4) in STUDIO/FLAT-LAY background.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the prompt in Chinese (e.g., '核心主图', '细节展示')" },
          purpose: { type: Type.STRING, description: "Purpose explanation in Chinese" },
          prompt: { type: Type.STRING, description: "Detailed prompt in ENGLISH strictly starting with the number index (e.g. '1:Format: Vertical 3:4. Subject: ...')." },
        },
        required: ["title", "purpose", "prompt"],
      },
    },
    gemini_lifestyle_prompts: {
      type: Type.ARRAY,
      description: "Generate exactly 3 detailed prompts for the Main Product Card (Vertical 3:4) in SCENE-BASED/LIFESTYLE background.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the prompt in Chinese (e.g., '场景主图', '生活化展示')" },
          purpose: { type: Type.STRING, description: "Purpose explanation in Chinese" },
          prompt: { type: Type.STRING, description: "Detailed prompt in ENGLISH strictly starting with the number index (e.g. '1:Format: Vertical 3:4. Subject: ...')." },
        },
        required: ["title", "purpose", "prompt"],
      },
    },
    gemini_rich_content_prompts: {
      type: Type.ARRAY,
      description: "Generate exactly 4 detailed prompts for Ozon Rich Content/A+ Banners (Landscape).",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the prompt in Chinese (e.g., '品牌故事', '使用场景')" },
          purpose: { type: Type.STRING, description: "Purpose explanation in Chinese" },
          prompt: { type: Type.STRING, description: "Detailed prompt in ENGLISH following the 'Brand Storytelling' template." },
        },
        required: ["title", "purpose", "prompt"],
      },
    },
    gemini_video_prompts: {
      type: Type.ARRAY,
      description: "Generate exactly 2 video generation prompts (Vertical 9:16).",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the video prompt in Chinese (e.g., '产品360展示', '防水测试')" },
          purpose: { type: Type.STRING, description: "Purpose/Action explanation in Chinese" },
          prompt: { type: Type.STRING, description: "Detailed prompt in ENGLISH following the 'Video' template." },
        },
        required: ["title", "purpose", "prompt"],
      },
    },
  },
  required: ["product_info", "market_usps", "gemini_image_prompts", "gemini_rich_content_prompts", "gemini_video_prompts"],
};

export const analyzeProductImage = async (
  base64Images: string[], 
  mimeTypes: string[], 
  userContext: string,
  selectedStyle: ImageStyle,
  customStyleDesc?: string
): Promise<AnalysisResponse> => {
  const storedApiKey = localStorage.getItem('ozonsight_gemini_api_key');
  const apiKey = storedApiKey || process.env.GEMINI_API_KEY || import.meta.env?.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("请先在左侧输入并保存您的 Gemini API Key。 (API Key is missing)");
  }

  const ai = new GoogleGenAI({ apiKey });

  const imageParts = base64Images.map((b64, index) => ({
    inlineData: {
      mimeType: mimeTypes[index],
      data: b64,
    },
  }));

  // Construct instruction based on style
  let styleInstruction = "";
  if (selectedStyle === 'auto') {
    styleInstruction = "AUTO_DETECT: Analyze the product aesthetics and category. Select the SINGLE Best visual style for the Russian market (Ozon/WB) and apply it to all prompts. Explain the choice in 'recommended_visual_style'.";
  } else if (selectedStyle === 'custom') {
    styleInstruction = `CUSTOM USER STYLE: "${customStyleDesc || 'Use a style suitable for the product'}". Apply this specific user-defined visual style to all prompts.`;
  } else {
    styleInstruction = `SELECTED VISUAL STYLE: ${selectedStyle.toUpperCase()}. Apply this style strictly.`;
  }

  let promptText = `Analyze these product images for the Russian market (Ozon/Wildberries). 
  
  **STYLE STRATEGY**: ${styleInstruction}
  
  Provide a comprehensive strategy JSON with:
  1. 6x Vertical (3:4) Prompts for Images (3 Studio, 3 Lifestyle).
  2. 4x Horizontal (16:9) Prompts for Rich Content.
  3. 2x Vertical (9:16) Prompts for Videos.
  
  **CRITICAL REQUIREMENT**: The prompts must be realistic and commercially viable for the Russian market. 
  - Ensure Russian text instructions are grammatically correct and marketing-focused (using Ozon/WB keywords).
  - Visuals should be high-quality, avoiding generic AI hallucinations.
  - If the product is seasonal (e.g., winter coat), ensure the background reflects the season (e.g., snow, winter street).
  
  **IMPORTANT**: The 'prompt' content MUST be in **ENGLISH** but follow the strict "Visual Engineering" structure defined in System Instructions.
  The 'title' and 'purpose' must be in **CHINESE**.`;

  if (userContext && userContext.trim().length > 0) {
    promptText += `\n\nCRITICAL USER CONTEXT: "${userContext}"`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: {
        parts: [
          ...imageParts,
          { text: promptText },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension 1024px to keep details but reduce size
        const MAX_DIM = 1024;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Use jpeg with 0.8 quality for good balance
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(",")[1];
        resolve(base64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};