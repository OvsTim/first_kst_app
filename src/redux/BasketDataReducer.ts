import {Product} from './ProductsDataSlice';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface BasketItem {
  item: Product;
  count: number;
}

interface BasketData {
  basket: Array<BasketItem>;
}
const initialState = {
  basket: [],
} as BasketData;

const basketDataSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    plusProduct(state, action: PayloadAction<Product>) {
      if (state.basket.some(item => item.item.id === action.payload.id)) {
        let index = state.basket.findIndex(
          it => it.item.id === action.payload.id,
        );
        state.basket[index].count = state.basket[index].count + 1;
      } else {
        state.basket.push({
          count: 1,
          item: action.payload,
        }); //иначе просто кладем в список
      }
    },
    minusProduct(state, action: PayloadAction<Product>) {
      if (
        state.basket.some(
          item => item.item.id === action.payload.id && item.count === 1,
        )
      ) {
        //если есть такой элемент и там остался один
        //удаляем его из списка
        state.basket = state.basket.filter(
          obj => obj.item.id !== action.payload.id,
        );
      } else {
        let index = state.basket.findIndex(
          it => it.item.id === action.payload.id,
        );
        state.basket[index].count = state.basket[index].count - 1;
      }
    },
    deleteProduct(state, action: PayloadAction<Product>) {
      state.basket = state.basket.filter(
        obj => obj.item.id !== action.payload.id,
      );
    },
    setBasket(state, action: PayloadAction<Array<BasketItem>>) {
      state.basket = action.payload;
    },
    clearBasket(state) {
      state.basket = [];
    },

    resetAction() {
      return initialState;
    },
  },
});

export const {
  resetAction,
  plusProduct,
  deleteProduct,
  minusProduct,
  clearBasket,
  setBasket,
} = basketDataSlice.actions;
export default basketDataSlice.reducer;
