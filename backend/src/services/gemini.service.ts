import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isFurniture: { type: Type.BOOLEAN, description: 'true si es un mueble' },
    category: {
      type: Type.STRING,
      description: 'silla|mesa|sofa|cama|ropero|estante|escritorio|television|organizador|zapatero|otro',
    },
    enhancedPrompt: {
      type: Type.STRING,
      description: 'Prompt en inglés optimizado para generación 3D (máx 15 palabras)',
    },
  },
  required: ['isFurniture', 'category', 'enhancedPrompt'],
};

export interface GeminiResult {
  isFurniture: boolean;
  category: string;
  enhancedPrompt: string;
}

// Fallback local por si todos los modelos fallan
const FALLBACK_KEYWORDS: Record<string, string[]> = {
  silla: ['silla', 'sillon', 'sillón', 'asiento', 'banco', 'butaca'],
  mesa: ['mesa', 'mesita', 'mesa de comedor', 'mesa de centro'],
  sofa: ['sofa', 'sofá', 'couch', 'sillon de sala'],
  cama: ['cama', 'litera', 'cama matrimonial'],
  ropero: ['ropero', 'armario', 'closet', 'clóset'],
  estante: ['estante', 'librero', 'repisa', 'estanteria', 'estantería'],
  escritorio: ['escritorio', 'buro', 'buró', 'mesa de oficina'],
  television: ['mueble para televisor', 'mueble de tv', 'soporte de tv'],
  organizador: ['organizador', 'cajonera', 'gavetero', 'comoda'],
  zapatero: ['zapatero', 'mueble de zapatos'],
};

const NON_FURNITURE = [
  'carro', 'coche', 'auto', 'moto', 'bicicleta', 'avion', 'barco',
  'pizza', 'comida', 'hamburguesa', 'taco',
  'gato', 'perro', 'mascota',
  'computadora', 'celular', 'telefono', 'laptop', 'tablet',
  'libro', 'pelota', 'juguete', 'ropa', 'zapatos',
  'persona', 'hombre', 'mujer', 'niño',
];

function normalize(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function fallbackClassify(userPrompt: string): GeminiResult {
  const text = normalize(userPrompt);

  for (const bad of NON_FURNITURE) {
    if (text.includes(normalize(bad))) {
      return { isFurniture: false, category: 'otro', enhancedPrompt: userPrompt };
    }
  }

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

  return {
    isFurniture: true,
    category: bestCategory,
    enhancedPrompt: `a 3D model of a ${bestCategory}`,
  };
}

export async function enhancePromptWithGemini(
  userPrompt: string
): Promise<GeminiResult> {
  const systemInstruction = `Eres un experto en prompts para generación de modelos 3D.
Analiza el texto del usuario.
REGLAS:
1. Si NO es un mueble, isFurniture: false.
2. Si SÍ es un mueble, clasifícalo.
3. enhancedPrompt en INGLÉS, máx 15 palabras, empieza con "a 3D model of a".
4. NO uses PBR, render, textures ni adjetivos abstractos.
Responde SOLO con el JSON.`;

  // Cascada: si uno falla, pasa al siguiente
  const GEMINI_MODELS = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
  ];

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[Gemini] Probando: ${modelName}`);

      const response = await ai.models.generateContent({
        model: modelName,
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

      if (!text) throw new Error('Respuesta vacía');

      const result: GeminiResult = JSON.parse(text);
      console.log(`[Gemini] ✅ ${modelName} respondió`);
      console.log('[Gemini] Enhanced:', result.enhancedPrompt);
      return result;
    } catch (err: any) {
      const msg = String(err?.message || '');
      console.warn(`[Gemini] ${modelName} falló:`, msg.slice(0, 80));
      continue;
    }
  }

  console.warn('[Gemini] ❌ Todos fallaron. Usando fallback local.');
  return fallbackClassify(userPrompt);
}