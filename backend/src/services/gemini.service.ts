import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Esquema de salida estructurada para asegurar una respuesta JSON válida.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isFurniture: {
      type: Type.BOOLEAN,
      description: "True si la descripción del usuario corresponde a un mueble.",
    },
    category: {
      type: Type.STRING,
      description: "Categoría del mueble: silla, mesa, sofa, cama, ropero, estante, escritorio, television, organizador, zapatero u otro.",
    },
    enhancedPrompt: {
      type: Type.STRING,
      description: "Prompt en inglés, técnico y detallado, optimizado para generar un modelo 3D con IA.",
    },
  },
  required: ["isFurniture", "category", "enhancedPrompt"],
};

export interface GeminiResult {
  isFurniture: boolean;
  category: string;
  enhancedPrompt: string;
}

export async function enhancePromptWithGemini(
  userPrompt: string
): Promise<GeminiResult> {
  const systemInstruction = `Eres un experto en diseño de prompts para generación de modelos 3D.
Analiza el texto del usuario. Si NO describe un mueble, responde isFurniture: false.
Si SÍ es un mueble, clasifícalo en una de las categorías y genera un prompt en INGLÉS, técnico y detallado (estilo "a 3D model of a [material] [type] with [features]"), optimizado para un generador de mallas como TRELLIS.
Responde únicamente con el JSON especificado.`;

  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Gemini] Intento ${attempt}/${MAX_RETRIES}...`);

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Texto del usuario: "${userPrompt}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      const text =
        response.text ??
        (response as any).candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Respuesta vacía de Gemini');
      }

      const result: GeminiResult = JSON.parse(text);

      console.log('[Gemini] Original:', userPrompt);
      console.log('[Gemini] Enhanced:', result.enhancedPrompt);

      return result;
    } catch (err: any) {
      lastError = err;
      const is503 =
        err?.status === 503 ||
        err?.code === 503 ||
        (typeof err?.message === 'string' && err.message.includes('503')) ||
        (typeof err?.message === 'string' && err.message.includes('high demand'));

      if (is503 && attempt < MAX_RETRIES) {
        const waitMs = attempt * 2000; // 2s, 4s
        console.log(`[Gemini] 503 detectado. Reintentando en ${waitMs}ms...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      // Si no es 503 o ya se agotaron los intentos, relanzamos
      throw err;
    }
  }

  throw lastError;
}