import { prisma } from '../config/prisma';
import { enhancePromptWithGemini } from './gemini.service';
import { generate3DModelWithTripo } from './tripo.service';

// Mapa de fallback local por categoría
const LOCAL_MODELS: Record<string, string> = {
  silla: '/models/silla.glb',
  mesa: '/models/mesa.glb',
  sofa: '/models/sofa.glb',
  cama: '/models/cama.glb',
  ropero: '/models/ropero.glb',
  estante: '/models/estante.glb',
  escritorio: '/models/mesa.glb',
  television: '/models/estante.glb',
  organizador: '/models/estante.glb',
  zapatero: '/models/estante.glb',
};

export async function generateFurnitureFromPrompt(
  prompt: string,
  userId: string
) {
  const globalStart = Date.now();

  // 1. Gemini: clasificar y mejorar prompt (1 sola vez)
  console.log('[AI] Consultando Gemini...');
  const geminiResult = await enhancePromptWithGemini(prompt);

  if (!geminiResult.isFurniture) {
    throw new Error(
      'Esa descripción no parece ser un mueble. Intenta con: silla, mesa, sofá, cama, ropero, estante, escritorio.'
    );
  }

  // 2. Tripo3D: generar modelo (si hay key)
  const tripoKey = process.env.TRIPO_API_KEY || '';
  const hasTripoKey = tripoKey.startsWith('tsk_');

  let result: any = null;

  if (hasTripoKey) {
    try {
      result = await generate3DModelWithTripo(geminiResult, globalStart);
    } catch (tripoErr: any) {
      console.warn('[AI] Tripo falló:', tripoErr?.message);
    }
  } else {
    console.warn('[AI] TRIPO_API_KEY inválida o ausente');
  }

  // 3. Fallback: usar modelo local
  if (!result?.glbUrl) {
    console.warn('[AI] Usando fallback local...');
    const fallbackGlb = LOCAL_MODELS[geminiResult.category] || '/models/silla.glb';

    result = {
      glbUrl: fallbackGlb,
      tier: 'local-fallback',
      elapsedSeconds: Number(((Date.now() - globalStart) / 1000).toFixed(1)),
      promptUsed: geminiResult.enhancedPrompt,
      category: geminiResult.category,
      categoryName:
        geminiResult.category.charAt(0).toUpperCase() + geminiResult.category.slice(1),
      thumbnailUrl: '',
    };
  }

  const totalSeconds = ((Date.now() - globalStart) / 1000).toFixed(1);
  const cleanName =
    prompt.trim().charAt(0).toUpperCase() + prompt.trim().slice(1);

  // 4. Limpieza automática de IA viejos (más de 15 min)
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
  try {
    const deleted = await prisma.furniture.deleteMany({
      where: {
        source: 'ai-generated',
        generatedById: userId,
        createdAt: { lt: fifteenMinAgo },
      },
    });
    if (deleted.count > 0) {
      console.log(`[AI] 🧹 ${deleted.count} modelos viejos eliminados`);
    }
  } catch (err) {
    console.warn('[AI] Error en limpieza:', err);
  }

  // 5. Guardar en BD
  const generated = await prisma.furniture.create({
    data: {
      name: cleanName,
      description: `Diseño generado con IA · ${result.categoryName} · ${totalSeconds}s`,
      category: result.category,
      modelUrl: result.glbUrl,
      thumbnailUrl: result.thumbnailUrl || '',
      source: 'ai-generated',
      prompt,
      generatedById: userId,
    },
  });

  console.log(`[AI] ✅ Completado en ${totalSeconds}s (fuente: ${result.tier})`);
  return generated;
}