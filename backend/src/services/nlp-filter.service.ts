const FURNITURE_KEYWORDS: Record<string, string[]> = {
  silla: [
    'silla', 'sillon', 'sillón', 'asiento', 'banco', 'butaca',
    'silla de oficina', 'silla con ruedas', 'silla de comedor', 'silla moderna',
  ],
  mesa: [
    'mesa', 'mesita', 'mesa de comedor', 'mesa de centro',
    'mesa de noche', 'mesa de trabajo', 'mesa moderna', 'mesa de madera',
  ],
  sofa: [
    'sofa', 'sofá', 'couch', 'sillon de sala', 'sofa cama', 'sofa moderno',
  ],
  cama: [
    'cama', 'litera', 'cama matrimonial', 'cama individual', 'cama king',
  ],
  ropero: [
    'ropero', 'armario', 'closet', 'clóset', 'guardarropa', 'ropero moderno',
  ],
  estante: [
    'estante', 'librero', 'repisa', 'estanteria', 'estantería', 'estante para libros',
  ],
  escritorio: [
    'escritorio', 'buro', 'buró', 'mesa de oficina', 'escritorio moderno',
  ],
  television: [
    'mueble para televisor', 'mueble de televisor', 'soporte de televisor',
    'soporte de tv', 'mueble para tv', 'mueble de tv', 'rack de tv',
    'centro de entretenimiento', 'mueble para la tele',
  ],
  organizador: [
    'organizador', 'cajonera', 'gavetero', 'comoda', 'cómoda',
  ],
  zapatero: [
    'zapatero', 'mueble de zapatos', 'organizador de zapatos',
  ],
};

const NON_FURNITURE_KEYWORDS = [
  'carro', 'coche', 'auto', 'automovil', 'automóvil', 'moto', 'motocicleta', 'bicicleta',
  'avion', 'avión', 'barco', 'tren', 'camion', 'camión',
  'pizza', 'comida', 'hamburguesa', 'taco', 'sushi', 'helado', 'cafe', 'café',
  'gato', 'perro', 'mascota', 'pajaro', 'pájaro', 'pez', 'animal',
  'computadora', 'computador', 'celular', 'telefono', 'teléfono', 'laptop',
  'tablet', 'television', 'televisión', 'monitor',
  'libro', 'pelota', 'juguete', 'ropa', 'zapatos', 'camisa', 'pantalon', 'pantalón',
  'persona', 'hombre', 'mujer', 'niño', 'niña', 'planta', 'flor', 'arbol', 'árbol',
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export interface ClassificationResult {
  isFurniture: boolean;
  category: string;
  confidence: number;
}

export async function classifyFurniturePrompt(
  prompt: string
): Promise<ClassificationResult> {
  const text = normalize(prompt);

  // Verificar si contiene palabras de NO muebles
  for (const bad of NON_FURNITURE_KEYWORDS) {
    if (text.includes(normalize(bad))) {
      return { isFurniture: false, category: 'otro', confidence: 0.95 };
    }
  }

  // Buscar coincidencias con categorías de muebles
  let bestCategory = 'otro';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(FURNITURE_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      const normalizedKeyword = normalize(keyword);
      if (text.includes(normalizedKeyword)) {
        score += normalizedKeyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  if (bestScore === 0) {
    return { isFurniture: false, category: 'otro', confidence: 0 };
  }

  const confidence = Math.min(1, bestScore / 20);
  return { isFurniture: true, category: bestCategory, confidence };
}