/**
 * @file auth.service.ts
 * @description Servicio de autenticación de usuarios.
 *
 * Contiene la lógica de negocio para:
 *  - Registro de nuevos usuarios
 *  - Inicio de sesión (login)
 *  - Generación y firma de tokens JWT
 *  - Hasheo de contraseñas con bcrypt
 *
 * @author Equipo LOOka
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * Registra un nuevo usuario en el sistema.
 *
 * @param {object} data - Datos del usuario
 * @param {string} data.email - Correo electrónico único
 * @param {string} data.username - Nombre de usuario único
 * @param {string} data.password - Contraseña en texto plano (se hashea)
 * @param {string} data.displayName - Nombre visible en la app
 * @returns {Promise<object>} Token JWT y datos del usuario
 * @throws {Error} Si el email o username ya existen
 */
export async function registerUser(data: {
  email: string;
  username: string;
  password: string;
  displayName: string;
}) {
  // Hashear la contraseña con bcrypt (10 rounds)
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Crear el usuario en la base de datos
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash,
      displayName: data.displayName,
    },
  });

  // Generar token JWT con expiración de 7 días
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    },
  };
}

/**
 * Inicia sesión de un usuario existente.
 *
 * Permite autenticarse con email O username (búsqueda flexible).
 *
 * @param {string} identifier - Email o username del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<object>} Resultado con { success, token, user } o { success: false, message }
 */
export async function loginUser(identifier: string, password: string) {
  // Buscar al usuario por email o username
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) {
    return { success: false, message: 'Usuario no encontrado' };
  }

  // Verificar contraseña con bcrypt
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return { success: false, message: 'Contraseña incorrecta' };
  }

  // Generar token JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    },
  };
}