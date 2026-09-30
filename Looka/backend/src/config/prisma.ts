/**
 * @file prisma.ts
 * @description Cliente Prisma compartido por los módulos del backend.
 *
 * Se exporta una ÚNICA instancia de PrismaClient para evitar
 * Centraliza el acceso a PostgreSQL y evita crear conexiones
 * independientes desde cada servicio.
 *
 * @author Equipo LOOka
 * @version 2.0.0
 */

import { PrismaClient } from '@prisma/client';

/**
 * Instancia única de PrismaClient.
 * @example
 * import { prisma } from '../config/prisma';
 * const users = await prisma.user.findMany();
 */
export const prisma = new PrismaClient();