import { prisma } from '../config/prisma';

export async function getDefaultFurniture() {
  return prisma.furniture.findMany({
    where: { source: 'default' },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getGeneratedFurniture(userId: string) {
  return prisma.furniture.findMany({
    where: { source: 'ai-generated', generatedById: userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createFurniture(data: {
  name: string;
  description: string;
  category: string;
  modelUrl: string;
  thumbnailUrl: string;
  source: string;
  prompt?: string;
  generatedById?: string;
}) {
  return prisma.furniture.create({ data });
}