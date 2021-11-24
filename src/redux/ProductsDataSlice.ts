import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BasketItem} from './BasketDataReducer';
import {Address} from '../API';

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
  productOrder?: number;
}

export interface Category {
  id: string;
  name: string;
  fire: boolean;
  order: number;
}

export type OrderPaymentType = 'CASH' | 'CARD' | 'KASPI';
export type OrderDeliveryType = 'PICKUP' | 'DELIVERY';

export type OrderStatus =
  | 'IS_NEW' //оформлен
  | 'PROCESSING' //принят в обработку
  | 'COOKING' //готовим
  | 'DELIVER' //Курьер в пути
  | 'SUCCESS' //Заказ успешно доставлен или успешно получен
  | 'CANCELLED' //Отменен
  | 'READY'; //готово к выдаче

export interface Order {
  dateTimestamp?: number; //дата создания заказа, по факту совпадает с первой из статуса но нужна в виде таймстампа
  id: string; //внутренний идшник для базы
  currentStatus: OrderStatus;
  public_id: string; //внешний идшник для пользователя
  payment_type: OrderPaymentType; //тип оплаты
  products: Array<BasketItem>; //список продуктов(внутри объект продукта и количество)
  delivery_type: OrderDeliveryType; //тип доставки
  active: boolean; //является ли этот заказ активным (выводить его в профиле)
  address?: Address; //адрес доставки (если OrderDeliveryType === DELIVERY)
  restaurant: string; //как то поформатированный адрес ресторана
  restaurant_id: string; //ИдРесторана
  sdacha?: number; //сдача (если OrderPaymentType === CASH)
  statuses: Array<{status: OrderStatus; time: string}>;
  //история статусов,грубо говоря список статусов и времени. если что то не произошло,
  //то время пустое, иначе пишем там часы и минуты
  mark: number; //оценка (0-5)
  commentary: string; //комментарий
  user_id?: string; //ид юзера, который заказал
  price: number; //Итоговая цена
  user_name: string;
  user_phone: string;
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
