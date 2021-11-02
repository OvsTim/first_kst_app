import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  weight?: number;
  size?: number;
  picture_url: string;
  category: string;
  isNew?: boolean;
  isHit?: boolean;
  description?: string;
  price: number;
  categoryOrder: number;
}

export interface Category {
  id: string;
  name: string;
  fire: boolean;
  order: number;
}

interface ProductsData {
  products: Record<string, Product>;
  categories: Record<string, Category>;
  categoryIds: Array<string>;
  productIds: Array<string>;
}
const initialState = {
  categories: {},
  products: {},
  categoryIds: [],
  productIds: [],
} as ProductsData;

const productsDataSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Array<Category>>) {
      state.categories = {};
      action.payload.forEach(it => {
        state.categories[it.id] = it;
      });
      state.categoryIds = action.payload.map(it => it.id);
    },
    setProducts(state, action: PayloadAction<Array<Product>>) {
      state.products = {};
      action.payload.forEach(it => {
        state.products[it.id] = it;
      });

      let sorted = action.payload.sort(function (a, b) {
        return a.categoryOrder - b.categoryOrder;
      });

      state.productIds = sorted.map(it => it.id);
    },
    resetAction() {
      return initialState;
    },
  },
});

export const {
  resetAction,
  setCategories,
  setProducts,
} = productsDataSlice.actions;
export default productsDataSlice.reducer;
