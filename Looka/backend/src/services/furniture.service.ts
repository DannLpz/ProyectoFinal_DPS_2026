/**
 * @file furniture.service.ts
 * @description Proporciona operaciones de persistencia para el catálogo de muebles.
 * Separa las consultas del catálogo predeterminado y los elementos generados por usuario.
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { prisma } from '../config/prisma';

/**
 * Recupera todos los muebles predeterminados disponibles.
 * @returns Colección de muebles predeterminados.
 * @throws Error si falla la consulta a la base de datos.
 */
export async function getDefaultFurniture() {
  return prisma.furniture.findMany({
    where: { source: 'default' },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Recupera los muebles generados que pertenecen a un usuario.
 * @param userId Identificador de la cuenta propietaria.
 * @returns Colección de muebles generados para el usuario.
 * @throws Error si falla la consulta a la base de datos.
 */
export async function getGeneratedFurniture(userId: string) {
  return prisma.furniture.findMany({
    where: { source: 'ai-generated', generatedById: userId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Persiste un mueble generado y lo asocia a su usuario.
 * @param data Datos del mueble y su propietario.
 * @returns Registro del mueble creado.
 * @throws Error si falla la escritura en la base de datos.
 */
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