import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Restaraunt, Stock} from '../API';

interface UserState {
  token: string;
  user_id: string;
  phone: string;
  surname: string;
  name: string;
  last_name: string;
  images: ImageMap;
  firebase_token: string;
  shops: Array<Restaraunt>;
  activeShop: string;
  stocks: Array<Stock>;
}

export type ImageMap = Record<string, string>;

const initialState = {
  name: '',
  phone: '',
  last_name: '',
  surname: '',
  user_id: '',
  token: '',
  images: {},
  firebase_token: '',
  activeShop: '',
  shops: Array(5).fill({
    id: '',
    address: '',
    phone: '',
    name: '',
    delivery: {},
    workHours: {},
    recommendations: [],
    outOfStock: [],
    coords: {lat: 0, lan: 0},
  }),
  stocks: Array(5).fill({
    id: '',
    name: '',
    image: '',
    description: '',
    productId: '',
  }),
} as UserState;

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<UserState>) {
      const {
        token = '',
        user_id,
        phone,
        surname,
        name,
        last_name,
      } = action.payload;
      state.token = token;
      state.user_id = user_id;
      state.phone = phone;
      state.surname = surname;
      state.name = name;
      state.last_name = last_name;
    },
    setActiveShop(state, action: PayloadAction<string>) {
      state.activeShop = action.payload;
    },

    setImageUrl(state, action: PayloadAction<{ref: string; url: string}>) {
      state.images[action.payload.ref] = action.payload.url;
    },
    setFirebaseToken(state, action: PayloadAction<string>) {
      state.firebase_token = action.payload || '';
    },
    setShops(state, action: PayloadAction<Array<Restaraunt>>) {
      state.shops = action.payload;
    },
    setStocks(state, action: PayloadAction<Array<Stock>>) {
      state.stocks = action.payload;
    },
    // setData(
    //   state,
    //   action: PayloadAction<Pick<UserState, 'surname' | 'name' | 'last_name'>>,
    // ) {
    //   const {surname, name, last_name} = action.payload;
    //   state.surname = surname;
    //   state.name = name;
    //   state.last_name = last_name;
    // },
    // setPhone(state, action: PayloadAction<Pick<UserState, 'phone'>>) {
    //   const {phone} = action.payload;
    //   state.phone = phone;
    // },
    resetAction() {
      return initialState;
    },
  },
});

export const {
  setActiveShop,
  setAuthData,
  resetAction,
  setImageUrl,
  setFirebaseToken,
  setShops,
  setStocks,
} = dataSlice.actions;
export default dataSlice.reducer;
