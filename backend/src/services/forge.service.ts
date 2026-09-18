import { forge } from '@three-ws/forge';
import { enhancePromptWithGemini } from './gemini.service';

const FORGE_TIER = (process.env.FORGE_TIER as 'draft' | 'standard' | 'high') || 'standard';

// Nombres amigables por categoría
const CATEGORY_NAMES: Record<string, string> = {
  silla: 'Silla',
  mesa: 'Mesa',
  sofa: 'Sofá',
  cama: 'Cama',
  ropero: 'Ropero',
  estante: 'Estante',
  escritorio: 'Escritorio',
  television: 'Mueble de TV',
  organizador: 'Organizador',
  zapatero: 'Zapatero',
};

export interface Generated3DModel {
  glbUrl: string;
  viewerUrl?: string;
  tier: string;
  elapsedSeconds: number;
  promptUsed: string;
  category: string;
  categoryName: string;
}

/**
 * Pipeline completo de IA:
 *  1. Gemini clasifica (¿es mueble?) y genera un prompt optimizado en inglés.
 *  2. Forge genera el modelo 3D desde el prompt mejorado.
 */
export async function generate3DModelFromText(
  userPrompt: string
): Promise<Generated3DModel | null> {
  const startTime = Date.now();

  // ─────────────────────────────────────────
  // 1. Gemini: clasificación + prompt enhancement
  // ─────────────────────────────────────────
  console.log('[AI] Consultando a Gemini...');
  const geminiResult = await enhancePromptWithGemini(userPrompt);

  // Si no es un mueble, lanzamos error para que el controlador lo capture
  if (!geminiResult.isFurniture) {
    throw new Error(
      'Esa descripción no parece ser un mueble. Intenta describir algo como: silla, mesa, sofá, cama, ropero, estante, escritorio, etc.'
    );
  }

  // ─────────────────────────────────────────
  // 2. Forge: generación del modelo 3D
  // ─────────────────────────────────────────
  try {
    console.log(`[Forge] tier=${FORGE_TIER}`);
    console.log(`[Forge] prompt="${geminiResult.enhancedPrompt}"`);

    const model = await forge(geminiResult.enhancedPrompt, { tier: FORGE_TIER });

    const elapsed = (Date.now() - startTime) / 1000;

    if (!model?.glbUrl) {
      console.warn('[Forge] Sin glbUrl en la respuesta');
      return null;
    }

    console.log(`[Forge] ✅ Generado en ${elapsed.toFixed(1)}s`);

    return {
      glbUrl: model.glbUrl,
      viewerUrl: model.viewerUrl ?? undefined,
      tier: FORGE_TIER,
      elapsedSeconds: elapsed,
      promptUsed: geminiResult.enhancedPrompt,
      category: geminiResult.category,
      categoryName: CATEGORY_NAMES[geminiResult.category] || 'Mueble',
    };
  } catch (err: any) {
    console.error(`[Forge] Error: ${err?.message || err}`);
    return null;
  }
}