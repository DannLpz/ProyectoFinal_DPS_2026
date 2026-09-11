export type MenuIconName =
  | 'shopping-bag'
  | 'star'
  | 'box'
  | 'heart'
  | 'shopping-cart'
  | 'plus-square';

export type FutureTechnology = 'AR' | 'IA';

export interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: MenuIconName;
  accentColor: string;
  technology?: FutureTechnology;
}
