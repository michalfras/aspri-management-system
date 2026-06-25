export type ProductData = {
  id: number;
  price: number;
  image?: string;
  nameKey: string;
  shortInfoKey?: string;
  infoKey?: string;
  category: 'food' | 'drink' | 'alcohol';
  subcategory: Subcategories;
  badge?: 'favourite' | 'hot' | 'kids' | 'vegetarian' | 'beer';
  isPopular: boolean;
  forcePopup: boolean;
  showInfoInMenu?: boolean;
  choices?: ProductChoice[];
};

export type ProductChoice = {
  labelKey: string;
  price: number;
};

export type CartItem = {
  product: ProductData;
  quantity: number;
  selectedChoice?: ProductChoice;
};

export type Subcategories = (typeof SUBCATEGORIES)[number];

export const SUBCATEGORIES = [
  'main-dishes',
  'salads',
  'dumplings',
  'soups',
  'dishes',
  'desserts',
  'sides',
  'sauces',
  'hot-drinks',
  'cold-drinks',
  'drinks',
  'cocktails',
  'mocktails',
  'shots',
  'vodka',
  'tequila',
  'brandy',
  'whiskey',
  'liqueur',
  'rum',
  'cognac',
  'draft-beer',
  'bottled-beer',
  'beer-specials',
  'sparkling-wine',
  'red-wine',
  'white-wine',
] as const;
