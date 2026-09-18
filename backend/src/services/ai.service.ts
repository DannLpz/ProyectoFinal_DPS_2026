import { prisma } from '../config/prisma';
import { generate3DModelFromText } from './forge.service';

export async function generateFurnitureFromPrompt(
  prompt: string,
  userId: string
) {
  const globalStart = Date.now();

  console.log('[AI] Iniciando pipeline Gemini + Forge...');

  const result = await generate3DModelFromText(prompt);

  if (!result?.glbUrl) {
    throw new Error(
      'No pudimos generar el modelo 3D. Intenta con una descripción diferente.'
    );
  }

  const totalSeconds = ((Date.now() - globalStart) / 1000).toFixed(1);
  const cleanName = prompt.trim().charAt(0).toUpperCase() + prompt.trim().slice(1);

  // 👇 Limpieza automática: borrar IA de este usuario con más de 15 minutos
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
      console.log(`[AI] 🧹 Limpieza automática: ${deleted.count} modelos viejos eliminados`);
    }
  } catch (err) {
    console.warn('[AI] Error en limpieza automática:', err);
    // No fallamos la generación por un error de limpieza
  }

  const generated = await prisma.furniture.create({
    data: {
      name: cleanName,
      description: `Diseño único generado por IA · ${result.categoryName} · ${totalSeconds}s`,
      category: result.category,
      modelUrl: result.glbUrl,
      thumbnailUrl: '',
      source: 'ai-generated',
      prompt,
      generatedById: userId,
    },
  });

  console.log(`[AI] ✅ Proceso completo en ${totalSeconds}s`);

  return generated;
}