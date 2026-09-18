import { prisma } from '../config/prisma';

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  currency?: string;
  furnitureId: string;
}

export async function createListing(data: CreateListingInput, sellerId: string) {
  // Verificar que el mueble existe
  const furniture = await prisma.furniture.findUnique({
    where: { id: data.furnitureId },
  });

  if (!furniture) {
    throw new Error('El mueble seleccionado no existe');
  }

  // Verificar que el usuario no haya publicado ya este mueble
  const existing = await prisma.listing.findFirst({
    where: { furnitureId: data.furnitureId, sellerId },
  });

  if (existing) {
    throw new Error('Ya publicaste este mueble');
  }

  return prisma.listing.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      price: data.price,
      currency: data.currency || 'USD',
      furnitureId: data.furnitureId,
      sellerId,
    },
    include: {
      furniture: true,
      seller: {
        select: { id: true, username: true, displayName: true },
      },
    },
  });
}

export async function getUserListings(sellerId: string) {
  return prisma.listing.findMany({
    where: { sellerId, status: 'active' },
    orderBy: { createdAt: 'desc' },
    include: {
      furniture: true,
    },
  });
}

export async function getAllListings() {
  return prisma.listing.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
    include: {
      furniture: true,
      seller: {
        select: { id: true, username: true, displayName: true },
      },
    },
  });
}

export async function deleteListing(listingId: string, sellerId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new Error('Publicación no encontrada');
  }

  if (listing.sellerId !== sellerId) {
    throw new Error('No tienes permiso para eliminar esta publicación');
  }

  return prisma.listing.delete({ where: { id: listingId } });
}