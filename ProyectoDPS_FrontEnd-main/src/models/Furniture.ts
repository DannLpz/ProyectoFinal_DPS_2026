export interface Furniture {
  id: string;
  name: string;
  description: string;
  category: 'silla' | 'mesa' | 'ropero' | 'escritorio' | 'generado';
  modelUrl: string;
  thumbnailUrl: string;
  source: 'default' | 'ai-generated';
  prompt?: string;
}