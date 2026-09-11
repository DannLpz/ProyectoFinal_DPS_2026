import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes';
import furnitureRoutes from './routes/furniture.routes';
import aiRoutes from './routes/ai.routes'; 
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

app.use('/models', express.static(path.join(__dirname, '../../public/models')));
// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/ai', aiRoutes); 
// Ruta de salud (para verificar que el servidor está vivo)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'LOOka backend funcionando 🚀' });
});

// Ruta que sirve el visor AR en el navegador (para lanzar AR Quick Look de iOS)
app.get('/ar/viewer', (req, res) => {
  const modelUrl = req.query.model as string;
  const name = (req.query.name as string) || 'Mueble LOOka';
  const usdzUrl = req.query.usdz as string;

  if (!modelUrl) {
    return res.status(400).send('Falta el parámetro model');
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - AR</title>
  <script type="module"
    src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js">
  </script>
  <style>
    body {
      margin: 0; padding: 0; background: #F7EAD6;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      min-height: 100vh;
      font-family: -apple-system, sans-serif;
    }
    model-viewer {
      width: 90vw; height: 60vh;
      --poster-color: transparent;
    }
    h1 {
      color: #7A1526; font-size: 22px;
      text-align: center; margin: 10px 0 5px;
    }
    #ar-button {
      background: #7A1526; color: white; border: none;
      border-radius: 12px; padding: 18px 36px;
      font-size: 17px; font-weight: 700; margin-top: 15px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(122, 21, 38, 0.35);
    }
    p { color: #7A1526; font-size: 13px; text-align: center; padding: 0 20px; opacity: 0.7; }
  </style>
</head>
<body>
  <h1>${name}</h1>
  <model-viewer
    src="${modelUrl}"
    ${usdzUrl ? `ios-src="${usdzUrl}"` : ''}
    alt="${name}"
    ar
    ar-modes="webxr scene-viewer quick-look"
    ar-scale="auto"
    camera-controls
    auto-rotate
    shadow-intensity="1"
    environment-image="neutral">
    <button id="ar-button" slot="ar-button">👋 Ver en mi espacio real</button>
  </model-viewer>
  <p>Toca el botón para proyectar el mueble en tu entorno con la cámara</p>
</body>
</html>`;

  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor LOOka corriendo en el puerto ${PORT}`);
});