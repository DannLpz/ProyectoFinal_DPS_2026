import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isFurniture: {
      type: Type.BOOLEAN,
      description: 'True si la descripción del usuario corresponde a un mueble.',
    },
    category: {
      type: Type.STRING,
      description:
        'Categoría del mueble: silla, mesa, sofa, cama, ropero, estante, escritorio, television, organizador, zapatero u otro.',
    },
    enhancedPrompt: {
      type: Type.STRING,
      description:
        'Prompt en inglés, técnico y detallado, optimizado para generar un modelo 3D con IA.',
    },
  },
  required: ['isFurniture', 'category', 'enhancedPrompt'],
};

export interface GeminiResult {
  isFurniture: boolean;
  category: string;
  enhancedPrompt: string;
}

// ─────────────────────────────────────────────────────────
// Fallback local: si Gemini falla (429, 503, sin cuota),
// usamos un clasificador por keywords.
// ─────────────────────────────────────────────────────────
const FALLBACK_KEYWORDS: Record<string, string[]> = {
  silla: ['silla', 'sillon', 'sillón', 'asiento', 'banco', 'butaca'],
  mesa: ['mesa', 'mesita', 'mesa de comedor', 'mesa de centro', 'mesa de noche'],
  sofa: ['sofa', 'sofá', 'couch', 'sillon de sala'],
  cama: ['cama', 'litera', 'cama matrimonial', 'cama individual'],
  ropero: ['ropero', 'armario', 'closet', 'clóset', 'guardarropa'],
  estante: ['estante', 'librero', 'repisa', 'estanteria', 'estantería'],
  escritorio: ['escritorio', 'buro', 'buró', 'mesa de oficina'],
  television: ['mueble para televisor', 'mueble de tv', 'soporte de tv', 'rack de tv'],
  organizador: ['organizador', 'cajonera', 'gavetero', 'comoda', 'cómoda'],
  zapatero: ['zapatero', 'mueble de zapatos'],
};

const NON_FURNITURE: string[] = [
  'carro', 'coche', 'auto', 'moto', 'bicicleta', 'avion', 'barco', 'tren',
  'pizza', 'comida', 'hamburguesa', 'taco', 'sushi',
  'gato', 'perro', 'mascota', 'pajaro', 'pez',
  'computadora', 'celular', 'telefono', 'laptop', 'tablet',
  'libro', 'pelota', 'juguete', 'ropa', 'zapatos', 'camisa',
  'persona', 'hombre', 'mujer', 'niño',
];

function normalize(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function fallbackClassify(userPrompt: string): GeminiResult {
  const text = normalize(userPrompt);

  // 1. ¿Es algo prohibido?
  for (const bad of NON_FURNITURE) {
    if (text.includes(normalize(bad))) {
      return { isFurniture: false, category: 'otro', enhancedPrompt: userPrompt };
    }
  }

  // 2. ¿Es un mueble?
  let bestCategory = 'otro';
  let bestScore = 0;
  for (const [cat, keywords] of Object.entries(FALLBACK_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(normalize(kw))) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  if (bestScore === 0) {
    return { isFurniture: false, category: 'otro', enhancedPrompt: userPrompt };
  }

  // Prompt básico en inglés para Forge
  const enhancedPrompt = `a 3D model of a ${bestCategory}, low poly, clean geometry, white background`;

  return {
    isFurniture: true,
    category: bestCategory,
    enhancedPrompt,
  };
}

// ─────────────────────────────────────────────────────────
// Función principal con reintentos y fallback
// ─────────────────────────────────────────────────────────
export async function enhancePromptWithGemini(
  userPrompt: string
): Promise<GeminiResult> {
  const systemInstruction = `Eres un experto en diseño de prompts para generación de modelos 3D.
Analiza el texto del usuario. Si NO describe un mueble, responde isFurniture: false.
Si SÍ es un mueble, clasifícalo en una de las categorías y genera un prompt en INGLÉS, técnico y detallado, optimizado para un generador de mallas como TRELLIS.
Responde únicamente con el JSON especificado.`;

  const MAX_RETRIES = 2;
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

      if (!text) throw new Error('Respuesta vacía de Gemini');

      const result: GeminiResult = JSON.parse(text);

      console.log('[Gemini] ✅ Original:', userPrompt);
      console.log('[Gemini] ✅ Enhanced:', result.enhancedPrompt);

      return result;
    } catch (err: any) {
      lastError = err;

      const msg = String(err?.message || '');
      const is429 = msg.includes('429') || msg.includes('quota');
      const is503 = msg.includes('503') || msg.includes('high demand');

      if (is429) {
        console.warn('[Gemini] ⚠️ Cuota agotada. Usando fallback local...');
        return fallbackClassify(userPrompt);   // 👈 Fallback inmediato
      }

      if (is503 && attempt < MAX_RETRIES) {
        console.log('[Gemini] 503. Reintentando en 2s...');
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      throw err;
    }
  }

  console.warn('[Gemini] ❌ Todos los intentos fallaron. Usando fallback local...');
  return fallbackClassify(userPrompt);
}