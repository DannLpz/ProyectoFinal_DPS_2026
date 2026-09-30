/**
 * @file listing.service.ts
 * @description Gestiona la persistencia y consulta de publicaciones del marketplace.
 * Aplica las relaciones entre vendedor, mueble y publicación en las operaciones de datos.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { prisma } from '../config/prisma';

/** Datos requeridos para crear una publicación de un mueble. */
export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  currency?: string;
  furnitureId: string;
}

/**
 * Crea una publicación asociada al vendedor indicado.
 * @param data Campos de contenido, precio, moneda y mueble asociado.
 * @param sellerId Identificador de la cuenta vendedora.
 * @returns Publicación persistida.
 * @throws Error si el mueble no existe o falla la operación de persistencia.
 * @example
 * const listing = await createListing(input, sellerId);
 */
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

/**
 * Lista las publicaciones de un vendedor específico.
 * @param sellerId Identificador de la cuenta vendedora.
 * @returns Publicaciones pertenecientes al vendedor.
 * @throws Error si falla la consulta a la base de datos.
 */
export async function getUserListings(sellerId: string) {
  return prisma.listing.findMany({
    where: { sellerId, status: 'active' },
    orderBy: { createdAt: 'desc' },
    include: {
      furniture: true,
    },
  });
}

/**
 * Recupera todas las publicaciones disponibles en el marketplace.
 * @returns Colección global de publicaciones.
 * @throws Error si falla la consulta a la base de datos.
 */
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

/**
 * Elimina una publicación verificando que pertenezca al vendedor indicado.
 * @param listingId Identificador de la publicación que se eliminará.
 * @param sellerId Identificador de la cuenta propietaria.
 * @returns Resultado de la operación de eliminación.
 * @throws Error si la publicación no existe, no pertenece al vendedor o falla la base de datos.
 */
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