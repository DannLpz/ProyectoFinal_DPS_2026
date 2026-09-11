import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import furnitureRoutes from './routes/furniture.routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);

// Ruta de salud (para verificar que el servidor está vivo)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'LOOka backend funcionando 🚀' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor LOOka corriendo en el puerto ${PORT}`);
});