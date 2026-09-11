import { prisma } from '../config/prisma';

// Diccionario de palabras clave -> categoría
// Si el prompt del usuario contiene alguna de estas palabras, sabemos qué categoría es.
const KEYWORD_MAP: Record<string, string> = {
  // Sillas
  silla: 'silla',
  asiento: 'silla',
  banco: 'silla',
  
  // Mesas
  mesa: 'mesa',
  comedor: 'mesa',
  
  // Sofás
  sofa: 'sofa',
  sofá: 'sofa',
  sillón: 'sofa',
  sillon: 'sofa',
  couch: 'sofa',
  
  // Camas
  cama: 'cama',
  dormitorio: 'cama',
  
  // Roperos
  ropero: 'ropero',
  armario: 'ropero',
  closet: 'ropero',
  
  // Estantes
  estante: 'estante',
  librero: 'estante',
  repisa: 'estante',
};

const DEFAULT_CATEGORIES = ['silla', 'mesa', 'sofa', 'cama', 'ropero', 'estante'];

function detectCategory(prompt: string): string {
  const normalized = prompt.toLowerCase();
  for (const [keyword, category] of Object.entries(KEYWORD_MAP)) {
    if (normalized.includes(keyword)) {
      return category;
    }
  }
  // Si no detecta nada, elige una categoría aleatoria
  return DEFAULT_CATEGORIES[Math.floor(Math.random() * DEFAULT_CATEGORIES.length)];
}

// Genera un nombre más "IA" basándose en el prompt
function generateName(prompt: string, category: string): string {
  const cleanPrompt = prompt.trim();
  // Capitaliza la primera letra
  const capitalized = cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1);
  return `${capitalized} (IA)`;
}

// Simula una pequeña espera para que se sienta "IA"
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateFurnitureFromPrompt(
  prompt: string,
  userId: string
) {
  // 1. Simulamos el "pensamiento" de la IA
  await wait(1500);

  // 2. Detectamos la categoría
  const category = detectCategory(prompt);

  // 3. Buscamos un mueble similar en la BD (el "truco")
  const candidates = await prisma.furniture.findMany({
    where: {
      category,
      source: 'default',
    },
  });

  // Si no hay candidatos, usamos cualquier mueble
  const pool = candidates.length > 0
    ? candidates
    : await prisma.furniture.findMany({ take: 1 });

  if (pool.length === 0) {
    throw new Error('No hay muebles base en la base de datos');
  }

  // 4. Elegimos uno al azar (o el primero)
  const baseModel = pool[Math.floor(Math.random() * pool.length)];

  // 5. Creamos el "nuevo mueble generado por IA" reutilizando el modelo base
  const generated = await prisma.furniture.create({
    data: {
      name: generateName(prompt, category),
      description: `Modelo generado por IA a partir de: "${prompt}"`,
      category,
      modelUrl: baseModel.modelUrl,       // 👈 Reutilizamos el modelo 3D
      thumbnailUrl: baseModel.thumbnailUrl,
      source: 'ai-generated',
      prompt,
      generatedById: userId,
    },
  });

  return generated;
}