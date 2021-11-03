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
        //если есть такой элемент
        let item = state.basket.filter(
          obj => obj.item.id === action.payload.id,
        )[0]; //берем его
        let newList = state.basket.filter(
          obj => obj.item.id !== action.payload.id,
        ); //удаляем его из списка
        let newItem = {
          count: item.count + 1,
          item: item.item,
        }; //увеличиваем количество
        newList.push(newItem); //кладем в список
        state.basket = [...newList];
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
        let item = state.basket.filter(
          obj => obj.item.id === action.payload.id,
        )[0]; //берем его
        let newList = state.basket.filter(
          obj => obj.item.id !== action.payload.id,
        ); //удаляем его из списка
        let newItem = {
          count: item.count - 1,
          item: item.item,
        }; //уменьшаем количество
        newList.push(newItem); //кладем в список
        state.basket = [...newList];
      }
    },
    deleteProduct(state, action: PayloadAction<Product>) {
      state.basket = state.basket.filter(
        obj => obj.item.id !== action.payload.id,
      );
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
} = basketDataSlice.actions;
export default basketDataSlice.reducer;
