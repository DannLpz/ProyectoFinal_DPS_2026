/**
 * @file index.ts
 * @description Punto de entrada del backend de LOOka.
 *
 * Este archivo:
 *  - Configura el servidor Express
 *  - Carga las variables de entorno desde el .env de la raíz
 *  - Registra todos los middlewares globales (CORS, JSON parser)
 *  - Monta las rutas de la API REST (auth, furniture, listings, ai)
 *  - Sirve los modelos 3D como archivos estáticos
 *  - Proporciona el visor AR basado en model-viewer
 *  - Configura los timeouts del servidor HTTP para generación 3D
 *
 * @author Equipo LOOka - Universidad Don Bosco
 * @version 2.0.0
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';

import authRoutes from './routes/auth.routes';
import furnitureRoutes from './routes/furniture.routes';
import aiRoutes from './routes/ai.routes';
import listingRoutes from './routes/listing.routes';

// ─────────────────────────────────────────────────────────────
// Carga de variables de entorno desde el .env de la raíz
// ─────────────────────────────────────────────────────────────
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ─────────────────────────────────────────────────────────────
// Middlewares globales
// ─────────────────────────────────────────────────────────────
app.use(cors());              // Permite peticiones cross-origin
app.use(express.json());      // Parsea bodies en formato JSON

// ─────────────────────────────────────────────────────────────
// Registro de rutas de la API REST
// ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/listings', listingRoutes);

// ─────────────────────────────────────────────────────────────
// Servir los modelos 3D (.glb) como archivos estáticos
// ─────────────────────────────────────────────────────────────
app.use('/models', express.static(path.join(__dirname, '../../public/models')));

/**
 * Ruta de health check.
 * @route GET /api/health
 * @returns {object} Estado del servidor
 */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'LOOka backend funcionando 🚀' });
});

/**
 * Ruta que sirve el visor AR en el navegador.
 * iOS bloquea AR Quick Look desde un WebView, así que abrimos
 * esta URL en Safari para que el usuario pueda activar la cámara nativa.
 *
 * @route GET /ar/viewer
 * @query {string} model - URL del modelo 3D (.glb)
 * @query {string} name - Nombre del mueble
 * @query {string} category - Categoría del mueble
 * @returns {HTML} Página con model-viewer configurado para AR
 */
app.get('/ar/viewer', (req, res) => {
  const modelUrl = req.query.model as string;
  const name = (req.query.name as string) || 'Mueble LOOka';
  const category = (req.query.category as string) || '';

  if (!modelUrl) {
    return res.status(400).send('Falta el parámetro model');
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} · LOOka AR</title>
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"></script>
  <style>
    body { margin: 0; background: #F7EAD6; font-family: -apple-system, sans-serif; }
    model-viewer { width: 100vw; height: 80vh; --poster-color: transparent; }
    #ar-button {
      display: block;
      width: 80%;
      max-width: 360px;
      margin: 20px auto;
      background: #7A1526;
      color: white;
      border: none;
      border-radius: 12px;
      padding: 18px;
      font-size: 17px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <model-viewer src="${modelUrl}" alt="${name}" ar ar-modes="webxr scene-viewer quick-look" ar-scale="auto" ar-placement="floor" camera-controls auto-rotate shadow-intensity="1">
    <button id="ar-button" slot="ar-button">👋 Ver en mi espacio real</button>
  </model-viewer>
</body>
</html>`;

  res.send(html);
});

// ─────────────────────────────────────────────────────────────
// Servidor HTTP con timeouts extendidos
// ─────────────────────────────────────────────────────────────
const server = http.createServer(app);

// Timeouts de 10 minutos para generación 3D con Tripo3D
server.timeout = 600000;
server.keepAliveTimeout = 600000;
server.headersTimeout = 605000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor LOOka corriendo en el puerto ${PORT}`);
  console.log(`   Timeout configurado: 10 minutos`);
});