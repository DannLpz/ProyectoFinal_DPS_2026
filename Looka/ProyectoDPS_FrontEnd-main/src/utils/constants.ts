import { theme } from '../config/theme';
import type { MenuOption } from '../models/MenuOption';

export const MENU_OPTIONS: readonly MenuOption[] = [
  {
    id: 'catalog',
    title: 'Explorar catálogo',
    description: 'Descubre muebles por estilo, espacio y categoría.',
    icon: 'shopping-bag',
    accentColor: theme.colors.coral,
  },
  {
    id: 'recommendations',
    title: 'Para ti',
    description: 'Recomendaciones según tus gustos y preferencias.',
    icon: 'star',
    accentColor: theme.colors.caramel,
    technology: 'IA',
  },
  {
    id: 'augmented-reality',
    title: 'Ver en mi espacio',
    description: 'Proyecta el mueble a escala real antes de comprar.',
    icon: 'box',
    accentColor: theme.colors.success,
    technology: 'AR',
  },
  {
    id: 'favorites',
    title: 'Favoritos',
    description: 'Reúne los muebles que mejor combinan contigo.',
    icon: 'heart',
    accentColor: theme.colors.primary,
  },
  {
    id: 'cart',
    title: 'Mi carrito',
    description: 'Revisa productos y prepara tu futura compra.',
    icon: 'shopping-cart',
    accentColor: theme.colors.brown,
  },
  {
    id: 'publish',
    title: 'Publicar mueble',
    description: 'Espacio futuro para tiendas y vendedores.',
    icon: 'plus-square',
    accentColor: theme.colors.warning,
  },
] as const;

export const PHASE_TWO_MESSAGE =
  'Esta opción es una vista previa del menú.';
