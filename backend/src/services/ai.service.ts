import { prisma } from '../config/prisma';
import { classifyFurniturePrompt } from './nlp-filter.service';

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

export async function generateFurnitureFromPrompt(
  prompt: string,
  userId: string
) {
  const classification = await classifyFurniturePrompt(prompt);
  console.log('[AI] Clasificación:', classification);

  if (!classification.isFurniture) {
    throw new Error(
      'Esa descripción no parece ser un mueble. Intenta con: silla, mesa, sofá, cama, ropero o estante.'
    );
  }

  const baseModel =
    (await prisma.furniture.findFirst({
      where: { category: classification.category, source: 'default' },
    })) ||
    (await prisma.furniture.findFirst({ where: { source: 'default' } }));

  if (!baseModel) {
    throw new Error('No hay modelos disponibles.');
  }

  // Nombre genérico según categoría, no el prompt completo
  const categoryName = CATEGORY_NAMES[classification.category] || 'Mueble';
  const displayName = `${categoryName} (IA)`;

  const generated = await prisma.furniture.create({
    data: {
      name: displayName,
      description: `Generado por IA a partir de: "${prompt.trim()}"`,
      category: classification.category,
      modelUrl: baseModel.modelUrl,
      thumbnailUrl: '',
      source: 'ai-generated',
      prompt,
      generatedById: userId,
    },
  });

  return generated;
}