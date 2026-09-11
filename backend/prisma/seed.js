const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// URL base del backend (para servir los modelos locales)
// En Docker, el backend está accesible desde la red local con la IP de tu PC.
// Si quieres que funcione desde el iPhone, usa la IP real (ej: http://192.168.1.9:3000)
const BACKEND_URL = process.env.BACKEND_URL || 'http://192.168.1.9:3000';

// URLs de los modelos (servidos desde el propio backend)
const MODELS = {
  silla: `${BACKEND_URL}/models/silla.glb`,
  mesa: `${BACKEND_URL}/models/mesa.glb`,
  sofa: `${BACKEND_URL}/models/sofa.glb`,
  cama: `${BACKEND_URL}/models/cama.glb`,
  ropero: `${BACKEND_URL}/models/ropero.glb`,
  estante: `${BACKEND_URL}/models/estante.glb`,
};

// Imágenes placeholder con el branding de LOOka (100% confiables)
// En backend/prisma/seed.js, cambia PLACEHOLDER por string vacío:
const PLACEHOLDER = () => '';

async function main() {
  const passwordHash = await bcrypt.hash('demo123', 10);

  await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      email: 'demo@looka.com',
      username: 'demo',
      passwordHash,
      displayName: 'Cliente Demo',
      role: 'buyer',
    },
  });

  // Limpiar todo el catálogo anterior
  await prisma.furniture.deleteMany({ where: { source: 'default' } });

  const furnitureData = [
    {
      name: 'Silla Nórdica',
      description: 'Silla minimalista de madera clara con respaldo alto',
      category: 'silla',
      modelUrl: MODELS.silla,
      thumbnailUrl: PLACEHOLDER('Silla\nNordica'),
      source: 'default',
    },
    {
      name: 'Mesa de Comedor',
      description: 'Mesa extensible para 6 personas con acabado premium',
      category: 'mesa',
      modelUrl: MODELS.mesa,
      thumbnailUrl: PLACEHOLDER('Mesa\nde\nComedor'),
      source: 'default',
    },
    {
      name: 'Sofá Moderno',
      description: 'Sofá de 3 plazas con tapizado premium y patas de madera',
      category: 'sofa',
      modelUrl: MODELS.sofa,
      thumbnailUrl: PLACEHOLDER('Sofa\nModerno'),
      source: 'default',
    },
    {
      name: 'Cama Matrimonial',
      description: 'Cama con cabecera acolchada y base de madera sólida',
      category: 'cama',
      modelUrl: MODELS.cama,
      thumbnailUrl: PLACEHOLDER('Cama\nMatrimonial'),
      source: 'default',
    },
    {
      name: 'Ropero Moderno',
      description: 'Ropero de 2 puertas con espejo integrado y cajones',
      category: 'ropero',
      modelUrl: MODELS.ropero,
      thumbnailUrl: PLACEHOLDER('Ropero\nModerno'),
      source: 'default',
    },
    {
      name: 'Estante Librero',
      description: 'Estante de 5 niveles para libros y objetos decorativos',
      category: 'estante',
      modelUrl: MODELS.estante,
      thumbnailUrl: PLACEHOLDER('Estante\nLibrero'),
      source: 'default',
    },
  ];

  for (const item of furnitureData) {
    await prisma.furniture.create({ data: item });
  }

  console.log('✅ Seed ejecutado correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });