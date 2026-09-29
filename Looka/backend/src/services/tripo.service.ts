import fs from 'fs';
import path from 'path';

const TRIPO_API_KEY = process.env.TRIPO_API_KEY || '';

export const CATEGORY_NAMES: Record<string, string> = {
  silla: 'Silla',
  mesa: 'Mesa',
  sofa: 'Sofá',
  cama: 'Cama',
  ropero: 'Ropero',
  estante: 'Estante',
  escritorio: 'Escritorio',
  television: 'Mueble de TV',
  organizador: 'Organizador',
  zapatero: 'Zapatero',
};

export interface Generated3DModel {
  glbUrl: string;
  viewerUrl?: string;
  tier: string;
  elapsedSeconds: number;
  promptUsed: string;
  category: string;
  categoryName: string;
  thumbnailUrl?: string;
}

/**
 * Descarga el .glb remoto y lo guarda localmente en public/models.
 * Esto evita problemas de CORS y persistencia.
 */
async function downloadGlbLocally(remoteUrl: string, taskId: string): Promise<string> {
  try {
    const modelsDir = path.resolve(process.cwd(), 'public/models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    const fileName = `tripo_${taskId.replace(/[^a-zA-Z0-9_-]/g, '_')}.glb`;
    const filePath = path.join(modelsDir, fileName);

    console.log(`[Tripo3D] Descargando modelo localmente: ${fileName}...`);
    const res = await fetch(remoteUrl);
    if (!res.ok) throw new Error(`Fallo descarga GLB: HTTP ${res.status}`);

    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    const sizeMB = (arrayBuffer.byteLength / 1024 / 1024).toFixed(2);
    console.log(`[Tripo3D] ✅ Guardado: /models/${fileName} (${sizeMB} MB)`);
    return `/models/${fileName}`;
  } catch (err) {
    console.warn('[Tripo3D] No se pudo descargar localmente:', err);
    return remoteUrl;
  }
}

/**
 * Genera un modelo 3D con la API v3 de Tripo3D (con fallback a v2).
 * Prioriza el modelo base (más ligero) para AR.
 */
export async function generateWithTripo3D(
  prompt: string
): Promise<{ glbUrl: string; thumbnailUrl?: string } | null> {
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey || apiKey === 'tu_tripo_key_aqui') {
    throw new Error('TRIPO_API_KEY no está configurada.');
  }

  console.log('[Tripo3D] Creando tarea para prompt:', prompt);

  let taskId = '';
  let apiVersion = 'v3';

  // 1. Intentar v3
  try {
    const createRes = await fetch('https://openapi.tripo3d.ai/v3/generation/text-to-model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model: 'v3.1-20260211',
      }),
    });

    const createData = (await createRes.json()) as any;
    if (createRes.ok && createData?.data?.task_id) {
      taskId = createData.data.task_id;
      apiVersion = 'v3';
      console.log(`[Tripo3D] Tarea v3: ${taskId}`);
    } else {
      if (createData?.code === 2010 || createData?.message?.includes('credit')) {
        throw new Error(`[Tripo3D] ${createData?.message || 'Sin créditos'}`);
      }
      console.warn('[Tripo3D] v3 rechazó, probando v2...');
    }
  } catch (v3Err: any) {
    if (v3Err.message?.includes('credit')) throw v3Err;
    console.warn('[Tripo3D] Error v3, probando v2:', v3Err.message);
  }

  // 2. Fallback a v2
  if (!taskId) {
    const v2Res = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ type: 'text_to_model', prompt }),
    });

    const v2Data = (await v2Res.json()) as any;
    if (!v2Res.ok || !v2Data?.data?.task_id) {
      throw new Error(v2Data?.message || `Error Tripo3D: HTTP ${v2Res.status}`);
    }
    taskId = v2Data.data.task_id;
    apiVersion = 'v2';
    console.log(`[Tripo3D] Tarea v2: ${taskId}`);
  }

  // 3. Polling
  const pollUrl =
    apiVersion === 'v3'
      ? `https://openapi.tripo3d.ai/v3/tasks/${taskId}`
      : `https://api.tripo3d.ai/v2/openapi/task/${taskId}`;

  const POLL_MS = 3000;
  const MAX_ATTEMPTS = 100; // ~5 minutos
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    await new Promise((r) => setTimeout(r, POLL_MS));
    attempts++;

    try {
      const pollRes = await fetch(pollUrl, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!pollRes.ok) continue;

      const pollData = (await pollRes.json()) as any;
      const status = pollData?.data?.status;
      const progress = pollData?.data?.progress ?? 0;

      console.log(`[Tripo3D] Estado: ${status} (${progress}%)`);

      if (status === 'success') {
        const output = pollData?.data?.output;
        // Priorizar base_model (más ligero ~1.5MB vs 15MB con PBR)
        const remoteGlbUrl =
          output?.base_model ||
          output?.model_url ||
          output?.model ||
          output?.pbr_model_url ||
          output?.pbr_model;
        const thumbnailUrl = output?.rendered_image_url || output?.rendered_image;

        if (!remoteGlbUrl) throw new Error('Sin URL de modelo.');

        const localUrl = await downloadGlbLocally(remoteGlbUrl, taskId);
        return { glbUrl: localUrl, thumbnailUrl };
      }

      if (status === 'failed' || status === 'cancelled') {
        throw new Error(`Tarea ${status}: ${pollData?.data?.message || ''}`);
      }
    } catch (pollErr: any) {
      if (pollErr.message.includes('Tarea')) throw pollErr;
      console.warn('[Tripo3D] Error temporal:', pollErr?.message);
    }
  }

  throw new Error('Timeout esperando resultado de Tripo3D.');
}

/**
 * Pipeline completo: valida que sea mueble + genera modelo 3D.
 */
export async function generate3DModelWithTripo(
  geminiResult: { isFurniture: boolean; category: string; enhancedPrompt: string },
  startTime: number = Date.now()
): Promise<Generated3DModel | null> {
  if (!geminiResult.isFurniture) {
    throw new Error(
      'Esa descripción no parece ser un mueble. Intenta con: silla, mesa, sofá, cama, ropero, estante.'
    );
  }

  console.log(`[Tripo3D] Prompt: "${geminiResult.enhancedPrompt}"`);

  const tripoResult = await generateWithTripo3D(geminiResult.enhancedPrompt);
  if (!tripoResult?.glbUrl) return null;

  const elapsed = (Date.now() - startTime) / 1000;
  console.log(`[Tripo3D] ✅ Completado en ${elapsed.toFixed(1)}s`);

  return {
    glbUrl: tripoResult.glbUrl,
    thumbnailUrl: tripoResult.thumbnailUrl,
    tier: 'tripo3d',
    elapsedSeconds: elapsed,
    promptUsed: geminiResult.enhancedPrompt,
    category: geminiResult.category,
    categoryName: CATEGORY_NAMES[geminiResult.category] || 'Mueble',
  };
}