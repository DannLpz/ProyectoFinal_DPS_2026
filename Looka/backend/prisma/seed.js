const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Rutas RELATIVAS (sin dominio ni IP). El frontend las completa.
const MODELS = {
  silla: '/models/silla.glb',
  mesa: '/models/mesa.glb',
  sofa: '/models/sofa.glb',
  cama: '/models/cama.glb',
  ropero: '/models/ropero.glb',
  estante: '/models/estante.glb',
};

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
      thumbnailUrl: '',
      source: 'default',
    },
    {
      name: 'Mesa de Comedor',
      description: 'Mesa extensible para 6 personas con acabado premium',
      category: 'mesa',
      modelUrl: MODELS.mesa,
      thumbnailUrl: '',
      source: 'default',
    },
    {
      name: 'Sofá Moderno',
      description: 'Sofá de 3 plazas con tapizado premium y patas de madera',
      category: 'sofa',
      modelUrl: MODELS.sofa,
      thumbnailUrl: '',
      source: 'default',
    },
    {
      name: 'Cama Matrimonial',
      description: 'Cama con cabecera acolchada y base de madera sólida',
      category: 'cama',
      modelUrl: MODELS.cama,
      thumbnailUrl: '',
      source: 'default',
    },
    {
      name: 'Ropero Moderno',
      description: 'Ropero de 2 puertas con espejo integrado y cajones',
      category: 'ropero',
      modelUrl: MODELS.ropero,
      thumbnailUrl: '',
      source: 'default',
    },
    {
      name: 'Estante Librero',
      description: 'Estante de 5 niveles para libros y objetos decorativos',
      category: 'estante',
      modelUrl: MODELS.estante,
      thumbnailUrl: '',
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