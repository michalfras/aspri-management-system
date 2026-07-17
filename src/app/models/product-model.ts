export type ProductData = {
  id: number;
  nameKey: string;
  infoKey?: string;
  shortInfoKey?: string;
  price: number;
  image?: string;

  adminName?: AdminTranslation;
  adminInfo?: AdminTranslation;
  adminShortInfo?: AdminTranslation;

  category: Category;
  subcategory: Subcategories;
  badge?: BadgeOptions;
  isPopular: boolean;
  forcePopup: boolean;
  showInfoInMenu?: boolean;
  isHidden?: boolean;
  choices?: ProductChoice[];
};

export type ProductFormData = Omit<ProductData, 'id'> & {
  id?: number;
};

export type Category = 'food' | 'drink' | 'alcohol';

export type ProductChoice = {
  labelKey: string;
  adminLabel?: AdminTranslation;
  price: number;
};

export type CartItem = {
  product: ProductData;
  quantity: number;
  selectedChoice?: ProductChoice;
};

export type Subcategories = (typeof SUBCATEGORY_ADMIN_OPTIONS)[number]['value'];

export const SUBCATEGORY_ADMIN_OPTIONS = [
  { value: 'main-dishes', label: 'Dania Główne' },
  { value: 'salads', label: 'Sałatki' },
  { value: 'dumplings', label: 'Pierogi' },
  { value: 'soups', label: 'Zupy' },
  { value: 'dishes', label: 'Dania' },
  { value: 'desserts', label: 'Desery' },
  { value: 'sides', label: 'Dodatki' },
  { value: 'sauces', label: 'Sosy' },
  { value: 'hot-drinks', label: 'Gorące Napoje' },
  { value: 'cold-drinks', label: 'Zimne Napoje' },
  { value: 'drinks', label: 'Napoje' },
  { value: 'cocktails', label: 'Drinki' },
  { value: 'mocktails', label: 'Drinki Bezalkoholowe' },
  { value: 'shots', label: 'Shoty' },
  { value: 'vodka', label: 'Wódka' },
  { value: 'tequila', label: 'Tequila' },
  { value: 'brandy', label: 'Brandy' },
  { value: 'whiskey', label: 'Whiskey' },
  { value: 'liqueur', label: 'Likiery' },
  { value: 'rum', label: 'Rum' },
  { value: 'cognac', label: 'Cognac' },
  { value: 'draft-beer', label: 'Piwo Lane' },
  { value: 'bottled-beer', label: 'Piwo w Butelce' },
  { value: 'beer-specials', label: 'Piwo Inaczej' },
  { value: 'sparkling-wine', label: 'Wino Musujące' },
  { value: 'red-wine', label: 'Wino Czerwone' },
  { value: 'white-wine', label: 'Wino Białe' },
] as const;

export type BadgeOptions = (typeof BADGE_OPTIONS)[number]['value'];

export const BADGE_OPTIONS = [
  { value: 'favourite', label: 'Polecane' },
  { value: 'hot', label: 'Pikantne' },
  { value: 'kids', label: 'Dla Dzieci' },
  { value: 'vegetarian', label: 'Wegetariańskie' },
  { value: 'beer', label: 'Do Piwa' },
] as const;

export type AdminTranslation = {
  pl: string;
  en?: string;
  ger?: string;
  ukr?: string;
  jpn?: string;
};
