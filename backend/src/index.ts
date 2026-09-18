import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import listingRoutes from './routes/listing.routes';
import authRoutes from './routes/auth.routes';
import furnitureRoutes from './routes/furniture.routes';
import aiRoutes from './routes/ai.routes'; 
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use('/api/listings', listingRoutes);
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
  const category = (req.query.category as string) || '';
  const tier = (req.query.tier as string) || '';

  if (!modelUrl) {
    return res.status(400).send('Falta el parámetro model');
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${name} · LOOka AR</title>
  <script type="module"
    src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js">
  </script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(160deg, #FDF6EC 0%, #F7EAD6 100%);
      min-height: 100vh;
      color: #4A2E2E;
      -webkit-tap-highlight-color: transparent;
    }

    .container {
      max-width: 640px;
      margin: 0 auto;
      padding: 24px 20px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(122, 21, 38, 0.08);
      color: #7A1526;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 999px;
      margin-bottom: 12px;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      background: #7A1526;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    h1 {
      font-size: 26px;
      font-weight: 800;
      text-align: center;
      color: #7A1526;
      margin-bottom: 6px;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 13px;
      color: #8B6F6F;
      text-align: center;
      margin-bottom: 20px;
      max-width: 360px;
      line-height: 1.5;
    }

    .viewer-wrapper {
      position: relative;
      width: 100%;
      height: 55vh;
      min-height: 380px;
      background: radial-gradient(circle at center, #FFFFFF 0%, #F2E4D0 100%);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(122, 21, 38, 0.10);
      margin-bottom: 20px;
    }

    model-viewer {
      width: 100%;
      height: 100%;
      --poster-color: transparent;
      --progress-bar-color: #7A1526;
      --progress-bar-height: 3px;
    }

    .loader {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(253, 246, 236, 0.9);
      transition: opacity 0.4s ease;
      pointer-events: none;
      z-index: 5;
    }

    .loader.hidden { opacity: 0; }

    .spinner {
      width: 44px;
      height: 44px;
      border: 4px solid rgba(122, 21, 38, 0.15);
      border-top-color: #7A1526;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      margin-bottom: 14px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .loader-text {
      font-size: 13px;
      color: #7A1526;
      font-weight: 600;
    }

    #ar-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      max-width: 360px;
      background: linear-gradient(135deg, #8E1A2E 0%, #7A1526 100%);
      color: #FFFFFF;
      border: none;
      border-radius: 16px;
      padding: 18px 28px;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: 0.3px;
      cursor: pointer;
      box-shadow: 0 10px 28px rgba(122, 21, 38, 0.32);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      margin-bottom: 14px;
    }

    #ar-button:active {
      transform: scale(0.97);
      box-shadow: 0 6px 18px rgba(122, 21, 38, 0.4);
    }

    .helper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(122, 21, 38, 0.06);
      color: #7A1526;
      font-size: 12px;
      text-align: center;
      padding: 12px 18px;
      border-radius: 12px;
      max-width: 400px;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    .helper-icon {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: rgba(122, 21, 38, 0.15);
      color: #7A1526;
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-top: auto;
      padding-top: 20px;
    }

    .chip {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(122, 21, 38, 0.12);
      color: #7A1526;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 999px;
      letter-spacing: 0.3px;
    }

    .chip.chip-ai {
      background: rgba(244, 164, 184, 0.25);
      border-color: rgba(244, 164, 184, 0.5);
    }

    .unsupported {
      background: #FFF3E0;
      border: 1px solid #FFB74D;
      color: #E65100;
      font-size: 13px;
      padding: 12px 18px;
      border-radius: 12px;
      max-width: 400px;
      text-align: center;
      margin-bottom: 20px;
      display: none;
    }

    .unsupported.visible { display: block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <span class="badge-dot"></span>
      Realidad Aumentada
    </div>

    <h1>${name}</h1>
    <p class="subtitle">Coloca el mueble en tu espacio y ajústalo a escala real</p>

    <div class="viewer-wrapper">
      <div class="loader" id="loader">
        <div class="spinner"></div>
        <div class="loader-text">Cargando modelo 3D…</div>
      </div>

      <model-viewer
        id="viewer"
        src="${modelUrl}"
        alt="${name}"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        camera-controls
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="20deg"
        shadow-intensity="1"
        shadow-softness="0.85"
        environment-image="neutral"
        exposure="1"
        camera-orbit="45deg 75deg 2.5m"
        min-camera-orbit="auto 0deg auto"
        max-camera-orbit="auto 90deg auto">
        <button id="ar-button" slot="ar-button">
          👋 Ver en mi espacio real
        </button>
      </model-viewer>
    </div>

    <div class="unsupported" id="unsupported">
      ⚠️ Tu dispositivo no soporta AR, pero puedes ver el modelo en 3D arriba.
    </div>

    <div class="helper">
      <span class="helper-icon">i</span>
      <span>Al tocar el botón se abrirá la cámara. Mueve el dispositivo para que detecte el piso.</span>
    </div>

    <div class="meta">
      ${category ? `<span class="chip">${category.toUpperCase()}</span>` : ''}
      ${tier ? `<span class="chip chip-ai">IA · ${tier}</span>` : ''}
      <span class="chip">LOOka · 2026</span>
    </div>
  </div>

  <script>
    const viewer = document.getElementById('viewer');
    const loader = document.getElementById('loader');
    const unsupported = document.getElementById('unsupported');

    // Ocultar loader al cargar el modelo
    viewer.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 200);
    });

    // Mostrar mensaje si no hay soporte AR (con timeout de respaldo)
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (viewer.canActivateAR === false) {
          unsupported.classList.add('visible');
        }
      }, 1500);
    });
  </script>
</body>
</html>`;

  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor LOOka corriendo en el puerto ${PORT}`);
});