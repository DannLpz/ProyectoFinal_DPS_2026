import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

  // Muebles predeterminados (ejemplos con URLs de modelos GLB de prueba)
  const furnitureData = [
    {
      name: 'Silla Nórdica',
      description: 'Silla minimalista de madera clara',
      category: 'silla',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      thumbnailUrl: 'https://via.placeholder.com/300x300?text=Silla',
      source: 'default',
    },
    {
      name: 'Mesa de Comedor',
      description: 'Mesa extensible de 6 puestos',
      category: 'mesa',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      thumbnailUrl: 'https://via.placeholder.com/300x300?text=Mesa',
      source: 'default',
    },
    {
      name: 'Ropero Moderno',
      description: 'Ropero de 2 puertas con espejo',
      category: 'ropero',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      thumbnailUrl: 'https://via.placeholder.com/300x300?text=Ropero',
      source: 'default',
    },
    {
      name: 'Escritorio de Oficina',
      description: 'Escritorio con cajones laterales',
      category: 'escritorio',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      thumbnailUrl: 'https://via.placeholder.com/300x300?text=Escritorio',
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