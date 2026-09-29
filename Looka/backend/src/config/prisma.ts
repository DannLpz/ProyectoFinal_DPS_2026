/**
 * @file prisma.ts
 * @description Cliente Prisma singleton para toda la aplicación.
 *
 * Se exporta una ÚNICA instancia de PrismaClient para evitar
 * abrir múltiples conexiones a PostgreSQL en el mismo proceso.
 * Este patrón se conoce como "Singleton" y es recomendado
 * por la documentación oficial de Prisma.
 *
 * @author Equipo LOOka
 */

import { PrismaClient } from '@prisma/client';

/**
 * Instancia única de PrismaClient.
 * @example
 * import { prisma } from '../config/prisma';
 * const users = await prisma.user.findMany();
 */
export const prisma = new PrismaClient();